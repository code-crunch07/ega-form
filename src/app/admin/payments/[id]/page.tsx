import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Receipt, 
  User, 
  ArrowLeft,
  Calendar,
  Building,
  CheckCircle2,
  FileText
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PaymentActionsDropdown } from "../payment-actions-dropdown";

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/payments">
            <ArrowLeft size={15} /> Back to Payments Ledger
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                INVOICE {payment.invoiceNumber}
              </span>
              {payment.status === "Paid" && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Paid in Full
                </Badge>
              )}
              {payment.status === "Pending" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Payment Pending
                </Badge>
              )}
              {payment.status === "Failed" && (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                  Payment Failed
                </Badge>
              )}
              {payment.status === "Refunded" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Refunded
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-3">
              ${payment.amount.toFixed(2)} 
              <span className="text-sm font-semibold text-slate-400">USD</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <User size={15} className="text-slate-400" />
                {applicantName}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CreditCard size={15} className="text-slate-400" />
                Gateway: <span className="capitalize">{payment.gateway}</span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-500 font-mono">
                {new Date(payment.createdAt).toLocaleString('en-GB')}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            {payment.applicationId && (
              <Button asChild className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all text-xs">
                <Link href={`/admin/applications/${payment.applicationId}`}>
                  <FileText size={15} /> View Application
                </Link>
              </Button>
            )}
            
            <PaymentActionsDropdown payment={{
              id: payment.id,
              invoiceNumber: payment.invoiceNumber,
              status: payment.status,
              applicationId: payment.applicationId
            }} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Receipt size={15}/> Transaction Receipt</TabsTrigger>
          <TabsTrigger value="payer" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><User size={15}/> Payer Information</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Invoice Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Invoice Reference</p>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-1">{payment.invoiceNumber}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Payment Provider</p>
                  <p className="font-bold text-sm text-slate-900 mt-1 capitalize">{payment.gateway}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Billed</p>
                  <p className="font-bold text-sm text-[#252D65] mt-1">${payment.amount.toFixed(2)} USD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payer" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Applicant & Account Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Full Name</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{applicantName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Email Address</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{payment.application?.user?.email || "N/A"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Application Number</p>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-1">{payment.application?.appNumber || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
