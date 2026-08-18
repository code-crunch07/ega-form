import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Users, 
  Clock, 
  Edit,
  CalendarCheck,
  ArrowLeft
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditIntakeDialog } from "../edit-intake-dialog";
import { ExtendDeadlineDialog } from "../extend-deadline-dialog";
import { IntakeActionsDropdown } from "../intake-actions-dropdown";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function IntakeDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const intakeId = resolvedParams.id;

  const intake = await prisma.intake.findUnique({
    where: { id: intakeId }
  });

  if (!intake) {
    notFound();
  }

  const applications = await prisma.application.findMany({
    where: { intake: { contains: intake.name, mode: "insensitive" } },
    include: {
      user: {
        include: { profile: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const capacityStr = intake.capacity ? `${applications.length} / ${intake.capacity} Enrolled` : `${applications.length} Enrolled (Unlimited)`;
  const percentFull = intake.capacity ? Math.min(100, Math.round((applications.length / intake.capacity) * 100)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/intakes">
            <ArrowLeft size={15} /> Back to All Intakes
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                INTAKE-{intake.id.substring(0, 6).toUpperCase()}
              </span>
              {intake.status === "Open" ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Open
                </Badge>
              ) : intake.status === "Upcoming" ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                  Upcoming
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                  {intake.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              {intake.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CalendarDays size={15} className="text-slate-400" />
                {new Date(intake.openDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} — {new Date(intake.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Users size={15} className="text-slate-400" />
                {capacityStr} ({percentFull}% Full)
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <ExtendDeadlineDialog intake={intake} />
            <EditIntakeDialog 
              intake={intake} 
              trigger={
                <Button className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                  <Edit size={16} /> Edit Intake
                </Button>
              }
            />
            <IntakeActionsDropdown intake={intake} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><CalendarDays size={15}/> Overview</TabsTrigger>
          <TabsTrigger value="applications" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Users size={15}/> Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="deadlines" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Clock size={15}/> Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Cohort Information & Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Window Opens</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">
                    {new Date(intake.openDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Window Closes</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">
                    {new Date(intake.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Capacity Limit</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">
                    {intake.capacity ? `${intake.capacity} students` : "Unlimited enrollment"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="m-0 focus-visible:outline-none">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                  <TableHead className="font-bold text-slate-700">App Number</TableHead>
                  <TableHead className="font-bold text-slate-700">Student</TableHead>
                  <TableHead className="font-bold text-slate-700">Programme</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-28 text-slate-400 font-medium">
                      No student applications registered for this intake yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => {
                    const applicantName = app.user?.profile 
                      ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
                      : app.user?.name || "Unknown";

                    return (
                      <TableRow key={app.id} className="hover:bg-slate-50/70 border-b border-slate-100">
                        <TableCell className="font-bold font-mono text-xs text-[#252D65]">{app.appNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-xs text-slate-900">{applicantName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{app.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">{app.programmeLevel || app.programmeId || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[11px] font-semibold">{app.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm" className="text-[#252D65] font-bold text-xs">
                            <Link href={`/admin/applications/${app.id}`}>View App</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Key Milestone Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-sm text-slate-900">Application Submission Cutoff</p>
                  <p className="text-xs text-slate-500 mt-0.5">Final date for applicants to submit forms.</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-[#252D65] border-slate-200">
                    {new Date(intake.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
