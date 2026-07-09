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
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">Pending Review</Badge>;
    case "Interview Scheduled":
    case "Interview":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">Interview</Badge>;
    case "Offered":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">Offered</Badge>;
    case "Rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-400 dark:border-neutral-800">{status || "Draft"}</Badge>;
  }
};

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string, intake?: string, programme?: string, officer?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;
  const intake = resolvedSearchParams?.intake;
  const programme = resolvedSearchParams?.programme;
  const officer = resolvedSearchParams?.officer;

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
    whereClause.intake = intake;
  }

  if (programme) {
    whereClause.programmeId = programme; // Assuming we use exact match for ID
  }

  // Officer filtering can be added when AssignedOfficer is in the DB schema
  // if (officer) { whereClause.assignedOfficer = officer; }

  const applications = await prisma.application.findMany({
    where: whereClause,
    include: {
      user: {
        include: { profile: true }
      },
      payments: true // To check fee status
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Manage and review incoming student applications.</p>
        </div>
      </div>

      <ApplicationsFilters />

      <div className="rounded-md border bg-white dark:bg-black dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              <TableHead className="w-[150px]">App ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Officer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-neutral-500">
                  No applications found in the database.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const applicantName = app.user?.profile 
                  ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
                  : app.user?.name || "Unknown";
                  
                const isPaid = app.payments?.some(p => p.status === "Paid");

                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.appNumber}</TableCell>
                    <TableCell>{applicantName}</TableCell>
                    <TableCell>{app.programmeId || "Not Selected"}</TableCell>
                    <TableCell>{app.intake || "N/A"}</TableCell>
                    <TableCell className="text-neutral-500">
                      {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-neutral-500">Unassigned</TableCell>
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
