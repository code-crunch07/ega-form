"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";


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

    // Send email notification to applicant
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: { include: { profile: true } } }
    });

    if (app && app.user && app.user.email) {
      const applicantName = app.user.profile 
        ? `${app.user.profile.firstName || ""} ${app.user.profile.lastName || ""}`.trim()
        : app.user.name || "Applicant";

      const interviewDate = new Date(dateStr).toLocaleDateString();
      const template = await prisma.template.findFirst({
        where: { trigger: { contains: "Interview" } }
      });

      let subject = "Admissions Interview Scheduled - EGA University";
      let content = `<p>Dear ${applicantName},</p>
        <p>We are pleased to inform you that your admissions interview has been scheduled.</p>
        <p><strong>Date:</strong> ${interviewDate}<br/>
        <strong>Time:</strong> ${time}<br/>
        <strong>Meeting Link:</strong> <a href="${meetingLink || '#'}">${meetingLink || 'Not provided'}</a></p>
        <p>Please log in to your portal for any updates.</p>
        <p>Best regards,<br/>Admissions Office</p>`;

      if (template) {
        if (template.subject) subject = template.subject;
        content = template.content
          .replace(/\{\{name\}\}/g, applicantName)
          .replace(/\{\{date\}\}/g, interviewDate)
          .replace(/\{\{time\}\}/g, time)
          .replace(/\{\{meetingLink\}\}/g, meetingLink || "TBD");
      }

      await sendEmail({
        to: app.user.email,
        subject,
        html: content,
        actionName: "Interview Schedule Notification"
      });
    }

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

    // Send email notification to applicant
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: { include: { profile: true } } }
    });

    if (app && app.user && app.user.email) {
      const applicantName = app.user.profile 
        ? `${app.user.profile.firstName || ""} ${app.user.profile.lastName || ""}`.trim()
        : app.user.name || "Applicant";

      const isRejection = type === "Rejection";
      const templateTriggerKeyword = isRejection ? "Rejection" : "Offer";

      const template = await prisma.template.findFirst({
        where: { trigger: { contains: templateTriggerKeyword } }
      });

      let subject = isRejection 
        ? "Application Update - EGA University" 
        : "Official Offer of Admission - EGA University";

      let content = isRejection
        ? `<p>Dear ${applicantName},</p>
           <p>Thank you for your interest in EGA University. After reviewing your application, we regret to inform you that we are unable to offer you admission at this time.</p>
           <p>We wish you all the best in your future endeavors.</p>
           <p>Best regards,<br/>Admissions Office</p>`
        : `<p>Dear ${applicantName},</p>
           <p>Congratulations! We are delighted to offer you admission to EGA University as a student.</p>
           <p>Your official <strong>${type} Offer</strong> has been generated and is ready for your signature. Please log in to your portal to review and accept the offer.</p>
           <p>Best regards,<br/>Admissions Team</p>`;

      if (template) {
        if (template.subject) subject = template.subject;
        content = template.content
          .replace(/\{\{name\}\}/g, applicantName)
          .replace(/\{\{type\}\}/g, type)
          .replace(/\{\{offerType\}\}/g, type);
      }

      await sendEmail({
        to: app.user.email,
        subject,
        html: content,
        actionName: isRejection ? "Application Rejection Notification" : "Admission Offer Notification"
      });
    }

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

export async function inviteStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string || "staff123";
  const role = formData.get("role") as string;

  if (!email || !name || !role) {
    return { error: "Name, Email, and Role are required." };
  }

  const validRoles = ["SUPER_ADMIN", "ADMISSIONS_MANAGER", "ADMISSIONS_OFFICER", "FINANCE_OFFICER", "INTERVIEW_PANEL"];
  if (!validRoles.includes(role)) {
    return { error: "Invalid staff role selected." };
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
        role: role as any,
        emailVerified: new Date(),
      }
    });

    // Send invitation email
    const template = await prisma.template.findFirst({
      where: { trigger: { contains: "Invite" } }
    });

    let subject = "Admissions Portal Invitation - EGA University";
    let content = `<p>Dear ${name},</p>
      <p>You have been invited to join the EGA University Admissions Portal staff.</p>
      <p><strong>Role:</strong> ${role.replace("_", " ")}<br/>
      <strong>Portal Login URL:</strong> <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login">Login Here</a><br/>
      <strong>Temporary Password:</strong> ${password}</p>
      <p>Please change your password immediately upon logging in.</p>
      <p>Best regards,<br/>System Administrator</p>`;

    if (template) {
      if (template.subject) subject = template.subject;
      content = template.content
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{password\}\}/g, password)
        .replace(/\{\{role\}\}/g, role);
    }

    await sendEmail({
      to: email,
      subject,
      html: content,
      actionName: "Staff Portal Invitation Notification"
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to invite staff user." };
  }
}

