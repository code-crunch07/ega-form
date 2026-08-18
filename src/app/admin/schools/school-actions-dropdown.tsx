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
import { MoreHorizontal, Edit, BookOpen, Trash2, Loader2, Eye } from "lucide-react";
import { deleteSchool } from "@/app/actions/admin";
import { EditSchoolDialog } from "./edit-school-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface School {
  id: string;
  name: string;
  description?: string | null;
}

interface SchoolActionsDropdownProps {
  school: School;
}

export function SchoolActionsDropdown({ school }: SchoolActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete school/faculty "${school.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteSchool(school.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/schools");
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
          <Link href={`/admin/schools/${school.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View School Details</span>
            </DropdownMenuItem>
          </Link>

          <Link href={`/admin/programmes?school=${school.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <BookOpen className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Programmes</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit School</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete School</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditSchoolDialog 
          school={school} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
