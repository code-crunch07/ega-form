"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Upload, Plus, FileText, Globe, MapPin, Building2, UserCircle2, GraduationCap, Briefcase, Languages, FileCheck2, ClipboardCheck, ScrollText, CreditCard, Phone, Mail, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { submitApplication } from "@/app/actions/application";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/application-schema";

const SECTIONS = [
  { id: 1, name: "Programme & Residency", shortName: "1. Programme", icon: Building2, desc: "Residency & programme choice" },
  { id: 2, name: "Personal & Contact Details", shortName: "2. Personal & Contact", icon: UserCircle2, desc: "Identity, address & emergency contact" },
  { id: 3, name: "Education & Qualifications", shortName: "3. Education", icon: GraduationCap, desc: "Academic history & English test" },
  { id: 4, name: "Employment & Documents", shortName: "4. Employment & Docs", icon: Briefcase, desc: "Work history & document uploads" },
  { id: 5, name: "Review & Payment", shortName: "5. Review & Pay", icon: CreditCard, desc: "Review summary, terms & payment" },
];

export default function ApplicationWizard({ user, programmes, intakes, schools = [] }: { user: any, programmes: any[], intakes: any[], schools?: any[] }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingQualId, setEditingQualId] = useState<number | null>(null);
  const [educationList, setEducationList] = useState<any[]>([
    { id: 1, qualification: "Bachelor's Degree", institution: "National University of Singapore", major: "Business Administration", year: "2020-2024", country: "Singapore", modeOfStudy: "Full Time", completionStatus: "Completed", language: "English" },
    { id: 2, qualification: "Higher Secondary", institution: "Singapore Polytechnic", major: "Business", year: "2016-2019", country: "Singapore", modeOfStudy: "Full Time", completionStatus: "Completed", language: "English" },
    { id: 3, qualification: "Secondary School", institution: "St. Andrew's School", major: "General", year: "2012-2016", country: "Singapore", modeOfStudy: "Full Time", completionStatus: "Completed", language: "English" }
  ]);
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);
  const [qualForm, setQualForm] = useState<{
    country: string;
    qualification: string;
    institution: string;
    school: string;
    major: string;
    startYear: string;
    endYear: string;
    modeOfStudy: string;
    completionStatus: string;
    language: string;
    gpa: string;
    classification: string;
  }>({
    country: "Singapore",
    qualification: "Bachelor's Degree",
    institution: "",
    school: "",
    major: "",
    startYear: "2020",
    endYear: "2024",
    modeOfStudy: "Full Time",
    completionStatus: "Completed",
    language: "English",
    gpa: "",
    classification: "Pass With Merit"
  });
  const router = useRouter();

  const { register, handleSubmit, control, watch, setValue, getValues, trigger, formState: { errors } } = useForm<any>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantType: "Local Student",
      courseType: "Standalone Course",
      courseLevel: "",
      progressionOption: "",
      personal: {
        title: user.profile?.title || "mr",
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        gender: user.profile?.gender || "male",
        dob: user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : "",
        nationality: user.profile?.nationality || "Singaporean",
        passportNumber: user.profile?.passportNumber || "",
      },
      contact: {
        email: user.email,
        phone: user.profile?.phone || "",
        addressLine1: user.profile?.address || "",
        city: user.profile?.city || "Singapore",
        state: user.profile?.state || "",
        postalCode: user.profile?.postalCode || "",
        country: user.profile?.country || "Singapore",
      },
      family: {
        fatherName: user.profile?.emergencyContactName || "",
        fatherPhone: user.profile?.emergencyContactPhone || "",
        fatherEmail: "",
        fatherRelationship: "Father",
      },
      marketingSource: "Online Search",
      agent: {
        isAgentSubmitted: false,
        agentCompanyName: "",
        counsellorName: "",
        agentEmail: "",
      },
      education: [{}],
      employment: [{}],
      englishTest: { testName: "None" }
    }
  });

  const watchApplicantType = watch("applicantType");
  const watchCourseType = watch("courseType") || "Standalone Course";
  const watchCourseLevel = watch("courseLevel");
  const watchProgressionOption = watch("progressionOption");
  const watchProgrammeId = watch("programmeId");
  const watchEnglishTest = watch("englishTest.testName");
  const watchEmployed = watch("isEmployed");
  const watchIntake = watch("intake");
  const watchSchool = watch("school");
  const watchMarketingSource = watch("marketingSource");
  const watchIsAgent = watch("agent.isAgentSubmitted");

  const filteredProgrammes = programmes.filter(p => {
    if (watchSchool && p.schoolId !== watchSchool && p.school?.name !== watchSchool) return false;
    if (watchCourseLevel && watchCourseLevel !== "All Levels" && watchCourseLevel !== "") {
      return p.level?.toLowerCase().includes(watchCourseLevel.toLowerCase()) || p.name?.toLowerCase().includes(watchCourseLevel.toLowerCase());
    }
    return true;
  });

  const selectedProgramme = programmes.find(p => p.id === watchProgrammeId);

  useEffect(() => {
    setValue("education", educationList);
  }, [educationList, setValue]);

  const nextStep = async () => {
    if (step < 5) {
      let fieldsToValidate: string[] = [];
      switch (step) {
        case 1: fieldsToValidate = ['applicantType', 'contact.country', 'programmeId', 'intake']; break;
        case 2: fieldsToValidate = ['personal.firstName', 'personal.dob', 'personal.gender', 'personal.nationality', 'personal.passportNumber', 'contact.email', 'contact.phone', 'contact.addressLine1', 'contact.city', 'contact.postalCode', 'family.fatherName', 'family.fatherPhone']; break;
        case 3: fieldsToValidate = ['education']; break;
        case 4: fieldsToValidate = []; break;
      }
      
      const isStepValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
      
      if (isStepValid) {
        setFormError(null);
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError("There are incomplete required fields in this section. Please fill all fields marked with *.");
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: any) => {
    if (step !== 5) {
      await nextStep();
      return;
    }
    
    // Validate declaration agreement
    const declarationCheck = (document.getElementById("declareCheck") as HTMLInputElement)?.checked;
    if (!declarationCheck) {
      setFormError("You must accept the declaration agreement before submitting.");
      return;
    }

    // Final Submit
    setIsSubmitting(true);
    const result = await submitApplication(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessAppNumber(result.appNumber);
    } else {
      setFormError("Error submitting application: " + (result.error || "Please try again."));
    }
  };

  if (successAppNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in zoom-in duration-500 font-sans">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2 font-heading">🎉 Congratulations!</h1>
        <p className="text-lg text-neutral-600 mb-8 font-medium">Your application has been submitted successfully.</p>
        
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm max-w-sm w-full mb-8">
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider font-mono mb-1">Application Number</p>
          <p className="text-2xl font-mono font-extrabold text-[#27295B]">{successAppNumber}</p>
          <div className="h-px bg-neutral-100 my-4 w-full" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-500 font-medium">Status</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Submitted</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="h-11 px-6 rounded-xl font-bold">
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push("/dashboard/applications")} className="h-11 px-6 bg-[#27295B] hover:bg-[#1e204b] text-white rounded-xl font-bold">
            View My Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 text-left font-sans">
      
      {/* 1. Header Banner & Section Navigation Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#27295B] bg-[#27295B]/10 px-3 py-1 rounded-full font-mono">
              EGA Admissions Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-heading tracking-tight">
              Student Application Form
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
              Complete the 5 application sections below to submit your application.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-neutral-200/60 p-3.5 rounded-2xl shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Progress</p>
              <p className="text-sm font-extrabold text-[#27295B]">{Math.round((step / 5) * 100)}% Complete</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#27295B] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              {step}/5
            </div>
          </div>
        </div>

        {/* 5-Section Stepper Track */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {SECTIONS.map((sec) => {
            const isActive = step === sec.id;
            const isCompleted = step > sec.id;
            const IconComp = sec.icon;

            return (
              <button
                type="button"
                key={sec.id}
                onClick={() => {
                  if (sec.id <= step || isCompleted) {
                    setStep(sec.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={cn(
                  "flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer group relative overflow-hidden",
                  isActive 
                    ? "bg-[#27295B] text-white border-[#27295B] shadow-md" 
                    : isCompleted
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100/70"
                    : "bg-slate-50/70 border-neutral-200/80 text-neutral-400 hover:bg-slate-100/60"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-colors",
                    isActive ? "bg-white/20 text-white" : isCompleted ? "bg-emerald-600 text-white" : "bg-white text-neutral-500 border border-neutral-200"
                  )}>
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : sec.id}
                  </div>
                  <IconComp size={16} className={cn(isActive ? "text-white/80" : isCompleted ? "text-emerald-600" : "text-neutral-300")} />
                </div>
                <p className={cn("text-xs font-bold truncate w-full", isActive ? "text-white" : isCompleted ? "text-emerald-950" : "text-neutral-700")}>
                  {sec.shortName}
                </p>
                <p className={cn("text-[10px] truncate w-full mt-0.5 hidden sm:block", isActive ? "text-white/70" : isCompleted ? "text-emerald-700" : "text-neutral-400")}>
                  {sec.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Error Alert Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white font-bold text-xs">
              ✕
            </div>
            <span>{formError}</span>
          </div>
          <button type="button" onClick={() => setFormError(null)} className="text-white/80 hover:text-white text-xs font-mono font-bold ml-4 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Section Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs p-6 sm:p-10 space-y-8 min-h-[500px]">
          
          {/* SECTION 1: Programme & Residency Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-[#27295B] uppercase tracking-wider font-mono">Section 1 of 5</span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-1">Programme & Residency Selection</h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">Select your residency status and target program for admission.</p>
              </div>

              {/* Sub-card 1: Residency Status */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Residency Status *
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: "Local Student", icon: MapPin, title: "Local Student", desc: "Citizen or resident of Singapore" },
                    { type: "Permanent Resident", icon: Building2, title: "Permanent Resident", desc: "Singapore PR pass holder" },
                    { type: "International Student", icon: Globe, title: "International Student", desc: "Overseas applicant requiring Student Pass" }
                  ].map(({ type, icon: IconComp, title, desc }) => {
                    const isSelected = watchApplicantType === type;
                    return (
                      <div 
                        key={type}
                        onClick={() => {
                          setValue("applicantType", type, { shouldValidate: true });
                          if (type === "Local Student" || type === "Permanent Resident") {
                            setValue("contact.country", "Singapore", { shouldValidate: true });
                          }
                        }}
                        className={cn(
                          "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between group min-h-[140px]",
                          isSelected 
                            ? "border-[#27295B] bg-[#27295B]/5 shadow-xs" 
                            : "border-neutral-200 hover:border-[#27295B]/40 hover:bg-slate-50/50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            isSelected ? "bg-[#27295B] text-white" : "bg-slate-100 text-neutral-500 group-hover:bg-[#27295B]/10 group-hover:text-[#27295B]"
                          )}>
                            <IconComp size={20} />
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5",
                            isSelected ? "border-[#27295B] bg-[#27295B]" : "border-neutral-300"
                          )}>
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#27295B]">{title}</h4>
                          <p className="mt-1 text-xs text-neutral-500 leading-normal font-medium">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-card 2: Course Selection Type (Standalone vs Package) */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Course Selection Type *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: "Standalone Course", title: "Standalone Course", desc: "Select a single course level and program" },
                    { value: "Package Course", title: "Package Course", desc: "Select course level, course, and progression / package options" }
                  ].map(c => (
                    <label 
                      key={c.value}
                      className={cn(
                        "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3",
                        watchCourseType === c.value ? "border-[#27295B] bg-[#27295B]/5" : "border-neutral-200 hover:border-[#27295B]/30"
                      )}
                    >
                      <input
                        type="radio"
                        name="courseType"
                        value={c.value}
                        checked={watchCourseType === c.value}
                        onChange={() => {
                          setValue("courseType", c.value, { shouldValidate: true });
                          setValue("progressionOption", "");
                        }}
                        className="mt-1 w-4 h-4 text-[#27295B]"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{c.title}</h4>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">{c.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub-card 3: Country of Residence & School */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-xs">Country of Residence *</Label>
                  <Controller
                    name="contact.country"
                    control={control}
                    defaultValue="Singapore"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || "Singapore"}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#27295B]/20">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                          <SelectItem value="Malaysia">🇲🇾 Malaysia</SelectItem>
                          <SelectItem value="Indonesia">🇮🇩 Indonesia</SelectItem>
                          <SelectItem value="India">🇮🇳 India</SelectItem>
                          <SelectItem value="China">🇨🇳 China</SelectItem>
                          <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="United States">🇺🇸 United States</SelectItem>
                          <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-xs">School / Faculty *</Label>
                  <Controller
                    name="school"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#27295B]/20">
                          <SelectValue placeholder="Select School / Faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools && schools.length > 0 ? (
                            schools.map(s => (
                              <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="School of Business">School of Business</SelectItem>
                              <SelectItem value="School of Computing">School of Computing</SelectItem>
                              <SelectItem value="School of Engineering">School of Engineering</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Sub-card 4: Course Level, Target Programme & Intake */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-xs">Course Level *</Label>
                  <Controller
                    name="courseLevel"
                    control={control}
                    defaultValue="Diploma"
                    render={({ field }) => (
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        setValue("programmeId", "");
                        setValue("progressionOption", "");
                      }} value={field.value || ""}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl font-medium">
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                          <SelectItem value="Diploma">Diploma</SelectItem>
                          <SelectItem value="Advanced Diploma">Advanced Diploma</SelectItem>
                          <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="Master">Master's / Post Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-xs">Target Programme *</Label>
                  <Controller
                    name="programmeId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        setValue("progressionOption", "");
                      }} value={field.value || ""}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#27295B]/20">
                          <SelectValue placeholder="Select Programme" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProgrammes.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold text-xs">Intake / Entry Term *</Label>
                  <Controller
                    name="intake"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#27295B]/20">
                          <SelectValue placeholder="Select Intake" />
                        </SelectTrigger>
                        <SelectContent>
                          {intakes.map(i => (
                            <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Sub-card 5: Package Progression Options (Visible when Package Course selected) */}
              {watchCourseType === "Package Course" && selectedProgramme && (
                <div className="space-y-4 pt-4 border-t border-neutral-100 animate-in fade-in duration-300">
                  <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
                    <span>Package Progression Options *</span>
                    <span className="text-xs font-mono font-semibold text-[#27295B] bg-[#27295B]/10 px-2.5 py-1 rounded-full">Progression Package</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">Select your intended pathway after completing {selectedProgramme.name}:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      `Advanced Diploma in ${selectedProgramme.name.replace(/^Diploma in /i, '')}`,
                      `Advanced Diploma in ${selectedProgramme.name.replace(/^Diploma in /i, '')} + Bachelor's`
                    ].map((opt, idx) => (
                      <label 
                        key={idx}
                        className={cn(
                          "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3",
                          watchProgressionOption === opt ? "border-[#27295B] bg-[#27295B]/5 font-bold" : "border-neutral-200 hover:border-[#27295B]/30"
                        )}
                      >
                        <input 
                          type="radio" 
                          name="progressionOption" 
                          value={opt} 
                          checked={watchProgressionOption === opt} 
                          onChange={() => setValue("progressionOption", opt, { shouldValidate: true })}
                          className="mt-1 w-4 h-4 text-[#27295B]" 
                        />
                        <div>
                          <p className="text-xs sm:text-sm text-neutral-900 font-bold">{opt}</p>
                          <p className="text-[10px] text-neutral-500 font-medium mt-1">Option {idx + 1} Progression Pathway</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Programme Summary Banner */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Selected Programme Summary</p>
                  <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                    {selectedProgramme ? `${selectedProgramme.name} (${selectedProgramme.code})` : "Please select a programme above"}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 font-medium">
                    Location: Singapore Campus • Duration: 12 Months • Mode: Full Time
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-200 pt-3 sm:pt-0 sm:pl-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Application Fee</p>
                  <p className="text-lg font-extrabold text-[#27295B] mt-0.5">
                    SGD {selectedProgramme?.applicationFee || "50.00"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Personal & Contact Particulars */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-[#27295B] uppercase tracking-wider font-mono">Section 2 of 5</span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-1">Personal & Contact Details</h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">Provide your legal personal information, address, and emergency contact.</p>
              </div>

              {/* Personal Particulars */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Personal Particulars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Title *</Label>
                    <Controller
                      name="personal.title"
                      control={control}
                      defaultValue="mr"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "mr"}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 rounded-xl font-medium">
                            <SelectValue placeholder="Title" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mr">Mr.</SelectItem>
                            <SelectItem value="ms">Ms.</SelectItem>
                            <SelectItem value="mrs">Mrs.</SelectItem>
                            <SelectItem value="dr">Dr.</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Full Name (as in Passport / NRIC) *</Label>
                    <Input {...register("personal.firstName")} placeholder="e.g. John Michael Doe" className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Date of Birth *</Label>
                    <Input type="date" {...register("personal.dob")} className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Gender *</Label>
                    <Controller
                      name="personal.gender"
                      control={control}
                      defaultValue="male"
                      render={({ field }) => (
                        <div className="flex h-12 items-center gap-4 bg-white border border-neutral-200 rounded-xl px-4">
                          {["male", "female", "other"].map(genderVal => (
                            <label key={genderVal} className="flex items-center gap-1.5 text-xs text-neutral-700 capitalize cursor-pointer font-medium">
                              <input
                                type="radio"
                                name="gender"
                                value={genderVal}
                                checked={field.value === genderVal}
                                onChange={() => field.onChange(genderVal)}
                                className="w-4 h-4 text-[#27295B]"
                              />
                              <span>{genderVal}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Nationality *</Label>
                    <Controller
                      name="personal.nationality"
                      control={control}
                      defaultValue="Singaporean"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "Singaporean"}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 rounded-xl font-medium">
                            <SelectValue placeholder="Nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Singaporean">Singaporean</SelectItem>
                            <SelectItem value="Malaysian">Malaysian</SelectItem>
                            <SelectItem value="Indonesian">Indonesian</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">NRIC / Passport Number *</Label>
                    <Input {...register("personal.passportNumber")} placeholder="e.g. S1234567A / E1234567" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Country of Birth</Label>
                    <Input {...register("personal.countryOfBirth")} placeholder="e.g. Singapore" className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Contact Details & Address */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Contact Details & Home Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Notification Email *</Label>
                    <Input {...register("contact.email")} type="email" disabled className="h-12 bg-neutral-100 text-neutral-500 rounded-xl font-medium" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Mobile Phone Number *</Label>
                    <div className="flex gap-2">
                      <Controller
                        name="contact.phonePrefix"
                        control={control}
                        defaultValue="+65"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "+65"}>
                            <SelectTrigger className="w-[100px] h-12 bg-white border border-neutral-200 rounded-xl font-medium shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+65">🇸🇬 +65</SelectItem>
                              <SelectItem value="+60">🇲🇾 +60</SelectItem>
                              <SelectItem value="+62">🇮🇩 +62</SelectItem>
                              <SelectItem value="+91">🇮🇳 +91</SelectItem>
                              <SelectItem value="+86">🇨🇳 +86</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input {...register("contact.phone")} placeholder="9123 4567" className="flex-1 h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-slate-700 font-semibold text-xs">Address Line 1 *</Label>
                  <Input {...register("contact.addressLine1")} placeholder="123 Orchard Road, #05-01 Singapore" className="h-12 rounded-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">City *</Label>
                    <Input {...register("contact.city")} placeholder="Singapore" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">State / Region</Label>
                    <Input {...register("contact.state")} placeholder="Singapore" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Postal Code *</Label>
                    <Input {...register("contact.postalCode")} placeholder="238845" className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Parents' Details */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
                  <span>Parents' Details</span>
                  <span className="text-xs text-rose-500 font-normal">* Parent's Name & Contact Number are mandatory</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Parent's / Guardian's Name *</Label>
                    <Input {...register("family.fatherName")} placeholder="e.g. Robert Doe" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Contact Number *</Label>
                    <Input {...register("family.fatherPhone")} placeholder="e.g. +65 9224 5678" className="h-12 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Email Address (Optional)</Label>
                    <Input {...register("family.fatherEmail")} type="email" placeholder="e.g. parent@example.com" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Relationship</Label>
                    <Controller
                      name="family.fatherRelationship"
                      control={control}
                      defaultValue="Father"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "Father"}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 rounded-xl font-medium">
                            <SelectValue placeholder="Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Guardian">Legal Guardian</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Education & English Language */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-[#27295B] uppercase tracking-wider font-mono">Section 3 of 5</span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-1">Education & Language Proficiency</h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">List your academic qualifications and English language proficiency test results.</p>
              </div>

              {/* Academic Qualifications Table */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <h3 className="font-heading font-bold text-base text-neutral-900">Academic Qualifications</h3>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setEditingQualId(null);
                      setQualForm({
                        country: "Singapore",
                        qualification: "Bachelor's Degree",
                        institution: "",
                        school: "",
                        major: "",
                        startYear: "2020",
                        endYear: "2024",
                        modeOfStudy: "Full Time",
                        completionStatus: "Completed",
                        language: "English",
                        gpa: "",
                        classification: "Pass With Merit"
                      });
                      setIsQualModalOpen(true);
                    }}
                    className="h-10 px-4 bg-[#27295B] hover:bg-[#1e204b] text-white rounded-xl font-bold text-xs"
                  >
                    + Add Education
                  </Button>
                </div>

                <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                        <th className="px-5 py-3.5">Qualification</th>
                        <th className="px-5 py-3.5">Institution</th>
                        <th className="px-5 py-3.5">Field of Study</th>
                        <th className="px-5 py-3.5">Period</th>
                        <th className="px-5 py-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {educationList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 text-neutral-700 font-medium">
                          <td className="px-5 py-3.5 font-bold text-neutral-900">
                            {item.qualification}
                            <span className="block text-[10px] text-neutral-400 font-normal">{item.country || "Singapore"} • {item.modeOfStudy || "Full Time"}</span>
                          </td>
                          <td className="px-5 py-3.5">{item.institution}</td>
                          <td className="px-5 py-3.5">{item.major}</td>
                          <td className="px-5 py-3.5 font-mono text-[11px]">{item.year}</td>
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEditingQualId(item.id);
                                  const years = (item.year || "2020-2024").split("-");
                                  setQualForm({
                                    country: item.country || "Singapore",
                                    qualification: item.qualification,
                                    institution: item.institution,
                                    school: item.school || item.institution,
                                    major: item.major,
                                    startYear: years[0] || "2020",
                                    endYear: years[1] || "2024",
                                    modeOfStudy: item.modeOfStudy || "Full Time",
                                    completionStatus: item.completionStatus || "Completed",
                                    language: item.language || "English",
                                    gpa: item.gpa || "",
                                    classification: item.classification || "Pass With Merit"
                                  });
                                  setIsQualModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-bold transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  if (confirm("Delete this qualification?")) {
                                    setEducationList(educationList.filter(el => el.id !== item.id));
                                  }
                                }}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 font-bold transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* English Language Proficiency */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  English Language Proficiency
                </h3>

                <div className="flex items-center space-x-3 bg-slate-50 border border-neutral-200 p-4 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="englishExempt" 
                    {...register("englishTest.exempt")} 
                    className="w-4 h-4 text-[#27295B] border-neutral-300 rounded focus:ring-[#27295B]" 
                  />
                  <Label htmlFor="englishExempt" className="text-neutral-800 font-semibold cursor-pointer text-xs sm:text-sm">
                    I am exempt from English proficiency requirement (studied in an English-speaking medium institution)
                  </Label>
                </div>

                <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 transition-opacity duration-300", watch("englishTest.exempt") && "opacity-40 pointer-events-none")}>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Test Type</Label>
                    <Controller
                      name="englishTest.testName"
                      control={control}
                      defaultValue="IELTS Academic"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || "IELTS Academic"} disabled={watch("englishTest.exempt")}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 rounded-xl font-medium">
                            <SelectValue placeholder="Select Test" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IELTS Academic">IELTS Academic</SelectItem>
                            <SelectItem value="TOEFL iBT">TOEFL iBT</SelectItem>
                            <SelectItem value="PTE Academic">PTE Academic</SelectItem>
                            <SelectItem value="Duolingo English Test">Duolingo English Test</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Overall Score</Label>
                    <Input {...register("englishTest.overallScore")} placeholder="e.g. 7.0" disabled={watch("englishTest.exempt")} className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Exam Date</Label>
                    <Input type="date" {...register("englishTest.testDate")} disabled={watch("englishTest.exempt")} className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Employment & Documents */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-[#27295B] uppercase tracking-wider font-mono">Section 4 of 5</span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-1">Employment & Document Uploads</h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium">Provide current employment history and upload required application documents.</p>
              </div>

              {/* Employment Particulars */}
              <div className="space-y-4 pt-2">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Employment Particulars
                </h3>

                <div className="flex items-center space-x-3 bg-slate-50 border border-neutral-200 p-4 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="notEmployed" 
                    {...register("notEmployed")} 
                    className="w-4 h-4 text-[#27295B] border-neutral-300 rounded focus:ring-[#27295B]" 
                  />
                  <Label htmlFor="notEmployed" className="text-neutral-800 font-semibold cursor-pointer text-xs sm:text-sm">
                    Currently not employed / Fresh Graduate
                  </Label>
                </div>

                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 transition-opacity duration-300", watch("notEmployed") && "opacity-40 pointer-events-none")}>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Employer / Company Name</Label>
                    <Input {...register("employment.0.employer")} placeholder="e.g. ABC Pte Ltd" disabled={watch("notEmployed")} className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Job Title / Position</Label>
                    <Input {...register("employment.0.position")} placeholder="e.g. Business Analyst" disabled={watch("notEmployed")} className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Marketing / Referral Source: How did you get to know about us? */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  How did you get to know about us?
                </h3>
                <p className="text-xs text-neutral-500 font-medium">Select the primary channel through which you learned about our institution:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Education Fair / Exhibition",
                    "Search Engine (Google / Baidu)",
                    "Social Media (Instagram / Facebook / Redbook)",
                    "Friend / Family Recommendation",
                    "Education Agent / Consultancy",
                    "School / College Representative",
                    "Advertisement / Billboard",
                    "Other"
                  ].map((source, idx) => (
                    <label 
                      key={idx}
                      className={cn(
                        "p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all text-xs font-semibold",
                        watchMarketingSource === source ? "border-[#27295B] bg-[#27295B]/5 text-[#27295B]" : "border-neutral-200 hover:border-neutral-300 text-neutral-700"
                      )}
                    >
                      <input
                        type="radio"
                        name="marketingSource"
                        value={source}
                        checked={watchMarketingSource === source}
                        onChange={() => setValue("marketingSource", source)}
                        className="w-4 h-4 text-[#27295B]"
                      />
                      <span>{source}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Agent Details Page / Section */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Agent Details
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">Fill if applying through an agency</span>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 border border-neutral-200 p-4 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="isAgentSubmitted" 
                    {...register("agent.isAgentSubmitted")} 
                    className="w-4 h-4 text-[#27295B] border-neutral-300 rounded focus:ring-[#27295B]" 
                  />
                  <Label htmlFor="isAgentSubmitted" className="text-neutral-800 font-semibold cursor-pointer text-xs sm:text-sm">
                    This application is being submitted through an Education Agent / Representative
                  </Label>
                </div>

                <div className={cn("space-y-4 pt-2 transition-opacity duration-300", !watchIsAgent && "opacity-40 pointer-events-none")}>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Company Name</Label>
                    <Input 
                      {...register("agent.agentCompanyName")} 
                      placeholder="e.g. Global Education Agency Pte Ltd" 
                      disabled={!watchIsAgent} 
                      className="h-12 rounded-xl" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Counsellor's Name *</Label>
                    <Input 
                      {...register("agent.counsellorName")} 
                      placeholder="e.g. Jane Smith" 
                      disabled={!watchIsAgent} 
                      className="h-12 rounded-xl" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-xs">Agent Contact Email / Phone (Optional)</Label>
                    <Input 
                      {...register("agent.agentEmail")} 
                      placeholder="e.g. counsellor@agency.com" 
                      disabled={!watchIsAgent} 
                      className="h-12 rounded-xl" 
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Cards */}
              <div className="space-y-4 pt-6 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
                  Required Application Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Passport / NRIC Copy", req: "Mandatory" },
                    { label: "Academic Transcripts", req: "Mandatory" },
                    { label: "Degree Certificate", req: "Mandatory" },
                    { label: "Resume / CV", req: "Mandatory" },
                    { label: "English Test Report", req: "Optional" },
                    { label: "Passport-size Photo", req: "Mandatory" },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-neutral-200/80 bg-slate-50/60 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">{doc.req}</span>
                        <h4 className="font-bold text-xs text-neutral-900 mt-0.5">{doc.label}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60">
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Uploaded</span>
                        <Button type="button" variant="ghost" className="h-7 px-2 text-[11px] font-bold text-[#27295B]">
                          <Upload size={12} className="mr-1" /> Re-upload
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Review, Declaration & Payment */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-[#27295B] uppercase tracking-wider font-mono">Section 5 of 5</span>
                <h2 className="text-2xl font-bold text-neutral-900 mt-1">Review, Declaration & Payment</h2>
                <p className="text-sm text-neutral-500 mt-1 font-medium font-sans">Verify your details, accept terms, and complete application fee payment.</p>
              </div>

              {/* Comprehensive Summary Cards */}
              <div className="space-y-4 pt-2">
                <div className="bg-slate-50/80 rounded-2xl border border-neutral-200/80 p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                    <h3 className="font-heading font-bold text-sm text-neutral-900">1. Programme & Residency</h3>
                    <Button type="button" variant="ghost" onClick={() => setStep(1)} className="h-7 px-2 text-xs font-bold text-[#27295B]">Edit</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-neutral-400 font-medium">Type:</span> <span className="font-bold text-neutral-800">{watchApplicantType}</span></div>
                    <div><span className="text-neutral-400 font-medium">Course Mode:</span> <span className="font-bold text-neutral-800">{watchCourseType}</span></div>
                    <div><span className="text-neutral-400 font-medium">Programme:</span> <span className="font-bold text-neutral-800">{selectedProgramme?.name || "Not Selected"}</span></div>
                    <div><span className="text-neutral-400 font-medium">Intake:</span> <span className="font-bold text-neutral-800">{getValues("intake")}</span></div>
                  </div>
                  {watchCourseType === "Package Course" && watchProgressionOption && (
                    <div className="pt-2 border-t border-neutral-200/60 text-xs">
                      <span className="text-neutral-400 font-medium">Package Progression:</span> <span className="font-bold text-[#27295B]">{watchProgressionOption}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50/80 rounded-2xl border border-neutral-200/80 p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                    <h3 className="font-heading font-bold text-sm text-neutral-900">2. Personal & Parents' Details</h3>
                    <Button type="button" variant="ghost" onClick={() => setStep(2)} className="h-7 px-2 text-xs font-bold text-[#27295B]">Edit</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-neutral-400 font-medium">Student Name:</span> <span className="font-bold text-neutral-800">{getValues("personal.firstName")}</span></div>
                    <div><span className="text-neutral-400 font-medium">Email:</span> <span className="font-bold text-neutral-800">{getValues("contact.email")}</span></div>
                    <div><span className="text-neutral-400 font-medium">Parent's Name:</span> <span className="font-bold text-neutral-800">{getValues("family.fatherName")}</span></div>
                    <div><span className="text-neutral-400 font-medium">Parent's Contact:</span> <span className="font-bold text-neutral-800">{getValues("family.fatherPhone")}</span></div>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl border border-neutral-200/80 p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                    <h3 className="font-heading font-bold text-sm text-neutral-900">4. Referral & Agent Info</h3>
                    <Button type="button" variant="ghost" onClick={() => setStep(4)} className="h-7 px-2 text-xs font-bold text-[#27295B]">Edit</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div><span className="text-neutral-400 font-medium">How Heard:</span> <span className="font-bold text-neutral-800">{getValues("marketingSource") || "N/A"}</span></div>
                    <div><span className="text-neutral-400 font-medium">Agency:</span> <span className="font-bold text-neutral-800">{watchIsAgent ? (getValues("agent.agentCompanyName") || "Yes") : "No Agent"}</span></div>
                    {watchIsAgent && (
                      <div><span className="text-neutral-400 font-medium">Counsellor's Name:</span> <span className="font-bold text-neutral-800">{getValues("agent.counsellorName") || "N/A"}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-base text-neutral-900">Declaration & Terms</h3>
                <div className="p-4 bg-slate-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 leading-relaxed font-medium">
                  I hereby declare that all information provided in this application is accurate and complete. I acknowledge that providing false details may lead to immediate rejection of admission.
                </div>
                <div className="flex items-center space-x-3 bg-white border border-neutral-200 p-4 rounded-xl">
                  <input type="checkbox" id="declareCheck" required className="w-4 h-4 text-[#27295B] border-neutral-300 rounded focus:ring-[#27295B]" />
                  <Label htmlFor="declareCheck" className="text-neutral-900 font-bold cursor-pointer text-xs sm:text-sm">
                    I have read, understood, and accept the application declaration *
                  </Label>
                </div>
              </div>

              {/* Payment Method & Submission */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-heading font-bold text-base text-neutral-900">Application Fee Payment</h3>
                  <span className="text-xl font-extrabold text-[#27295B]">SGD {selectedProgramme?.applicationFee || "50.00"}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "card", label: "Credit / Debit Card" },
                    { value: "paypal", label: "PayPal" },
                    { value: "bank", label: "Bank Transfer" }
                  ].map(m => (
                    <label key={m.value} className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-xl cursor-pointer hover:border-[#27295B]/40 font-semibold text-xs text-neutral-800">
                      <input type="radio" name="paymentMethod" value={m.value} defaultChecked={m.value === "card"} className="w-4 h-4 text-[#27295B]" />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
              className="h-12 px-6 border-neutral-200 text-neutral-700 rounded-xl font-bold gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 bg-[#ED1C24] hover:bg-[#D91A20] text-white rounded-xl font-bold gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? "Processing..." : step === 5 ? "Pay & Submit Application" : `Continue to ${SECTIONS.find(s => s.id === step + 1)?.shortName || "Next"} >`}
          </Button>
        </div>
      </form>

      {/* Rich Education Modal (Matching SIMConnect Benchmark) */}
      {isQualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar text-left border border-neutral-200 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 font-heading">
                  {editingQualId ? "Edit Education Qualification" : "Add Education Qualification"}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Please fill in your academic qualification details as shown on your certificates.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsQualModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Country of Awarding Institution *</Label>
                <Select value={qualForm.country || "Singapore"} onValueChange={v => setQualForm({...qualForm, country: v || "Singapore"})}>
                  <SelectTrigger className="h-11 bg-white border border-neutral-200 rounded-xl font-medium">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                    <SelectItem value="Malaysia">🇲🇾 Malaysia</SelectItem>
                    <SelectItem value="Indonesia">🇮🇩 Indonesia</SelectItem>
                    <SelectItem value="India">🇮🇳 India</SelectItem>
                    <SelectItem value="China">🇨🇳 China</SelectItem>
                    <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="United States">🇺🇸 United States</SelectItem>
                    <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Qualification Title / Level *</Label>
                <Select value={qualForm.qualification || "Bachelor's Degree"} onValueChange={v => setQualForm({...qualForm, qualification: v || "Bachelor's Degree"})}>
                  <SelectTrigger className="h-11 bg-white border border-neutral-200 rounded-xl font-medium">
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Higher Secondary / A-Levels">Higher Secondary / A-Levels</SelectItem>
                    <SelectItem value="Secondary School / O-Levels">Secondary School / O-Levels</SelectItem>
                    <SelectItem value="Doctorate / PhD">Doctorate / PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-700 font-semibold text-xs">Awarding Institution *</Label>
                  <span className="text-[10px] text-[#27295B] font-semibold hover:underline cursor-pointer">I can't find my institution</span>
                </div>
                <Input value={qualForm.institution} onChange={e => setQualForm({...qualForm, institution: e.target.value})} placeholder="e.g. National University of Singapore" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">School / College Attended *</Label>
                <Input value={qualForm.school} onChange={e => setQualForm({...qualForm, school: e.target.value})} placeholder="e.g. NUS Business School" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Specialization / Major</Label>
                <Input value={qualForm.major} onChange={e => setQualForm({...qualForm, major: e.target.value})} placeholder="e.g. Business Administration" className="h-11 rounded-xl" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Mode of Study *</Label>
                <Select value={qualForm.modeOfStudy || "Full Time"} onValueChange={v => setQualForm({...qualForm, modeOfStudy: v || "Full Time"})}>
                  <SelectTrigger className="h-11 bg-white border border-neutral-200 rounded-xl font-medium">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Online / Distance">Online / Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Study Period (Start - End Year) *</Label>
                <div className="flex gap-2 items-center">
                  <Input value={qualForm.startYear} onChange={e => setQualForm({...qualForm, startYear: e.target.value})} placeholder="2020" type="number" className="h-11 rounded-xl" />
                  <span className="text-neutral-400 font-bold">To</span>
                  <Input value={qualForm.endYear} onChange={e => setQualForm({...qualForm, endYear: e.target.value})} placeholder="2024" type="number" className="h-11 rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Completion Status *</Label>
                <div className="flex items-center gap-3 h-11 px-3 border border-neutral-200 rounded-xl bg-white">
                  {["Completed", "Currently Pursuing", "Incomplete"].map(status => (
                    <label key={status} className="flex items-center gap-1 text-[11px] text-neutral-700 cursor-pointer font-medium">
                      <input type="radio" name="modalCompletionStatus" value={status} checked={qualForm.completionStatus === status} onChange={() => setQualForm({...qualForm, completionStatus: status})} className="w-3.5 h-3.5 text-[#27295B]" />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-100">
              <Button variant="outline" type="button" onClick={() => setIsQualModalOpen(false)} className="h-10 px-5 rounded-xl font-bold">
                Cancel
              </Button>
              <Button 
                type="button"
                className="h-10 px-6 bg-[#27295B] hover:bg-[#1e204b] text-white rounded-xl font-bold"
                onClick={() => {
                  if (qualForm.qualification && qualForm.institution) {
                    const newItem = {
                      id: editingQualId || Date.now(),
                      qualification: qualForm.qualification,
                      institution: qualForm.institution,
                      school: qualForm.school || qualForm.institution,
                      major: qualForm.major || "General",
                      year: `${qualForm.startYear}-${qualForm.endYear}`,
                      country: qualForm.country,
                      modeOfStudy: qualForm.modeOfStudy,
                      completionStatus: qualForm.completionStatus,
                      language: qualForm.language,
                      gpa: qualForm.gpa,
                      classification: qualForm.classification,
                    };

                    if (editingQualId) {
                      setEducationList(educationList.map(item => item.id === editingQualId ? newItem : item));
                    } else {
                      setEducationList([...educationList, newItem]);
                    }
                    setIsQualModalOpen(false);
                    setEditingQualId(null);
                  } else {
                    alert("Please fill in Qualification Title and Institution.");
                  }
                }}
              >
                {editingQualId ? "Save Changes" : "Add Education"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
