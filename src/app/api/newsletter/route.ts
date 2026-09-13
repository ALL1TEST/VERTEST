import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletterInDb } from "@/lib/services/articles";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const subscriber = await subscribeNewsletterInDb(email);

    return NextResponse.json({
      success: true,
      id: subscriber.id,
      email: subscriber.email,
    });
  } catch (error) {
    console.error("API /api/newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
