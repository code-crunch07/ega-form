import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileSpreadsheet, Database, Users, FileText } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function AdminExportCenterPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Export Center</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Generate and download custom CSV and PDF reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                  <Database size={20} />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-neutral-850">Custom Data Export</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Select the exact fields and filters you need.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">1. Select Data Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl p-4 cursor-pointer flex items-center gap-3">
                    <Users className="text-indigo-600" size={24} />
                    <div>
                      <p className="font-bold text-sm text-indigo-900 dark:text-indigo-100">Applicant Data</p>
                      <p className="text-xs text-indigo-600/70 dark:text-indigo-400">Profiles, demographics, test scores</p>
                    </div>
                  </div>
                  <div className="border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-colors">
                    <FileText className="text-neutral-500" size={24} />
                    <div>
                      <p className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Financial Data</p>
                      <p className="text-xs text-neutral-500">Invoices, payments, refunds</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">2. Apply Filters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Intake</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        <SelectValue placeholder="Select Intake" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Intakes</SelectItem>
                        <SelectItem value="fall2026">Fall 2026</SelectItem>
                        <SelectItem value="spring2027">Spring 2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Program</label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        <SelectValue placeholder="Select Program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Programs</SelectItem>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="ba">Business Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Status</label>
                    <Select defaultValue="admitted">
                      <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="admitted">Admitted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">3. Select Fields to Include</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 bg-neutral-50 dark:bg-neutral-900/50 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f1" defaultChecked />
                    <label htmlFor="f1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Application ID</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f2" defaultChecked />
                    <label htmlFor="f2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f3" defaultChecked />
                    <label htmlFor="f3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f4" defaultChecked />
                    <label htmlFor="f4" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f5" defaultChecked />
                    <label htmlFor="f5" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Program Name</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f6" defaultChecked />
                    <label htmlFor="f6" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Current Status</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f7" />
                    <label htmlFor="f7" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Home Country</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f8" />
                    <label htmlFor="f8" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Test Scores</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="f9" />
                    <label htmlFor="f9" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">GPA / Grades</label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                  <FileSpreadsheet size={18} />
                  Generate CSV Export
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Quick Exports</CardTitle>
              <CardDescription className="text-xs mt-0.5">Pre-configured common reports.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <div className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 flex items-center justify-between group transition-colors">
                  <div>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Daily Admissions Summary</p>
                    <p className="text-xs text-neutral-500">PDF Report • Yesterday's data</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-neutral-400 group-hover:text-indigo-600">
                    <Download size={18} />
                  </Button>
                </div>
                <div className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 flex items-center justify-between group transition-colors">
                  <div>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Outstanding Payments list</p>
                    <p className="text-xs text-neutral-500">CSV Export • All overdue</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-neutral-400 group-hover:text-indigo-600">
                    <Download size={18} />
                  </Button>
                </div>
                <div className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 flex items-center justify-between group transition-colors">
                  <div>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">International Demographics</p>
                    <p className="text-xs text-neutral-500">CSV Export • Fall 2026</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-neutral-400 group-hover:text-indigo-600">
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
