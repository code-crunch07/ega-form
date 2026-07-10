import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ChevronRight,
  PlusCircle,
  Sparkles,
  GraduationCap,
  FolderOpen,
  CreditCard,
  MessageSquare,
  UserIcon,
} from "lucide-react";
import { getMockSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getProfileCompletion,
  getUserDisplayName,
  formatRelativeDate,
} from "@/lib/dashboard-utils";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  const user = await getMockSessionUser();
  const displayName = getUserDisplayName(user);

  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const programmes = await prisma.programme.findMany({
    where: {
      id: { in: applications.map((a) => a.programmeId).filter(Boolean) as string[] },
    },
  });
  const programmeMap = Object.fromEntries(programmes.map((p) => [p.id, p.name]));

  const drafts = applications.filter((a) => a.status === "Draft").length;
  const submitted = applications.filter((a) => a.status !== "Draft").length;
  const profileScore = getProfileCompletion(user);

  const requiredActions = [
    profileScore < 100 && {
      id: "profile",
      title: "Complete your profile",
      description: `Your profile is ${profileScore}% complete. Add missing details to speed up applications.`,
      href: "/dashboard/profile",
      cta: "Update Profile",
      urgent: true,
    },
    drafts > 0 && {
      id: "drafts",
      title: "Finish draft application",
      description: `You have ${drafts} incomplete application${drafts > 1 ? "s" : ""} waiting to be submitted.`,
      href: "/dashboard/applications",
      cta: "Continue",
      urgent: false,
    },
    applications.length === 0 && {
      id: "start",
      title: "Start your first application",
      description: "Choose a programme and begin your admissions journey today.",
      href: "/dashboard/applications/new",
      cta: "Apply Now",
      urgent: false,
    },
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    cta: string;
    urgent: boolean;
  }>;

  const activeProgrammes = await prisma.programme.count({ where: { status: "Active" } });

  const quickLinks = [
    { href: "/dashboard/applications/new", icon: PlusCircle, label: "Apply", desc: "New application" },
    { href: "/dashboard/documents", icon: FolderOpen, label: "Documents", desc: "Upload files" },
    { href: "/dashboard/payments", icon: CreditCard, label: "Payments", desc: "View receipts" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Support", desc: "Get help" },
    { href: "/dashboard/profile", icon: UserIcon, label: "Profile", desc: "Update details" },
  ];

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-3xl bg-[#27295B] p-6 text-white shadow-xl shadow-indigo-950/15 sm:p-8 border border-white/5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-neutral-200">
              <Sparkles size={12} className="animate-pulse" />
              Applicant Portal
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white">
                {user.profile?.firstName || displayName.split(" ")[0]}
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-200">
              Track applications, upload documents, and stay on top of deadlines — all in one place.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild className="h-11 rounded-xl bg-white px-5 text-[#27295B] hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm border border-transparent font-bold">
                <Link href="/dashboard/applications/new">
                  <PlusCircle size={18} />
                  Start New Application
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold">
                <Link href="/dashboard/applications">View Applications</Link>
              </Button>
            </div>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-5 shadow-inner">
            <div className="mb-3 flex items-center justify-between text-sm font-bold">
              <span className="text-neutral-200">Profile completion</span>
              <span className="text-white bg-white/20 px-2 py-0.5 rounded-md text-xs">{profileScore}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000"
                style={{ width: `${profileScore}%` }}
              />
            </div>
            {profileScore < 100 && (
              <Link
                href="/dashboard/profile"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-200 hover:text-white transition-colors hover:underline"
              >
                Complete profile <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col items-center rounded-2xl border border-neutral-200/60 bg-white p-5 text-center shadow-2xs transition-all duration-300 hover:border-[#27295B]/20 hover:shadow-md hover:shadow-[#27295B]/5 hover:-translate-y-1"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#27295B]/6 text-[#27295B] transition-all duration-300 group-hover:bg-[#27295B] group-hover:text-white group-hover:scale-105 group-hover:shadow-md group-hover:shadow-[#27295B]/15">
              <link.icon size={20} />
            </div>
            <span className="text-sm font-bold text-neutral-800 transition-colors group-hover:text-[#27295B]">{link.label}</span>
            <span className="mt-1 text-xs font-medium text-neutral-400">{link.desc}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <StatCard
          label="Draft Applications"
          value={drafts}
          icon={FileText}
          href="/dashboard/applications"
          linkText="Continue draft"
          iconClassName="bg-slate-50 text-[#27295B] group-hover:bg-[#27295B]/10 group-hover:text-[#27295B]"
          className="border-neutral-200/60"
        />
        <StatCard
          label="Submitted"
          value={submitted}
          icon={CheckCircle2}
          href="/dashboard/applications"
          linkText="View status"
          iconClassName="bg-slate-50 text-emerald-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"
          className="border-neutral-200/60"
        />
        <StatCard
          label="Programmes Available"
          value={activeProgrammes}
          icon={GraduationCap}
          href="/dashboard/applications/new"
          linkText="Browse programmes"
          iconClassName="bg-slate-50 text-indigo-600 group-hover:bg-indigo-50 group-hover:text-indigo-700"
          className="border-neutral-200/60"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Recent applications */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between border-b border-neutral-100 bg-[#f8fafc]/50 px-6 py-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-neutral-800">
              <FileText size={18} className="text-[#27295B]" />
              Recent Applications
            </h3>
            <Link
              href="/dashboard/applications"
              className="text-xs font-bold text-[#27295B] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="flex-1 p-5 sm:p-6">
            {applications.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Start your first application to see progress and status updates here."
                action={{ label: "Start Application", href: "/dashboard/applications/new" }}
              />
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/dashboard/applications`}
                    className="group flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:border-indigo-500/20 hover:bg-slate-50/50 hover:shadow-2xs"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#27295B] group-hover:bg-[#27295B] group-hover:text-white transition-all duration-300">
                      <GraduationCap size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-bold text-neutral-800 group-hover:text-[#27295B] transition-colors">
                          {app.programmeId
                            ? programmeMap[app.programmeId] ?? "Programme"
                            : "Untitled Application"}
                        </p>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="mt-1 text-xs font-medium text-neutral-400">
                        {app.appNumber} · Updated {formatRelativeDate(app.updatedAt)}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="shrink-0 text-neutral-300 transition-all duration-300 group-hover:text-[#27295B] group-hover:translate-x-0.5"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Required actions + activity */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xs">
            <div className="border-b border-neutral-100 bg-[#f8fafc]/50 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-neutral-800">
                <AlertCircle size={18} className="text-amber-500" />
                Required Actions
              </h3>
            </div>
            <div className="space-y-3.5 p-5">
              {requiredActions.length === 0 ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 text-emerald-800">
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600 animate-bounce" />
                  <p className="text-sm font-bold">You&apos;re all caught up!</p>
                </div>
              ) : (
                requiredActions.map((action) => (
                  <div
                    key={action.id}
                    className={`rounded-xl border p-4.5 transition-all ${
                      action.urgent
                        ? "border-amber-200/80 bg-gradient-to-br from-amber-50/40 to-amber-50/10"
                        : "border-neutral-100 bg-slate-50/30"
                    }`}
                  >
                    <h4 className="text-sm font-bold text-neutral-800">{action.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 font-medium">
                      {action.description}
                    </p>
                    <Link
                      href={action.href}
                      className={`mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all hover:scale-[1.02] ${
                        action.urgent
                          ? "bg-amber-500 text-white hover:bg-amber-600 shadow-xs shadow-amber-500/10"
                          : "bg-[#27295B] text-white hover:bg-[#1E2045] shadow-xs shadow-indigo-500/10"
                      }`}
                    >
                      {action.cta} <ArrowRight size={12} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xs">
            <div className="border-b border-neutral-100 bg-[#f8fafc]/50 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-bold text-neutral-800">
                <Clock size={18} className="text-[#27295B]" />
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="relative ml-3 space-y-6 border-l border-neutral-200/80 pb-2">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="relative pl-6">
                    <div className="absolute -left-[25px] top-0.5 rounded-full bg-white p-0.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#27295B]/8 text-[#27295B] shadow-2xs">
                        <FileCheck2 size={11} />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      {app.status === "Draft" ? "Draft saved" : "Application updated"}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-neutral-400">
                      {app.appNumber} · {formatRelativeDate(app.updatedAt)}
                    </p>
                  </div>
                ))}
                <div className="relative pl-6">
                  <div className="absolute -left-[25px] top-0.5 rounded-full bg-white p-0.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-2xs">
                      <CheckCircle2 size={11} />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-800">Account created</h4>
                  <p className="mt-1 text-xs font-medium text-neutral-400">
                    {user.createdAt.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
