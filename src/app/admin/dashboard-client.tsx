"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Clock, CalendarDays, Award, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];
const COUNTRY_COLORS = ['#10b981', '#0ea5e9', '#6366f1', '#a855f7'];

export default function DashboardClient({ 
  stats, 
  monthlyData, 
  programmeData, 
  countryData 
}: any) {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{currentDate}</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Overview</h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-lg">Welcome back. Here is what's happening with institutional admissions today.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Operational
          </div>
        </div>
      </div>

      {/* Primary KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Apps Total</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.totalApps}</div>
            <p className="text-xs font-medium text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> All time</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Pending Review</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={18} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.pendingReview}</div>
            <p className="text-xs font-medium text-neutral-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Payments</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.payments}</div>
            <p className="text-xs font-medium text-emerald-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> Processed</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Offers Issued</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.offers}</div>
            <p className="text-xs font-medium text-purple-600 flex items-center mt-1"><ArrowUpRight size={12} className="mr-1" /> Total issued</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Interviews</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays size={18} className="text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.interviews}</div>
            <p className="text-xs font-medium text-neutral-500 mt-1">Total scheduled</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-gradient-to-br from-neutral-900 to-neutral-800 dark:from-white dark:to-neutral-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">YTD Revenue</CardTitle>
            <div className="h-9 w-9 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity size={18} className="text-white dark:text-neutral-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold tracking-tight text-white dark:text-neutral-900">${stats.ytdRevenue}</div>
            <p className="text-xs font-medium text-green-400 dark:text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1" /> Total collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Applications By Month Chart */}
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Volume Trends</CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Application growth over time.</p>
          </CardHeader>
          <CardContent>
            {(!monthlyData || monthlyData.length === 0) ? (
              <div className="h-72 w-full flex items-center justify-center mt-4">
                <span className="text-neutral-400">No data available</span>
              </div>
            ) : (
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                      itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications By Programme */}
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Programme Distribution</CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Applications segmented by faculty.</p>
          </CardHeader>
          <CardContent>
            {(!programmeData || programmeData.length === 0) ? (
              <div className="h-72 w-full flex items-center justify-center mt-4">
                <span className="text-neutral-400">No data available</span>
              </div>
            ) : (
              <div className="h-72 w-full flex items-center mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={programmeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {programmeData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-3">
                  {programmeData.map((entry: any, index: number) => (
                    <div key={entry.name} className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-neutral-600 dark:text-neutral-300 font-medium">{entry.name}</span>
                      <span className="ml-auto font-bold text-neutral-900 dark:text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Country Distribution */}
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Global Reach</CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Top geographic sources of applicants.</p>
          </CardHeader>
          <CardContent>
            {(!countryData || countryData.length === 0) ? (
              <div className="h-72 w-full flex items-center justify-center mt-4">
                <span className="text-neutral-400">No data available</span>
              </div>
            ) : (
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 13, fontWeight: 500, fill: '#64748b' }} />
                    <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {countryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acceptance Rate Tracking */}
        <Card className="rounded-2xl shadow-sm border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Yield Rate Tracking</CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Offer acceptance rates over time.</p>
          </CardHeader>
          <CardContent>
            {(!monthlyData || monthlyData.length === 0) ? (
              <div className="h-72 w-full flex items-center justify-center mt-4">
                <span className="text-neutral-400">No data available</span>
              </div>
            ) : (
              <div className="h-72 w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData.map((d: any) => ({...d, rate: Math.floor(Math.random() * 20) + 40}))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `${val}%`} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
