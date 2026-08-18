import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ShieldAlert, 
  Edit,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EditFeeDialog } from "../edit-fee-dialog";
import { FeeActionsDropdown } from "../fee-actions-dropdown";

export default async function FeeDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const feeId = resolvedParams.id;

  const fee = await prisma.fee.findUnique({
    where: { id: feeId }
  });

  if (!fee) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/fees">
            <ArrowLeft size={15} /> Back to Fee Structures
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                FEE-{fee.id.slice(-6).toUpperCase()}
              </span>
              {fee.status === "Active" ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </Badge>
              ) : fee.status === "Draft" ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Draft
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                  {fee.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-3">
              {fee.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <DollarSign size={15} className="text-slate-400" />
                ${fee.amount.toFixed(2)} {fee.currency}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Settings size={15} className="text-slate-400" />
                Type: {fee.type}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-500">
                Applies To: {fee.appliesTo}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <EditFeeDialog 
              fee={fee} 
              trigger={
                <Button className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all text-xs">
                  <Edit size={15} /> Edit Rule
                </Button>
              }
            />
            <FeeActionsDropdown fee={fee} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="config" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Settings size={15}/> Pricing Configuration</TabsTrigger>
          <TabsTrigger value="exceptions" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><ShieldAlert size={15}/> Applicability Scope</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Rule Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Charge Amount</p>
                  <p className="font-bold text-sm text-[#252D65] mt-1">${fee.amount.toFixed(2)} {fee.currency}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Fee Category</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{fee.type}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Rule Status</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{fee.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Applicable Audience & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Target Audience</p>
                <p className="font-bold text-sm text-slate-900 mt-1">{fee.appliesTo}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
