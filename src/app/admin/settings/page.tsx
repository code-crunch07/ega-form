"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Mail, 
  Workflow, 
  CreditCard, 
  HardDrive, 
  Bell, 
  ShieldCheck, 
  Palette, 
  Key, 
  FileClock, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  Upload,
  RefreshCw,
  Copy
} from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states with sensible production defaults
  const [institutionName, setInstitutionName] = useState("EGA University & Global Academy");
  const [supportEmail, setSupportEmail] = useState("admissions@ega.edu");
  const [supportPhone, setSupportPhone] = useState("+1 (800) 555-0199");
  const [campusAddress, setCampusAddress] = useState("100 University Square, Boston, MA 02115");
  const [currency, setCurrency] = useState("USD");
  const [primaryColor, setPrimaryColor] = useState("#252D65");
  const [autoAssign, setAutoAssign] = useState(true);
  const [allowEdits, setAllowEdits] = useState(false);
  const [stripeLive, setStripeLive] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [logRetention, setLogRetention] = useState("90");

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }, 600);
  };

  const tabs = [
    { id: "institution", label: "Institution Details", icon: Building2 },
    { id: "email", label: "Email & SMTP", icon: Mail },
    { id: "workflow", label: "Workflow Rules", icon: Workflow },
    { id: "payments", label: "Payment Gateways", icon: CreditCard },
    { id: "storage", label: "Storage (S3/R2)", icon: HardDrive },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Roles", icon: ShieldCheck },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "api", label: "API Keys", icon: Key },
    { id: "audit", label: "Audit & Logs", icon: FileClock }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-2.5">
            System Settings
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure global admissions parameters, payment gateways, and system rules.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" /> Settings Saved!
            </span>
          )}
          <Button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="h-11 rounded-xl px-6 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="institution" className="w-full flex flex-col gap-6">
        {/* Responsive Horizontal Scroll Tabs */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <TabsList className="flex h-auto w-max bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 data-[state=active]:bg-[#252D65] data-[state=active]:text-white transition-all cursor-pointer whitespace-nowrap"
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab 1: Institution Details */}
        <TabsContent value="institution" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Institution Details</CardTitle>
              <CardDescription className="text-xs">General university identity and contact information for admissions communications.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Institution Official Name</Label>
                  <Input 
                    value={institutionName} 
                    onChange={(e) => setInstitutionName(e.target.value)} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800 font-medium" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Designated Learning Institution (DLI) Code</Label>
                  <Input defaultValue="O193958992" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Admissions Inquiries Email</Label>
                  <Input 
                    value={supportEmail} 
                    onChange={(e) => setSupportEmail(e.target.value)} 
                    type="email" 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Admissions Helpline Phone</Label>
                  <Input 
                    value={supportPhone} 
                    onChange={(e) => setSupportPhone(e.target.value)} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Main Campus Address</Label>
                <Input 
                  value={campusAddress} 
                  onChange={(e) => setCampusAddress(e.target.value)} 
                  className="h-11 rounded-xl border-slate-200 text-slate-800" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Email & SMTP */}
        <TabsContent value="email" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Outgoing SMTP Mail Server</CardTitle>
                <CardDescription className="text-xs">Configure SMTP relay for sending automated offer letters and application updates.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 gap-1.5 text-xs font-bold">
                <Link href="/admin/templates">
                  <span>Manage Templates</span>
                  <ExternalLink size={13} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">SMTP Host</Label>
                  <Input defaultValue="smtp.sendgrid.net" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">SMTP Port</Label>
                  <Input defaultValue="587" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Sender Name</Label>
                  <Input defaultValue="EGA University Admissions" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Sender Email ("From")</Label>
                  <Input defaultValue="no-reply@ega.edu" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Application Workflow Rules */}
        <TabsContent value="workflow" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Application Workflow Rules</CardTitle>
              <CardDescription className="text-xs">Control review stages, applicant editing permissions, and score cutoffs.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Assign Reviewer Upon Submission</p>
                  <p className="text-[11px] text-slate-500">Automatically round-robin new applications to available Admissions Officers.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoAssign} 
                  onChange={(e) => setAutoAssign(e.target.checked)}
                  className="h-5 w-5 rounded accent-[#252D65] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Allow Applicant Edits After Submission</p>
                  <p className="text-[11px] text-slate-500">Permit students to modify personal details while status is in Pending Review.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={allowEdits} 
                  onChange={(e) => setAllowEdits(e.target.checked)}
                  className="h-5 w-5 rounded accent-[#252D65] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Missing Document Grace Period (Days)</Label>
                  <Input defaultValue="14" type="number" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Offer Acceptance Window (Days)</Label>
                  <Input defaultValue="30" type="number" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Payment Gateways */}
        <TabsContent value="payments" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Stripe & Payment Gateways</CardTitle>
              <CardDescription className="text-xs">Configure application fee and tuition fee processors.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">Stripe Gateway Mode</p>
                  <p className="text-[11px] text-slate-500">{stripeLive ? "Live Production Mode" : "Test / Sandbox Mode"}</p>
                </div>
                <Badge variant="outline" className={stripeLive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                  {stripeLive ? "LIVE" : "TEST"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Primary Currency</Label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="CAD">CAD ($ - Canadian Dollar)</option>
                    <option value="AUD">AUD ($ - Australian Dollar)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Standard Application Fee</Label>
                  <Input defaultValue="50.00" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Stripe Publishable Key</Label>
                <Input defaultValue="pk_test_51MzE4928174..." className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono text-xs" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Storage (S3/R2) */}
        <TabsContent value="storage" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Cloud Document Storage (S3 / R2)</CardTitle>
              <CardDescription className="text-xs">Secure encrypted storage for passports, academic transcripts, and portfolios.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Storage Provider</Label>
                  <select defaultValue="r2" className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800">
                    <option value="r2">Cloudflare R2 (Recommended - No egress fees)</option>
                    <option value="s3">Amazon Web Services (AWS S3)</option>
                    <option value="local">Local Disk Storage (Development)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">S3 / R2 Bucket Name</Label>
                  <Input defaultValue="ega-admissions-documents" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Max Upload File Size (MB)</Label>
                  <Input defaultValue="25" type="number" className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Allowed File Extensions</Label>
                  <Input defaultValue=".pdf, .png, .jpg, .jpeg, .docx" className="h-11 rounded-xl border-slate-200 text-slate-800 text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Notifications */}
        <TabsContent value="notifications" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Automated Notification Rules</CardTitle>
                <CardDescription className="text-xs">Configure triggers for automated emails and system alert feeds.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 gap-1.5 text-xs font-bold">
                <Link href="/admin/notifications">
                  <span>View Feed</span>
                  <ExternalLink size={13} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { title: "Notify Staff on New Application Submission", desc: "Sends instant email to admissions officers when student completes Step 6.", def: true },
                { title: "Notify Finance on Application Fee Settlement", desc: "Alerts finance desk when payment gateway confirms transaction.", def: true },
                { title: "Interview Scheduling Confirmation Alert", desc: "Sends meeting links to both student and interview panelists.", def: true },
                { title: "Daily Digest Summary Report", desc: "Sends 9:00 AM daily admissions pipeline summary to administrators.", def: false }
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rule.title}</p>
                    <p className="text-[11px] text-slate-500">{rule.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={rule.def} className="h-4 w-4 rounded accent-[#252D65] cursor-pointer" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Security & Roles */}
        <TabsContent value="security" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Security & Access Control</CardTitle>
                <CardDescription className="text-xs">Authentication security policies and session management.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 gap-1.5 text-xs font-bold">
                <Link href="/admin/users">
                  <span>Manage Staff</span>
                  <ExternalLink size={13} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enforce Two-Factor Authentication (2FA) for Admins</p>
                  <p className="text-[11px] text-slate-500">Require OTP authenticator verification for all staff accounts.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={twoFactorRequired} 
                  onChange={(e) => setTwoFactorRequired(e.target.checked)}
                  className="h-5 w-5 rounded accent-[#252D65] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Admin Inactivity Session Timeout (Minutes)</Label>
                  <Input defaultValue="60" type="number" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Max Failed Login Attempts Before Lockout</Label>
                  <Input defaultValue="5" type="number" className="h-11 rounded-xl border-slate-200 text-slate-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 8: Branding */}
        <TabsContent value="branding" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Branding & Color Theme</CardTitle>
              <CardDescription className="text-xs">Customize the look and feel of applicant portal and admin workspace.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Primary Brand Color (Hex)</Label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-11 w-12 rounded-xl border border-slate-200 cursor-pointer p-1"
                    />
                    <Input 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)} 
                      className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Portal Display Name</Label>
                  <Input defaultValue="EGA University Portal" className="h-11 rounded-xl border-slate-200 text-slate-800 font-medium" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 9: API Keys */}
        <TabsContent value="api" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">REST API Keys & Webhooks</CardTitle>
              <CardDescription className="text-xs">Integrate EGA Admissions with CRM (HubSpot, Salesforce, Slate).</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Live API Key</Label>
                <div className="flex gap-2">
                  <Input defaultValue="ega_live_sec_99482710385920194857" type="password" readOnly className="h-11 rounded-xl border-slate-200 text-slate-800 font-mono text-xs flex-1 bg-slate-50" />
                  <Button variant="outline" onClick={() => alert("API key copied to clipboard!")} className="rounded-xl h-11 px-4 gap-1.5 text-xs font-bold border-slate-200">
                    <Copy size={14} /> Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Outbound Webhook Endpoint URL</Label>
                <Input defaultValue="https://crm.university.edu/api/webhooks/ega-admissions" className="h-11 rounded-xl border-slate-200 text-slate-800 text-xs font-mono" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 10: Audit & Logs */}
        <TabsContent value="audit" className="m-0 space-y-6 max-w-4xl">
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">Audit Log Retention & Health</CardTitle>
                <CardDescription className="text-xs">System logs, compliance tracking, and database status.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 gap-1.5 text-xs font-bold">
                <Link href="/admin/audit-logs">
                  <span>View All Logs</span>
                  <ExternalLink size={13} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Audit Log Retention Policy</Label>
                  <select 
                    value={logRetention} 
                    onChange={(e) => setLogRetention(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800"
                  >
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days (Recommended)</option>
                    <option value="365">1 Year (Compliance)</option>
                    <option value="indefinite">Indefinite (Never purge)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Database Connection State</Label>
                  <div className="flex h-11 items-center px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>PostgreSQL Database Connected (Healthy)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
