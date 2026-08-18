import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  BookOpen, 
  Users, 
  Edit,
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditSchoolDialog } from "../edit-school-dialog";
import { SchoolActionsDropdown } from "../school-actions-dropdown";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function SchoolDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const schoolId = resolvedParams.id;

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      programmes: true
    }
  });

  if (!school) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/schools">
            <ArrowLeft size={15} /> Back to All Schools
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                FACULTY-{school.id.substring(0, 6).toUpperCase()}
              </span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Active
              </Badge>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              {school.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <BookOpen size={15} className="text-slate-400" />
                {school.programmes.length} Academic Programmes
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Building2 size={15} className="text-slate-400" />
                Main Campus
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <EditSchoolDialog 
              school={school} 
              trigger={
                <Button className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                  <Edit size={16} /> Edit School
                </Button>
              }
            />
            <SchoolActionsDropdown school={school} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="programs" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><BookOpen size={15}/> Academic Programmes ({school.programmes.length})</TabsTrigger>
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Building2 size={15}/> Faculty Overview</TabsTrigger>
          <TabsTrigger value="staff" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Users size={15}/> Staff & Faculty</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="m-0 focus-visible:outline-none">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                  <TableHead className="font-bold text-slate-700">Code</TableHead>
                  <TableHead className="font-bold text-slate-700">Programme Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Study Level</TableHead>
                  <TableHead className="font-bold text-slate-700">Duration</TableHead>
                  <TableHead className="font-bold text-slate-700">Fee</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {school.programmes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-28 text-slate-400 font-medium">
                      No programmes registered under this faculty yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  school.programmes.map((prog) => (
                    <TableRow key={prog.id} className="hover:bg-slate-50/70 border-b border-slate-100">
                      <TableCell className="font-mono text-xs font-bold text-slate-600">{prog.code}</TableCell>
                      <TableCell className="font-bold text-xs text-[#252D65]">{prog.name}</TableCell>
                      <TableCell className="text-xs text-slate-700">{prog.level}</TableCell>
                      <TableCell className="text-xs text-slate-500">{prog.duration}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-800">${prog.applicationFee}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold">
                          {prog.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Faculty Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs text-slate-600 leading-relaxed">
                {school.description || "No specific faculty description provided."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Assigned Faculty Staff</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-xs text-slate-500">Staff members will appear here once assigned to this department.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
