"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Edit, X, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAgent } from "@/app/actions/admin";

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
          <Loader2 size={16} className="animate-spin" /> Saving...
        </span>
      ) : (
        "Save Changes"
      )}
    </Button>
  );
}

export function EditAgentDialog({ 
  agent,
  trigger
}: { 
  agent: Agent;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await updateAgent(agent.id, formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="w-full">
          {trigger}
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setOpen(true)}
          className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:text-[#252D65] hover:bg-slate-50 gap-1.5 text-xs font-semibold"
        >
          <Edit size={14} /> Edit
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200 font-jost text-left">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Briefcase size={20} className="text-[#252D65]" />
                  Edit Agency: {agent.agencyName}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">Update partner agency profile, contact details, or commission rate.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </Button>
            </div>
            
            <form action={action}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="agencyName" className="text-xs font-bold text-slate-700">Agency Name *</Label>
                  <Input 
                    id="agencyName" 
                    name="agencyName" 
                    defaultValue={agent.agencyName}
                    required 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPerson" className="text-xs font-bold text-slate-700">Contact Person / Counsellor *</Label>
                    <Input 
                      id="contactPerson" 
                      name="contactPerson" 
                      defaultValue={agent.contactPerson}
                      required 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      defaultValue={agent.email}
                      required 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      defaultValue={agent.phone || ""}
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="commissionRate" className="text-xs font-bold text-slate-700">Commission Rate (%)</Label>
                    <Input 
                      id="commissionRate" 
                      name="commissionRate" 
                      type="number" 
                      step="0.5" 
                      defaultValue={agent.commissionRate ?? 10.0} 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-bold text-slate-700">Country *</Label>
                    <select 
                      id="country" 
                      name="country" 
                      defaultValue={agent.country}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="China">China</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="India">India</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Myanmar">Myanmar</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Other">Other Country</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-bold text-slate-700">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      defaultValue={agent.city || ""}
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-bold text-slate-700">Status *</Label>
                    <select 
                      id="status" 
                      name="status" 
                      defaultValue={agent.status}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Internal Notes</Label>
                  <Input 
                    id="notes" 
                    name="notes" 
                    defaultValue={agent.notes || ""}
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200">
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
