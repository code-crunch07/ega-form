import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { InviteStaffDialog } from "./invite-staff-dialog";
import { EditStaffDialog } from "./edit-staff-dialog";
import { UserActionsDropdown } from "./user-actions-dropdown";
import { UsersFilters } from "./users-filters";

const formatRole = (role: string) => {
  return role.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, role?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const role = resolvedSearchParams?.role;

  const whereClause: any = {
    role: {
      not: "APPLICANT"
    }
  };

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "all") {
    whereClause.role = role;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Staff Users</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage internal staff accounts, roles, and administrative permissions.</p>
        </div>
        <InviteStaffDialog />
      </div>

      <UsersFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[240px]">Staff Member</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Email Address</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Assigned Role</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Account Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-400 font-medium">
                  No staff accounts found matching the search / filter criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <p className="font-bold text-sm text-[#252D65]">{user.name || "Unnamed Staff"}</p>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-xs text-slate-600">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Shield size={14} className={user.role === "SUPER_ADMIN" ? "text-purple-600" : "text-[#252D65]"} />
                      <span className="text-slate-800">{formatRole(user.role)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditStaffDialog user={user} />
                      <UserActionsDropdown user={user} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
