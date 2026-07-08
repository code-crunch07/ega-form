import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function getPercentageChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
}

export default async function AdminDashboard() {
  // Fetch raw records from Prisma to compute aggregations in memory
  const [
    allApplications,
    allOffers,
    allInterviews,
    allPayments,
    recentApps,
    recentDocs,
    recentInterviews,
    recentOffers,
    recentPayments
  ] = await Promise.all([
    prisma.application.findMany({
      select: {
        id: true,
        status: true,
        applicantType: true,
        createdAt: true,
      }
    }),
    prisma.offer.findMany({
      select: {
        createdAt: true,
      }
    }),
    prisma.interview.findMany({
      select: {
        date: true,
        createdAt: true,
        time: true
      }
    }),
    prisma.payment.findMany({
      select: {
        amount: true,
        createdAt: true,
        status: true
      }
    }),
    prisma.application.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' }, 
      include: { user: { include: { profile: true } } } 
    }),
    prisma.document.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' }, 
      include: { application: { include: { user: { include: { profile: true } } } } } 
    }),
    prisma.interview.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' }, 
      include: { application: { include: { user: { include: { profile: true } } } } } 
    }),
    prisma.offer.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' }, 
      include: { application: { include: { user: { include: { profile: true } } } } } 
    }),
    prisma.payment.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' }, 
      include: { application: { include: { user: { include: { profile: true } } } } } 
    })
  ]);

  // Compute 30 days vs previous 30 days time bounds
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(now.getDate() - 60);

  const tAgoTime = thirtyDaysAgo.getTime();
  const sAgoTime = sixtyDaysAgo.getTime();

  // 1. Applications stats
  const appsCurrent = allApplications.filter(a => a.createdAt.getTime() >= tAgoTime).length;
  const appsPrevious = allApplications.filter(a => a.createdAt.getTime() >= sAgoTime && a.createdAt.getTime() < tAgoTime).length;
  const appsPercent = getPercentageChange(appsCurrent, appsPrevious);

  // 2. Pending Review stats
  const pendingCurrent = allApplications.filter(a => a.status === "Pending Review" && a.createdAt.getTime() >= tAgoTime).length;
  const pendingPrevious = allApplications.filter(a => a.status === "Pending Review" && a.createdAt.getTime() >= sAgoTime && a.createdAt.getTime() < tAgoTime).length;
  const pendingPercent = getPercentageChange(pendingCurrent, pendingPrevious);

  // 3. Interviews stats
  const interviewsCurrent = allInterviews.filter(i => i.createdAt.getTime() >= tAgoTime).length;
  const interviewsPrevious = allInterviews.filter(i => i.createdAt.getTime() >= sAgoTime && i.createdAt.getTime() < tAgoTime).length;
  const interviewsPercent = getPercentageChange(interviewsCurrent, interviewsPrevious);

  // 4. Offers stats
  const offersCurrent = allOffers.filter(o => o.createdAt.getTime() >= tAgoTime).length;
  const offersPrevious = allOffers.filter(o => o.createdAt.getTime() >= sAgoTime && o.createdAt.getTime() < tAgoTime).length;
  const offersPercent = getPercentageChange(offersCurrent, offersPrevious);

  // 5. YTD Revenue stats
  const revCurrent = allPayments.filter(p => p.status === "Paid" && p.createdAt.getTime() >= tAgoTime).reduce((sum, p) => sum + p.amount, 0);
  const revPrevious = allPayments.filter(p => p.status === "Paid" && p.createdAt.getTime() >= sAgoTime && p.createdAt.getTime() < tAgoTime).reduce((sum, p) => sum + p.amount, 0);
  const revPercent = getPercentageChange(revCurrent, revPrevious);

  // 6. New Applicants (Registered in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(now.getDate() - 14);

  const appsLast7 = allApplications.filter(a => a.createdAt.getTime() >= sevenDaysAgo.getTime()).length;
  const appsPrev7 = allApplications.filter(a => a.createdAt.getTime() >= fourteenDaysAgo.getTime() && a.createdAt.getTime() < sevenDaysAgo.getTime()).length;
  const newApplicantsPercent = getPercentageChange(appsLast7, appsPrev7);

  const stats = {
    totalApps: allApplications.length,
    totalAppsPercent: appsPercent,
    pendingReview: allApplications.filter(a => a.status === "Pending Review").length,
    pendingReviewPercent: pendingPercent,
    offers: allOffers.length,
    offersPercent: offersPercent,
    interviews: allInterviews.length,
    interviewsPercent: interviewsPercent,
    ytdRevenue: allPayments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0).toLocaleString(),
    ytdRevenuePercent: revPercent,
    newApplicants: appsLast7,
    newApplicantsPercent: newApplicantsPercent
  };

  // Compile line chart monthly application & offer volume trends
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = months.map((month, idx) => {
    const appCount = allApplications.filter(app => app.createdAt.getMonth() === idx).length;
    const offerCount = allOffers.filter(off => off.createdAt.getMonth() === idx).length;
    return {
      name: month,
      Applications: appCount,
      Offers: offerCount
    };
  });

  // Compile status donut percentages
  const statusCounts = allApplications.reduce((acc: any, app) => {
    const status = app.status || "Draft";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalAppsCount = allApplications.length;
  const statusData = Object.entries(statusCounts).map(([name, value]: any) => {
    const percentage = totalAppsCount > 0 ? `${((value / totalAppsCount) * 100).toFixed(1)}%` : "0%";
    return { name, value, percentage };
  });

  // Compile applicant types progress chart
  const typeCounts = allApplications.reduce((acc: any, app) => {
    const type = app.applicantType || "Unspecified";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const applicantTypesData = Object.entries(typeCounts).map(([name, count]: any) => {
    const percentage = totalAppsCount > 0 ? parseFloat(((count / totalAppsCount) * 100).toFixed(1)) : 0;
    return { name, count, percentage };
  });

  // Compile weekly calendar dates and interview counts
  const currentDay = now.getDay(); 
  const monday = new Date(now);
  const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
  monday.setDate(diffToMonday);
  monday.setHours(0,0,0,0);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const calendarDays = daysOfWeek.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    
    const count = allInterviews.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === d.getFullYear() &&
             itemDate.getMonth() === d.getMonth() &&
             itemDate.getDate() === d.getDate();
    }).length;
    
    return {
      day: dayName,
      date: d.getDate(),
      count,
      active: d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    };
  });

  const calendarMonthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Compile recent activity list
  const activities = [
    ...recentApps.map(app => ({
      type: "application",
      title: "New application submitted",
      detail: `${app.appNumber} by ${app.user?.profile?.firstName || ""} ${app.user?.profile?.lastName || ""}`.trim(),
      time: app.createdAt.getTime()
    })),
    ...recentDocs.map(doc => ({
      type: "document",
      title: "Document uploaded",
      detail: `${doc.type} for ${doc.application?.user?.profile?.firstName || ""} ${doc.application?.user?.profile?.lastName || ""}`.trim(),
      time: doc.createdAt.getTime()
    })),
    ...recentInterviews.map(item => ({
      type: "interview",
      title: "Interview scheduled",
      detail: `Interview on ${new Date(item.date).toLocaleDateString()} at ${item.time}`,
      time: item.createdAt.getTime()
    })),
    ...recentOffers.map(offer => ({
      type: "offer",
      title: "Offer issued",
      detail: `${offer.type} offer issued (Status: ${offer.status})`,
      time: offer.createdAt.getTime()
    })),
    ...recentPayments.map(payment => ({
      type: "payment",
      title: "Payment received",
      detail: `$${payment.amount} invoice ${payment.invoiceNumber}`,
      time: payment.createdAt.getTime()
    }))
  ];

  activities.sort((a, b) => b.time - a.time);
  const finalActivities = activities.slice(0, 5).map(act => ({
    ...act,
    timeString: formatTimeAgo(new Date(act.time))
  }));

  // Query latest 5 applications for table
  const latestApplications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  return (
    <DashboardClient 
      stats={stats} 
      monthlyData={monthlyData} 
      statusData={statusData}
      applicantTypesData={applicantTypesData}
      calendarDays={calendarDays}
      calendarMonthYear={calendarMonthYear}
      recentActivities={finalActivities}
      latestApplications={latestApplications}
    />
  );
}
