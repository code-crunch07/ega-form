"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, CheckCircle2, AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "@/app/actions/admin";
import Link from "next/link";

export default function AdminProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<{ firstName: string; lastName: string; email: string; avatar: string | null }>({
    firstName: "",
    lastName: "",
    email: "",
    avatar: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getAdminProfile();
        if (res.user) {
          const user = res.user;
          const userProfile = user.profile;
          
          let fName = userProfile?.firstName || "";
          let lName = userProfile?.lastName || "";
          
          if (!fName && user.name) {
            const parts = user.name.split(" ");
            fName = parts[0] || "";
            lName = parts.slice(1).join(" ") || "";
          }

          setFirstName(fName || "Educare Global");
          setLastName(lName || "Academy");
          setEmail(user.email || "admin@educare.com");
          setAvatar(user.image || null);

          setInitialData({
            firstName: fName || "Educare Global",
            lastName: lName || "Academy",
            email: user.email || "admin@educare.com",
            avatar: user.image || null
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setFirstName(initialData.firstName);
    setLastName(initialData.lastName);
    setEmail(initialData.email);
    setAvatar(initialData.avatar);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await updateAdminProfile(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.message || "Profile details updated successfully!");
        setInitialData({
          firstName,
          lastName,
          email,
          avatar
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${firstName.charAt(0) || 'A'}${lastName.charAt(0) || 'D'}`.toUpperCase();

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500 font-jost text-left pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-heading">Edit Profile</h1>
        <p className="text-slate-500 mt-1.5 font-medium text-sm">Manage your personal admin account settings, contact details, and display avatar.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 sm:p-8 space-y-8">
            
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

            {/* Profile Avatar Section */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-[#252D65] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm overflow-hidden border-2 border-slate-100">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:text-[#252D65] hover:border-[#252D65] transition-colors group-hover:scale-105 cursor-pointer"
                  title="Upload avatar"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 font-heading">Profile Avatar</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">JPG, GIF or PNG. 1MB max. We recommend a square image for optimal resolution.</p>
                <div className="pt-2 flex items-center gap-2.5">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:text-[#252D65]"
                  >
                    Change picture
                  </Button>
                  {avatar && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemoveAvatar}
                      className="h-8 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Name and Email Inputs */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-bold text-slate-700">First Name *</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  className="h-11 rounded-xl border-slate-200 text-slate-800 font-medium" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-bold text-slate-700">Last Name *</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  className="h-11 rounded-xl border-slate-200 text-slate-800 font-medium" 
                  required 
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="h-11 rounded-xl border-slate-200 text-slate-800 font-medium" 
                  required 
                />
              </div>
            </div>

          </div>
          
          {/* Action Row */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="h-11 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-white text-xs"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || isLoading}
              className="h-11 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white font-bold rounded-xl shadow-xs gap-2 transition-all text-xs"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
