import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, Key, Webhook, RefreshCw, CheckCircle, Database, CreditCard, Mail } from "lucide-react";

export default function AdminIntegrationsSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Connected Integrations</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage third-party services, payment gateways, and API keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Payment Gateways */}
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                <CreditCard size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-850">Payment Gateways</CardTitle>
                <CardDescription className="text-xs mt-0.5">Configure how applicants pay application and tuition fees.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center text-[#635BFF] font-bold text-lg">S</div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">Stripe <Badge className="bg-emerald-50 text-emerald-700 border-none">Connected</Badge></h3>
                    <p className="text-sm text-neutral-500 mt-1">Accepts all major credit cards globally.</p>
                  </div>
                </div>
                <Button variant="outline" className="border-neutral-200 dark:border-neutral-800 h-10 px-5 rounded-full flex items-center gap-2">
                  <SettingsIcon size={16} className="text-neutral-500" /> Manage Keys
                </Button>
              </div>
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#00457C]/10 flex items-center justify-center text-[#00457C] font-bold text-lg">P</div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">PayPal</h3>
                    <p className="text-sm text-neutral-500 mt-1">Alternative payment option for international students.</p>
                  </div>
                </div>
                <Button className="bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-black h-10 px-5 rounded-full flex items-center gap-2">
                  <Plug size={16} /> Connect Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email & Communication */}
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                <Mail size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-850">Email Service Provider</CardTitle>
                <CardDescription className="text-xs mt-0.5">SMTP setup for transactional emails.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 p-5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">SendGrid <Badge className="bg-emerald-50 text-emerald-700 border-none">Active</Badge></h3>
                  <p className="text-sm text-blue-700/70 dark:text-blue-300/70 mt-1">Handling 100% of outgoing system emails.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full h-10 px-4">
                  Test Connection
                </Button>
                <Button variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-white dark:bg-neutral-900 h-10 px-4 rounded-full">
                  Configure SMTP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer APIs */}
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                <Webhook size={20} />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-neutral-850">Developer APIs & Webhooks</CardTitle>
                <CardDescription className="text-xs mt-0.5">Connect to external CRMs or ERP systems.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
             <div className="text-center py-8">
               <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Key size={24} className="text-neutral-400" />
               </div>
               <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">No API Keys Generated</h3>
               <p className="text-neutral-500 mt-2 max-w-sm mx-auto text-sm">Generate an API key to securely allow external systems to read and write application data.</p>
               <Button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 h-11 shadow-sm">
                 Generate New API Key
               </Button>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
