import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save } from "lucide-react";

export default function AdminProfilePage() {
  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Edit Profile</h1>
        <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Manage your personal admin account settings and preferences.</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                AD
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shadow-sm hover:text-blue-600 transition-colors group-hover:scale-105">
                <Camera size={14} />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Profile Avatar</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">JPG, GIF or PNG. 1MB max. We recommend a square image for best results.</p>
              <div className="pt-2 flex gap-3">
                <Button variant="outline" size="sm" className="h-8 shadow-sm">Change picture</Button>
                <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
              </div>
            </div>
          </div>

          <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Admin" className="h-10 rounded-lg shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="User" className="h-10 rounded-lg shadow-sm" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@educare.com" className="h-10 rounded-lg shadow-sm" />
            </div>
          </div>

        </div>
        
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
          <Button variant="outline" className="h-10 px-5 shadow-sm rounded-lg">Cancel</Button>
          <Button className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg gap-2">
            <Save size={16} />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
