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
    label: "MAIN",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
      { href: "/dashboard/applications/new", icon: PlusCircle, label: "New Application" },
      { href: "/dashboard/applications", icon: FileText, label: "My Applications", exact: true },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
      { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
    ],
  },
  {
    label: "COMMUNICATION",
    items: [
      { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
      { href: "/dashboard/notifications", icon: BellRing, label: "Notifications" },
    ],
  },
  {
    label: "ACCOUNT",
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
    <div className="space-y-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
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
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 relative overflow-hidden",
                  isActive
                    ? "bg-[#ED1C24] text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon
                  size={17}
                  className={cn(
                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span className={cn("flex-1 transition-colors duration-200 truncate", isActive && "font-semibold")}>
                  {item.label}
                </span>
                {hasBadge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] font-bold text-white shrink-0 px-1.5 border border-white/20">
                    2
                  </span>
                )}
                {isActive ? (
                  <ChevronRight size={14} className="opacity-90 transition-transform duration-200 ml-auto" />
                ) : (
                  <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200 text-slate-400 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
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
    <div className="flex min-h-screen bg-[#f8fafc] font-jost selection:bg-[#27295B]/20">
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-[270px] shrink-0 flex-col border-r border-[#1a233a] bg-[#0c1427] text-white md:flex">
        <div className="flex h-16 items-center border-b border-[#1a233a] px-5 bg-[#0c1427]">
          <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 shadow-xs flex items-center justify-center w-full">
            <Logo href="/dashboard" iconSize={125} />
          </div>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-3.5 py-6">
          <NavLinks pathname={pathname} />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[#0c1427]/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(290px,85vw)] flex-col bg-[#0c1427] text-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-[#1a233a] px-5">
              <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-white/20 shadow-xs">
                <Logo href="/dashboard" iconSize={110} />
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-6">
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            
            <div className="min-w-0 md:hidden">
              <p className="truncate text-sm font-bold text-slate-900">{pageTitle}</p>
            </div>

            <div className="relative hidden w-full max-w-md md:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search applications, documents..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-[#27295B]/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#27295B]/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/dashboard/messages"
              className="hidden items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#27295B] sm:inline-flex transition-colors"
            >
              <HelpCircle size={17} className="text-slate-400" />
              <span>Need Help?</span>
            </Link>

            <Link
              href="/dashboard/notifications"
              className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-all hover:bg-slate-50 hover:text-[#27295B]"
            >
              <Bell size={17} />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#ED1C24] text-[10px] font-bold text-white border-2 border-white">
                3
              </span>
            </Link>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger className="group outline-none">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-1.5 pr-3 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 sm:pr-4">
                  <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-[#27295B] text-xs font-bold text-white shrink-0 shadow-2xs">
                    {initials}
                  </div>
                  <div className="hidden flex-col items-start sm:flex text-left">
                    <span className="max-w-[130px] truncate text-xs font-bold leading-none text-slate-900 group-hover:text-[#27295B]">
                      {displayName}
                    </span>
                    <span className="mt-1 text-[10px] font-semibold text-slate-400 font-mono">
                      Applicant ID: APP-{user.id.substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 ml-1 hidden sm:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-2 w-64 rounded-2xl border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-md"
              >
                <div className="mb-1 px-3 py-3 text-left">
                  <p className="text-sm font-bold text-slate-900">{displayName}</p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="mb-2 bg-slate-100" />
                <DropdownMenuGroup className="space-y-1">
                  <Link href="/dashboard/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors focus:bg-[#27295B]/5 focus:text-[#27295B]">
                      <User className="mr-2.5 h-4 w-4 text-slate-400" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard/settings" className="w-full">
                    <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors focus:bg-[#27295B]/5 focus:text-[#27295B]">
                      <Settings className="mr-2.5 h-4 w-4 text-slate-400" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-2 bg-slate-100" />
                <DropdownMenuItem
                  className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors focus:bg-red-50 focus:text-red-700"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <div className="no-scrollbar relative flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-[#f8fafc]">
          <div className={cn("mx-auto w-full", isWizard ? "max-w-7xl" : "max-w-[1440px]")}>
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
