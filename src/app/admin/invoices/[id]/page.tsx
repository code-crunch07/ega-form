import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CreditCard, 
  MessageSquare, 
  MoreHorizontal,
  Download,
  Send,
  User,
  Printer
} from "lucide-react";
import { notFound } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const INVOICES = [
  { id: "inv_1", number: "INV-2026-001", applicant: "John Smith", email: "john@example.com", amount: 1500.00, issueDate: "2026-06-15", dueDate: "2026-07-15", status: "Unpaid", type: "Tuition Deposit", notes: "First semester deposit for BSc Information Technology." },
  { id: "inv_2", number: "INV-2026-002", applicant: "Emily Chen", email: "emily@example.com", amount: 50.00, issueDate: "2026-07-01", dueDate: "2026-07-15", status: "Paid", type: "Application Fee", notes: "Non-refundable application processing fee." },
  { id: "inv_3", number: "INV-2026-003", applicant: "Michael Johnson", email: "michael@example.com", amount: 3500.00, issueDate: "2026-05-20", dueDate: "2026-06-20", status: "Overdue", type: "Semester Tuition", notes: "Fall 2026 full tuition." },
];

export default async function InvoiceDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const invoiceId = resolvedParams.id;

  const invoice = INVOICES.find(i => i.id === invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Detail Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                {invoice.number}
              </span>
              {invoice.status === "Paid" && <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Paid</Badge>}
              {invoice.status === "Unpaid" && <Badge className="bg-amber-50 text-amber-700 border-none px-2.5 font-semibold shadow-2xs">Unpaid</Badge>}
              {invoice.status === "Overdue" && <Badge variant="destructive" className="border-none px-2.5 font-semibold shadow-2xs">Overdue</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
              ${invoice.amount.toFixed(2)} 
              <span className="text-lg font-medium text-neutral-400">USD</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-neutral-400" />
                {invoice.applicant}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <FileText size={15} className="text-neutral-400" />
                {invoice.type}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            {invoice.status !== "Paid" && (
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                <Send size={16} /> Send Reminder
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
                <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
                  <Download size={15} /> Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
                  <Printer size={15} /> Print Invoice
                </DropdownMenuItem>
                {invoice.status !== "Paid" && (
                  <>
                    <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
                    <DropdownMenuItem className="gap-2 text-emerald-600 font-medium">
                      <CreditCard size={15} /> Mark as Paid (Manual)
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileText size={16}/> Overview</TabsTrigger>
          <TabsTrigger value="payments" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CreditCard size={16}/> Payment History</TabsTrigger>
          <TabsTrigger value="communications" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MessageSquare size={16}/> Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Date Issued</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{invoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Due Date</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{invoice.dueDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Applicant / Payer</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{invoice.applicant} ({invoice.email})</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Notes / Memo</p>
                <p className="font-medium text-sm text-neutral-700 mt-2 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">{invoice.notes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Payment Attempts & Successes</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400 mt-1">Transactions linked to this invoice.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {invoice.status === "Paid" ? (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Paid in Full</p>
                    <p className="text-xs font-medium text-emerald-600/70 dark:text-emerald-500 mt-0.5">Stripe Gateway • {invoice.dueDate}</p>
                  </div>
                  <p className="font-bold text-sm text-emerald-800 dark:text-emerald-400">${invoice.amount.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No successful payments recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Billing Communications</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-l-2 border-indigo-500 pl-4 py-1">
                  <p className="text-xs text-neutral-400 font-mono mb-1">{invoice.issueDate}</p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Invoice Generated & Sent</p>
                  <p className="text-xs text-neutral-500 mt-1">Automated email sent to {invoice.email}</p>
                </div>
                {invoice.status === "Overdue" && (
                  <div className="border-l-2 border-red-500 pl-4 py-1">
                    <p className="text-xs text-neutral-400 font-mono mb-1">{invoice.dueDate}</p>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Payment Reminder Sent</p>
                    <p className="text-xs text-neutral-500 mt-1">Automated overdue notice sent.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
