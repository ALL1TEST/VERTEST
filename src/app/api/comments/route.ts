import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleSlug = searchParams.get("articleSlug");

  if (!articleSlug) {
    return NextResponse.json(
      { error: "articleSlug is required" },
      { status: 400 }
    );
  }

  // Check global comment toggle setting
  const enableSetting = await db.siteSetting.findUnique({
    where: { key: "enable_comments" },
  });
  const commentsEnabled = enableSetting ? enableSetting.value !== "false" : true;

  // CANONICAL SECURITY & MODERATION RULE:
  // Public website MUST ONLY render comments that are APPROVED!
  const comments = await db.comment.findMany({
    where: {
      articleSlug,
      status: "APPROVED",
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      articleSlug: c.articleSlug,
      name: c.name,
      email: "",
      content: c.content,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    })),
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Comments-Enabled": String(commentsEnabled),
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check if comments are enabled
    const enableSetting = await db.siteSetting.findUnique({
      where: { key: "enable_comments" },
    });
    if (enableSetting && enableSetting.value === "false") {
      return NextResponse.json(
        { error: "Comments are currently closed." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { articleSlug, name, email, content } = body;

    if (!articleSlug || !name || !email || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    if (content.trim().length < 5) {
      return NextResponse.json(
        { error: "Comment must be at least 5 characters" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // 2. Auto Spam Detection
    let initialStatus = "APPROVED";

    const spamSetting = await db.siteSetting.findUnique({
      where: { key: "comment_auto_spam_detection" },
    });
    const autoSpamEnabled = spamSetting ? spamSetting.value !== "false" : true;

    if (autoSpamEnabled) {
      const cleanContent = content.trim().toLowerCase();
      const spamKeywords = [
        "viagra", "cialis", "casino", "poker", "slot machine", "free spins",
        "crypto giveaway", "bitcoin profit", "telegram @", "whatsapp +",
        "buy followers", "seo ranking", "backlinks", "loan offer", "porn",
        "hookup", "dating service", "investment opportunity"
      ];
      
      const linkCount = (content.match(/https?:\/\//gi) || []).length;
      const hasSpamKeyword = spamKeywords.some((kw) => cleanContent.includes(kw));

      if (linkCount >= 3 || hasSpamKeyword) {
        initialStatus = "SPAM";
      }
    }

    const comment = await db.comment.create({
      data: {
        articleSlug,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
        status: initialStatus,
      },
    });

    try {
      revalidatePath(`/blog/${articleSlug}`);
      revalidatePath("/blog");
    } catch {
      // ignore in environments without cache revalidation
    }

    return NextResponse.json({
      id: comment.id,
      articleSlug: comment.articleSlug,
      name: comment.name,
      email: "",
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt.toISOString(),
      message:
        initialStatus === "SPAM"
          ? "Your comment was flagged for review."
          : "Your comment has been posted successfully.",
    });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
