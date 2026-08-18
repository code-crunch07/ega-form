import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileEdit, 
  Settings, 
  History, 
  Save, 
  ArrowLeft,
  Copy
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updateTemplate } from "@/app/actions/admin";
import { TemplateActionsDropdown } from "../template-actions-dropdown";

export default async function TemplateDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const templateId = resolvedParams.id;

  const template = await prisma.template.findUnique({
    where: { id: templateId }
  });

  if (!template) {
    notFound();
  }

  const updateAction = async (formData: FormData) => {
    "use server";
    await updateTemplate(template.id, formData);
  };

  return (
    <form action={updateAction} className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/templates">
            <ArrowLeft size={15} /> Back to Templates
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                TPL-{template.id.slice(-6).toUpperCase()}
              </span>
              {template.status === "Active" ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Draft
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              {template.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                Trigger: {template.trigger}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                Channel: {template.channel}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 text-slate-500">
                Last modified: {new Date(template.updatedAt).toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <Button type="submit" className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all text-xs">
              <Save size={15} /> Save Changes
            </Button>
            <TemplateActionsDropdown template={template} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="editor" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileEdit size={15}/> Content Editor</TabsTrigger>
          <TabsTrigger value="settings" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Settings size={15}/> Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="m-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Template Subject & Body</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Template Title</label>
                  <Input name="name" defaultValue={template.name} className="rounded-xl border-slate-200" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Subject Line</label>
                  <Input name="subject" defaultValue={template.subject || ""} className="rounded-xl border-slate-200 font-medium" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Body Content</label>
                  <Textarea name="content" defaultValue={template.content || ""} rows={12} className="rounded-xl border-slate-200 font-mono text-xs" required />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs h-fit">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Dynamic Variables</CardTitle>
                <CardDescription className="text-xs">Click copy to insert into template body.</CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-2 text-xs">
                {["{{first_name}}", "{{last_name}}", "{{application_id}}", "{{program_name}}", "{{portal_link}}"].map((variable) => (
                  <div key={variable} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between font-mono">
                    <span className="text-slate-700 font-semibold">{variable}</span>
                    <Badge variant="outline" className="text-[10px] bg-white">Dynamic</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs max-w-xl">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Trigger & Status Setup</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Trigger Event</label>
                <select name="trigger" defaultValue={template.trigger} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800">
                  <option value="Manual">Manual</option>
                  <option value="On Application Submission">On Application Submission</option>
                  <option value="On Status Change -> Offer">On Status Change - Offer</option>
                  <option value="On Status Change -> Rejected">On Status Change - Rejected</option>
                  <option value="Manual / Scheduled">Manual / Scheduled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Channel</label>
                <select name="channel" defaultValue={template.channel} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800">
                  <option value="Email">Email</option>
                  <option value="Email + PDF">Email + PDF</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Publication Status</label>
                <select name="status" defaultValue={template.status} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800">
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
