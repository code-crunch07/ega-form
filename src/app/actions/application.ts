"use server";

import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { applicationSchema } from "@/lib/application-schema";

// CR-09: Correct application fees: EGA = SGD 160, NCC/GCU/KU = SGD 320
export async function calculateApplicationFee(universityPartner: string): Promise<number> {
  const partnerUpper = (universityPartner || "").toUpperCase();
  if (
    partnerUpper.includes("GLASGOW") ||
    partnerUpper.includes("KINGSTON") ||
    partnerUpper.includes("NCC")
  ) {
    return 320;
  }
  return 160;
}

export async function submitApplication(data: any) {
  const user = await getMockSessionUser();

  try {
    const validatedData = applicationSchema.parse(data);
    
    // Server-calculated application fee based on University Partner (CR-09)
    const feeAmount = await calculateApplicationFee(validatedData.universityPartner);
    
    // Generate official EGA application reference number
    const appNumber = `EGA${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        appNumber,
        status: "Submitted",
        applicantType: validatedData.studentType || "Local Student",
        
        // Programme Selection
        campus: "Singapore Campus",
        school: validatedData.universityPartner,
        programmeLevel: validatedData.academicLevel || (validatedData.courseType === "Package Courses" ? "Package Pathway" : "Diploma"),
        programmeId: validatedData.programmeId || "default-prog",
        intake: validatedData.intake,
        studyMode: validatedData.studyMode,
        scholarshipApply: false,
        
        // Declaration & Native Signature (CR-12)
        termsAccepted: true,
        privacyAccepted: true,
        digitalSignature: validatedData.digitalSignature || validatedData.personal.fullName,
        submittedAt: new Date(),
        
        // Nested Relations: Education Qualifications (CR-07)
        educationHistory: {
          create: validatedData.education.map((ed: any) => ({
            qualification: ed.qualificationTitle,
            institution: ed.institution,
            country: ed.country,
            major: "General",
            grade: "Completed",
          }))
        },

        // Nested Relations: English Tests
        englishTests: {
          create: validatedData.englishTest.hasTakenTest ? [{
            testName: validatedData.englishTest.testType || "IELTS",
            score: "Submitted",
            testDate: validatedData.englishTest.testDate ? new Date(validatedData.englishTest.testDate) : undefined,
          }] : []
        },
      }
    });

    // Update applicant profile with latest information
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        title: validatedData.personal.title,
        firstName: validatedData.personal.fullName,
        lastName: validatedData.personal.surname,
        gender: validatedData.personal.gender,
        dob: validatedData.personal.dob ? new Date(validatedData.personal.dob) : undefined,
        nationality: validatedData.personal.nationality,
        passportNumber: validatedData.passport.passportNumber,
        
        phone: validatedData.personal.phone,
        address: validatedData.address.addressLine1,
        city: validatedData.address.city,
        state: validatedData.address.state,
        postalCode: validatedData.address.postalCode,
        country: validatedData.address.country,
        
        emergencyContactName: validatedData.emergencyContact.fullName,
        emergencyContactRelation: validatedData.emergencyContact.relation,
        emergencyContactPhone: validatedData.emergencyContact.phone,
      }
    });

    return {
      success: true,
      appNumber: application.appNumber,
      appId: application.id,
      feeAmount,
    };
  } catch (err: any) {
    console.error("Submission action error:", err);
    return {
      success: false,
      error: err.message || "Failed to submit application. Please check required fields.",
    };
  }
}
