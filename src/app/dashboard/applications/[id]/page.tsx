import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  FileText, 
  User, 
  GraduationCap, 
  CalendarDays, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Download,
  Building2,
  BookOpen,
  Award,
  AlertCircle,
  FileCheck,
  Sparkles
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatRelativeDate } from "@/lib/dashboard-utils";

export const dynamic = "force-dynamic";

export default async function ApplicantApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const sessionUser = await getMockSessionUser();

  const app = await prisma.application.findFirst({
    where: { 
      id: appId,
      // Allow user to view their own application, or if super admin
      ...(sessionUser.role === "SUPER_ADMIN" || sessionUser.role === "ADMIN" ? {} : { userId: sessionUser.id })
    },
    include: {
      user: {
        include: { profile: true }
      },
      educationHistory: true,
      employmentHistory: true,
      englishTests: true,
      documents: true,
      payments: true,
      interviews: true,
      offers: true,
    }
  });

  if (!app) {
    notFound();
  }

  const profile = app.user?.profile;
  const applicantFullName = profile?.firstName 
    ? `${profile.firstName} ${profile.lastName || ''}`.trim() 
    : app.user?.name || "Applicant";

  const isPaid = app.payments?.some(p => p.status === "Paid");
  const offer = app.offers?.[0];
  const interview = app.interviews?.[0];

  const programmeName = (app.programmeLevel || "Master of Business Administration").toUpperCase();
  const schoolName = app.school || "Educare Global Academy";
  const studyMode = app.studyMode || "Full-Time";
  const intake = app.intake || "July 2026";

  const submittedDateFormatted = app.submittedAt 
    ? new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : formatRelativeDate(new Date(app.updatedAt));

  return (
    <div className="animate-in fade-in space-y-8 pb-16 duration-500 max-w-6xl mx-auto">
      
      {/* Top Action Bar & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="outline" className="rounded-xl border-neutral-200 bg-white shadow-2xs font-semibold text-xs gap-2">
          <Link href="/dashboard/applications">
            <ArrowLeft size={16} /> Back to My Applications
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          {app.status === "Draft" && (
            <Button asChild className="rounded-xl bg-[#27295B] hover:bg-[#1E2045] font-semibold text-xs gap-2">
              <Link href="/dashboard/applications/new">
                Continue Application
              </Link>
            </Button>
          )}

          {offer && (
            <Button asChild className="rounded-xl bg-[#252D65] hover:bg-[#1C224E] text-white font-bold text-xs shadow-md gap-2">
              <Link href={`/admin/offers/${offer.id}/letter`}>
                <Award size={16} /> View Letter of Offer
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Primary Overview Banner Card */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold bg-[#27295B]/10 text-[#27295B] px-3 py-1 rounded-lg border border-[#27295B]/20">
                APP-{app.appNumber}
              </span>
              <StatusBadge status={app.status} />
              {isPaid ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold px-2.5">
                  <CheckCircle2 size={12} className="mr-1" /> Application Fee Paid
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold px-2.5">
                  Fee Unpaid
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                {programmeName}
              </h1>
              <p className="text-sm font-semibold text-neutral-600 flex items-center gap-2">
                <Building2 size={16} className="text-[#27295B]" />
                {schoolName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500 font-medium pt-1">
              <span><strong>Intake:</strong> {intake}</span>
              <span><strong>Mode:</strong> {studyMode}</span>
              {app.campus && <span><strong>Campus:</strong> {app.campus}</span>}
              <span><strong>Submitted:</strong> {submittedDateFormatted}</span>
            </div>
          </div>

          {/* Quick Offer / Status Highlight Callout */}
          {offer && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 max-w-sm flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
                <Sparkles className="text-emerald-600 shrink-0" size={20} />
                <span>Letter of Offer Issued!</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Congratulations! You have been granted admission. Please view and download your official Letter of Offer below.
              </p>
              <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl gap-2 mt-1">
                <Link href={`/admin/offers/${offer.id}/letter`}>
                  <FileText size={14} /> Open Offer Letter
                </Link>
              </Button>
            </div>
          )}

          {!isPaid && app.status !== "Draft" && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 max-w-sm flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <span>Processing Fee Pending</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Complete your application fee payment to proceed with admissions review.
              </p>
              <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl gap-2 mt-1">
                <Link href="/dashboard/payments">
                  <CreditCard size={14} /> Complete Payment
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Details & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal, Academic, & Employment Info (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Personal Details */}
          <Card className="rounded-3xl border-neutral-200/80 shadow-2xs bg-white">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-neutral-900">
                <User size={20} className="text-[#27295B]" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Full Name</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">{applicantFullName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">{app.user?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Phone / WhatsApp</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">{profile?.phone || profile?.whatsApp || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Nationality</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">{profile?.nationality || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Passport / NRIC Number</p>
                  <p className="font-semibold text-neutral-900 font-mono mt-0.5">{profile?.passportNumber || profile?.nationalId || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Gender / DOB</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">
                    {profile?.gender || "-"} {profile?.dob ? `(${new Date(profile.dob).toLocaleDateString('en-GB')})` : ""}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Permanent Address</p>
                  <p className="font-semibold text-neutral-900 mt-0.5">
                    {[profile?.address, profile?.city, profile?.state, profile?.postalCode, profile?.country].filter(Boolean).join(", ") || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Academic Background */}
          <Card className="rounded-3xl border-neutral-200/80 shadow-2xs bg-white">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-neutral-900">
                <GraduationCap size={20} className="text-[#27295B]" />
                Academic Background
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {app.educationHistory && app.educationHistory.length > 0 ? (
                <div className="space-y-4">
                  {app.educationHistory.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-base">{edu.qualification}</h4>
                        <p className="text-xs font-semibold text-neutral-600">{edu.institution} ({edu.country})</p>
                        {edu.major && <p className="text-xs text-neutral-500 mt-0.5">Major: {edu.major}</p>}
                      </div>
                      {edu.grade && (
                        <Badge variant="outline" className="w-fit bg-white text-[#27295B] border-[#27295B]/30 font-bold text-xs px-3 py-1">
                          Grade: {edu.grade}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 font-medium italic">Higher secondary & undergraduate qualifications recorded.</p>
              )}

              {/* English Proficiency */}
              {app.englishTests && app.englishTests.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">English Language Qualification</h4>
                  <div className="flex flex-wrap gap-3">
                    {app.englishTests.map((test) => (
                      <div key={test.id} className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                        {test.testType}: <span className="font-bold text-[#27295B]">{test.overallScore || "Passed"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Status Timeline & Uploaded Documents */}
        <div className="space-y-8">
          
          {/* Status Timeline */}
          <Card className="rounded-3xl border-neutral-200/80 shadow-2xs bg-white">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-neutral-900">
                <Clock size={20} className="text-[#27295B]" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <p className="text-xs font-bold text-neutral-900">Application Submitted</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{submittedDateFormatted}</p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full ${app.status !== "Draft" ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-slate-300"}`} />
                  <p className="text-xs font-bold text-neutral-900">Document Verification</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {app.status === "Pending Review" ? "In Review by Admissions" : "Completed"}
                  </p>
                </div>

                {/* Step 3: Interview (if any) */}
                {interview && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                    <p className="text-xs font-bold text-neutral-900">Admission Interview</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {new Date(interview.scheduledAt).toLocaleDateString("en-GB")} at {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}

                {/* Step 4: Offer */}
                <div className="relative">
                  <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full ${offer ? "bg-emerald-600 ring-4 ring-emerald-100" : "bg-slate-200"}`} />
                  <p className="text-xs font-bold text-neutral-900">Letter of Offer</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {offer ? "Offer Letter Issued" : "Pending Evaluation"}
                  </p>
                </div>

              </div>

              {interview && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 space-y-2">
                  <p className="text-xs font-bold text-blue-900">Upcoming Interview Scheduled</p>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    Date: <strong>{new Date(interview.scheduledAt).toLocaleDateString("en-GB")}</strong><br />
                    Location/Mode: {interview.mode || "Online Video Call"}
                  </p>
                  {interview.location && (
                    <a 
                      href={interview.location} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 underline mt-1"
                    >
                      Join Meeting <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}

            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card className="rounded-3xl border-neutral-200/80 shadow-2xs bg-white">
            <CardHeader className="border-b border-neutral-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2.5 text-neutral-900">
                <FileCheck size={20} className="text-[#27295B]" />
                Submitted Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {app.documents && app.documents.length > 0 ? (
                app.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl border border-neutral-200/70 bg-neutral-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText size={16} className="text-[#27295B] shrink-0" />
                      <span className="font-semibold text-neutral-800 truncate">{doc.name || doc.category}</span>
                    </div>
                    {doc.url && (
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-[#27295B] hover:border-[#27295B]/40 transition-colors shrink-0"
                        title="View Document"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 font-medium italic">Identification and transcript documents attached to application.</p>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
