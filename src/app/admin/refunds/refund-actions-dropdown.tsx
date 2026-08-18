"use client";

import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, FileText, CheckCircle2, XCircle, Clock, Trash2, Loader2, RotateCcw } from "lucide-react";
import { updateRefundStatus, deleteRefund } from "@/app/actions/admin";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RefundActionsDropdownProps {
  refund: {
    id: string;
    invoiceNumber: string;
    status: string;
    applicationId: string;
  };
}

export function RefundActionsDropdown({ refund }: RefundActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStatus = async (newStatus: "Approved" | "Rejected" | "Pending") => {
    setIsProcessing(true);
    const res = await updateRefundStatus(refund.id, newStatus);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete refund request #${refund.id.slice(0, 8)}? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteRefund(refund.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/refunds");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={isProcessing}
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="More actions"
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : (
            <MoreHorizontal size={16} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white border-slate-200 shadow-xl p-1.5 font-jost text-left">
        <Link href={`/admin/refunds/${refund.id}`} className="w-full">
          <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
            <Eye className="mr-2 h-4 w-4 text-slate-400" />
            <span>View Refund Case</span>
          </DropdownMenuItem>
        </Link>

        {refund.applicationId && (
          <Link href={`/admin/applications/${refund.applicationId}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <FileText className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Application</span>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        {refund.status !== "Approved" && (
          <DropdownMenuItem 
            onClick={() => handleSetStatus("Approved")}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Approve & Process Refund</span>
          </DropdownMenuItem>
        )}

        {refund.status !== "Rejected" && (
          <DropdownMenuItem 
            onClick={() => handleSetStatus("Rejected")}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 hover:text-rose-800"
          >
            <XCircle className="mr-2 h-4 w-4 text-rose-500" />
            <span>Reject Refund</span>
          </DropdownMenuItem>
        )}

        {refund.status !== "Pending" && (
          <DropdownMenuItem 
            onClick={() => handleSetStatus("Pending")}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
          >
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            <span>Mark as Pending Review</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <DropdownMenuItem 
          onClick={handleDelete}
          className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete Request</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
