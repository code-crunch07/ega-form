import Link from "next/link";
import { FileText, PlusCircle } from "lucide-react";
import { getMockSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { ApplicationsList } from "./applications-list";

export default async function ApplicationsPage() {
  const user = await getMockSessionUser();

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const programmes = await prisma.programme.findMany({
    where: {
      id: { in: applications.map((a) => a.programmeId).filter(Boolean) as string[] },
    },
  });
  const programmeMap = Object.fromEntries(programmes.map((p) => [p.id, p]));

  const serializedApplications = applications.map((app) => {
    const programme = app.programmeId ? programmeMap[app.programmeId] : null;
    return {
      id: app.id,
      appNumber: app.appNumber,
      status: app.status,
      intake: app.intake,
      studyMode: app.studyMode,
      currentStep: app.currentStep,
      updatedAt: app.updatedAt.toISOString(),
      submittedAt: app.submittedAt?.toISOString() ?? null,
      programmeName: programme?.name,
      programmeCode: programme?.code,
    };
  });

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Applications"
        icon={FileText}
        title="My Applications"
        description="View, continue, or track the status of all your programme applications."
        actions={
          <Button asChild className="h-11 rounded-xl bg-[#3C3D6B] hover:bg-[#2C2D54]">
            <Link href="/dashboard/applications/new">
              <PlusCircle size={18} />
              New Application
            </Link>
          </Button>
        }
      />

      <ApplicationsList applications={serializedApplications} />
    </div>
  );
}
