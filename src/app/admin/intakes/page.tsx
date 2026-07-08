import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, CalendarDays } from "lucide-react";

import { AddIntakeDialog } from "./add-intake-dialog";

export default async function AdminIntakesPage() {
  const intakes = await prisma.intake.findMany({
    orderBy: { openDate: 'asc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intakes</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Manage admission periods and capacity limits.</p>
        </div>
        <AddIntakeDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {intakes.length === 0 ? (
          <div className="col-span-3 text-center p-10 border border-dashed rounded-xl text-neutral-500">
            No intakes found in the database.
          </div>
        ) : (
          intakes.map((intake) => {
            // Calculate fake capacity for now since we don't have an application-to-intake relation yet
            const capacityStr = intake.capacity ? `0/${intake.capacity}` : "0";
            const percentFull = 0; // You'd calculate this based on enrolled students

            return (
              <div key={intake.id} className="border rounded-xl p-5 bg-white dark:bg-black dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{intake.name}</h3>
                  {intake.status === "Open" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none dark:bg-green-900/30 dark:text-green-400">Open</Badge>}
                  {intake.status === "Upcoming" && <Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">Upcoming</Badge>}
                  {intake.status === "Closed" && <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-none">Closed</Badge>}
                  {!["Open", "Upcoming", "Closed"].includes(intake.status) && <Badge variant="outline">{intake.status}</Badge>}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-neutral-500">Application Window</p>
                    <p className="text-sm font-medium">
                      {intake.openDate.toLocaleDateString()} - {intake.closeDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Capacity</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${intake.status === 'Closed' ? 'bg-neutral-400' : 'bg-blue-600'}`} 
                          style={{ width: `${percentFull}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{capacityStr} ({percentFull}% Full)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t dark:border-neutral-800 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-neutral-500">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-blue-600">View Applicants</Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
