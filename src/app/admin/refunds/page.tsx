import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RefundsFilters } from "./refunds-filters";
import { RefundActionsDropdown } from "./refund-actions-dropdown";

export default async function AdminRefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { reason: { contains: search, mode: "insensitive" } },
      { details: { contains: search, mode: "insensitive" } },
      { application: { appNumber: { contains: search, mode: "insensitive" } } },
      { application: { user: { email: { contains: search, mode: "insensitive" } } } },
      { application: { user: { name: { contains: search, mode: "insensitive" } } } },
      { application: { user: { profile: { firstName: { contains: search, mode: "insensitive" } } } } },
      { application: { user: { profile: { lastName: { contains: search, mode: "insensitive" } } } } },
    ];
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  let refunds = await prisma.refund.findMany({
    where: whereClause,
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

  if (refunds.length === 0 && !search && !status) {
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
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Refund Requests</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage and process applicant refund requests, adjustments, and claims.</p>
        </div>
      </div>

      <RefundsFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[180px]">Refund ID</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Applicant / Invoice</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Amount</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Reason</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Request Date</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-400 font-medium">
                  No refund requests found matching the search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              refunds.map((ref) => {
                const applicantName = ref.application?.user?.profile 
                  ? `${ref.application.user.profile.firstName || ''} ${ref.application.user.profile.lastName || ''}`.trim()
                  : ref.application?.user?.name || "Unknown Applicant";

                return (
                  <TableRow key={ref.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                    <TableCell className="py-3 px-6">
                      <Link href={`/admin/refunds/${ref.id}`} className="font-mono font-bold text-xs text-[#252D65] hover:text-[#1C224E] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {ref.id.toUpperCase().slice(0, 16)}...
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="font-bold text-xs text-slate-900">{applicantName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{ref.invoiceNumber}</p>
                    </TableCell>
                    <TableCell className="py-3 font-bold text-xs text-slate-900">
                      ${ref.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-xs font-semibold text-slate-700">{ref.reason || "Fee Refund"}</p>
                    </TableCell>
                    <TableCell className="py-3 text-xs text-slate-500 font-medium">
                      {new Date(ref.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-3">
                      {ref.status === "Approved" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Approved
                        </Badge>
                      )}
                      {ref.status === "Pending" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Review
                        </Badge>
                      )}
                      {ref.status === "Rejected" && (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          Rejected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg" title="View Case">
                          <Link href={`/admin/refunds/${ref.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <RefundActionsDropdown refund={{
                          id: ref.id,
                          invoiceNumber: ref.invoiceNumber,
                          status: ref.status,
                          applicationId: ref.applicationId
                        }} />
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
