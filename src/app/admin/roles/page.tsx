import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, MoreHorizontal, Edit, Shield } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { id: "role_1", name: "Super Administrator", users: 2, permissions: "Full Access", status: "Active" },
  { id: "role_2", name: "Admissions Officer", users: 15, permissions: "Manage Applications, Interviews", status: "Active" },
  { id: "role_3", name: "Finance Officer", users: 5, permissions: "Manage Invoices, Payments, Refunds", status: "Active" },
  { id: "role_4", name: "Program Director", users: 8, permissions: "View Applications, Manage Programs", status: "Active" },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage access control and define permission sets for staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search roles..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <Button className="h-10 rounded-full px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
            <Plus size={18} />
            <span>Create Role</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Role Name</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Assigned Users</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Key Permissions</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((role) => (
              <TableRow key={role.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <TableCell className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                      {role.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="secondary" className="font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {role.users} Users
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{role.permissions}</span>
                </TableCell>
                <TableCell className="py-3">
                  {role.status === "Active" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="shadow-sm px-2.5 py-0.5">{role.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 px-6 text-right">
                  <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
