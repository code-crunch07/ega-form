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
import { MoreHorizontal, Edit, Shield, Trash2, Loader2, KeyRound } from "lucide-react";
import { updateStaff, deleteStaff } from "@/app/actions/admin";
import { EditStaffDialog } from "./edit-staff-dialog";
import { useRouter } from "next/navigation";

interface UserActionsDropdownProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export function UserActionsDropdown({ user }: UserActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleQuickRoleChange = async (newRole: string) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", user.name || "");
    formData.append("email", user.email);
    formData.append("role", newRole);

    const res = await updateStaff(user.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove staff account "${user.name || user.email}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteStaff(user.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/users");
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
          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit Staff Account</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <KeyRound className="mr-2 h-4 w-4 text-slate-400" />
            <span>Reset Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {user.role !== "SUPER_ADMIN" && (
            <DropdownMenuItem 
              onClick={() => handleQuickRoleChange("SUPER_ADMIN")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-purple-700 hover:bg-purple-50 hover:text-purple-800"
            >
              <Shield className="mr-2 h-4 w-4 text-purple-500" />
              <span>Make Super Admin</span>
            </DropdownMenuItem>
          )}

          {user.role !== "ADMISSIONS_MANAGER" && (
            <DropdownMenuItem 
              onClick={() => handleQuickRoleChange("ADMISSIONS_MANAGER")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            >
              <Shield className="mr-2 h-4 w-4 text-blue-500" />
              <span>Set as Admissions Manager</span>
            </DropdownMenuItem>
          )}

          {user.role !== "ADMISSIONS_OFFICER" && (
            <DropdownMenuItem 
              onClick={() => handleQuickRoleChange("ADMISSIONS_OFFICER")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Shield className="mr-2 h-4 w-4 text-slate-400" />
              <span>Set as Admissions Officer</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Staff User</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditStaffDialog 
          user={user} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
