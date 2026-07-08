"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/admin";

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
    </>
  );
}
