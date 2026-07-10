import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// SMTP connection credentials from environment variables
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || "no-reply@ega-university.edu";

const hasSmtpConfig = !!(host && user && pass);

let transporter: nodemailer.Transporter | null = null;

if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Dispatches an email notification. 
 * If SMTP keys are missing, falls back to logging the mail output to console/logs so it never crashes.
 */
export async function sendEmail({
  to,
  subject,
  html,
  userId = "System",
  actionName = "Email Sent"
}: {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  actionName?: string;
}) {
  try {
    if (transporter) {
      // Send real email via configured SMTP service
      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log(`[Email Service] Sent real email to ${to} (Subject: "${subject}")`);
    } else {
      // Fallback: log to console to keep app running and testable
      console.warn(`[Email Service] SMTP configuration missing. Mocking dispatch to: ${to}`);
      console.log(`----------------------------------------`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${html.replace(/<[^>]*>/g, " ")}`);
      console.log(`----------------------------------------`);
    }

    // Save to system audit logs for tracking
    await prisma.auditLog.create({
      data: {
        action: actionName,
        performedBy: userId,
        details: `Sent email to: ${to} | Subject: "${subject}"`
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}
