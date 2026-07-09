"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFee } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
      {pending ? "Adding..." : "Add Fee Rule"}
    </Button>
  );
}

export function AddFeeDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await createFee(formData);
    
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
        className="h-10 rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
      >
        <Plus size={18} />
        <span>New Fee Rule</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">New Fee Rule</h2>
                <p className="text-sm text-neutral-500 mt-1">Configure exception rules, programs charges or penalty fees.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 text-neutral-400 hover:text-neutral-500">
                <X size={18} />
              </Button>
            </div>
            
            <form action={action}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Fee Rule Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Health Insurance Surcharge" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="e.g. 100.00" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Fee Category</Label>
                    <select 
                      id="type" 
                      name="type" 
                      required
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                    >
                      <option value="Mandatory">Mandatory</option>
                      <option value="Conditional">Conditional</option>
                      <option value="Penalty">Penalty</option>
                      <option value="Program Specific">Program Specific</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appliesTo">Applies To (Target)</Label>
                  <Input id="appliesTo" name="appliesTo" placeholder="e.g. International Applicants" required />
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">
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
