import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddProgrammeDialog } from "./add-programme-dialog";
import { EditProgrammeDialog } from "./edit-programme-dialog";
import { ProgrammeActionsDropdown } from "./programme-actions-dropdown";
import { ProgrammesFilters } from "./programmes-filters";

export default async function AdminProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, school?: string, level?: string, status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const school = resolvedSearchParams?.school;
  const level = resolvedSearchParams?.level;
  const status = resolvedSearchParams?.status;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { code: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { school: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (school && school !== "all") {
    whereClause.schoolId = school;
  }

  if (level && level !== "all") {
    whereClause.level = { contains: level, mode: "insensitive" };
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  const [programmes, schools] = await Promise.all([
    prisma.programme.findMany({
      where: whereClause,
      include: { school: true },
      orderBy: { code: 'asc' }
    }),
    prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Programmes</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage all available courses and degrees.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddProgrammeDialog schools={schools} />
        </div>
      </div>

      <ProgrammesFilters schools={schools} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="w-[120px] font-bold text-slate-700">Code</TableHead>
              <TableHead className="font-bold text-slate-700">Name</TableHead>
              <TableHead className="font-bold text-slate-700">School</TableHead>
              <TableHead className="font-bold text-slate-700">Level</TableHead>
              <TableHead className="font-bold text-slate-700">Duration</TableHead>
              <TableHead className="font-bold text-slate-700">App Fee</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-700 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-32 text-slate-400 font-medium">
                  No programmes found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              programmes.map((prog) => (
                <TableRow key={prog.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="font-bold font-mono text-xs text-slate-600">{prog.code}</TableCell>
                  <TableCell className="font-bold text-sm text-[#252D65]">{prog.name}</TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">{prog.school?.name || "Unassigned"}</TableCell>
                  <TableCell className="text-xs text-slate-700">{prog.level}</TableCell>
                  <TableCell className="text-xs text-slate-500">{prog.duration}</TableCell>
                  <TableCell className="text-xs font-semibold text-slate-800">${prog.applicationFee}</TableCell>
                  <TableCell>
                    {prog.status === "Active" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditProgrammeDialog programme={prog} schools={schools} />
                      <ProgrammeActionsDropdown programme={prog} schools={schools} />
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
