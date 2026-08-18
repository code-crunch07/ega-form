import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Eye } from "lucide-react";
import Link from "next/link";
import { AddApplicantDialog } from "./add-applicant-dialog";
import { ApplicantsFilters } from "./applicants-filters";
import { ApplicantActionsDropdown } from "./applicant-actions-dropdown";

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const COLORS = [
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700"
];

export default async function AdminApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;

  const whereClause: any = { role: "APPLICANT" };

  if (search) {
    whereClause.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { profile: { firstName: { contains: search, mode: "insensitive" } } },
      { profile: { lastName: { contains: search, mode: "insensitive" } } },
      { profile: { phone: { contains: search, mode: "insensitive" } } },
      { profile: { country: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status === "Verified") {
    whereClause.emailVerified = { not: null };
  } else if (status === "Pending") {
    whereClause.emailVerified = null;
  }

  const applicants = await prisma.user.findMany({
    where: whereClause,
    include: {
      profile: true,
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Applicants Directory</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage and view all registered student applicants.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ApplicantsFilters />
          <AddApplicantDialog />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-700">Applicant</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Contact Info</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Location</TableHead>
              <TableHead className="py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-700">Apps</TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-bold uppercase tracking-wider text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-400 font-medium">
                  No applicants found matching the current search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              applicants.map((user: any, i: number) => {
                const displayName = user.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : user.name || "Unknown";
                const phone = user.profile?.phone || "No phone";
                const country = user.profile?.country || "Unknown";
                const isVerified = !!user.emailVerified;
                const color = COLORS[i % COLORS.length];
                
                return (
                  <TableRow key={user.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs ${color}`}>
                          {getInitials(displayName)}
                        </div>
                        <div>
                          <Link href={`/admin/applicants/${user.id}`} className="font-bold text-sm text-slate-900 hover:text-[#252D65] transition-colors">
                            {displayName}
                          </Link>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#252D65] transition-colors">
                          <Mail size={13} className="text-slate-400" />
                          <span>{user.email}</span>
                        </a>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Phone size={12} className="text-slate-400" />
                          <span>{phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <span className="inline-flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {user._count?.applications || 0}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      {isVerified ? (
                         <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                           Verified
                         </Badge>
                      ) : (
                         <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                           <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                           Pending
                         </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg" title="View Profile">
                          <Link href={`/admin/applicants/${user.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <ApplicantActionsDropdown 
                          applicantId={user.id} 
                          applicantEmail={user.email} 
                          applicantName={displayName} 
                        />
                      </div>
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
