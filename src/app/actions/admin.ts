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

