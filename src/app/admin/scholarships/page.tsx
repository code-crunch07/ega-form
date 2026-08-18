import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { AddScholarshipDialog } from "./add-scholarship-dialog";
import { EditScholarshipDialog } from "./edit-scholarship-dialog";
import { ScholarshipActionsDropdown } from "./scholarship-actions-dropdown";

export default async function AdminScholarshipsPage() {
  let scholarships = await prisma.scholarship.findMany({
    orderBy: { name: 'asc' }
  });

  if (scholarships.length === 0) {
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
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Scholarships</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage applicant scholarships and awards.</p>
        </div>
        <div className="flex gap-2">
          <AddScholarshipDialog />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-700">Name & Description</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Waiver / Award Amount</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Created Date</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-bold uppercase tracking-wider text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-400 font-medium">
                  No scholarships configured in the database.
                </TableCell>
              </TableRow>
            ) : (
              scholarships.map((sch) => (
                <TableRow key={sch.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6 max-w-[320px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-sm text-slate-900">{sch.name}</span>
                      <span className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{sch.description || "No description provided."}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-semibold text-sm text-slate-800">
                    {sch.amount !== null ? (
                      sch.amount <= 100 ? `${sch.amount}% Waiver` : `$${sch.amount.toLocaleString()}`
                    ) : "N/A"}
                  </TableCell>
                  <TableCell className="py-3">
                    {sch.status === "Active" ? (
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
                  <TableCell className="py-3 text-slate-500 text-xs font-medium">
                    {new Date(sch.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditScholarshipDialog scholarship={sch} />
                      <ScholarshipActionsDropdown scholarship={sch} />
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
