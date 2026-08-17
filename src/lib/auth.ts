import { prisma } from "./prisma";
import { auth } from "@/auth";

/**
 * AUTHENTICATION SESSION USER RETRIEVAL
 * Fetches the active authenticated user from session & database.
 */
export async function getMockSessionUser() {
  const session = await auth();
  
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });
    if (user) return user;
  }

  // Fetch the active applicant user from the database
  let user = await prisma.user.findFirst({
    where: { role: "APPLICANT" },
    include: { profile: true }
  });

  if (!user) {
    user = await prisma.user.findFirst({
      include: { profile: true }
    });
  }

  if (!user) {
    throw new Error("No applicant account found in database. Please register an account first.");
  }

  return user;
}
