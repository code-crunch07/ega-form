import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminRefundsPage() {
  let refunds = await prisma.refund.findMany({
    include: {
      application: {
        include: {
          user: {
            include: { profile: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (refunds.length === 0) {
    const sampleApp = await prisma.application.findFirst();
    if (sampleApp) {
      await prisma.refund.createMany({
        data: [
          { invoiceNumber: "INV-2026-042", applicationId: sampleApp.id, amount: 1500.00, status: "Pending", reason: "Application Withdrawn", details: "I have decided to enroll in a different institution." },
          { invoiceNumber: "INV-2026-015", applicationId: sampleApp.id, amount: 50.00, status: "Approved", reason: "Duplicate Payment", details: "Accidentally paid the application fee twice due to a browser glitch." },
          { invoiceNumber: "INV-2026-088", applicationId: sampleApp.id, amount: 3500.00, status: "Rejected", reason: "Past Refund Deadline", details: "Requesting a refund for semester tuition." },
        ]
      });
      refunds = await prisma.refund.findMany({
        include: {
          application: {
            include: {
              user: {
                include: { profile: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Refund Requests</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage and process applicant refund requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search refunds..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Refund ID</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant / Invoice</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Request Date</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                  No refund requests found in the database.
                </TableCell>
              </TableRow>
            ) : (
              refunds.map((ref) => {
                const applicantName = ref.application?.user?.profile 
                  ? `${ref.application.user.profile.firstName || ''} ${ref.application.user.profile.lastName || ''}`.trim()
                  : ref.application?.user?.name || "Unknown Applicant";

                return (
                  <TableRow key={ref.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                    <TableCell className="py-3 px-6">
                      <Link href={`/admin/refunds/${ref.id}`} className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {ref.id.toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{applicantName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 font-mono">{ref.invoiceNumber}</p>
                    </TableCell>
                    <TableCell className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                      ${ref.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{new Date(ref.createdAt).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      {ref.status === "Approved" && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Approved</Badge>}
                      {ref.status === "Pending" && <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 shadow-sm px-2.5 py-0.5">Pending Review</Badge>}
                      {ref.status === "Rejected" && <Badge variant="destructive" className="shadow-sm px-2.5 py-0.5">Rejected</Badge>}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        {ref.status === "Pending" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg" title="Process Refund">
                            <RotateCcw size={16} />
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Link href={`/admin/refunds/${ref.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
