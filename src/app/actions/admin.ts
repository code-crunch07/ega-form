"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";


export async function createSchool(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { error: "School name is required." };
  }

  try {
    await prisma.school.create({
      data: {
        name,
        description,
      },
    });
    
    revalidatePath("/admin/schools");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create school." };
  }
}

export async function createProgramme(formData: FormData) {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const schoolId = formData.get("schoolId") as string;
  const level = formData.get("level") as string;
  const duration = formData.get("duration") as string;
  const creditsStr = formData.get("credits") as string;
  const feeStr = formData.get("applicationFee") as string;

  if (!code || !name || !schoolId || !level) {
    return { error: "Code, Name, School, and Level are required." };
  }

  try {
    await prisma.programme.create({
      data: {
        code,
        name,
        schoolId,
        level,
        duration: duration || "TBD",
        credits: parseInt(creditsStr) || 0,
        applicationFee: parseFloat(feeStr) || 0,
        status: "Active"
      },
    });
    
    revalidatePath("/admin/programmes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create programme." };
  }
}

export async function createIntake(formData: FormData) {
  const name = formData.get("name") as string;
  const openDateStr = formData.get("openDate") as string;
  const closeDateStr = formData.get("closeDate") as string;
  const capacityStr = formData.get("capacity") as string;

  if (!name || !openDateStr || !closeDateStr) {
    return { error: "Name, Open Date, and Close Date are required." };
  }

  try {
    await prisma.intake.create({
      data: {
        name,
        openDate: new Date(openDateStr),
        closeDate: new Date(closeDateStr),
        capacity: capacityStr ? parseInt(capacityStr) : null,
        status: "Open" // Just defaulting to open for now
      },
    });
    
    revalidatePath("/admin/intakes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create intake." };
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  try {
    await prisma.application.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${id}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update application status." };
  }
}

export async function getAdminSession() {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role === "APPLICANT") {
    return null;
  }
  return session;
}

export async function seedDefaultAdmin() {
  try {
    // Check if the default admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: {
          not: "APPLICANT"
        }
      }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@educare.com",
          password: hashedPassword,
          role: "SUPER_ADMIN",
        }
      });
      return { success: true, seeded: true };
    }

    return { success: true, seeded: false };
  } catch (error: any) {
    console.error("Failed to seed default admin:", error);
    return { error: error.message || "Failed to seed default admin." };
  }
}

export async function createApplicant(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string || "applicant123";
  const phone = formData.get("phone") as string;
  const country = formData.get("country") as string;

  if (!email || !name) {
    return { error: "Name and Email are required." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "User already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "APPLICANT",
        emailVerified: new Date(),
        profile: {
          create: {
            firstName: name.split(" ")[0] || name,
            lastName: name.split(" ").slice(1).join(" ") || "",
            phone,
            country,
          }
        }
      }
    });

    revalidatePath("/admin/applicants");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create applicant." };
  }
}

export async function scheduleInterview(formData: FormData) {
  const applicationId = formData.get("applicationId") as string;
  const interviewerId = formData.get("interviewerId") as string || null;
  const dateStr = formData.get("date") as string;
  const time = formData.get("time") as string;
  const meetingLink = formData.get("meetingLink") as string;

  if (!applicationId || !dateStr || !time) {
    return { error: "Application, Date, and Time are required." };
  }

  try {
    await prisma.interview.create({
      data: {
        applicationId,
        interviewerId: interviewerId || undefined,
        date: new Date(dateStr),
        time,
        meetingLink: meetingLink || undefined,
        result: "Pending"
      }
    });

    // Update application status to Interview
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "Interview" }
    });

    revalidatePath("/admin/interviews");
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${applicationId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to schedule interview." };
  }
}

export async function generateOffer(formData: FormData) {
  const applicationId = formData.get("applicationId") as string;
  const type = formData.get("type") as string;
  const documentUrl = formData.get("documentUrl") as string || "/offers/sample-offer.pdf";

  if (!applicationId || !type) {
    return { error: "Application and Offer Type are required." };
  }

  try {
    await prisma.offer.create({
      data: {
        applicationId,
        type,
        documentUrl,
        status: "Issued"
      }
    });

    // Update application status based on type
    const newStatus = type === "Rejection" ? "Rejected" : "Offered";
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus }
    });

    revalidatePath("/admin/offers");
    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${applicationId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to generate offer." };
  }
}

export async function createCampus(formData: FormData) {
  const name = formData.get("name") as string;
  const country = formData.get("country") as string;
  const city = formData.get("city") as string;
  const capacityStr = formData.get("capacity") as string;
  const status = formData.get("status") as string || "Active";
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!name || !country || !city || !capacityStr) {
    return { error: "Name, Country, City, and Capacity are required." };
  }

  try {
    await prisma.campus.create({
      data: {
        name,
        country,
        city,
        capacity: parseInt(capacityStr) || 0,
        status,
        address: address || null,
        phone: phone || null,
        email: email || null
      }
    });

    revalidatePath("/admin/campuses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create campus." };
  }
}

export async function createScholarship(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const amountStr = formData.get("amount") as string;
  const status = formData.get("status") as string || "Active";

  if (!name) {
    return { error: "Scholarship Name is required." };
  }

  try {
    await prisma.scholarship.create({
      data: {
        name,
        description: description || null,
        amount: amountStr ? parseFloat(amountStr) : null,
        status
      }
    });

    revalidatePath("/admin/scholarships");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create scholarship." };
  }
}


