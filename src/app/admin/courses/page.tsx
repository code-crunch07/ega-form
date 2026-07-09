import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Edit, MoreHorizontal, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

import { AddProgrammeDialog } from "../programmes/add-programme-dialog";

export default async function AdminCoursesPage() {
  const [courses, schools] = await Promise.all([
    prisma.programme.findMany({
      include: {
        school: true,
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.school.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Courses (Programs)</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage academic programs, curriculums, and entry requirements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <Input 
              placeholder="Search programs..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-indigo-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <AddProgrammeDialog schools={schools} />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Code</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Title & School</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Level</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Duration</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-neutral-500">
                  No programs found in the database.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <TableCell className="py-3 px-6">
                    <span className="font-mono font-bold text-sm text-neutral-700 dark:text-neutral-300 bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700">
                      {course.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <Link href={`/admin/courses/${course.id}`} className="font-bold text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        {course.name}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <BookOpen size={13} className="text-neutral-400" />
                        {course.school?.name || "Unassigned School"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="font-medium text-sm text-neutral-700 dark:text-neutral-300">{course.level}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                      <Clock size={14} className="text-neutral-400" />
                      {course.duration}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    {course.status === "Active" ? (
                       <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">
                         Active
                       </Badge>
                    ) : (
                       <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/20 dark:text-neutral-400 dark:border-neutral-800 shadow-sm px-2.5 py-0.5">
                         {course.status}
                       </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                        <Link href={`/admin/courses/${course.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                        <MoreHorizontal size={16} />
                      </Button>
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
