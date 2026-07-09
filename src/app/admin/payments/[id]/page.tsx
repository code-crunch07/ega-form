import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Receipt, 
  Activity, 
  FileText,
  MoreHorizontal,
  Download,
  RotateCcw,
  User,
  Building
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default async function PaymentDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paymentId = resolvedParams.id;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      application: {
        include: {
          user: {
            include: { profile: true }
          }
        }
      }
    }
  });

  if (!payment) {
    notFound();
  }

  const applicantName = payment.application?.user?.profile 
    ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
    : payment.application?.user?.name || "Unknown Applicant";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Detail Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                INVOICE {payment.invoiceNumber}
              </span>
              {payment.status === "Paid" && <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Paid in Full</Badge>}
              {payment.status === "Pending" && <Badge className="bg-amber-50 text-amber-700 border-none px-2.5 font-semibold shadow-2xs">Payment Pending</Badge>}
              {payment.status === "Failed" && <Badge variant="destructive" className="border-none px-2.5 font-semibold shadow-2xs">Payment Failed</Badge>}
              {payment.status === "Refunded" && <Badge className="bg-neutral-200 text-neutral-800 border-none px-2.5 font-semibold shadow-2xs dark:bg-neutral-800 dark:text-neutral-300">Refunded</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
              ${payment.amount.toFixed(2)} 
              <span className="text-lg font-medium text-neutral-400">USD</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-neutral-400" />
                {applicantName}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <CreditCard size={15} className="text-neutral-400" />
                Gateway: <span className="capitalize">{payment.gateway}</span>
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5 text-neutral-400">
                Created: {payment.createdAt.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            {payment.status === "Paid" && (
              <Button className="gap-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                <Download size={16} /> Download Receipt
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
                  <RotateCcw size={15} /> Issue Refund
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
                  <Activity size={15} /> Refresh Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Receipt size={16}/> Payment Details</TabsTrigger>
          <TabsTrigger value="application" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileText size={16}/> Related Application</TabsTrigger>
          <TabsTrigger value="logs" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Activity size={16}/> Gateway Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Gateway</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1 capitalize">{payment.gateway}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Transaction ID</p>
                  <p className="font-mono text-sm text-neutral-700 mt-1">{payment.id.substring(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Last Updated</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{payment.updatedAt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Receipt URL</p>
                  {payment.receiptUrl ? (
                    <a href={payment.receiptUrl} target="_blank" rel="noreferrer" className="font-semibold text-sm text-blue-600 hover:underline mt-1 block truncate">View Receipt</a>
                  ) : (
                    <p className="font-semibold text-sm text-neutral-500 mt-1">Not available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-neutral-850">Application Reference</CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400 mt-1">The application this payment is associated with.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/applications/${payment.applicationId}`}>View Application</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {payment.application ? (
                <div className="flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-slate-50/30 dark:bg-neutral-900/30">
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Applicant</p>
                    <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{applicantName}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{payment.application.user?.email}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Programme</p>
                    <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                      {payment.application.programmeId ? payment.application.programmeId : "Unspecified"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Intake: {payment.application.intake ? payment.application.intake : "Unspecified"}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500 mb-1">Status</p>
                    <Badge variant="outline" className="mt-0.5">{payment.application.status}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Application details not found or deleted.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Gateway Webhook Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4 py-1">
                  <p className="text-xs text-neutral-400 font-mono mb-1">{payment.updatedAt.toLocaleString()}</p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">payment_intent.succeeded</p>
                  <p className="text-xs text-neutral-500 mt-1">Payment processed successfully via {payment.gateway}</p>
                </div>
                <div className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 py-1">
                  <p className="text-xs text-neutral-400 font-mono mb-1">{payment.createdAt.toLocaleString()}</p>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">payment_intent.created</p>
                  <p className="text-xs text-neutral-500 mt-1">Invoice generated and sent to customer.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
