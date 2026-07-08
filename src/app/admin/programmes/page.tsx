import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { AddProgrammeDialog } from "./add-programme-dialog";

export default async function AdminProgrammesPage() {
  const [programmes, schools] = await Promise.all([
    prisma.programme.findMany({
      include: { school: true },
      orderBy: { code: 'asc' }
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
          <h1 className="text-3xl font-bold tracking-tight">Programmes</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Manage all available courses and degrees.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input placeholder="Search code or name..." className="pl-10 w-full" />
          </div>
          <AddProgrammeDialog schools={schools} />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>App Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24 text-neutral-500">
                  No programmes found in the database.
                </TableCell>
              </TableRow>
            ) : (
              programmes.map((prog) => (
                <TableRow key={prog.id}>
                  <TableCell className="font-bold text-neutral-500">{prog.code}</TableCell>
                  <TableCell className="font-medium text-blue-600">{prog.name}</TableCell>
                  <TableCell>{prog.school?.name || "Unassigned"}</TableCell>
                  <TableCell>{prog.level}</TableCell>
                  <TableCell className="text-neutral-500">{prog.duration}</TableCell>
                  <TableCell>${prog.applicationFee}</TableCell>
                  <TableCell>
                    {prog.status === "Active" ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                    ) : (
                      <Badge className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100 border-none">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500"><Edit size={16} /></Button>
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
