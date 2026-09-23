import { db } from "@/lib/db";
import type { Article, Author } from "@/lib/types";
import { articles as baselineArticles } from "@/lib/data";

// Default author fallback if not loaded from user relation
export const defaultAuthor: Author = {
  name: "Elena Greenfield",
  role: "Horticulturist & Plant Consultant",
  avatar: "/images/author-elena.jpg",
  bio: "Certified horticulturist with 12 years of experience helping people create thriving indoor gardens.",
  url: "/author/elena-greenfield",
};

export function transformPostToArticle(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  published: boolean;
  featured: boolean;
  trending: boolean;
  coverImage?: string | null;
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
    coverImage: post.coverImage ?? null,
    date: post.createdAt.toISOString().split("T")[0],
    readTime: post.readTime || "5 min read",
    featured: post.featured,
    trending: post.trending,
  };
}

export async function createOrUpdateArticle(payload: {
  title: string;
  slug: string;
  type?: string;
  contentType?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  categorySlug?: string;
  coverImage?: string | null;
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

  // Find or create author user record
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

  // Find or create category record if specified
  let categoryId: string | undefined = undefined;
  if (payload.categorySlug) {
    const cat = await db.category.upsert({
      where: { slug: payload.categorySlug },
      update: { name: payload.category || payload.categorySlug },
      create: { name: payload.category || payload.categorySlug, slug: payload.categorySlug },
    });
    categoryId = cat.id;
  }

  // Persist directly and persistently to PostgreSQL Post table
  const post = await db.post.upsert({
    where: { slug: payload.slug },
    update: {
      title: payload.title,
      excerpt: payload.excerpt !== undefined ? (payload.excerpt || null) : undefined,
      content: payload.content || null,
      coverImage: payload.coverImage !== undefined ? (payload.coverImage || null) : undefined,
      categorySlug: payload.categorySlug || null,
      categoryId: categoryId || null,
      published: payload.published !== false,
      readTime: payload.readTime || "5 min read",
      featured: Boolean(payload.featured),
      trending: Boolean(payload.trending),
      ...(payload.date ? { createdAt: new Date(payload.date) } : {}),
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
      createdAt: payload.date ? new Date(payload.date) : new Date(),
    },
    include: {
      author: true,
      category: true,
    },
  });

  console.log(`[Verdant] Successfully persisted article [${payload.slug}] to Supabase PostgreSQL`);
  return transformPostToArticle(post);
}

export async function deleteArticleBySlug(slug: string): Promise<boolean> {
  try {
    await db.post.deleteMany({ where: { slug } });
    return true;
  } catch (e) {
    console.error("[Verdant] Database delete error:", e);
    throw e;
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
      return posts.map(transformPostToArticle);
    }
  } catch (error) {
    console.error("DB fetch error in getArticlesFromDb:", error);
  }

  // Fallback to baseline articles only if DB returns 0 articles or is unavailable
  let result = [...baselineArticles];

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
    console.error(`Error fetching article [${slug}] from database:`, error);
  }

  const fallback = baselineArticles.find((a) => a.slug === slug);
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
    console.error(`Error fetching related articles for [${slug}]:`, error);
  }

  const current = baselineArticles.find((a) => a.slug === slug);
  const others = baselineArticles.filter((a) => a.slug !== slug);
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
    console.error("Error fetching categories from database:", error);
  }

  // Derive categories from baseline articles
  const catMap = new Map<string, { id: string; name: string; slug: string }>();
  for (const a of baselineArticles) {
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
  return await db.subscriber.upsert({
    where: { email: email.trim().toLowerCase() },
    update: { active: true },
    create: { email: email.trim().toLowerCase(), active: true },
  });
}
