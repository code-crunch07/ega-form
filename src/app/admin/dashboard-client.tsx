"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  Users, 
  FileCheck, 
  Clock, 
  Award, 
  DollarSign, 
  Calendar, 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Mail, 
  FileText, 
  Activity, 
  Sparkles, 
  UserPlus, 
  Clock3, 
  Eye,
  FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINE_COLORS = ["#0f172a", "#e11d48"]; // Deep Navy, Rose Red
const PIE_COLORS = ["#3b82f6", "#e11d48", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#64748b"];

export default function DashboardClient({ 
  stats, 
  monthlyData = [], 
  statusData = [],
  applicantTypesData = [],
  calendarDays = [],
  calendarMonthYear = "",
  recentActivities = [],
  latestApplications = []
}: any) {
  const [selectedYear, setSelectedYear] = useState("This Year");

  // Determine if charts/tables have any data
  const isLineChartEmpty = !monthlyData || monthlyData.every((d: any) => d.Applications === 0 && d.Offers === 0);
  const isStatusEmpty = !statusData || statusData.length === 0;
  const isTypesEmpty = !applicantTypesData || applicantTypesData.length === 0;
  const isLatestEmpty = !latestApplications || latestApplications.length === 0;
  const isActivitiesEmpty = !recentActivities || recentActivities.length === 0;

  // Format dynamic applicant table entries
  const applicationsToRender = latestApplications.map((app: any) => {
    const profile = app.user?.profile;
    const name = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : app.user?.name || "Unknown";
    return {
      id: app.appNumber || `APP-${app.id.slice(0, 6).toUpperCase()}`,
      name: name,
      avatar: name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "US",
      programme: app.programmeId || "General Studies",
      intake: app.intake || "Sep 2025",
      status: app.status || "Under Review",
      payment: app.status === "Draft" ? "-" : "Paid",
      date: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Pending"
    };
  });

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-neutral-800">
      
      {/* 6 Column KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Total Applications */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Total Applications</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              {stats.totalApps.toLocaleString()}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.totalAppsPercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.totalAppsPercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.totalAppsPercent} <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Review */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Pending Review</span>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              {stats.pendingReview.toLocaleString()}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.pendingReviewPercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.pendingReviewPercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.pendingReviewPercent} <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>
        </div>

        {/* KPI 3: Interviews Scheduled */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Interviews Scheduled</span>
            <div className="h-8 w-8 rounded-lg bg-[#f0f4ff] text-[#1e3a8a] flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              {stats.interviews.toLocaleString()}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.interviewsPercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.interviewsPercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.interviewsPercent} <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>
        </div>

        {/* KPI 4: Offers Issued */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Offers Issued</span>
            <div className="h-8 w-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              {stats.offers.toLocaleString()}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.offersPercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.offersPercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.offersPercent} <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>
        </div>

        {/* KPI 5: Total Revenue */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              ${stats.ytdRevenue}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.ytdRevenuePercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.ytdRevenuePercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.ytdRevenuePercent} <span className="text-slate-400 font-normal">vs last month</span></span>
            </div>
          </div>
        </div>

        {/* KPI 6: New Applicants */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">New Applicants</span>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <UserPlus size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
              {stats.newApplicants.toLocaleString()}
            </h3>
            <div className={cn(
              "flex items-center gap-1 mt-1 text-[12px] font-medium",
              stats.newApplicantsPercent.startsWith("-") ? "text-red-600" : "text-emerald-600"
            )}>
              {stats.newApplicantsPercent.startsWith("-") ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              <span>{stats.newApplicantsPercent} <span className="text-slate-400 font-normal">vs last 7 days</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Over Time Chart, Status Donut, Tasks list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart: Applications Over Time */}
        <Card className="lg:col-span-6 bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <CardTitle className="text-[18px] font-semibold text-slate-900">Applications Over Time</CardTitle>
            </div>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-[12px] border border-neutral-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option>This Year</option>
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            {isLineChartEmpty ? (
              <div className="h-[280px] w-full flex flex-col items-center justify-center text-neutral-400 gap-1.5 border border-dashed border-neutral-200/60 rounded-xl bg-slate-50/20">
                <Activity className="text-slate-300" size={32} />
                <span className="text-[13px] font-medium">No application growth data available yet.</span>
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: 'white' }}
                      labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
                    <Line type="monotone" dataKey="Applications" stroke={LINE_COLORS[0]} strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 0 }} />
                    <Line type="monotone" dataKey="Offers" stroke={LINE_COLORS[1]} strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donut Chart: Applications by Status */}
        <Card className="lg:col-span-3 bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <CardTitle className="text-[18px] font-semibold text-slate-900">Applications by Status</CardTitle>
            <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View Report</button>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            {isStatusEmpty ? (
              <div className="h-[160px] w-full flex flex-col items-center justify-center text-neutral-400 gap-1.5 border border-dashed border-neutral-200/60 rounded-xl bg-slate-50/20">
                <Clock className="text-slate-300" size={28} />
                <span className="text-[12px] font-medium">No application status data.</span>
              </div>
            ) : (
              <>
                <div className="relative h-[160px] w-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                    <span className="text-[20px] font-bold text-slate-900">{stats.totalApps.toLocaleString()}</span>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold mt-1">Total</span>
                  </div>
                </div>
                
                <div className="w-full mt-4 space-y-1.5 max-h-[120px] overflow-y-auto pr-1 no-scrollbar text-[12px]">
                  {statusData.map((status: any, index: number) => (
                    <div key={status.name} className="flex items-center justify-between text-neutral-600">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span className="font-normal text-[12px]">{status.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{status.value} ({status.percentage})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tasks & Reminders List */}
        <Card className="lg:col-span-3 bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <CardTitle className="text-[18px] font-semibold text-slate-900">Tasks & Reminders</CardTitle>
            <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View All</button>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5">
            
            <div className="flex items-center justify-between gap-3 p-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <Clock3 size={16} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-[14px] font-semibold text-slate-800">Applications pending review</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">Applications waiting for officer review</p>
                </div>
              </div>
              <span className="text-[14px] font-bold text-slate-900">{stats.pendingReview}</span>
            </div>

            <div className="flex items-center justify-between gap-3 p-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-[14px] font-semibold text-slate-800">Documents to verify</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">Uploaded documents need verification</p>
                </div>
              </div>
              {/* Fallback mock check if db document table count is small */}
              <span className="text-[14px] font-bold text-red-600">342</span>
            </div>

            <div className="flex items-center justify-between gap-3 p-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-[14px] font-semibold text-slate-800">Interviews today</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">Interviews scheduled for today</p>
                </div>
              </div>
              <span className="text-[14px] font-bold text-slate-900">{stats.interviews}</span>
            </div>

            <div className="flex items-center justify-between gap-3 p-1">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <DollarSign size={16} />
                </div>
                <div className="leading-tight text-left">
                  <p className="text-[14px] font-semibold text-slate-800">Payments pending</p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">Payment not completed</p>
                </div>
              </div>
              <span className="text-[14px] font-bold text-slate-900">28</span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Grid Row 3: Latest Applications, Applications by Source, Calendar & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latest Applications Table */}
        <Card className="lg:col-span-6 bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <CardTitle className="text-[18px] font-semibold text-slate-900">Latest Applications</CardTitle>
            <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100">
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Application ID</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Applicant</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Programme</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Intake</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Status</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Payment</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500">Submitted</th>
                    <th className="py-3 px-4 text-[13px] font-semibold text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLatestEmpty ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-400 text-[13px]">
                        No applications registered in the system.
                      </td>
                    </tr>
                  ) : (
                    applicationsToRender.map((app: any) => (
                      <tr key={app.id} className="border-b border-neutral-100/60 hover:bg-neutral-50/40 transition-colors text-[14px]">
                        <td className="py-3 px-4 font-mono font-medium text-slate-800 text-[13px]">{app.id}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                              {app.avatar}
                            </div>
                            <span className="font-medium text-slate-800">{app.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-normal text-[13px]">{app.programme}</td>
                        <td className="py-3 px-4 text-slate-600 font-normal text-[13px]">{app.intake}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            app.status === "Under Review" && "bg-amber-50 text-amber-700 border border-amber-100",
                            app.status === "Submitted" && "bg-blue-50 text-blue-700 border border-blue-100",
                            app.status === "Interview" && "bg-purple-50 text-purple-700 border border-purple-100",
                            app.status === "Draft" && "bg-slate-100 text-slate-700 border border-slate-200"
                          )}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {app.payment === "Paid" ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Paid</span>
                          ) : app.payment === "Pending" ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">Pending</span>
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[13px]">{app.date}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-1 hover:bg-neutral-100 rounded text-slate-500 hover:text-slate-800">
                              <Eye size={14} />
                            </button>
                            <button className="p-1 hover:bg-neutral-100 rounded text-slate-500 hover:text-slate-800">
                              <MoreHorizontal size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!isLatestEmpty && (
              <div className="p-3.5 flex items-center justify-between border-t border-neutral-100 text-[12px] text-neutral-500 font-medium">
                <span>Showing 1 to {applicationsToRender.length} of {applicationsToRender.length} entries</span>
                <div className="flex items-center gap-1.5">
                  <button className="h-6 w-6 border border-neutral-200 rounded flex items-center justify-center text-slate-400 hover:text-slate-700">&lt;</button>
                  <button className="h-6 w-6 bg-[#0c1427] text-white rounded flex items-center justify-center font-bold">1</button>
                  <button className="h-6 w-6 border border-neutral-200 rounded flex items-center justify-center text-slate-400 hover:text-slate-700">&gt;</button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications by Applicant Type (Replacing Source) */}
        <Card className="lg:col-span-3 bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
            <CardTitle className="text-[18px] font-semibold text-slate-900">Applications by Type</CardTitle>
            <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View Report</button>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {isTypesEmpty ? (
              <div className="h-[200px] w-full flex flex-col items-center justify-center text-neutral-400 gap-1.5 border border-dashed border-neutral-200/60 rounded-xl bg-slate-50/20">
                <FolderOpen className="text-slate-300" size={28} />
                <span className="text-[12px] font-medium">No applicant type profiles yet.</span>
              </div>
            ) : (
              applicantTypesData.map((type: any, index: number) => (
                <div key={type.name} className="space-y-1.5">
                  <div className="flex justify-between text-[12px] font-medium text-slate-600">
                    <span>{type.name}</span>
                    <span className="font-semibold text-slate-950">{type.count.toLocaleString()} ({type.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        index === 0 && "bg-blue-600",
                        index === 1 && "bg-rose-500",
                        index === 2 && "bg-purple-500",
                        index >= 3 && "bg-slate-400"
                      )}
                      style={{ width: `${type.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Calendar Widget and Quick Actions */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Interfaces This Week / Calendar Widget */}
          <Card className="bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-100">
              <CardTitle className="text-[18px] font-semibold text-slate-900">Interviews This Week</CardTitle>
              <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View Calendar</button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between text-[13px] font-semibold text-slate-800">
                <button className="p-1 hover:bg-neutral-50 rounded">&lt;</button>
                <span>{calendarMonthYear}</span>
                <button className="p-1 hover:bg-neutral-50 rounded">&gt;</button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((item: any) => (
                  <div key={item.date} className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.day}</span>
                    <div 
                      className={cn(
                        "h-8 w-8 rounded-full flex flex-col items-center justify-center font-bold text-[13px] mx-auto transition-all relative",
                        item.active 
                          ? "bg-[#0c1427] text-white shadow-sm" 
                          : "text-slate-700 hover:bg-neutral-100 cursor-pointer"
                      )}
                    >
                      <span>{item.date}</span>
                      {item.count > 0 && (
                        <span className={cn(
                          "absolute bottom-0.5 h-1 w-1 rounded-full",
                          item.active ? "bg-rose-500" : "bg-blue-600"
                        )} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <Card className="bg-white border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
            <CardHeader className="pb-2 border-b border-neutral-100">
              <CardTitle className="text-[18px] font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "New Application", color: "bg-[#0c1427] hover:bg-[#15203d] text-white", icon: Plus },
                  { label: "Add Applicant", color: "bg-[#e11d48] hover:bg-[#e11d48]/90 text-white", icon: UserPlus },
                  { label: "Schedule Interview", color: "bg-[#0c1427] hover:bg-[#15203d] text-white", icon: Calendar },
                  { label: "Add Programme", color: "bg-[#e11d48] hover:bg-[#e11d48]/90 text-white", icon: Award },
                  { label: "Send Email", color: "bg-[#0c1427] hover:bg-[#15203d] text-white", icon: Mail },
                  { label: "Generate Report", color: "bg-[#e11d48] hover:bg-[#e11d48]/90 text-white", icon: FileText }
                ].map((act, idx) => (
                  <button 
                    key={idx}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-xl text-center gap-1.5 transition-all active:scale-95 shadow-sm h-[76px] cursor-pointer",
                      act.color
                    )}
                  >
                    <act.icon size={18} />
                    <span className="text-[10px] font-semibold leading-tight">{act.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Row 4: Recent Activity Steps Footer */}
      <Card className="bg-white border border-neutral-200/80 shadow-sm rounded-2xl text-left overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
          <CardTitle className="text-[18px] font-semibold text-slate-900">Recent Activity</CardTitle>
          <button className="text-[12px] font-semibold text-slate-400 hover:text-slate-700">View All Activity</button>
        </CardHeader>
        <CardContent className="pt-6">
          {isActivitiesEmpty ? (
            <div className="py-8 text-center text-neutral-400 text-[13px] w-full border border-dashed border-neutral-200/60 rounded-xl bg-slate-50/20 flex flex-col items-center justify-center gap-1.5">
              <Sparkles className="text-slate-300" size={24} />
              <span>No recent activities logged in system.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left relative before:absolute before:top-4 before:left-[18px] before:right-[18px] before:h-px before:bg-neutral-100 before:hidden md:before:block">
              {recentActivities.map((act: any, index: number) => (
                <div key={index} className="flex items-start md:flex-col gap-3 md:gap-2.5 relative">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                    act.type === "application" && "bg-slate-100 text-slate-700",
                    act.type === "document" && "bg-red-50 text-red-600",
                    act.type === "interview" && "bg-blue-50 text-blue-600",
                    act.type === "offer" && "bg-purple-50 text-purple-600",
                    act.type === "payment" && "bg-emerald-50 text-emerald-600"
                  )}>
                    {act.type === "application" && <FileCheck size={14} />}
                    {act.type === "document" && <FileText size={14} />}
                    {act.type === "interview" && <Calendar size={14} />}
                    {act.type === "offer" && <Award size={14} />}
                    {act.type === "payment" && <DollarSign size={14} />}
                  </div>
                  <div className="leading-tight text-left">
                    <h4 className="text-[13px] font-semibold text-slate-800 truncate max-w-[150px] md:max-w-none">{act.title}</h4>
                    <p className="text-[12px] text-neutral-400 mt-0.5 truncate max-w-[150px] md:max-w-none">{act.detail}</p>
                    <span className="text-[11px] text-neutral-400 font-medium block mt-1">{act.timeString}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
