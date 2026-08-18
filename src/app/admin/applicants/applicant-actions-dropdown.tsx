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
import { MoreHorizontal, Eye, FileText, Mail, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteApplicant } from "@/app/actions/admin";

interface ApplicantActionsDropdownProps {
  applicantId: string;
  applicantEmail: string;
  applicantName: string;
}

export function ApplicantActionsDropdown({
  applicantId,
  applicantEmail,
  applicantName,
}: ApplicantActionsDropdownProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete applicant "${applicantName}"? This action cannot be undone.`)) {
      setIsDeleting(true);
      const res = await deleteApplicant(applicantId);
      setIsDeleting(false);
      if (res?.error) {
        alert("Error: " + res.error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={isDeleting}
          className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="More actions"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin text-slate-400" />
          ) : (
            <MoreHorizontal size={16} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl bg-white border-slate-200 shadow-xl p-1.5 font-jost text-left">
        <Link href={`/admin/applicants/${applicantId}`} className="w-full">
          <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
            <Eye className="mr-2 h-4 w-4 text-slate-400" />
            <span>View Full Profile</span>
          </DropdownMenuItem>
        </Link>
        
        <Link href={`/admin/applications?search=${encodeURIComponent(applicantEmail)}`} className="w-full">
          <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
            <FileText className="mr-2 h-4 w-4 text-slate-400" />
            <span>View Applications</span>
          </DropdownMenuItem>
        </Link>

        {applicantEmail && (
          <a href={`mailto:${applicantEmail}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Mail className="mr-2 h-4 w-4 text-slate-400" />
              <span>Send Email</span>
            </DropdownMenuItem>
          </a>
        )}

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <DropdownMenuItem 
          onClick={handleDelete}
          className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete Applicant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
