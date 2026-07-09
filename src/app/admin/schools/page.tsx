import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit } from "lucide-react";
import Link from "next/link";

import { AddSchoolDialog } from "./add-school-dialog";

export default async function AdminSchoolsPage() {
  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: { programmes: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schools / Faculties</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Manage institutional faculties and departments.</p>
        </div>
        <AddSchoolDialog />
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>School Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Programmes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-neutral-500">
                  No schools found in the database.
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-bold">{school.name}</TableCell>
                  <TableCell className="text-neutral-500 max-w-xs truncate">{school.description || "-"}</TableCell>
                  <TableCell className="text-center font-bold text-blue-600">{school._count.programmes}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500">
                        <Link href={`/admin/schools/${school.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button>
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
