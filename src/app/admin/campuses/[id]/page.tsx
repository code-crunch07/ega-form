import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  Phone, 
  Edit,
  Users,
  ArrowLeft,
  Mail
} from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EditCampusDialog } from "../edit-campus-dialog";
import { CampusActionsDropdown } from "../campus-actions-dropdown";

export default async function CampusDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const campusId = resolvedParams.id;

  const campus = await prisma.campus.findUnique({
    where: { id: campusId }
  });

  if (!campus) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 font-jost text-left">
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-[#252D65] -ml-2 mb-2 font-bold text-xs">
          <Link href="/admin/campuses">
            <ArrowLeft size={15} /> Back to All Campuses
          </Link>
        </Button>
      </div>

      {/* Detail Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                CAMPUS-{campus.id.substring(0, 6).toUpperCase()}
              </span>
              {campus.status === "Active" ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active
                </Badge>
              ) : campus.status === "Under Construction" ? (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Under Construction
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 px-2.5 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                  {campus.status}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
              {campus.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs font-medium pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <MapPin size={15} className="text-slate-400" />
                {campus.city}, {campus.country}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Users size={15} className="text-slate-400" />
                Capacity: {campus.capacity.toLocaleString()} Students
              </span>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 lg:self-center">
            <EditCampusDialog 
              campus={campus} 
              trigger={
                <Button className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs px-5 h-11 transition-all">
                  <Edit size={16} /> Edit Details
                </Button>
              }
            />
            <CampusActionsDropdown campus={campus} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-slate-200 pb-px mb-6 overflow-x-auto w-full bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MapPin size={15}/> Overview</TabsTrigger>
          <TabsTrigger value="facilities" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Building size={15}/> Facilities & Amenities</TabsTrigger>
          <TabsTrigger value="contact" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-xs font-bold text-slate-400 hover:text-slate-700 data-[state=active]:border-[#252D65] data-[state=active]:text-[#252D65] transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Phone size={15}/> Contact & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Campus Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Location</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{campus.city}, {campus.country}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Physical Address</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{campus.address || "Standard Campus Grounds"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Student Capacity</p>
                  <p className="font-bold text-sm text-slate-900 mt-1">{campus.capacity.toLocaleString()} Enrolled Max</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Available Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Building className="text-[#252D65]" size={20} />
                  <div>
                    <p className="font-bold text-xs text-slate-900">Lecture Halls & Theatres</p>
                    <p className="text-[11px] text-slate-500">Equipped with digital presentation suites</p>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Building className="text-[#252D65]" size={20} />
                  <div>
                    <p className="font-bold text-xs text-slate-900">High-Tech Computing Labs</p>
                    <p className="text-[11px] text-slate-500">Dedicated computer clusters and research stations</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="m-0 focus-visible:outline-none">
          <Card className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">Campus Administrative Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase font-mono">Direct Phone</p>
                    <p className="font-bold text-xs text-slate-800 mt-0.5">{campus.phone || "No phone listed"}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase font-mono">Email Inquiries</p>
                    <p className="font-bold text-xs text-slate-800 mt-0.5">{campus.email || "admissions@university.edu"}</p>
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
