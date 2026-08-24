"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, X, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { inviteStaff } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl h-11 px-6 shadow-sm">
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" /> Inviting...
        </span>
      ) : (
        "Invite Staff"
      )}
    </Button>
  );
}

export function InviteStaffDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function action(formData: FormData) {
    setError(null);
    const result = await inviteStaff(formData);
    
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
        <UserPlus size={16} /> 
        <span>Invite Staff</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#252D65]/10 text-[#252D65] flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Invite Internal Staff</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Register staff member account with selective permissions.</p>
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
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name *</Label>
                  <Input id="name" name="name" placeholder="e.g. Robert Smith" className="h-11 rounded-xl border-slate-200 text-slate-800" required />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address *</Label>
                  <Input id="email" name="email" type="email" placeholder="e.g. robert.smith@educare.com" className="h-11 rounded-xl border-slate-200 text-slate-800" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-bold text-slate-700">Assign Role *</Label>
                    <select 
                      id="role" 
                      name="role" 
                      required
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="ADMISSIONS_OFFICER">Admissions Officer</option>
                      <option value="ADMISSIONS_MANAGER">Admissions Manager</option>
                      <option value="FINANCE_OFFICER">Finance Officer</option>
                      <option value="INTERVIEW_PANEL">Interview Panel</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-700">Temporary Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Defaults to 'staff123'" 
                        className="h-11 rounded-xl border-slate-200 text-slate-800 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
