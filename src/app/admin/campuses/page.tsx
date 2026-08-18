import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddCampusDialog } from "./add-campus-dialog";
import { EditCampusDialog } from "./edit-campus-dialog";
import { CampusActionsDropdown } from "./campus-actions-dropdown";
import { CampusesFilters } from "./campuses-filters";

export default async function AdminCampusesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { country: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  let campuses = await prisma.campus.findMany({
    where: whereClause,
    orderBy: { name: 'asc' }
  });

  if (campuses.length === 0 && !search && !status) {
    // Seed initial campuses if DB is empty
    await prisma.campus.createMany({
      data: [
        { name: "Main Campus", country: "United States", city: "New York", capacity: 15000, status: "Active", address: "123 University Ave, NY 10012", phone: "+1 (555) 123-4567", email: "maincampus@university.edu" },
        { name: "Downtown Annex", country: "United States", city: "New York", capacity: 3000, status: "Active", address: "45 Broadway St, NY 10004", phone: "+1 (555) 987-6543", email: "downtown@university.edu" },
        { name: "Europe Hub", country: "United Kingdom", city: "London", capacity: 5000, status: "Active", address: "80 Strand, London WC2R 0RL", phone: "+44 20 7946 0958", email: "europe@university.edu" },
        { name: "Asia Tech Center", country: "Singapore", city: "Singapore", capacity: 4500, status: "Under Construction", address: "10 Kent Ridge Crescent", phone: "+65 6516 6666", email: "asia@university.edu" }
      ]
    });
    campuses = await prisma.campus.findMany({
      orderBy: { name: 'asc' }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Campuses</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage global campus locations, facilities, and physical capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddCampusDialog />
        </div>
      </div>

      <CampusesFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="font-bold text-slate-700 py-4 px-6 w-[240px]">Campus Name</TableHead>
              <TableHead className="font-bold text-slate-700">Location</TableHead>
              <TableHead className="font-bold text-slate-700">Capacity</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-400 font-medium">
                  No campuses found matching the search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              campuses.map((campus) => (
                <TableRow key={campus.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <Link href={`/admin/campuses/${campus.id}`} className="font-bold text-sm text-[#252D65] hover:text-[#1C224E]">
                      {campus.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <MapPin size={13} className="text-slate-400" />
                      {campus.city}, {campus.country}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-semibold text-xs text-slate-800">
                    {campus.capacity.toLocaleString()} Students
                  </TableCell>
                  <TableCell className="py-3">
                    {campus.status === "Active" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </Badge>
                    ) : campus.status === "Under Construction" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        Under Construction
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        {campus.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditCampusDialog campus={campus} />
                      <CampusActionsDropdown campus={campus} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
