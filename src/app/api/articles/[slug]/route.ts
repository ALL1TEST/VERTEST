import { NextRequest, NextResponse } from "next/server";
import { getArticleBySlugFromDb, getRelatedArticlesFromDb } from "@/lib/services/articles";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const article = await getArticleBySlugFromDb(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const related = await getRelatedArticlesFromDb(slug, 3);

    return NextResponse.json({ article, related });
  } catch (error) {
    console.error("API /api/articles/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
