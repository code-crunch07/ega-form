import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";

import { AddProgrammeDialog } from "../programmes/add-programme-dialog";
import { EditProgrammeDialog } from "../programmes/edit-programme-dialog";
import { ProgrammeActionsDropdown } from "../programmes/programme-actions-dropdown";
import { ProgrammesFilters } from "../programmes/programmes-filters";
import { ImportCoursesButton } from "./import-courses-button";
import { getStudyLevels } from "@/app/actions/admin";

export default async function AdminCoursesPage({
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

  const [courses, schools, studyLevels] = await Promise.all([
    prisma.programme.findMany({
      where: whereClause,
      include: {
        school: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    getStudyLevels()
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Courses (Programs)</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage academic programs, curriculums, and entry requirements.</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportCoursesButton />
          <AddProgrammeDialog schools={schools} studyLevels={studyLevels} />
        </div>
      </div>

      <ProgrammesFilters schools={schools} studyLevels={studyLevels} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700">Course Title & School</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Level</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Mode of Study</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Duration</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">App Fee</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-400 font-medium">
                  No courses/programs found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <div className="flex flex-col gap-0.5">
                      <Link href={`/admin/courses/${course.id}`} className="font-bold text-sm text-[#252D65] hover:text-[#1C224E]">
                        {course.name}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <BookOpen size={12} className="text-slate-400" />
                        <span>{course.school?.name || "Unassigned School"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-semibold text-slate-700">{course.level}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {course.modeOfStudy || "FT / PT"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock size={12} className="text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-semibold text-xs text-slate-800">
                    ${course.applicationFee}
                  </TableCell>
                  <TableCell className="py-3">
                    {course.status === "Active" ? (
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                         Active
                       </Badge>
                    ) : (
                       <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                         <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                         {course.status}
                       </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditProgrammeDialog programme={course} schools={schools} studyLevels={studyLevels} />
                      <ProgrammeActionsDropdown programme={course} schools={schools} />
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
