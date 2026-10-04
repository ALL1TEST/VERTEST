"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/use-articles";

export function LatestPosts() {
  const { latestArticles } = useArticles();

  return (
    <section aria-labelledby="latest-heading" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="latest-heading"
              className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
            >
              Latest Articles
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fresh guides, tips, and inspiration for your indoor garden.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden shrink-0 text-sm sm:inline-flex"
          >
            <Link href="/blog">
              View all
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Card grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Mobile "View all" button */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="w-full max-w-xs"
          >
            <Link href="/blog">
              View all articles
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
