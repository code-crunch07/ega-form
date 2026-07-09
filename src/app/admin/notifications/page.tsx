import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell, 
  FileText, 
  CreditCard, 
  Calendar, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  Clock 
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "application" | "payment" | "interview" | "system";
  title: string;
  message: string;
  timestamp: Date;
  status: string;
}

export default async function AdminNotificationsPage() {
  // Query actual data to build a dynamic notification feed
  const [applications, payments, interviews, logs] = await Promise.all([
    prisma.application.findMany({
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.payment.findMany({
      include: { application: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.interview.findMany({
      include: { application: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const items: NotificationItem[] = [];

  // 1. Applications Notifications
  applications.forEach(app => {
    const applicantName = app.user?.profile 
      ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim()
      : app.user?.name || "Unknown Applicant";

    items.push({
      id: `app_${app.id}`,
      type: "application",
      title: "New Application Submitted",
      message: `${applicantName} submitted application ${app.appNumber} for ${app.campus || 'Main Campus'}.`,
      timestamp: app.createdAt,
      status: app.status
    });
  });

  // 2. Payments Notifications
  payments.forEach(pay => {
    const applicantName = pay.application?.user?.name || "Applicant";
    items.push({
      id: `pay_${pay.id}`,
      type: "payment",
      title: "Payment Received",
      message: `Successfully processed fee payment of $${pay.amount.toFixed(2)} from ${applicantName} (Invoice: ${pay.invoiceNumber}).`,
      timestamp: pay.createdAt,
      status: pay.status
    });
  });

  // 3. Interviews Notifications
  interviews.forEach(int => {
    const applicantName = int.application?.user?.name || "Applicant";
    items.push({
      id: `int_${int.id}`,
      type: "interview",
      title: "Interview Scheduled",
      message: `Interview arranged with ${applicantName} on ${new Date(int.date).toLocaleDateString()} at ${int.time}.`,
      timestamp: int.createdAt,
      status: int.result || "Pending"
    });
  });

  // 4. Audit Log Notifications
  logs.forEach(log => {
    items.push({
      id: `log_${log.id}`,
      type: "system",
      title: "System Audit Log Entry",
      message: `${log.action}: ${log.details || 'No additional details provided.'}`,
      timestamp: log.createdAt,
      status: "Logged"
    });
  });

  // Sort items in reverse chronological order
  items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Helper icon selector
  const getIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="text-blue-500" size={18} />;
      case "payment":
        return <CreditCard className="text-emerald-500" size={18} />;
      case "interview":
        return <Calendar className="text-purple-500" size={18} />;
      default:
        return <ShieldAlert className="text-amber-500" size={18} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200/50";
      case "payment":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50";
      case "interview":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200/50";
      default:
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Bell className="text-slate-800 dark:text-neutral-200" size={28} />
            Notifications & Activity Log
          </h1>
          <p className="text-neutral-500 mt-1 dark:text-neutral-400">Track real-time system activities, student submissions, and transactions.</p>
        </div>
        <Button variant="outline" className="text-xs rounded-xl h-9 border-neutral-200 dark:border-neutral-800">
          Mark all as read
        </Button>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <Card className="border border-neutral-200 dark:border-neutral-800 shadow-3xs rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
              <CheckCircle2 size={40} className="text-neutral-300" />
              <p className="font-semibold mt-2">All Quiet!</p>
              <p className="text-xs max-w-xs leading-relaxed">No new system alerts or candidate submissions logged in the database yet.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-start gap-4 p-4 border border-neutral-200/60 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl hover:shadow-xs transition-shadow"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">{item.title}</span>
                    <Badge variant="outline" className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-px border-none rounded-md shadow-none ${getBadgeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                    <Clock size={12} />
                    {item.timestamp.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {item.message}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">Status:</span>
                  <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
