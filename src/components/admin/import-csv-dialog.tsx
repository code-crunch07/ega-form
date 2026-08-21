"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2,
  Table as TableIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColumnDef {
  key: string;
  label: string;
  required?: boolean;
}

interface ImportCsvDialogProps {
  title: string;
  description: string;
  templateFileName: string;
  columns: ColumnDef[];
  sampleRows: Record<string, string>[];
  onImport: (rows: any[]) => Promise<{ success?: boolean; imported?: number; updated?: number; total?: number; error?: string }>;
  trigger?: React.ReactNode;
}

export function ImportCsvDialog({
  title,
  description,
  templateFileName,
  columns,
  sampleRows,
  onImport,
  trigger
}: ImportCsvDialogProps) {
  const [open, setOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imported: number; updated: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const headers = columns.map(c => c.key).join(",");
    const rows = sampleRows.map(row => 
      columns.map(c => `"${(row[c.key] || "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", templateFileName.endsWith(".csv") ? templateFileName : `${templateFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== "");
        if (lines.length < 2) {
          setError("CSV file is empty or missing data rows.");
          return;
        }

        // Parse header
        const rawHeaders = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
        const dataRows: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple CSV splitter handling quoted values
          const rowValues: string[] = [];
          let insideQuotes = false;
          let currentVal = "";

          for (let char of lines[i]) {
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              rowValues.push(currentVal.trim());
              currentVal = "";
            } else {
              currentVal += char;
            }
          }
          rowValues.push(currentVal.trim());

          const rowObj: Record<string, any> = {};
          rawHeaders.forEach((header, idx) => {
            const cleanVal = (rowValues[idx] || "").replace(/^"|"$/g, '').trim();
            rowObj[header] = cleanVal;
          });

          if (Object.values(rowObj).some(v => v !== "")) {
            dataRows.push(rowObj);
          }
        }

        if (dataRows.length === 0) {
          setError("No valid data rows found in CSV.");
          return;
        }

        setParsedRows(dataRows);
      } catch (err: any) {
        setError("Failed to parse CSV file: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsLoading(true);
    setError(null);

    const res = await onImport(parsedRows);
    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setResult({
        imported: res?.imported || 0,
        updated: res?.updated || 0,
        total: res?.total || parsedRows.length
      });
      setTimeout(() => {
        setOpen(false);
        setParsedRows([]);
        setFileName(null);
        setResult(null);
      }, 2500);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="w-fit inline-block">
          {trigger}
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setOpen(true)}
          className="h-11 px-4 rounded-xl border-slate-200 text-slate-700 hover:text-[#252D65] hover:bg-slate-50 gap-2 text-xs font-bold shadow-2xs"
        >
          <FileSpreadsheet size={16} className="text-[#252D65]" />
          <span>Import CSV / Excel</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200 font-jost text-left">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-[#252D65]" />
                  {title}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </Button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Step 1: Download Template */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">1. Download Blank Spreadsheet Template</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Use our pre-configured column headers to ensure accurate import.</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadTemplate}
                  className="rounded-xl border-slate-200 bg-white gap-1.5 text-xs font-bold text-slate-700 hover:text-[#252D65]"
                >
                  <Download size={14} />
                  <span>Download Template</span>
                </Button>
              </div>

              {/* Step 2: Upload CSV */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">2. Upload Your Populated CSV File</h4>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#252D65] bg-slate-50/50 hover:bg-[#252D65]/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  <div className="h-12 w-12 rounded-full bg-[#252D65]/10 flex items-center justify-center text-[#252D65]">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {fileName ? fileName : "Click to browse or drop your CSV file here"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports standard .csv format exported from Excel or Google Sheets</p>
                  </div>
                </div>
              </div>

              {/* Status / Error feedback */}
              {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium animate-in fade-in duration-300">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>
                    Successfully imported {result.imported} new records ({result.updated} existing records updated).
                  </span>
                </div>
              )}

              {/* Preview Table */}
              {parsedRows.length > 0 && !result && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TableIcon size={14} className="text-[#252D65]" />
                      Data Preview ({parsedRows.length} Rows Detected)
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">Showing first {Math.min(5, parsedRows.length)} rows</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-x-auto max-h-48">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          {columns.map(col => (
                            <th key={col.key} className="py-2 px-3 whitespace-nowrap">{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                        {parsedRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            {columns.map(col => (
                              <td key={col.key} className="py-2 px-3 whitespace-nowrap font-mono">{row[col.key] || "—"}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200">
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirmImport} 
                disabled={isLoading || parsedRows.length === 0 || !!result}
                className="bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl h-11 px-6 shadow-sm gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Import {parsedRows.length > 0 ? `${parsedRows.length} Records` : "Data"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
