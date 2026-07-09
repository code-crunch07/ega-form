import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, ExternalLink, CalendarPlus } from "lucide-react";

import { ScheduleInterviewDialog } from "./schedule-interview-dialog";

export default async function AdminInterviewsPage() {
  const [interviews, applications, interviewers] = await Promise.all([
    prisma.interview.findMany({
      include: {
        application: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    }),
    prisma.application.findMany({
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      where: {
        role: {
          not: "APPLICANT"
        }
      },
      orderBy: { name: 'asc' }
    })
  ]);

  const applicationOptions = applications.map(app => ({
    id: app.id,
    appNumber: app.appNumber,
    applicantName: app.user?.profile 
      ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
      : app.user?.name || "Unknown"
  }));

  const interviewerOptions = interviewers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Schedule and manage applicant interviews.</p>
        </div>
        <ScheduleInterviewDialog applications={applicationOptions} interviewers={interviewerOptions} />
      </div>

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50">
              <TableHead>Applicant</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Interviewer ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-neutral-500">
                  No interviews found in the database.
                </TableCell>
              </TableRow>
            ) : (
              interviews.map((interview) => {
                const applicantName = interview.application?.user?.profile 
                  ? `${interview.application.user.profile.firstName || ''} ${interview.application.user.profile.lastName || ''}`.trim()
                  : interview.application?.user?.name || "Unknown";
                  
                const programmeName = interview.application?.programmeId || "Not Selected"; // fallback

                return (
                  <TableRow key={interview.id}>
                    <TableCell className="font-bold">{applicantName}</TableCell>
                    <TableCell>{programmeName}</TableCell>
                    <TableCell>{interview.interviewerId || "Unassigned"}</TableCell>
                    <TableCell className="text-neutral-600 dark:text-neutral-400">
                      {interview.date.toLocaleDateString()} - {interview.time}
                    </TableCell>
                    <TableCell>
                      {interview.meetingLink ? (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="h-8 text-blue-600 gap-2 px-0">
                            <Video size={14} /> Join Zoom
                          </Button>
                        </a>
                      ) : (
                        <span className="text-neutral-400 text-xs">No Link</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {interview.result === "Passed" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Passed</Badge>}
                      {interview.result === "Failed" && <Badge variant="destructive">Failed</Badge>}
                      {(!interview.result || interview.result === "Pending") && <Badge variant="outline" className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800">Pending</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {(!interview.result || interview.result === "Pending") ? (
                        <Button variant="outline" size="sm" className="h-8">Log Result</Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8 text-neutral-500 gap-2"><ExternalLink size={14}/> View Notes</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
