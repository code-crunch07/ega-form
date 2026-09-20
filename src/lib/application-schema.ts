import { z } from "zod";

const phoneRegex = /^[0-9\s-]{6,20}$/;

export const applicationSchema = z.object({
  // Mandatory Student Type Selection
  studentType: z.enum(["Local Student", "International Student"], {
    message: "Please select whether you are a Local Student or International Student",
  }),

  // Programme Selection
  universityPartner: z.string().min(1, "University Partner is required"),
  studyMode: z.string().min(1, "Mode of Study is required"),
  courseType: z.enum(["Standalone Course", "Package Courses"]).default("Standalone Course"),
  academicLevel: z.string().optional(),
  programmeId: z.string().optional(),
  packageProgrammes: z.object({
    prog1Level: z.string().optional(),
    prog1Id: z.string().optional(),
    prog2Level: z.string().optional(),
    prog2Id: z.string().optional(),
    prog3Level: z.string().optional(),
    prog3Id: z.string().optional(),
  }).optional(),
  intake: z.string().min(1, "Intake is required"),

  // Pre-Course Counselling Declaration
  counsellingDeclaration: z.string().min(1, "Please select your Pre-Course Counselling Declaration statement"),

  // Section 1: Personal & Contact Details
  personal: z.object({
    title: z.string().min(1, "Title is required"),
    fullName: z.string().min(2, "Full Name is required"),
    surname: z.string().min(1, "Surname is required (enter . if no surname)"),
    dob: z.string().refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, { message: "Date of Birth must be a valid past date" }),
    gender: z.string().min(1, "Gender is required"),
    maritalStatus: z.string().min(1, "Marital Status is required"),
    nationality: z.string().min(1, "Nationality is required"),
    email: z.string().email("Please enter a valid email address (e.g. name@example.com)"),
    phoneCountryCode: z.string().default("+65"),
    phone: z.string()
      .min(4, "Contact Number is required")
      .regex(phoneRegex, "Contact Number must contain digits only"),
  }),

  // Emergency Contact Details
  emergencyContact: z.object({
    contactType: z.string().min(1, "Contact Type is required"),
    fullName: z.string().min(1, "Emergency contact name is required"),
    countryCode: z.string().default("+65"),
    phone: z.string()
      .min(4, "Emergency contact phone is required")
      .regex(phoneRegex, "Emergency contact phone must contain digits only"),
    email: z.string().email("Invalid email format").optional().or(z.literal("")),
    relation: z.string().min(1, "Relationship is required"),
  }),

  // Parent / Legal Guardian (Conditional Under-18)
  guardian: z.object({
    isUnder18: z.boolean().optional(),
    isSameAsEmergency: z.boolean().optional(),
    fullName: z.string().optional(),
    email: z.string().email("Invalid guardian email format").optional().or(z.literal("")),
    countryCode: z.string().optional(),
    phone: z.string().regex(phoneRegex, "Guardian phone must contain digits only").optional().or(z.literal("")),
    relation: z.string().optional(),
  }).optional(),

  // Section 2: Citizenship, Passport & Address
  passport: z.object({
    passportNumber: z.string().min(1, "Passport Number is required"),
    countryOfIssue: z.string().min(1, "Country of Issue is required"),
    issueDate: z.string().min(1, "Issue Date is required"),
    expiryDate: z.string().min(1, "Expiry Date is required"),
    countryOfBirth: z.string().min(1, "Country of Birth is required"),
  }),

  // Unified Address
  address: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State / Region is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal Code is required"),
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    unitNo: z.string().optional(),
  }),

  // Section 3: Academic Background
  education: z.array(z.object({
    id: z.number().optional(),
    country: z.string().min(1, "Country of Awarding Institution is required"),
    institution: z.string().min(1, "Awarding Institution / Board is required"),
    qualificationTitle: z.string().min(1, "Qualification Title / Level is required"),
  })).min(1, "At least one qualification record is required"),

  // English Proficiency
  englishTest: z.object({
    hasTakenTest: z.boolean().default(false),
    testType: z.string().optional(),
    testDate: z.string().optional(),
    isTentativeDate: z.boolean().optional(),
  }),

  // Section 4: Additional Information
  additionalInfo: z.object({
    healthConditions: z.string().min(1, "Health conditions details are required (enter NA if none)"),
    conductSuspended: z.boolean().default(false),
    conductConvicted: z.boolean().default(false),
    marketingChannel: z.enum([
      "EGA Website",
      "Print Advertising",
      "Social Media",
      "Exhibition",
      "EGA Seminar",
      "Recruitment Agents",
      "Referred by EGA Student/Alumni"
    ], { message: "Please select an approved marketing channel" }),
  }),

  // EGA Appointed Agent Contact
  agent: z.object({
    isAgentRepresented: z.boolean().default(false),
    agentCountry: z.string().optional(),
    agencyName: z.string().optional(),
    counsellorName: z.string().optional(),
    counsellorEmail: z.string().email("Invalid counsellor email format").optional().or(z.literal("")),
  }),

  // Section 5: Declaration & Consent
  consent: z.object({
    dataProcessingConsent: z.boolean().default(true),
    partnerConsent: z.boolean().default(true),
    applicantDeclaration: z.boolean().default(true),
    marketingConsent: z.boolean().default(false),
  }),

  // Native Applicant Digital Signature
  digitalSignature: z.string().min(1, "Applicant signature is required"),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
