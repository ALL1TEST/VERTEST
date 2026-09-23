"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article, ArticleCardVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/lib/store";

interface ArticleCardProps {
  article: Article;
  variant?: ArticleCardVariant;
  className?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({
  article,
  variant = "standard",
  className,
}: ArticleCardProps) {
  if (variant === "horizontal") {
    return <HorizontalCard article={article} className={className} />;
  }
  if (variant === "featured") {
    return <FeaturedCard article={article} className={className} />;
  }
  return <StandardCard article={article} className={className} />;
}

/* Standard Card — most versatile per Section 26 */
function StandardCard({ article, className }: ArticleCardProps) {
  const { navigateTo } = useNavigation();
  return (
    <article
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      role="button"
      tabIndex={0}
      onClick={() => navigateTo("article", article.slug)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo("article", article.slug); } }}
      aria-label={`Read: ${article.title}`}
    >
      <div className="relative block aspect-[16/10] w-full overflow-hidden bg-muted/20">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 bg-background/90 text-xs font-medium backdrop-blur-sm hover:bg-background"
        >
          {article.category}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2 sm:text-xl">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 border-t pt-3 mt-3">
          <time dateTime={article.date} className="text-xs text-muted-foreground">
            {formatDate(article.date)}
          </time>
          <span className="text-muted-foreground/40" aria-hidden="true">
            &middot;
          </span>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

/* Featured Card — large image, overlay text per Section 26 */
function FeaturedCard({ article, className }: ArticleCardProps) {
  const { navigateTo } = useNavigation();
  return (
    <article
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-ring",
        className
      )}
      role="button"
      tabIndex={0}
      onClick={() => navigateTo("article", article.slug)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo("article", article.slug); } }}
      aria-label={`Read: ${article.title}`}
    >
      <div className="relative block aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-muted/20">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <Badge
          variant="secondary"
          className="mb-3 bg-white/90 text-xs font-medium backdrop-blur-sm hover:bg-white"
        >
          {article.category}
        </Badge>
        <h3 className="font-serif text-xl leading-snug text-white sm:text-2xl md:text-3xl">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs font-medium text-white/70">{article.author.name}</span>
          <span className="text-white/40" aria-hidden="true">&middot;</span>
          <time dateTime={article.date} className="text-xs text-white/70">
            {formatDate(article.date)}
          </time>
          <span className="text-white/40" aria-hidden="true">&middot;</span>
          <span className="text-xs text-white/70">{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

/* Horizontal Card — image left, content right per Section 26 */
function HorizontalCard({ article, className }: ArticleCardProps) {
  const { navigateTo } = useNavigation();
  return (
    <article
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-ring sm:flex-row sm:items-stretch",
        className
      )}
      role="button"
      tabIndex={0}
      onClick={() => navigateTo("article", article.slug)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo("article", article.slug); } }}
      aria-label={`Read: ${article.title}`}
    >
      <div
        className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[40%] bg-muted/20"
        aria-hidden="true"
      >
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-6">
        <Badge variant="secondary" className="mb-2 w-fit text-xs font-medium">
          {article.category}
        </Badge>
        <h3 className="font-serif text-lg leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <time dateTime={article.date} className="text-xs text-muted-foreground">
            {formatDate(article.date)}
          </time>
          <span className="text-muted-foreground/40" aria-hidden="true">&middot;</span>
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
          <span className="ml-auto flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Read
            <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
