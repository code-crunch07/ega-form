import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  User, 
  GraduationCap, 
  FolderOpen, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  ShieldAlert,
  CalendarDays,
  UserPlus,
  FileCheck,
  Briefcase,
  Languages,
  StickyNote,
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  ExternalLink,
  Download,
  AlertCircle,
  PenTool,
  Globe,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DetailActions } from "./detail-actions";
import { resolveApplicationProgramme } from "@/lib/programme-resolver";

export default async function ApplicationDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const app = await prisma.application.findFirst({
    where: { id: appId },
    include: {
      user: {
        include: { profile: true }
      },
      payments: {
        orderBy: { createdAt: "desc" }
      },
      documents: {
        orderBy: { createdAt: "desc" }
      },
      interviews: {
        orderBy: { createdAt: "desc" }
      },
      offers: {
        orderBy: { createdAt: "desc" }
      },
      educationHistory: {
        orderBy: { id: "asc" }
      },
      employmentHistory: {
        orderBy: { id: "asc" }
      },
      englishTests: {
        orderBy: { id: "asc" }
      },
    }
  });

  if (!app) {
    notFound();
  }

  // Parse draftData JSON payload which holds every single submitted wizard field
  let draft: any = {};
  try {
    if (app.draftData) {
      draft = typeof app.draftData === "string" ? JSON.parse(app.draftData) : app.draftData;
    }
  } catch (e) {
    console.error("Failed to parse draftData", e);
  }

  const progInfo = await resolveApplicationProgramme(app);

  const applicantName = draft.personal?.fullName
    ? `${draft.personal.title ? draft.personal.title + " " : ""}${draft.personal.fullName} ${draft.personal.surname && draft.personal.surname !== "." ? draft.personal.surname : ""}`.trim()
    : (app.user?.profile 
      ? `${app.user.profile.firstName || ""} ${app.user.profile.lastName || ""}`.trim()
      : app.user?.name || "Applicant");

  const studentType = draft.studentType || app.applicantType || "Local Student";
  const agentInfo = draft.agent || {};
  const isAgentRepresented = Boolean(agentInfo.isAgentRepresented);
  const guardianInfo = draft.guardian || {};
  const emergencyInfo = draft.emergencyContact || {};
  const additionalInfo = draft.additionalInfo || {};
  const consent = draft.consent || {};
  const digitalSignature = app.digitalSignature || draft.digitalSignature || "";

  // Combine DB education and draft education
  const educationList = (app.educationHistory && app.educationHistory.length > 0)
    ? app.educationHistory
    : (Array.isArray(draft.education) && draft.education.length > 0
      ? draft.education
      : (Array.isArray(draft.educationList) && draft.educationList.length > 0 ? draft.educationList : []));

  // Combine DB employment and draft employment
  const employmentList = (app.employmentHistory && app.employmentHistory.length > 0)
    ? app.employmentHistory
    : (Array.isArray(draft.employment) && draft.employment.length > 0
      ? draft.employment
      : (Array.isArray(draft.employmentList) && draft.employmentList.length > 0 ? draft.employmentList : []));

  // Combine DB english tests and draft english tests
  const englishTestList = (app.englishTests && app.englishTests.length > 0)
    ? app.englishTests
    : (draft.englishTest?.hasTakenTest ? [draft.englishTest] : []);

  // Combine DB documents and certFiles
  const existingDocNames = new Set((app.documents || []).map(d => (d.filename || "").toLowerCase()));
  const draftFiles = (Array.isArray(draft.certFiles) ? draft.certFiles : [])
    .filter((f: any) => !existingDocNames.has((f.name || "").toLowerCase()))
    .map((f: any) => ({
      id: f.id || `draft_doc_${Math.random()}`,
      filename: f.name || "Academic Document",
      type: "Certificate / Academic Document",
      url: f.url || f.preview || `/uploads/${f.name}`,
      createdAt: app.createdAt,
    }));
  const allDocuments = [...(app.documents || []), ...draftFiles];

  const isPaid = app.payments?.some(p => p.status === "Paid" || p.status === "Completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Review":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Pending Review</Badge>;
      case "Submitted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Submitted</Badge>;
      case "Interview Scheduled":
      case "Interview":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">Interview</Badge>;
      case "Offered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Offered</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-800">{status || "Draft"}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 font-jost text-left">
      
      {/* Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                APP-{app.appNumber}
              </span>
              {getStatusBadge(app.status)}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-indigo-50 text-indigo-700 border-indigo-200 font-mono">
                {studentType}
              </span>
              {isPaid ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-2xs font-semibold px-2.5">
                  Fee Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 shadow-2xs font-semibold px-2.5">
                  Payment Pending
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-850 dark:text-neutral-100 font-heading">
              {applicantName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5" title={progInfo.programmeName}>
                <GraduationCap size={15} className="text-neutral-400 shrink-0" />
                <span className="max-w-[280px] sm:max-w-[420px] truncate">{progInfo.programmeName}</span>
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-neutral-400" />
                Submitted {app.createdAt.toLocaleDateString("en-SG", { year: "numeric", month: "short", day: "numeric" })}
              </span>
              {isAgentRepresented && (
                <>
                  <span className="hidden sm:inline text-neutral-300">•</span>
                  <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                    <UserCheck size={15} />
                    Agent: {agentInfo.agencyName || "Represented"}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 lg:self-center">
            <Button variant="outline" className="gap-2 text-neutral-600 border-neutral-200 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-400 rounded-xl h-11 px-4 font-semibold transition-all">
              <UserPlus size={16} /> Assign Officer
            </Button>
            <Button variant="outline" className="gap-2 text-neutral-600 border-neutral-200 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-400 rounded-xl h-11 px-4 font-semibold transition-all">
              <CalendarDays size={16} /> Interview
            </Button>
            <Button variant="outline" className="gap-2 text-neutral-600 border-neutral-200 hover:bg-slate-50 dark:border-neutral-800 dark:text-neutral-400 rounded-xl h-11 px-4 font-semibold transition-all">
              <FileCheck size={16} /> Docs
            </Button>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800 hidden xl:block mx-1"></div>
            <DetailActions appId={appId} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* Sleek Horizontal Tab Bar */}
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FileText size={16}/> Overview</TabsTrigger>
          <TabsTrigger value="personal" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><User size={16}/> Personal Details</TabsTrigger>
          <TabsTrigger value="education" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><GraduationCap size={16}/> Education ({educationList.length})</TabsTrigger>
          <TabsTrigger value="employment" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Briefcase size={16}/> Employment ({employmentList.length})</TabsTrigger>
          <TabsTrigger value="englishTest" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Languages size={16}/> English Test</TabsTrigger>
          <TabsTrigger value="documents" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FolderOpen size={16}/> Documents ({allDocuments.length})</TabsTrigger>
          <TabsTrigger value="payment" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CreditCard size={16}/> Payment</TabsTrigger>
          <TabsTrigger value="interview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CalendarDays size={16}/> Interview</TabsTrigger>
          <TabsTrigger value="messages" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MessageSquare size={16}/> Messages</TabsTrigger>
          <TabsTrigger value="timeline" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Clock size={16}/> Timeline</TabsTrigger>
          <TabsTrigger value="notes" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><StickyNote size={16}/> Notes</TabsTrigger>
          <TabsTrigger value="activity" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><ShieldAlert size={16}/> Activity Log</TabsTrigger>
        </TabsList>

        {/* TAB 1: Overview */}
        <TabsContent value="overview" className="m-0 space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Programme Selection Card */}
            <Card className="col-span-1 lg:col-span-1 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-neutral-850">Programme Selection</CardTitle>
                {progInfo.isPackage ? (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold">
                    Package Pathway
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-semibold">
                    Standalone
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {progInfo.isPackage && progInfo.packageDetails && progInfo.packageDetails.length > 0 ? (
                  <div className="space-y-2.5">
                    {progInfo.packageDetails.map((pkg) => (
                      <div key={pkg.slot} className="p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-neutral-900/40 dark:border-neutral-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                            Slot {pkg.slot}
                          </span>
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {pkg.level}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 mt-1">
                          {pkg.name}
                        </p>
                        {pkg.code && (
                          <span className="text-[11px] font-mono text-neutral-400 block mt-0.5">
                            Code: {pkg.code}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Programme</p>
                    <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 mt-1">
                      {progInfo.programmeName}
                    </p>
                    {progInfo.programmeCode && (
                      <span className="text-xs font-mono text-neutral-400 block mt-0.5">
                        Code: {progInfo.programmeCode}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Campus</p>
                    <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mt-1">{progInfo.campus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Intake</p>
                    <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mt-1">{progInfo.intake}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Study Mode</p>
                    <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mt-1">{progInfo.studyMode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Awarding Partner</p>
                    <p className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mt-1">{progInfo.school}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EGA Appointed Agent Card */}
            <Card className="col-span-1 lg:col-span-1 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-600" />
                  EGA Appointed Agent
                </CardTitle>
                <Badge variant="outline" className={isAgentRepresented ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                  {isAgentRepresented ? "Agent Represented" : "Direct Application"}
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {isAgentRepresented ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Agency Name</p>
                      <p className="font-semibold text-sm text-neutral-800 mt-0.5">{agentInfo.agencyName || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Agent Country</p>
                        <p className="font-semibold text-sm text-neutral-700 mt-0.5">{agentInfo.agentCountry || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Counsellor Name</p>
                        <p className="font-semibold text-sm text-neutral-700 mt-0.5">{agentInfo.counsellorName || "—"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Counsellor Email</p>
                      <p className="font-semibold text-sm text-indigo-600 mt-0.5">{agentInfo.counsellorEmail || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-slate-700">Self-Represented Student</p>
                    <p className="text-xs text-slate-400 mt-1">This application was submitted directly without an EGA education agent.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Counselling & Digital Signature Summary Card */}
            <Card className="col-span-1 lg:col-span-1 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <PenTool size={18} className="text-indigo-600" />
                  Pre-Course & Signature
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs">
                  Signed & Agreed
                </Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Pre-Course Counselling</p>
                  <p className="text-xs text-neutral-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 leading-relaxed">
                    {draft.counsellingDeclaration || "I acknowledge that I have received, read and understood the Pre-Course Counselling information as required by Educare Global Academy (EGA)."}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Applicant Signature</p>
                  {digitalSignature && digitalSignature.startsWith("data:image") ? (
                    <div className="mt-1 p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                      <img src={digitalSignature} alt="Applicant Signature" className="max-h-14 object-contain" />
                    </div>
                  ) : (
                    <p className="text-sm font-mono font-bold text-neutral-800 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {digitalSignature || applicantName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Data Consent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Partner Consent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>EGA Declaration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={consent.marketingConsent ? "text-emerald-600 font-medium" : "text-slate-400"}>
                      {consent.marketingConsent ? "✓ Marketing Opt-In" : "✗ Marketing Opt-Out"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Emergency Contact</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{emergencyInfo.fullName || app.user?.profile?.emergencyContactName || "Not provided"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{emergencyInfo.relation || app.user?.profile?.emergencyContactRelation || "—"} • {emergencyInfo.phone || app.user?.profile?.emergencyContactPhone || "—"}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Guardian (Under 18)</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {guardianInfo.isUnder18 ? (guardianInfo.fullName || "Under 18 Registered") : "Not Applicable (18+)"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {guardianInfo.isUnder18 ? (guardianInfo.relation || "Legal Guardian") : "Adult applicant"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">English Proficiency</p>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {draft.englishTest?.hasTakenTest ? (draft.englishTest.testType || "IELTS") : "No Test (Standard)"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {draft.englishTest?.hasTakenTest ? (draft.englishTest.testDate || "Score on record") : "Medium of Instruction"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Marketing Channel</p>
              <p className="text-sm font-bold text-slate-800 mt-1">{additionalInfo.marketingChannel || "EGA Website"}</p>
              <p className="text-xs text-slate-500 mt-0.5">Source referral</p>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Personal Details */}
        <TabsContent value="personal" className="m-0 space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Personal Particulars */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" />
                  Personal Particulars
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Core identity and demographic details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Title & Full Name</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-800">
                    {draft.personal?.title || app.user?.profile?.title || "Mr."} {draft.personal?.fullName || app.user?.profile?.firstName || applicantName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Surname / Family Name</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {draft.personal?.surname && draft.personal.surname !== "." ? draft.personal.surname : "—"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Date of Birth</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.personal?.dob 
                        ? new Date(draft.personal.dob).toLocaleDateString("en-SG", { year: "numeric", month: "short", day: "numeric" })
                        : (app.user?.profile?.dob ? new Date(app.user.profile.dob).toLocaleDateString("en-SG") : "—")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Gender</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.personal?.gender || app.user?.profile?.gender || "—"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Marital Status</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.personal?.maritalStatus || "Single"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Nationality</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.personal?.nationality || app.user?.profile?.nationality || "Singaporean"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Student Classification</p>
                  <p className="font-semibold text-sm mt-0.5 text-indigo-600">
                    {studentType}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Contact & Residential Address */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" />
                  Contact & Residential Address
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Direct contact channels and residence.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-sm mt-0.5 text-blue-600 hover:underline">
                    {draft.personal?.email || app.user?.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Contact Number</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {draft.personal?.phoneCountryCode ? `${draft.personal.phoneCountryCode} ` : ""}{draft.personal?.phone || app.user?.profile?.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Address Line 1</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700 leading-relaxed">
                    {draft.address?.addressLine1 || app.user?.profile?.address || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Line 2 / Unit</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.address?.unitNo || draft.address?.addressLine2 || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Postal Code</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700 font-mono">
                      {draft.address?.postalCode || app.user?.profile?.postalCode || "—"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">City / State</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.address?.city || app.user?.profile?.city || "Singapore"} {draft.address?.state ? `, ${draft.address.state}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Country</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.address?.country || app.user?.profile?.country || "Singapore"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Passport & Citizenship */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <Globe size={18} className="text-indigo-600" />
                  Passport & Citizenship
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Official passport and country records.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Passport Number</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-800 font-mono">
                    {draft.passport?.passportNumber || app.user?.profile?.passportNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Country of Issue</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {draft.passport?.countryOfIssue || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Issue Date</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.passport?.issueDate || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Expiry Date</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {draft.passport?.expiryDate || "—"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Country of Birth</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {draft.passport?.countryOfBirth || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Emergency Contact */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <Phone size={18} className="text-indigo-600" />
                  Emergency Contact
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Primary point of contact in emergencies.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Full Name</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-800">
                    {emergencyInfo.fullName || app.user?.profile?.emergencyContactName || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Relationship</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {emergencyInfo.relation || app.user?.profile?.emergencyContactRelation || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Contact Type</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {emergencyInfo.contactType || "Primary"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {emergencyInfo.countryCode ? `${emergencyInfo.countryCode} ` : ""}{emergencyInfo.phone || app.user?.profile?.emergencyContactPhone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                    {emergencyInfo.email || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Parent / Legal Guardian */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  Parent / Legal Guardian
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Required if applicant is under 18 years of age.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Under 18 Status</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-800">
                    {guardianInfo.isUnder18 ? "Yes — Applicant is Under 18" : "No — Applicant is 18 years or older"}
                  </p>
                </div>
                {guardianInfo.isUnder18 ? (
                  <>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Guardian Full Name</p>
                      <p className="font-semibold text-sm mt-0.5 text-neutral-800">{guardianInfo.fullName || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Relationship</p>
                        <p className="font-semibold text-sm mt-0.5 text-neutral-700">{guardianInfo.relation || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Same as Emergency</p>
                        <p className="font-semibold text-sm mt-0.5 text-neutral-700">{guardianInfo.isSameAsEmergency ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Guardian Phone</p>
                      <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                        {guardianInfo.countryCode ? `${guardianInfo.countryCode} ` : ""}{guardianInfo.phone || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Guardian Email</p>
                      <p className="font-semibold text-sm mt-0.5 text-neutral-700">{guardianInfo.email || "—"}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-neutral-500 pt-2">
                    Applicant declared adult status. Legal guardian endorsement is not required for this enrolment.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Card 6: Additional Declarations & Conduct */}
            <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850 flex items-center gap-2">
                  <AlertCircle size={18} className="text-indigo-600" />
                  Additional Declarations
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Health, disciplinary history and conduct.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3.5">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Medical / Health Conditions</p>
                  <p className="font-semibold text-sm mt-0.5 text-neutral-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {additionalInfo.healthConditions || "None declared (NA)"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Academic Suspension</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {additionalInfo.conductSuspended ? "⚠️ Yes (Declared)" : "No (Clean Record)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Criminal Conviction</p>
                    <p className="font-semibold text-sm mt-0.5 text-neutral-700">
                      {additionalInfo.conductConvicted ? "⚠️ Yes (Declared)" : "No (Clean Record)"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">How did you hear about EGA?</p>
                  <p className="font-semibold text-sm mt-0.5 text-indigo-600">
                    {additionalInfo.marketingChannel || "EGA Website"}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* TAB 3: Education */}
        <TabsContent value="education" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Education History</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Previous academic credentials and transcript records.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {educationList.length > 0 ? (
                <div className="space-y-4">
                  {educationList.map((ed: any, idx: number) => (
                    <div key={ed.id || idx} className="flex items-start gap-4 p-4 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl hover:bg-slate-50/30 transition-all">
                      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
                        <GraduationCap size={22} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-sm text-neutral-850">{ed.institution || ed.schoolName || "Institution"}</h4>
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {ed.country || "Singapore"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-neutral-600">
                          {ed.qualification || ed.qualificationTitle || "Certificate / Diploma"}
                        </p>
                        {ed.major && (
                          <p className="text-xs text-neutral-400 font-medium">Major: {ed.major}</p>
                        )}
                        {ed.grade && (
                          <p className="text-xs text-neutral-400 font-medium">Result / Grade: {ed.grade}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 py-4">Applicant did not declare previous education history.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Employment */}
        <TabsContent value="employment" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Employment History</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Professional work background and industry experience.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {employmentList.length > 0 ? (
                <div className="space-y-4">
                  {employmentList.map((emp: any, idx: number) => (
                    <div key={emp.id || idx} className="flex items-start gap-4 p-4 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl hover:bg-slate-50/30 transition-all">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 shrink-0">
                        <Briefcase size={22} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="font-bold text-sm text-neutral-850">{emp.employer || emp.company || "Employer"}</h4>
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {emp.industry || "General Industry"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-neutral-600">{emp.position || emp.jobTitle || "Role / Position"}</p>
                        <p className="text-xs text-neutral-400 font-medium">
                          Experience: {emp.yearsExperience || 1} Year(s) • {emp.currentlyEmployed ? "Currently Employed" : "Past Role"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 py-4">Applicant did not submit employment history.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: English Test */}
        <TabsContent value="englishTest" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">English Proficiency Test</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Proof of English proficiency submitted with the application.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {draft.englishTest?.hasTakenTest || englishTestList.length > 0 ? (
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4 max-w-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {draft.englishTest?.testType || englishTestList[0]?.testName || "IELTS"}
                    </span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                      {draft.englishTest?.isTentativeDate ? "Tentative / Scheduled" : "Test Taken"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Test Date</p>
                      <p className="font-semibold text-sm text-slate-800 mt-1">
                        {draft.englishTest?.testDate 
                          ? draft.englishTest.testDate 
                          : (englishTestList[0]?.testDate ? new Date(englishTestList[0].testDate).toLocaleDateString() : "Pending Verification")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Score / Status</p>
                      <p className="font-semibold text-sm text-slate-800 mt-1">
                        {englishTestList[0]?.score || "Certificate Submitted"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center sm:text-left">
                  <p className="text-sm font-semibold text-slate-700">No English Test Required / Taken</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Applicant indicates English was the primary medium of previous instruction or test will be taken prior to commencement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: Documents */}
        <TabsContent value="documents" className="m-0 space-y-6 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Uploaded Documents</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Validate applicant verification papers and test certificates.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {allDocuments.length > 0 ? (
                  allDocuments.map((doc: any) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200/50 rounded-xl dark:border-neutral-800 hover:bg-slate-50/30 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1.5">
                            {doc.filename || `${doc.type} Document`}
                            <ExternalLink size={13} />
                          </a>
                          <p className="text-xs text-neutral-400 font-semibold">{doc.type || "Certificate / Academic Document"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-semibold">Uploaded</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 font-semibold rounded-lg transition-all text-xs">Approve</Button>
                          <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold rounded-lg transition-all text-xs">Reject</Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 py-4">No documents uploaded for this application.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: Payment */}
        <TabsContent value="payment" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Payment History</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Transaction details and processed application fees.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-xs text-neutral-500">Transaction ID</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500">Date</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500">Amount</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500">Method</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {app.payments && app.payments.length > 0 ? (
                      app.payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs font-bold text-slate-700">{p.invoiceNumber}</TableCell>
                          <TableCell className="text-xs font-medium">{p.createdAt.toLocaleDateString("en-SG")}</TableCell>
                          <TableCell className="text-xs font-bold text-[#2C315E]">${p.amount.toFixed(2)} SGD</TableCell>
                          <TableCell className="text-xs font-semibold text-slate-600">{p.gateway}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={p.status === "Paid" || p.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                              {p.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="font-mono text-xs font-bold text-slate-500">PENDING-INVOICE</TableCell>
                        <TableCell className="text-xs font-medium">{app.createdAt.toLocaleDateString("en-SG")}</TableCell>
                        <TableCell className="text-xs font-bold text-[#2C315E]">$160.00 SGD</TableCell>
                        <TableCell className="text-xs font-semibold text-slate-500">{draft.paymentMethod === "flywire" ? "Flywire" : "PayNow"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Pending Payment</Badge>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: Interview */}
        <TabsContent value="interview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Interview Record</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Schedule and record applicant interviews.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {app.interviews && app.interviews.length > 0 ? (
                <div className="space-y-4">
                  {app.interviews.map((interview) => (
                    <div key={interview.id} className="p-4 border rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Interview Scheduled</p>
                        <p className="text-xs text-neutral-500 mt-1">Date: {new Date(interview.date).toLocaleDateString()} at {interview.time}</p>
                        {interview.meetingLink && (
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                            Join Meeting Link
                          </a>
                        )}
                      </div>
                      <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border border-yellow-200">{interview.result || "Pending"}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 py-4">No interview scheduled yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 9: Messages */}
        <TabsContent value="messages" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Direct Messages</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Communication thread with the applicant.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
                <div className="self-start max-w-[80%] bg-slate-100 dark:bg-neutral-800 rounded-2xl p-4 text-xs font-medium text-neutral-700 leading-relaxed shadow-3xs">
                  Hi admissions office! I just submitted my application and fee. Can you verify if my academic documents loaded successfully? Thanks!
                </div>
                <div className="self-end max-w-[80%] bg-[#2C315E] text-white rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-3xs">
                  Hi {applicantName}, yes we have received your application. All submitted files have been logged for review.
                </div>
              </div>
              <div className="flex gap-2 pt-6 mt-4 border-t">
                <Input placeholder="Type a message..." className="h-10 rounded-lg text-xs" />
                <Button size="sm" className="bg-[#2C315E] hover:bg-slate-800 text-white font-semibold rounded-lg text-xs h-10 px-4">Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 10: Timeline */}
        <TabsContent value="timeline" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Progress Timeline</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Milestone checklists for this student record.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-neutral-800" />
                
                <div className="relative flex items-start gap-4">
                  <div className="absolute left-[-20px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-800">Application Submitted</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold">{app.createdAt.toLocaleDateString("en-SG")}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={`absolute left-[-20px] w-2.5 h-2.5 rounded-full ring-4 ${isPaid ? "bg-emerald-500 ring-emerald-50" : "bg-slate-300 ring-slate-100"}`} />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-800">Application Fee</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold">{isPaid ? "Paid & Verified" : "Pending Payment"}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="absolute left-[-20px] w-2.5 h-2.5 rounded-full bg-slate-300 ring-slate-100" />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-850">Document & Academic Verification</h4>
                    <p className="text-[10px] text-neutral-400 font-medium">Under review by admissions officer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 11: Notes */}
        <TabsContent value="notes" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Internal Notes</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Only visible to staff members.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <textarea 
                className="w-full p-4 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none bg-slate-50/50 dark:bg-neutral-900/50 font-medium transition-all" 
                placeholder="Add a new internal note..."
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <Button size="sm" className="bg-[#2C315E] hover:bg-slate-800 text-white font-semibold rounded-lg">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 12: Activity Log */}
        <TabsContent value="activity" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Activity Log</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Chronological history of system-level actions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-xs text-neutral-500">Event</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500">Actor</TableHead>
                      <TableHead className="font-semibold text-xs text-neutral-500">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs font-semibold text-neutral-700">Created record</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">System</TableCell>
                      <TableCell className="text-xs text-neutral-400 font-medium">{app.createdAt.toLocaleString("en-SG")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-semibold text-neutral-700">Submitted application details</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">Applicant</TableCell>
                      <TableCell className="text-xs text-neutral-400 font-medium">{app.createdAt.toLocaleString("en-SG")}</TableCell>
                    </TableRow>
                    {isPaid && (
                      <TableRow>
                        <TableCell className="text-xs font-semibold text-neutral-700">Application fee processed</TableCell>
                        <TableCell className="text-xs font-medium text-slate-500">Payment Gateway</TableCell>
                        <TableCell className="text-xs text-neutral-400 font-medium">{app.createdAt.toLocaleString("en-SG")}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
