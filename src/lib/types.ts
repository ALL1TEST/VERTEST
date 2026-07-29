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
