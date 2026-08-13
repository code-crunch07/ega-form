"use server";

import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { applicationSchema } from "@/lib/application-schema";

export async function calculateApplicationFee(universityPartner: string): Promise<number> {
  const partnerUpper = (universityPartner || "").toUpperCase();
  if (
    partnerUpper.includes("GLASGOW") ||
    partnerUpper.includes("KINGSTON") ||
    partnerUpper.includes("NCC")
  ) {
    return 360;
  }
  return 160;
}

export async function submitApplication(data: any) {
  const user = await getMockSessionUser();

  try {
    const validatedData = applicationSchema.parse(data);
    
    // Server-calculated application fee based on University Partner
    const feeAmount = await calculateApplicationFee(data.universityPartner || "Educare Global Academy");
    
    // Generate a mock application number
    const appNumber = `APP${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        appNumber,
        status: "Submitted",
        applicantType: data.applicantType || "Local",
        
        // Programme Selection
        campus: "Singapore Campus",
        school: data.universityPartner || "Educare Global Academy",
        programmeLevel: data.academicLevel || (data.courseType === "Package Courses" ? "Package (Foundation + Diploma + Degree)" : "Diploma"),
        programmeId: data.programmeId || "default-prog",
        intake: data.intake || "January 2026",
        studyMode: data.studyMode || "Full Time",
        scholarshipApply: false,
        
        // Declaration
        termsAccepted: true,
        privacyAccepted: true,
        digitalSignature: data.personal?.fullName || user.name || "Applicant",
        submittedAt: new Date(),
        
        // Nested Relations: Education
        educationHistory: {
          create: data.education?.map((ed: any) => ({
            qualification: ed.qualificationTitle || "Qualification",
            institution: ed.institution || "Institution",
            country: ed.country || "Singapore",
            major: ed.specialization || "General",
            grade: ed.gpa || ed.classification || "Pass",
          })) || []
        },

        // Nested Relations: English Tests
        englishTests: {
          create: data.englishTest && data.englishTest.hasTakenTest ? [{
            testName: data.englishTest.testType || "IELTS",
            score: "Passed",
            testDate: data.englishTest.testDate ? new Date(data.englishTest.testDate) : undefined,
          }] : []
        },
      }
    });

    // Update applicant profile with latest information
    if (data.personal) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          title: data.personal.title,
          firstName: data.personal.fullName,
          lastName: data.personal.surname,
          gender: data.personal.gender,
          dob: data.personal.dob ? new Date(data.personal.dob) : undefined,
          nationality: data.personal.nationality,
          passportNumber: data.passport?.passportNumber,
          
          phone: data.personal.phone,
          address: data.overseasAddress?.addressLine1,
          city: data.overseasAddress?.city,
          state: data.overseasAddress?.state,
          postalCode: data.overseasAddress?.postalCode,
          country: data.overseasAddress?.country,
          
          emergencyContactName: data.guardian?.fullName || data.personal.fullName,
          emergencyContactRelation: data.guardian?.isUnder18 ? "Parent / Guardian" : "Self",
          emergencyContactPhone: data.guardian?.phone || data.personal.phone,
        }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/applications");
    
    return { success: true, appNumber, feeAmount };
  } catch (error: any) {
    console.error("Failed to submit application", error);
    return { error: error.message || "Failed to submit application" };
  }
}
