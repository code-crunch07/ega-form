import { getAgents } from "@/app/actions/admin";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Globe, 
  Mail, 
  Phone, 
  Percent, 
  Building2, 
  UserCheck,
  CheckCircle2,
  Users
} from "lucide-react";
import { AddAgentDialog } from "./add-agent-dialog";
import { EditAgentDialog } from "./edit-agent-dialog";
import { AgentActionsDropdown } from "./agent-actions-dropdown";
import { AgentsFilters } from "./agents-filters";

export const dynamic = "force-dynamic";

interface AgentRecord {
  id: string;
  agencyName: string;
  contactPerson: string;
  email: string;
  phone?: string | null;
  country: string;
  city?: string | null;
  commissionRate?: number | null;
  status: string;
  notes?: string | null;
}

export default async function AdminAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; country?: string; status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const country = resolvedSearchParams?.country;
  const status = resolvedSearchParams?.status;

  const agents: AgentRecord[] = await getAgents({ search, country, status });

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a: AgentRecord) => a.status === "Active").length;
  const uniqueCountries = new Set(agents.map((a: AgentRecord) => a.country)).size;
  const avgCommission = agents.length > 0
    ? (agents.reduce((acc: number, a: AgentRecord) => acc + (a.commissionRate || 10), 0) / agents.length).toFixed(1)
    : "10.0";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-2.5">
            <Briefcase className="text-[#252D65]" size={28} />
            Recruitment Agents
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage authorized global student recruitment agencies, appointed counsellors, and commissions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddAgentDialog />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#252D65]/10 flex items-center justify-center text-[#252D65]">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Total Agencies</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalAgents}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Active Partners</p>
            <h3 className="text-2xl font-bold text-emerald-600">{activeAgents}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Globe size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Countries</p>
            <h3 className="text-2xl font-bold text-slate-900">{uniqueCountries}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Percent size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Avg Commission</p>
            <h3 className="text-2xl font-bold text-slate-900">{avgCommission}%</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AgentsFilters />

      {/* Agents Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700">Agency & Counsellor</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Location</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Contact Details</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Commission</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-36 text-slate-400 font-medium">
                  No recruitment agencies found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-sm text-[#252D65]">
                        {agent.agencyName}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <UserCheck size={13} className="text-slate-400" />
                        <span>Counsellor: <strong className="text-slate-700 font-semibold">{agent.contactPerson}</strong></span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Globe size={13} className="text-slate-400" />
                      <span>{agent.city ? `${agent.city}, ` : ""}{agent.country}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        <span className="font-mono text-[11px]">{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone size={12} className="text-slate-400" />
                          <span>{agent.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {agent.commissionRate ?? 10.0}%
                    </span>
                  </TableCell>

                  <TableCell className="py-3">
                    {agent.status === "Active" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </Badge>
                    ) : agent.status === "Pending" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2.5 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <EditAgentDialog agent={agent} />
                      <AgentActionsDropdown agent={agent} />
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
