"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
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
  Users, 
  FileCheck, 
  GraduationCap, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Building,
  Calendar,
  Folder,
  MessageSquare,
  BarChart,
  UserCog,
  ChevronDown,
  User,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/applications", icon: FileCheck, label: "Applications" },
  { href: "/admin/applicants", icon: Users, label: "Applicants" },
  { href: "/admin/programmes", icon: GraduationCap, label: "Programmes" },
  { href: "/admin/schools", icon: Building, label: "Schools" },
  { href: "/admin/intakes", icon: Calendar, label: "Intakes" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/documents", icon: Folder, label: "Documents" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/reports", icon: BarChart, label: "Reports" },
  { href: "/admin/users", icon: UserCog, label: "Users" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  
  const isSettingsActive = pathname.startsWith("/admin/settings");

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Premium Glass Sidebar */}
      <aside className="w-[260px] bg-white/80 dark:bg-neutral-950/80 backdrop-blur-2xl border-r border-neutral-200/60 dark:border-neutral-800/60 flex-shrink-0 flex flex-col hidden md:flex z-20">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <Logo href="/admin" iconSize={120} textClass="hidden" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Menu</p>
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-600 shadow-md shadow-blue-500/20 text-white" 
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                  )}
                >
                  <item.icon size={18} className={cn("transition-transform duration-200 group-hover:scale-110", isActive ? "text-blue-100" : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white")} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">System</p>
            <details className="group" open={isSettingsActive}>
              <summary className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-200 list-none [&::-webkit-details-marker]:hidden",
                isSettingsActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}>
                <div className="flex items-center gap-3">
                  <Settings size={18} className={cn("transition-transform duration-200 group-hover:scale-110", isSettingsActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-500 dark:text-neutral-400")} />
                  <span className="text-sm">Settings</span>
                </div>
                <ChevronDown size={14} className="transition-transform duration-300 group-open:-rotate-180 opacity-50" />
              </summary>
              <div className="mt-2 flex flex-col gap-0.5 pl-11 pr-3 pb-2 relative before:absolute before:left-[21px] before:top-0 before:bottom-4 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800">
                {[
                  { path: "/admin/settings/email", label: "Email Templates" },
                  { path: "/admin/settings/workflow", label: "App Workflow" },
                  { path: "/admin/settings/payments", label: "Payments" },
                  { path: "/admin/settings/storage", label: "Storage (S3)" },
                  { path: "/admin/settings/notifications", label: "Notifications" },
                  { path: "/admin/settings/roles", label: "User Roles" },
                  { path: "/admin/settings/branding", label: "Branding" },
                  { path: "/admin/settings/api-keys", label: "API Keys" },
                  { path: "/admin/settings/audit", label: "Audit Logs" }
                ].map((sub) => (
                  <Link 
                    key={sub.path} 
                    href={sub.path} 
                    className={cn(
                      "relative py-2 text-[13px] font-medium transition-colors rounded-lg px-3 -ml-3",
                      pathname === sub.path 
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" 
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                    )}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Decorative background glow in light mode */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none -z-10" />

        {/* Premium Frosted Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center md:hidden">
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Admin</span>
          </div>
          <div className="flex-1" />
          
          <div className="flex items-center gap-3 sm:gap-5">
            <button className="relative p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-950"></span>
            </button>
            
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none group">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-none">Admin User</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-none">Super Admin</span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md group-hover:ring-2 ring-blue-500/20 ring-offset-2 dark:ring-offset-neutral-950 transition-all duration-200">
                    AD
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-1.5">
                <div className="px-2 py-2.5 mb-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">admin@educare.com</p>
                </div>
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 mb-1" />
                <DropdownMenuGroup>
                  <Link href="/admin/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 focus:bg-neutral-100 dark:focus:bg-neutral-800 transition-colors">
                      <User className="mr-2.5 h-4 w-4 text-neutral-500" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/profile/password" className="w-full">
                    <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 focus:bg-neutral-100 dark:focus:bg-neutral-800 transition-colors">
                      <Key className="mr-2.5 h-4 w-4 text-neutral-500" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800 my-1" />
                <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-500 dark:focus:bg-red-500/10 transition-colors">
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 z-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
