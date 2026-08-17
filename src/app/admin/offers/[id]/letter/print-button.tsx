"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()} 
      className="gap-2 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold text-xs shadow-md"
    >
      <Printer size={16} /> Print / Save as PDF
    </Button>
  );
}
