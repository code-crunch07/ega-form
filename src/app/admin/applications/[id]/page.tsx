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
  StickyNote
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DetailActions } from "./detail-actions";

export default async function ApplicationDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const app = await prisma.application.findFirst({
    where: { id: appId },
    include: {
      user: {
        include: { profile: true }
      },
      payments: true
    }
  });

  if (!app) {
    notFound();
  }

  const applicantName = app.user?.profile 
    ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
    : app.user?.name || "Unknown";
    
  const isPaid = app.payments?.some(p => p.status === "Paid");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Review":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Pending Review</Badge>;
      case "Interview Scheduled":
      case "Interview":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Interview</Badge>;
      case "Offered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Offered</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-800">{status || "Draft"}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Premium Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                APP-{app.appNumber}
              </span>
              {getStatusBadge(app.status)}
              {isPaid ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-2xs font-semibold px-2.5">
                  Fee Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 shadow-2xs font-semibold px-2.5">
                  Unpaid
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
              Application Details
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-neutral-400" />
                {applicantName}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={15} className="text-neutral-400" />
                {app.programmeId || "Not Selected"}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-neutral-400" />
                Submitted {app.createdAt.toLocaleDateString()}
              </span>
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
          <TabsTrigger value="education" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><GraduationCap size={16}/> Education</TabsTrigger>
          <TabsTrigger value="employment" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Briefcase size={16}/> Employment</TabsTrigger>
          <TabsTrigger value="englishTest" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Languages size={16}/> English Test</TabsTrigger>
          <TabsTrigger value="documents" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><FolderOpen size={16}/> Documents</TabsTrigger>
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
            
            {/* Programme details */}
            <Card className="col-span-1 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850">Programme Selection</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Programme</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">{app.programmeId || "Not Selected"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Campus</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">Main Campus</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Intake</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">September 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Study Mode</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">Full-Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Officer Notes */}
            <Card className="col-span-1 lg:col-span-2 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
                <CardTitle className="text-base font-bold text-neutral-850">Officer Notes (Internal)</CardTitle>
                <CardDescription className="text-xs font-semibold text-neutral-400">Only visible to staff members.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-xl">
                    <p className="text-xs text-amber-800 dark:text-amber-500 mb-1.5 font-bold uppercase tracking-wider font-mono">
                      Added by Admission Officer on {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                      Applicant meets all academic criteria. Waiting on final English Test verification before moving to interview stage.
                    </p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <textarea 
                    className="w-full p-4 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none bg-slate-50/50 dark:bg-neutral-900/50 font-medium transition-all" 
                    placeholder="Add a new internal note..."
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <Button size="sm" className="bg-[#2C315E] hover:bg-slate-800 text-white font-semibold rounded-lg">Save Note</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: Personal Details */}
        <TabsContent value="personal" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Personal Details</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Personal and contact information synced from the user's profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Personal Data */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-neutral-800 border-b pb-2 dark:border-neutral-800">Personal Data</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Full Name</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">{applicantName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Date of Birth</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">
                        {app.user?.profile?.dob ? new Date(app.user.profile.dob).toLocaleDateString() : "April 12, 2004"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Nationality</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">{app.user?.profile?.nationality || "United States"}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Data */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-neutral-800 border-b pb-2 dark:border-neutral-800">Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Email</p>
                      <p className="font-semibold text-sm mt-1 text-blue-600 hover:underline cursor-pointer">{app.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Phone</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">{app.user?.profile?.phone || "No phone provided"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Address</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700 leading-relaxed">
                        {app.user?.profile?.address || "123 Tech Avenue, San Francisco, CA 94105, USA"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Identity Cards */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-neutral-800 border-b pb-2 dark:border-neutral-800">Passport / ID</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Passport Number</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">{app.user?.profile?.passportNumber || "A12345678"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Expiry Date</p>
                      <p className="font-semibold text-sm mt-1 text-neutral-700">Dec 31, 2030</p>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Education */}
        <TabsContent value="education" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Education History</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Previous academic credentials and transcript records.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl hover:bg-slate-50/30 transition-all">
                  <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <GraduationCap size={20} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-neutral-800">Stanford High School</h4>
                      <span className="text-xs font-mono font-bold text-slate-500">2022 - 2026</span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-500">High School Diploma • GPA: 3.8 / 4.0</p>
                    <p className="text-xs text-neutral-400 font-medium">Major focus: Physics, Mathematics, Computer Science</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Employment */}
        <TabsContent value="employment" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Employment History</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Professional experience related to this application.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Applicant did not provide employment history.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: English Test */}
        <TabsContent value="englishTest" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">English Test</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Proof of English proficiency.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Awaiting IELTS Results.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Documents */}
        <TabsContent value="documents" className="m-0 space-y-6 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Uploaded Documents</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Validate applicant verification papers and test certs.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { name: "High School Transcript.pdf", type: "Academic", status: "Approved" },
                  { name: "Passport_Scan.jpg", type: "Identification", status: "Pending Review" },
                  { name: "IELTS_Certificate.pdf", type: "Language", status: "Pending Review" }
                ].map((doc, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200/50 rounded-xl dark:border-neutral-800 hover:bg-slate-50/30 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-blue-600 hover:underline cursor-pointer">{doc.name}</p>
                        <p className="text-xs text-neutral-400 font-semibold">{doc.type} Document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      {doc.status === "Approved" ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-semibold">Approved</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800/50 font-semibold">Needs Review</Badge>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 font-semibold rounded-lg transition-all text-xs">Approve</Button>
                        <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold rounded-lg transition-all text-xs">Reject</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Payment */}
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
                    <TableRow>
                      <TableCell className="font-mono text-xs font-bold text-slate-500">TXN-9840291</TableCell>
                      <TableCell className="text-xs font-medium">{app.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs font-bold text-[#2C315E]">$50.00</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-500">Credit Card</TableCell>
                      <TableCell className="text-right">
                        {isPaid ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Paid</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Interview */}
        <TabsContent value="interview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Interview Record</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Schedule and record applicant interviews.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No interview scheduled yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Messages */}
        <TabsContent value="messages" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Direct Messages</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Communication thread with the applicant.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
                <div className="self-start max-w-[80%] bg-slate-100 dark:bg-neutral-800 rounded-2xl p-4 text-xs font-medium text-neutral-700 leading-relaxed shadow-3xs">
                  Hi admissions office! I just submitted my application and fee. Can you verify if my High School transcript loaded successfully? Thanks!
                </div>
                <div className="self-end max-w-[80%] bg-[#2C315E] text-white rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-3xs">
                  Hi {applicantName}, yes we have received the transcript. We are currently waiting on the IELTS English Test certificate. Please upload it inside your dashboard under step 9.
                </div>
              </div>
              <div className="flex gap-2 pt-6 mt-4 border-t">
                <Input placeholder="Type a message..." className="h-10 rounded-lg text-xs" />
                <Button size="sm" className="bg-[#2C315E] hover:bg-slate-800 text-white font-semibold rounded-lg text-xs h-10 px-4">Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Timeline */}
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
                    <p className="text-[10px] text-neutral-400 font-semibold">{app.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={`absolute left-[-20px] w-2.5 h-2.5 rounded-full ring-4 ${isPaid ? "bg-emerald-500 ring-emerald-50" : "bg-slate-300 ring-slate-100"}`} />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-800">Fee Processed</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold">{isPaid ? "Verified" : "Payment Pending"}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="absolute left-[-20px] w-2.5 h-2.5 rounded-full bg-slate-300 ring-slate-100" />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-850">Academic Verification</h4>
                    <p className="text-[10px] text-neutral-400 font-medium">Under Review by admissions officer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Notes */}
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

        {/* TAB: Activity Log */}
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
                      <TableCell className="text-xs text-neutral-400 font-medium">{app.createdAt.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-xs font-semibold text-neutral-700">Submitted details</TableCell>
                      <TableCell className="text-xs font-medium text-slate-500">Applicant</TableCell>
                      <TableCell className="text-xs text-neutral-400 font-medium">{app.createdAt.toLocaleString()}</TableCell>
                    </TableRow>
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
