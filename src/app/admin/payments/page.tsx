import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { PaymentsFilters } from "./payments-filters";
import { PaymentActionsDropdown } from "./payment-actions-dropdown";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string, gateway?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;
  const gateway = resolvedSearchParams?.gateway;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
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

  if (gateway && gateway !== "all") {
    whereClause.gateway = { contains: gateway, mode: "insensitive" };
  }

  const payments = await prisma.payment.findMany({
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

  const exportData = payments.map((p) => {
    const applicantName = p.application?.user?.profile 
      ? `${p.application.user.profile.firstName || ''} ${p.application.user.profile.lastName || ''}`.trim()
      : p.application?.user?.name || "Unknown Applicant";
    const applicantEmail = p.application?.user?.email || "";

    return {
      invoiceNumber: p.invoiceNumber,
      applicantName,
      applicantEmail,
      amount: p.amount,
      gateway: p.gateway,
      date: new Date(p.createdAt).toLocaleDateString('en-GB'),
      status: p.status
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Payments Ledger</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track application fees, program deposits, and invoice settlement statuses.</p>
        </div>
      </div>

      <PaymentsFilters paymentsData={exportData} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[160px]">Invoice #</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Applicant</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Amount</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Gateway</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Date</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-400 font-medium">
                  No payments found matching the selected search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const applicantName = payment.application?.user?.profile 
                  ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
                  : payment.application?.user?.name || "Unknown Applicant";

                return (
                  <TableRow key={payment.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                    <TableCell className="py-3 px-6">
                      <Link href={`/admin/payments/${payment.id}`} className="font-mono font-bold text-xs text-[#252D65] hover:text-[#1C224E] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {payment.invoiceNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="font-bold text-xs text-slate-900">{applicantName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{payment.application?.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-bold text-xs text-slate-900">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-xs font-semibold text-slate-600 capitalize">{payment.gateway}</span>
                    </TableCell>
                    <TableCell className="py-3 text-xs text-slate-500 font-medium">
                      {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-3">
                      {payment.status === "Paid" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Paid
                        </Badge>
                      )}
                      {payment.status === "Pending" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending
                        </Badge>
                      )}
                      {payment.status === "Failed" && (
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          Failed
                        </Badge>
                      )}
                      {payment.status === "Refunded" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Refunded
                        </Badge>
                      )}
                      {!["Paid", "Pending", "Failed", "Refunded"].includes(payment.status) && (
                        <Badge variant="outline" className="text-[11px]">{payment.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg" title="View Receipt">
                          <Link href={`/admin/payments/${payment.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <PaymentActionsDropdown payment={{
                          id: payment.id,
                          invoiceNumber: payment.invoiceNumber,
                          status: payment.status,
                          applicationId: payment.applicationId
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
