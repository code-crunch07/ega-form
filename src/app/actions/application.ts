"use server";

import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitApplication(data: any) {
  const user = await getMockSessionUser();

  try {
    // Generate a mock application number
    const appNumber = `APP${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

    const application = await prisma.application.create({
      data: {
        userId: user.id,
        appNumber,
        status: "Submitted",
        applicantType: data.applicantType || "Local",
        
        // Programme Selection
        campus: data.campus,
        programmeLevel: data.programmeLevel,
        programmeId: data.programmeId,
        intake: data.intake,
        studyMode: data.studyMode,
        scholarshipApply: data.scholarshipApply === "yes",
        
        // Declaration
        termsAccepted: true,
        privacyAccepted: true,
        digitalSignature: data.digitalSignature || user.name,
        submittedAt: new Date(),
        
        // Nested Relations: Education
        educationHistory: {
          create: data.education?.map((ed: any) => ({
            qualification: ed.qualification || "Unknown",
            institution: ed.institution || "Unknown",
            country: ed.country || "Unknown",
            board: ed.board,
            major: ed.major,
            startDate: ed.startDate ? new Date(ed.startDate) : undefined,
            endDate: ed.endDate ? new Date(ed.endDate) : undefined,
            grade: ed.cgpa || ed.percentage,
          })) || []
        },

        // Nested Relations: Employment
        employmentHistory: {
          create: data.employment?.map((emp: any) => ({
            currentlyEmployed: false,
            employer: emp.employer,
            position: emp.position,
            industry: emp.industry,
            yearsExperience: emp.yearsExperience ? parseInt(emp.yearsExperience) : undefined,
          })) || []
        },

        // Nested Relations: English Tests
        englishTests: {
          create: data.englishTest && data.englishTest.testName !== "None" ? [{
            testName: data.englishTest.testName,
            score: data.englishTest.overallScore || "0",
            testDate: data.englishTest.testDate ? new Date(data.englishTest.testDate) : undefined,
          }] : []
        },

        // We can optionally create Document models here if we have mock URLs
      }
    });

    // Also update their profile with any changes from Steps 3, 4, 5
    if (data.personal || data.contact || data.family) {
      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          title: data.personal?.title,
          firstName: data.personal?.firstName,
          lastName: data.personal?.lastName,
          gender: data.personal?.gender,
          dob: data.personal?.dob ? new Date(data.personal?.dob) : undefined,
          nationality: data.personal?.nationality,
          passportNumber: data.personal?.passportNumber,
          
          phone: data.contact?.phone,
          address: data.contact?.addressLine1,
          city: data.contact?.city,
          state: data.contact?.state,
          postalCode: data.contact?.postalCode,
          country: data.contact?.country,
          
          emergencyContactName: data.family?.fatherName || data.family?.guardianName,
          emergencyContactRelation: data.family?.fatherName ? "Father" : "Guardian",
          emergencyContactPhone: data.family?.emergencyPhone,
        }
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/applications");
    
    return { success: true, appNumber };
  } catch (error: any) {
    console.error("Failed to submit application", error);
    return { error: error.message || "Failed to submit application" };
  }
}
