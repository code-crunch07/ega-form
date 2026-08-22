"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { getAdminSession, getSidebarBadgeCounts, searchAdminRecords } from "@/app/actions/admin";
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
  Briefcase,
  BookOpen,
  CalendarDays,
  MapPin,
  FileText,
  RefreshCw,
  Shield,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  ArrowRight
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
      { href: "/admin/agents", icon: Briefcase, label: "Recruitment Agents" },
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
      { href: "/admin/notifications", icon: Bell, label: "Notifications" },
      { href: "/admin/templates", icon: Mail, label: "Email Templates" },
    ]
  },
  {
    title: "SYSTEM",
    links: [
      { href: "/admin/users", icon: UserCog, label: "Users & Roles" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
      { href: "/admin/audit-logs", icon: Shield, label: "Audit Logs" },
    ]
  }
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name?: string | null; email?: string | null; role?: string } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({ notifications: 0, messages: 0 });

  // Live Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ applications: any[]; applicants: any[]; programmes: any[] }>({
    applications: [],
    applicants: [],
    programmes: []
  });
  const [isSearching, setIsSearching] = useState(false);

  // Keyboard listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search query trigger
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ applications: [], applicants: [], programmes: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAdminRecords(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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

    getSidebarBadgeCounts().then(counts => {
      setBadgeCounts(counts);
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
    <div className="flex min-h-screen bg-[#f3f3fa] dark:bg-[#0a0a0a] font-jost selection:bg-[#252D65]/20 print:bg-white print:block print:p-0 print:m-0">
      
      {/* White Theme Admin Sidebar (Hidden on Print) */}
      <aside 
        className={cn(
          "bg-white text-slate-900 flex-shrink-0 flex flex-col z-20 transition-all duration-300 border-none print:hidden",
          isCollapsed ? "w-[76px]" : "w-[280px]"
        )}
      >
        {/* Sidebar Branded Logo Header (Left Aligned) */}
        <div className="h-16 flex items-center justify-start px-5 border-b border-slate-200 flex-shrink-0 overflow-hidden bg-white">
          <Logo href="/admin" iconSize={isCollapsed ? 32 : 125} className={cn("transition-all", isCollapsed ? "p-1 rounded-lg" : "")} />
        </div>
        
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3.5 no-scrollbar space-y-5 text-left bg-white">
          {SIDEBAR_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.title && !isCollapsed && (
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                        ? "bg-[#252D65] text-white font-bold shadow-md shadow-[#252D65]/25" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <link.icon 
                      size={18} 
                      className={cn(
                        "flex-shrink-0 transition-transform duration-200 group-hover:scale-110", 
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                      )} 
                    />
                    {!isCollapsed && (
                      <span className="flex-1 text-[14px] truncate">{link.label}</span>
                    )}
                    {link.href === "/admin/notifications" && badgeCounts.notifications > 0 && !isCollapsed && (
                      <span className="h-5 px-1.5 rounded-full bg-[#252D65] text-white text-[11px] font-bold flex items-center justify-center min-w-5">
                        {badgeCounts.notifications}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Collapse Button */}
        <div className="p-3 border-t border-slate-200 flex-shrink-0 bg-white">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200 text-[14px] font-medium"
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
      <main className="flex-1 flex flex-col h-screen overflow-auto relative bg-[#f2f2f282] print:bg-white print:h-auto print:overflow-visible print:p-0 print:m-0 print:block">
        {/* Premium Header (Hidden on Print) */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200/80 flex-shrink-0 z-10 sticky top-0 print:hidden">
          {/* Left Side: Hamburger & Dynamic Title */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col text-left">
              <h1 className="text-[26px] font-extrabold text-slate-900 leading-none font-heading">{getPageTitle(pathname)}</h1>
              <p className="text-[13px] text-slate-500 font-medium mt-1 leading-none">
                Welcome back, <span className="text-[#252D65] font-bold">Admin</span>
              </p>
            </div>
          </div>

          {/* Center Search Input (Triggers Search Palette Modal) */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-[480px] mx-8">
            <button 
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="relative w-full group flex items-center bg-slate-50 hover:bg-white border border-slate-200 text-neutral-800 h-10 pl-10 pr-16 rounded-full text-[14px] transition-all cursor-pointer shadow-2xs hover:border-[#252D65] hover:ring-2 hover:ring-[#252D65]/15"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-[#252D65] transition-colors" size={18} />
              <span className="text-slate-400 font-medium truncate">Search applicants, applications, ID...</span>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 font-sans text-[11px] font-medium text-slate-500 border border-slate-200/80 rounded px-1.5 py-0.5 bg-white select-none shadow-2xs">
                Ctrl + K
              </div>
            </button>
          </div>
          
          {/* Right Profile Dropdown and Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notifications Icon (Navigates to /admin/notifications) */}
            <Link 
              href="/admin/notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all group"
              title="View Notifications"
            >
              <Bell size={19} className="group-hover:scale-110 transition-transform" />
              {badgeCounts.notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-[#252D65] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                  {badgeCounts.notifications}
                </span>
              )}
            </Link>
            
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
                    <DropdownMenuItem className="cursor-pointer py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65] transition-colors">
                      <User className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/profile/password" className="w-full">
                    <DropdownMenuItem className="cursor-pointer py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#252D65] focus:bg-slate-100 focus:text-[#252D65] transition-colors">
                      <Key className="mr-2.5 h-4 w-4 text-slate-500" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-neutral-100 my-1" />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="cursor-pointer py-2.5 px-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors"
                >
                  <LogOut className="mr-2.5 h-4 w-4 text-red-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 z-10 bg-[#f2f2f282] print:bg-white print:p-0 print:m-0 print:overflow-visible print:block">
          <div className="max-w-[1600px] mx-auto print:max-w-none print:w-full print:p-0 print:m-0">
            {children}
          </div>
        </div>
      </main>

      {/* Interactive Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl mx-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-neutral-800 h-14 bg-white dark:bg-neutral-900">
              <Search className="text-[#252D65] mr-3 flex-shrink-0" size={20} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search applications, applicants, programmes..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-[15px] font-medium outline-none"
              />
              {isSearching && <Loader2 className="animate-spin text-slate-400 mr-2" size={18} />}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-neutral-800 mr-1"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 bg-slate-100 dark:bg-neutral-800 rounded-md"
              >
                ESC
              </button>
            </div>

            {/* Results Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-left">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  <p className="font-medium text-slate-500">Quick Search Shortcuts</p>
                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    <button onClick={() => setSearchQuery("APP")} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-[#252D65] hover:text-white font-medium transition-colors">Applications</button>
                    <button onClick={() => setSearchQuery("EGA")} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-[#252D65] hover:text-white font-medium transition-colors">Programmes</button>
                    <button onClick={() => setSearchQuery("John")} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-[#252D65] hover:text-white font-medium transition-colors">Applicants</button>
                  </div>
                </div>
              ) : isSearching ? (
                <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                  Searching live database records...
                </div>
              ) : searchResults.applications.length === 0 && searchResults.applicants.length === 0 && searchResults.programmes.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No matching records found for "{searchQuery}".
                </div>
              ) : (
                <>
                  {/* Matching Applications */}
                  {searchResults.applications.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Applications</p>
                      <div className="space-y-1">
                        {searchResults.applications.map((app) => {
                          const name = app.user?.profile ? `${app.user.profile.firstName || ''} ${app.user.profile.lastName || ''}`.trim() : app.user?.name || "Applicant";
                          return (
                            <Link
                              key={app.id}
                              href={`/admin/applications/${app.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <FileCheck size={18} className="text-[#252D65]" />
                                <div>
                                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{app.appNumber || app.id}</span>
                                  <span className="text-xs text-slate-500 ml-2">({name})</span>
                                </div>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">View &rarr;</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Applicants */}
                  {searchResults.applicants.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Applicants</p>
                      <div className="space-y-1">
                        {searchResults.applicants.map((user) => {
                          const name = user.profile ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : user.name || "Applicant";
                          return (
                            <Link
                              key={user.id}
                              href={`/admin/applicants/${user.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <Users size={18} className="text-[#252D65]" />
                                <div>
                                  <span className="font-semibold text-slate-900 dark:text-white text-sm">{name}</span>
                                  <span className="text-xs text-slate-500 ml-2">{user.email}</span>
                                </div>
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">Profile &rarr;</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Programmes */}
                  {searchResults.programmes.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Programmes</p>
                      <div className="space-y-1">
                        {searchResults.programmes.map((prog) => (
                          <Link
                            key={prog.id}
                            href="/admin/programmes"
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen size={18} className="text-[#252D65]" />
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">{prog.name}</span>
                                <span className="text-xs text-slate-500 ml-2">[{prog.code}]</span>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">Programme &rarr;</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
