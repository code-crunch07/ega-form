"use client";

import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

export function PrintButton() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        onClick={handleDownload} 
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <Download size={16} /> Download PDF
      </Button>

      <Button 
        onClick={handleDownload} 
        className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <Printer size={16} /> Print / Save as PDF
      </Button>
    </div>
  );
}
