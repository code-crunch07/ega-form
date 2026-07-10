import { FolderOpen, Upload, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { getMockSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

const REQUIRED_DOCS = [
  { name: "Passport / National ID", required: true },
  { name: "Passport-size Photo", required: true },
  { name: "Academic Transcripts", required: true },
  { name: "Degree / Diploma Certificate", required: false },
  { name: "English Test Results", required: false },
  { name: "Resume / CV", required: false },
];

export default async function DocumentsPage() {
  const user = await getMockSessionUser();

  const documents = await prisma.document.findMany({
    where: { application: { userId: user.id } },
    include: { application: { select: { appNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  const uploadedCount = documents.length;
  const requiredCount = REQUIRED_DOCS.filter((d) => d.required).length;

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Documents"
        icon={FolderOpen}
        title="My Documents"
        description="Upload and manage supporting documents for your applications."
        actions={
          <Button className="h-11 rounded-xl bg-[#3C3D6B] hover:bg-[#2C2D54]">
            <Upload size={18} />
            Upload Document
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Uploaded"
          value={uploadedCount}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Required"
          value={requiredCount}
          icon={AlertTriangle}
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Types"
          value={REQUIRED_DOCS.length}
          icon={FileText}
          iconClassName="bg-[#3C3D6B]/10 text-[#3C3D6B]"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <h2 className="font-semibold text-neutral-900">Document Checklist</h2>
            <p className="mt-0.5 text-sm text-neutral-500">Documents commonly required for admission</p>
          </div>
          <div className="divide-y divide-neutral-100">
            {REQUIRED_DOCS.map((doc) => {
              const uploaded = documents.some((d) =>
                d.type?.toLowerCase().includes(doc.name.split(" ")[0].toLowerCase())
              );
              return (
                <div key={doc.name} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      uploaded ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {uploaded ? <CheckCircle2 size={18} /> : <FileText size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">{doc.name}</p>
                    <p className="text-xs text-neutral-500">
                      {doc.required ? "Required" : "Optional"} · PDF, JPG, PNG (max 5MB)
                    </p>
                  </div>
                  {uploaded ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Uploaded
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                      Pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <h2 className="font-semibold text-neutral-900">Uploaded Files</h2>
          </div>
          {documents.length === 0 ? (
            <EmptyState
              icon={Upload}
              title="No documents uploaded yet"
              description="Upload documents during your application or from here."
              action={{ label: "Go to Application", href: "/dashboard/applications/new" }}
            />
          ) : (
            <div className="divide-y divide-neutral-100">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C3D6B]/10 text-[#3C3D6B]">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-neutral-900">{doc.filename || doc.type}</p>
                    <p className="text-xs text-neutral-500">
                      {doc.application.appNumber} · {doc.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
