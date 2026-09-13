"use client";

import { ArticleCard } from "./ArticleCard";
import { useArticles } from "@/hooks/use-articles";

export function HeroSection() {
  const { featuredArticle } = useArticles();

  if (!featuredArticle) return null;

  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16 lg:px-8">
      {/* Static hero — NOT a carousel per Skill Section 34 Anti-Patterns */}
      <div className="sr-only" id="hero-heading">
        <h2>Featured Article</h2>
      </div>
      <ArticleCard article={featuredArticle} variant="featured" />
    </section>
  );
}
