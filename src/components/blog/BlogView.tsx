"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigation } from "@/lib/store";
import { articles } from "@/lib/data";
import { categories } from "@/lib/site-config";
import type { BlogSort } from "@/lib/types";

const POSTS_PER_PAGE = 9;

const sortOptions: { value: BlogSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export function BlogView() {
  const { goHome, navigateTo } = useNavigation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<BlogSort>("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...articles];

    if (activeCategory) {
      result = result.filter((a) => a.categorySlug === activeCategory);
    }

    if (sort === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return result;
  }, [activeCategory, sort]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  function handleCategoryChange(slug: string | null) {
    setActiveCategory(slug);
    setPage(1);
  }

  return (
    <section aria-labelledby="blog-heading" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back to home */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={goHome}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Back to Home
        </Button>

        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              id="blog-heading"
              className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl"
            >
              All Articles
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}{" "}
              {activeCategory ? `in ${categories.find((c) => c.slug === activeCategory)?.name}` : ""}
            </p>
          </div>

          {/* Sort control */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v as BlogSort);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]" aria-label="Sort articles">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          <button
            role="tab"
            aria-selected={activeCategory === null}
            onClick={() => handleCategoryChange(null)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const count = articles.filter(
              (a) => a.categorySlug === cat.slug
            ).length;
            return (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={activeCategory === cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Article grid */}
        {paginated.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {paginated.map((article) => (
              <BlogArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground">
              No articles found in this category.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleCategoryChange(null)}
            >
              View all articles
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-10 flex items-center justify-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => setPage(p)}
                className={`h-9 w-9 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {p}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              Next
            </Button>
          </nav>
        )}
      </div>
    </section>
  );
}

/* Wrapper card that navigates to article view on click */
function BlogArticleCard({ article }: { article: (typeof articles)[number] }) {
  const { navigateTo } = useNavigation();
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Read: ${article.title}`}
      onClick={() => navigateTo("article", article.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateTo("article", article.slug);
        }
      }}
      className="cursor-pointer"
    >
      <ArticleCard article={article} />
    </div>
  );
}
