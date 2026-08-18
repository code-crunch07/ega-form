"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Edit, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStaff } from "@/app/actions/admin";

interface EditStaffDialogProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
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

export function EditStaffDialog({ user, trigger }: EditStaffDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await updateStaff(user.id, formData);
    
    if (result?.error) {
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
          size="icon" 
          onClick={() => setOpen(true)}
          className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg"
          title="Edit Staff User"
        >
          <Edit size={16} />
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">Edit Staff Account</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage credentials and role permissions.</p>
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
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={user.name || ""} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    defaultValue={user.email} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-bold text-slate-700">Assign Role *</Label>
                    <select 
                      id="role" 
                      name="role" 
                      defaultValue={user.role}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="ADMISSIONS_MANAGER">Admissions Manager</option>
                      <option value="ADMISSIONS_OFFICER">Admissions Officer</option>
                      <option value="FINANCE_OFFICER">Finance Officer</option>
                      <option value="INTERVIEW_PANEL">Interview Panel</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700">Reset Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="Leave blank to keep" 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    />
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
