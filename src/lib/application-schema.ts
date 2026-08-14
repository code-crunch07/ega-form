import { z } from "zod";

export const applicationSchema = z.object({
  // Mandatory Student Type Selection (CR-02)
  studentType: z.enum(["Local Student", "International Student"]).default("Local Student"),

  // Programme Selection (CR-13 Dynamic Package Logic & Core Fields)
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

  // Pre-Course Counselling
  counsellingDeclaration: z.string().optional(),

  // Section 1: Personal & Contact Details (9.1 Particulars)
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
    email: z.string().email("Invalid email format"),
    phoneCountryCode: z.string().default("+65"),
    phone: z.string().min(4, "Contact Number is required"),
  }),

  // Emergency Contact Details (9.2 Mandatory)
  emergencyContact: z.object({
    contactType: z.string().min(1, "Contact Type is required"),
    fullName: z.string().min(1, "Emergency contact name is required"),
    countryCode: z.string().default("+65"),
    phone: z.string().min(4, "Emergency contact phone is required"),
    email: z.string().optional(),
    relation: z.string().min(1, "Relationship is required"),
  }),

  // Parent / Legal Guardian (9.3 Conditional Under-18)
  guardian: z.object({
    isUnder18: z.boolean().optional(),
    isSameAsEmergency: z.boolean().optional(),
    fullName: z.string().optional(),
    email: z.string().optional(),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }).optional(),

  // Section 2: Citizenship, Passport & Address (10.1 & 10.2 CR-06)
  passport: z.object({
    passportNumber: z.string().min(1, "Passport Number is required"),
    countryOfIssue: z.string().min(1, "Country of Issue is required"),
    issueDate: z.string().min(1, "Issue Date is required"),
    expiryDate: z.string().min(1, "Expiry Date is required"),
    countryOfBirth: z.string().min(1, "Country of Birth is required"),
  }),

  // Unified Address (CR-06: Local Singapore Address removed)
  address: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().min(1, "Postal Code is required"),
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    unitNo: z.string().optional(),
  }),

  // Section 3: Academic Background (11.1 CR-07)
  education: z.array(z.object({
    id: z.number().optional(),
    country: z.string().min(1, "Country of Awarding Institution is required"),
    institution: z.string().min(1, "Awarding Institution / Board is required"),
    qualificationTitle: z.string().min(1, "Qualification Title / Level is required"),
  })).min(1, "At least one qualification is required"),

  // English Proficiency (11.2)
  englishTest: z.object({
    hasTakenTest: z.boolean().default(false),
    testType: z.string().optional(),
    testDate: z.string().optional(),
    isTentativeDate: z.boolean().optional(),
  }),

  // Section 4: Additional Information (12.1, 12.2, 12.3 CR-08, 12.4)
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

  // EGA Appointed Agent Contact (12.4)
  agent: z.object({
    isAgentRepresented: z.boolean().default(false),
    agentCountry: z.string().optional(),
    agencyName: z.string().optional(),
    counsellorName: z.string().optional(),
    counsellorEmail: z.string().optional(),
  }),

  // Section 5: Declaration & Consent (13.1 - 13.5)
  consent: z.object({
    dataProcessingConsent: z.boolean().default(true),
    partnerConsent: z.boolean().default(true),
    applicantDeclaration: z.boolean().default(true),
    marketingConsent: z.boolean().default(false),
  }),

  // Native Applicant Digital Signature (17.1 CR-12)
  digitalSignature: z.string().min(1, "Applicant signature is required"),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
