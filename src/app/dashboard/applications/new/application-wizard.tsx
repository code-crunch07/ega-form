"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Upload, Plus, FileText, Globe, MapPin, Building2, UserCircle2, GraduationCap, Briefcase, Languages, FileCheck2, ClipboardCheck, ScrollText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { submitApplication } from "@/app/actions/application";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, name: "Applicant Type", icon: UserCircle2 },
  { id: 2, name: "Programme", icon: Building2 },
  { id: 3, name: "Personal", icon: UserCircle2 },
  { id: 4, name: "Contact", icon: MapPin },
  { id: 5, name: "Family", icon: UserCircle2 },
  { id: 6, name: "Education", icon: GraduationCap },
  { id: 7, name: "Employment", icon: Briefcase },
  { id: 8, name: "English", icon: Languages },
  { id: 9, name: "Documents", icon: FileText },
  { id: 10, name: "Review", icon: ClipboardCheck },
  { id: 11, name: "Declaration", icon: ScrollText },
  { id: 12, name: "Payment", icon: CreditCard },
];

export default function ApplicationWizard({ user, programmes, intakes }: { user: any, programmes: any[], intakes: any[] }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, control, watch, setValue, getValues } = useForm<any>({
    defaultValues: {
      applicantType: "Local Student",
      // Pre-fill from Profile
      personal: {
        title: user.profile?.title || "mr",
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        gender: user.profile?.gender || "male",
        dob: user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : "",
        nationality: user.profile?.nationality || "",
        passportNumber: user.profile?.passportNumber || "",
      },
      contact: {
        email: user.email,
        phone: user.profile?.phone || "",
        addressLine1: user.profile?.address || "",
        city: user.profile?.city || "",
        state: user.profile?.state || "",
        postalCode: user.profile?.postalCode || "",
        country: user.profile?.country || "",
      },
      family: {
        fatherName: user.profile?.emergencyContactName || "",
        emergencyPhone: user.profile?.emergencyContactPhone || "",
      },
      education: [{}], // Initialize with one blank row
      employment: [{}],
      englishTest: { testName: "None" }
    }
  });

  const watchApplicantType = watch("applicantType");
  const watchProgrammeId = watch("programmeId");
  const watchEnglishTest = watch("englishTest.testName");
  const watchEmployed = watch("isEmployed");

  const selectedProgramme = programmes.find(p => p.id === watchProgrammeId);

  const nextStep = () => {
    if (step < 12) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: any) => {
    if (step !== 12) {
      nextStep();
      return;
    }
    
    // Final Submit
    setIsSubmitting(true);
    const result = await submitApplication(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessAppNumber(result.appNumber);
    } else {
      alert("Error submitting application: " + result.error);
    }
  };

  if (successAppNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">🎉 Congratulations!</h1>
        <p className="text-xl text-neutral-600 mb-8">Your application has been submitted successfully.</p>
        
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm max-w-sm w-full mb-8">
          <p className="text-sm text-neutral-500 mb-1">Application Number</p>
          <p className="text-2xl font-mono font-bold text-[#27295B]">{successAppNumber}</p>
          <div className="h-px bg-neutral-100 my-4 w-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Status</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Submitted</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="h-12 px-6">
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push("/dashboard/applications")} className="h-12 px-6 bg-[#27295B] hover:bg-slate-800 text-white">
            View Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-800">New Application</h1>
        <p className="mt-1 text-sm text-neutral-400 font-medium">Complete your admission details step-by-step</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        
        {/* Left Column: Sidebar Stepper */}
        <aside className="w-full lg:w-72 lg:shrink-0">
          {/* Mobile Stepper Header */}
          <div className="lg:hidden bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-2xs mb-2">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
              <span>Progress</span>
              <span>Step {step} of 12</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-800 mb-3">
              {STEPS.find(s => s.id === step)?.name}
            </h3>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#27295B] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 12) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Stepper Track */}
          <div className="hidden lg:block bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-2xs space-y-6">
            <div className="relative pl-1 space-y-4">
              {/* Stepper Timeline Connection Line */}
              <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-100 pointer-events-none" />
              <div 
                className="absolute left-6 top-3 w-0.5 bg-[#27295B] transition-all duration-300 pointer-events-none" 
                style={{ height: `${((step - 1) / 11) * 94}%`, minHeight: '0%' }}
              />

              {STEPS.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div key={s.id} className="relative flex items-center gap-4 group">
                    <div className={cn(
                      "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 font-semibold text-sm",
                      isActive
                        ? "border-[#27295B] bg-[#27295B] text-white shadow-md shadow-[#27295B]/15 scale-105"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-400 group-hover:border-neutral-300"
                    )}>
                      {isCompleted ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <s.icon size={16} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-neutral-400")} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className={cn(
                        "text-xs font-bold leading-none tracking-wide transition-colors",
                        isActive ? "text-[#27295B]" : isCompleted ? "text-neutral-700 font-semibold" : "text-neutral-400 font-medium"
                      )}>
                        {s.name}
                      </p>
                      {isActive && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500 font-mono">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Form Panel */}
        <div className="flex-1 bg-white rounded-3xl border border-neutral-200/60 shadow-2xs overflow-hidden min-h-[600px] flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full flex-1">
            {/* Step Header Indicator */}
            <div className="bg-[#27295B]/[0.02] border-b border-neutral-100 px-6 py-5 sm:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#27295B]/10 text-[#27295B] flex items-center justify-center">
                  {(() => {
                    const CurrentIcon = STEPS[step - 1]?.icon;
                    return CurrentIcon ? <CurrentIcon size={18} /> : null;
                  })()}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#27295B]/70 font-mono">Step {step} of 12</span>
                  <h3 className="text-sm font-bold text-neutral-800 leading-none mt-1">{STEPS[step - 1]?.name}</h3>
                </div>
              </div>
              <div className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-md font-mono">
                {Math.round((step / 12) * 100)}% Done
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1">
              
              {/* STEP 1: Applicant Type */}
              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-800">Applicant Type</h2>
                    <p className="text-neutral-400 mt-1 text-sm font-medium">Please select the category that best describes your residency status.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {[
                      { type: "Local Student", desc: "Citizens of the host country" },
                      { type: "Permanent Resident", desc: "For permanent residency status holders" },
                      { type: "International Student", desc: "For students requiring a student visa" }
                    ].map(({ type, desc }) => {
                      const isSelected = watchApplicantType === type;
                      return (
                        <div 
                          key={type}
                          onClick={() => setValue("applicantType", type)}
                          className={cn(
                            "relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group",
                            isSelected 
                              ? "border-[#27295B] bg-[#27295B]/5 shadow-md shadow-[#27295B]/5" 
                              : "border-neutral-200 hover:border-[#27295B]/30 hover:bg-slate-50/30"
                          )}
                        >
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                            isSelected 
                              ? "bg-[#27295B] text-white shadow-xs" 
                              : "bg-slate-50 text-neutral-400 group-hover:bg-slate-100 group-hover:text-neutral-600 group-hover:scale-105"
                          )}>
                            {type === "International Student" ? <Globe size={24} /> : <MapPin size={24} />}
                          </div>
                          <h3 className="font-bold text-base text-neutral-800 transition-colors group-hover:text-[#27295B]">{type}</h3>
                          <p className="mt-1.5 text-xs text-neutral-400 font-medium leading-relaxed max-w-[180px]">{desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* STEP 2: Programme Selection */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Programme Selection</h2>
                  <p className="text-neutral-500 mt-1">Choose the campus and programme you wish to apply for.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Campus</Label>
                    <Controller
                      name="campus"
                      control={control}
                      defaultValue="Singapore Main Campus"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium"><SelectValue placeholder="Select Campus" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Singapore Main Campus">Singapore Main Campus</SelectItem>
                            <SelectItem value="Malaysia Branch">Malaysia Branch</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Programme Level</Label>
                    <Controller
                      name="programmeLevel"
                      control={control}
                      defaultValue="Undergraduate"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium"><SelectValue placeholder="Select Level" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Undergraduate">Undergraduate (Bachelor's)</SelectItem>
                            <SelectItem value="Postgraduate">Postgraduate (Master's/PhD)</SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Programme</Label>
                    <Controller
                      name="programmeId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium"><SelectValue placeholder="Select Programme" /></SelectTrigger>
                          <SelectContent>
                            {programmes.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Intake</Label>
                    <Controller
                      name="intake"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium"><SelectValue placeholder="Select Intake" /></SelectTrigger>
                          <SelectContent>
                            {intakes.map(i => (
                              <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Study Mode</Label>
                    <Controller
                      name="studyMode"
                      control={control}
                      defaultValue="Full-Time"
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "Full-Time", label: "Full-Time Study", desc: "Regular class schedule on campus" },
                            { value: "Part-Time", label: "Part-Time Study", desc: "Flexible pacing for working professionals" }
                          ].map(item => {
                            const isSelected = (field.value || "Full-Time") === item.value;
                            return (
                              <div 
                                key={item.value}
                                onClick={() => field.onChange(item.value)}
                                className={cn(
                                  "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col text-left group",
                                  isSelected 
                                    ? "border-[#27295B] bg-[#27295B]/[0.03] shadow-xs" 
                                    : "border-neutral-200 hover:border-[#27295B]/40 hover:bg-neutral-50/50"
                                )}
                              >
                                <span className={cn("font-bold text-sm transition-colors", isSelected ? "text-[#27295B]" : "text-neutral-800")}>{item.label}</span>
                                <span className="text-[11px] text-neutral-400 mt-1">{item.desc}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Scholarship Application</Label>
                    <Controller
                      name="scholarshipApply"
                      control={control}
                      defaultValue="no"
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "yes", label: "Yes, I wish to apply", desc: "Submit application for academic scholarship support" },
                            { value: "no", label: "No, self-funded", desc: "Continue with regular self-funding path" }
                          ].map(item => {
                            const isSelected = (field.value || "no") === item.value;
                            return (
                              <div 
                                key={item.value}
                                onClick={() => field.onChange(item.value)}
                                className={cn(
                                  "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col text-left group",
                                  isSelected 
                                    ? "border-[#27295B] bg-[#27295B]/[0.03] shadow-xs" 
                                    : "border-neutral-200 hover:border-[#27295B]/40 hover:bg-neutral-50/50"
                                )}
                              >
                                <span className={cn("font-bold text-sm transition-colors", isSelected ? "text-[#27295B]" : "text-neutral-800")}>{item.label}</span>
                                <span className="text-[11px] text-neutral-400 mt-1">{item.desc}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Personal Information */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Personal Information</h2>
                  <p className="text-neutral-500 mt-1">Review and update your personal details (Pre-filled from Profile).</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Title</Label>
                    <Input {...register("personal.title")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Gender</Label>
                    <Input {...register("personal.gender")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">First Name</Label>
                    <Input {...register("personal.firstName")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Last Name</Label>
                    <Input {...register("personal.lastName")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Date of Birth</Label>
                    <Input type="date" {...register("personal.dob")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Nationality</Label>
                    <Input {...register("personal.nationality")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  
                  {watchApplicantType === "International Student" && (
                    <div className="space-y-2 md:col-span-2 p-4 bg-orange-50 border border-orange-100 rounded-lg mt-4">
                      <Label className="text-slate-900 text-orange-900">Passport Number (Required for International Students)</Label>
                      <Input {...register("personal.passportNumber")} required className="h-11 bg-white mt-2 text-slate-900" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Contact Information */}
            {step === 4 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Contact Information</h2>
                  <p className="text-neutral-500 mt-1">How can we reach you?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Email</Label>
                    <Input {...register("contact.email")} type="email" disabled className="h-11 bg-neutral-100 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Phone</Label>
                    <Input {...register("contact.phone")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Address Line 1</Label>
                    <Input {...register("contact.addressLine1")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">City</Label>
                    <Input {...register("contact.city")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">State/Province</Label>
                    <Input {...register("contact.state")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Postal Code</Label>
                    <Input {...register("contact.postalCode")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Country</Label>
                    <Input {...register("contact.country")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Family / Emergency Contact */}
            {step === 5 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Family / Emergency Contact</h2>
                  <p className="text-neutral-500 mt-1">Who should we contact in case of emergency?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Emergency Contact Name</Label>
                    <Input {...register("family.fatherName")} placeholder="e.g. John Doe Sr." className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Relationship</Label>
                    <Input defaultValue="Parent" className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Emergency Contact Number</Label>
                    <Input {...register("family.emergencyPhone")} className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Emergency Contact Email</Label>
                    <Input type="email" className="h-11 bg-neutral-50 text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Education */}
            {step === 6 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Academic Qualifications</h2>
                  <p className="text-neutral-500 mt-1">Please list your educational history, starting from the most recent.</p>
                </div>
                
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg text-slate-800">Qualification 1</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Qualification / Degree Level</Label>
                      <Input {...register(`education.0.qualification`)} placeholder="e.g. High School Diploma, Bachelor's" className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Institution Name</Label>
                      <Input {...register(`education.0.institution`)} placeholder="e.g. Harvard University" className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Country of Institution</Label>
                      <Input {...register(`education.0.country`)} placeholder="e.g. USA" className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Major / Field of Study</Label>
                      <Input {...register(`education.0.major`)} placeholder="e.g. Computer Science" className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Start Date</Label>
                      <Input type="date" {...register(`education.0.startDate`)} className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Completion Date</Label>
                      <Input type="date" {...register(`education.0.endDate`)} className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">CGPA / Grade</Label>
                      <Input {...register(`education.0.cgpa`)} placeholder="e.g. 3.8/4.0 or 85%" className="h-11 bg-white text-slate-900" />
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-slate-200">
                    <Button type="button" variant="outline" className="gap-2 text-[#27295B]">
                      <Plus size={16} /> Add Another Qualification
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Employment */}
            {step === 7 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Employment History</h2>
                  <p className="text-neutral-500 mt-1">Optional for undergraduate applicants.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Are you currently or previously employed?</Label>
                  <Controller
                    name="isEmployed"
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-4 max-w-sm">
                        {[
                          { value: "yes", label: "Yes", desc: "I have work experience" },
                          { value: "no", label: "No", desc: "No formal work history" }
                        ].map(item => {
                          const isSelected = (field.value || "no") === item.value;
                          return (
                            <div 
                              key={item.value}
                              onClick={() => field.onChange(item.value)}
                              className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col text-left group",
                                isSelected 
                                  ? "border-[#27295B] bg-[#27295B]/[0.03] shadow-xs" 
                                  : "border-neutral-200 hover:border-[#27295B]/40 hover:bg-neutral-50/50"
                              )}
                            >
                              <span className={cn("font-bold text-sm transition-colors", isSelected ? "text-[#27295B]" : "text-neutral-800")}>{item.label}</span>
                              <span className="text-[11px] text-neutral-400 mt-1">{item.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
                
                {watchEmployed === "yes" && (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-6 mt-6 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Employer / Company Name</Label>
                      <Input {...register("employment.0.employer")} className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Position / Job Title</Label>
                      <Input {...register("employment.0.position")} className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Industry</Label>
                        <Input {...register("employment.0.industry")} className="h-11 bg-white text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Years of Experience</Label>
                        <Input type="number" {...register("employment.0.yearsExperience")} className="h-11 bg-white text-slate-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 8: English */}
            {step === 8 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">English Language Proficiency</h2>
                  <p className="text-neutral-500 mt-1">International students may require an English proficiency test.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-900 text-base">Have you taken an English proficiency test?</Label>
                  <Controller
                    name="englishTest.testName"
                    control={control}
                    defaultValue="None"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium"><SelectValue placeholder="Select Test" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">No / Not Required (Native Speaker)</SelectItem>
                          <SelectItem value="IELTS">IELTS</SelectItem>
                          <SelectItem value="TOEFL">TOEFL</SelectItem>
                          <SelectItem value="PTE">PTE Academic</SelectItem>
                          <SelectItem value="Duolingo">Duolingo English Test</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {watchEnglishTest !== "None" && (
                  <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-xl mt-6 animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Overall Score</Label>
                      <Input {...register("englishTest.overallScore")} placeholder="e.g. 7.5" className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Test Date</Label>
                      <Input type="date" {...register("englishTest.testDate")} className="h-11 bg-white text-slate-900" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Test Reference Number / TRF</Label>
                      <Input {...register("englishTest.trf")} className="h-11 bg-white text-slate-900" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 9: Documents */}
            {step === 9 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Supporting Documents</h2>
                  <p className="text-neutral-500 mt-1">Upload clear, scanned copies of your original documents.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock Upload Boxes */}
                  {[
                    "Passport / National ID", 
                    "Passport Size Photo", 
                    "Academic Transcripts", 
                    "Degree/Diploma Certificate",
                    "Resume / CV"
                  ].map((docName, i) => (
                    <div key={i} className="border border-dashed border-neutral-300 rounded-xl p-6 bg-slate-50 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={20} className="text-[#27295B]" />
                      </div>
                      <h4 className="font-semibold text-neutral-900">{docName}</h4>
                      <p className="text-xs text-neutral-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 10: Review */}
            {step === 10 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Review Application</h2>
                  <p className="text-neutral-500 mt-1">Please check all details carefully before proceeding to declaration and payment.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-200 pb-3 mb-4">Programme Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Programme</p>
                        <p className="font-medium text-slate-900">{selectedProgramme?.name || "Not Selected"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Intake</p>
                        <p className="font-medium text-slate-900">{getValues("intake") || "Not Selected"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Applicant Type</p>
                        <p className="font-medium text-slate-900">{watchApplicantType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Study Mode</p>
                        <p className="font-medium text-slate-900">{getValues("studyMode")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-200 pb-3 mb-4">Personal & Contact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Full Name</p>
                        <p className="font-medium text-slate-900">{getValues("personal.firstName")} {getValues("personal.lastName")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{getValues("contact.email")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="font-medium text-slate-900">{getValues("contact.phone") || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: Declaration */}
            {step === 11 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-3xl">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Declaration</h2>
                  <p className="text-neutral-500 mt-1">Read and accept the terms to complete your application.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="terms1" required className="mt-1 w-4 h-4 accent-[#27295B]" />
                    <Label htmlFor="terms1" className="text-slate-900 text-sm font-normal leading-snug">
                      I declare that all information provided in this application form and the accompanying documents is true and complete to the best of my knowledge. I understand that any false information may lead to rejection or dismissal.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="terms2" required className="mt-1 w-4 h-4 accent-[#27295B]" />
                    <Label htmlFor="terms2" className="text-slate-900 text-sm font-normal leading-snug">
                      I agree to the University's Privacy Policy and consent to the collection, use, and disclosure of my personal data for the purposes of evaluating my application.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="terms3" required className="mt-1 w-4 h-4 accent-[#27295B]" />
                    <Label htmlFor="terms3" className="text-slate-900 text-sm font-normal leading-snug">
                      I understand that I am required to pay a non-refundable application fee.
                    </Label>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Digital Signature (Type your full name)</Label>
                    <Input {...register("digitalSignature")} required placeholder="John Doe" className="h-11 max-w-sm bg-white text-slate-900" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 12: Payment */}
            {step === 12 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-xl mx-auto text-center py-10">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900">Application Fee Payment</h2>
                  <p className="text-neutral-500 mt-2">To complete your submission, please pay the application processing fee.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mt-8 shadow-sm text-left">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
                    <span className="text-slate-600 font-semibold">Total Amount Due</span>
                    <span className="text-2xl font-bold text-[#27295B]">
                      ${selectedProgramme?.applicationFee || "50.00"}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border-2 border-[#27295B] bg-[#27295B]/5 p-4 rounded-xl flex flex-col gap-1 font-bold text-sm cursor-pointer shadow-2xs">
                        <div className="flex items-center gap-2 text-[#27295B]">
                          <CreditCard size={18} />
                          <span>Credit Card</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Stripe checkout secure</span>
                      </div>
                      <div className="border border-slate-200 bg-white p-4 rounded-xl flex flex-col gap-1 font-bold text-sm text-slate-400 cursor-not-allowed opacity-60">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} />
                          <span>PayPal</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Unavailable</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center mb-6">
                    By clicking "Pay & Submit", a mock payment will be processed and your application will be finalized.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Action Bar */}
          <div className="p-5 bg-[#f8fafc]/80 border-t border-neutral-200/60 flex items-center justify-between sticky bottom-0 z-10 backdrop-blur-md">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className="h-11 px-6 border-neutral-200 text-neutral-600 hover:bg-slate-50 rounded-xl font-bold transition-all duration-300"
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 bg-[#27295B] hover:bg-[#1E2045] text-white font-bold gap-2 shadow-xs rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-[#27295B]/10 hover:-translate-y-0.5"
            >
              {isSubmitting ? "Processing..." : step === 12 ? "Pay & Submit Application" : "Save & Continue"}
              {!isSubmitting && step !== 12 && <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
