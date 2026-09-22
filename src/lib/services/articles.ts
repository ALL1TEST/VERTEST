import { db } from "@/lib/db";
import type { Article, Author } from "@/lib/types";
import { articles as baselineArticles } from "@/lib/data";
import fs from "fs";
import path from "path";

// Default author fallback if not loaded from user relation
export const defaultAuthor: Author = {
  name: "Elena Greenfield",
  role: "Horticulturist & Plant Consultant",
  avatar: "/images/author-elena.jpg",
  bio: "Certified horticulturist with 12 years of experience helping people create thriving indoor gardens.",
  url: "/author/elena-greenfield",
};

// Persistent cache file on disk (works in local dev & persists in Vercel lambda /tmp)
const CACHE_FILE = path.join(
  process.env.TMPDIR || process.env.TEMP || "/tmp",
  "verdant-articles-cache.json"
);

function loadCachedArticles(): Article[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[Verdant] Failed to load cached articles from disk:", e);
  }
  return [...baselineArticles];
}

function saveCachedArticles(articlesList: Article[]): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(articlesList, null, 2), "utf8");
  } catch (e) {
    console.warn("[Verdant] Failed to write cached articles to disk:", e);
  }
}

// In-memory array initialized from disk cache or baseline
let memoryArticles: Article[] = loadCachedArticles();

export function transformPostToArticle(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  published: boolean;
  featured: boolean;
  trending: boolean;
  coverImage: string | null;
  readTime: string | null;
  categorySlug: string | null;
  createdAt: Date;
  author?: {
    name: string | null;
    role: string | null;
    avatar: string | null;
    bio: string | null;
    url: string | null;
  } | null;
  category?: {
    name: string;
    slug: string;
  } | null;
}): Article {
  const author: Author = post.author
    ? {
        name: post.author.name || defaultAuthor.name,
        role: post.author.role || defaultAuthor.role,
        avatar: post.author.avatar || defaultAuthor.avatar,
        bio: post.author.bio || defaultAuthor.bio,
        url: post.author.url || defaultAuthor.url,
      }
    : defaultAuthor;

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    content: post.content || "",
    category: post.category?.name || (post.categorySlug ? post.categorySlug.replace(/-/g, " ") : "General"),
    categorySlug: post.category?.slug || post.categorySlug || "general",
    author,
    coverImage: post.coverImage || "/images/article-beginner-plants.jpg",
    date: post.createdAt.toISOString().split("T")[0],
    readTime: post.readTime || "5 min read",
    featured: post.featured,
    trending: post.trending,
  };
}

export async function createOrUpdateArticle(payload: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  categorySlug?: string;
  coverImage?: string;
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
    bio?: string;
    url?: string;
  };
  published?: boolean;
  readTime?: string;
  date?: string;
  featured?: boolean;
  trending?: boolean;
}): Promise<Article> {
  const author: Author = {
    name: payload.author?.name || defaultAuthor.name,
    role: payload.author?.role || defaultAuthor.role,
    avatar: payload.author?.avatar || defaultAuthor.avatar,
    bio: payload.author?.bio || defaultAuthor.bio,
    url: payload.author?.url || defaultAuthor.url,
  };

  const articleItem: Article = {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt || "",
    content: payload.content || "",
    category: payload.category || "General",
    categorySlug: payload.categorySlug || "general",
    author,
    coverImage: payload.coverImage || "/images/article-beginner-plants.jpg",
    date: payload.date || new Date().toISOString().split("T")[0],
    readTime: payload.readTime || "5 min read",
    featured: Boolean(payload.featured),
    trending: Boolean(payload.trending),
  };

  // 1. Update memory & disk cache immediately
  const existingIdx = memoryArticles.findIndex((a) => a.slug === payload.slug);
  if (existingIdx >= 0) {
    memoryArticles[existingIdx] = articleItem;
  } else {
    // Put newly published articles at the very top of the blog!
    memoryArticles = [articleItem, ...memoryArticles];
  }
  saveCachedArticles(memoryArticles);

  // 2. Persist to Prisma database if connected
  try {
    let authorRecord = await db.user.findFirst({ where: { email: "elena@verdant.com" } });
    if (!authorRecord) {
      authorRecord = await db.user.create({
        data: {
          email: "elena@verdant.com",
          name: author.name,
          role: author.role,
          avatar: author.avatar,
          bio: author.bio,
          url: author.url,
        },
      });
    }

    let categoryId: string | undefined = undefined;
    if (payload.categorySlug) {
      const cat = await db.category.upsert({
        where: { slug: payload.categorySlug },
        update: { name: payload.category || payload.categorySlug },
        create: { name: payload.category || payload.categorySlug, slug: payload.categorySlug },
      });
      categoryId = cat.id;
    }

    await db.post.upsert({
      where: { slug: payload.slug },
      update: {
        title: payload.title,
        excerpt: payload.excerpt || null,
        content: payload.content || null,
        coverImage: payload.coverImage || null,
        categorySlug: payload.categorySlug || null,
        categoryId: categoryId || null,
        published: payload.published !== false,
        readTime: payload.readTime || "5 min read",
        featured: Boolean(payload.featured),
        trending: Boolean(payload.trending),
      },
      create: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt || null,
        content: payload.content || null,
        coverImage: payload.coverImage || null,
        categorySlug: payload.categorySlug || null,
        categoryId: categoryId || null,
        authorId: authorRecord.id,
        published: payload.published !== false,
        readTime: payload.readTime || "5 min read",
        featured: Boolean(payload.featured),
        trending: Boolean(payload.trending),
      },
    });
    console.log(`[Verdant] Successfully persisted article [${payload.slug}] to Prisma database`);
  } catch (dbError) {
    console.warn("[Verdant] Database save warning (cached fallback in use):", dbError);
  }

  return articleItem;
}

