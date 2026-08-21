"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAgent, updateAgent } from "@/app/actions/admin";
import { EditAgentDialog } from "./edit-agent-dialog";

interface Agent {
  id: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  phone?: string | null;
  country: string;
  city?: string | null;
  commissionRate?: number | null;
  status: string;
  notes?: string | null;
}

export function AgentActionsDropdown({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(agent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    const newStatus = agent.status === "Active" ? "Inactive" : "Active";
    const formData = new FormData();
    formData.append("agencyName", agent.agencyName);
    formData.append("contactPerson", agent.contactPerson);
    formData.append("email", agent.email);
    formData.append("phone", agent.phone || "");
    formData.append("country", agent.country);
    formData.append("city", agent.city || "");
    formData.append("commissionRate", String(agent.commissionRate ?? 10.0));
    formData.append("status", newStatus);
    formData.append("notes", agent.notes || "");

    await updateAgent(agent.id, formData);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove agency "${agent.agencyName}"?`)) {
      await deleteAgent(agent.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-200 bg-white font-jost text-xs">
        <EditAgentDialog 
          agent={agent} 
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="gap-2 cursor-pointer font-medium">
              <Edit size={14} className="text-slate-500" />
              Edit Agency Details
            </DropdownMenuItem>
          }
        />
        
        <DropdownMenuItem onClick={handleCopyEmail} className="gap-2 cursor-pointer font-medium">
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
          {copied ? "Email Copied!" : "Copy Counsellor Email"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleToggleStatus} disabled={isUpdating} className="gap-2 cursor-pointer font-medium">
          {agent.status === "Active" ? (
            <>
              <XCircle size={14} className="text-amber-600" />
              <span>Mark as Inactive</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Activate Agency</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete} className="gap-2 cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
          <Trash2 size={14} />
          Delete Agency
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
