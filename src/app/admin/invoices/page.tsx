import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal, Eye, FileText, Send } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminInvoicesPage() {
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

  const invoices = payments.map(payment => {
    const applicantName = payment.application?.user?.profile 
      ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
      : payment.application?.user?.name || "Unknown Applicant";

    const issueDate = new Date(payment.createdAt);
    const dueDate = new Date(payment.createdAt);
    dueDate.setDate(dueDate.getDate() + 30);

    return {
      id: payment.id, // we map invoice id to payment id so links match!
      number: payment.invoiceNumber,
      applicant: applicantName,
      amount: payment.amount,
      issueDate: issueDate.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      status: payment.status === "Paid" ? "Paid" : (new Date() > dueDate ? "Overdue" : "Unpaid"),
      type: "Application Fee"
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Invoices</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage billing, issue invoices, and track outstanding balances.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search invoices..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <Button className="h-10 rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
            <Plus size={18} />
            <span>Generate Invoice</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Invoice #</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant / Type</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Issue & Due Date</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-neutral-500">
                  No invoices found in the database.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <TableCell className="py-3 px-6">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      {inv.number}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{inv.applicant}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                      <FileText size={12} /> {inv.type}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                    ${inv.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{inv.issueDate}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Due: {inv.dueDate}</p>
                  </TableCell>
                  <TableCell className="py-3">
                    {inv.status === "Paid" && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Paid</Badge>}
                    {inv.status === "Unpaid" && <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 shadow-sm px-2.5 py-0.5">Unpaid</Badge>}
                    {inv.status === "Overdue" && <Badge variant="destructive" className="shadow-sm px-2.5 py-0.5">Overdue</Badge>}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {inv.status !== "Paid" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Send Reminder">
                          <Send size={16} />
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Link href={`/admin/invoices/${inv.id}`}>
                          <Eye size={16} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                        <MoreHorizontal size={16} />
                      </Button>
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
