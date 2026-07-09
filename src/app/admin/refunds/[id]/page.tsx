import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  FileText, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  User,
  AlertCircle
} from "lucide-react";
import { notFound } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { prisma } from "@/lib/prisma";
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
  const requestDate = new Date(refund.createdAt).toLocaleDateString();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Detail Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                {refund.id.toUpperCase()}
              </span>
              {refund.status === "Approved" && <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Approved & Processed</Badge>}
              {refund.status === "Pending" && <Badge className="bg-amber-50 text-amber-700 border-none px-2.5 font-semibold shadow-2xs">Pending Review</Badge>}
              {refund.status === "Rejected" && <Badge variant="destructive" className="border-none px-2.5 font-semibold shadow-2xs">Rejected</Badge>}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
              ${refund.amount.toFixed(2)} 
              <span className="text-lg font-medium text-neutral-400">USD Refund Request</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-neutral-400" />
                {applicantName}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5 font-mono">
                <FileText size={15} className="text-neutral-400" />
                {refund.invoiceNumber}
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
                  <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                    <CheckCircle size={16} /> Approve
                  </Button>
                </form>
                <form action={async () => {
                  "use server";
                  await updateRefundStatus(refund.id, "Rejected");
                }}>
                  <Button type="submit" variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                    <XCircle size={16} /> Reject
                  </Button>
                </form>
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
                <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
                  <AlertCircle size={15} /> Request More Info
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><RotateCcw size={16}/> Overview</TabsTrigger>
          <TabsTrigger value="approval" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CheckCircle size={16}/> Approval Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Request Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Date Requested</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{requestDate}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Applicant Email</p>
                  <p className="font-semibold text-sm text-blue-600 mt-1">{email}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Reason for Refund</p>
                  <Badge variant="outline" className="mt-2 text-sm px-3 py-1 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {refund.reason}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Applicant Explanation</p>
                  <p className="font-medium text-sm text-neutral-700 mt-2 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed">
                    "{refund.details}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Approval Workflow Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200"><CheckCircle size={16} /></div>
                  <div>
                    <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Request Submitted</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{requestDate} by Applicant</p>
                  </div>
                </div>
                
                {refund.status === "Approved" && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200"><CheckCircle size={16} /></div>
                    <div>
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Finance Approval</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Approved by Finance Team. Processing via Gateway.</p>
                    </div>
                  </div>
                )}
                
                {refund.status === "Rejected" && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-red-100 text-red-600 rounded-full p-1 border border-red-200"><XCircle size={16} /></div>
                    <div>
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Request Rejected</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Rejected by Finance Team. Policy violation.</p>
                    </div>
                  </div>
                )}
                
                {refund.status === "Pending" && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-amber-100 text-amber-600 rounded-full p-1 border border-amber-200"><AlertCircle size={16} /></div>
                    <div>
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Pending Finance Review</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Awaiting action from a finance officer.</p>
                    </div>
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
