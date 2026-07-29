import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleSlug = searchParams.get("articleSlug");

  if (!articleSlug) {
    return NextResponse.json(
      { error: "articleSlug is required" },
      { status: 400 }
    );
  }

  const comments = await db.comment.findMany({
    where: { articleSlug },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    comments.map((c) => ({
      id: c.id,
      articleSlug: c.articleSlug,
      name: c.name,
      email: "",
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  try {
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

    const comment = await db.comment.create({
      data: { articleSlug, name: name.trim(), email: email.trim().toLowerCase(), content: content.trim() },
    });

    return NextResponse.json({
      id: comment.id,
      articleSlug: comment.articleSlug,
      name: comment.name,
      email: "",
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
