"use client";

import { ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { plantCareArticles, plantProfileArticles } from "@/lib/data";
import { useNavigation } from "@/lib/store";

interface CategorySpotlightProps {
  title: string;
  slug: string;
  articles: typeof plantCareArticles;
}

function CategoryColumn({ title, slug, articles }: CategorySpotlightProps) {
  const { navigateTo } = useNavigation();

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif text-lg tracking-tight text-foreground sm:text-xl">
          {title}
        </h3>
        <button
          onClick={() => navigateTo("blog", null, slug)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:underline"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} variant="horizontal" />
        ))}
      </div>
    </div>
  );
}

export function CategorySpotlight() {
  return (
    <section aria-labelledby="spotlight-heading" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="spotlight-heading"
          className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
        >
          Explore by Topic
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Dive deeper into the subjects you care about.
        </p>

        {/* 2-column on desktop, stacked on mobile per Section 18 */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <CategoryColumn
            title="Plant Care"
            slug="plant-care"
            articles={plantCareArticles}
          />
          <CategoryColumn
            title="Plant Profiles"
            slug="plant-profiles"
            articles={plantProfileArticles}
          />
        </div>
      </div>
    </section>
  );
}
