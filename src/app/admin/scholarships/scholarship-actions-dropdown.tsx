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
import { MoreHorizontal, Edit, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { updateScholarship, deleteScholarship } from "@/app/actions/admin";
import { EditScholarshipDialog } from "./edit-scholarship-dialog";

interface ScholarshipActionsDropdownProps {
  scholarship: {
    id: string;
    name: string;
    description: string | null;
    amount: number | null;
    status: string;
  };
}

export function ScholarshipActionsDropdown({ scholarship }: ScholarshipActionsDropdownProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleToggleStatus = async () => {
    const nextStatus = scholarship.status === "Active" ? "Inactive" : "Active";
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", scholarship.name);
    formData.append("description", scholarship.description || "");
    formData.append("amount", (scholarship.amount || 0).toString());
    formData.append("status", nextStatus);

    const res = await updateScholarship(scholarship.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete scholarship "${scholarship.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteScholarship(scholarship.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
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
        <DropdownMenuContent align="end" className="w-52 rounded-xl bg-white border-slate-200 shadow-xl p-1.5 font-jost text-left">
          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleToggleStatus}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            {scholarship.status === "Active" ? (
              <>
                <XCircle className="mr-2 h-4 w-4 text-amber-500" />
                <span>Mark as Inactive</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                <span>Mark as Active</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Scholarship</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditScholarshipDialog 
          scholarship={scholarship} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
