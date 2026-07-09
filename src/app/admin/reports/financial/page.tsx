"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const revenueTrends = [
  { month: 'Jan', revenue: 45000, expected: 50000 },
  { month: 'Feb', revenue: 52000, expected: 55000 },
  { month: 'Mar', revenue: 68000, expected: 65000 },
  { month: 'Apr', revenue: 85000, expected: 80000 },
  { month: 'May', revenue: 110000, expected: 100000 },
  { month: 'Jun', revenue: 145000, expected: 130000 },
];

const revenueSources = [
  { name: 'Application Fees', value: 35000 },
  { name: 'Tuition Deposits', value: 85000 },
  { name: 'Late Fees', value: 5000 },
  { name: 'Misc Services', value: 12000 },
];

const collectionStatus = [
  { name: 'Collected', value: 85 },
  { name: 'Pending', value: 10 },
  { name: 'Overdue', value: 5 },
];

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];
const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function FinancialReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Financial Analytics</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Monitor revenue streams, fee collections, and outstanding balances.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-full px-4 border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-2">
            <span>YTD 2026</span>
          </Button>
          <Button className="h-10 rounded-full px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md">
            <Download size={18} />
            <span>Export Financials</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Total Revenue YTD</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">$505,000</p>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">+24.5%</span>
              <span className="text-neutral-400">vs last year</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Pending Collections</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">$45,200</p>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Activity size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <span className="text-amber-600 font-medium">124 Invoices</span>
              <span className="text-neutral-400">awaiting payment</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-neutral-500">Avg. Payment Time</p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">4.2 <span className="text-xl font-medium text-neutral-400">days</span></p>
              </div>
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <CreditCard size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <ArrowUpRight size={16} className="text-emerald-500 rotate-180" />
              <span className="text-emerald-600 font-medium">Faster</span>
              <span className="text-neutral-400">by 1.5 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden bg-emerald-600 text-white border-transparent">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-100">Projected Q3 Revenue</p>
                <p className="text-3xl font-bold">$280,000</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm">
              <span className="text-emerald-100">Based on current application volume</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <Card className="lg:col-span-2 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <CardTitle className="text-base font-bold text-neutral-850">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, undefined]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expected" name="Expected Target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Pie Chart */}
        <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
            <CardTitle className="text-base font-bold text-neutral-850">Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={revenueSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {revenueSources.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
