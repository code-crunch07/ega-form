import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  BookOpen, 
  Users, 
  MoreHorizontal,
  Edit,
  Trash2,
  Mail
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Detail Header Card */}
      <div className="bg-slate-50/50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200/40 dark:border-neutral-700/40">
                FACULTY-{school.id.substring(0, 6).toUpperCase()}
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Active</Badge>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
              {school.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-neutral-400" />
                {school.programmes.length} Programs
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Building2 size={15} className="text-neutral-400" />
                Main Campus
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
              <Edit size={16} /> Edit Details
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
                  <MoreHorizontal size={16} className="text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
                <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
                  <Mail size={15} /> Contact Faculty Head
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
                <DropdownMenuItem className="gap-2 text-red-600 font-medium">
                  <Trash2 size={15} /> Delete Faculty
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Building2 size={16}/> Overview</TabsTrigger>
          <TabsTrigger value="programs" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><BookOpen size={16}/> Programs</TabsTrigger>
          <TabsTrigger value="staff" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Users size={16}/> Staff & Faculty</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Faculty Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Description</p>
                  <p className="font-medium text-sm text-neutral-700 mt-2 leading-relaxed">{school.description || "No description provided for this faculty."}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Dean / Head of Faculty</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">Not assigned</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Contact Email</p>
                    <p className="font-semibold text-sm text-neutral-700 mt-1">contact@{school.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Offered Programs</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">All courses offered under this faculty.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {school.programmes.length === 0 ? (
                <p className="text-sm text-neutral-500">No programs currently assigned to this faculty.</p>
              ) : (
                <div className="space-y-4">
                  {school.programmes.map(prog => (
                    <div key={prog.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="font-bold text-sm text-indigo-600">{prog.name}</p>
                      <p className="text-xs font-medium text-neutral-500 mt-1">{prog.code} • {prog.level} • {prog.duration}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Staff & Faculty Members</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">No staff members assigned to this faculty yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
