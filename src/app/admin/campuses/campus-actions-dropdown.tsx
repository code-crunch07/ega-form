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
import { MoreHorizontal, Edit, CheckCircle2, XCircle, Hammer, Trash2, Loader2, Eye } from "lucide-react";
import { updateCampus, deleteCampus } from "@/app/actions/admin";
import { EditCampusDialog } from "./edit-campus-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Campus {
  id: string;
  name: string;
  country: string;
  city: string;
  capacity: number;
  status: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface CampusActionsDropdownProps {
  campus: Campus;
}

export function CampusActionsDropdown({ campus }: CampusActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSetStatus = async (newStatus: "Active" | "Under Construction" | "Inactive") => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", campus.name);
    formData.append("country", campus.country);
    formData.append("city", campus.city);
    formData.append("capacity", campus.capacity.toString());
    formData.append("status", newStatus);
    if (campus.address) formData.append("address", campus.address);
    if (campus.phone) formData.append("phone", campus.phone);
    if (campus.email) formData.append("email", campus.email);

    const res = await updateCampus(campus.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete campus "${campus.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteCampus(campus.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/campuses");
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
          <Link href={`/admin/campuses/${campus.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Campus Details</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit Campus</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {campus.status !== "Active" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Active")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Set as Active</span>
            </DropdownMenuItem>
          )}

          {campus.status !== "Under Construction" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Under Construction")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Hammer className="mr-2 h-4 w-4 text-amber-500" />
              <span>Set as Under Construction</span>
            </DropdownMenuItem>
          )}

          {campus.status !== "Inactive" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Inactive")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <XCircle className="mr-2 h-4 w-4 text-slate-400" />
              <span>Set as Inactive</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Campus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditCampusDialog 
          campus={campus} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
