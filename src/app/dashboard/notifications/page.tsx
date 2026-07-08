import Link from "next/link";
import {
  BellRing,
  FileText,
  CreditCard,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "info",
    title: "Welcome to the Applicant Portal",
    message: "Complete your profile to speed up future applications.",
    time: "Just now",
    read: false,
    href: "/dashboard/profile",
  },
  {
    id: "2",
    type: "action",
    title: "Document upload reminder",
    message: "Some applications may require supporting documents before review.",
    time: "2 hours ago",
    read: false,
    href: "/dashboard/documents",
  },
  {
    id: "3",
    type: "success",
    title: "Application fee information",
    message: "Application fees are payable at the final step of your submission.",
    time: "Yesterday",
    read: true,
    href: "/dashboard/payments",
  },
];

const TYPE_STYLES = {
  info: { icon: Info, bg: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  action: { icon: FileText, bg: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  success: { icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  payment: { icon: CreditCard, bg: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
};

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Notifications"
        icon={BellRing}
        title="Notifications"
        description="Stay updated on application status, deadlines, and important announcements."
        actions={
          unread > 0 ? (
            <Button variant="outline" className="h-10 rounded-xl border-neutral-200">
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {unread > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[#2C315E]/20 bg-[#2C315E]/5 px-4 py-3">
          <span className="flex h-2 w-2 rounded-full bg-[#2C315E]" />
          <p className="text-sm font-medium text-[#2C315E]">
            You have {unread} unread notification{unread > 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <div className="divide-y divide-neutral-100">
          {NOTIFICATIONS.map((notification) => {
            const style = TYPE_STYLES[notification.type as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.info;
            const Icon = style.icon;

            return (
              <Link
                key={notification.id}
                href={notification.href}
                className={`group flex gap-4 px-5 py-5 transition-colors hover:bg-neutral-50/80 sm:px-6 ${
                  !notification.read ? "bg-[#2C315E]/[0.02]" : ""
                }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">{notification.message}</p>
                      <p className="mt-2 text-xs font-medium text-neutral-400">{notification.time}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-neutral-300 transition-colors group-hover:text-[#2C315E]"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
