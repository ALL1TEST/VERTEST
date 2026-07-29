export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  url: string;
}

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: Author;
  coverImage: string;
  date: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
}

export type ArticleCardVariant = "standard" | "featured" | "horizontal";

export type ViewType = "home" | "blog" | "article";

export type BlogSort = "newest" | "oldest" | "popular";
