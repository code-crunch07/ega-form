import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { 
      application: {
        include: {
          user: {
            include: { profile: true }
          }
        }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments Ledger</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Track application fees and invoice statuses.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <Input placeholder="Search invoice or applicant..." className="pl-10 w-full md:w-[300px]" />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>Invoice #</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-neutral-500">
                  No payments found in the database.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const applicantName = payment.application?.user?.profile 
                  ? `${payment.application.user.profile.firstName || ''} ${payment.application.user.profile.lastName || ''}`.trim()
                  : payment.application?.user?.name || "Unknown";

                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-neutral-500">{payment.invoiceNumber}</TableCell>
                    <TableCell className="font-bold">{applicantName}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.gateway}</TableCell>
                    <TableCell className="text-neutral-500">{payment.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {payment.status === "Paid" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Paid</Badge>}
                      {payment.status === "Pending" && <Badge variant="outline" className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>}
                      {payment.status === "Failed" && <Badge variant="destructive">Failed</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "Paid" ? (
                        <Button variant="ghost" size="sm" className="h-8 text-blue-600 gap-2">
                          <Download size={14} /> PDF
                        </Button>
                      ) : (
                        <span className="text-neutral-400 text-xs mr-4">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
