import { NextRequest, NextResponse } from "next/server";
import { getArticlesFromDb } from "@/lib/services/articles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined;
    const trending = searchParams.has("trending") ? searchParams.get("trending") === "true" : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const articles = await getArticlesFromDb({
      categorySlug,
      search,
      featured,
      trending,
      limit,
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("API /api/articles error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
