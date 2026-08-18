import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddFeeDialog } from "./add-fee-dialog";
import { EditFeeDialog } from "./edit-fee-dialog";
import { FeeActionsDropdown } from "./fee-actions-dropdown";
import { FeesFilters } from "./fees-filters";

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string, type?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;
  const type = resolvedSearchParams?.type;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { appliesTo: { contains: search, mode: "insensitive" } },
      { type: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (type && type !== "all") {
    whereClause.type = type;
  }

  let fees = await prisma.fee.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' }
  });

  if (fees.length === 0 && !search && !status && !type) {
    await prisma.fee.createMany({
      data: [
        { name: "Standard Application Fee", amount: 50.00, currency: "USD", type: "Mandatory", appliesTo: "All Programs", status: "Active" },
        { name: "International Student Surcharge", amount: 250.00, currency: "USD", type: "Conditional", appliesTo: "International Applicants", status: "Active" },
        { name: "Late Registration Fee", amount: 100.00, currency: "USD", type: "Penalty", appliesTo: "Late Enrollments", status: "Active" },
        { name: "Medical School Application", amount: 150.00, currency: "USD", type: "Program Specific", appliesTo: "School of Medicine", status: "Draft" },
      ]
    });
    fees = await prisma.fee.findMany({
      orderBy: { updatedAt: 'desc' }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Fee Structures</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Configure global rules and specific exceptions for application fees.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddFeeDialog />
        </div>
      </div>

      <FeesFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[240px]">Fee Name</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Amount</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Type</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Applies To</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-400 font-medium">
                  No fee rules found matching the search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              fees.map((fee) => (
                <TableRow key={fee.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <Link href={`/admin/fees/${fee.id}`} className="font-bold text-sm text-[#252D65] hover:text-[#1C224E]">
                      {fee.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 font-bold text-xs text-slate-900">
                    ${fee.amount.toFixed(2)} {fee.currency}
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-semibold text-slate-600">{fee.type}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-medium text-slate-500">{fee.appliesTo}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    {fee.status === "Active" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </Badge>
                    ) : fee.status === "Draft" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        Draft
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        {fee.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditFeeDialog fee={fee} />
                      <FeeActionsDropdown fee={fee} />
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
