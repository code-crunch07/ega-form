import { prisma } from "@/lib/prisma";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, ShieldCheck, Download, Plus, Filter, Search, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { AddApplicantDialog } from "./add-applicant-dialog";

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

export default async function AdminApplicantsPage() {
  const applicants = await prisma.user.findMany({
    where: { role: "APPLICANT" },
    include: {
      profile: true,
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Applicants Directory</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage and view all registered student applicants.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search applicants..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <AddApplicantDialog />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact Info</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Location</TableHead>
              <TableHead className="py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500">Apps</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-neutral-500">
                  No applicants found in the database.
                </TableCell>
              </TableRow>
            ) : (
              applicants.map((user: any, i: number) => {
                const displayName = user.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : user.name || "Unknown";
                const phone = user.profile?.phone || "No phone";
                const country = user.profile?.country || "Unknown";
                const status = user.emailVerified ? "Verified" : "Pending";
                const color = COLORS[i % COLORS.length];
                
                return (
                  <TableRow key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                    <TableCell className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${color}`}>
                          {getInitials(displayName)}
                        </div>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 transition-colors cursor-pointer">
                          <Mail size={14} className="text-neutral-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Phone size={13} className="text-neutral-400" />
                          {phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <MapPin size={14} className="text-neutral-400" />
                        {country}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {user._count.applications}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {status === "Verified" ? (
                         <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50 shadow-sm flex w-fit items-center gap-1.5 px-2.5 py-0.5">
                           <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                           Verified
                         </Badge>
                      ) : (
                         <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50 shadow-sm flex w-fit items-center gap-1.5 px-2.5 py-0.5">
                           <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                           Pending
                         </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Link href={`/admin/applicants/${user.id}`}>
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                          <MoreHorizontal size={16} />
                        </Button>
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
