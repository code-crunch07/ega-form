"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { getAdminSession } from "@/app/actions/admin";
import { signOut } from "next-auth/react";
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
  UserCog,
  User,
  Key,
  ChevronDown,
  Award,
  Mail,
  BookOpen,
  CalendarDays,
  MapPin,
  FileText,
  RefreshCw,
  Shield,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatRole = (role: string) => {
  return role.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

interface LinkItem {
  href: string;
  icon: any;
  label: string;
  exact?: boolean;
  badge?: number;
}

interface SidebarGroup {
  title?: string;
  links: LinkItem[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    links: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true }
    ]
  },
  {
    title: "ADMISSIONS",
    links: [
      { href: "/admin/applications", icon: FileCheck, label: "Applications" },
      { href: "/admin/applicants", icon: Users, label: "Applicants" },
      { href: "/admin/documents", icon: Folder, label: "Documents" },
      { href: "/admin/interviews", icon: Calendar, label: "Interviews" },
      { href: "/admin/offers", icon: Award, label: "Offers" },
      { href: "/admin/scholarships", icon: GraduationCap, label: "Scholarships" },
    ]
  },
  {
    title: "ACADEMICS",
    links: [
      { href: "/admin/programmes", icon: BookOpen, label: "Programs" },
      { href: "/admin/intakes", icon: CalendarDays, label: "Intakes" },
      { href: "/admin/schools", icon: Building, label: "Schools / Faculties" },
      { href: "/admin/campuses", icon: MapPin, label: "Campuses" },
      { href: "/admin/courses", icon: Award, label: "Courses" },
    ]
  },
  {
    title: "FINANCE",
    links: [
      { href: "/admin/payments", icon: CreditCard, label: "Payments" },
      { href: "/admin/invoices", icon: FileText, label: "Invoices" },
      { href: "/admin/refunds", icon: RefreshCw, label: "Refunds" },
      { href: "/admin/fees", icon: Settings, label: "Fee Settings" },
    ]
  },
  {
    title: "COMMUNICATION",
    links: [
      { href: "/admin/messages", icon: MessageSquare, label: "Messages", badge: 12 },
      { href: "/admin/notifications", icon: Bell, label: "Notifications", badge: 20 },
      { href: "/admin/templates", icon: Mail, label: "Email Templates" },
    ]
  },
  {
    title: "SYSTEM",
    links: [
      { href: "/admin/users", icon: UserCog, label: "Users & Roles" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
      { href: "/admin/audit", icon: Shield, label: "Audit Logs" },
    ]
  }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name?: string | null; email?: string | null; role?: string } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    getAdminSession().then((session) => {
      if (!session) {
        window.location.href = "/admin/login";
      } else {
        setAdminUser({
          name: session.user?.name,
          email: session.user?.email,
          role: (session.user as any).role
        });
        setIsAuthenticated(true);
      }
    });
  }, [pathname]);

  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getPageTitle = (path: string) => {
    if (path === "/admin") return "Dashboard";
    if (path.startsWith("/admin/applications")) return "Applications";
    if (path.startsWith("/admin/applicants")) return "Applicants";
    if (path.startsWith("/admin/programmes")) return "Programmes";
    if (path.startsWith("/admin/schools")) return "Schools";
    if (path.startsWith("/admin/intakes")) return "Intakes";
    if (path.startsWith("/admin/payments")) return "Payments";
    if (path.startsWith("/admin/documents")) return "Documents";
    if (path.startsWith("/admin/messages")) return "Messages";
    if (path.startsWith("/admin/reports")) return "Reports";
    if (path.startsWith("/admin/users")) return "Users";
    return "Admissions";
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center font-sans text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest animate-pulse">Verifying Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a] font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      
      {/* Mockup Deep Navy Sidebar */}
      <aside 
        className={cn(
          "bg-[#0c1427] text-white flex-shrink-0 flex flex-col z-20 transition-all duration-300 border-r border-[#131d35]",
          isCollapsed ? "w-[76px]" : "w-[280px]"
        )}
      >
        {/* Sidebar Branded Logo header */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-[#131d35] flex-shrink-0 overflow-hidden">
          <Logo href="/admin" iconSize={isCollapsed ? 32 : 120} className={cn("transition-all", isCollapsed ? "p-1 rounded-lg bg-white/5" : "")} />
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar space-y-5 text-left">
          {SIDEBAR_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.title && !isCollapsed && (
                <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              {group.links.map((link) => {
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);
                
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-[14px] font-medium",
                      isActive 
                        ? "bg-[#e11d48] text-white font-semibold" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <link.icon 
                      size={18} 
                      className={cn(
                        "flex-shrink-0 transition-transform duration-200 group-hover:scale-110", 
                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                      )} 
                    />
                    {!isCollapsed && (
                      <span className="flex-1 text-[14px] truncate">{link.label}</span>
                    )}
                    {link.badge !== undefined && !isCollapsed && (
                      <span className="h-5 px-1.5 rounded-full bg-[#e11d48] text-white text-[11px] font-bold flex items-center justify-center min-w-5">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Collapse Button */}
        <div className="p-3 border-t border-[#131d35] flex-shrink-0">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200 text-[14px] font-medium"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-[14px]">Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>
      
      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Premium Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-neutral-200/80 flex-shrink-0 z-10 sticky top-0">
          {/* Left Side: Hamburger & Dynamic Title */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col text-left">
              <h1 className="text-[30px] font-bold text-slate-900 leading-none">{getPageTitle(pathname)}</h1>
              <p className="text-[14px] text-neutral-500 font-normal mt-1 leading-none">
                Welcome back, <span className="text-[#e11d48] font-semibold">Admin</span>
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-[480px] mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search applicants, applications, ID..."
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-800 h-10 pl-10 pr-16 rounded-full text-[14px] focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-neutral-400"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 font-sans text-[11px] font-medium text-neutral-400 border border-neutral-200/60 rounded px-1.5 py-0.5 bg-white select-none pointer-events-none">
                Ctrl + K
              </div>
            </div>
          </div>
          
          {/* Right Profile Dropdown and Actions */}
          <div className="flex items-center gap-4">
            
            {/* Messages Icon */}
            <button className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-all">
              <MessageSquare size={18} />
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#e11d48] text-white text-[9px] font-bold flex items-center justify-center">
                12
              </span>
            </button>

            {/* Notifications Icon */}
            <button className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-all">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#e11d48] text-white text-[9px] font-bold flex items-center justify-center">
                20
              </span>
            </button>
            
            <div className="h-6 w-px bg-neutral-200" />

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none group">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md group-hover:ring-2 ring-blue-500/20 ring-offset-2 transition-all duration-200">
                    {getInitials(adminUser?.name)}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-[14px] font-semibold text-slate-800 leading-none">
                      {adminUser?.name || "Admin User"}
                    </span>
                    <span className="text-[12px] text-neutral-400 font-normal mt-0.5 leading-none">
                      {adminUser?.role ? formatRole(adminUser.role) : "Super Admin"}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-neutral-200/60 bg-white/95 backdrop-blur-md p-1.5">
                <div className="px-2 py-2.5 mb-1 text-left">
                  <p className="text-[14px] font-semibold text-slate-800">
                    {adminUser?.name || "Admin User"}
                  </p>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    {adminUser?.email || "admin@educare.com"}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-neutral-100 mb-1" />
                <DropdownMenuGroup>
                  <Link href="/admin/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-neutral-700 focus:bg-neutral-50 transition-colors">
                      <User className="mr-2.5 h-4 w-4 text-neutral-500" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/profile/password" className="w-full">
                    <DropdownMenuItem className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-neutral-700 focus:bg-neutral-50 transition-colors">
                      <Key className="mr-2.5 h-4 w-4 text-neutral-500" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-neutral-100 my-1" />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="cursor-pointer py-2 px-2.5 rounded-lg text-sm text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors"
                >
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 z-10 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
