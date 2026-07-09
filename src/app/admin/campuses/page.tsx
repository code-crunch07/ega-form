import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, MoreHorizontal, MapPin } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { AddCampusDialog } from "./add-campus-dialog";

export default async function AdminCampusesPage() {
  let campuses = await prisma.campus.findMany({
    orderBy: { name: 'asc' }
  });

  if (campuses.length === 0) {
    // Seed initial campuses
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Campuses</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage global campus locations, facilities, and physical capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search campuses..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <AddCampusDialog />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Campus Name</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Location</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Capacity</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <TableCell className="py-3 px-6">
                  <Link href={`/admin/campuses/${campus.id}`} className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {campus.name}
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <MapPin size={14} className="text-neutral-400" />
                    {campus.city}, {campus.country}
                  </div>
                </TableCell>
                <TableCell className="py-3 font-medium text-sm text-neutral-700 dark:text-neutral-300">
                  {campus.capacity.toLocaleString()} Students
                </TableCell>
                <TableCell className="py-3">
                  {campus.status === "Active" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 shadow-sm px-2.5 py-0.5">
                      {campus.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 px-6 text-right">
                  <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Link href={`/admin/campuses/${campus.id}`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
