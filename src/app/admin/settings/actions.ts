"use server";

import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function uploadLogo(formData: FormData) {
  const file = formData.get("logo") as File;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `logo-${randomUUID()}.${ext}`;
  const filePath = join(process.cwd(), "public/uploads", fileName);

  await writeFile(filePath, buffer);
  const logoUrl = `/uploads/${fileName}`;

  // Save to DB
  await prisma.systemSetting.upsert({
    where: { key: "INSTITUTION_LOGO" },
    update: { value: logoUrl },
    create: { key: "INSTITUTION_LOGO", value: logoUrl },
  });

  revalidatePath("/", "layout"); // Revalidate all layouts that might show the logo

  return { success: true, url: logoUrl };
}
