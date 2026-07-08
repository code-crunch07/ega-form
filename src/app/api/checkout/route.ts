import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    // Since we do not have Stripe keys yet, we return a mock checkout URL
    // In a real scenario, we would use:
    // const session = await stripe.checkout.sessions.create({ ... })
    
    const mockCheckoutUrl = `/dashboard/payments?status=success&session_id=mock_session_${Date.now()}`;

    return NextResponse.json({ url: mockCheckoutUrl });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
