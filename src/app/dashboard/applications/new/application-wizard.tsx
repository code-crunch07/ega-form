"use client";

import { useState, useEffect, useRef, useMemo, ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { 
  Check, ChevronRight, ChevronDown, Upload, Plus, FileText, Globe, MapPin, Building2, 
  UserCircle2, GraduationCap, Briefcase, Languages, FileCheck2, ClipboardCheck, 
  ScrollText, CreditCard, Phone, Mail, Clock, ArrowLeft, AlertCircle, Info, ShieldCheck, Sparkles,
  PenTool, Trash2, RefreshCw, QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableCountrySelect } from "@/components/ui/searchable-country-select";
import { SearchableProgrammeSelect } from "@/components/ui/searchable-programme-select";
import { submitApplication, calculateApplicationFee } from "@/app/actions/application";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema } from "@/lib/application-schema";

const SECTIONS = [
  { id: 1, name: "Programme Selection", shortName: "1. Programme", icon: Building2, desc: "Student type, partner & package pathway" },
  { id: 2, name: "Personal, Passport & Address", shortName: "2. Personal & Address", icon: UserCircle2, desc: "Particulars, emergency contact & address" },
  { id: 3, name: "Academic & English Test", shortName: "3. Academic History", icon: GraduationCap, desc: "Qualifications & test scores" },
  { id: 4, name: "Additional Info & Agent", shortName: "4. Additional & Agent", icon: Briefcase, desc: "Health, conduct, marketing & agent" },
  { id: 5, name: "Review, Signature & Pay", shortName: "5. Signature & Pay", icon: CreditCard, desc: "Native signature, payment & submit" },
];

function FormAccordion({
  title,
  defaultOpen = true,
  badgeText,
  actionButton,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badgeText?: string;
  actionButton?: ReactNode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      "border border-slate-200/90 rounded-2xl bg-white shadow-2xs transition-all duration-200 hover:border-slate-300 relative",
      !isOpen && "overflow-hidden"
    )}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "bg-white hover:bg-slate-50/80 px-6 py-4.5 flex items-center justify-between transition-colors text-left select-none cursor-pointer border-b border-slate-100",
          isOpen ? "rounded-t-2xl" : "rounded-2xl"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-slate-900 text-base sm:text-lg">
            {title}
          </span>
          {badgeText && (
            <span className="text-[11px] font-bold font-mono text-[#252D65] bg-[#252D65]/10 px-2.5 py-0.5 rounded-md hidden sm:inline-block">
              {badgeText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {actionButton && (
            <div onClick={(e) => e.stopPropagation()}>{actionButton}</div>
          )}
          <div className={cn("h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300", isOpen && "rotate-180 bg-[#252D65]/10 text-[#252D65]")}>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 rounded-b-2xl">
          {children}
        </div>
      )}
    </div>
  );
}

const normalizeTitle = (val?: string | null) => {
  if (!val) return "Mr.";
  const lower = val.toLowerCase().trim();
  if (lower === "mr" || lower === "mr.") return "Mr.";
  if (lower === "ms" || lower === "ms.") return "Ms.";
  if (lower === "mrs" || lower === "mrs.") return "Mrs.";
  if (lower === "miss") return "Miss";
  if (lower === "dr" || lower === "dr.") return "Dr.";
  if (lower === "other") return "Other";
  return val;
};

const COHORT_MAP: Record<string, string> = {
  "16 Nov 2026": "November 2026 Intake",
  "11 Jan 2027": "January 2027 Intake",
  "15 Feb 2027": "February 2027 Intake",
  "15 Mar 2027": "March 2027 Intake",
  "10 May 2027": "May 2027 Intake",
  "12 Jul 2027": "July 2027 Intake",
  "10 Aug 2027": "August 2027 Intake",
  "06 Sep 2027": "September 2027 Intake",
  "6-Sep-27": "September 2027 Intake",
  "15 Nov 2027": "November 2027 Intake",
  "14 Sep 2026": "September 2026 Intake",
  "05 Oct 2026": "October 2026 Intake",
  "5-Oct-26": "October 2026 Intake",
};

const INTAKE_DATE_MAP: Record<string, string> = {
  "16-Nov-26": "16 Nov 2026",
  "11-Jan-27": "11 Jan 2027",
  "15-Feb-27": "15 Feb 2027",
  "15-Mar-27": "15 Mar 2027",
  "10-May-27": "10 May 2027",
  "12-Jul-27": "12 Jul 2027",
  "10-Aug-27": "10 Aug 2027",
  "6-Sep-27": "06 Sep 2027",
  "15-Nov-27": "15 Nov 2027",
  "14-Sep-26": "14 Sep 2026",
  "5-Oct-26": "05 Oct 2026",
  "November 2026": "16 Nov 2026",
  "January 2027": "11 Jan 2027",
  "February 2027": "15 Feb 2027",
  "March 2027": "15 Mar 2027",
  "May 2027": "10 May 2027",
  "July 2027": "12 Jul 2027",
  "August 2027": "10 Aug 2027",
  "September 2027": "06 Sep 2027",
  "September 2026": "14 Sep 2026",
  "October 2026": "05 Oct 2026",
};

function parseProgrammeIntakes(intakesStr?: string | null): { value: string; label: string }[] {
  if (!intakesStr || !intakesStr.trim()) return [];
  const parts = intakesStr.split(/[;,|]/).map(s => s.trim()).filter(Boolean);
  return parts.map(raw => {
    const formatted = INTAKE_DATE_MAP[raw] || raw;
    const cohort = COHORT_MAP[formatted] || COHORT_MAP[raw] || "";
    return {
      value: formatted,
      label: cohort ? `${formatted} (${cohort})` : formatted
    };
  });
}

function getFallbackIntakes(partner?: string, level?: string, progName?: string): { value: string; label: string }[] {
  const pLower = (partner || "").toLowerCase();
  const lLower = (level || "").toLowerCase();
  const nLower = (progName || "").toLowerCase();

  if (pLower.includes("glasgow") || pLower.includes("gcu")) {
    return [{ value: "14 Sep 2026", label: "14 Sep 2026 (September 2026 Intake)" }];
  }
  if (pLower.includes("kingston") || pLower.includes("ku")) {
    return [{ value: "05 Oct 2026", label: "05 Oct 2026 (October 2026 Intake)" }];
  }
  if (pLower.includes("ncc")) {
    return [{ value: "16 Nov 2026", label: "16 Nov 2026 (November 2026 Intake)" }];
  }

  // EGA Culinary / Bakery or Foundation / Preparatory:
  if (nLower.includes("culinary") || nLower.includes("pastry") || nLower.includes("bakery") || lLower.includes("foundation") || lLower.includes("preparatory")) {
    return [
      { value: "16 Nov 2026", label: "16 Nov 2026 (November 2026 Intake)" },
      { value: "15 Feb 2027", label: "15 Feb 2027 (February 2027 Intake)" },
      { value: "10 May 2027", label: "10 May 2027 (May 2027 Intake)" },
      { value: "10 Aug 2027", label: "10 Aug 2027 (August 2027 Intake)" },
      { value: "15 Nov 2027", label: "15 Nov 2027 (November 2027 Intake)" },
    ];
  }

  // EGA Postgraduate:
  if (lLower.includes("postgraduate") || lLower.includes("master")) {
    return [{ value: "16 Nov 2026", label: "16 Nov 2026 (November 2026 Intake)" }];
  }

  // Standard EGA Diplomas (Business, AI, Computing, Accounting, Tourism, etc.):
  return [
    { value: "16 Nov 2026", label: "16 Nov 2026 (November 2026 Intake)" },
    { value: "11 Jan 2027", label: "11 Jan 2027 (January 2027 Intake)" },
    { value: "15 Mar 2027", label: "15 Mar 2027 (March 2027 Intake)" },
    { value: "10 May 2027", label: "10 May 2027 (May 2027 Intake)" },
    { value: "12 Jul 2027", label: "12 Jul 2027 (July 2027 Intake)" },
    { value: "06 Sep 2027", label: "06 Sep 2027 (September 2027 Intake)" },
    { value: "15 Nov 2027", label: "15 Nov 2027 (November 2027 Intake)" },
  ];
}

function matchesLevel(prog: any, selectedLevel?: string): boolean {
  if (!selectedLevel || selectedLevel === "All Levels") return true;
  const pL = (prog.level || "").toLowerCase().trim();
  const sL = selectedLevel.toLowerCase().trim();

  if (sL === "preparatory") {
    return pL === "preparatory";
  }
  if (sL === "foundation") {
    return pL === "foundation";
  }
  if (sL === "diploma") {
    const progName = (prog.name || "").toLowerCase();
    return pL === "diploma" && !progName.includes("foundation diploma") && !progName.includes("postgraduate diploma");
  }
  if (sL === "undergraduate") {
    return pL === "undergraduate";
  }
  if (sL === "postgraduate") {
    return pL === "postgraduate";
  }

  return pL.includes(sL);
}

