"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/admin";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Printer, 
  Download, 
  FileText, 
  ArrowLeftCircle, 
  FileSearch, 
  RefreshCcw 
} from "lucide-react";

export function DetailActions({ appId }: { appId: string }) {
  const handleStatusUpdate = async (status: string) => {
    const res = await updateApplicationStatus(appId, status);
    if (res.error) {
      alert("Error updating status: " + res.error);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2 border-red-200/60 text-red-600 bg-red-50/30 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-400 font-bold rounded-xl px-5 h-11 transition-all duration-300"
        onClick={() => handleStatusUpdate("Rejected")}
      >
        <XCircle size={16} /> Reject
      </Button>
      <Button 
        className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold rounded-xl shadow-xs px-6 h-11 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5"
        onClick={() => handleStatusUpdate("Offered")}
      >
        <CheckCircle size={16} /> Approve & Issue Offer
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-neutral-200 dark:border-neutral-800">
            <MoreHorizontal size={16} className="text-neutral-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-neutral-200 dark:border-neutral-800">
          <DropdownMenuItem onClick={() => handleStatusUpdate("Returned")} className="gap-2 text-amber-600 font-medium">
            <ArrowLeftCircle size={15} /> Return to Applicant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusUpdate("Pending Documents")} className="gap-2 text-indigo-600 font-medium">
            <FileSearch size={15} /> Request More Documents
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
            <RefreshCcw size={15} /> Change Status
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800" />
          
          <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
            <FileText size={15} /> Generate PDF
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
            <Download size={15} /> Download Application
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-neutral-600 dark:text-neutral-300 font-medium">
            <Printer size={15} /> Print Record
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
