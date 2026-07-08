"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchool } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 text-white">
      {pending ? "Adding..." : "Add School"}
    </Button>
  );
}

export function AddSchoolDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await createSchool(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
        <PlusCircle size={16} /> Add School
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold">Add New School</h2>
                <p className="text-sm text-neutral-500">Create a new school or faculty.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8">
                <X size={18} />
              </Button>
            </div>
            
            <form action={action}>
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="e.g. School of Business" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    placeholder="Brief description (optional)" 
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
