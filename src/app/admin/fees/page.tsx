import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddFeeDialog } from "./add-fee-dialog";

export default async function AdminFeesPage() {
  let fees = await prisma.fee.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  if (fees.length === 0) {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Fee Structures</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Configure global rules and specific exceptions for application fees.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search fees..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <AddFeeDialog />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Fee Name</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Type</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applies To</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <TableCell className="py-3 px-6">
                  <Link href={`/admin/fees/${fee.id}`} className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {fee.name}
                  </Link>
                </TableCell>
                <TableCell className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  ${fee.amount.toFixed(2)} {fee.currency}
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{fee.type}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{fee.appliesTo}</span>
                </TableCell>
                <TableCell className="py-3">
                  {fee.status === "Active" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/20 dark:text-emerald-400 dark:border-neutral-800 shadow-sm px-2.5 py-0.5">
                      {fee.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 px-6 text-right">
                  <div className="flex justify-end items-center gap-1.5">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Link href={`/admin/fees/${fee.id}`}>
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
