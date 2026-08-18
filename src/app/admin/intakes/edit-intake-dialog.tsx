"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Edit, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateIntake } from "@/app/actions/admin";

interface Intake {
  id: string;
  name: string;
  openDate: Date | string;
  closeDate: Date | string;
  capacity?: number | null;
  status: string;
}

interface EditIntakeDialogProps {
  intake: Intake;
  trigger?: React.ReactNode;
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

export function EditIntakeDialog({ intake, trigger }: EditIntakeDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDateForInput = (d: Date | string) => {
    try {
      const date = new Date(d);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  async function action(formData: FormData) {
    setError(null);
    const result = await updateIntake(intake.id, formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setOpen(true)}
          className="text-slate-600 hover:text-[#252D65] font-semibold text-xs rounded-lg"
        >
          Edit
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">Edit Intake Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update cohort dates, enrollment capacity, or status.</p>
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
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">Intake Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={intake.name} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="openDate" className="text-xs font-bold text-slate-700">Application Open Date *</Label>
                    <Input 
                      id="openDate" 
                      name="openDate" 
                      type="date"
                      defaultValue={formatDateForInput(intake.openDate)}
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="closeDate" className="text-xs font-bold text-slate-700">Application Close Date *</Label>
                    <Input 
                      id="closeDate" 
                      name="closeDate" 
                      type="date"
                      defaultValue={formatDateForInput(intake.closeDate)}
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="capacity" className="text-xs font-bold text-slate-700">Max Student Capacity</Label>
                    <Input 
                      id="capacity" 
                      name="capacity" 
                      type="number" 
                      defaultValue={intake.capacity || ""} 
                      placeholder="e.g. 500" 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-bold text-slate-700">Status</Label>
                    <select 
                      id="status" 
                      name="status"
                      defaultValue={intake.status}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="Open">Open</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Closed">Closed</option>
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
