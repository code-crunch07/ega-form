"use client";

import { useState } from "react";
import { CalendarCheck, X, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extendIntakeDeadline } from "@/app/actions/admin";

interface ExtendDeadlineDialogProps {
  intake: {
    id: string;
    name: string;
    closeDate: Date | string;
  };
  trigger?: React.ReactNode;
}

export function ExtendDeadlineDialog({ intake, trigger }: ExtendDeadlineDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialDateStr = (() => {
    try {
      const d = new Date(intake.closeDate);
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  })();

  const [newDate, setNewDate] = useState(initialDateStr);

  const handleAddDays = (days: number) => {
    try {
      const base = newDate ? new Date(newDate) : new Date();
      base.setDate(base.getDate() + days);
      setNewDate(base.toISOString().split("T")[0]);
    } catch {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setError("Please select a new deadline date.");
      return;
    }

    setIsPending(true);
    setError(null);
    const result = await extendIntakeDeadline(intake.id, newDate);
    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setOpen(true)}
          className="gap-1.5 h-9 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:text-[#252D65] hover:bg-slate-50"
        >
          <CalendarCheck size={14} className="text-[#252D65]" />
          <span>Extend Deadline</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#252D65]/10 text-[#252D65] flex items-center justify-center">
                  <CalendarCheck size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Extend Deadline</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{intake.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </Button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="newCloseDate" className="text-xs font-bold text-slate-700">New Application Close Date *</Label>
                  <Input 
                    id="newCloseDate" 
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    required 
                  />
                </div>

                {/* Quick Add Presets */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Quick Extend Presets</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleAddDays(7)}
                      className="h-9 rounded-xl border-slate-200 text-xs font-bold hover:bg-[#252D65]/5 hover:text-[#252D65]"
                    >
                      +7 Days
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleAddDays(14)}
                      className="h-9 rounded-xl border-slate-200 text-xs font-bold hover:bg-[#252D65]/5 hover:text-[#252D65]"
                    >
                      +14 Days
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleAddDays(30)}
                      className="h-9 rounded-xl border-slate-200 text-xs font-bold hover:bg-[#252D65]/5 hover:text-[#252D65]"
                    >
                      +30 Days
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11 px-5 font-bold border-slate-200 bg-white">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="h-11 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-sm"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Updating...
                    </span>
                  ) : (
                    "Confirm Extension"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
