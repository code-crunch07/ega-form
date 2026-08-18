import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddTemplateDialog } from "./add-template-dialog";
import { EditTemplateDialog } from "./edit-template-dialog";
import { TemplateActionsDropdown } from "./template-actions-dropdown";
import { DuplicateTemplateButton } from "./duplicate-template-button";
import { TemplatesFilters } from "./templates-filters";

export default async function AdminTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string, status?: string, channel?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search;
  const status = resolvedSearchParams?.status;
  const channel = resolvedSearchParams?.channel;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { trigger: { contains: search, mode: "insensitive" } },
      { channel: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (channel && channel !== "all") {
    whereClause.channel = { contains: channel, mode: "insensitive" };
  }

  let templates = await prisma.template.findMany({
    where: whereClause,
    orderBy: { updatedAt: 'desc' }
  });

  if (templates.length === 0 && !search && !status && !channel) {
    await prisma.template.createMany({
      data: [
        { name: "Application Received", trigger: "On Application Submission", channel: "Email", status: "Active", subject: "We've received your application - {{application_id}}", content: "Dear {{first_name}},\n\nThank you for applying to {{program_name}}. We have successfully received your application.\n\nYou can track your application status by logging into your portal.\n\nBest,\nAdmissions Team" },
        { name: "Missing Documents Reminder", trigger: "Manual / Scheduled", channel: "Email", status: "Active", subject: "Action Required: Missing Documents", content: "Hi {{first_name}},\n\nWe are reviewing your application for {{program_name}} but noticed some required documents are missing:\n\n{{missing_documents_list}}\n\nPlease upload these as soon as possible." },
        { name: "Offer Letter (Unconditional)", trigger: "On Status Change -> Offer", channel: "Email + PDF", status: "Active", subject: "Offer of Admission", content: "Congratulations {{first_name}}!" },
        { name: "Interview Invitation", trigger: "Manual", channel: "Email", status: "Draft", subject: "Interview Invitation", content: "Dear {{first_name}},\n\nWe would like to invite you for an interview." }
      ]
    });
    templates = await prisma.template.findMany({
      orderBy: { updatedAt: 'desc' }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Communication Templates</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage automated email notifications, SMS alerts, and letter templates.</p>
        </div>
        <div className="flex items-center gap-3">
          <AddTemplateDialog />
        </div>
      </div>

      <TemplatesFilters />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="py-4 px-6 font-bold text-slate-700 w-[240px]">Template Name</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Trigger / Category</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Channel</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Last Updated</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 text-right px-6 font-bold text-slate-700 w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-slate-400 font-medium">
                  No communication templates found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((tpl) => (
                <TableRow key={tpl.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 group">
                  <TableCell className="py-3 px-6">
                    <Link href={`/admin/templates/${tpl.id}`} className="font-bold text-sm text-[#252D65] hover:text-[#1C224E]">
                      {tpl.name}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {tpl.trigger}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-xs font-medium text-slate-600">{tpl.channel}</span>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-slate-500 font-medium">
                    {new Date(tpl.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-3">
                    {tpl.status === "Active" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold flex w-fit items-center gap-1.5 px-2 py-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <DuplicateTemplateButton templateId={tpl.id} />
                      <EditTemplateDialog template={tpl} />
                      <TemplateActionsDropdown template={tpl} />
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
