"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { articles } from "@/lib/data";
import { categories } from "@/lib/site-config";
import { useNavigation } from "@/lib/store";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSidebar() {
  const { navigateTo } = useNavigation();

  // Top 5 latest articles for the sidebar
  const sidebarLatest = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* LATEST ARTICLES */}
      <section aria-labelledby="sidebar-latest-heading">
        <h2
          id="sidebar-latest-heading"
          className="font-serif text-xl tracking-tight text-foreground"
        >
          Latest Articles
        </h2>
        <div className="mt-1 h-px w-full bg-border" />
        <ul className="mt-5 space-y-5">
          {sidebarLatest.map((article) => (
            <li key={article.slug}>
              <button
                onClick={() => navigateTo("article", article.slug)}
                className="group flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label={`Read: ${article.title}`}
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={article.coverImage}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-primary">
                    {article.category}
                  </span>
                  <span className="mt-1 block font-serif text-sm leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {article.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {formatDate(article.date)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* CATEGORIES */}
      <section aria-labelledby="sidebar-categories-heading">
        <h2
          id="sidebar-categories-heading"
          className="font-serif text-xl tracking-tight text-foreground"
        >
          Categories
        </h2>
        <div className="mt-1 h-px w-full bg-border" />
        <ul className="mt-5 space-y-1">
          {categories.map((cat) => {
            const count = articles.filter(
              (a) => a.categorySlug === cat.slug
            ).length;
            return (
              <li key={cat.slug}>
                <button
                  onClick={() => navigateTo("blog", null, cat.slug)}
                  className="group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {cat.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {count}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}