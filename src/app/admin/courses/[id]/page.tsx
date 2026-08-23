import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Settings, 
  Clock, 
  Banknote,
  Edit,
  ArrowLeft,
  GraduationCap,
  Calendar
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditProgrammeDialog } from "../../programmes/edit-programme-dialog";
import { ProgrammeActionsDropdown } from "../../programmes/programme-actions-dropdown";

export default async function CourseDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const [course, schools] = await Promise.all([
    prisma.programme.findUnique({
      where: { id: courseId },
      include: {
        school: true
      }
    }),
    prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/courses">
            <ArrowLeft size={15} /> Back to All Courses
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {course.status === "Active" ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                  {course.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              {course.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <BookOpen size={15} className="text-slate-400" />
                {course.school?.name || "Unassigned School"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-slate-400" />
                {course.duration}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="text-slate-400" />
                Created {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <EditProgrammeDialog programme={course} schools={schools} />
            <ProgrammeActionsDropdown programme={course} schools={schools} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs h-12">
          <TabsTrigger value="overview" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#252D65] data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="curriculum" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#252D65] data-[state=active]:text-white">Curriculum</TabsTrigger>
          <TabsTrigger value="requirements" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#252D65] data-[state=active]:text-white">Entry Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Key Academic Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Level</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{course.level}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Duration</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{course.duration}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Application Fee</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">${course.applicationFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Syllabus & Course Modules</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs text-slate-500">Core and elective modules can be configured by faculty administrators.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Entry Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs text-slate-500">Minimum academic scores, English language benchmarks, and prerequisite qualifications.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
