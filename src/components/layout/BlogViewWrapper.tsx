"use client";

import { ArticlesProvider } from "@/hooks/use-articles";
import { BlogListing } from "@/components/blog/BlogListing";
import type { Article } from "@/lib/types";

export function BlogViewWrapper({ initialArticles }: { initialArticles?: Article[] }) {
  return (
    <ArticlesProvider initialArticles={initialArticles}>
      <BlogListing />
    </ArticlesProvider>
  );
}
