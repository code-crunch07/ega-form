import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";

const REFUNDS = [
  { id: "ref_1", invoiceNumber: "INV-2026-042", applicant: "Sarah Connor", amount: 1500.00, requestDate: "2026-06-18", status: "Pending", reason: "Application Withdrawn" },
  { id: "ref_2", invoiceNumber: "INV-2026-015", applicant: "James Logan", amount: 50.00, requestDate: "2026-07-05", status: "Approved", reason: "Duplicate Payment" },
  { id: "ref_3", invoiceNumber: "INV-2026-088", applicant: "Natasha Romanoff", amount: 3500.00, requestDate: "2026-05-22", status: "Rejected", reason: "Past Refund Deadline" },
];

export default function AdminRefundsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Refund Requests</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage and process applicant refund requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search refunds..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Refund ID</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant / Invoice</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Request Date</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REFUNDS.map((ref) => (
              <TableRow key={ref.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <TableCell className="py-3 px-6">
                  <Link href={`/admin/refunds/${ref.id}`} className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {ref.id.toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{ref.applicant}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 font-mono">{ref.invoiceNumber}</p>
                </TableCell>
                <TableCell className="py-3 font-semibold text-neutral-800 dark:text-neutral-200">
                  ${ref.amount.toFixed(2)}
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{ref.requestDate}</span>
                </TableCell>
                <TableCell className="py-3">
                  {ref.status === "Approved" && <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Approved</Badge>}
                  {ref.status === "Pending" && <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 shadow-sm px-2.5 py-0.5">Pending Review</Badge>}
                  {ref.status === "Rejected" && <Badge variant="destructive" className="shadow-sm px-2.5 py-0.5">Rejected</Badge>}
                </TableCell>
                <TableCell className="py-3 px-6 text-right">
                  <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ref.status === "Pending" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg" title="Process Refund">
                        <RotateCcw size={16} />
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Link href={`/admin/refunds/${ref.id}`}>
                        <Eye size={16} />
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
