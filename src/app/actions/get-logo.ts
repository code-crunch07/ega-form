"use server";

import prisma from "@/lib/prisma";

export async function getLogoUrl() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "INSTITUTION_LOGO" }
    });
    return setting?.value || null;
  } catch (e) {
    return null;
  }
}
