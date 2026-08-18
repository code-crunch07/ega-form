import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { AddIntakeDialog } from "./add-intake-dialog";
import { EditIntakeDialog } from "./edit-intake-dialog";
import { ExtendDeadlineDialog } from "./extend-deadline-dialog";
import { IntakeActionsDropdown } from "./intake-actions-dropdown";
import { IntakesFilters } from "./intakes-filters";

export default async function AdminIntakesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;

  const whereClause: any = {};

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  const intakes = await prisma.intake.findMany({
    where: whereClause,
    orderBy: { openDate: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Intakes</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage admission periods, deadlines, and student capacity limits.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddIntakeDialog />
        </div>
      </div>

      <IntakesFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {intakes.length === 0 ? (
          <div className="col-span-full text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl text-slate-400 font-medium">
            No intake cohorts found matching the selected filters.
          </div>
        ) : (
          intakes.map((intake) => {
            const capacityStr = intake.capacity ? `0/${intake.capacity}` : "Unlimited";
            const percentFull = 0;

            return (
              <div 
                key={intake.id} 
                className="border border-slate-200 rounded-2xl p-6 bg-white shadow-xs relative overflow-hidden group hover:border-[#252D65]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#252D65] transition-colors">{intake.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">INTAKE-{intake.id.slice(0, 6).toUpperCase()}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {intake.status === "Open" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-2.5 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Open
                        </Badge>
                      )}
                      {intake.status === "Upcoming" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold px-2.5 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                          Upcoming
                        </Badge>
                      )}
                      {intake.status === "Closed" && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-xs font-semibold px-2.5 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                          Closed
                        </Badge>
                      )}
                      {!["Open", "Upcoming", "Closed"].includes(intake.status) && (
                        <Badge variant="outline" className="text-xs">{intake.status}</Badge>
                      )}

                      <IntakeActionsDropdown intake={intake} />
                    </div>
                  </div>
                  
                  <div className="space-y-3.5 mt-2">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400" />
                        Application Window
                      </p>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {new Date(intake.openDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(intake.closeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          <Users size={12} className="text-slate-400" /> Capacity
                        </span>
                        <span className="font-bold text-slate-800 text-xs">{capacityStr} ({percentFull}% Full)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${intake.status === 'Closed' ? 'bg-slate-300' : 'bg-[#252D65]'}`} 
                          style={{ width: `${percentFull}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <ExtendDeadlineDialog intake={intake} />

                  <div className="flex items-center gap-1">
                    <EditIntakeDialog intake={intake} />
                    <Button asChild variant="ghost" size="sm" className="text-[#252D65] hover:text-[#1C224E] hover:bg-slate-100 font-bold text-xs rounded-lg">
                      <Link href={`/admin/intakes/${intake.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
