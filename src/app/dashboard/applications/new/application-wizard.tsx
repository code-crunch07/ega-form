"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { 
  Check, ChevronRight, ChevronDown, Upload, Plus, FileText, Globe, MapPin, Building2, 
  UserCircle2, GraduationCap, Briefcase, Languages, FileCheck2, ClipboardCheck, 
  ScrollText, CreditCard, Phone, Mail, Clock, ArrowLeft, AlertCircle, Info, ShieldCheck, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitApplication, calculateApplicationFee } from "@/app/actions/application";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/application-schema";

const SECTIONS = [
  { id: 1, name: "Programme Selection", shortName: "1. Programme", icon: Building2, desc: "Partner, mode & package selection" },
  { id: 2, name: "Personal, Passport & Address", shortName: "2. Personal & Address", icon: UserCircle2, desc: "Identity, guardian & residence" },
  { id: 3, name: "Academic & English Test", shortName: "3. Academic History", icon: GraduationCap, desc: "Qualifications & test scores" },
  { id: 4, name: "Additional Info & Agent", shortName: "4. Additional & Agent", icon: Briefcase, desc: "Declarations, channel & agent" },
  { id: 5, name: "Review & Payment", shortName: "5. Review & Pay", icon: CreditCard, desc: "Review, fee payment & submit" },
];

