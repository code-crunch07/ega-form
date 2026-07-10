"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Globe, Moon, Sun, Monitor } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const NOTIFICATION_PREFS = [
  { id: "status", label: "Application status updates", description: "When your application moves to a new stage", default: true },
  { id: "documents", label: "Document reminders", description: "When required documents are missing", default: true },
  { id: "payments", label: "Payment confirmations", description: "Receipts and payment status changes", default: true },
  { id: "marketing", label: "Programme announcements", description: "New intakes and scholarship opportunities", default: false },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.id, p.default]))
  );
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Settings"
        icon={Settings}
        title="Account Settings"
        description="Manage your preferences, notifications, and account security."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Notifications */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <Bell size={18} className="text-[#3C3D6B]" />
            <h2 className="font-semibold text-neutral-900">Email Notifications</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {NOTIFICATION_PREFS.map((pref) => (
              <label
                key={pref.id}
                className="flex cursor-pointer items-start gap-4 px-6 py-4 transition-colors hover:bg-neutral-50/50"
              >
                <input
                  type="checkbox"
                  checked={prefs[pref.id]}
                  onChange={(e) =>
                    setPrefs((prev) => ({ ...prev, [pref.id]: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 rounded accent-[#3C3D6B]"
                />
                <div>
                  <p className="font-medium text-neutral-900">{pref.label}</p>
                  <p className="text-sm text-neutral-500">{pref.description}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Appearance */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <Globe size={18} className="text-[#3C3D6B]" />
            <h2 className="font-semibold text-neutral-900">Appearance</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <Label className="mb-3 block text-sm font-semibold text-neutral-700">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "light" as const, label: "Light", icon: Sun },
                  { id: "dark" as const, label: "Dark", icon: Moon },
                  { id: "system" as const, label: "System", icon: Monitor },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all",
                      theme === option.id
                        ? "border-[#3C3D6B] bg-[#3C3D6B]/5 text-[#3C3D6B]"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    )}
                  >
                    <option.icon size={20} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700">Language</Label>
              <select className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 px-3 text-sm focus:border-[#3C3D6B]/40 focus:outline-none focus:ring-2 focus:ring-[#3C3D6B]/10">
                <option>English</option>
                <option>中文</option>
                <option>Bahasa Melayu</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
            <Shield size={18} className="text-[#3C3D6B]" />
            <h2 className="font-semibold text-neutral-900">Security</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700">New Password</Label>
              <Input type="password" placeholder="••••••••" className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80" />
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm font-medium text-emerald-600">Settings saved successfully</span>
        )}
        <Button
          onClick={handleSave}
          className="h-11 rounded-xl bg-[#3C3D6B] px-8 hover:bg-[#2C2D54]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
