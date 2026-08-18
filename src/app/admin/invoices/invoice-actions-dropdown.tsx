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
import { MoreHorizontal, Eye, Edit, Send, CheckCircle2, Clock, Trash2, Loader2 } from "lucide-react";
import { updatePaymentStatus, deletePayment, sendInvoiceReminder } from "@/app/actions/admin";
import { EditInvoiceDialog } from "./edit-invoice-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InvoiceActionsDropdownProps {
  invoice: {
    id: string;
    number: string;
    amount: number;
    status: string;
  };
}

export function InvoiceActionsDropdown({ invoice }: InvoiceActionsDropdownProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSetStatus = async (newStatus: "Paid" | "Pending") => {
    setIsProcessing(true);
    const res = await updatePaymentStatus(invoice.id, newStatus);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  const handleSendReminder = async () => {
    setIsProcessing(true);
    const res = await sendInvoiceReminder(invoice.id);
    setIsProcessing(false);
    if (res?.error) {
      alert("Error: " + res.error);
    } else {
      alert("Payment reminder sent to applicant successfully!");
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete invoice #${invoice.number}? This action cannot be undone.`)) {
      setIsProcessing(true);
      const res = await deletePayment(invoice.id);
      setIsProcessing(false);
      if (res?.error) {
        alert("Error: " + res.error);
      } else {
        router.push("/admin/invoices");
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
          <Link href={`/admin/invoices/${invoice.id}`} className="w-full">
            <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]">
              <Eye className="mr-2 h-4 w-4 text-slate-400" />
              <span>View Invoice Statement</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem 
            onClick={handleSendReminder}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50 focus:text-blue-800"
          >
            <Send className="mr-2 h-4 w-4 text-blue-500" />
            <span>Send Email Reminder</span>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setIsEditDialogOpen(true)}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65]"
          >
            <Edit className="mr-2 h-4 w-4 text-slate-400" />
            <span>Edit Invoice</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          {invoice.status !== "Paid" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Paid")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Mark as Paid</span>
            </DropdownMenuItem>
          )}

          {invoice.status === "Paid" && (
            <DropdownMenuItem 
              onClick={() => handleSetStatus("Pending")}
              className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
            >
              <Clock className="mr-2 h-4 w-4 text-amber-500" />
              <span>Mark as Unpaid</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer py-2 px-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
            <span>Delete Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditDialogOpen && (
        <EditInvoiceDialog 
          invoice={invoice} 
          trigger={<span className="hidden" />} 
        />
      )}
    </>
  );
}
