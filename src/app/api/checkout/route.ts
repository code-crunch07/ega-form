import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16" as any,
    })
  : null;

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // If Stripe secret key is not set, fall back to mock checkout flow so it remains functional
    if (!stripe) {
      const mockCheckoutUrl = `/dashboard/payments?status=success&session_id=mock_session_${Date.now()}&application_id=${applicationId}`;
      return NextResponse.json({ url: mockCheckoutUrl });
    }

    // Create a real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Application Fee - Ref: ${application.appNumber}`,
              description: `Application processing fee for admission enrollment.`,
            },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dashboard/payments?status=success&session_id={CHECKOUT_SESSION_ID}&application_id=${applicationId}`,
      cancel_url: `${baseUrl}/dashboard/payments?status=cancel&application_id=${applicationId}`,
      metadata: {
        applicationId: application.id,
        appNumber: application.appNumber,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
