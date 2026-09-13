import { db } from "@/lib/db";
import type { Article, Author } from "@/lib/types";

// Default author fallback if not loaded from user relation
const defaultAuthor: Author = {
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

    return posts.map(transformPostToArticle);
  } catch (error) {
    console.error("Error fetching articles from database:", error);
    return [];
  }
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

    if (!post) return null;
    return transformPostToArticle(post);
  } catch (error) {
    console.error(`Error fetching article [${slug}] from database:`, error);
    return null;
  }
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

    return posts.map(transformPostToArticle);
  } catch (error) {
    console.error(`Error fetching related articles for [${slug}]:`, error);
    return [];
  }
}

export async function getCategoriesFromDb() {
  try {
    return await db.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    return [];
  }
}

export async function subscribeNewsletterInDb(email: string) {
  return await db.subscriber.upsert({
    where: { email: email.trim().toLowerCase() },
    update: { active: true },
    create: { email: email.trim().toLowerCase(), active: true },
  });
}
