import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { getAgents } from "@/app/actions/admin";
import ApplicationWizard from "./application-wizard";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const user = await getMockSessionUser();

  // Fetch data needed for the wizard
  const [programmes, intakes, schools, agents, existingDraft, profile] = await Promise.all([
    prisma.programme.findMany({
      where: { status: "Active" },
      include: { school: true },
      orderBy: { name: 'asc' }
    }),
    prisma.intake.findMany({
      where: { status: "Open" },
      orderBy: { openDate: 'asc' }
    }),
    prisma.school.findMany({
      orderBy: { name: 'asc' }
    }),
    getAgents({ status: "Active" }),
    prisma.application.findFirst({
      where: { userId: user.id, status: "Draft" },
      include: { educationHistory: true, englishTests: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.profile.findUnique({
      where: { userId: user.id }
    })
  ]);

  return (
    <div className="w-full">
      <ApplicationWizard 
        user={user} 
        programmes={programmes} 
        intakes={intakes} 
        schools={schools}
        agents={agents}
        existingDraft={existingDraft}
        userProfile={profile}
      />
    </div>
  );
}
