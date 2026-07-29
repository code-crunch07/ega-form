import { z } from "zod";

export const applicationSchema = z.object({
  applicantType: z.string().min(1, "Applicant Type is required"),
  countryOfResidence: z.string().min(1, "Country of Residence is required").optional(),
  
  school: z.string().min(1, "School / Faculty is required").optional(),
  programmeId: z.string().min(1, "Programme is required").optional(),
  intake: z.string().min(1, "Intake is required").optional(),

  courseType: z.string().optional(),
  courseLevel: z.string().optional(),
  progressionOption: z.string().optional(),

  personal: z.object({
    title: z.string().min(1, "Title is required"),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().optional(),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, { message: "Date of Birth must be a valid past date" }),
    nationality: z.string().min(1, "Nationality is required"),
    countryOfBirth: z.string().min(1, "Country of Birth is required").optional(),
    passportNumber: z.string().min(1, "NRIC / Passport Number is required"),
  }).optional(),

  contact: z.object({
    email: z.string().email("Invalid email format"),
    phoneCode: z.string().optional(),
    phone: z.string().min(4, "Phone number is required").regex(/^[0-9\s+-]+$/, "Invalid phone format"),
    altPhoneCode: z.string().optional(),
    altPhone: z.string().optional(),
    addressLine1: z.string().min(1, "Address is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal Code is required"),
  }).optional(),

  family: z.object({
    fatherName: z.string().min(1, "Parent's / Guardian's Name is required"),
    fatherRelationship: z.string().optional(),
    fatherEmail: z.string().optional(),
    fatherPhoneCode: z.string().optional(),
    fatherPhone: z.string().min(4, "Parent's / Guardian's Contact Number is required"),
  }).optional(),

  marketingSource: z.string().optional(),
  
  agent: z.object({
    isAgentSubmitted: z.boolean().optional(),
    agentCompanyName: z.string().optional(),
    counsellorName: z.string().optional(),
    agentEmail: z.string().optional(),
  }).optional(),

  education: z.array(z.object({
    id: z.number().optional(),
    qualification: z.string().min(1, "Qualification is required"),
    institution: z.string().min(1, "Institution is required"),
    major: z.string().min(1, "Field of study is required"),
    year: z.string().min(1, "Completion year is required")
  })).optional(),

  notEmployed: z.boolean().optional(),
  employment: z.array(z.object({
    employmentStatus: z.string().optional(),
    employer: z.string().optional(),
    position: z.string().optional(),
    startDate: z.string().optional(),
    description: z.string().optional(),
  })).optional(),

  englishTest: z.object({
    exempt: z.boolean().optional(),
    testName: z.string().optional(),
    overallScore: z.string().optional(),
    testDate: z.string().optional(),
    location: z.string().optional(),
  }).optional(),

  declarationAgreed: z.boolean().optional(),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