export default function ApplicationWizard({ 
  user, 
  programmes = [], 
  intakes = [], 
  schools = [] 
}: { 
  user: any, 
  programmes: any[], 
  intakes: any[], 
  schools?: any[] 
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Qualifications state
  const [educationList, setEducationList] = useState<any[]>([
    { id: 1, qualificationTitle: "Bachelor's Degree", institution: "National University of Singapore", schoolAttended: "NUS Business School", specialization: "Business Administration", studyPeriodStart: "2020-08", studyPeriodEnd: "2024-05", modeOfStudy: "Full Time", completionStatus: "Completed", languageOfInstruction: "English" },
  ]);
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);
  const [editingQualId, setEditingQualId] = useState<number | null>(null);
  const [qualForm, setQualForm] = useState<any>({
    country: "Singapore",
    institution: "",
    qualificationTitle: "Bachelor's Degree",
    schoolAttended: "",
    specialization: "",
    studyPeriodStart: "2020-08",
    studyPeriodEnd: "2024-05",
    modeOfStudy: "Full Time",
    completionStatus: "Completed",
    languageOfInstruction: "English",
    dateAwarded: "2024-06-15",
    gpa: "3.8 / 4.0",
    classification: "Pass With Merit"
  });

  const router = useRouter();

  const { register, handleSubmit, control, watch, setValue, getValues, trigger, formState: { errors } } = useForm<any>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantType: "Local Student",
      universityPartner: "Educare Global Academy",
      studyMode: "Full Time",
      courseType: "Standalone Course",
      academicLevel: "Diploma",
      programmeId: "",
      packageProgrammes: { slot1: "", slot2: "", slot3: "" },
      intake: "January 2026",

      counsellingDeclaration: "counselled",

      personal: {
        title: user.profile?.title || "mr",
        fullName: user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : "",
        surname: user.profile?.lastName || ".",
        gender: user.profile?.gender || "male",
        dob: user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : "2002-05-15",
        maritalStatus: "Single",
        nationality: user.profile?.nationality || "Singaporean",
        email: user.email,
        phoneCountryCode: "+65",
        phone: user.profile?.phone || "",
      },

      guardian: {
        isUnder18: false,
        fullName: "",
        email: "",
        countryCode: "+65",
        phone: "",
      },

      passport: {
        passportNumber: user.profile?.passportNumber || "S1234567A",
        countryOfIssue: "Singapore",
        issueDate: "2020-01-01",
        expiryDate: "2030-01-01",
        countryOfBirth: "Singapore",
      },

      overseasAddress: {
        country: "Singapore",
        state: "Singapore",
        city: "Singapore",
        postalCode: "238845",
        addressLine1: user.profile?.address || "123 Orchard Road",
        addressLine2: "",
        unitNo: "#05-01",
      },

      localAddress: {
        country: "Singapore",
        postalCode: "238845",
        addressLine1: "123 Orchard Road",
        addressLine2: "",
        unitNo: "#05-01",
      },

      education: educationList,

      englishTest: {
        hasTakenTest: true,
        testType: "IELTS",
        testDate: "2025-06-10",
        isTentativeDate: false,
      },

      additionalInfo: {
        healthConditions: "NA",
        conductSuspended: false,
        conductConvicted: false,
        marketingChannel: "Online Search (Google / Baidu)",
        marketingOtherText: "",
        referrerName: "",
      },

      agent: {
        isAgentRepresented: false,
        agentCountry: "Singapore",
        agencyName: "",
        counsellorName: "",
        counsellorEmail: "",
      },

      consent: {
        dataProcessingConsent: true,
        partnerConsent: true,
        applicantDeclaration: true,
        marketingConsent: false,
      }
    }
  });

  // Watchers
  const watchPartner = watch("universityPartner") || "Educare Global Academy";
  const watchStudyMode = watch("studyMode") || "Full Time";
  const watchCourseType = watch("courseType") || "Standalone Course";
  const watchAcademicLevel = watch("academicLevel") || "Diploma";
  const watchProgrammeId = watch("programmeId");
  
  const watchDob = watch("personal.dob");
  const watchHasTakenTest = watch("englishTest.hasTakenTest");
  const watchMarketingChannel = watch("additionalInfo.marketingChannel");
  const watchIsAgent = watch("agent.isAgentRepresented");

  // Calculate age for under-18 guardian requirement
  const applicantAge = watchDob ? Math.floor((new Date().getTime() - new Date(watchDob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 22;
  const isUnder18 = applicantAge < 18;

  // Calculate server-aligned fee amount
  const feeAmount = (watchPartner.includes("Glasgow") || watchPartner.includes("Kingston") || watchPartner.includes("NCC")) ? 360 : 160;

  // Filter programmes
  const filteredProgrammes = programmes.filter(p => {
    if (watchAcademicLevel && watchAcademicLevel !== "All Levels") {
      return p.level?.toLowerCase().includes(watchAcademicLevel.toLowerCase()) || p.name?.toLowerCase().includes(watchAcademicLevel.toLowerCase());
    }
    return true;
  });

  useEffect(() => {
    setValue("education", educationList);
  }, [educationList, setValue]);

  const nextStep = async () => {
    if (step < 5) {
      if (step === 1 && watchCourseType === "Standalone Course") {
        const pId = getValues("programmeId");
        if (!pId) {
          setFormError("Please select an Available Programme before continuing.");
          return;
        }
      }

      let fieldsToValidate: string[] = [];
      switch (step) {
        case 1:
          fieldsToValidate = ['universityPartner', 'studyMode', 'courseType', 'intake'];
          break;
        case 2:
          fieldsToValidate = ['personal.fullName', 'personal.surname', 'personal.dob', 'personal.gender', 'personal.maritalStatus', 'passport.passportNumber', 'overseasAddress.country', 'overseasAddress.addressLine1', 'overseasAddress.postalCode'];
          if (isUnder18) {
            fieldsToValidate.push('guardian.fullName', 'guardian.email', 'guardian.phone');
          }
          break;
        case 3:
          fieldsToValidate = [];
          break;
        case 4:
          fieldsToValidate = ['additionalInfo.healthConditions'];
          if (watchIsAgent) {
            fieldsToValidate.push('agent.agencyName', 'agent.counsellorName', 'agent.counsellorEmail');
          }
          break;
      }
      
      const isStepValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
      
      if (isStepValid) {
        setFormError(null);
        setStep((prev) => Math.min(prev + 1, 5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormError("There are incomplete required fields in this section. Please review all fields marked with *.");
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
    
    const declarationCheck = (document.getElementById("declareCheck") as HTMLInputElement)?.checked;
    if (!declarationCheck) {
      setFormError("You must accept the application declaration before submitting.");
      return;
    }

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
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in zoom-in duration-500 font-jost">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-heading">🎉 Application Submitted!</h1>
        <p className="text-lg text-slate-600 mb-8 font-medium">Your application has been received and is now pending review.</p>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full mb-8">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono mb-1">Application Number</p>
          <p className="text-2xl font-mono font-extrabold text-[#3A57E8]">{successAppNumber}</p>
          <div className="h-px bg-slate-100 my-4 w-full" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Application Fee Paid</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">SGD {feeAmount}.00</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="h-11 px-6 rounded-xl font-bold">
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push("/dashboard/applications")} className="h-11 px-6 bg-[#3A57E8] hover:bg-[#2B45D4] text-white rounded-xl font-bold">
            View My Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-left font-jost pb-12">
      
      {/* Error Alert Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{formError}</span>
          </div>
          <button type="button" onClick={() => setFormError(null)} className="text-white/80 hover:text-white text-xs font-mono font-bold ml-4 shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* SINGLE UNIFIED CARD CONTAINER: Clean, Frameless Section Flow without Hard Lines */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-3xl border-none shadow-2xs overflow-hidden">
          
          {/* Header & 5-Step Connected Stepper Track */}
          <div className="p-6 sm:p-8 bg-slate-50/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                  Student Application Form
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Complete the 5 sections below to submit your official application.
                </p>
              </div>

              {/* Progress Badge Pill */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0 shadow-2xs">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Progress</p>
                  <p className="text-xs font-bold text-[#3A57E8]">Step {step} of 5 • {Math.round((step / 5) * 100)}%</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-[#3A57E8] text-white flex items-center justify-center font-bold text-xs font-mono shadow-md shadow-[#3A57E8]/25">
                  {step}/5
                </div>
              </div>
            </div>

            {/* 5-Section Connected Stepper Track */}
            <div className="no-scrollbar overflow-x-auto py-2">
              <div className="flex items-center justify-between min-w-[700px] relative">
                {/* Background Track Line */}
                <div className="absolute left-6 right-6 top-5 h-0.5 bg-slate-200 -z-0" />
                <div 
                  className="absolute left-6 top-5 h-0.5 bg-[#3A57E8] transition-all duration-500 -z-0" 
                  style={{ width: `${((step - 1) / 4) * 94}%` }} 
                />

                {SECTIONS.map((sec) => {
                  const isActive = step === sec.id;
                  const isCompleted = step > sec.id;

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
                      className="flex flex-col items-center group relative z-10 focus:outline-none"
                    >
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 shadow-2xs",
                          isActive 
                            ? "bg-[#3A57E8] text-white ring-4 ring-[#3A57E8]/20 scale-110 shadow-md shadow-[#3A57E8]/30" 
                            : isCompleted
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300"
                        )}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : sec.id}
                      </div>
                      
                      <span className={cn(
                        "text-xs font-bold mt-2 truncate transition-colors",
                        isActive ? "text-[#3A57E8]" : isCompleted ? "text-emerald-950" : "text-slate-500"
                      )}>
                        {sec.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Step Form Content Area */}
          <div className="p-6 sm:p-10 space-y-8 min-h-[500px]">
            
            {/* STEP 1: Programme Selection & Pre-Course Counselling */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-bold text-[#3A57E8] uppercase tracking-wider font-mono bg-[#3A57E8]/8 px-2.5 py-1 rounded-md">
                    Section 1 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">Programme Selection</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Select your university partner, study mode, course type, and target programme.</p>
                </div>

                {/* Sub-section 1: Partner & Mode */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    1. University Partner & Study Mode
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">University Partner *</Label>
                      <Controller
                        name="universityPartner"
                        control={control}
                        defaultValue="Educare Global Academy"
                        render={({ field }) => (
                          <Select onValueChange={(val) => {
                            field.onChange(val);
                            setValue("programmeId", "");
                          }} value={field.value || "Educare Global Academy"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#3A57E8]/15">
                              <SelectValue placeholder="Select University Partner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Educare Global Academy">Educare Global Academy (EGA)</SelectItem>
                              <SelectItem value="Glasgow Caledonian University (UK)">Glasgow Caledonian University (UK)</SelectItem>
                              <SelectItem value="Kingston University (UK)">Kingston University (UK)</SelectItem>
                              <SelectItem value="NCC">NCC Education</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Mode of Study *</Label>
                      <Controller
                        name="studyMode"
                        control={control}
                        defaultValue="Full Time"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "Full Time"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#3A57E8]/15">
                              <SelectValue placeholder="Select Mode of Study" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full Time">Full Time</SelectItem>
                              <SelectItem value="Part Time">Part Time</SelectItem>
                              <SelectItem value="E-Learning">E-Learning</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 2: Course Type & Programme Selection */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    2. Course Type & Target Programme *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: "Standalone Course", title: "Standalone Course", desc: "Single programme selection at your target academic level." },
                      { value: "Package Courses", title: "Package Courses", desc: "Fixed 3-programme package (Foundation → Diploma → Undergraduate)." }
                    ].map(c => {
                      const isSelected = watchCourseType === c.value;
                      return (
                        <label 
                          key={c.value}
                          className={cn(
                            "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 relative overflow-hidden",
                            isSelected 
                              ? "border-[#3A57E8] bg-[#3A57E8]/5 shadow-2xs" 
                              : "border-slate-200 hover:border-[#3A57E8]/30 bg-white"
                          )}
                        >
                          <input
                            type="radio"
                            name="courseType"
                            value={c.value}
                            checked={isSelected}
                            onChange={() => {
                              setValue("courseType", c.value, { shouldValidate: true });
                              setValue("programmeId", "");
                            }}
                            className="mt-1 w-4 h-4 text-[#3A57E8]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{c.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Standalone vs Package Logic */}
                  {watchCourseType === "Standalone Course" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Academic Level *</Label>
                        <Controller
                          name="academicLevel"
                          control={control}
                          defaultValue="Diploma"
                          render={({ field }) => (
                            <Select onValueChange={(val) => {
                              field.onChange(val);
                              setValue("programmeId", "");
                            }} value={field.value || "Diploma"}>
                              <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Preparatory">Preparatory</SelectItem>
                                <SelectItem value="Foundation">Foundation</SelectItem>
                                <SelectItem value="Diploma">Diploma / Advanced / Higher Diploma</SelectItem>
                                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Available Programme *</Label>
                        <Controller
                          name="programmeId"
                          control={control}
                          render={({ field }) => {
                            const selectedProg = programmes.find(p => p.id === field.value);
                            const displayName = selectedProg 
                              ? `${selectedProg.name} (${selectedProg.code})`
                              : field.value === "p1" ? "Diploma in International Hotel and Tourism Management"
                              : field.value === "p2" ? "Diploma in Business Administration"
                              : field.value === "p3" ? "Higher Diploma in Computer Science"
                              : field.value;

                            return (
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium">
                                  <span className="truncate text-left font-semibold">
                                    {field.value ? displayName : <span className="text-slate-400 font-normal">Select Programme</span>}
                                  </span>
                                </SelectTrigger>
                                <SelectContent className="w-[320px] max-w-md">
                                  {filteredProgrammes.length > 0 ? (
                                    filteredProgrammes.map(p => (
                                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                                    ))
                                  ) : (
                                    <>
                                      <SelectItem value="p1">Diploma in International Hotel and Tourism Management</SelectItem>
                                      <SelectItem value="p2">Diploma in Business Administration</SelectItem>
                                      <SelectItem value="p3">Higher Diploma in Computer Science</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            );
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Intake *</Label>
                        <Controller
                          name="intake"
                          control={control}
                          defaultValue="January 2026"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || "January 2026"}>
                              <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium">
                                <SelectValue placeholder="Select Intake" />
                              </SelectTrigger>
                              <SelectContent>
                                {intakes && intakes.length > 0 ? (
                                  intakes.map(i => (
                                    <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>
                                  ))
                                ) : (
                                  <>
                                    <SelectItem value="January 2026">January 2026</SelectItem>
                                    <SelectItem value="April 2026">April 2026</SelectItem>
                                    <SelectItem value="July 2026">July 2026</SelectItem>
                                    <SelectItem value="October 2026">October 2026</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Package Courses: 3 Slots */
                    <div className="space-y-4 pt-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between pb-1">
                        <h4 className="font-heading font-bold text-sm text-slate-900">
                          Package Programme Slots (All 3 Slots Mandatory) *
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#3A57E8] bg-[#3A57E8]/10 px-3 py-1 rounded-full">
                          Fixed 3-Level Pathway
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Slot 1</span>
                            <span className="text-xs font-bold text-[#3A57E8] bg-[#3A57E8]/10 px-2 py-0.5 rounded-md">Foundation Level</span>
                          </div>
                          <Label className="text-slate-800 font-bold text-xs">Foundation Programme *</Label>
                          <Select defaultValue="f1">
                            <SelectTrigger className="h-11 bg-white border border-slate-200 rounded-xl font-medium text-xs">
                              <SelectValue placeholder="Select Foundation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="f1">International Foundation Certificate</SelectItem>
                              <SelectItem value="f2">Foundation Diploma in Higher Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Slot 2</span>
                            <span className="text-xs font-bold text-[#3A57E8] bg-[#3A57E8]/10 px-2 py-0.5 rounded-md">Diploma Family</span>
                          </div>
                          <Label className="text-slate-800 font-bold text-xs">Diploma / Advanced Diploma *</Label>
                          <Select defaultValue="d1">
                            <SelectTrigger className="h-11 bg-white border border-slate-200 rounded-xl font-medium text-xs">
                              <SelectValue placeholder="Select Diploma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="d1">Diploma in International Hotel & Tourism Management</SelectItem>
                              <SelectItem value="d2">Advanced Diploma in Tourism & Hospitality Management</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Slot 3</span>
                            <span className="text-xs font-bold text-[#3A57E8] bg-[#3A57E8]/10 px-2 py-0.5 rounded-md">Undergraduate</span>
                          </div>
                          <Label className="text-slate-800 font-bold text-xs">Undergraduate Degree *</Label>
                          <Select defaultValue="u1">
                            <SelectTrigger className="h-11 bg-white border border-slate-200 rounded-xl font-medium text-xs">
                              <SelectValue placeholder="Select Degree" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="u1">BSc (Hons) International Tourism & Hospitality Management</SelectItem>
                              <SelectItem value="u2">BA (Hons) Business & Management Top-Up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-section 3: Pre-Course Counselling */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    3. Pre-Course Counselling Declaration *
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Confirm you have gathered sufficient information regarding your choice of study at {watchPartner} by selecting your declaration statement below:
                  </p>

                  <Controller
                    name="counsellingDeclaration"
                    control={control}
                    defaultValue="counselled"
                    render={({ field }) => (
                      <div className="space-y-2.5">
                        {[
                          { val: "counselled", label: "I have been counselled by EGA / EGA Appointed Agents regarding this information." },
                          { val: "read_contacted", label: "I have read sufficient information and, where applicable, I have contacted EGA / EGA Appointed Agents for clarification." },
                          { val: "read_self", label: "I have read sufficient information on my own and confirm that I do not require pre-course counselling by EGA / EGA Appointed Agents." }
                        ].map((opt) => (
                          <label key={opt.val} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#3A57E8]/5 border border-[#3A57E8]/15 cursor-pointer hover:border-[#3A57E8]/40 font-medium text-xs text-slate-900 transition-all">
                            <input 
                              type="radio" 
                              name="counsellingDeclaration" 
                              value={opt.val} 
                              checked={field.value === opt.val} 
                              onChange={() => field.onChange(opt.val)} 
                              className="w-4 h-4 text-[#3A57E8]" 
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Section 1 (Personal Particulars) & Section 2 (Citizenship & Address) */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-bold text-[#3A57E8] uppercase tracking-wider font-mono bg-[#3A57E8]/8 px-2.5 py-1 rounded-md">
                    Section 2 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">Personal, Passport & Address Details</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Provide legal identity information, passport data, and official addresses.</p>
                </div>

                {/* Sub-section 1: Personal Particulars */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    1. Personal Particulars *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Title *</Label>
                      <Controller
                        name="personal.title"
                        control={control}
                        defaultValue="mr"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "mr"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mr">Mr.</SelectItem>
                              <SelectItem value="ms">Ms.</SelectItem>
                              <SelectItem value="mrs">Mrs.</SelectItem>
                              <SelectItem value="miss">Miss</SelectItem>
                              <SelectItem value="dr">Dr.</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Full Name (as in NRIC / Passport) *</Label>
                      <Input {...register("personal.fullName")} placeholder="e.g. John Michael Doe" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Surname *</Label>
                      <Input {...register("personal.surname")} placeholder="Enter . if no family name" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
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
                          <div className="flex h-12 items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 text-xs font-semibold text-slate-800">
                            {["male", "female"].map(g => (
                              <label key={g} className="flex items-center gap-1.5 capitalize cursor-pointer">
                                <input type="radio" name="gender" value={g} checked={field.value === g} onChange={() => field.onChange(g)} className="w-4 h-4 text-[#3A57E8]" />
                                <span>{g}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Marital Status *</Label>
                      <Controller
                        name="personal.maritalStatus"
                        control={control}
                        defaultValue="Single"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "Single"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Divorced">Divorced</SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Nationality *</Label>
                      <Input {...register("personal.nationality")} placeholder="e.g. Singaporean" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Email Address (Read Only) *</Label>
                      <Input {...register("personal.email")} type="email" disabled className="h-12 bg-slate-100 text-slate-500 rounded-xl font-medium" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Contact Number *</Label>
                      <div className="flex gap-2">
                        <Input {...register("personal.phoneCountryCode")} placeholder="+65" className="w-20 h-12 rounded-xl text-center shrink-0 font-mono font-semibold" />
                        <Input {...register("personal.phone")} placeholder="9123 4567" className="flex-1 h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-section 2: Under-18 Guardian (Conditional) */}
                {isUnder18 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between pb-1">
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        2. Parent / Legal Guardian Details *
                      </h3>
                      <span className="text-xs font-mono font-bold text-[#3A57E8] bg-[#3A57E8]/10 px-3 py-1 rounded-full">
                        Required (Age: {applicantAge} Years)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Guardian Full Name (as in ID) *</Label>
                        <Input {...register("guardian.fullName")} placeholder="e.g. Robert Doe" className="h-12 bg-white rounded-xl" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Guardian Email Address *</Label>
                        <Input {...register("guardian.email")} type="email" placeholder="e.g. guardian@example.com" className="h-12 bg-white rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label className="text-slate-700 font-semibold text-xs">Guardian Contact Number *</Label>
                      <div className="flex gap-2">
                        <Input {...register("guardian.countryCode")} placeholder="+65" className="w-20 h-12 bg-white rounded-xl text-center font-mono font-semibold" />
                        <Input {...register("guardian.phone")} placeholder="9224 5678" className="flex-1 h-12 bg-white rounded-xl" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-section 3: Passport & Citizenship */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    3. Passport & Citizenship Details *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Number *</Label>
                      <Input {...register("passport.passportNumber")} placeholder="e.g. S1234567A" className="h-12 rounded-xl font-mono uppercase" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Country of Issue *</Label>
                      <Input {...register("passport.countryOfIssue")} placeholder="e.g. Singapore" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Country of Birth *</Label>
                      <Input {...register("passport.countryOfBirth")} placeholder="e.g. Singapore" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Issue Date</Label>
                      <Input type="date" {...register("passport.issueDate")} className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Expiry Date</Label>
                      <Input type="date" {...register("passport.expiryDate")} className="h-12 rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Sub-section 4: Overseas & Permanent Address */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    4. Overseas & Permanent Address *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Country *</Label>
                      <Input {...register("overseasAddress.country")} placeholder="Singapore" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">State / Region</Label>
                      <Input {...register("overseasAddress.state")} placeholder="Singapore" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">City</Label>
                      <Input {...register("overseasAddress.city")} placeholder="Singapore" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Address Line 1 *</Label>
                      <Input {...register("overseasAddress.addressLine1")} placeholder="123 Orchard Road" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Unit No.</Label>
                      <Input {...register("overseasAddress.unitNo")} placeholder="#05-01" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Postal Code *</Label>
                      <Input {...register("overseasAddress.postalCode")} placeholder="238845" className="h-12 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Academic Background & English Proficiency */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-bold text-[#3A57E8] uppercase tracking-wider font-mono bg-[#3A57E8]/8 px-2.5 py-1 rounded-md">
                    Section 3 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">Academic Background & English Proficiency</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">List academic qualifications and English language proficiency details.</p>
                </div>

                {/* Sub-section 1: Qualifications */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-1">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      1. Academic Qualifications
                    </h3>
                    <Button 
                      type="button" 
                      onClick={() => {
                        setEditingQualId(null);
                        setQualForm({
                          country: "Singapore",
                          institution: "",
                          qualificationTitle: "Bachelor's Degree",
                          schoolAttended: "",
                          specialization: "",
                          studyPeriodStart: "2020-08",
                          studyPeriodEnd: "2024-05",
                          modeOfStudy: "Full Time",
                          completionStatus: "Completed",
                          languageOfInstruction: "English",
                          dateAwarded: "2024-06-15",
                          gpa: "3.8 / 4.0",
                          classification: "Pass With Merit"
                        });
                        setIsQualModalOpen(true);
                      }}
                      className="h-9 px-4 bg-[#3A57E8] hover:bg-[#2B45D4] text-white rounded-xl font-bold text-xs"
                    >
                      + Add Qualification
                    </Button>
                  </div>

                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                          <th className="px-5 py-3.5">Qualification</th>
                          <th className="px-5 py-3.5">Awarding Institution</th>
                          <th className="px-5 py-3.5">Specialization</th>
                          <th className="px-5 py-3.5">Period</th>
                          <th className="px-5 py-3.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {educationList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 text-slate-700 font-medium">
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {item.qualificationTitle}
                              <span className="block text-[10px] text-slate-400 font-normal">{item.country || "Singapore"} • {item.modeOfStudy || "Full Time"}</span>
                            </td>
                            <td className="px-5 py-3.5">{item.institution}</td>
                            <td className="px-5 py-3.5">{item.specialization || "General"}</td>
                            <td className="px-5 py-3.5 font-mono text-[11px]">{item.studyPeriodStart} to {item.studyPeriodEnd}</td>
                            <td className="px-5 py-3.5 text-center">
                              <button 
                                type="button"
                                onClick={() => {
                                  setEducationList(educationList.filter(el => el.id !== item.id));
                                }}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 font-bold transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-section 2: English Test */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    2. English Language Proficiency Test
                  </h3>
                  <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="hasTakenTest" 
                      {...register("englishTest.hasTakenTest")} 
                      className="w-4 h-4 text-[#3A57E8] border-slate-300 rounded focus:ring-[#3A57E8]" 
                    />
                    <Label htmlFor="hasTakenTest" className="text-slate-800 font-semibold cursor-pointer text-xs sm:text-sm">
                      I have taken (or registered for) a formal English Language Proficiency Test
                    </Label>
                  </div>

                  <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 transition-opacity duration-300", !watchHasTakenTest && "opacity-40 pointer-events-none")}>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Test Type</Label>
                      <Controller
                        name="englishTest.testType"
                        control={control}
                        defaultValue="IELTS"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "IELTS"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                              <SelectValue placeholder="Select Test" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IELTS">IELTS Academic</SelectItem>
                              <SelectItem value="TOEFL">TOEFL iBT</SelectItem>
                              <SelectItem value="PTE">PTE Academic</SelectItem>
                              <SelectItem value="Duolingo">Duolingo English Test</SelectItem>
                              <SelectItem value="Other">Other Test</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Test Date (Actual or Tentative)</Label>
                      <Input type="date" {...register("englishTest.testDate")} className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2 flex flex-col justify-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700">
                        <input type="checkbox" {...register("englishTest.isTentativeDate")} className="w-4 h-4 text-[#3A57E8]" />
                        <span>This is a tentative / upcoming test date</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Additional Information & Agent Contact */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-bold text-[#3A57E8] uppercase tracking-wider font-mono bg-[#3A57E8]/8 px-2.5 py-1 rounded-md">
                    Section 4 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">Additional Information & Agent Contact</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Health conditions, conduct declarations, marketing channel, and agent details.</p>
                </div>

                {/* Sub-section 1: Health Conditions */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    1. Health Conditions & Learning Needs *
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Describe any physical/mental health conditions or learning support requirements. If none, enter NA.</p>
                  <textarea 
                    {...register("additionalInfo.healthConditions")} 
                    rows={3} 
                    className="w-full p-4 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#3A57E8]/20" 
                    placeholder="Enter NA if not applicable"
                  />
                </div>

                {/* Sub-section 2: Conduct Declarations */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    2. Conduct Declarations *
                  </h3>
                  <div className="space-y-4 text-xs font-medium text-slate-800">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="flex-1">Have you ever been suspended, excluded and/or expelled from a course at a university or educational institution?</p>
                      <div className="flex items-center gap-4 shrink-0 font-bold">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="yes" {...register("additionalInfo.conductSuspended")} className="w-4 h-4 text-[#3A57E8]" /> Yes
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="no" defaultChecked {...register("additionalInfo.conductSuspended")} className="w-4 h-4 text-[#3A57E8]" /> No
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="flex-1">Have you ever been arrested, charged in court, or convicted of an offence in any country?</p>
                      <div className="flex items-center gap-4 shrink-0 font-bold">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="yes" {...register("additionalInfo.conductConvicted")} className="w-4 h-4 text-[#3A57E8]" /> Yes
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="no" defaultChecked {...register("additionalInfo.conductConvicted")} className="w-4 h-4 text-[#3A57E8]" /> No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-section 3: Marketing Channel */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    3. How did you hear about EGA? *
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "EGA Website", "Print Advertising", "Online Advertising", 
                        "Out-of-Home Advertising", "EGA Open House", "School Education Fair", 
                        "Exhibition", "EGA Seminar", "Recruitment Agents", 
                        "Recommendations by others", "Website: E-learning", "Referred by EGA Student/Alumni", "Other"
                      ].map((ch) => (
                        <label key={ch} className={cn(
                          "p-3 rounded-xl border flex items-center gap-2 cursor-pointer text-xs font-semibold transition-all",
                          watchMarketingChannel === ch ? "border-[#3A57E8] bg-[#3A57E8]/5 text-[#3A57E8]" : "border-slate-200 hover:border-slate-300"
                        )}>
                          <input 
                            type="radio" 
                            name="marketingChannel" 
                            value={ch} 
                            checked={watchMarketingChannel === ch} 
                            onChange={() => setValue("additionalInfo.marketingChannel", ch)} 
                            className="w-4 h-4 text-[#3A57E8]" 
                          />
                          <span>{ch}</span>
                        </label>
                      ))}
                    </div>

                    {watchMarketingChannel === "Other" && (
                      <div className="pt-2">
                        <Label className="text-slate-700 font-semibold text-xs">Specify Other Channel *</Label>
                        <Input {...register("additionalInfo.marketingOtherText")} placeholder="Please describe" className="h-11 rounded-xl mt-1" />
                      </div>
                    )}
                    {watchMarketingChannel === "Referred by EGA Student/Alumni" && (
                      <div className="pt-2">
                        <Label className="text-slate-700 font-semibold text-xs">Referrer Name / Student ID *</Label>
                        <Input {...register("additionalInfo.referrerName")} placeholder="Enter Referrer Full Name" className="h-11 rounded-xl mt-1" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-section 4: Agent Details */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    4. EGA Appointed Agent Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <input 
                        type="checkbox" 
                        id="isAgentRepresented" 
                        {...register("agent.isAgentRepresented")} 
                        className="w-4 h-4 text-[#3A57E8] border-slate-300 rounded focus:ring-[#3A57E8]" 
                      />
                      <Label htmlFor="isAgentRepresented" className="text-slate-800 font-semibold cursor-pointer text-xs sm:text-sm">
                        Are you being represented by an EGA appointed agent for this application?
                      </Label>
                    </div>

                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 transition-opacity duration-300", !watchIsAgent && "opacity-40 pointer-events-none")}>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Agent Country *</Label>
                        <Controller
                          name="agent.agentCountry"
                          control={control}
                          defaultValue="Singapore"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || "Singapore"} disabled={!watchIsAgent}>
                              <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Singapore">Singapore</SelectItem>
                                <SelectItem value="Malaysia">Malaysia</SelectItem>
                                <SelectItem value="Indonesia">Indonesia</SelectItem>
                                <SelectItem value="China">China</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="Vietnam">Vietnam</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Agency Name *</Label>
                        <Input {...register("agent.agencyName")} placeholder="e.g. Global Education Agency" disabled={!watchIsAgent} className="h-12 rounded-xl" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Counsellor Name *</Label>
                        <Input {...register("agent.counsellorName")} placeholder="e.g. Jane Smith" disabled={!watchIsAgent} className="h-12 rounded-xl" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Counsellor Email *</Label>
                        <Input {...register("agent.counsellorEmail")} type="email" placeholder="e.g. counsellor@agency.com" disabled={!watchIsAgent} className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review, Declaration & Application Fee Payment */}
            {step === 5 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] font-bold text-[#3A57E8] uppercase tracking-wider font-mono bg-[#3A57E8]/8 px-2.5 py-1 rounded-md">
                    Section 5 of 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-heading">Review, Declaration & Fee Payment</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">Review your application summary, accept mandatory consents, and complete application fee payment.</p>
                </div>

                {/* Summary Cards */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    1. Application Overview Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">Programme Selection</h4>
                        <Button type="button" variant="ghost" onClick={() => setStep(1)} className="h-7 px-2 text-xs font-bold text-[#3A57E8]">Edit</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium">Partner:</span> <span className="font-bold text-slate-800">{watchPartner}</span></div>
                        <div><span className="text-slate-400 font-medium">Study Mode:</span> <span className="font-bold text-slate-800">{watchStudyMode}</span></div>
                        <div><span className="text-slate-400 font-medium">Course Type:</span> <span className="font-bold text-slate-800">{watchCourseType}</span></div>
                        <div><span className="text-slate-400 font-medium">Intake:</span> <span className="font-bold text-slate-800">{getValues("intake")}</span></div>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">Personal & Passport Details</h4>
                        <Button type="button" variant="ghost" onClick={() => setStep(2)} className="h-7 px-2 text-xs font-bold text-[#3A57E8]">Edit</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium">Full Name:</span> <span className="font-bold text-slate-800">{getValues("personal.fullName")}</span></div>
                        <div><span className="text-slate-400 font-medium">Passport:</span> <span className="font-bold text-slate-800">{getValues("passport.passportNumber")}</span></div>
                        <div><span className="text-slate-400 font-medium">DOB:</span> <span className="font-bold text-slate-800">{getValues("personal.dob")}</span></div>
                        <div><span className="text-slate-400 font-medium">Phone:</span> <span className="font-bold text-slate-800">{getValues("personal.phone")}</span></div>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">Additional Info & Agent Details</h4>
                        <Button type="button" variant="ghost" onClick={() => setStep(4)} className="h-7 px-2 text-xs font-bold text-[#3A57E8]">Edit</Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium">Marketing Channel:</span> <span className="font-bold text-slate-800">{watchMarketingChannel || "N/A"}</span></div>
                        <div><span className="text-slate-400 font-medium">Agent Represented:</span> <span className="font-bold text-slate-800">{watchIsAgent ? getValues("agent.agencyName") : "No Agent"}</span></div>
                        {watchIsAgent && (
                          <div><span className="text-slate-400 font-medium">Counsellor:</span> <span className="font-bold text-slate-800">{getValues("agent.counsellorName")}</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declarations & Consents */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    2. Declarations & Mandatory Consents *
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed font-medium">
                      I hereby declare that all information provided in this Educare Global Academy application form is complete, true, and correct. I understand that any false statement or omission may lead to rejection of admission or cancellation of enrollment.
                    </div>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 bg-white border border-slate-200 p-4 rounded-xl cursor-pointer">
                        <input type="checkbox" id="declareCheck" required className="w-4 h-4 text-[#3A57E8] border-slate-300 rounded focus:ring-[#3A57E8]" />
                        <span className="text-slate-900 font-bold text-xs sm:text-sm">
                          I accept the data processing consent and applicant declaration *
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 bg-slate-50 border border-slate-200 p-4 rounded-xl cursor-pointer">
                        <input type="checkbox" {...register("consent.marketingConsent")} className="w-4 h-4 text-[#3A57E8] border-slate-300 rounded focus:ring-[#3A57E8]" />
                        <span className="text-slate-700 font-medium text-xs">
                          (Optional) I consent to receiving educational updates, promotional communications, and event news from EGA via email/SMS.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    3. Application Fee Payment Summary *
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#3A57E8]/5 p-5 rounded-2xl border border-[#3A57E8]/20">
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900">Application Fee Summary</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Partner Rule: {watchPartner.includes("Glasgow") || watchPartner.includes("Kingston") || watchPartner.includes("NCC") ? "Partner University Fee (SGD 360)" : "EGA Course Fee (SGD 160)"}
                        </p>
                      </div>
                      <span className="text-2xl font-mono font-extrabold text-[#3A57E8]">SGD {feeAmount}.00</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { value: "card", label: "Credit / Debit Card" },
                        { value: "paypal", label: "PayPal" },
                        { value: "bank", label: "Bank Transfer" }
                      ].map(m => (
                        <label key={m.value} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-[#3A57E8]/40 font-semibold text-xs text-slate-800">
                          <input type="radio" name="paymentMethod" value={m.value} defaultChecked={m.value === "card"} className="w-4 h-4 text-[#3A57E8]" />
                          <span>{m.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
              className="h-12 px-6 border-slate-200 text-slate-700 rounded-xl font-bold gap-2 bg-white hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="h-12 px-8 bg-[#3A57E8] hover:bg-[#2B45D4] text-white rounded-xl font-bold gap-2 shadow-md shadow-[#3A57E8]/25 hover:shadow-lg transition-all"
            >
              Continue to {SECTIONS.find(s => s.id === step + 1)?.shortName || "Next"} &gt;
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-[#3A57E8] hover:bg-[#2B45D4] text-white rounded-xl font-bold gap-2 shadow-md shadow-[#3A57E8]/25 hover:shadow-lg transition-all"
            >
              {isSubmitting ? "Processing..." : `Pay SGD ${feeAmount}.00 & Submit`}
            </Button>
          )}
        </div>
      </form>

      {/* Qualification Modal */}
      {isQualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-left border border-slate-200 font-jost">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Add Academic Qualification</h3>
              <button type="button" onClick={() => setIsQualModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Qualification Title *</Label>
                <Input value={qualForm.qualificationTitle} onChange={e => setQualForm({...qualForm, qualificationTitle: e.target.value})} placeholder="e.g. Diploma in Business" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Awarding Institution *</Label>
                <Input value={qualForm.institution} onChange={e => setQualForm({...qualForm, institution: e.target.value})} placeholder="e.g. Singapore Polytechnic" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Country *</Label>
                <Input value={qualForm.country} onChange={e => setQualForm({...qualForm, country: e.target.value})} placeholder="Singapore" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Specialization</Label>
                <Input value={qualForm.specialization} onChange={e => setQualForm({...qualForm, specialization: e.target.value})} placeholder="e.g. Business Administration" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsQualModalOpen(false)} className="h-10 px-5 rounded-xl font-bold">Cancel</Button>
              <Button 
                type="button" 
                className="h-10 px-6 bg-[#3A57E8] hover:bg-[#2B45D4] text-white rounded-xl font-bold"
                onClick={() => {
                  if (qualForm.qualificationTitle && qualForm.institution) {
                    setEducationList([...educationList, { ...qualForm, id: Date.now() }]);
                    setIsQualModalOpen(false);
                  } else {
                    alert("Please enter Qualification Title and Institution.");
                  }
                }}
              >
                Save Qualification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
