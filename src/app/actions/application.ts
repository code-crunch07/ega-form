"use server";

import { prisma } from "@/lib/prisma";
import { getMockSessionUser } from "@/lib/auth";
import { applicationSchema } from "@/lib/application-schema";

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

export async function saveDraftApplication(data: any, step: number = 1) {
  const user = await getMockSessionUser();

  try {
    let draft = await prisma.application.findFirst({
      where: { userId: user.id, status: "Draft" },
      orderBy: { updatedAt: "desc" },
    });

    const appNumber = draft?.appNumber || `EGA${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;
    const progLevel = data.academicLevel || (data.courseType === "Package Courses" ? "Package Pathway" : "Diploma");

    const draftPayload = JSON.stringify({
      ...data,
      step,
      education: data.education || data.educationList || [],
      educationList: data.educationList || data.education || [],
      certFiles: data.certFiles || [],
      digitalSignature: data.digitalSignature || "",
    });

    if (draft) {
      draft = await prisma.application.update({
        where: { id: draft.id },
        data: {
          currentStep: step,
          applicantType: data.studentType || draft.applicantType || "Local Student",
          school: data.universityPartner || draft.school,
          programmeLevel: progLevel || draft.programmeLevel,
          programmeId: data.programmeId || draft.programmeId,
          intake: data.intake || draft.intake,
          studyMode: data.studyMode || draft.studyMode,
          digitalSignature: data.digitalSignature || draft.digitalSignature,
          draftData: draftPayload,
        },
      });
    } else {
      draft = await prisma.application.create({
        data: {
          userId: user.id,
          appNumber,
          status: "Draft",
          currentStep: step,
          applicantType: data.studentType || "Local Student",
          campus: "Singapore Campus",
          school: data.universityPartner || "Educare Global Academy",
          programmeLevel: progLevel || "Diploma",
          programmeId: data.programmeId || "default-prog",
          intake: data.intake || "16 Nov 2026",
          studyMode: data.studyMode || "Full Time",
          digitalSignature: data.digitalSignature || "",
          draftData: draftPayload,
        },
      });
    }

    // Persist education history records if present
    const educationItems = Array.isArray(data.education) && data.education.length > 0 
      ? data.education 
      : (Array.isArray(data.educationList) && data.educationList.length > 0 ? data.educationList : []);

    if (educationItems.length > 0) {
      await prisma.educationHistory.deleteMany({ where: { applicationId: draft.id } });
      await prisma.educationHistory.createMany({
        data: educationItems.map((ed: any) => ({
          applicationId: draft.id,
          country: ed.country || "Singapore",
          institution: ed.institution || "",
          qualification: ed.qualificationTitle || ed.qualification || "",
        })),
      });
    }

    // Upsert profile info if provided
    if (data.personal || data.address || data.emergencyContact || data.passport) {
      const profilePayload: any = {};
      if (data.personal?.title) profilePayload.title = data.personal.title;
      if (data.personal?.fullName) profilePayload.firstName = data.personal.fullName;
      if (data.personal?.surname) profilePayload.lastName = data.personal.surname;
      if (data.personal?.gender) profilePayload.gender = data.personal.gender;
      if (data.personal?.dob) profilePayload.dob = new Date(data.personal.dob);
      if (data.personal?.nationality) profilePayload.nationality = data.personal.nationality;
      if (data.passport?.passportNumber) profilePayload.passportNumber = data.passport.passportNumber;
      if (data.personal?.phone) profilePayload.phone = data.personal.phone;
      if (data.address?.addressLine1) profilePayload.address = data.address.addressLine1;
      if (data.address?.city) profilePayload.city = data.address.city;
      if (data.address?.state) profilePayload.state = data.address.state;
      if (data.address?.postalCode) profilePayload.postalCode = data.address.postalCode;
      if (data.address?.country) profilePayload.country = data.address.country;
      if (data.emergencyContact?.fullName) profilePayload.emergencyContactName = data.emergencyContact.fullName;
      if (data.emergencyContact?.relation) profilePayload.emergencyContactRelation = data.emergencyContact.relation;
      if (data.emergencyContact?.phone) profilePayload.emergencyContactPhone = data.emergencyContact.phone;

      await prisma.profile.upsert({
        where: { userId: user.id },
        update: profilePayload,
        create: {
          userId: user.id,
          title: data.personal?.title || "Mr.",
          firstName: data.personal?.fullName || "",
          lastName: data.personal?.surname || "",
          gender: data.personal?.gender || "Male",
          dob: data.personal?.dob ? new Date(data.personal.dob) : undefined,
          nationality: data.personal?.nationality || "Singaporean",
          passportNumber: data.passport?.passportNumber || "",
          phone: data.personal?.phone || "",
          address: data.address?.addressLine1 || "",
          city: data.address?.city || "Singapore",
          state: data.address?.state || "Singapore",
          postalCode: data.address?.postalCode || "",
          country: data.address?.country || "Singapore",
          emergencyContactName: data.emergencyContact?.fullName || "",
          emergencyContactRelation: data.emergencyContact?.relation || "",
          emergencyContactPhone: data.emergencyContact?.phone || "",
        },
      });
    }

    return { success: true, draftId: draft.id, appNumber: draft.appNumber };
  } catch (err: any) {
    console.error("Save draft action error:", err);
    return { success: false, error: err.message || "Failed to save application draft." };
  }
}

export async function submitApplication(data: any) {
  const user = await getMockSessionUser();

  try {
    const validatedData = applicationSchema.parse(data);
    const feeAmount = await calculateApplicationFee(validatedData.universityPartner);

    // Check if user has an existing Draft application to update or create new
    const existingDraft = await prisma.application.findFirst({
      where: { userId: user.id, status: "Draft" },
      orderBy: { updatedAt: "desc" },
    });

    const appNumber = existingDraft?.appNumber || `EGA${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

    let application;

    if (existingDraft) {
      // Clear previous sub-records if any before adding final ones
      await prisma.educationHistory.deleteMany({ where: { applicationId: existingDraft.id } });
      await prisma.englishTest.deleteMany({ where: { applicationId: existingDraft.id } });

      application = await prisma.application.update({
        where: { id: existingDraft.id },
        data: {
          status: "Submitted",
          currentStep: 5,
          applicantType: validatedData.studentType || "Local Student",
          campus: "Singapore Campus",
          school: validatedData.universityPartner,
          programmeLevel: validatedData.academicLevel || (validatedData.courseType === "Package Courses" ? "Package Pathway" : "Diploma"),
          programmeId: validatedData.programmeId || "default-prog",
          intake: validatedData.intake,
          studyMode: validatedData.studyMode,
          scholarshipApply: false,
          termsAccepted: true,
          privacyAccepted: true,
          digitalSignature: validatedData.digitalSignature || validatedData.personal.fullName,
          submittedAt: new Date(),
          educationHistory: {
            create: validatedData.education.map((ed: any) => ({
              qualification: ed.qualificationTitle,
              institution: ed.institution,
              country: ed.country,
              major: "General",
              grade: "Completed",
            })),
          },
          englishTests: {
            create: validatedData.englishTest.hasTakenTest ? [{
              testName: validatedData.englishTest.testType || "IELTS",
              score: "Submitted",
              testDate: validatedData.englishTest.testDate ? new Date(validatedData.englishTest.testDate) : undefined,
            }] : [],
          },
        },
      });
    } else {
      application = await prisma.application.create({
        data: {
          userId: user.id,
          appNumber,
          status: "Submitted",
          currentStep: 5,
          applicantType: validatedData.studentType || "Local Student",
          campus: "Singapore Campus",
          school: validatedData.universityPartner,
          programmeLevel: validatedData.academicLevel || (validatedData.courseType === "Package Courses" ? "Package Pathway" : "Diploma"),
          programmeId: validatedData.programmeId || "default-prog",
          intake: validatedData.intake,
          studyMode: validatedData.studyMode,
          scholarshipApply: false,
          termsAccepted: true,
          privacyAccepted: true,
          digitalSignature: validatedData.digitalSignature || validatedData.personal.fullName,
          submittedAt: new Date(),
          educationHistory: {
            create: validatedData.education.map((ed: any) => ({
              qualification: ed.qualificationTitle,
              institution: ed.institution,
              country: ed.country,
              major: "General",
              grade: "Completed",
            })),
          },
          englishTests: {
            create: validatedData.englishTest.hasTakenTest ? [{
              testName: validatedData.englishTest.testType || "IELTS",
              score: "Submitted",
              testDate: validatedData.englishTest.testDate ? new Date(validatedData.englishTest.testDate) : undefined,
            }] : [],
          },
        },
      });
    }

    // Update applicant profile with latest information
    const profilePayload = {
      title: validatedData.personal.title,
      firstName: validatedData.personal.fullName,
      lastName: validatedData.personal.surname,
      gender: validatedData.personal.gender,
      dob: validatedData.personal.dob ? new Date(validatedData.personal.dob) : undefined,
      nationality: validatedData.personal.nationality,
      passportNumber: validatedData.passport.passportNumber,
      phone: validatedData.personal.phone,
      address: validatedData.address.addressLine1,
      city: validatedData.address.city || "Singapore",
      state: validatedData.address.state || "Singapore",
      postalCode: validatedData.address.postalCode,
      country: validatedData.address.country,
      emergencyContactName: validatedData.emergencyContact.fullName,
      emergencyContactRelation: validatedData.emergencyContact.relation,
      emergencyContactPhone: validatedData.emergencyContact.phone,
    };

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: profilePayload,
      create: {
        userId: user.id,
        ...profilePayload,
      },
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
