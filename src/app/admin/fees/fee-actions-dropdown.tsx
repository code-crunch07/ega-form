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
import { MoreHorizontal, Eye, Edit, CheckCircle2, Clock, Trash2, Loader2 } from "lucide-react";
import { updateFee, deleteFee } from "@/app/actions/admin";
import { EditFeeDialog } from "./edit-fee-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FeeActionsDropdownProps {
  fee: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    type: string;
    appliesTo: string;
    status: string;
  };
}

export function FeeActionsDropdown({ fee }: FeeActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleToggleStatus = async (newStatus: "Active" | "Draft" | "Inactive") => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", fee.name);
    formData.append("amount", fee.amount.toString());
    formData.append("currency", fee.currency || "USD");
    formData.append("type", fee.type);
    formData.append("appliesTo", fee.appliesTo);
    formData.append("status", newStatus);

    const res = await updateFee(fee.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete fee rule "${fee.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteFee(fee.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/fees");
      }
    }
  };

  return (
    <>
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
          <Link href={`/admin/fees/${fee.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Rule Details</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit Fee Rule</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {fee.status !== "Active" ? (
            <DropdownMenuItem 
              onClick={() => handleToggleStatus("Active")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Set as Active</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => handleToggleStatus("Draft")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              <span>Set as Draft</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Fee Rule</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditFeeDialog 
          fee={fee} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
