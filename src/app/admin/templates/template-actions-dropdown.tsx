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
import { MoreHorizontal, Eye, Edit, Copy, Send, CheckCircle2, Clock, Trash2, Loader2 } from "lucide-react";
import { duplicateTemplate, deleteTemplate, updateTemplate, sendTestTemplateEmail } from "@/app/actions/admin";
import { EditTemplateDialog } from "./edit-template-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TemplateActionsDropdownProps {
  template: {
    id: string;
    name: string;
    trigger: string;
    channel: string;
    subject: string;
    content: string;
    status: string;
  };
}

export function TemplateActionsDropdown({ template }: TemplateActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDuplicate = async () => {
    setIsProcessing(true);
    const res = await duplicateTemplate(template.id);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleSendTest = async () => {
    const email = prompt("Enter email address to send test simulation:", "admin@ega.edu");
    if (!email) return;

    setIsProcessing(true);
    const res = await sendTestTemplateEmail(template.id, email);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    } else {
      alert(`Test email sent to ${email} successfully!`);
    }
  };

  const handleToggleStatus = async (newStatus: "Active" | "Draft") => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("name", template.name);
    formData.append("trigger", template.trigger);
    formData.append("channel", template.channel);
    formData.append("subject", template.subject);
    formData.append("content", template.content);
    formData.append("status", newStatus);

    const res = await updateTemplate(template.id, formData);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete template "${template.name}"? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deleteTemplate(template.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/templates");
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
          <Link href={`/admin/templates/${template.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>Open in Full Editor</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            onClick={handleDuplicate}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Copy className="mr-2 h-4 w-4 text-slate-400" />
            <span>Duplicate Template</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleSendTest}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50 focus:text-blue-800"
          >
            <Send className="mr-2 h-4 w-4 text-blue-500" />
            <span>Send Test Email</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Quick Edit</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {template.status !== "Active" ? (
            <DropdownMenuItem 
              onClick={() => handleToggleStatus("Active")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Publish as Active</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem 
              onClick={() => handleToggleStatus("Draft")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              <span>Move to Draft</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Template</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditTemplateDialog 
          template={template} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
