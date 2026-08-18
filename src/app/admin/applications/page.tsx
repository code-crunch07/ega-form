import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionsDropdown } from "./actions-dropdown";
import { ApplicationsFilters } from "./applications-filters";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending Review":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>;
    case "Interview Scheduled":
    case "Interview":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Interview</Badge>;
    case "Offered":
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Offered</Badge>;
    case "Rejected":
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{status || "Draft"}</Badge>;
  }
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string, intake?: string, programme?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;
  const intake = resolvedSearchParams?.intake;
  const programme = resolvedSearchParams?.programme;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { appNumber: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { profile: { firstName: { contains: search, mode: 'insensitive' } } } },
      { user: { profile: { lastName: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  if (status) {
    whereClause.status = status;
  }

  if (intake) {
    whereClause.intake = { contains: intake, mode: 'insensitive' };
  }

  if (programme) {
    whereClause.OR = [
      ...(whereClause.OR || []),
      { programmeLevel: { contains: programme, mode: 'insensitive' } },
      { programmeId: programme },
    ];
  }

  const [applications, dynamicIntakes, dynamicProgrammes] = await Promise.all([
    prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          include: { profile: true }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.intake.findMany({
      select: { id: true, name: true },
      orderBy: { openDate: 'desc' }
    }),
    prisma.programme.findMany({
      where: { status: 'Active' },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Applications</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage and review incoming student applications.</p>
        </div>
      </div>

      <ApplicationsFilters 
        intakes={dynamicIntakes} 
        programmes={dynamicProgrammes} 
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="w-[160px] font-bold text-slate-700">App ID</TableHead>
              <TableHead className="font-bold text-slate-700">Applicant</TableHead>
              <TableHead className="font-bold text-slate-700">Programme</TableHead>
              <TableHead className="font-bold text-slate-700">Intake</TableHead>
              <TableHead className="font-bold text-slate-700">Submitted</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-400 font-medium">
                  No applications found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const applicantName = app.user?.profile 
                  ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
                  : app.user?.name || "Unknown";

                return (
                  <TableRow key={app.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100">
                    <TableCell className="font-bold font-mono text-xs text-[#252D65]">{app.appNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{applicantName}</p>
                        <p className="text-xs text-slate-400 font-mono">{app.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm text-slate-800">
                      {app.programmeLevel || app.programmeId || "Not Selected"}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-600">
                      {app.intake || "N/A"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-medium">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      <ActionsDropdown appId={app.id} />
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
