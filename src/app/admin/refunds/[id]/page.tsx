import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  FileText, 
  CheckCircle, 
  XCircle, 
  User, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { RefundActionsDropdown } from "../refund-actions-dropdown";
import { updateRefundStatus } from "@/app/actions/admin";

export default async function RefundDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const refundId = resolvedParams.id;

  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
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

  if (!refund) {
    notFound();
  }

  const applicantName = refund.application?.user?.profile 
    ? `${refund.application.user.profile.firstName || ''} ${refund.application.user.profile.lastName || ''}`.trim()
    : refund.application?.user?.name || "Unknown Applicant";

  const email = refund.application?.user?.email || "No email";
  const requestDate = new Date(refund.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/refunds">
            <ArrowLeft size={15} /> Back to Refund Requests
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                CASE {refund.id.toUpperCase().slice(0, 16)}
              </span>
              {refund.status === "Approved" && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Approved & Processed
                </Badge>
              )}
              {refund.status === "Pending" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Pending Review
                </Badge>
              )}
              {refund.status === "Rejected" && (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                  Rejected
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-3">
              ${refund.amount.toFixed(2)} 
              <span className="text-sm font-semibold text-slate-400">USD Refund Request</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <User size={15} className="text-slate-400" />
                {applicantName}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 font-mono">
                <FileText size={15} className="text-slate-400" />
                {refund.invoiceNumber}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={15} className="text-slate-400" />
                Filed: {requestDate}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            {refund.status === "Pending" && (
              <div className="flex items-center gap-2">
                <form action={async () => {
                  "use server";
                  await updateRefundStatus(refund.id, "Approved");
                }}>
                  <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all text-xs">
                    <CheckCircle size={15} /> Approve
                  </Button>
                </form>
                <form action={async () => {
                  "use server";
                  await updateRefundStatus(refund.id, "Rejected");
                }}>
                  <Button type="submit" variant="outline" className="gap-2 text-rose-600 hover:bg-rose-50 border-rose-200 font-bold rounded-xl shadow-xs px-5 h-11 transition-all text-xs">
                    <XCircle size={15} /> Reject
                  </Button>
                </form>
              </div>
            )}
            
            <RefundActionsDropdown refund={{
              id: refund.id,
              invoiceNumber: refund.invoiceNumber,
              status: refund.status,
              applicationId: refund.applicationId
            }} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileText size={15}/> Request Justification</TabsTrigger>
          <TabsTrigger value="applicant" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><User size={15}/> Applicant Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Reason for Refund Claim</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Stated Reason</p>
                <p className="font-bold text-sm text-slate-900 mt-1">{refund.reason || "Fee Refund"}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Applicant Details / Statement</p>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{refund.details || "No additional explanation provided."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicant" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Applicant Identity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Full Name</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{applicantName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Email Address</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Original Invoice Reference</p>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-1">{refund.invoiceNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
