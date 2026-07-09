"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTemplate } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
      {pending ? "Creating..." : "Create Template"}
    </Button>
  );
}

export function AddTemplateDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await createTemplate(formData);
    
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
        <span>Create Template</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Create Communication Template</h2>
                <p className="text-sm text-neutral-500 mt-1">Design a reusable message template for automated triggers.</p>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Welcome Email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="channel">Channel</Label>
                    <select 
                      id="channel" 
                      name="channel" 
                      required
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                    >
                      <option value="Email">Email</option>
                      <option value="Email + PDF">Email + PDF</option>
                      <option value="SMS">SMS</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trigger">Trigger Event / Category</Label>
                  <select 
                    id="trigger" 
                    name="trigger" 
                    required
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                  >
                    <option value="On Application Submission">On Application Submission</option>
                    <option value="On Status Change -> Offer">On Status Change {"->"} Offer</option>
                    <option value="Manual / Scheduled">Manual / Scheduled</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input id="subject" name="subject" placeholder="e.g. Welcome to {{program_name}}!" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Message Body</Label>
                  <textarea 
                    id="content" 
                    name="content" 
                    required
                    placeholder="Dear {{first_name}}, ..."
                    className="w-full h-40 p-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 font-mono"
                  />
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
