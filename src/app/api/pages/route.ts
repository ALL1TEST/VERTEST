import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPagesFromDb, getPageBySlugFromDb, createOrUpdatePage } from "@/lib/services/pages";
import { verifyCmsAuth, cmsUnauthorizedResponse, NO_CACHE_HEADERS } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || undefined;

    if (slug) {
      const page = await getPageBySlugFromDb(slug);
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json(page, { headers: NO_CACHE_HEADERS });
    }

    const pages = await getPagesFromDb();
    return NextResponse.json(pages, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("API /api/pages error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = verifyCmsAuth(req);
  if (!auth.authenticated) {
    return cmsUnauthorizedResponse(auth.error || "Unauthorized", auth.status || 401);
  }

  try {
    const body = await req.json();
    if (!body || !body.slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const saved = await createOrUpdatePage(body);
    try {
      revalidatePath("/api/pages");
      revalidatePath("/");
      revalidatePath(`/${body.slug}`);
      revalidatePath("/contact");
      revalidatePath("/about");
      revalidatePath("/privacy-policy");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }
    return NextResponse.json({ ok: true, page: saved }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("API /api/pages POST error:", error);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
