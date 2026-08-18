import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell, 
  FileText, 
  CreditCard, 
  Calendar, 
  ShieldAlert, 
  Clock 
} from "lucide-react";
import { MarkAllReadButton } from "./mark-all-read-button";

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
      take: 15
    }),
    prisma.payment.findMany({
      include: { application: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 15
    }),
    prisma.interview.findMany({
      include: { application: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 15
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15
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
      title: "Payment Transaction",
      message: `Processed payment of $${pay.amount.toFixed(2)} USD from ${applicantName} (Invoice: ${pay.invoiceNumber}).`,
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
      message: `Interview arranged with ${applicantName} on ${new Date(int.date).toLocaleDateString('en-GB')} at ${int.time}.`,
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
      message: `${log.action}: ${log.details || 'System event recorded.'}`,
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
        return <FileText className="text-[#252D65]" size={18} />;
      case "payment":
        return <CreditCard className="text-emerald-600" size={18} />;
      case "interview":
        return <Calendar className="text-purple-600" size={18} />;
      default:
        return <ShieldAlert className="text-amber-600" size={18} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "application":
        return "bg-blue-50 text-[#252D65] border-blue-200";
      case "payment":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jost text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-2.5">
            <Bell className="text-[#252D65]" size={28} />
            Notifications & Activity Log
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Track real-time system activities, student submissions, and transactions.</p>
        </div>
        <MarkAllReadButton />
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="border border-slate-200 rounded-2xl bg-white shadow-xs">
            <CardContent className="flex flex-col items-center justify-center p-12 text-slate-400">
              <Bell size={40} className="stroke-[1.5] mb-2 opacity-50" />
              <p className="font-semibold text-sm">No activity recorded yet</p>
              <p className="text-xs text-slate-400 mt-0.5">System actions and submissions will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-slate-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 font-heading">{item.title}</h3>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${getBadgeColor(item.type)}`}>
                        {item.type}
                      </Badge>
                    </div>
                    
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(item.timestamp).toLocaleString('en-GB')}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                    {item.message}
                  </p>
                  
                  {item.status && item.status !== "Logged" && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status:</span>
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
