"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  FileCheck2,
  FileSpreadsheet,
  Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DocumentItem {
  id: string;
  filename: string | null;
  type: string;
  url: string;
  createdAt?: string | Date;
}

export function DocumentsViewer({ documents }: { documents: DocumentItem[] }) {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [statuses, setStatuses] = useState<Record<string, "Approved" | "Rejected" | "Uploaded">>({});

  // Close preview modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedDoc(null);
      }
    };
    if (selectedDoc) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc]);

  const handleStatusChange = (id: string, status: "Approved" | "Rejected") => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const isPdf = (doc: DocumentItem) => {
    const name = (doc.filename || "").toLowerCase();
    const url = (doc.url || "").toLowerCase();
    return name.endsWith(".pdf") || url.includes("application/pdf") || url.endsWith(".pdf");
  };

  const isImage = (doc: DocumentItem) => {
    const name = (doc.filename || "").toLowerCase();
    const url = (doc.url || "").toLowerCase();
    return (
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".webp") ||
      url.includes("image/")
    );
  };

  return (
    <>
      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => {
            const currentStatus = statuses[doc.id] || "Uploaded";
            return (
              <div 
                key={doc.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-neutral-200/60 rounded-xl dark:border-neutral-800 hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition-all gap-4 bg-white dark:bg-neutral-950"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    {isPdf(doc) ? (
                      <FileText size={20} className="text-rose-600 dark:text-rose-400" />
                    ) : isImage(doc) ? (
                      <ImageIcon size={20} className="text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <FileText size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="font-bold text-sm text-neutral-850 hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1.5 text-left truncate"
                      title="Click to Quick View"
                    >
                      <span className="truncate">{doc.filename || `${doc.type} Document`}</span>
                      <Eye size={13} className="text-indigo-500 shrink-0" />
                    </button>
                    <p className="text-xs text-neutral-400 font-semibold">{doc.type || "Certificate / Academic Document"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end shrink-0">
                  {currentStatus === "Approved" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 border font-semibold">
                      ✓ Approved
                    </Badge>
                  ) : currentStatus === "Rejected" ? (
                    <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 border font-semibold">
                      ✕ Rejected
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-neutral-800 dark:text-neutral-400 border font-semibold">
                      Uploaded
                    </Badge>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Quick View Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDoc(doc)}
                      className="h-8 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800 transition-all gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Eye size={13} />
                      Quick View
                    </Button>

                    {/* Download Button */}
                    <a
                      href={doc.url}
                      download={doc.filename || "Document"}
                      className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-all shadow-3xs"
                    >
                      <Download size={13} />
                      Download
                    </a>

                    {/* Approve Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(doc.id, "Approved")}
                      className="h-8 px-2.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-900 dark:text-emerald-400 font-semibold rounded-lg transition-all text-xs"
                    >
                      Approve
                    </Button>

                    {/* Reject Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(doc.id, "Rejected")}
                      className="h-8 px-2.5 text-rose-700 border-rose-200 hover:bg-rose-50 hover:border-rose-300 dark:border-rose-900 dark:text-rose-400 font-semibold rounded-lg transition-all text-xs"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-neutral-500 py-4">No documents uploaded for this application.</p>
        )}
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedDoc && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedDoc(null)}
        >
          <div 
            className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900/70">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 shrink-0">
                  <Eye size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {selectedDoc.filename || "Document Preview"}
                    </h3>
                    <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 shrink-0">
                      {selectedDoc.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-medium truncate">Quick View Preview</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedDoc.url}
                  download={selectedDoc.filename || "Document"}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
                >
                  <Download size={13} />
                  Download
                </a>
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-slate-100 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300 transition-all"
                  title="Open in new window"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 bg-slate-100/60 dark:bg-neutral-950 overflow-hidden relative">
              {isPdf(selectedDoc) ? (
                <iframe
                  src={selectedDoc.url}
                  title={selectedDoc.filename || "PDF Preview"}
                  className="w-full h-full border-0"
                />
              ) : isImage(selectedDoc) ? (
                <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
                  <img
                    src={selectedDoc.url}
                    alt={selectedDoc.filename || "Image Preview"}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-neutral-800 dark:text-neutral-100">
                      {selectedDoc.filename || "Uploaded File"}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 max-w-md">
                      This document format ({selectedDoc.type}) can be downloaded directly to view on your device.
                    </p>
                  </div>
                  <a
                    href={selectedDoc.url}
                    download={selectedDoc.filename || "Document"}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C315E] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
                  >
                    <Download size={14} /> Download {selectedDoc.filename || "Document"}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
