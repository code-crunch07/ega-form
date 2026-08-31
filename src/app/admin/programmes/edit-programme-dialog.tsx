"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Edit, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProgramme } from "@/app/actions/admin";

interface School {
  id: string;
  name: string;
}

interface Programme {
  id: string;
  code: string;
  name: string;
  schoolId?: string | null;
  level: string;
  duration: string;
  modeOfStudy?: string | null;
  credits?: number | null;
  applicationFee?: number | null;
  status: string;
  intakes?: string | null;
}

interface EditProgrammeDialogProps {
  programme: Programme;
  schools: School[];
  studyLevels?: string[];
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

export function EditProgrammeDialog({ 
  programme, 
  schools, 
  studyLevels,
  trigger 
}: EditProgrammeDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await updateProgramme(programme.id, formData);
    
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
          size="icon" 
          onClick={() => setOpen(true)}
          className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg"
          title="Edit Programme"
        >
          <Edit size={16} />
        </Button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 font-jost text-left">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">Edit Programme Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update course information, fees, or study duration.</p>
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
                
                <input type="hidden" name="code" defaultValue={programme.code} />
                
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-700">Programme Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={programme.name} 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="schoolId" className="text-xs font-bold text-slate-700">School / Partner Faculty</Label>
                  <select 
                    id="schoolId" 
                    name="schoolId" 
                    defaultValue={programme.schoolId || ""}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                  >
                    <option value="">Select a School</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="level" className="text-xs font-bold text-slate-700">Study Level *</Label>
                    <select 
                      id="level" 
                      name="level" 
                      defaultValue={programme.level}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                      required
                    >
                      {(studyLevels && studyLevels.length > 0 ? studyLevels : [
                        "Foundation / Certificate",
                        "Diploma",
                        "Advanced / Higher Diploma",
                        "Undergraduate / Bachelor's Degree",
                        "Postgraduate / Master's Degree",
                        "Doctorate / PhD"
                      ]).map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="duration" className="text-xs font-bold text-slate-700">Duration *</Label>
                    <Input 
                      id="duration" 
                      name="duration" 
                      defaultValue={programme.duration} 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                      required 
                    />
                  </div>
                </div>

                <input type="hidden" name="credits" defaultValue={programme.credits || 120} />
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="modeOfStudy" className="text-xs font-bold text-slate-700">Mode of Study</Label>
                    <select 
                      id="modeOfStudy" 
                      name="modeOfStudy" 
                      defaultValue={programme.modeOfStudy || "Full Time / Part Time"}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="Full Time">Full Time (FT)</option>
                      <option value="Part Time">Part Time (PT)</option>
                      <option value="Full Time / Part Time">Full Time / Part Time (FT / PT)</option>
                      <option value="E-learning">E-learning / Online</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="applicationFee" className="text-xs font-bold text-slate-700">App Fee ($)</Label>
                    <Input 
                      id="applicationFee" 
                      name="applicationFee" 
                      type="number" 
                      step="0.01" 
                      defaultValue={programme.applicationFee || 0} 
                      className="h-11 rounded-xl border-slate-200 text-slate-800" 
                      required 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-xs font-bold text-slate-700">Status</Label>
                    <select 
                      id="status" 
                      name="status"
                      defaultValue={programme.status || "Active"}
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#252D65]/20 focus-visible:border-[#252D65]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="intakes" className="text-xs font-bold text-slate-700">
                    Intake Dates <span className="text-slate-400 font-normal">(Separate multiple with semicolon e.g. 16 Nov 2026; 11 Jan 2027)</span>
                  </Label>
                  <Input 
                    id="intakes" 
                    name="intakes" 
                    defaultValue={programme.intakes || ""} 
                    placeholder="e.g. 16 Nov 2026; 11 Jan 2027; 15 Mar 2027" 
                    className="h-11 rounded-xl border-slate-200 text-slate-800" 
                  />
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
