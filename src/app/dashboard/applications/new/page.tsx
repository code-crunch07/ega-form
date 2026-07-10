import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import ApplicationWizard from "./application-wizard";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const user = await getMockSessionUser();

  // Fetch data needed for the wizard
  const [programmes, intakes] = await Promise.all([
    prisma.programme.findMany({
      where: { status: "Active" },
      orderBy: { name: 'asc' }
    }),
    prisma.intake.findMany({
      where: { status: "Open" },
      orderBy: { openDate: 'asc' }
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-50 -m-6 sm:-m-8 md:-m-10">
      <ApplicationWizard 
        user={user} 
        programmes={programmes} 
        intakes={intakes} 
      />
    </div>
  );
}
