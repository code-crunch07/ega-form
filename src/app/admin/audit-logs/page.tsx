import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Activity, Key, LogIn, Edit, Trash2 } from "lucide-react";

const LOGS = [
  { id: "log_1042", user: "Sarah Admin", action: "Status Change", resource: "Application APP001", timestamp: "2 mins ago", ip: "192.168.1.105", type: "update" },
  { id: "log_1041", user: "Jane Officer", action: "File Download", resource: "Transcript_JohnDoe.pdf", timestamp: "15 mins ago", ip: "10.0.0.45", type: "read" },
  { id: "log_1040", user: "Michael Finance", action: "Payment Marked Paid", resource: "Invoice INV-9902", timestamp: "1 hour ago", ip: "172.16.0.8", type: "update" },
  { id: "log_1039", user: "System", action: "Automated Email Sent", resource: "Template: Offer Letter", timestamp: "3 hours ago", ip: "127.0.0.1", type: "system" },
  { id: "log_1038", user: "Admin User", action: "User Login", resource: "Auth System", timestamp: "4 hours ago", ip: "192.168.1.105", type: "auth" },
  { id: "log_1037", user: "Sarah Admin", action: "Deleted Fee Rule", resource: "Fee Setting ID#32", timestamp: "1 day ago", ip: "192.168.1.105", type: "delete" },
];

export default function AdminAuditLogsPage() {
  const getIconForType = (type: string) => {
    switch (type) {
      case "update": return <Edit size={14} className="text-blue-500" />;
      case "read": return <Activity size={14} className="text-emerald-500" />;
      case "system": return <Activity size={14} className="text-purple-500" />;
      case "auth": return <LogIn size={14} className="text-amber-500" />;
      case "delete": return <Trash2 size={14} className="text-red-500" />;
      default: return <Activity size={14} className="text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">System Audit Logs</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Track all system activities, logins, and data modifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search logs..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Download size={16} className="text-neutral-500" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500 w-[100px]">Log ID</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Timestamp</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">User / Actor</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Action</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Resource</TableHead>
              <TableHead className="py-4 px-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LOGS.map((log) => (
              <TableRow key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors font-mono text-sm">
                <TableCell className="py-3 px-6 text-neutral-500">
                  {log.id}
                </TableCell>
                <TableCell className="py-3 text-neutral-500">
                  {log.timestamp}
                </TableCell>
                <TableCell className="py-3 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                  {log.user}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2 font-sans">
                    {getIconForType(log.type)}
                    <span className="text-neutral-700 dark:text-neutral-300">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-neutral-600 dark:text-neutral-400">
                  {log.resource}
                </TableCell>
                <TableCell className="py-3 px-6 text-right text-neutral-400">
                  {log.ip}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
