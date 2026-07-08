"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getMockSessionUser } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const user = await getMockSessionUser();

  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const passportNumber = formData.get("passportNumber") as string;

    const dateOfBirth = dateOfBirthStr ? new Date(dateOfBirthStr) : undefined;

    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName,
        lastName,
        dob: dateOfBirth,
        phone,
        country,
        passportNumber,
      },
      update: {
        firstName,
        lastName,
        dob: dateOfBirth,
        phone,
        country,
        passportNumber,
      }
    });

    // Optionally update user table name
    if (firstName && lastName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: `${firstName} ${lastName}` }
      });
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile", error);
    return { error: error.message || "Failed to update profile." };
  }
}
