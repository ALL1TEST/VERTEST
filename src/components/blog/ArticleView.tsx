"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CommentSection } from "@/components/blog/CommentSection";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { useNavigation } from "@/lib/store";
import { useArticles } from "@/hooks/use-articles";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";

import { useState, useEffect } from "react";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleView({ slug }: { slug: string }) {
  const { articles } = useArticles();
  const contextArticle = articles.find((a) => a.slug === slug);
  const [article, setArticle] = useState(contextArticle || getArticleBySlug(slug));
  const [related, setRelated] = useState(() => {
    if (contextArticle) {
      const rel = articles
        .filter((a) => a.slug !== slug && a.categorySlug === contextArticle.categorySlug)
        .slice(0, 3);
      if (rel.length > 0) return rel;
    }
    return getRelatedArticles(slug, 3);
  });
  const { navigateTo } = useNavigation();

  useEffect(() => {
    if (contextArticle) {
      setArticle(contextArticle);
      const rel = articles
        .filter((a) => a.slug !== slug && a.categorySlug === contextArticle.categorySlug)
        .slice(0, 3);
      if (rel.length > 0) setRelated(rel);
    }
    let isMounted = true;
    fetch(`/api/articles/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.article) setArticle(data.article);
        if (Array.isArray(data.related) && data.related.length > 0) {
          setRelated(data.related);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug, contextArticle, articles]);

  if (!article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground">Article not found</h1>
        <p className="mt-2 text-muted-foreground">
          The article you are looking for does not exist or has been moved.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => navigateTo("blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Blog
        </Button>
      </div>
    );
  }

  return (
    <article itemScope itemType="https://schema.org/Article">
      {/* Breadcrumb / Back nav */}
      <div className="border-b">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigateTo("blog")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <span className="text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <button
            onClick={() => navigateTo("blog")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            Blog
          </button>
          <span className="text-muted-foreground/40" aria-hidden="true">
            /
          </span>
          <span className="text-sm text-muted-foreground line-clamp-1">
            {article.category}
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article Header + Body with Share Sidebar + Blog Sidebar
          — Share (left), Article Title (center), Latest Articles (right)
          all start at the same Y-axis */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[80px_1fr_320px]">
          {/* Left: Sticky Share sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ShareButtons
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={article.title}
                variant="sidebar"
              />
            </div>
          </aside>

          {/* Center: Article Header + Body */}
          <div className="min-w-0">
            {/* Inline share — mobile/tablet */}
            <div className="mb-6 lg:hidden">
              <ShareButtons
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={article.title}
                variant="inline"
              />
            </div>

            {/* Article Title — aligned with Share & Latest Articles on same Y */}
            <h1
              className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]"
              itemProp="headline"
            >
              {article.title}
            </h1>
            <p
              className="mt-4 text-lg leading-relaxed text-muted-foreground"
              itemProp="description"
            >
              {article.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground" itemProp="author">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{article.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5" itemProp="datePublished">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </span>
                <span className="text-muted-foreground/40" aria-hidden="true">
                  &middot;
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {article.readTime}
                </span>
              </div>
            </div>

            <Separator className="mt-8" />

            {/* Article Body */}
            <div className="prose-article mt-8" itemProp="articleBody">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </div>

          {/* Right: Blog Sidebar — Latest Articles & Categories */}
          <div className="hidden lg:block">
            <BlogSidebar />
          </div>
        </div>
      </div>

      {/* Author Bio — aligned with article text */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[80px_1fr_320px]">
          <div className="hidden lg:block" />
          <div>
            <Separator className="mb-8" />
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Written by
                </p>
                <p className="font-serif text-lg text-foreground">{article.author.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {article.author.bio}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Comments — aligned with article text */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[80px_1fr_320px]">
          <div className="hidden lg:block" />
          <div>
            <Separator className="mb-10" />
            <CommentSection articleSlug={slug} />
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="related-heading">
          <Separator className="mb-12" />
          <h2
            id="related-heading"
            className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
          >
            Related Articles
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => navigateTo("blog")}
            >
              View all articles
            </Button>
          </div>
        </section>
      )}
    </article>
  );
}