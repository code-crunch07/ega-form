import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

export default async function AdminDashboard() {
  // Fetch actual data from Prisma
  const [totalApps, pendingReview, offers, interviews, paymentsResult] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "Pending Review" } }),
    prisma.offer.count(),
    prisma.interview.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "Paid" } // assuming "Paid" is the successful status
    })
  ]);

  const ytdRevenue = (paymentsResult._sum.amount || 0).toLocaleString();

  // For charts, we ideally group by date or programme.
  // Since Prisma SQLite/Postgres grouping by date functions can be complex,
  // we can fetch a simplified aggregation or just pass empty for now.
  
  // Group by Programme:
  const appsByProgramme = await prisma.application.groupBy({
    by: ['programmeId'],
    _count: { id: true }
  });
  
  // We need programme names
  const programmeIds = appsByProgramme.map(a => a.programmeId).filter(Boolean) as string[];
  const programmes = await prisma.programme.findMany({
    where: { id: { in: programmeIds } }
  });
  
  const programmeData = appsByProgramme.map(a => {
    const prog = programmes.find(p => p.id === a.programmeId);
    return {
      name: prog ? prog.name : "Unknown",
      value: a._count.id
    };
  }).filter(p => p.value > 0);

  const stats = {
    totalApps,
    pendingReview,
    payments: await prisma.payment.count(),
    offers,
    interviews,
    ytdRevenue
  };

  return (
    <DashboardClient 
      stats={stats} 
      monthlyData={[]} 
      programmeData={programmeData}
      countryData={[]} 
    />
  );
}
