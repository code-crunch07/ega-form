import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InvoicesFilters } from "./invoices-filters";
import { GenerateInvoiceDialog } from "./generate-invoice-dialog";
import { EditInvoiceDialog } from "./edit-invoice-dialog";
import { InvoiceActionsDropdown } from "./invoice-actions-dropdown";

export default async function AdminInvoicesPage({
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
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { application: { appNumber: { contains: search, mode: "insensitive" } } },
      { application: { user: { email: { contains: search, mode: "insensitive" } } } },
      { application: { user: { name: { contains: search, mode: "insensitive" } } } },
      { application: { user: { profile: { firstName: { contains: search, mode: "insensitive" } } } } },
      { application: { user: { profile: { lastName: { contains: search, mode: "insensitive" } } } } },
    ];
  }

  if (status === "Paid") {
    whereClause.status = "Paid";
  } else if (status === "Unpaid") {
    whereClause.status = { not: "Paid" };
  }

  const [payments, availableApplications] = await Promise.all([
    prisma.payment.findMany({
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
    }),
    prisma.application.findMany({
      select: {
        id: true,
        appNumber: true,
        programmeLevel: true,
        programmeId: true,
        user: {
          select: {
            name: true,
            email: true,
            profile: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  ]);

  const formattedAppOptions = availableApplications.map((app) => ({
    id: app.id,
    appNumber: app.appNumber,
    applicantName: app.user?.profile
      ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
      : app.user?.name || app.user?.email || "Student",
    programmeName: app.programmeLevel || app.programmeId
  }));

  const invoices = payments.map(payment => {
    const applicantName = payment.application?.user?.profile 
      ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
      : payment.application?.user?.name || "Unknown Applicant";

    const issueDate = new Date(payment.createdAt);
    const dueDate = new Date(payment.createdAt);
    dueDate.setDate(dueDate.getDate() + 30);

    const isOverdue = payment.status !== "Paid" && new Date() > dueDate;

    return {
      id: payment.id,
      number: payment.invoiceNumber,
      applicant: applicantName,
      email: payment.application?.user?.email,
      amount: payment.amount,
      issueDate: issueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueDate: dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: payment.status === "Paid" ? "Paid" : (isOverdue ? "Overdue" : "Unpaid"),
      type: "Application / Tuition Fee"
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Invoices</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage billing, issue invoices, and track outstanding balances.</p>
        </div>
        <div className="flex items-center gap-3">
          <GenerateInvoiceDialog applications={formattedAppOptions} />
        </div>
      </div>

      <InvoicesFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[160px]">Invoice #</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Applicant / Type</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Amount</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Issue & Due Date</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-400 font-medium">
                  No invoices found in the database matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-mono font-bold text-xs text-[#252D65] hover:text-[#1C224E] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {inv.number}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="font-bold text-xs text-slate-900">{inv.applicant}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <FileText size={11} className="text-slate-400" /> {inv.type}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 font-bold text-xs text-slate-900">
                    ${inv.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-xs font-semibold text-slate-700">{inv.issueDate}</p>
                    <p className="text-[11px] text-slate-400">Due: {inv.dueDate}</p>
                  </TableCell>
                  <TableCell className="py-3">
                    {inv.status === "Paid" && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Paid
                      </Badge>
                    )}
                    {inv.status === "Unpaid" && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Unpaid
                      </Badge>
                    )}
                    {inv.status === "Overdue" && (
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                        Overdue
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg" title="View Details">
                        <Link href={`/admin/invoices/${inv.id}`}>
                          <Eye size={16} />
                        </Link>
                      </Button>
                      <InvoiceActionsDropdown invoice={{
                        id: inv.id,
                        number: inv.number,
                        amount: inv.amount,
                        status: inv.status
                      }} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