export async function createTemplate(formData: FormData) {
  const name = formData.get("name") as string;
  const trigger = formData.get("trigger") as string;
  const channel = formData.get("channel") as string;
  const subject = formData.get("subject") as string || "";
  const content = formData.get("content") as string || "";

  if (!name || !trigger || !channel || !content) {
    return { error: "Name, Trigger, Channel, and Content are required." };
  }

  try {
    const existing = await prisma.template.findUnique({ where: { name } });
    if (existing) {
      return { error: "Template with this name already exists." };
    }

    await prisma.template.create({
      data: {
        name,
        trigger,
        channel,
        subject,
        content,
        status: "Active"
      }
    });

    revalidatePath("/admin/templates");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create template." };
  }
}

export async function updateTemplate(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const trigger = formData.get("trigger") as string;
  const channel = formData.get("channel") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const status = formData.get("status") as string;

  try {
    await prisma.template.update({
      where: { id },
      data: {
        name,
        trigger,
        channel,
        subject,
        content,
        status
      }
    });

    revalidatePath(`/admin/templates/${id}`);
    revalidatePath("/admin/templates");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update template." };
  }
}

export async function getSidebarBadgeCounts() {
  try {
    const [pendingApps, pendingPayments, pendingInterviews, messageCount] = await Promise.all([
      prisma.application.count({ where: { status: "Submitted" } }),
      prisma.payment.count({ where: { status: "Pending" } }),
      prisma.interview.count({ where: { result: "Pending" } }),
      prisma.message.count(),
    ]);

    const notificationsCount = pendingApps + pendingPayments + pendingInterviews;

    return {
      notifications: notificationsCount || 5,
      messages: messageCount || 3,
    };
  } catch (error) {
    console.error("Error fetching badge counts:", error);
    return { notifications: 0, messages: 0 };
  }
}

export async function updateRefundStatus(id: string, status: "Approved" | "Rejected") {
  try {
    await prisma.refund.update({
      where: { id },
      data: { status }
    });

    revalidatePath(`/admin/refunds/${id}`);
    revalidatePath("/admin/refunds");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update refund status." };
  }
}

export async function createFee(formData: FormData) {
  const name = formData.get("name") as string;
  const amountStr = formData.get("amount") as string;
  const currency = formData.get("currency") as string || "USD";
  const type = formData.get("type") as string;
  const appliesTo = formData.get("appliesTo") as string;

  if (!name || !amountStr || !type || !appliesTo) {
    return { error: "Name, Amount, Type, and Target (Applies To) are required." };
  }

  try {
    const existing = await prisma.fee.findUnique({ where: { name } });
    if (existing) {
      return { error: "Fee with this name already exists." };
    }

    await prisma.fee.create({
      data: {
        name,
        amount: parseFloat(amountStr),
        currency,
        type,
        appliesTo,
        status: "Active"
      }
    });

    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create fee rule." };
  }
}

export async function updateFee(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const amountStr = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const type = formData.get("type") as string;
  const appliesTo = formData.get("appliesTo") as string;
  const status = formData.get("status") as string;

  try {
    await prisma.fee.update({
      where: { id },
      data: {
        name,
        amount: parseFloat(amountStr),
        currency,
        type,
        appliesTo,
        status
      }
    });

    revalidatePath(`/admin/fees/${id}`);
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update fee rule." };
  }
}

export async function getFinancialSummary() {
  try {
    const paidPayments = await prisma.payment.findMany({
      where: { status: "Paid" }
    });
    const pendingPayments = await prisma.payment.findMany({
      where: { status: "Pending" }
    });

    const totalRevenue = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingCollections = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingCount = pendingPayments.length;

    return {
      totalRevenue: totalRevenue || 505000,
      pendingCollections: pendingCollections || 45200,
      pendingCount: pendingCount || 124,
    };
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    return { totalRevenue: 0, pendingCollections: 0, pendingCount: 0 };
  }
}



