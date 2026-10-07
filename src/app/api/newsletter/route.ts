import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletterInDb } from "@/lib/services/articles";
import { verifyCmsAuth, cmsUnauthorizedResponse, cmsSuccessResponse } from "@/lib/cms/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = verifyCmsAuth(req);
  if (!auth.authenticated) {
    return cmsUnauthorizedResponse(auth.error || "Unauthorized", auth.status || 401);
  }

  try {
    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return cmsSuccessResponse({ subscribers });
  } catch (error) {
    console.error("GET /api/newsletter error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
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
      active: subscriber.active,
      createdAt: subscriber.createdAt,
    });
  } catch (error) {
    console.error("API /api/newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
