import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, ExternalLink, Filter, MoreHorizontal, Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Payments Ledger</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Track application fees, program deposits, and invoice statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <Input 
              placeholder="Search invoice or applicant..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-emerald-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-2">
            <Download size={16} className="text-neutral-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Invoice #</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Gateway</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-neutral-500">
                  No payments found in the database.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const applicantName = payment.application?.user?.profile 
                  ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
                  : payment.application?.user?.name || "Unknown Applicant";

                return (
                  <TableRow key={payment.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                    <TableCell className="py-3 px-6">
                      <span className="font-mono font-bold text-sm text-neutral-700 dark:text-neutral-300 bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700">
                        {payment.invoiceNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 font-bold text-sm">
                      {applicantName}
                    </TableCell>
                    <TableCell className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">{payment.gateway}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{payment.createdAt.toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      {payment.status === "Paid" && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Paid</Badge>}
                      {payment.status === "Pending" && <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 shadow-sm px-2.5 py-0.5">Pending</Badge>}
                      {payment.status === "Failed" && <Badge variant="destructive" className="shadow-sm px-2.5 py-0.5">Failed</Badge>}
                      {payment.status === "Refunded" && <Badge variant="secondary" className="shadow-sm px-2.5 py-0.5">Refunded</Badge>}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                          <Link href={`/admin/payments/${payment.id}`}>
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
