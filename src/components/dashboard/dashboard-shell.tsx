"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  MessageSquare,
  Bell,
  LogOut,
  User as UserIcon,
  User,
  Settings,
  FolderOpen,
  PlusCircle,
  BellRing,
  Search,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserDisplayName, getUserInitials, getDashboardBreadcrumbs } from "@/lib/dashboard-utils";

type DashboardUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
      { href: "/dashboard/applications/new", icon: PlusCircle, label: "New Application" },
      { href: "/dashboard/applications", icon: FileText, label: "My Applications", exact: true },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
      { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
      { href: "/dashboard/notifications", icon: BellRing, label: "Notifications" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/profile", icon: UserIcon, label: "My Profile" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/profile": "My Profile",
  "/dashboard/applications/new": "New Application",
  "/dashboard/applications": "My Applications",
  "/dashboard/documents": "Documents",
  "/dashboard/payments": "Payments",
  "/dashboard/messages": "Messages",
  "/dashboard/notifications": "Notifications",
  "/dashboard/settings": "Settings",
};

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.entries(PAGE_TITLES).find(
    ([path]) => path !== "/dashboard" && pathname.startsWith(path)
  );
  return match?.[1] ?? "Applicant Portal";
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="space-y-1.5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400/90 font-mono">
            {section.label}
          </p>
          {section.items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const hasBadge = item.label === "Messages";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-heading font-medium transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-[#ED1C24] text-white shadow-lg shadow-red-900/10 font-semibold"
                    : "text-slate-300 hover:bg-[#1E2045]/60 hover:text-white"
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-all duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className={cn("flex-1 transition-colors duration-300", isActive && "font-semibold")}>
                  {item.label}
                </span>
                {hasBadge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] font-bold text-white shrink-0">
                    2
                  </span>
                )}
                {isActive ? (
                  <ChevronRight size={14} className="opacity-90 translate-x-0 transition-transform duration-300 ml-auto" />
                ) : (
                  <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 text-slate-400 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser;
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = getDashboardBreadcrumbs(pathname);
  const isWizard = pathname.startsWith("/dashboard/applications/new");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-[#27295B]/20">
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-[272px] shrink-0 flex-col border-r border-[#27295B]/10 bg-[#27295B] text-white md:flex">
        <div className="flex h-16 items-center border-b border-white/5 px-6">
          <Logo href="/dashboard" iconSize={130} />
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-between">
          <div className="space-y-8">
            <NavLinks pathname={pathname} />
          </div>

          <div className="relative mx-1 mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#1E2045] p-5 shadow-xs">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ED1C24]/10 text-[#ED1C24]">
                <Headphones size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Need Help?</h4>
              <p className="mt-1.5 mb-4 text-xs leading-relaxed text-slate-300 font-medium">
                Our admission team is here to assist you with your application.
              </p>
              <Link
                href="/dashboard/messages"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#ED1C24] bg-transparent px-3 py-2 text-xs font-bold text-[#ED1C24] transition-all hover:bg-[#ED1C24] hover:text-white"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#27295B]/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(300px,85vw)] flex-col bg-[#27295B] text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
              <Logo href="/dashboard" iconSize={110} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-8">
                <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#27295B]/[0.03] to-transparent" />

        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/50 bg-white px-4 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-neutral-200 p-2.5 text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 md:hidden">
              <p className="truncate text-sm font-semibold text-neutral-900">{pageTitle}</p>
            </div>
            <div className="relative hidden w-full max-w-md md:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search applications, documents..."
                className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 transition-all duration-300 focus:border-[#27295B]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#27295B]/8"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/dashboard/messages"
              className="hidden items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#27295B] sm:inline-flex"
            >
              <HelpCircle size={18} className="text-neutral-500" />
              <span>Need Help?</span>
            </Link>

            <Link
              href="/dashboard/notifications"
              className="relative rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-500 transition-all hover:bg-neutral-50 hover:text-[#27295B]"
            >
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] font-bold text-white border-2 border-white">
                3
              </span>
            </Link>

            <div className="hidden h-6 w-px bg-neutral-200 sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger className="group outline-none">
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/90 p-1.5 pr-3 transition-all duration-300 hover:bg-neutral-50 hover:shadow-2xs group-data-open:bg-neutral-50 sm:pr-4">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-800 border border-neutral-200 shrink-0">
                    <UserIcon size={16} />
                  </div>
                  <div className="hidden flex-col items-start sm:flex text-left">
                    <span className="max-w-[120px] truncate text-sm font-bold leading-none text-neutral-800 group-hover:text-[#27295B]">
                      {displayName}
                    </span>
                    <span className="mt-1.5 text-[10px] font-semibold text-neutral-400">
                      Applicant ID: APP-{user.id.substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 ml-1 hidden sm:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-2 w-64 rounded-xl border-neutral-200 bg-white/95 p-2 shadow-xl backdrop-blur-md"
              >
                <div className="mb-1 px-3 py-3">
                  <p className="text-sm font-bold text-neutral-900">{displayName}</p>
                  <p className="mt-0.5 text-xs font-medium text-neutral-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="mb-2 bg-neutral-100" />
                <DropdownMenuGroup className="space-y-1">
                  <Link href="/dashboard/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors focus:bg-[#27295B]/5 focus:text-[#27295B]">
                      <User className="mr-3 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/settings" className="w-full">
                    <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors focus:bg-[#27295B]/5 focus:text-[#27295B]">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-2 bg-neutral-100" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors focus:bg-red-50 focus:text-red-700"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="no-scrollbar relative z-[1] flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-[1280px]">
            {isWizard && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} className="mb-4" />
            )}
            {!isWizard && breadcrumbs.length > 0 && (
              <Breadcrumbs items={breadcrumbs} />
            )}
            {children}
          </div>
        </div>

        {!isWizard && (
          <Link
            href="/dashboard/applications/new"
            className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#27295B] text-white shadow-lg shadow-[#27295B]/30 transition-transform hover:scale-105 hover:bg-[#1E2045] sm:hidden"
            aria-label="Start new application"
          >
            <PlusCircle size={24} />
          </Link>
        )}
      </main>
    </div>
  );
}
