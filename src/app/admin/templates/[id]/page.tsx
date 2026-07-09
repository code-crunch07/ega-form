import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileEdit, 
  Settings, 
  History, 
  Save,
  Send,
  Wand2,
  MoreHorizontal
} from "lucide-react";
import { notFound } from "next/navigation";

const TEMPLATES = [
  { id: "tpl_1", name: "Application Received", trigger: "On Application Submission", channel: "Email", status: "Active", lastUpdated: "2026-06-15", subject: "We've received your application - {{application_id}}", content: "Dear {{first_name}},\n\nThank you for applying to {{program_name}}. We have successfully received your application.\n\nYou can track your application status by logging into your portal.\n\nBest,\nAdmissions Team" },
  { id: "tpl_2", name: "Missing Documents Reminder", trigger: "Manual / Scheduled", channel: "Email", status: "Active", lastUpdated: "2026-06-10", subject: "Action Required: Missing Documents", content: "Hi {{first_name}},\n\nWe are reviewing your application for {{program_name}} but noticed some required documents are missing:\n\n{{missing_documents_list}}\n\nPlease upload these as soon as possible." },
  { id: "tpl_3", name: "Offer Letter (Unconditional)", trigger: "On Status Change -> Offer", channel: "Email + PDF", status: "Active", lastUpdated: "2026-05-22", subject: "Offer of Admission", content: "Congratulations {{first_name}}!" },
  { id: "tpl_4", name: "Interview Invitation", trigger: "Manual", channel: "Email", status: "Draft", lastUpdated: "2026-07-01", subject: "Interview Invitation", content: "Dear {{first_name}},\n\nWe would like to invite you for an interview." },
];

export default async function TemplateDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const templateId = resolvedParams.id;

  const template = TEMPLATES.find(t => t.id === templateId);

  if (!template) {
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
                {template.id.toUpperCase()}
              </span>
              {template.status === "Active" ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Active</Badge>
              ) : (
                <Badge variant="outline" className="border-none px-2.5 font-semibold shadow-2xs">Draft</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
              {template.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                Trigger: {template.trigger}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                Channel: {template.channel}
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <Button variant="outline" className="gap-2 h-11 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs px-5">
              <Send size={16} /> Send Test
            </Button>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="editor" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileEdit size={16}/> Content Editor</TabsTrigger>
          <TabsTrigger value="settings" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Settings size={16}/> Settings</TabsTrigger>
          <TabsTrigger value="history" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><History size={16}/> Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="m-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-neutral-850">Email Template Builder</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40">
                  <Wand2 size={14} /> AI Assist
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Subject Line</label>
                  <Input defaultValue={template.subject} className="font-medium bg-neutral-50 dark:bg-neutral-900/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Message Body</label>
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-1 p-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><span className="font-bold">B</span></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><span className="italic">I</span></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><span className="underline">U</span></Button>
                      <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
                      <Button variant="outline" size="sm" className="h-8 text-xs">Insert Variable</Button>
                    </div>
                    <textarea 
                      className="w-full h-64 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed" 
                      defaultValue={template.content}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden h-fit">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850">Available Variables</CardTitle>
                <CardDescription className="text-xs">Click to copy variables.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {['{{first_name}}', '{{last_name}}', '{{application_id}}', '{{program_name}}', '{{status}}', '{{login_link}}'].map(v => (
                    <div key={v} className="flex justify-between items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer group">
                      <code className="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">{v}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Configure from email address, bcc rules, and attachment settings.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Version History</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Track changes to this template over time.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
