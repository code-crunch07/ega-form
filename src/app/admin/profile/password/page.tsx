import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldCheck } from "lucide-react";

export default function AdminPasswordPage() {
  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Change Password</h1>
        <p className="text-neutral-500 mt-1.5 dark:text-neutral-400">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3 text-blue-800 dark:text-blue-300">
            <ShieldCheck className="flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm">Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" className="h-10 rounded-lg shadow-sm" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" className="h-10 rounded-lg shadow-sm" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" className="h-10 rounded-lg shadow-sm" />
            </div>
          </div>

        </div>
        
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
          <Button variant="outline" className="h-10 px-5 shadow-sm rounded-lg">Cancel</Button>
          <Button className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg gap-2">
            <KeyRound size={16} />
            <span>Update Password</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
