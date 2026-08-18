import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, LogIn, Edit, Trash2, Shield, CreditCard, FileText, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AuditLogsFilters } from "./audit-logs-filters";
import { ExportAuditCsvButton } from "./export-audit-csv-button";

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, action?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const action = resolvedSearchParams?.action;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { performedBy: { contains: search, mode: "insensitive" } },
      { details: { contains: search, mode: "insensitive" } },
    ];
  }

  if (action && action !== "all") {
    whereClause.action = { contains: action, mode: "insensitive" };
  }

  let logs = await prisma.auditLog.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  // Seed default audit logs if table is completely empty
  if (logs.length === 0 && !search && !action) {
    const existingCount = await prisma.auditLog.count();
    if (existingCount === 0) {
      await prisma.auditLog.createMany({
        data: [
          { action: "Status Change", performedBy: "Sarah Admin", details: "Application APP001 status changed to Under Review" },
          { action: "Document Verified", performedBy: "Jane Officer", details: "Passport and Academic Transcripts verified for APP-2026-004" },
          { action: "Payment Settled", performedBy: "Michael Finance", details: "Processed application fee payment of $50.00 via Stripe" },
          { action: "Interview Scheduled", performedBy: "Admissions Panel", details: "Scheduled interview for Jane Doe on July 25, 2026" },
          { action: "User Login", performedBy: "admin@educare.com", details: "Authenticated from IP 192.168.1.105 (Web Portal)" },
          { action: "Fee Structure Modified", performedBy: "Super Admin", details: "Updated standard tuition fee for Business Administration" }
        ]
      });
      logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
  }

  const getIconForAction = (actionText: string) => {
    const act = actionText.toLowerCase();
    if (act.includes("status")) return <Edit size={14} className="text-blue-600" />;
    if (act.includes("payment") || act.includes("fee")) return <CreditCard size={14} className="text-emerald-600" />;
    if (act.includes("login") || act.includes("auth")) return <LogIn size={14} className="text-amber-600" />;
    if (act.includes("delete")) return <Trash2 size={14} className="text-red-600" />;
    if (act.includes("interview")) return <Calendar size={14} className="text-purple-600" />;
    if (act.includes("document") || act.includes("file")) return <FileText size={14} className="text-indigo-600" />;
    return <Activity size={14} className="text-slate-500" />;
  };

  const getBadgeColor = (actionText: string) => {
    const act = actionText.toLowerCase();
    if (act.includes("status")) return "bg-blue-50 text-[#252D65] border-blue-200";
    if (act.includes("payment") || act.includes("fee")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (act.includes("login") || act.includes("auth")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (act.includes("delete")) return "bg-red-50 text-red-700 border-red-200";
    if (act.includes("interview")) return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">System Audit Logs</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track all system activities, administrative logins, and data modifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportAuditCsvButton logs={logs} />
        </div>
      </div>

      <AuditLogsFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[140px]">Log ID</TableHead>
              <TableHead className="py-4 font-bold text-slate-700 w-[180px]">Timestamp</TableHead>
              <TableHead className="py-4 font-bold text-slate-700 w-[200px]">User / Actor</TableHead>
              <TableHead className="py-4 font-bold text-slate-700 w-[180px]">Action</TableHead>
              <TableHead className="py-4 px-6 font-bold text-slate-700">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-400 font-medium">
                  No system audit records found matching the search/filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6 font-mono text-xs text-slate-500">
                    LOG-{log.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-600 font-medium">
                    {new Date(log.createdAt).toLocaleString('en-GB', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#252D65]">
                      <span>{log.performedBy || "System"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      {getIconForAction(log.action)}
                      <Badge variant="outline" className={`text-[11px] font-semibold px-2 py-0.5 ${getBadgeColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-6 text-xs text-slate-600 font-normal">
                    {log.details || "—"}
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
