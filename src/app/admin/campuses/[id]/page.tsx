import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  Phone, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users
} from "lucide-react";
import { notFound } from "next/navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const CAMPUSES = [
  { id: "c1", name: "Main Campus", country: "United States", city: "New York", capacity: 15000, status: "Active", address: "123 University Ave, NY 10012", phone: "+1 (555) 123-4567", email: "maincampus@university.edu" },
  { id: "c2", name: "Downtown Annex", country: "United States", city: "New York", capacity: 3000, status: "Active", address: "45 Broadway St, NY 10004", phone: "+1 (555) 987-6543", email: "downtown@university.edu" },
  { id: "c3", name: "Europe Hub", country: "United Kingdom", city: "London", capacity: 5000, status: "Active", address: "80 Strand, London WC2R 0RL", phone: "+44 20 7946 0958", email: "europe@university.edu" },
  { id: "c4", name: "Asia Tech Center", country: "Singapore", city: "Singapore", capacity: 4500, status: "Under Construction", address: "10 Kent Ridge Crescent", phone: "+65 6516 6666", email: "asia@university.edu" },
];

export default async function CampusDetailView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const campusId = resolvedParams.id;

  const campus = CAMPUSES.find(c => c.id === campusId);

  if (!campus) {
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
                CAMPUS-{campus.id.toUpperCase()}
              </span>
              {campus.status === "Active" ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-none px-2.5 font-semibold shadow-2xs">Active</Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border-none px-2.5 font-semibold shadow-2xs">{campus.status}</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
              {campus.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-neutral-500 text-sm font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-neutral-400" />
                {campus.city}, {campus.country}
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-neutral-400" />
                Capacity: {campus.capacity.toLocaleString()} Students
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
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
                <DropdownMenuItem className="gap-2 text-red-600 font-medium">
                  <Trash2 size={15} /> Delete Campus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-px mb-6 overflow-x-auto w-full custom-scrollbar bg-transparent">
          <TabsTrigger value="overview" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><MapPin size={16}/> Overview</TabsTrigger>
          <TabsTrigger value="facilities" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Building size={16}/> Facilities</TabsTrigger>
          <TabsTrigger value="contact" className="inline-flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-sm font-bold text-neutral-400 hover:text-neutral-700 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 transition-all cursor-pointer whitespace-nowrap bg-transparent shadow-none rounded-none"><Phone size={16}/> Contact & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Campus Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Region</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{campus.city}, {campus.country}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Physical Address</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{campus.address}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total Capacity</p>
                  <p className="font-semibold text-sm text-neutral-700 mt-1">{campus.capacity.toLocaleString()} Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Facilities & Resources</CardTitle>
              <CardDescription className="text-xs font-semibold text-neutral-400">Libraries, labs, and dormitories.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Facility data has not been added for this campus.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="m-0 focus-visible:outline-none">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Main Phone</p>
                  <p className="font-semibold text-sm text-blue-600 mt-1">{campus.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-sm text-blue-600 mt-1">{campus.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
