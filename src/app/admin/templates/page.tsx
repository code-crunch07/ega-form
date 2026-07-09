import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreHorizontal, Edit, Copy } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddTemplateDialog } from "./add-template-dialog";

export default async function AdminTemplatesPage() {
  let templates = await prisma.template.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  if (templates.length === 0) {
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Communication Templates</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage automated email templates and document generation formats.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <Input 
              placeholder="Search templates..." 
              className="pl-10 h-10 w-full md:w-[280px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all" 
            />
          </div>
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm hidden md:flex items-center gap-2">
            <Filter size={16} className="text-neutral-500" />
            <span>Filter</span>
          </Button>
          <AddTemplateDialog />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50/80 dark:bg-neutral-900 hover:bg-transparent">
              <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Template Name</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Trigger / Category</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Channel</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Last Updated</TableHead>
              <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</TableHead>
              <TableHead className="py-4 text-right px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((tpl) => (
              <TableRow key={tpl.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                <TableCell className="py-3 px-6">
                  <Link href={`/admin/templates/${tpl.id}`} className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {tpl.name}
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                    {tpl.trigger}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{tpl.channel}</span>
                </TableCell>
                <TableCell className="py-3">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{new Date(tpl.updatedAt).toLocaleDateString()}</span>
                </TableCell>
                <TableCell className="py-3">
                  {tpl.status === "Active" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 shadow-sm px-2.5 py-0.5">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="shadow-sm px-2.5 py-0.5">{tpl.status}</Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 px-6 text-right">
                  <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Duplicate">
                      <Copy size={16} />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                      <Link href={`/admin/templates/${tpl.id}`}>
                        <Edit size={16} />
                      </Link>
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
