"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Upload, Plus, FileText, Globe, MapPin, Building2, UserCircle2, GraduationCap, Briefcase, Languages, FileCheck2, ClipboardCheck, ScrollText, CreditCard, Phone, Mail, Clock } from "lucide-react";
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

export default function ApplicationWizard({ user, programmes, intakes, schools = [] }: { user: any, programmes: any[], intakes: any[], schools?: any[] }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);
  const [educationList, setEducationList] = useState<any[]>([
    { id: 1, qualification: "Bachelor's Degree", institution: "National University of Singapore", major: "Business Administration", year: "2020" },
    { id: 2, qualification: "Higher Secondary", institution: "Singapore Polytechnic", major: "Business", year: "2016" },
    { id: 3, qualification: "Secondary School", institution: "St. Andrew's School", major: "General", year: "2014" }
  ]);
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
  const watchIntake = watch("intake");
  const watchSchool = watch("school");

  const filteredProgrammes = programmes.filter(p => {
    if (!watchSchool) return true;
    return p.schoolId === watchSchool || p.school?.name === watchSchool;
  });

  const selectedProgramme = programmes.find(p => p.id === watchProgrammeId);

  useEffect(() => {
    setValue("education", educationList);
  }, [educationList, setValue]);

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
    <div className="w-full px-2 sm:px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sidebar Stepper */}
        <aside className="w-full lg:col-span-3 space-y-4">
          {/* Mobile Stepper Header */}
          <div className="lg:hidden bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-2xs mb-2 text-left">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 font-mono">
              <span>Progress</span>
              <span>Step {step} of 12</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-800 mb-3">
              {STEPS.find(s => s.id === step)?.name}
            </h3>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ED1C24] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 12) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Stepper Track */}
          <div className="hidden lg:block bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-2xs text-left">
            <h3 className="font-heading font-bold text-[15px] text-neutral-800 mb-5">Application Steps</h3>
            <div className="relative pl-1 space-y-3">
              {/* Stepper Timeline Connection Line */}
              <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-slate-100 pointer-events-none" />
              <div 
                className="absolute left-5 top-3 w-0.5 bg-[#27295B] transition-all duration-300 pointer-events-none" 
                style={{ height: `${((step - 1) / 11) * 92}%`, minHeight: '0%' }}
              />

              {STEPS.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div key={s.id} className={cn("relative flex items-center gap-3.5 px-3 py-2 rounded-xl transition-all duration-300", isActive && "bg-[#F8FAFC] border border-neutral-100/50")}>
                    <div className={cn(
                      "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 font-bold text-xs font-heading",
                      isActive
                        ? "border-[#27295B] bg-[#27295B] text-white shadow-xs"
                        : isCompleted
                        ? "border-neutral-300 bg-neutral-100 text-neutral-600"
                        : "border-neutral-200 bg-neutral-100 text-neutral-400"
                    )}>
                      {s.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-[13px] font-heading font-semibold leading-none tracking-wide transition-colors",
                        isActive ? "text-[#27295B]" : isCompleted ? "text-neutral-700" : "text-neutral-400 font-medium"
                      )}>
                        {s.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Middle Column: Form Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-2xs overflow-hidden min-h-[620px] flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full flex-1">
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* STEP 1: Applicant Type */}
                  {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-800">1. Applicant Type</h2>
                        <p className="text-neutral-400 mt-1.5 text-sm font-medium">Select the option that best describes you.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {[
                          { type: "Local Student", desc: "I am a citizen or resident of the country where the institution is located." },
                          { type: "Permanent Resident", desc: "I am a permanent resident of the country where the institution is located." },
                          { type: "International Student", desc: "I am not a citizen or resident of the country where the institution is located." }
                        ].map(({ type, desc }) => {
                          const isSelected = watchApplicantType === type;
                          return (
                            <div 
                              key={type}
                              onClick={() => setValue("applicantType", type)}
                              className={cn(
                                "relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group min-h-[200px] justify-center",
                                isSelected 
                                  ? "border-[#27295B] bg-[#27295B]/5 shadow-xs" 
                                  : "border-neutral-200 hover:border-[#27295B]/30 hover:bg-slate-50/30"
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#27295B] border-2 border-white flex items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                </div>
                              )}
                              <div className={cn(
                                "w-11 h-11 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300",
                                isSelected 
                                  ? "bg-[#27295B]/10 text-[#27295B]" 
                                  : "bg-slate-50 text-neutral-400 group-hover:bg-slate-100 group-hover:text-neutral-600 group-hover:scale-105"
                              )}>
                                {type === "International Student" ? <Globe size={20} /> : <MapPin size={20} />}
                              </div>
                              <h3 className="font-bold text-sm text-neutral-800 transition-colors group-hover:text-[#27295B]">{type}</h3>
                              <p className="mt-2 text-xs text-neutral-400 font-medium leading-relaxed">{desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 bg-[#eef2f6]/70 border border-neutral-100 rounded-xl p-4.5 mt-6 text-left">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white text-[10px] font-bold font-mono">
                          i
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1e3a8a]">Important Information</h4>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            Your selection helps us personalize your application form. Some questions and requirements may vary based on your choice.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-neutral-100 mt-6 text-left">
                        <h3 className="font-heading font-semibold text-neutral-800 text-[15px]">Additional Information</h3>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Country of Residence *</Label>
                          <Controller
                            name="contact.country"
                            control={control}
                            defaultValue="Singapore"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                                  <SelectItem value="Malaysia">🇲🇾 Malaysia</SelectItem>
                                  <SelectItem value="Indonesia">🇮🇩 Indonesia</SelectItem>
                                  <SelectItem value="India">🇮🇳 India</SelectItem>
                                  <SelectItem value="China">🇨🇳 China</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}            {/* STEP 2: Programme Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">2. Programme Selection</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Choose the programme you want to apply for.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-[13px]">School / Faculty *</Label>
                    <Controller
                      name="school"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
                            <SelectValue placeholder="Select School / Faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            {schools && schools.length > 0 ? (
                              schools.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
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

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-[13px]">Programme *</Label>
                    <Controller
                      name="programmeId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
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
                    <Label className="text-slate-700 font-semibold text-[13px]">Intake / Entry Term *</Label>
                    <Controller
                      name="intake"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
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
                  
                  <div className="mt-6 p-5 rounded-2xl border border-neutral-200 bg-neutral-50/30 text-left space-y-3">
                    <h4 className="font-heading font-bold text-sm text-neutral-800">Programme Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-neutral-400 font-medium">Duration</p>
                        <p className="text-neutral-800 font-bold mt-0.5">12 Months (Full-time)</p>
                      </div>
                      <div>
                        <p className="text-neutral-400 font-medium">Location</p>
                        <p className="text-neutral-800 font-bold mt-0.5">Singapore Campus</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-neutral-100">
                        <p className="text-neutral-400 font-medium">Application Fee</p>
                        <p className="text-sm font-extrabold text-[#27295B] mt-0.5">
                          SGD {selectedProgramme?.applicationFee || "50.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Personal Information */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">3. Personal Information</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Provide your basic personal details.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-[13px]">Full Name (as in Passport) *</Label>
                    <Input {...register("personal.firstName")} placeholder="John Michael Doe" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Date of Birth *</Label>
                      <div className="relative">
                        <Input type="date" {...register("personal.dob")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Gender *</Label>
                      <Controller
                        name="personal.gender"
                        control={control}
                        defaultValue="male"
                        render={({ field }) => (
                          <div className="flex h-12 items-center gap-6 bg-white border border-neutral-200 rounded-xl px-4">
                            {["male", "female", "other"].map(genderVal => (
                              <label key={genderVal} className="flex items-center gap-2 text-sm text-neutral-700 capitalize cursor-pointer">
                                <input
                                  type="radio"
                                  name="gender"
                                  value={genderVal}
                                  checked={field.value === genderVal}
                                  onChange={() => field.onChange(genderVal)}
                                  className="w-4 h-4 text-[#27295B] border-neutral-300 focus:ring-[#27295B]"
                                />
                                <span>{genderVal}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Nationality *</Label>
                      <Controller
                        name="personal.nationality"
                        control={control}
                        defaultValue="Singaporean"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
                              <SelectValue placeholder="Select Nationality" />
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

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">NRIC / Passport Number *</Label>
                      <Input {...register("personal.passportNumber")} placeholder="e.g. S1234567A / E1234567" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Country of Birth *</Label>
                      <Controller
                        name="personal.countryOfBirth"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Indonesia">Indonesia</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="China">China</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Contact Information */}
            {step === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">4. Contact Information</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">How can we reach you?</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Email Address *</Label>
                      <Input {...register("contact.email")} type="email" disabled className="h-12 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 font-medium" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Phone Number *</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="contact.phonePrefix"
                          control={control}
                          defaultValue="+65"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-[100px] h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium shrink-0">
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
                        <Input {...register("contact.phone")} placeholder="9123 4567" className="flex-1 h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Alternate Phone Number</Label>
                      <div className="flex gap-2">
                        <Controller
                          name="contact.altPhonePrefix"
                          control={control}
                          defaultValue="+65"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-[100px] h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium shrink-0">
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
                        <Input {...register("contact.altPhone")} placeholder="9876 5432" className="flex-1 h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold text-[13px]">Current Address *</Label>
                    <Input {...register("contact.addressLine1")} placeholder="123 Orchard Road, #05-01 Singapore 238845" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Country *</Label>
                      <Controller
                        name="contact.country"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] hover:bg-neutral-50/50 transition-all font-medium">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Indonesia">Indonesia</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="China">China</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">City *</Label>
                      <Input {...register("contact.city")} placeholder="Singapore" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Postal Code *</Label>
                      <Input {...register("contact.postalCode")} placeholder="238845" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Family / Emergency */}
            {step === 5 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">5. Family / Emergency</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Provide your family and emergency contact details.</p>
                </div>
                
                <div className="space-y-6">
                  {/* Parent / Guardian Info */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-neutral-800 text-[15px] border-b border-neutral-100 pb-2">Parent / Guardian Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Full Name *</Label>
                        <Input {...register("family.fatherName")} placeholder="Robert Doe" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Relationship *</Label>
                        <Controller
                          name="family.fatherRelationship"
                          control={control}
                          defaultValue="Father"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Father">Father</SelectItem>
                                <SelectItem value="Mother">Mother</SelectItem>
                                <SelectItem value="Guardian">Guardian</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Email *</Label>
                        <Input type="email" {...register("family.fatherEmail")} placeholder="robert.doe@email.com" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Phone Number *</Label>
                        <div className="flex gap-2">
                          <Controller
                            name="family.fatherPhonePrefix"
                            control={control}
                            defaultValue="+65"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-[100px] h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium shrink-0">
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
                          <Input {...register("family.fatherPhone")} placeholder="9224 5678" className="flex-1 h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="font-heading font-semibold text-neutral-800 text-[15px] border-b border-neutral-100 pb-2">Emergency Contact (if different from above)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Full Name</Label>
                        <Input {...register("family.emergencyName")} placeholder="Jane Doe" className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Relationship</Label>
                        <Controller
                          name="family.emergencyRelationship"
                          control={control}
                          defaultValue="Sister"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Sister">Sister</SelectItem>
                                <SelectItem value="Brother">Brother</SelectItem>
                                <SelectItem value="Spouse">Spouse</SelectItem>
                                <SelectItem value="Friend">Friend</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-[13px]">Phone Number</Label>
                        <div className="flex gap-2">
                          <Controller
                            name="family.emergencyPhonePrefix"
                            control={control}
                            defaultValue="+65"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-[100px] h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium shrink-0">
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
                          <Input {...register("family.emergencyPhone")} placeholder="9355 8877" className="flex-1 h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Academic Qualifications */}
            {step === 6 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-800">6. Academic Qualifications</h2>
                    <p className="text-neutral-400 mt-1.5 text-sm font-medium">List your previous academic qualifications.</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const qual = prompt("Enter Qualification Level (e.g. Diploma):");
                      const inst = prompt("Enter Institution Name:");
                      const major = prompt("Enter Field of Study:");
                      const year = prompt("Enter Completion Year:");
                      if (qual && inst && major && year) {
                        setEducationList([...educationList, { id: Date.now(), qualification: qual, institution: inst, major, year }]);
                      }
                    }}
                    className="h-10 px-4 border-[#27295B] text-[#27295B] hover:bg-[#27295B]/5 rounded-xl font-bold transition-all text-xs"
                  >
                    + Add Qualification
                  </Button>
                </div>
                
                <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-3xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                        <th className="px-5 py-4 font-bold">Qualification</th>
                        <th className="px-5 py-4 font-bold">Institution</th>
                        <th className="px-5 py-4 font-bold">Field of Study</th>
                        <th className="px-5 py-4 font-bold">Year</th>
                        <th className="px-5 py-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {educationList.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors text-neutral-700 font-medium">
                          <td className="px-5 py-4">{item.qualification}</td>
                          <td className="px-5 py-4">{item.institution}</td>
                          <td className="px-5 py-4">{item.major}</td>
                          <td className="px-5 py-4">{item.year}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  const qual = prompt("Edit Qualification Level:", item.qualification);
                                  const inst = prompt("Edit Institution Name:", item.institution);
                                  const major = prompt("Edit Field of Study:", item.major);
                                  const year = prompt("Edit Completion Year:", item.year);
                                  if (qual && inst && major && year) {
                                    setEducationList(educationList.map(el => el.id === item.id ? { ...el, qualification: qual, institution: inst, major, year } : el));
                                  }
                                }}
                                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-neutral-800 transition-colors"
                              >
                                ✏️
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this qualification?")) {
                                    setEducationList(educationList.filter(el => el.id !== item.id));
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 7: Employment History */}
            {step === 7 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">7. Employment History</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Provide your employment details (if applicable).</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="notEmployed" 
                      {...register("notEmployed")} 
                      className="w-4 h-4 text-[#27295B] border-neutral-300 focus:ring-[#27295B]" 
                    />
                    <Label htmlFor="notEmployed" className="text-neutral-700 font-semibold cursor-pointer">I am currently not employed</Label>
                  </div>

                  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300", watch("notEmployed") && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Current Employment Status *</Label>
                      <Controller
                        name="employmentStatus"
                        control={control}
                        defaultValue="Employed Full-time"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={watch("notEmployed")}>
                            <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employed Full-time">Employed Full-time</SelectItem>
                              <SelectItem value="Employed Part-time">Employed Part-time</SelectItem>
                              <SelectItem value="Self-employed">Self-employed</SelectItem>
                              <SelectItem value="Unemployed">Unemployed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Company / Organization *</Label>
                      <Input {...register("employment.0.employer")} placeholder="ABC Pte Ltd" disabled={watch("notEmployed")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>

                  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300", watch("notEmployed") && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Job Title *</Label>
                      <Input {...register("employment.0.position")} placeholder="Business Analyst" disabled={watch("notEmployed")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Employment Start Date *</Label>
                      <Input type="date" {...register("employment.0.startDate")} disabled={watch("notEmployed")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>

                  <div className={cn("space-y-2 transition-opacity duration-300", watch("notEmployed") && "opacity-40 pointer-events-none")}>
                    <Label className="text-slate-700 font-semibold text-[13px]">Brief Description of Duties</Label>
                    <textarea 
                      {...register("employment.0.description")} 
                      placeholder="Analyze business processes and prepare reports." 
                      disabled={watch("notEmployed")}
                      rows={3}
                      className="w-full p-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-[#27295B] focus:ring-1 focus:ring-[#27295B] text-slate-800 text-[15px] font-normal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: English Proficiency */}
            {step === 8 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">8. English Proficiency</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Provide your English language test details.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="englishExempt" 
                      {...register("englishTest.exempt")} 
                      className="w-4 h-4 text-[#27295B] border-neutral-300 focus:ring-[#27295B]" 
                    />
                    <Label htmlFor="englishExempt" className="text-neutral-700 font-semibold cursor-pointer">I am exempt from English proficiency requirement</Label>
                  </div>

                  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300", watch("englishTest.exempt") && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Test Type *</Label>
                      <Controller
                        name="englishTest.testName"
                        control={control}
                        defaultValue="IELTS Academic"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={watch("englishTest.exempt")}>
                            <SelectTrigger className="h-12 bg-white border border-neutral-200 text-slate-800 rounded-xl focus:ring-1 focus:ring-[#27295B] focus:border-[#27295B] font-medium">
                              <SelectValue placeholder="Select Test Type" />
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
                      <Label className="text-slate-700 font-semibold text-[13px]">Overall Score *</Label>
                      <Input {...register("englishTest.overallScore")} placeholder="7.0" disabled={watch("englishTest.exempt")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>

                  <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300", watch("englishTest.exempt") && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Exam Date *</Label>
                      <Input type="date" {...register("englishTest.testDate")} disabled={watch("englishTest.exempt")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-[13px]">Test Centre / Location *</Label>
                      <Input {...register("englishTest.location")} placeholder="British Council Singapore" disabled={watch("englishTest.exempt")} className="h-12 bg-white border border-neutral-200 rounded-xl focus-visible:border-[#27295B] focus-visible:ring-1 focus-visible:ring-[#27295B]" />
                    </div>
                  </div>

                  <div className={cn("space-y-2 pt-4 border-t border-neutral-100 transition-opacity duration-300", watch("englishTest.exempt") && "opacity-40 pointer-events-none")}>
                    <Label className="text-slate-700 font-semibold text-[13px]">Upload Test Report *</Label>
                    <div className="flex items-center justify-between border border-neutral-200 bg-white p-4.5 rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <FileText size={18} className="text-red-500" />
                        <span className="text-xs font-bold text-neutral-700">ielts_report.pdf</span>
                      </div>
                      <Button type="button" variant="outline" className="h-9 px-4 border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs font-bold">
                        Browse
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Supporting Documents */}
            {step === 9 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">9. Supporting Documents</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Upload the required documents.</p>
                </div>
                
                <div className="space-y-3.5">
                  {[
                    { label: "Passport / NRIC Copy *", filename: "passport.pdf" },
                    { label: "Academic Transcript(s) *", filename: "transcript.pdf" },
                    { label: "Degree / Certificate *", filename: "degree.pdf" },
                    { label: "CV / Resume *", filename: "resume.pdf" },
                    { label: "English Test Report *", filename: "ielts_report.pdf" },
                    { label: "Passport-size Photo *", filename: "photo.jpg" }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between border border-neutral-200/80 bg-white p-4.5 rounded-xl hover:shadow-3xs transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 border border-neutral-100 flex items-center justify-center text-[#27295B]">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">{doc.label}</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{doc.filename}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100/50">
                          <span className="h-1 w-1 rounded-full bg-emerald-500" />
                          Uploaded
                        </span>
                        <button type="button" className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 10: Review Application */}
            {step === 10 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-800">10. Review Application</h2>
                    <p className="text-neutral-400 mt-1.5 text-sm font-medium">Please review your information before proceeding.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="h-9 px-4 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-lg text-xs font-bold">
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-3xs">
                    <h3 className="font-heading font-bold text-[15px] text-neutral-800 border-b border-neutral-100 pb-3 mb-4">Applicant Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Applicant Type</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{watchApplicantType}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Full Name</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{getValues("personal.firstName")} {getValues("personal.lastName") || ""}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Email</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{getValues("contact.email")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Phone Number</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{getValues("contact.phonePrefix")} {getValues("contact.phone")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Programme</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{selectedProgramme?.name || "Not Selected"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 py-1 border-b border-neutral-50">
                        <span className="text-xs text-neutral-400 font-semibold col-span-1">Intake</span>
                        <span className="text-xs text-neutral-700 font-bold col-span-2">{getValues("intake") || "Not Selected"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: Declaration */}
            {step === 11 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">11. Declaration</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Please read and accept the declaration.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5.5 bg-[#F8FAFC] border border-neutral-200/65 rounded-2xl text-xs leading-relaxed text-neutral-600 font-medium">
                    I hereby declare that all the information provided in this application is true, complete and accurate to the best of my knowledge. I understand that providing false or misleading information may result in the rejection of my application or cancellation of admission at any time.
                  </div>

                  <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-200/50 p-4 rounded-xl mt-4">
                    <input 
                      type="checkbox" 
                      id="declareCheck" 
                      required
                      className="w-4 h-4 text-[#27295B] border-neutral-300 focus:ring-[#27295B]" 
                    />
                    <Label htmlFor="declareCheck" className="text-neutral-700 font-semibold cursor-pointer">I have read, understood and agree to the above declaration.</Label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 12: Payment */}
            {step === 12 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-800">12. Payment</h2>
                  <p className="text-neutral-400 mt-1.5 text-sm font-medium">Complete your application by paying the application fee.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-4">
                    <span className="text-slate-600 font-semibold text-sm">Application Fee</span>
                    <span className="text-xl font-extrabold text-[#27295B]">
                      SGD {selectedProgramme?.applicationFee || "50.00"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">Payment Method</Label>
                    <Controller
                      name="paymentMethod"
                      control={control}
                      defaultValue="card"
                      render={({ field }) => (
                        <div className="flex flex-col gap-2.5 bg-white border border-neutral-200 p-4 rounded-xl">
                          {[
                            { value: "card", label: "Credit / Debit Card" },
                            { value: "paypal", label: "PayPal" },
                            { value: "bank", label: "Bank Transfer" }
                          ].map(method => (
                            <label key={method.value} className="flex items-center gap-3 text-sm text-slate-700 font-semibold cursor-pointer">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={(field.value || "card") === method.value}
                                onChange={() => field.onChange(method.value)}
                                className="w-4 h-4 text-[#27295B] border-neutral-300 focus:ring-[#27295B]"
                              />
                              <span>{method.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex gap-3 bg-[#eef2f6]/70 border border-neutral-100 rounded-xl p-4.5 text-left">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white text-[10px] font-bold font-mono">
                      i
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                        Your application will be submitted after the payment is successful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={isSubmitting}
                className="h-11 px-6 border-neutral-200 text-neutral-600 hover:bg-slate-50 rounded-xl font-bold transition-all duration-300"
              >
                Back
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-8 bg-[#ED1C24] hover:bg-[#D91A20] text-white font-bold gap-2 shadow-xs rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ml-auto"
            >
              {isSubmitting ? "Processing..." : step === 12 ? "Pay & Submit" : "Save & Continue"}
              {!isSubmitting && <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
      </form>
    </div>

    {/* Saved progress check badge at the bottom of form card */}
    <div className="flex items-center justify-center gap-2 bg-[#F8FAFC] border border-neutral-200/50 rounded-2xl py-3.5 px-4 shadow-3xs text-neutral-500 text-xs font-semibold">
      <Check size={14} className="text-emerald-500 bg-emerald-50 rounded-full p-0.5" />
      <span>Your progress is automatically saved. You can exit and continue later.</span>
    </div>
  </div>

    {/* Right Column: Details Panel */}
    <aside className="w-full lg:col-span-3 space-y-6">
      {/* Card 1: Application Progress */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-2xs text-left">
        <h3 className="font-heading font-bold text-[15px] text-neutral-800 mb-3">Application Progress</h3>
        <div className="text-xs font-semibold text-neutral-500 mb-1.5">Step {step} of 12</div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mb-1.5">
          <div 
            className="h-full bg-[#ED1C24] rounded-full transition-all duration-300"
            style={{ width: `${(step / 12) * 100}%` }}
          />
        </div>
        <div className="text-xs font-bold text-neutral-700">{Math.round(((step - 1) / 12) * 100)}% Complete</div>
      </div>

      {/* Card 2: Application Summary */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-2xs text-left">
        <h3 className="font-heading font-bold text-[15px] text-slate-800 border-b border-neutral-100 pb-3 mb-4">Application Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Applicant Type</p>
            <p className="text-xs font-bold text-neutral-700 mt-0.5">{watchApplicantType || "Not Selected"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Programme</p>
            <p className="text-xs font-bold text-neutral-700 mt-0.5">
              {selectedProgramme ? `${selectedProgramme.name} (${selectedProgramme.code})` : "Not Selected"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Intake</p>
            <p className="text-xs font-bold text-neutral-700 mt-0.5 font-sans">
              {watchIntake || "Not Selected"}
            </p>
          </div>
          <div className="border-t border-neutral-100 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Application Fee</p>
            <p className="text-sm font-extrabold text-[#27295B] mt-0.5">
              SGD {selectedProgramme?.applicationFee || "50.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Need Help? */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-2xs text-left">
        <h3 className="font-heading font-bold text-[15px] text-neutral-800 mb-2">Need Help?</h3>
        <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Our admission advisors are available to assist you.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
            <Phone size={14} className="text-[#27295B]" />
            <a href="tel:+6561234567" className="hover:underline">+65 6123 4567</a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-600 font-medium">
            <Mail size={14} className="text-[#27295B]" />
            <a href="mailto:admissions@educare.edu.sg" className="hover:underline">admissions@educare.edu.sg</a>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-neutral-500">
            <Clock size={14} className="text-[#27295B] shrink-0 mt-0.5" />
            <span>Mon - Fri, 9:00 AM - 6:00 PM (SGT)</span>
          </div>
        </div>
      </div>
    </aside>
    
  </div>
</div>
  );
}
