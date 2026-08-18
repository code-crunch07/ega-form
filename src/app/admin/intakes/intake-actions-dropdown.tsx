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
import { MoreHorizontal, Edit, CalendarCheck, CheckCircle2, XCircle, Clock, Trash2, Loader2, Eye } from "lucide-react";
import { updateIntake, deleteIntake } from "@/app/actions/admin";
import { EditIntakeDialog } from "./edit-intake-dialog";
import { ExtendDeadlineDialog } from "./extend-deadline-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Intake {
  id: string;
  name: string;
  openDate: Date | string;
  closeDate: Date | string;
  capacity?: number | null;
  status: string;
}

interface IntakeActionsDropdownProps {
  intake: Intake;
}

export function IntakeActionsDropdown({ intake }: IntakeActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);

  const handleSetStatus = async (newStatus: "Open" | "Upcoming" | "Closed") => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", intake.name);
    formData.append("openDate", new Date(intake.openDate).toISOString().split("T")[0]);
    formData.append("closeDate", new Date(intake.closeDate).toISOString().split("T")[0]);
    if (intake.capacity) formData.append("capacity", intake.capacity.toString());
    formData.append("status", newStatus);

    const res = await updateIntake(intake.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete intake cohort "${intake.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteIntake(intake.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/intakes");
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
          <Link href={`/admin/intakes/${intake.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Details & Stats</span>
            </DropdownMenuItem>
          </Link>

          <Link href={`/admin/applications?intake=${encodeURIComponent(intake.name)}`} className="w-full">
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
            <span>Edit Intake Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsExtendDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 focus:bg-indigo-50 focus:text-indigo-800"
          >
            <CalendarCheck className="mr-2 h-4 w-4 text-indigo-600" />
            <span>Extend Deadline</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {intake.status !== "Open" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Open")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Set as Open</span>
            </DropdownMenuItem>
          )}

          {intake.status !== "Upcoming" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Upcoming")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            >
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              <span>Set as Upcoming</span>
            </DropdownMenuItem>
          )}

          {intake.status !== "Closed" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Closed")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <XCircle className="mr-2 h-4 w-4 text-slate-400" />
              <span>Set as Closed</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Intake</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditIntakeDialog 
          intake={intake} 
          trigger={<span className="hidden" />} 
        />
      )}

      {isExtendDialogOpen && (
        <ExtendDeadlineDialog 
          intake={intake} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