function getPartnerDeclarationText(partnerName: string): string {
  const p = (partnerName || "").toLowerCase();
  if (p.includes("glasgow") || p.includes("gcu")) {
    return "I acknowledge that this programme is awarded by Glasgow Caledonian University (GCU, United Kingdom) and delivered at EGA. I agree to abide by all GCU academic regulations, disciplinary policies, and student terms.";
  }
  if (p.includes("kingston") || p.includes("ku")) {
    return "I acknowledge that this programme is awarded by Kingston University (KU, United Kingdom) and delivered at EGA. I agree to abide by all Kingston University academic regulations, assessment guidelines, and student terms.";
  }
  if (p.includes("ncc")) {
    return "I acknowledge that this qualification is awarded by NCC Education (United Kingdom) and delivered at EGA. I agree to adhere to NCC Education assessment standards, academic regulations, and quality requirements.";
  }
  return "I agree to comply with all rules, regulations, student code of conduct, attendance policies, and academic directives established by Educare Global Academy (EGA).";
}

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

  // CR-07 Qualifications state: Retain only 3 fields (Country, Awarding Institution, Qualification Title/Level)
  const [educationList, setEducationList] = useState<any[]>([]);
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);
  const [isKeyPointsModalOpen, setIsKeyPointsModalOpen] = useState(false);
  const [qualForm, setQualForm] = useState<any>({
    country: "Singapore",
    institution: "",
    qualificationTitle: "",
  });

  // CR-11 Education Certificate Uploads (Multiple attachments allowed)
  const [certFiles, setCertFiles] = useState<{ id: string; name: string; size: string }[]>([]);

  // CR-12 Native Applicant Signature Pad state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  // CR-10 PayNow SGQR & Flywire Modal state (F-073)
  const [isPayNowModalOpen, setIsPayNowModalOpen] = useState(false);
  const [isFlywireModalOpen, setIsFlywireModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paynow" | "flywire">("paynow");
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  const router = useRouter();

  const { register, handleSubmit, control, watch, setValue, getValues, trigger, formState: { errors } } = useForm<any>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentType: "", // CR-02 Mandatory Student Type (no default)
      universityPartner: "Educare Global Academy",
      studyMode: "Full Time",
      courseType: "Standalone Course",
      academicLevel: "Diploma",
      programmeId: "",
      packageProgrammes: {
        prog1Level: "Foundation",
        prog1Id: "",
        prog2Level: "Diploma / Advanced Diploma / Higher Diploma",
        prog2Id: "",
        prog3Level: "Undergraduate",
        prog3Id: "",
      },
      intake: "16 Nov 2026",

      counsellingDeclaration: "", // Mandatory choice (no default)

      personal: {
        title: normalizeTitle(user.profile?.title) || "Mr.",
        fullName: user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : "",
        surname: user.profile?.lastName || "",
        dob: user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : "",
        gender: user.profile?.gender || "male",
        maritalStatus: "Single",
        nationality: user.profile?.nationality || "",
        email: user.email || "",
        phoneCountryCode: "+65",
        phone: user.profile?.phone || "",
      },

      emergencyContact: {
        contactType: "Parent / Legal Guardian",
        fullName: "",
        countryCode: "+65",
        phone: "",
        email: "",
        relation: "",
      },

      guardian: {
        isUnder18: false,
        isSameAsEmergency: false,
        fullName: "",
        email: "",
        countryCode: "+65",
        phone: "",
        relation: "",
      },

      passport: {
        passportNumber: user.profile?.passportNumber || "",
        countryOfIssue: "",
        issueDate: "",
        expiryDate: "",
        countryOfBirth: "",
      },

      address: {
        country: "",
        state: "",
        city: "",
        postalCode: "",
        addressLine1: user.profile?.address || "",
        addressLine2: "",
        unitNo: "",
      },

      education: [],

      englishTest: {
        hasTakenTest: false,
        testType: "",
        testDate: "",
        isTentativeDate: false,
      },

      additionalInfo: {
        healthConditions: "NA",
        conductSuspended: false,
        conductConvicted: false,
        marketingChannel: "",
      },

      agent: {
        isAgentRepresented: false,
        agentCountry: "",
        agencyName: "",
        counsellorName: "",
        counsellorEmail: "",
      },

      consent: {
        dataProcessingConsent: true,
        partnerConsent: true,
        applicantDeclaration: true,
        marketingConsent: false,
      },

      digitalSignature: "",
    }
  });

  // Watchers
  const watchStudentType = watch("studentType");
  const watchPartner = watch("universityPartner") || "Educare Global Academy";
  const watchStudyMode = watch("studyMode") || "Full Time";
  const watchCourseType = watch("courseType") || "Standalone Course";
  const watchAcademicLevel = watch("academicLevel") || "Diploma";
  const watchProgrammeId = watch("programmeId");
  
  // Dynamic Package Course Watchers (CR-13)
  const watchProg1Level = watch("packageProgrammes.prog1Level") || "Foundation";

  const watchDob = watch("personal.dob");
  const watchHasTakenTest = watch("englishTest.hasTakenTest");
  const watchMarketingChannel = watch("additionalInfo.marketingChannel");
  const watchIsAgent = watch("agent.isAgentRepresented");
  const watchIsSameAsEmergency = watch("guardian.isSameAsEmergency");
  // Calculate exact calendar age for under-18 guardian requirement (CR-05)
  const applicantAge = useMemo(() => {
    if (!watchDob) return null;
    const dobDate = new Date(watchDob);
    if (isNaN(dobDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  }, [watchDob]);

  const isUnder18 = applicantAge !== null && applicantAge < 18;

  // Sync DOB age calculation to guardian.isUnder18
  useEffect(() => {
    setValue("guardian.isUnder18", isUnder18);
  }, [isUnder18, setValue]);

  // Autosave draft application to localStorage (F-093, QA-25)
  const formValues = watch();
  useEffect(() => {
    if (typeof window !== "undefined" && !successAppNumber) {
      try {
        const draft = {
          step,
          formData: formValues,
          educationList,
          certFiles,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("ega_application_draft", JSON.stringify(draft));
      } catch (e) {
        // quota exceeded or storage disabled
      }
    }
  }, [formValues, step, educationList, certFiles, successAppNumber]);

  // Restore draft on initial load if present (QA-25)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedRaw = localStorage.getItem("ega_application_draft");
        if (savedRaw) {
          const draft = JSON.parse(savedRaw);
          if (draft && draft.formData && Object.keys(draft.formData).length > 0) {
            if (Array.isArray(draft.educationList) && draft.educationList.length > 0) {
              setEducationList(draft.educationList);
            }
            if (Array.isArray(draft.certFiles) && draft.certFiles.length > 0) {
              setCertFiles(draft.certFiles);
            }
            if (draft.step && draft.step > 1) {
              setStep(draft.step);
            }
            Object.entries(draft.formData).forEach(([key, val]) => {
              if (val !== undefined && val !== null && val !== "") {
                setValue(key as any, val);
              }
            });
            setIsDraftRestored(true);
          }
        }
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Unsaved changes warning before tab close or refresh (F-094)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!successAppNumber && (educationList.length > 0 || getValues("personal.fullName"))) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes in your application.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [successAppNumber, educationList, getValues]);

  // CR-09 Application Fee Calculation (EGA = SGD 160, NCC/GCU/KU = SGD 320)
  const feeAmount = (watchPartner.includes("Glasgow") || watchPartner.includes("Kingston") || watchPartner.includes("NCC")) ? 320 : 160;

  // Filter programmes for Standalone Course
  const filteredProgrammes = useMemo(() => {
    // 1. Strict filter by selected academic level
    const levelFiltered = programmes.filter(p => matchesLevel(p, watchAcademicLevel));

    // 2. If a specific partner is selected (and not all)
    if (watchPartner && watchPartner !== "all" && !watchPartner.toLowerCase().includes("all")) {
      const partnerAndLevel = levelFiltered.filter(p => {
        const pSchoolName = p.school?.name?.toLowerCase() || "";
        const targetPartner = watchPartner.toLowerCase();
        return pSchoolName.includes(targetPartner) || targetPartner.includes(pSchoolName) || p.schoolId === watchPartner;
      });

      // If the selected partner offers programmes at this academic level, return them
      if (partnerAndLevel.length > 0) {
        return partnerAndLevel;
      }
    }

    // Return all programmes at this academic level
    return levelFiltered;
  }, [programmes, watchAcademicLevel, watchPartner]);

  // Keep selected programme synchronized with filteredProgrammes for standalone course
  useEffect(() => {
    if (watchCourseType === "Standalone Course" && filteredProgrammes.length > 0) {
      const currentProg = getValues("programmeId");
      const isValid = filteredProgrammes.some(p => p.id === currentProg);
      if (!isValid) {
        setValue("programmeId", filteredProgrammes[0].id, { shouldValidate: true });
        if (filteredProgrammes[0].school?.name && filteredProgrammes[0].school.name !== watchPartner) {
          setValue("universityPartner", filteredProgrammes[0].school.name, { shouldValidate: true });
        }
      }
    }
  }, [watchCourseType, filteredProgrammes, setValue, getValues, watchPartner]);

  // Resolve respective intakes based on selected course type, programme, academic level & university partner
  const currentAvailableIntakes = useMemo(() => {
    if (watchCourseType === "Package Courses") {
      const p1Id = watch("packageProgrammes.prog1Id");
      const prog1 = programmes.find(p => p.id === p1Id);
      if (prog1?.intakes) {
        const parsed = parseProgrammeIntakes(prog1.intakes);
        if (parsed.length > 0) return parsed;
      }
      return getFallbackIntakes(watchPartner, watchProg1Level, prog1?.name);
    }

    const selectedProg = programmes.find(p => p.id === watchProgrammeId);
    if (selectedProg?.intakes) {
      const parsed = parseProgrammeIntakes(selectedProg.intakes);
      if (parsed.length > 0) return parsed;
    }
    return getFallbackIntakes(watchPartner, watchAcademicLevel, selectedProg?.name);
  }, [watchCourseType, watchProgrammeId, watchPartner, watchAcademicLevel, watchProg1Level, programmes, watch]);

  // Synchronize selected intake when available intakes change
  useEffect(() => {
    if (currentAvailableIntakes.length > 0) {
      const currentVal = getValues("intake");
      const match = currentAvailableIntakes.find(i => 
        i.value === currentVal || 
        (currentVal && (i.value.includes(currentVal) || currentVal.includes(i.value)))
      );
      if (!match) {
        setValue("intake", currentAvailableIntakes[0].value, { shouldValidate: true });
      }
    }
  }, [currentAvailableIntakes, setValue, getValues]);

  // Programmes filtered by level for package slots
  const foundationProgrammes = useMemo(() => {
    const list = programmes.filter(p => matchesLevel(p, "Foundation") || matchesLevel(p, "Preparatory"));
    return list.length > 0 ? list : programmes;
  }, [programmes]);

  const diplomaProgrammes = useMemo(() => {
    const list = programmes.filter(p => matchesLevel(p, "Diploma"));
    return list.length > 0 ? list : programmes;
  }, [programmes]);

  const degreeProgrammes = useMemo(() => {
    const list = programmes.filter(p => matchesLevel(p, "Undergraduate"));
    return list.length > 0 ? list : programmes;
  }, [programmes]);

  // Ensure default package programme IDs are populated if empty
  useEffect(() => {
    if (watchCourseType === "Package Courses") {
      const currentP1 = getValues("packageProgrammes.prog1Id");
      const currentP2 = getValues("packageProgrammes.prog2Id");
      const currentP3 = getValues("packageProgrammes.prog3Id");

      if (!currentP1) {
        const defaultP1 = (watchProg1Level === "Foundation" ? foundationProgrammes[0] : diplomaProgrammes[0])?.id || programmes[0]?.id || "";
        setValue("packageProgrammes.prog1Id", defaultP1, { shouldValidate: true });
      }
      if (!currentP2) {
        const defaultP2 = (watchProg1Level === "Foundation" ? diplomaProgrammes[0] : degreeProgrammes[0])?.id || programmes[1]?.id || "";
        setValue("packageProgrammes.prog2Id", defaultP2, { shouldValidate: true });
      }
      if (watchProg1Level === "Foundation" && !currentP3) {
        const defaultP3 = degreeProgrammes[0]?.id || programmes[2]?.id || "";
        setValue("packageProgrammes.prog3Id", defaultP3, { shouldValidate: true });
      }
    }
  }, [watchCourseType, watchProg1Level, foundationProgrammes, diplomaProgrammes, degreeProgrammes, programmes, setValue, getValues]);

  useEffect(() => {
    setValue("education", educationList);
  }, [educationList, setValue]);

  useEffect(() => {
    if (savedSignature) {
      setValue("digitalSignature", savedSignature, { shouldValidate: true });
    }
  }, [savedSignature, setValue]);

  // Handle Canvas Drawing for Native Digital Signature (CR-12)
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#252D65";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSavedSignature(null);
    setValue("digitalSignature", "");
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setSavedSignature(dataUrl);
    setValue("digitalSignature", dataUrl, { shouldValidate: true });
  };

  const nextStep = async () => {
    if (step < 5) {
      if (step === 1) {
        if (!getValues("studentType")) {
          setFormError("Please select whether you are a Local Student or International Student before continuing.");
          return;
        }
        if (watchCourseType === "Standalone Course") {
          const pId = getValues("programmeId");
          if (!pId) {
            setFormError("Please select an Available Programme before continuing.");
            return;
          }
        }
        if (!getValues("counsellingDeclaration")) {
          setFormError("Please select your Pre-Course Counselling Declaration statement before continuing.");
          return;
        }
      }

      if (step === 3) {
        if (educationList.length === 0) {
          setFormError("Please add at least one Academic Qualification before continuing.");
          return;
        }
      }

      let fieldsToValidate: string[] = [];
      switch (step) {
        case 1:
          fieldsToValidate = ['studentType', 'universityPartner', 'studyMode', 'courseType', 'intake', 'counsellingDeclaration'];
          break;
        case 2:
          fieldsToValidate = ['personal.fullName', 'personal.surname', 'personal.dob', 'personal.gender', 'personal.maritalStatus', 'emergencyContact.fullName', 'emergencyContact.phone', 'emergencyContact.relation', 'passport.passportNumber', 'passport.countryOfIssue', 'passport.countryOfBirth', 'address.country', 'address.addressLine1', 'address.postalCode'];
          if (isUnder18 && !watchIsSameAsEmergency) {
            fieldsToValidate.push('guardian.fullName', 'guardian.email', 'guardian.phone', 'guardian.relation');
          }
          break;
        case 3:
          fieldsToValidate = [];
          break;
        case 4:
          fieldsToValidate = ['additionalInfo.healthConditions', 'additionalInfo.marketingChannel'];
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
      setFormError(null);
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onInvalid = (fieldErrors: any) => {
    console.error("Form validation errors on submit:", fieldErrors);
    const errorKeys = Object.keys(fieldErrors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      let targetStep = 1;
      if (["personal", "emergencyContact", "guardian", "passport", "address"].includes(firstKey)) {
        targetStep = 2;
      } else if (["education", "englishTest"].includes(firstKey)) {
        targetStep = 3;
      } else if (["additionalInfo", "agent"].includes(firstKey)) {
        targetStep = 4;
      }
      setStep(targetStep);
      setFormError(`Please complete all required fields marked with * before submitting. (Incomplete: ${firstKey})`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: any) => {
    if (step !== 5) {
      await nextStep();
      return;
    }

    if (educationList.length === 0) {
      setStep(3);
      setFormError("Please add at least one Academic Qualification before submitting.");
      return;
    }
    
    const declarationCheck = (document.getElementById("declareCheck") as HTMLInputElement)?.checked;
    if (!declarationCheck) {
      setFormError("You must accept the application declaration before submitting.");
      return;
    }

    if (!savedSignature) {
      setFormError("Please draw and save your Native Digital Signature before final submission.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const result = await submitApplication({
        ...data,
        education: educationList,
        digitalSignature: savedSignature,
      });

      if (result.success) {
        setSuccessAppNumber(result.appNumber || "EGA2026-SUBMITTED");
        if (typeof window !== "undefined") {
          localStorage.removeItem("ega_application_draft");
        }
      } else {
        setFormError(result.error || "Submission failed. Please verify required fields.");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successAppNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center animate-in zoom-in duration-500 font-jost">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-heading">🎉 Application Submitted Successfully!</h1>
        <p className="text-lg text-slate-600 mb-8 font-medium">Your EGA Student Application has been received and is now under official review.</p>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full mb-8">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono mb-1">Application Reference</p>
          <p className="text-2xl font-mono font-extrabold text-[#252D65]">{successAppNumber}</p>
          <div className="h-px bg-slate-100 my-4 w-full" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Application Fee (CR-09)</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">SGD {feeAmount}.00</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="h-11 px-6 rounded-xl font-bold">
            Return to Dashboard
          </Button>
          <Button onClick={() => router.push("/dashboard/applications")} className="h-11 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold">
            View My Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1180px] mx-auto space-y-6 text-left font-jost pb-12">
      
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

      {/* APPLICATION WIZARD FORM */}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        
        {/* Header & 5-Step Connected Stepper Track Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                Student Application Form
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Official Educare Global Academy (EGA) Baseline Specification v1.2.
              </p>
            </div>

            {/* Progress Badge Pill & Autosave Status */}
            <div className="flex items-center gap-3">
              {isDraftRestored ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs animate-in fade-in duration-300">
                  <Check size={13} strokeWidth={2.5} /> Draft Restored
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl hidden sm:flex items-center gap-1.5 shadow-2xs">
                  <Check size={13} className="text-emerald-600" /> Autosave Active
                </span>
              )}

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0 shadow-2xs">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Progress</p>
                  <p className="text-xs font-bold text-[#252D65]">Step {step} of 5 • {Math.round((step / 5) * 100)}%</p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-[#252D65] text-white flex items-center justify-center font-bold text-xs font-mono shadow-md shadow-[#252D65]/25">
                  {step}/5
                </div>
              </div>
            </div>
          </div>

          {/* 5-Section Connected Stepper Track */}
          <div className="no-scrollbar overflow-x-auto py-2">
            <div className="flex items-center justify-between min-w-[700px] relative">
              <div className="absolute left-6 right-6 top-5 h-0.5 bg-slate-200 -z-0" />
              <div 
                className="absolute left-6 top-5 h-0.5 bg-[#252D65] transition-all duration-500 -z-0" 
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
                          ? "bg-[#252D65] text-white ring-4 ring-[#252D65]/20 scale-110 shadow-md shadow-[#252D65]/30" 
                          : isCompleted
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white text-slate-400 border border-slate-200 group-hover:border-slate-300"
                      )}
                    >
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : sec.id}
                    </div>
                    
                    <span className={cn(
                      "text-xs font-bold mt-2 truncate transition-colors",
                      isActive ? "text-[#252D65]" : isCompleted ? "text-emerald-950" : "text-slate-500"
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
        <div className="space-y-6 min-h-[450px]">
                    {/* STEP 1: Mandatory Student Type, Programme Selection & Pre-Course Counselling */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in duration-300">
                
                {/* 1. Mandatory Student Type Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-heading">Mandatory Student Type Selection *</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Select your applicant classification before proceeding with programme selection.</p>
                    </div>
                    <span className="text-[11px] font-bold bg-[#252D65]/10 text-[#252D65] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      Prerequisite
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { value: "Local Student", label: "Local Student", desc: "Singapore Citizens & Permanent Residents" },
                      { value: "International Student", label: "International Student", desc: "Foreign Passport Holders & Student Pass Applicants" }
                    ].map(st => {
                      const isSelected = watchStudentType === st.value;
                      return (
                        <label 
                          key={st.value}
                          className={cn(
                            "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 relative overflow-hidden",
                            isSelected 
                              ? "border-[#252D65] bg-[#252D65]/5 shadow-2xs" 
                              : "border-slate-200 hover:border-[#252D65]/30 bg-white"
                          )}
                        >
                          <input
                            type="radio"
                            name="studentType"
                            value={st.value}
                            checked={isSelected}
                            onChange={() => setValue("studentType", st.value, { shouldValidate: true })}
                            className="mt-1 w-4 h-4 text-[#252D65]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{st.label}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{st.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 2. University Partner & Study Mode */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-heading">1. University Partner & Study Mode</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Choose your awarding university partner institution and attendance format.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">University Partner *</Label>
                      <Controller
                        name="universityPartner"
                        control={control}
                        defaultValue={schools[0]?.name || "Educare Global Academy"}
                        render={({ field }) => (
                          <Select onValueChange={(val) => {
                            field.onChange(val);
                            setValue("programmeId", "");
                          }} value={field.value || (schools[0]?.name || "Educare Global Academy")}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#252D65]/15">
                              <SelectValue placeholder="Select University Partner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Partners (EGA, GCU, KU, NCC)</SelectItem>
                              {schools && schools.length > 0 ? (
                                schools.map((school) => (
                                  <SelectItem key={school.id} value={school.name}>{school.name}</SelectItem>
                                ))
                              ) : (
                                <SelectItem value="Educare Global Academy">Educare Global Academy (EGA)</SelectItem>
                              )}
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
                            <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-[#252D65]/15">
                              <SelectValue placeholder="Select Mode of Study" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full Time">Full Time (FT)</SelectItem>
                              <SelectItem value="Part Time">Part Time (PT)</SelectItem>
                              <SelectItem value="E-learning">E-learning / Online</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 3. Course Type & Target Programme */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-heading">2. Course Type & Target Programme *</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Select standalone enrollment or a packaged qualification pathway.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: "Standalone Course", title: "Standalone Course", desc: "Single programme selection at your target academic level." },
                      { value: "Package Courses", title: "Package Courses", desc: "Dynamic multi-level package pathway driven by Programme 1 Level." }
                    ].map(c => {
                      const isSelected = watchCourseType === c.value;
                      return (
                        <label 
                          key={c.value}
                          className={cn(
                            "p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 relative overflow-hidden",
                            isSelected 
                              ? "border-[#252D65] bg-[#252D65]/5 shadow-2xs" 
                              : "border-slate-200 hover:border-[#252D65]/30 bg-white"
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
                            className="mt-1 w-4 h-4 text-[#252D65]"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{c.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{c.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {watchCourseType === "Standalone Course" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
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
                          render={({ field }) => (
                            <SearchableProgrammeSelect
                              value={field.value}
                              onChange={(newId) => {
                                field.onChange(newId);
                                const chosen = programmes.find(p => p.id === newId);
                                if (chosen?.school?.name && chosen.school.name !== watchPartner && watchPartner !== "all") {
                                  setValue("universityPartner", chosen.school.name, { shouldValidate: true });
                                }
                              }}
                              programmes={filteredProgrammes}
                              placeholder="Search and select a programme..."
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Intake *</Label>
                        <Controller
                          name="intake"
                          control={control}
                          defaultValue={currentAvailableIntakes[0]?.value || "16 Nov 2026"}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || currentAvailableIntakes[0]?.value}>
                              <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-medium">
                                <SelectValue placeholder="Select Intake" />
                              </SelectTrigger>
                              <SelectContent className="w-[320px] max-w-md">
                                {currentAvailableIntakes && currentAvailableIntakes.length > 0 ? (
                                  currentAvailableIntakes.map(i => (
                                    <SelectItem key={i.value} value={i.value}>
                                      <div className="flex items-center justify-between w-full pr-2">
                                        <span className="font-semibold text-slate-900">{i.value}</span>
                                        <span className="text-xs text-slate-400 font-normal ml-3">
                                          {COHORT_MAP[i.value] || ""}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="16 Nov 2026">16 Nov 2026 (November 2026 Intake)</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-2">
                      <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">Configure Package Programme Pathway</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Select Programme 1 Academic Level below. If <strong>Foundation</strong> is selected, 3 programme slots are displayed (Foundation → Diploma → Undergraduate). If <strong>Diploma / Advanced Diploma</strong> is selected, 2 programme slots are displayed (Diploma → Undergraduate).
                          </p>
                        </div>

                        {/* Programme 1 Level Selector */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-bold text-xs">Programme 1 Academic Level (Driver) *</Label>
                            <Controller
                              name="packageProgrammes.prog1Level"
                              control={control}
                              defaultValue="Foundation"
                              render={({ field }) => (
                                <Select onValueChange={(val) => {
                                  field.onChange(val);
                                  if (val === "Foundation") {
                                    setValue("packageProgrammes.prog2Level", "Diploma Family (Assigned)");
                                    setValue("packageProgrammes.prog3Level", "Undergraduate (Assigned)");
                                    setValue("packageProgrammes.prog1Id", foundationProgrammes[0]?.id || programmes[0]?.id || "");
                                    setValue("packageProgrammes.prog2Id", diplomaProgrammes[0]?.id || programmes[1]?.id || "");
                                    setValue("packageProgrammes.prog3Id", degreeProgrammes[0]?.id || programmes[2]?.id || "");
                                  } else {
                                    setValue("packageProgrammes.prog2Level", "Undergraduate (Assigned)");
                                    setValue("packageProgrammes.prog3Level", "");
                                    setValue("packageProgrammes.prog1Id", diplomaProgrammes[0]?.id || programmes[0]?.id || "");
                                    setValue("packageProgrammes.prog2Id", degreeProgrammes[0]?.id || programmes[1]?.id || "");
                                  }
                                }} value={field.value || "Foundation"}>
                                  <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-semibold">
                                    <SelectValue placeholder="Select Programme 1 Level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Foundation">Foundation (Variation 1 — 3 Slot Pathway)</SelectItem>
                                    <SelectItem value="Diploma / Advanced Diploma / Higher Diploma">Diploma / Advanced / Higher Diploma (Variation 2 — 2 Slot Pathway)</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 font-bold text-xs">Primary Pathway Intake *</Label>
                            <Controller
                              name="intake"
                              control={control}
                              defaultValue={currentAvailableIntakes[0]?.value || "16 Nov 2026"}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || currentAvailableIntakes[0]?.value}>
                                  <SelectTrigger className="h-12 bg-white border border-slate-200 text-slate-800 rounded-xl font-semibold">
                                    <SelectValue placeholder="Select Intake" />
                                  </SelectTrigger>
                                  <SelectContent className="w-[320px] max-w-md">
                                    {currentAvailableIntakes && currentAvailableIntakes.length > 0 ? (
                                      currentAvailableIntakes.map(i => (
                                        <SelectItem key={i.value} value={i.value}>
                                          <div className="flex items-center justify-between w-full pr-2">
                                            <span className="font-semibold text-slate-900">{i.value}</span>
                                            <span className="text-xs text-slate-400 font-normal ml-3">
                                              {COHORT_MAP[i.value] || ""}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="16 Nov 2026">16 Nov 2026 (November 2026 Intake)</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>

                        {/* Package Slots Grid */}
                        <div className={cn("grid grid-cols-1 gap-4", watchProg1Level === "Foundation" ? "md:grid-cols-3" : "md:grid-cols-2")}>
                          
                          {/* Slot 1 */}
                          <div className="p-4.5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Programme 1 Slot</span>
                              <span className="text-xs font-bold text-[#252D65] bg-[#252D65]/10 px-2 py-0.5 rounded-md">{watchProg1Level}</span>
                            </div>
                            <Label className="text-slate-800 font-bold text-xs">Programme 1 Selection *</Label>
                            <Controller
                              name="packageProgrammes.prog1Id"
                              control={control}
                              render={({ field }) => (
                                <SearchableProgrammeSelect
                                  value={field.value}
                                  onChange={field.onChange}
                                  programmes={watchProg1Level === "Foundation" ? foundationProgrammes : diplomaProgrammes}
                                  placeholder="Search and select Programme 1..."
                                />
                              )}
                            />
                          </div>

                          {/* Slot 2 (Read-only Academic Level) */}
                          <div className="p-4.5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Programme 2 Slot</span>
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {watchProg1Level === "Foundation" ? "Diploma Family (Assigned)" : "Undergraduate (Assigned)"}
                              </span>
                            </div>
                            <Label className="text-slate-800 font-bold text-xs">Programme 2 Selection *</Label>
                            <Controller
                              name="packageProgrammes.prog2Id"
                              control={control}
                              render={({ field }) => (
                                <SearchableProgrammeSelect
                                  value={field.value}
                                  onChange={field.onChange}
                                  programmes={watchProg1Level === "Foundation" ? diplomaProgrammes : degreeProgrammes}
                                  placeholder="Search and select Programme 2..."
                                />
                              )}
                            />
                          </div>

                          {/* Slot 3 (Variation 1 Only - Read-only Academic Level = Undergraduate) */}
                          {watchProg1Level === "Foundation" && (
                            <div className="p-4.5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs animate-in fade-in duration-300">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Programme 3 Slot</span>
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">Undergraduate (Assigned)</span>
                              </div>
                              <Label className="text-slate-800 font-bold text-xs">Programme 3 Selection *</Label>
                              <Controller
                                name="packageProgrammes.prog3Id"
                                control={control}
                                render={({ field }) => (
                                  <SearchableProgrammeSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    programmes={degreeProgrammes}
                                    placeholder="Search and select Programme 3..."
                                  />
                                )}
                              />
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-slate-100" />

                {/* 4. Pre-Course Counselling */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-heading">3. Pre-Course Counselling Declaration *</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                      Kindly ensure that you understand the key points regarding your choice of study at {watchPartner} before making your declaration statement below.{" "}
                      <button 
                        type="button" 
                        onClick={() => setIsKeyPointsModalOpen(true)} 
                        className="text-[#252D65] font-bold underline hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Please click here to read the key points &rarr;
                      </button>
                    </p>
                  </div>

                  <Controller
                    name="counsellingDeclaration"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2.5 pt-1">
                        {[
                          { val: "counselled", label: "I have been counselled by EGA / EGA Appointed Agents regarding this information." },
                          { val: "read_contacted", label: "I have read sufficient information and, where applicable, I have contacted EGA / EGA Appointed Agents for clarification." },
                          { val: "read_self", label: "I have read sufficient information on my own and confirm that I do not require pre-course counselling by EGA / EGA Appointed Agents." }
                        ].map((opt) => (
                          <label key={opt.val} className={cn(
                            "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer font-medium text-xs text-slate-900 transition-all",
                            field.value === opt.val ? "bg-[#252D65]/5 border-[#252D65] text-[#252D65] font-bold shadow-2xs" : "bg-white border-slate-200 hover:border-slate-300"
                          )}>
                            <input 
                              type="radio" 
                              name="counsellingDeclaration" 
                              value={opt.val} 
                              checked={field.value === opt.val} 
                              onChange={() => field.onChange(opt.val)} 
                              className="w-4 h-4 text-[#252D65]" 
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

            {/* STEP 2: Section 1 (Personal Particulars) & Section 2 (Citizenship, Passport & Address) */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* 9.1 Particulars */}
                <FormAccordion title="1. Personal Particulars *" defaultOpen={true}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Title *</Label>
                      <Controller
                        name="personal.title"
                        control={control}
                        defaultValue="Mr."
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={normalizeTitle(field.value)}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mr.">Mr.</SelectItem>
                              <SelectItem value="Ms.">Ms.</SelectItem>
                              <SelectItem value="Mrs.">Mrs.</SelectItem>
                              <SelectItem value="Miss">Miss</SelectItem>
                              <SelectItem value="Dr.">Dr.</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                      {applicantAge !== null && (
                        <div className="pt-1">
                          {isUnder18 ? (
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md inline-block">
                              Age: {applicantAge} Years (Under-18 Rule Active)
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-500">
                              Age: {applicantAge} Years
                            </span>
                          )}
                        </div>
                      )}
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
                                <input type="radio" name="gender" value={g} checked={field.value === g} onChange={() => field.onChange(g)} className="w-4 h-4 text-[#252D65]" />
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
                      <Controller
                        name="personal.nationality"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <SearchableCountrySelect
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Nationality / Country..."
                          />
                        )}
                      />
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
                </FormAccordion>

                {/* 9.2 Emergency Contact Details (CR-04 Mandatory) */}
                <FormAccordion title="2. Emergency Contact Details *" defaultOpen={true}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Contact Type *</Label>
                      <Controller
                        name="emergencyContact.contactType"
                        control={control}
                        defaultValue="Parent / Legal Guardian"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || "Parent / Legal Guardian"}>
                            <SelectTrigger className="h-12 bg-white border border-slate-200 rounded-xl font-medium">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Parent / Legal Guardian">Parent / Legal Guardian</SelectItem>
                              <SelectItem value="Next of Kin">Next of Kin</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Emergency Contact Full Name *</Label>
                      <Input {...register("emergencyContact.fullName")} placeholder="e.g. Robert Doe" className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Relationship to Applicant *</Label>
                      <Input {...register("emergencyContact.relation")} placeholder="e.g. Father / Sister" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Emergency Contact Phone *</Label>
                      <div className="flex gap-2">
                        <Input {...register("emergencyContact.countryCode")} placeholder="+65" className="w-20 h-12 rounded-xl text-center shrink-0 font-mono font-semibold" />
                        <Input {...register("emergencyContact.phone")} placeholder="9224 5678" className="flex-1 h-12 rounded-xl" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Emergency Contact Email (Optional)</Label>
                      <Input {...register("emergencyContact.email")} type="email" placeholder="emergency@example.com" className="h-12 rounded-xl" />
                    </div>
                  </div>
                </FormAccordion>

                {/* 9.3 Parent / Legal Guardian Details (CR-03 & CR-05 Conditional Under-18) */}
                {isUnder18 && (
                  <FormAccordion 
                    title="3. Parent / Legal Guardian Details *" 
                    defaultOpen={true} 
                    badgeText={applicantAge !== null && !isNaN(applicantAge) ? `Age: ${applicantAge} Years (Under-18 Rule)` : `Under-18 Rule`}
                  >
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-bold text-slate-900 mb-2">
                          Are the Parent / Legal Guardian contact details the same as your Emergency Contact Details? *
                        </p>
                        <Controller
                          name="guardian.isSameAsEmergency"
                          control={control}
                          defaultValue={true}
                          render={({ field }) => (
                            <div className="flex items-center gap-6 text-xs font-bold text-slate-800">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="yes" checked={field.value === true} onChange={() => field.onChange(true)} className="w-4 h-4 text-[#252D65]" />
                                Yes (Reuse Emergency Contact details)
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="no" checked={field.value === false} onChange={() => field.onChange(false)} className="w-4 h-4 text-[#252D65]" />
                                No (Enter separate Parent / Guardian details)
                              </label>
                            </div>
                          )}
                        />
                      </div>

                      {!watchIsSameAsEmergency && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in duration-200">
                          <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold text-xs">Guardian Full Name *</Label>
                            <Input {...register("guardian.fullName")} placeholder="e.g. Mary Doe" className="h-12 bg-white rounded-xl" />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold text-xs">Guardian Email Address *</Label>
                            <Input {...register("guardian.email")} type="email" placeholder="guardian@example.com" className="h-12 bg-white rounded-xl" />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold text-xs">Guardian Phone Number *</Label>
                            <div className="flex gap-2">
                              <Input {...register("guardian.countryCode")} placeholder="+65" className="w-20 h-12 bg-white rounded-xl text-center font-mono font-semibold" />
                              <Input {...register("guardian.phone")} placeholder="9224 5678" className="flex-1 h-12 bg-white rounded-xl" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-700 font-semibold text-xs">Relationship *</Label>
                            <Input {...register("guardian.relation")} placeholder="e.g. Mother" className="h-12 bg-white rounded-xl" />
                          </div>
                        </div>
                      )}
                    </div>
                  </FormAccordion>
                )}

                {/* 10.1 Passport & Citizenship Details */}
                <FormAccordion title="Passport & Citizenship Details *" defaultOpen={true}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Number *</Label>
                      <Input {...register("passport.passportNumber")} placeholder="e.g. S1234567A" className="h-12 rounded-xl font-mono uppercase" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Country of Issue *</Label>
                      <Controller
                        name="passport.countryOfIssue"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <SearchableCountrySelect
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Country of Issue / Search..."
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Country of Birth *</Label>
                      <Controller
                        name="passport.countryOfBirth"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <SearchableCountrySelect
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Country of Birth / Search..."
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Issue Date *</Label>
                      <Input type="date" {...register("passport.issueDate")} className="h-12 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Passport Expiry Date *</Label>
                      <Input type="date" {...register("passport.expiryDate")} className="h-12 rounded-xl" />
                    </div>
                  </div>
                </FormAccordion>

                {/* 10.2 Address (CR-06: Unified Address, Local Address removed) */}
                <FormAccordion title="Address Details *" defaultOpen={true}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Country *</Label>
                      <Controller
                        name="address.country"
                        control={control}
                        defaultValue="Singapore"
                        render={({ field }) => (
                          <SearchableCountrySelect
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select Country / Search..."
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">State / Region</Label>
                      <Input {...register("address.state")} placeholder="Singapore" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">City</Label>
                      <Input {...register("address.city")} placeholder="Singapore" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Address Line 1 *</Label>
                      <Input {...register("address.addressLine1")} placeholder="123 Orchard Road" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Address (Line 2)</Label>
                      <Input {...register("address.addressLine2")} placeholder="Apartment, suite, unit, building, floor, etc." className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Unit No.</Label>
                      <Input {...register("address.unitNo")} placeholder="#05-01" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold text-xs">Postal Code *</Label>
                      <Input {...register("address.postalCode")} placeholder="238845" className="h-12 rounded-xl" />
                    </div>
                  </div>
                </FormAccordion>
              </div>
            )}

            {/* STEP 3: Academic Background & English Proficiency */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* 11.1 Academic Qualifications (CR-07: 3 Fields per qualification record) */}
                <FormAccordion 
                  title="1. Academic Qualifications *" 
                  defaultOpen={true}
                  badgeText="Repeatable (CR-07)"
                  actionButton={
                    <Button 
                      type="button" 
                      onClick={() => {
                        setQualForm({
                          country: "Singapore",
                          institution: "",
                          qualificationTitle: "",
                        });
                        setIsQualModalOpen(true);
                      }}
                      className="h-9 px-4 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold text-xs"
                    >
                      + Add Qualification
                    </Button>
                  }
                >
                  <p className="text-xs text-slate-500 font-medium">List all prior academic qualifications. Only Country, Institution/Board and Title are required per CR-07.</p>
                  
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                          <th className="px-5 py-3.5">Country of Awarding Institution</th>
                          <th className="px-5 py-3.5">Awarding Institution / Examination Board</th>
                          <th className="px-5 py-3.5">Qualification Title / Level</th>
                          <th className="px-5 py-3.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {educationList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 text-slate-700 font-medium">
                            <td className="px-5 py-3.5 font-bold text-slate-900">{item.country || "Singapore"}</td>
                            <td className="px-5 py-3.5">{item.institution}</td>
                            <td className="px-5 py-3.5 font-bold text-[#252D65]">{item.qualificationTitle}</td>
                            <td className="px-5 py-3.5 text-center">
                              <button 
                                type="button" 
                                onClick={() => {
                                  if (educationList.length > 1) {
                                    setEducationList(educationList.filter(el => el.id !== item.id));
                                  } else {
                                    alert("At least one qualification is required.");
                                  }
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
                </FormAccordion>

                {/* 11.2 English Language Proficiency Test */}
                <FormAccordion title="2. English Language Proficiency Test" defaultOpen={true}>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold text-slate-900 mb-2">
                      Have you taken a formal English Language Test? *
                    </p>
                    <Controller
                      name="englishTest.hasTakenTest"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <div className="flex items-center gap-6 text-xs font-bold text-slate-800">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="hasTakenEnglishTest" 
                              checked={field.value === true} 
                              onChange={() => field.onChange(true)} 
                              className="w-4 h-4 text-[#252D65]" 
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="hasTakenEnglishTest" 
                              checked={field.value === false} 
                              onChange={() => field.onChange(false)} 
                              className="w-4 h-4 text-[#252D65]" 
                            />
                            No
                          </label>
                        </div>
                      )}
                    />
                  </div>

                  {watchHasTakenTest && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Awarding Body / Test Type *</Label>
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
                                <SelectItem value="IELTS">IELTS</SelectItem>
                                <SelectItem value="TOFEL">TOFEL</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold text-xs">Actual / Tentative Test Date</Label>
                        <Input type="date" {...register("englishTest.testDate")} className="h-12 rounded-xl" />
                      </div>

                      <div className="space-y-2 flex flex-col justify-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700">
                          <input type="checkbox" {...register("englishTest.isTentativeDate")} className="w-4 h-4 text-[#252D65]" />
                          <span>This is a tentative / upcoming test date</span>
                        </label>
                      </div>
                    </div>
                  )}
                </FormAccordion>
              </div>
            )}

            {/* STEP 4: Additional Information & Agent Contact */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* 12.1 Health Conditions & Learning Needs */}
                <FormAccordion title="1. Health Conditions & Learning Needs *" defaultOpen={true}>
                  <p className="text-xs text-slate-500 font-medium">Describe physical/mental health conditions or learning accommodation needs. Indicate <strong>NA</strong> if not applicable.</p>
                  <textarea 
                    {...register("additionalInfo.healthConditions")} 
                    rows={3} 
                    className="w-full p-4 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#252D65]/20" 
                    placeholder="Enter NA if not applicable"
                  />
                </FormAccordion>

                {/* 12.2 Conduct Declarations */}
                <FormAccordion title="2. Conduct Declarations *" defaultOpen={true}>
                  <div className="space-y-4 text-xs font-medium text-slate-800">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="flex-1">Have you ever been suspended, excluded and/or expelled from a course at a university or educational institution?</p>
                      <div className="flex items-center gap-4 shrink-0 font-bold">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="yes" {...register("additionalInfo.conductSuspended")} className="w-4 h-4 text-[#252D65]" /> Yes
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="no" defaultChecked {...register("additionalInfo.conductSuspended")} className="w-4 h-4 text-[#252D65]" /> No
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="flex-1">Have you been arrested, charged in court, or convicted of an offence in any country?</p>
                      <div className="flex items-center gap-4 shrink-0 font-bold">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="yes" {...register("additionalInfo.conductConvicted")} className="w-4 h-4 text-[#252D65]" /> Yes
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" value="no" defaultChecked {...register("additionalInfo.conductConvicted")} className="w-4 h-4 text-[#252D65]" /> No
                        </label>
                      </div>
                    </div>
                  </div>
                </FormAccordion>

                {/* 12.3 Marketing Channel (CR-08: 7 Approved Options ONLY) */}
                <FormAccordion title="3. How did you hear about EGA? *" defaultOpen={true} badgeText="7 Approved Options (CR-08)">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "EGA Website",
                        "Print Advertising",
                        "Social Media",
                        "Exhibition",
                        "EGA Seminar",
                        "Recruitment Agents",
                        "Referred by EGA Student/Alumni"
                      ].map((ch) => (
                        <label key={ch} className={cn(
                          "p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs font-semibold transition-all",
                          watchMarketingChannel === ch ? "border-[#252D65] bg-[#252D65]/5 text-[#252D65] shadow-2xs" : "border-slate-200 hover:border-slate-300 bg-white"
                        )}>
                          <input 
                            type="radio" 
                            name="marketingChannel" 
                            value={ch} 
                            checked={watchMarketingChannel === ch} 
                            onChange={() => setValue("additionalInfo.marketingChannel", ch, { shouldValidate: true })} 
                            className="w-4 h-4 text-[#252D65]" 
                          />
                          <span>{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </FormAccordion>

                {/* 12.4 EGA Appointed Agent Contact */}
                <FormAccordion title="4. EGA Appointed Agent Contact" defaultOpen={true}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-800 font-semibold text-xs sm:text-sm">
                        Are you being represented by an EGA appointed agent for this application? *
                      </Label>
                      <div className="flex gap-4">
                        <label className={cn(
                          "px-5 py-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-bold transition-all",
                          !watchIsAgent ? "border-[#252D65] bg-[#252D65]/5 text-[#252D65] shadow-2xs" : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        )}>
                          <input
                            type="radio"
                            name="isAgentRepresented"
                            checked={!watchIsAgent}
                            onChange={() => setValue("agent.isAgentRepresented", false, { shouldValidate: true })}
                            className="w-4 h-4 text-[#252D65]"
                          />
                          No
                        </label>
                        <label className={cn(
                          "px-5 py-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-bold transition-all",
                          watchIsAgent ? "border-[#252D65] bg-[#252D65]/5 text-[#252D65] shadow-2xs" : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        )}>
                          <input
                            type="radio"
                            name="isAgentRepresented"
                            checked={Boolean(watchIsAgent)}
                            onChange={() => setValue("agent.isAgentRepresented", true, { shouldValidate: true })}
                            className="w-4 h-4 text-[#252D65]"
                          />
                          Yes
                        </label>
                      </div>
                    </div>

                    {watchIsAgent && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in duration-200">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">Agent Country *</Label>
                          <Controller
                            name="agent.agentCountry"
                            control={control}
                            defaultValue="Singapore"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value || "Singapore"}>
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
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">Agency Name *</Label>
                          <Input {...register("agent.agencyName")} placeholder="e.g. Global Education Agency" className="h-12 rounded-xl" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">Counsellor Name *</Label>
                          <Input {...register("agent.counsellorName")} placeholder="e.g. Jane Smith" className="h-12 rounded-xl" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-slate-700 font-semibold text-xs">Counsellor Email *</Label>
                          <Input {...register("agent.counsellorEmail")} type="email" placeholder="e.g. counsellor@agency.com" className="h-12 rounded-xl" />
                        </div>
                      </div>
                    )}
                  </div>
                </FormAccordion>
              </div>
            )}

            {/* STEP 5: Comprehensive Review, Declarations, Native Signature, Documents & Payment */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* 1. Comprehensive Application Overview Summary (F-063, F-064) */}
                <FormAccordion title="1. Comprehensive Application Overview Summary" defaultOpen={true}>
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium">
                      Please review all details before submitting. Click <strong>Edit</strong> on any section to make amendments.
                    </p>

                    {/* Card A: Programme Selection */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-900">1. Programme Selection</h4>
                          <span className="text-[10px] font-mono font-bold bg-[#252D65]/10 text-[#252D65] px-2 py-0.5 rounded-full">
                            {watchStudentType || "Student Type Pending"}
                          </span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium block">University Partner:</span> <span className="font-bold text-slate-800">{watchPartner}</span></div>
                        <div><span className="text-slate-400 font-medium block">Study Mode:</span> <span className="font-bold text-slate-800">{watchStudyMode}</span></div>
                        <div><span className="text-slate-400 font-medium block">Course Type:</span> <span className="font-bold text-slate-800">{watchCourseType}</span></div>
                        <div><span className="text-slate-400 font-medium block">Commencing Intake:</span> <span className="font-bold text-slate-800">{getValues("intake")}</span></div>
                      </div>
                    </div>

                    {/* Card B: Personal Particulars */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">2. Personal Particulars & Contact</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium block">Full Name:</span> <span className="font-bold text-slate-800">{getValues("personal.title")} {getValues("personal.fullName")} {getValues("personal.surname")}</span></div>
                        <div><span className="text-slate-400 font-medium block">Date of Birth:</span> <span className="font-bold text-slate-800">{getValues("personal.dob") || "Not entered"} {applicantAge !== null ? `(${applicantAge} yrs)` : ""}</span></div>
                        <div><span className="text-slate-400 font-medium block">Gender & Status:</span> <span className="font-bold text-slate-800 capitalize">{getValues("personal.gender") || "-"} / {getValues("personal.maritalStatus") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Nationality:</span> <span className="font-bold text-slate-800">{getValues("personal.nationality") || "Not entered"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Email:</span> <span className="font-bold text-slate-800">{getValues("personal.email") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Contact Number:</span> <span className="font-bold text-slate-800">{getValues("personal.phoneCountryCode")} {getValues("personal.phone") || "-"}</span></div>
                      </div>
                    </div>

                    {/* Card C: Emergency Contact & Guardian */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">3. Emergency Contact & Guardian</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium block">Emergency Contact:</span> <span className="font-bold text-slate-800">{getValues("emergencyContact.fullName") || "Not entered"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Relationship:</span> <span className="font-bold text-slate-800">{getValues("emergencyContact.relation") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Emergency Phone:</span> <span className="font-bold text-slate-800">{getValues("emergencyContact.countryCode")} {getValues("emergencyContact.phone") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Under-18 Guardian:</span> <span className="font-bold text-slate-800">{isUnder18 ? (watchIsSameAsEmergency ? "Same as Emergency Contact" : (getValues("guardian.fullName") || "Guardian Required")) : "Not Applicable (Adult)"}</span></div>
                      </div>
                    </div>

                    {/* Card D: Passport & Residential Address */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">4. Passport & Address</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium block">Passport Number:</span> <span className="font-bold text-slate-800">{getValues("passport.passportNumber") || "Not entered"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Country of Issue / Birth:</span> <span className="font-bold text-slate-800">{getValues("passport.countryOfIssue") || "-"} / {getValues("passport.countryOfBirth") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Passport Expiry:</span> <span className="font-bold text-slate-800">{getValues("passport.expiryDate") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Residential Address:</span> <span className="font-bold text-slate-800 truncate block">{getValues("address.addressLine1") || "-"} {getValues("address.unitNo")}</span></div>
                      </div>
                    </div>

                    {/* Card E: Academic Background & English Test */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">5. Academic Background ({educationList.length} records)</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-xs">
                        {educationList.length > 0 ? (
                          educationList.map((ed, idx) => (
                            <div key={ed.id || idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200/60">
                              <span className="font-bold text-slate-800">{ed.qualificationTitle} &bull; {ed.institution}</span>
                              <span className="text-slate-400 font-mono text-[11px]">{ed.country}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-rose-600 font-bold">No qualifications added. Please add at least one qualification.</p>
                        )}
                        <div className="pt-1 text-slate-500">
                          <span className="font-semibold text-slate-700">English Proficiency Test: </span>
                          {watchHasTakenTest ? (
                            <span className="font-bold text-slate-800">{getValues("englishTest.testType")} ({getValues("englishTest.testDate") || "Date Pending"})</span>
                          ) : (
                            <span className="text-slate-500">No English test taken</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card F: Additional Information & Agent */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <h4 className="font-heading font-bold text-sm text-slate-900">6. Additional Information & Agent</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => { setStep(4); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                          className="h-7 px-2.5 text-xs font-bold text-[#252D65] hover:bg-[#252D65]/10 rounded-lg cursor-pointer"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-slate-400 font-medium block">Health Needs:</span> <span className="font-bold text-slate-800">{getValues("additionalInfo.healthConditions") || "NA"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Conduct Clearances:</span> <span className="font-bold text-slate-800">Clear / No record</span></div>
                        <div><span className="text-slate-400 font-medium block">Marketing Channel:</span> <span className="font-bold text-slate-800">{getValues("additionalInfo.marketingChannel") || "-"}</span></div>
                        <div><span className="text-slate-400 font-medium block">Education Agent:</span> <span className="font-bold text-slate-800">{watchIsAgent ? `${getValues("agent.agencyName") || "Agent"} (${getValues("agent.counsellorName") || "Contact"})` : "Direct Applicant"}</span></div>
                      </div>
                    </div>
                  </div>
                </FormAccordion>

                {/* 2. Document Upload & Multiple Education Certificates (CR-11 & Section 16) */}
                <FormAccordion title="2. Verification Documents & Certificates *" defaultOpen={true} badgeText="Multiple Certificates (CR-11)">
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Upload verification documents. As per CR-11, multiple Education Certificates can be attached.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <span className="font-bold text-slate-900 block">1. Passport Copy *</span>
                        <div className="flex items-center gap-3">
                          <Input type="file" className="h-10 text-xs bg-white" />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <span className="font-bold text-slate-900 block">2. Birth Certificate *</span>
                        <div className="flex items-center gap-3">
                          <Input type="file" className="h-10 text-xs bg-white" />
                        </div>
                      </div>
                    </div>

                    {/* Multiple Education Certificates (CR-11) */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">3. Education Certificates (Multiple Attachments Allowed) *</span>
                        <label className="cursor-pointer bg-[#252D65] hover:bg-[#1C224E] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <Plus size={14} /> Attach Certificate
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setCertFiles([...certFiles, { id: `c_${Date.now()}`, name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="space-y-2">
                        {certFiles.map((f) => (
                          <div key={f.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 text-xs font-medium">
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText size={16} className="text-[#252D65] shrink-0" />
                              <span className="truncate font-bold text-slate-800">{f.name}</span>
                              <span className="text-slate-400 font-mono text-[10px]">({f.size})</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setCertFiles(certFiles.filter(item => item.id !== f.id))} 
                              className="text-rose-600 font-bold hover:text-rose-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FormAccordion>

                {/* 3. Section 5: Declarations & Consents (F-059, F-060, F-061, OI-11) */}
                <FormAccordion title="3. Section 5: Declarations & Consents *" defaultOpen={true}>
                  <div className="space-y-4 text-xs">
                    {/* Mandatory 1: Applicant Declaration */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register("consent.applicantDeclaration")} 
                          defaultChecked={true}
                          className="w-4 h-4 text-[#252D65] border-slate-300 rounded mt-0.5 focus:ring-[#252D65]" 
                        />
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">Applicant Legal Declaration *</span>
                          <p className="text-slate-600 leading-relaxed">
                            I declare that all particulars given in this application form and the accompanying documents are complete, true, and correct. I understand that any false statement or omission will result in immediate disqualification of my application or termination of my enrolment with EGA. I authorize Educare Global Academy to verify the authenticity of all statements and records submitted.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Mandatory 2: University Partner Declaration */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register("consent.partnerConsent")} 
                          defaultChecked={true}
                          className="w-4 h-4 text-[#252D65] border-slate-300 rounded mt-0.5 focus:ring-[#252D65]" 
                        />
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">Awarding Partner Regulations Declaration ({watchPartner}) *</span>
                          <p className="text-slate-600 leading-relaxed">
                            {getPartnerDeclarationText(watchPartner)}
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Mandatory 3: Personal Data Protection Act (PDPA) */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register("consent.dataProcessingConsent")} 
                          defaultChecked={true}
                          className="w-4 h-4 text-[#252D65] border-slate-300 rounded mt-0.5 focus:ring-[#252D65]" 
                        />
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">Personal Data Protection Act (PDPA) Consent *</span>
                          <p className="text-slate-600 leading-relaxed">
                            I consent to the collection, usage, and disclosure of my personal data by Educare Global Academy and its university partners for application processing, student pass verification with Singapore Immigration & Checkpoints Authority (ICA), academic records management, and CPE regulatory compliance in accordance with the Singapore Personal Data Protection Act.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Optional: Marketing Consent (F-061) */}
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register("consent.marketingConsent")} 
                          className="w-4 h-4 text-[#252D65] border-slate-300 rounded mt-0.5 focus:ring-[#252D65]" 
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 block">Promotional & Marketing Communications</span>
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">Optional</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            I agree to receive communications regarding educational seminars, scholarship opportunities, future courses, and event invitations from Educare Global Academy via email, SMS, and instant messaging services.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </FormAccordion>

                {/* 4. Native Applicant Digital Signature Pad (CR-12 & Section 17) */}
                <FormAccordion title="4. Native Applicant Digital Signature *" defaultOpen={true} badgeText="In-Browser HTML5 Pad (CR-12)">
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Draw your live legal signature in the box below using your mouse, trackpad, stylus, or touch screen as per EGA CR-12 specification.
                    </p>

                    <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-4 text-center space-y-3 relative">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={180}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full max-w-lg h-44 border border-slate-200 rounded-xl mx-auto bg-slate-50/50 cursor-crosshair touch-none"
                      />

                      <div className="flex justify-center gap-3">
                        <Button type="button" variant="outline" onClick={clearCanvas} className="h-9 px-4 text-xs font-bold gap-1.5">
                          <Trash2 size={14} /> Clear / Redo
                        </Button>
                        <Button type="button" onClick={saveSignature} className="h-9 px-5 bg-[#252D65] hover:bg-[#1C224E] text-white text-xs font-bold gap-1.5">
                          <PenTool size={14} /> Save Signature
                        </Button>
                      </div>

                      {savedSignature && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                            <Check size={14} /> Signature Saved & Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </FormAccordion>

                {/* 5. Application Fee & Approved Payment Methods (CR-09, CR-10, F-073) */}
                <FormAccordion title="5. Application Fee & Approved Payment Methods *" defaultOpen={true} badgeText={`SGD ${feeAmount}.00 (CR-09)`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#252D65]/5 p-5 rounded-2xl border border-[#252D65]/20">
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-900">Application Fee Summary</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Partner Rule (CR-09): {watchPartner.includes("Glasgow") || watchPartner.includes("Kingston") || watchPartner.includes("NCC") ? "Partner University Fee (SGD 320)" : "EGA Course Fee (SGD 160)"}
                        </p>
                      </div>
                      <span className="text-2xl font-mono font-extrabold text-[#252D65]">SGD {feeAmount}.00</span>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-800 font-bold text-xs">Approved Payment Method (CR-10 / Spec Section 15)</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod("paynow");
                            setIsPayNowModalOpen(true);
                          }}
                          className={cn(
                            "flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 font-bold text-xs transition-all",
                            paymentMethod === "paynow"
                              ? "border-[#252D65] bg-[#252D65]/5 text-[#252D65] shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                          )}
                        >
                          <QrCode size={20} className="text-[#252D65]" />
                          <div className="text-left">
                            <span className="block font-bold">PayNow / SGQR</span>
                            <span className="text-[10px] font-normal text-slate-500">Singapore Bank Instant Transfer</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod("flywire");
                            setIsFlywireModalOpen(true);
                          }}
                          className={cn(
                            "flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 font-bold text-xs transition-all",
                            paymentMethod === "flywire"
                              ? "border-blue-600 bg-blue-50/50 text-blue-800 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                          )}
                        >
                          <Globe size={20} className="text-blue-600" />
                          <div className="text-left">
                            <span className="block font-bold">Flywire Global Payment</span>
                            <span className="text-[10px] font-normal text-slate-500">International Wire & Local Currencies</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Final Declaration Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-center space-x-3 bg-white border border-slate-200 p-4 rounded-xl cursor-pointer">
                        <input type="checkbox" id="declareCheck" required defaultChecked={true} className="w-4 h-4 text-[#252D65] border-slate-300 rounded focus:ring-[#252D65]" />
                        <span className="text-slate-900 font-bold text-xs sm:text-sm">
                          I certify that all information provided in this EGA application is complete, true and correct *
                        </span>
                      </label>
                    </div>
                  </div>
                </FormAccordion>
              </div>
            )}
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
              className="h-12 px-8 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold gap-2 shadow-md shadow-[#252D65]/25 hover:shadow-lg transition-all"
            >
              Continue to {SECTIONS.find(s => s.id === step + 1)?.shortName || "Next"} &gt;
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold gap-2 shadow-md shadow-[#252D65]/25 hover:shadow-lg transition-all"
            >
              {isSubmitting ? "Processing..." : `Pay SGD ${feeAmount}.00 & Submit Application`}
            </Button>
          )}
        </div>
      </form>

      {/* Qualification Modal (CR-07 3 Fields) */}
      {isQualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-left border border-slate-200 font-jost">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Add Qualification (CR-07)</h3>
              <button type="button" onClick={() => setIsQualModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Country of Awarding Institution *</Label>
                <SearchableCountrySelect
                  value={qualForm.country}
                  onChange={(val) => setQualForm({ ...qualForm, country: val })}
                  placeholder="Select Country / Search..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Awarding Institution / Examination Board *</Label>
                <Input value={qualForm.institution} onChange={e => setQualForm({...qualForm, institution: e.target.value})} placeholder="e.g. Singapore Polytechnic" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-semibold text-xs">Qualification Title / Level *</Label>
                <Input value={qualForm.qualificationTitle} onChange={e => setQualForm({...qualForm, qualificationTitle: e.target.value})} placeholder="e.g. Diploma in Business Studies" className="h-11 rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
              <Button variant="outline" type="button" onClick={() => setIsQualModalOpen(false)} className="h-10 px-5 rounded-xl font-bold">Cancel</Button>
              <Button 
                type="button" 
                className="h-10 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold"
                onClick={() => {
                  if (qualForm.country && qualForm.institution && qualForm.qualificationTitle) {
                    setEducationList([...educationList, { ...qualForm, id: Date.now() }]);
                    setQualForm({ country: "Singapore", institution: "", qualificationTitle: "" });
                    setIsQualModalOpen(false);
                  }
                }}
              >
                Save Qualification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Key Points Modal (F-028) */}
      {isKeyPointsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left border border-slate-200 font-jost space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">Pre-Course Counselling Key Points</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Please review these essential items regarding your academic programme at EGA.</p>
              </div>
              <button type="button" onClick={() => setIsKeyPointsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">1. School Vision, Mission & EduTrust System</p>
                <p>EGA is committed to high educational standards and EduTrust certification guidelines regulated by the Committee for Private Education (CPE), SkillsFuture Singapore.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">2. Course Information & Admission Criteria</p>
                <p>Entry qualifications, module structure, mode of delivery (Full Time / Part Time / E-learning), assessment methods, and graduation award requirements.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">3. Fee Structure & Fee Protection Scheme (FPS)</p>
                <p>All tuition fees and course-related charges are fully protected under the Fee Protection Scheme (FPS) using CPE-approved insurance mechanisms.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">4. Refund, Withdrawal & Transfer Policies</p>
                <p>Standard student contract terms, cooling-off period (7 working days), refund calculation percentages, and formal withdrawal procedures.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-900">5. Attendance Requirements</p>
                <p>International students on Student Pass must maintain at least 90% monthly attendance. Local students must maintain at least 75% attendance.</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button 
                type="button" 
                onClick={() => setIsKeyPointsModalOpen(false)} 
                className="h-10 px-6 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold text-xs"
              >
                I Understand & Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PayNow SGQR Modal (CR-10) */}
      {isPayNowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative border border-slate-200 font-jost space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-heading font-bold text-slate-900 text-base">PayNow / SGQR Payment</span>
              <button type="button" onClick={() => setIsPayNowModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center">
                <QrCode size={140} className="text-[#252D65]" />
              </div>
              <p className="text-xs font-mono font-bold text-[#252D65]">EGA PayNow SGQR Code</p>
              <p className="text-sm font-extrabold text-slate-900">Amount: SGD {feeAmount}.00</p>
            </div>

            <Button onClick={() => setIsPayNowModalOpen(false)} className="w-full h-11 bg-[#252D65] hover:bg-[#1C224E] text-white rounded-xl font-bold">
              Done / Payment Confirmed
            </Button>
          </div>
        </div>
      )}

      {/* Flywire Payment Modal (F-073, QA-20) */}
      {isFlywireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 text-left shadow-2xl relative border border-slate-200 font-jost space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  fw
                </div>
                <div>
                  <span className="font-heading font-bold text-slate-900 text-base block">Flywire Global Payment</span>
                  <span className="text-[11px] text-slate-500 font-medium">International Wire, Visa, Mastercard & Local Bank Transfer</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsFlywireModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Institution</span>
                <span className="font-bold text-slate-800">Educare Global Academy</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Payment Purpose</span>
                <span className="font-bold text-slate-800">Application & Registration Fee</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Payee Reference</span>
                <span className="font-mono font-bold text-[#252D65]">EGA-TEMP-{(user.id || "APP").slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Total Amount Due</span>
                <span className="text-base font-extrabold text-[#252D65]">SGD {feeAmount}.00</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Flywire allows you to pay securely from any country in your home currency with competitive exchange rates and 24/7 multilingual support.
            </p>

            <Button 
              type="button" 
              onClick={() => {
                setPaymentMethod("flywire");
                setIsFlywireModalOpen(false);
              }} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Select Flywire & Proceed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
