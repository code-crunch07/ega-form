import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Upload, Palette } from "lucide-react";

export default function AdminBrandingSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Branding & Appearance</h1>
          <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Customize the applicant portal's logo, colors, and visual identity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
            <Save size={18} />
            <span>Save Branding</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Logos & Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="space-y-3 flex-1">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Primary Logo</label>
                  <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-neutral-50/50 dark:bg-neutral-900/20 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-white dark:bg-black rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-neutral-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Logo</p>
                      <p className="text-xs text-neutral-500 mt-0.5">PNG, SVG up to 2MB</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Favicon</label>
                  <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-neutral-50/50 dark:bg-neutral-900/20 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer group">
                    <div className="p-3 bg-white dark:bg-black rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={20} className="text-neutral-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Upload Icon</p>
                      <p className="text-xs text-neutral-500 mt-0.5">32x32px ICO or PNG</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 bg-slate-50/50 p-5">
              <CardTitle className="text-base font-bold text-neutral-850">Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Primary Brand Color</label>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 shadow-sm border border-neutral-200 dark:border-neutral-800 flex-shrink-0"></div>
                    <Input defaultValue="#4f46e5" className="font-mono bg-neutral-50 dark:bg-neutral-900/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Accent Color</label>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 shadow-sm border border-neutral-200 dark:border-neutral-800 flex-shrink-0"></div>
                    <Input defaultValue="#10b981" className="font-mono bg-neutral-50 dark:bg-neutral-900/50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xs rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-neutral-900/50 p-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <Palette className="text-neutral-500" size={20} />
                <CardTitle className="text-base font-bold text-neutral-850">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-neutral-100 dark:bg-neutral-950 p-4 h-48 flex items-center justify-center">
                <div className="w-full max-w-[200px] bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  <div className="h-12 bg-indigo-600 w-full flex items-center px-4">
                    <div className="w-6 h-6 rounded bg-white/20"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-2 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-2 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-6 w-full bg-indigo-600 rounded mt-4"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
