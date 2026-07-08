"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { updateApplicationStatus } from "@/app/actions/admin";

export function ActionsDropdown({ appId }: { appId: string }) {
  const handleStatusUpdate = async (status: string) => {
    const res = await updateApplicationStatus(appId, status);
    if (res.error) {
      alert("Error updating status: " + res.error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1">
        <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Actions
        </div>
        
        <DropdownMenuItem 
          render={<Link href={`/admin/applications/${appId}`} />} 
          className="cursor-pointer flex items-center px-2 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800"
        >
          <Eye className="mr-2 h-4 w-4 text-blue-500" />
          View Application
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />
        
        <DropdownMenuItem 
          className="cursor-pointer flex items-center px-2 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 focus:bg-neutral-50 dark:focus:bg-neutral-800"
          onClick={() => handleStatusUpdate("Offered")}
        >
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Approve & Offer
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer flex items-center px-2 py-2 rounded-lg text-sm text-red-600 focus:bg-red-50 focus:text-red-750 dark:focus:bg-red-550/10" 
          onClick={() => handleStatusUpdate("Rejected")}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
