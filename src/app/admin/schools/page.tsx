import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddSchoolDialog } from "./add-school-dialog";
import { EditSchoolDialog } from "./edit-school-dialog";
import { SchoolActionsDropdown } from "./school-actions-dropdown";
import { SchoolsFilters } from "./schools-filters";

export default async function AdminSchoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }

  const schools = await prisma.school.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { programmes: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Schools / Faculties</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage institutional faculties and partner academic departments.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddSchoolDialog />
        </div>
      </div>

      <SchoolsFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="font-bold text-slate-700 w-[240px]">School Name</TableHead>
              <TableHead className="font-bold text-slate-700">Description</TableHead>
              <TableHead className="text-center font-bold text-slate-700 w-[140px]">Programmes</TableHead>
              <TableHead className="font-bold text-slate-700 w-[120px]">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-400 font-medium">
                  No schools found matching the search criteria.
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="font-bold text-sm text-slate-900">
                    <Link href={`/admin/schools/${school.id}`} className="hover:text-[#252D65] transition-colors">
                      {school.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-sm truncate">{school.description || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/admin/programmes?school=${school.id}`}>
                      <Badge variant="outline" className="font-bold text-xs bg-blue-50 text-[#252D65] border-blue-200 hover:bg-blue-100 cursor-pointer">
                        {school._count.programmes} Courses
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditSchoolDialog school={school} />
                      <SchoolActionsDropdown school={school} />
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
