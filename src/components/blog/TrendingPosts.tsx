"use client";

import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/use-articles";
import { useNavigation } from "@/lib/store";

export function TrendingPosts() {
  const { trendingArticles } = useArticles();
  const { navigateTo } = useNavigation();

  return (
    <section aria-labelledby="trending-heading" className="bg-muted/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="trending-heading"
              className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
            >
              Trending Now
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              What our readers are loving this week.
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden shrink-0 text-sm sm:inline-flex"
            onClick={() => navigateTo("blog")}
          >
            See all
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Different layout style per Section 18 — horizontal cards */}
        <div className="mt-8 flex flex-col gap-5 sm:gap-6">
          {trendingArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}
