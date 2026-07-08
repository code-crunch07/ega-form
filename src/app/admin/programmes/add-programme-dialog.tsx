"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProgramme } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 text-white">
      {pending ? "Adding..." : "Add Programme"}
    </Button>
  );
}

interface School {
  id: string;
  name: string;
}

export function AddProgrammeDialog({ schools }: { schools: School[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await createProgramme(formData);
    
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-shrink-0">
        <PlusCircle size={16} /> Add Programme
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold">Add New Programme</h2>
                <p className="text-sm text-neutral-500">Create a new academic course or degree.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8">
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
                    <Label htmlFor="code">Programme Code</Label>
                    <Input id="code" name="code" placeholder="e.g. BCS-01" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Programme Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Bachelor of CS" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolId">School / Faculty</Label>
                  <select 
                    id="schoolId" 
                    name="schoolId" 
                    required
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                  >
                    <option value="">Select a School</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Study Level</Label>
                    <select 
                      id="level" 
                      name="level" 
                      required
                      className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g. 3 Years" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="credits">Total Credits</Label>
                    <Input id="credits" name="credits" type="number" placeholder="e.g. 120" defaultValue="120" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="applicationFee">Application Fee ($)</Label>
                    <Input id="applicationFee" name="applicationFee" type="number" step="0.01" placeholder="e.g. 50.00" defaultValue="50.00" required />
                  </div>
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
