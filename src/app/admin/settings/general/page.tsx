import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminGeneralSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">General Settings</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Configure global platform settings, timezones, and system behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
            <Save size={18} />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Institution Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Institution Name</label>
                  <Input defaultValue="Global University" className="bg-neutral-50 dark:bg-neutral-900/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Default Campus</label>
                  <Select defaultValue="main">
                    <SelectTrigger className="bg-neutral-50 dark:bg-neutral-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Campus</SelectItem>
                      <SelectItem value="downtown">Downtown Annex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Support Email Address</label>
                  <Input defaultValue="admissions@globaluniversity.edu" className="bg-neutral-50 dark:bg-neutral-900/50" />
                  <p className="text-xs text-neutral-500">Applicant inquiries will be routed here.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Localization & Formatting</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">System Timezone</label>
                  <Select defaultValue="est">
                    <SelectTrigger className="bg-neutral-50 dark:bg-neutral-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Date Format</label>
                  <Select defaultValue="mdy">
                    <SelectTrigger className="bg-neutral-50 dark:bg-neutral-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-2xs rounded-2xl overflow-hidden bg-indigo-50/50 dark:bg-indigo-900/10">
            <CardHeader className="p-5 pb-0">
              <div className="p-2 w-fit bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400 mb-3">
                <SettingsIcon size={20} />
              </div>
              <CardTitle className="text-base font-bold text-indigo-900 dark:text-indigo-100">System Status</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <p className="text-sm text-indigo-700/80 dark:text-indigo-300 mb-4">
                The portal is currently accepting new applications.
              </p>
              <Button variant="outline" className="w-full bg-white dark:bg-black border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                Put System in Maintenance
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
