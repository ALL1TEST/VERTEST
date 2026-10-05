import type { MetadataRoute } from "next";
import { getArticlesFromDb } from "@/lib/services/articles";
import { getPagesFromDb } from "@/lib/services/pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://verdantt.vercel.app").replace(/\/+$/, "");

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    // Normalize URL: remove trailing slash except root
    const normalizedUrl = entry.url === baseUrl ? baseUrl : entry.url.replace(/\/+$/, "");
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      sitemapEntries.push({
        ...entry,
        url: normalizedUrl,
      });
    }
  };

  // 1. Homepage
  addEntry({
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  // 2. Blog index
  addEntry({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  });

  // 3. Dynamic public pages from DB / service (handling canonical redirects)
  try {
    const pages = await getPagesFromDb();
    for (const page of pages) {
      if (page.published === false) continue;
      if (!page.slug) continue;

      const slug = page.slug.trim().toLowerCase();

      // Canonical redirect mapping:
      // /privacy-policy redirects to /privacy -> canonical is /privacy
      let canonicalPath: string;
      if (slug === "privacy-policy" || slug === "privacy") {
        canonicalPath = "/privacy";
      } else if (slug === "about") {
        canonicalPath = "/about";
      } else if (slug === "contact") {
        canonicalPath = "/contact";
      } else {
        canonicalPath = `/${slug.replace(/^\/+/, "")}`;
      }

      addEntry({
        url: `${baseUrl}${canonicalPath}`,
        lastModified: page.date ? new Date(page.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching pages from database:", error);
    addEntry({ url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    addEntry({ url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    addEntry({ url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }

  // 4. Published blog articles from DB / service
  // Note: /article/[slug] redirects to /blog/[slug], so canonical is /blog/[slug]
  try {
    const articles = await getArticlesFromDb();
    for (const article of articles) {
      if (!article.slug) continue;

      const cleanSlug = article.slug.trim().replace(/^\/+/, "");

      addEntry({
        url: `${baseUrl}/blog/${cleanSlug}`,
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: "weekly",
        priority: article.featured ? 0.9 : 0.8,
      });
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching articles from database:", error);
  }

  return sitemapEntries;
}
