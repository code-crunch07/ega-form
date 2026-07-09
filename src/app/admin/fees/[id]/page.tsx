import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ShieldAlert, 
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Detail Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                FEE-{fee.id.slice(-4).toUpperCase()}
              </span>
              {fee.status === "Active" ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Active</Badge>
              ) : (
                <Badge className="bg-neutral-100 text-neutral-600 border-none px-2.5 font-semibold shadow-2xs">{fee.status}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
              {fee.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
                <DollarSign size={15} className="text-neutral-400" />
                ${fee.amount.toFixed(2)} {fee.currency}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Settings size={15} className="text-neutral-400" />
                Type: {fee.type}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
              <Edit size={16} /> Edit Rule
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
                <DropdownMenuItem className="gap-2 text-red-600 font-medium">
                  <Trash2 size={15} /> Delete Fee Rule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="config" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Settings size={16}/> Configuration</TabsTrigger>
          <TabsTrigger value="exceptions" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><ShieldAlert size={16}/> Exceptions & Waivers</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Base Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Fee Amount</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">${fee.amount.toFixed(2)} {fee.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Target Group</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{fee.appliesTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Fee Waivers & Exceptions</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400 mt-1">Conditions where this fee does not apply.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No waivers or exceptions are configured for this fee rule.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
