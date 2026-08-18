"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { changeAdminPassword } from "@/app/actions/admin";
import Link from "next/link";

export default function AdminPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      const res = await changeAdminPassword(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while updating password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500 font-jost text-left">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Change Password</h1>
        <p className="text-slate-500 mt-1.5 font-medium text-sm">Ensure your administrator account is using a long, random password to stay secure.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="bg-[#252D65]/5 border border-[#252D65]/15 rounded-xl p-4 flex gap-3 text-[#252D65]">
              <ShieldCheck className="shrink-0 mt-0.5" size={18} />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium animate-in fade-in">
                <AlertTriangle className="shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium animate-in fade-in">
                <CheckCircle2 className="shrink-0" size={18} />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-xs font-bold text-slate-700">Current Password *</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"} 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-11 rounded-xl pr-10 border-slate-200 text-slate-800" 
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">New Password *</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    className="h-11 rounded-xl pr-10 border-slate-200 text-slate-800" 
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm New Password *</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="h-11 rounded-xl pr-10 border-slate-200 text-slate-800" 
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
          
          <div className="px-6 sm:px-8 py-4.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 items-center">
            <Link href="/admin/profile">
              <Button type="button" variant="outline" className="h-11 px-5 border-slate-200 text-slate-700 rounded-xl font-bold bg-white hover:bg-slate-100">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-11 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold gap-2 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Update Password</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
