"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, Users, FileText, CheckCircle, Clock } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const applicationTrends = [
  { month: 'Jan', applications: 400, admitted: 240 },
  { month: 'Feb', applications: 300, admitted: 139 },
  { month: 'Mar', applications: 550, admitted: 380 },
  { month: 'Apr', applications: 700, admitted: 430 },
  { month: 'May', applications: 900, admitted: 500 },
  { month: 'Jun', applications: 1200, admitted: 700 },
];

const programDistribution = [
  { name: 'Computer Science', value: 400 },
  { name: 'Business Admin', value: 300 },
  { name: 'Data Science', value: 300 },
  { name: 'Nursing', value: 200 },
];

const regionData = [
  { name: 'North America', applications: 800 },
  { name: 'Asia', applications: 650 },
  { name: 'Europe', applications: 400 },
  { name: 'Africa', applications: 200 },
  { name: 'South America', applications: 150 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdmissionsReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Admissions Analytics</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Track application volume, conversion rates, and demographic trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-2">
            <span>Last 6 Months</span>
          </Button>
          <Button className="h-10 rounded-full px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md">
            <Download size={18} />
            <span>Export PDF Report</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Total Applications</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">4,050</p>
              </div>
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileText size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">+12.5%</span>
              <span className="text-neutral-400">vs last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Admitted Students</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">2,389</p>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">+8.2%</span>
              <span className="text-neutral-400">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Acceptance Rate</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">58.9%</p>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">+2.1%</span>
              <span className="text-neutral-400">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Avg. Processing Time</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">14<span className="text-xl font-medium text-neutral-400 ml-1">days</span></p>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Clock size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">-2 days</span>
              <span className="text-neutral-400">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <CardTitle className="text-base font-bold text-neutral-850">Application Volume Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="admitted" name="Admitted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdm)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <CardTitle className="text-base font-bold text-neutral-850">Program Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={programDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {programDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {programDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Data Bar Chart */}
        <Card className="lg:col-span-3 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <CardTitle className="text-base font-bold text-neutral-850">Applications by Region</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="applications" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
