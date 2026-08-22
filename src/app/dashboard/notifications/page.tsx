import Link from "next/link";
import {
  BellRing,
  FileText,
  CreditCard,
  CheckCircle2,
  Info,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { getMockSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface DynamicNotification {
  id: string;
  type: "info" | "action" | "success" | "payment" | "interview";
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  read: boolean;
  href: string;
}

const TYPE_STYLES = {
  info: { icon: Info, bg: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  action: { icon: FileText, bg: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  success: { icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  payment: { icon: CreditCard, bg: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
  interview: { icon: Calendar, bg: "bg-purple-50 text-purple-600", dot: "bg-purple-500" }
};

export default async function NotificationsPage() {
  const user = await getMockSessionUser();

  const [applications, payments, interviews] = await Promise.all([
    prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.payment.findMany({
      where: { application: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.interview.findMany({
      where: { application: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const notifications: DynamicNotification[] = [];

  // 1. Applications-based notifications
  applications.forEach((app) => {
    if (app.status === "Draft") {
      notifications.push({
        id: `app_draft_${app.id}`,
        type: "action",
        title: "Incomplete Application Draft",
        message: `Application ${app.appNumber} is currently saved as draft. Click to resume and complete all steps.`,
        time: new Date(app.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        timestamp: app.updatedAt,
        read: false,
        href: `/dashboard/applications/${app.id}`,
      });
    } else if (app.status === "Offer Made" || app.status === "Approved") {
      notifications.push({
        id: `app_offer_${app.id}`,
        type: "success",
        title: "Official Offer Letter Issued!",
        message: `Congratulations! An offer has been extended for application ${app.appNumber}. Review terms and accept your place.`,
        time: new Date(app.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        timestamp: app.updatedAt,
        read: false,
        href: `/dashboard/applications/${app.id}`,
      });
    } else {
      notifications.push({
        id: `app_sub_${app.id}`,
        type: "info",
        title: `Application Status: ${app.status}`,
        message: `Application ${app.appNumber} is currently ${app.status}. Our admissions team is reviewing your profile.`,
        time: new Date(app.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        timestamp: app.updatedAt,
        read: true,
        href: `/dashboard/applications/${app.id}`,
      });
    }
  });

  // 2. Payments-based notifications
  payments.forEach((pay) => {
    notifications.push({
      id: `pay_${pay.id}`,
      type: "payment",
      title: `Payment Receipt: $${pay.amount.toFixed(2)} USD`,
      message: `Payment transaction ${pay.invoiceNumber} status is ${pay.status}.`,
      time: new Date(pay.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      timestamp: pay.createdAt,
      read: true,
      href: "/dashboard/payments",
    });
  });

  // 3. Interview-based notifications
  interviews.forEach((int) => {
    notifications.push({
      id: `int_${int.id}`,
      type: "interview",
      title: "Admissions Interview Scheduled",
      message: `Your interview has been arranged for ${new Date(int.date).toLocaleDateString('en-GB')} at ${int.time}.`,
      time: new Date(int.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      timestamp: int.createdAt,
      read: false,
      href: "/dashboard/applications",
    });
  });

  // Sort reverse chronological
  notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Welcome notification if brand new account with 0 activities
  if (notifications.length === 0) {
    notifications.push({
      id: "welcome_init",
      type: "info",
      title: "Welcome to Educare Global Academy Portal",
      message: "Begin your admissions journey by completing your student profile and starting a new application.",
      time: "Today",
      timestamp: new Date(),
      read: false,
      href: "/dashboard/applications/new",
    });
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500 font-jost text-left">
      <PageHeader
        badge="Notifications"
        icon={BellRing}
        title="Notifications"
        description="Stay updated on application status, deadlines, payments, and admissions announcements."
      />

      {unread > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#252D65]/20 bg-[#252D65]/5 px-5 py-3.5 shadow-2xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-[#252D65] animate-pulse" />
          <p className="text-xs sm:text-sm font-bold text-[#252D65]">
            You have {unread} unread update{unread > 1 ? "s" : ""} on your application profile
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => {
            const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.info;
            const Icon = style.icon;

            return (
              <Link
                key={notification.id}
                href={notification.href}
                className={`group flex gap-4 px-5 py-4.5 transition-colors hover:bg-slate-50/80 sm:px-6 ${
                  !notification.read ? "bg-[#252D65]/[0.02]" : ""
                }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                  <Icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 font-heading">{notification.title}</h3>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-[#252D65]" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">{notification.message}</p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-slate-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 self-center text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#252D65]"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
