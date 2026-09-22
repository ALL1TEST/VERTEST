"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useNavigation } from "@/lib/store";
import { useArticles } from "@/hooks/use-articles";
import { siteConfig, categories } from "@/lib/site-config";
import type { BlogSort } from "@/lib/types";

const sortOptions: { label: string; value: BlogSort }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Popular", value: "popular" },
];

export function BlogListing() {
  const { articles } = useArticles();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<BlogSort>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const { blogCategory, navigateTo } = useNavigation();

  // Dynamically derive all categories from siteConfig + articles
  const allCategories = useMemo(() => {
    const map = new Map<string, { name: string; slug: string }>();
    categories.forEach((c) => map.set(c.slug, c));
    articles.forEach((a) => {
      if (a.categorySlug && !map.has(a.categorySlug)) {
        map.set(a.categorySlug, {
          name: a.category || a.categorySlug,
          slug: a.categorySlug,
        });
      }
    });
    return Array.from(map.values());
  }, [articles]);

  // Sync category from navigation store (e.g. clicking nav link)
  const effectiveCategory = blogCategory ?? activeCategory;

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Filter by category
    if (effectiveCategory) {
      result = result.filter((a) => a.categorySlug === effectiveCategory);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sort === "popular") {
      // Trending first, then newest
      result.sort((a, b) => {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }

    return result;
  }, [search, effectiveCategory, sort]);

  const handleCategoryClick = (slug: string) => {
    if (activeCategory === slug) {
      setActiveCategory(null);
      navigateTo("blog", null, null);
    } else {
      setActiveCategory(slug);
      navigateTo("blog", null, slug);
    }
  };

  const categoryName = effectiveCategory
    ? categories.find((c) => c.slug === effectiveCategory)?.name
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="border-b pb-8 pt-12">
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          {categoryName ?? "Blog"}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {categoryName
            ? `Articles about ${categoryName.toLowerCase()}`
            : "Expert guides, care tips, and inspiration for your indoor garden."}
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search articles"
            className="pl-10 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort toggle */}
          <div className="hidden sm:flex items-center gap-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  sort === opt.value
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter & Sort
          </Button>
        </div>
      </div>

      {/* Mobile filters (collapsible) */}
      {showFilters && (
        <div className="border-b pb-4 pt-3 sm:hidden">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sort by
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  sort === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 border-b py-4" role="tablist" aria-label="Filter by category">
        <button
          role="tab"
          aria-selected={!effectiveCategory}
          onClick={() => handleCategoryClick("" as unknown as string)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            !effectiveCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => {
          const articleCount = articles.filter(
            (a) => a.categorySlug === cat.slug
          ).length;
          if (articleCount === 0) return null;
          return (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={effectiveCategory === cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                effectiveCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat.name}
              <span className="ml-1.5 text-xs opacity-70">({articleCount})</span>
            </button>
          );
        })}
      </div>

      {/* Results info */}
      <div className="py-4">
        <p className="text-sm text-muted-foreground">
          {filteredArticles.length === 0
            ? "No articles found"
            : `${filteredArticles.length} article${filteredArticles.length !== 1 ? "s" : ""}`}
          {(search || effectiveCategory) && (
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
                navigateTo("blog", null, null);
              }}
              className="ml-1 text-primary underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Article Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="font-serif text-xl text-foreground">No articles found</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try adjusting your search terms or clearing your filters to discover more content.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
              navigateTo("blog", null, null);
            }}
          >
            View all articles
          </Button>
        </div>
      )}
    </div>
  );
}