export async function deleteArticleBySlug(slug: string): Promise<boolean> {
  memoryArticles = memoryArticles.filter((a) => a.slug !== slug);
  saveCachedArticles(memoryArticles);

  try {
    await db.post.deleteMany({ where: { slug } });
    return true;
  } catch (e) {
    console.warn("[Verdant] Database delete warning:", e);
    return true;
  }
}

export async function getArticlesFromDb(params?: {
  categorySlug?: string;
  featured?: boolean;
  trending?: boolean;
  search?: string;
  limit?: number;
}): Promise<Article[]> {
  try {
    const where: Record<string, unknown> = {
      published: true,
    };

    if (params?.categorySlug) {
      where.categorySlug = params.categorySlug;
    }
    if (params?.featured !== undefined) {
      where.featured = params.featured;
    }
    if (params?.trending !== undefined) {
      where.trending = params.trending;
    }
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { excerpt: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const posts = await db.post.findMany({
      where,
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: params?.limit,
    });

    if (posts && posts.length > 0) {
      const dbArticles = posts.map(transformPostToArticle);
      const dbSlugs = new Set(dbArticles.map((a) => a.slug));
      const extra = memoryArticles.filter((a) => !dbSlugs.has(a.slug));
      return [...extra, ...dbArticles];
    }
  } catch (error) {
    console.warn("DB fetch failed, falling back to cached articles:", error);
  }

  // Fallback to memory store (baseline + CMS published)
  let result = [...memoryArticles];

  if (params?.categorySlug) {
    result = result.filter((a) => a.categorySlug === params.categorySlug);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }
  if (params?.featured !== undefined) {
    result = result.filter((a) => Boolean(a.featured) === params.featured);
  }
  if (params?.trending !== undefined) {
    result = result.filter((a) => Boolean(a.trending) === params.trending);
  }
  if (params?.limit) {
    result = result.slice(0, params.limit);
  }

  return result;
}

export async function getArticleBySlugFromDb(slug: string): Promise<Article | null> {
  try {
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
      },
    });

    if (post) return transformPostToArticle(post);
  } catch (error) {
    console.warn(`Error fetching article [${slug}] from database:`, error);
  }

  const fallback = memoryArticles.find((a) => a.slug === slug);
  return fallback || null;
}

export async function getRelatedArticlesFromDb(slug: string, limit = 3): Promise<Article[]> {
  try {
    const current = await db.post.findUnique({
      where: { slug },
      select: { categorySlug: true },
    });

    const posts = await db.post.findMany({
      where: {
        published: true,
        slug: { not: slug },
        ...(current?.categorySlug ? { categorySlug: current.categorySlug } : {}),
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (posts && posts.length > 0) {
      return posts.map(transformPostToArticle);
    }
  } catch (error) {
    console.warn(`Error fetching related articles for [${slug}]:`, error);
  }

  const current = memoryArticles.find((a) => a.slug === slug);
  const others = memoryArticles.filter((a) => a.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sameCategory = others.filter((a) => a.categorySlug === current.categorySlug);
  return sameCategory.length > 0 ? sameCategory.slice(0, limit) : others.slice(0, limit);
}

export async function getCategoriesFromDb() {
  try {
    const cats = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    if (cats && cats.length > 0) return cats;
  } catch (error) {
    console.warn("Error fetching categories from database:", error);
  }

  // Derive categories from memory articles
  const catMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const a of memoryArticles) {
    if (a.categorySlug && !catMap.has(a.categorySlug)) {
      catMap.set(a.categorySlug, {
        id: a.categorySlug,
        name: a.category,
        slug: a.categorySlug,
      });
    }
  }
  return Array.from(catMap.values());
}

export async function subscribeNewsletterInDb(email: string) {
  try {
    return await db.subscriber.upsert({
      where: { email: email.trim().toLowerCase() },
      update: { active: true },
      create: { email: email.trim().toLowerCase(), active: true },
    });
  } catch (e) {
    return { email, active: true };
  }
}
