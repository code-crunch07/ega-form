"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  details: string | null;
  createdAt: Date | string;
}

export function ExportAuditCsvButton({ logs }: { logs: AuditLogEntry[] }) {
  const handleExport = () => {
    if (!logs || logs.length === 0) {
      alert("No logs available to export.");
      return;
    }

    const headers = ["Log ID", "Timestamp", "User / Performed By", "Action", "Details"];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString('en-GB')}"`,
      `"${(l.performedBy || 'System').replace(/"/g, '""')}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className="h-11 rounded-xl px-4 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs gap-2 shadow-2xs transition-all"
    >
      <Download size={15} className="text-slate-500" />
      <span>Export CSV</span>
    </Button>
  );
}
