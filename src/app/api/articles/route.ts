import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getArticlesFromDb, createOrUpdateArticle } from "@/lib/services/articles";
import { verifyCmsAuth, cmsUnauthorizedResponse, cmsSuccessResponse, NO_CACHE_HEADERS } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

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

    return NextResponse.json(articles, {
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("API /api/articles error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = verifyCmsAuth(req);
  if (!auth.authenticated) {
    return cmsUnauthorizedResponse(auth.error || "Unauthorized", auth.status || 401);
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Verify contentType: Only blog posts (type: post) are allowed in /api/articles
    const contentType = (body.type || body.contentType || "post").toLowerCase();
    if (contentType === "page") {
      return NextResponse.json(
        { error: "Endpoint /api/articles only accepts blog posts (type: post), not static pages (type: page)" },
        { status: 400 }
      );
    }

    const title = (body.title || "").trim();
    const slug = (body.slug || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const article = await createOrUpdateArticle({
      title,
      slug,
      type: contentType,
      contentType,
      excerpt: body.excerpt || "",
      content: body.content || "",
      category: body.category || "General",
      categorySlug: body.categorySlug || (body.category ? body.category.toLowerCase().replace(/\s+/g, "-") : "general"),
      coverImage: body.coverImage || body.featuredImageUrl || undefined,
      author: typeof body.author === "object" ? body.author : undefined,
      published: body.published !== false && body.status !== "DRAFT",
      readTime: body.readTime || "5 min read",
      date: body.publishedAt ? body.publishedAt.split("T")[0] : (body.date || undefined),
      featured: Boolean(body.featured),
      trending: Boolean(body.trending),
    });

    // Revalidate paths for instant display across the blog
    try {
      revalidatePath("/api/articles");
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/${slug}`);
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return cmsSuccessResponse({
      ok: true,
      message: "Article published successfully to Verdant",
      data: article,
      article,
    });
  } catch (error: any) {
    console.error("API POST /api/articles error:", error);
    return NextResponse.json({ error: error.message || "Failed to publish article" }, { status: 500 });
  }
}
