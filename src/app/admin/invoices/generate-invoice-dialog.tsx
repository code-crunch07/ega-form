"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X, Loader2, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateInvoice } from "@/app/actions/admin";

interface ApplicationOption {
  id: string;
  appNumber: string;
  applicantName: string;
  programmeName?: string | null;
}

interface GenerateInvoiceDialogProps {
  applications?: ApplicationOption[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl h-11 px-6 shadow-sm"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" /> Generating...
        </span>
      ) : (
        "Generate Invoice"
      )}
    </Button>
  );
}

export function GenerateInvoiceDialog({ applications = [] }: GenerateInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await generateInvoice(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="h-11 rounded-xl px-5 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold shadow-xs flex items-center gap-2 transition-all"
      >
        <Plus size={16} />
        <span>Generate Invoice</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#252D65]/10 text-[#252D65] flex items-center justify-center">
                  <FilePlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Issue Student Invoice</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generate a billing invoice statement for an applicant.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </Button>
            </div>
            
            <form action={action}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="applicationId" className="text-xs font-bold text-slate-700">Select Application / Student *</Label>
                  <select 
                    id="applicationId" 
                    name="applicationId" 
                    required
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                  >
                    <option value="">Select an application...</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.appNumber} - {app.applicantName} ({app.programmeName || "Course"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-xs font-bold text-slate-700">Billed Amount ($ USD) *</Label>
                    <Input 
                      id="amount" 
                      name="amount" 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 500.00" 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="gateway" className="text-xs font-bold text-slate-700">Payment Channel</Label>
                    <select 
                      id="gateway" 
                      name="gateway"
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="stripe">Online (Stripe)</option>
                      <option value="paypal">PayPal</option>
                      <option value="manual">Manual Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11 px-5 font-bold border-slate-200 bg-white">
                  Cancel
                </Button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
