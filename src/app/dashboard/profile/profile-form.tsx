"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  MapPin,
  Phone,
  ShieldAlert,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getProfileCompletion } from "@/lib/dashboard-utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { updateProfile } from "@/app/actions/applicant";

type ProfileUser = {
  email: string;
  name?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    passportNumber?: string | null;
    phone?: string | null;
    country?: string | null;
  } | null;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const profile = user.profile || {};
  const dob = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
    : "";
  const displayName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : user.name || "Applicant";
  const profileScore = getProfileCompletion(user);

  const action = async (formData: FormData) => {
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    {
      id: "personal",
      label: "Personal Details",
      icon: User,
      complete: Boolean(profile.firstName && profile.lastName),
    },
    {
      id: "identity",
      label: "Identity & Citizenship",
      icon: ShieldAlert,
      complete: Boolean(profile.passportNumber),
    },
    {
      id: "contact",
      label: "Contact Info",
      icon: Phone,
      complete: Boolean(profile.phone && profile.country),
    },
    {
      id: "emergency",
      label: "Emergency Contact",
      icon: MapPin,
      complete: false,
    },
  ];

  return (
    <div className="animate-in fade-in space-y-8 pb-10 duration-500">
      <PageHeader
        badge="Profile"
        icon={User}
        title="My Profile"
        description="Keep your details up to date — they pre-fill when you apply for programmes."
      />

      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-6 shadow-xs sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2C315E]/6 blur-3xl pointer-events-none" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#4F46E5]/4 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="group relative shrink-0">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-50 shadow-md sm:h-32 sm:w-32 transition-all duration-300 group-hover:shadow-lg">
              <User size={56} className="text-neutral-300 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Camera className="mb-1 text-white" size={20} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upload</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#2C315E] to-[#4F46E5] text-[10px] font-bold text-white shadow-md">
              {profileScore}%
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl">
              {displayName}
            </h2>
            <p className="mt-1.5 text-sm font-medium text-neutral-400">{user.email}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-neutral-600 transition-colors hover:bg-slate-100">
                <MapPin size={13} className="text-[#2C315E]" />
                {profile.country || "Country not set"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-neutral-600 transition-colors hover:bg-slate-100">
                <Phone size={13} className="text-[#2C315E]" />
                {profile.phone || "Phone not set"}
              </span>
            </div>
          </div>

          <div className="w-full max-w-[220px] shrink-0 rounded-2xl border border-neutral-200/60 bg-[#f8fafc]/80 p-4.5 shadow-2xs">
            <div className="mb-2 flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-500 uppercase tracking-wider">Completion</span>
              <span className="text-[#2C315E] font-mono">{profileScore}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2C315E] to-[#4F46E5] transition-all duration-700"
                style={{ width: `${profileScore}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] font-medium leading-relaxed text-neutral-400">
              Complete all sections to speed up future applications.
            </p>
          </div>
        </div>
      </div>

      <form action={action} className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-all duration-300 lg:w-full hover:scale-[1.01] active:scale-[0.99]",
                  isActive
                    ? "bg-gradient-to-r from-[#2C315E] to-[#4F46E5] text-white shadow-md shadow-indigo-900/10"
                    : "border border-neutral-200 bg-white text-neutral-500 hover:border-indigo-500/20 hover:bg-slate-50/50 hover:text-neutral-800"
                )}
              >
                <tab.icon
                  size={18}
                  className={isActive ? "text-white" : "text-neutral-400"}
                />
                <span className="flex-1">{tab.label}</span>
                {tab.complete && (
                  <CheckCircle2
                    size={16}
                    className={isActive ? "text-emerald-300" : "text-emerald-500"}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-50/50 px-6 py-4 sm:px-8">
            <h3 className="text-lg font-semibold text-neutral-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
          </div>

          <div className="p-6 sm:p-8">
            <div
              className={
                activeTab === "personal"
                  ? "block animate-in fade-in slide-in-from-right-2 space-y-6 duration-300"
                  : "hidden"
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Title</Label>
                  <Select name="title" defaultValue="mr">
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Gender</Label>
                  <Select name="gender" defaultValue="male">
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">First Name</Label>
                  <Input
                    name="firstName"
                    defaultValue={profile.firstName || ""}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Last Name / Surname
                  </Label>
                  <Input
                    name="lastName"
                    defaultValue={profile.lastName || ""}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Date of Birth</Label>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    defaultValue={dob}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Marital Status</Label>
                  <Select name="maritalStatus" defaultValue="single">
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div
              className={
                activeTab === "identity"
                  ? "block animate-in fade-in slide-in-from-right-2 space-y-6 duration-300"
                  : "hidden"
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-semibold text-neutral-700">Nationality</Label>
                  <Input
                    name="nationality"
                    defaultValue="Singaporean"
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">
                    NRIC / FIN / Passport Number
                  </Label>
                  <Input
                    name="passportNumber"
                    defaultValue={profile.passportNumber || ""}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Type of Identification
                  </Label>
                  <Select name="idType" defaultValue="passport">
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nric">NRIC (Pink)</SelectItem>
                      <SelectItem value="fin">FIN</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div
              className={
                activeTab === "contact"
                  ? "block animate-in fade-in slide-in-from-right-2 space-y-6 duration-300"
                  : "hidden"
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Residential Address
                  </Label>
                  <Input
                    name="address"
                    defaultValue=""
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Country</Label>
                  <Input
                    name="country"
                    defaultValue={profile.country || ""}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Postal Code</Label>
                  <Input
                    name="postalCode"
                    defaultValue=""
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Mobile Number</Label>
                  <Input
                    name="phone"
                    defaultValue={profile.phone || ""}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Alternative Email (Optional)
                  </Label>
                  <Input
                    name="altEmail"
                    type="email"
                    placeholder="example@domain.com"
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>
              </div>
            </div>

            <div
              className={
                activeTab === "emergency"
                  ? "block animate-in fade-in slide-in-from-right-2 space-y-6 duration-300"
                  : "hidden"
              }
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Contact Person Name
                  </Label>
                  <Input
                    name="emergencyName"
                    defaultValue=""
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">
                    Relationship to Applicant
                  </Label>
                  <Select name="emergencyRelationship" defaultValue="spouse">
                    <SelectTrigger className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-neutral-700">Contact Number</Label>
                  <Input
                    name="emergencyPhone"
                    defaultValue=""
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50/80"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-neutral-100 bg-[#f8fafc]/80 px-6 py-4.5 sm:px-8">
            {saved ? (
              <span className="flex items-center gap-2 text-sm font-bold text-emerald-600 animate-pulse">
                <CheckCircle2 size={16} />
                Profile saved successfully
              </span>
            ) : (
              <span className="text-xs font-semibold text-neutral-400">
                Changes apply to future applications
              </span>
            )}
            <Button
              type="submit"
              disabled={isSaving}
              className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#2C315E] to-[#4F46E5] px-8 hover:opacity-95 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300 font-bold disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
