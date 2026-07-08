import { prisma } from "./prisma";

/**
 * MOCK AUTHENTICATION SYSTEM
 * Since we don't have a real login system yet, this function fetches the 
 * first APPLICANT user from the database. If none exist, it creates a dummy 
 * user and returns it. This allows the dashboard to have a "logged in" user context.
 */
export async function getMockSessionUser() {
  let user = await prisma.user.findFirst({
    where: { role: "APPLICANT" },
    include: { profile: true }
  });

  if (!user) {
    // Create a dummy user if none exists
    user = await prisma.user.create({
      data: {
        email: "test.applicant@example.com",
        name: "Test Applicant",
        role: "APPLICANT",
        password: "dummy",
        profile: {
          create: {
            firstName: "Test",
            lastName: "Applicant",
            country: "United States",
            phone: "+1 555-0123"
          }
        }
      },
      include: { profile: true }
    });
  }

  return user;
}
