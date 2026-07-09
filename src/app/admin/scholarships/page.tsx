import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { AddScholarshipDialog } from "./add-scholarship-dialog";
import { Edit, MoreHorizontal } from "lucide-react";

export default async function AdminScholarshipsPage() {
  let scholarships = await prisma.scholarship.findMany({
    orderBy: { name: 'asc' }
  });

  if (scholarships.length === 0) {
    // Seed initial scholarships
    await prisma.scholarship.createMany({
      data: [
        { name: "Presidential Scholarship", description: "Full tuition waiver for top 5% outstanding academic students.", amount: 100.0, status: "Active" },
        { name: "Global Diversity Award", description: "Partial tuition fee discount of 30% for international students.", amount: 30.0, status: "Active" },
        { name: "STEM Excellence Scholarship", description: "Fixed award of $10,000 for undergraduate students in Science & Tech.", amount: 10000.0, status: "Active" },
        { name: "Need-Based Financial Aid", description: "Flexible financial assistance for students based on documented financial need.", amount: 50.0, status: "Active" }
      ]
    });
    scholarships = await prisma.scholarship.findMany({
      orderBy: { name: 'asc' }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Scholarships</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Manage applicant scholarships and awards.</p>
        </div>
        <div className="flex gap-2">
          <AddScholarshipDialog />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Name & Description</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Waiver / Award Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Created Date</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-neutral-500">
                  No scholarships configured in the database.
                </TableCell>
              </TableRow>
            ) : (
              scholarships.map((sch) => (
                <TableRow key={sch.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                  <TableCell className="py-3 px-6 max-w-[300px]">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-neutral-950 dark:text-white">{sch.name}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{sch.description || "No description provided."}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-medium text-sm text-neutral-700 dark:text-neutral-300">
                    {sch.amount !== null ? (
                      sch.amount <= 100 ? `${sch.amount}% Waiver` : `$${sch.amount.toLocaleString()}`
                    ) : "N/A"}
                  </TableCell>
                  <TableCell className="py-3">
                    {sch.status === "Active" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/20 dark:text-neutral-400 dark:border-neutral-800 shadow-sm px-2.5 py-0.5">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-neutral-500 text-sm">
                    {new Date(sch.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                        <Edit size={16} />
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
