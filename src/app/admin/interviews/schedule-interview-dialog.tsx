"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scheduleInterview } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
      {pending ? "Scheduling..." : "Schedule Interview"}
    </Button>
  );
}

interface ApplicationOption {
  id: string;
  appNumber: string;
  applicantName: string;
}

interface InterviewerOption {
  id: string;
  name: string | null;
  email: string;
}

interface ScheduleInterviewDialogProps {
  applications: ApplicationOption[];
  interviewers: InterviewerOption[];
}

export function ScheduleInterviewDialog({ applications, interviewers }: ScheduleInterviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    const result = await scheduleInterview(formData);
    
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
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        <CalendarPlus size={16} /> Schedule Interview
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Schedule Interview</h2>
                <p className="text-sm text-neutral-500 mt-1">Book an online meeting for an admission candidate.</p>
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
                  <Label htmlFor="applicationId">Select Applicant & Application</Label>
                  <select 
                    id="applicationId" 
                    name="applicationId" 
                    required
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 text-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">Choose Application...</option>
                    {applications.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.applicantName} ({app.appNumber})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interviewerId">Assign Interviewer</Label>
                  <select 
                    id="interviewerId" 
                    name="interviewerId"
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 text-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">Unassigned / Select Interviewer...</option>
                    {interviewers.map(interviewer => (
                      <option key={interviewer.id} value={interviewer.id}>
                        {interviewer.name || interviewer.email} ({interviewer.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" placeholder="e.g. 10:00 AM" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Online Meeting Link (Zoom, Teams, Meet)</Label>
                  <Input id="meetingLink" name="meetingLink" placeholder="e.g. https://zoom.us/j/..." defaultValue="https://meet.google.com/abc-defg-hij" />
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
