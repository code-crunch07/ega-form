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
import { MoreHorizontal, Edit, CheckCircle2, XCircle, Trash2, Loader2, Eye } from "lucide-react";
import { updateProgramme, deleteProgramme } from "@/app/actions/admin";
import { EditProgrammeDialog } from "./edit-programme-dialog";
import Link from "next/link";

interface School {
  id: string;
  name: string;
}

interface Programme {
  id: string;
  code: string;
  name: string;
  schoolId?: string | null;
  level: string;
  duration: string;
  credits?: number | null;
  applicationFee?: number | null;
  status: string;
}

interface ProgrammeActionsDropdownProps {
  programme: Programme;
  schools: School[];
}

export function ProgrammeActionsDropdown({ programme, schools }: ProgrammeActionsDropdownProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleToggleStatus = async () => {
    const nextStatus = programme.status === "Active" ? "Inactive" : "Active";
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("code", programme.code);
    formData.append("name", programme.name);
    if (programme.schoolId) formData.append("schoolId", programme.schoolId);
    formData.append("level", programme.level);
    formData.append("duration", programme.duration);
    formData.append("credits", (programme.credits || 120).toString());
    formData.append("applicationFee", (programme.applicationFee || 0).toString());
    formData.append("status", nextStatus);

    const res = await updateProgramme(programme.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete programme "${programme.name}" (${programme.code})? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteProgramme(programme.id);
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
          <Link href={`/admin/applications?programme=${encodeURIComponent(programme.name)}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Applications</span>
            </DropdownMenuItem>
          </Link>

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
            {programme.status === "Active" ? (
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
            <span>Delete Programme</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditProgrammeDialog 
          programme={programme} 
          schools={schools}
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
