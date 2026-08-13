import { z } from "zod";

export const applicationSchema = z.object({
  // Programme Selection
  applicantType: z.string().default("Local Student"),
  universityPartner: z.string().min(1, "University Partner is required"),
  studyMode: z.string().min(1, "Mode of Study is required"),
  courseType: z.enum(["Standalone Course", "Package Courses"]).default("Standalone Course"),
  academicLevel: z.string().optional(),
  programmeId: z.string().optional(),
  packageProgrammes: z.object({
    slot1: z.string().optional(), // Foundation
    slot2: z.string().optional(), // Diploma / Advanced Diploma
    slot3: z.string().optional(), // Undergraduate
  }).optional(),
  intake: z.string().min(1, "Intake is required"),

  // Pre-Course Counselling
  counsellingDeclaration: z.string().optional(),

  // Section 1: Personal Particulars
  personal: z.object({
    title: z.string().min(1, "Title is required"),
    fullName: z.string().min(2, "Full Name is required"),
    surname: z.string().min(1, "Surname is required (enter . if no surname)"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, { message: "Date of Birth must be a valid past date" }),
    maritalStatus: z.string().min(1, "Marital Status is required"),
    nationality: z.string().min(1, "Nationality is required"),
    email: z.string().email("Invalid email format"),
    phoneCountryCode: z.string().default("+65"),
    phone: z.string().min(4, "Contact Number is required"),
  }).optional(),

  // Conditional Parent / Guardian for Under-18
  guardian: z.object({
    isUnder18: z.boolean().optional(),
    fullName: z.string().optional(),
    email: z.string().optional(),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),

  // Section 2: Citizenship, Passport & Address
  passport: z.object({
    passportNumber: z.string().min(1, "Passport Number is required"),
    countryOfIssue: z.string().min(1, "Country of Issue is required"),
    issueDate: z.string().optional(),
    expiryDate: z.string().optional(),
    countryOfBirth: z.string().min(1, "Country of Birth is required"),
  }).optional(),

  overseasAddress: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().min(1, "Postal Code is required"),
    addressLine1: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    unitNo: z.string().optional(),
  }).optional(),

  localAddress: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    unitNo: z.string().optional(),
  }).optional(),

  // Section 3: Academic Background & Qualifications
  education: z.array(z.object({
    id: z.number().optional(),
    country: z.string().optional(),
    institution: z.string().optional(),
    qualificationTitle: z.string().optional(),
    schoolAttended: z.string().optional(),
    specialization: z.string().optional(),
    studyPeriodStart: z.string().optional(),
    studyPeriodEnd: z.string().optional(),
    modeOfStudy: z.string().optional(),
    completionStatus: z.string().optional(), // Completed, Currently Pursuing, Incomplete
    languageOfInstruction: z.string().optional(),
    dateAwarded: z.string().optional(),
    gpa: z.string().optional(),
    classification: z.string().optional(),
  })).optional(),

  // English Proficiency
  englishTest: z.object({
    hasTakenTest: z.boolean().optional(),
    testType: z.string().optional(),
    testDate: z.string().optional(),
    isTentativeDate: z.boolean().optional(),
  }).optional(),

  // Section 4: Additional Information
  additionalInfo: z.object({
    healthConditions: z.string().default("NA"),
    conductSuspended: z.boolean().optional(),
    conductConvicted: z.boolean().optional(),
    marketingChannel: z.string().optional(),
    marketingOtherText: z.string().optional(),
    referrerName: z.string().optional(),
  }).optional(),

  // EGA Appointed Agent Contact
  agent: z.object({
    isAgentRepresented: z.boolean().optional(),
    agentCountry: z.string().optional(),
    agencyName: z.string().optional(),
    counsellorName: z.string().optional(),
    counsellorEmail: z.string().optional(),
  }).optional(),

  // Section 5: Declaration & Consent
  consent: z.object({
    dataProcessingConsent: z.boolean().optional(),
    partnerConsent: z.boolean().optional(),
    applicantDeclaration: z.boolean().optional(),
    marketingConsent: z.boolean().optional(),
  }).optional(),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
