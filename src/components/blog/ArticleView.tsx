"use client";

import Image from "next/image";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { ArticleCard } from "./ArticleCard";
import { useNavigation } from "@/lib/store";
import { getArticleBySlug, getRelatedArticles } from "@/lib/data";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleView() {
  const { articleSlug, goHome, navigateTo } = useNavigation();
  const article = articleSlug ? getArticleBySlug(articleSlug) : undefined;
  const related = articleSlug ? getRelatedArticles(articleSlug, 3) : [];

  if (!article) {
    return (
      <section className="py-24 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-2xl text-foreground">
            Article not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            The article you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button className="mt-6" onClick={goHome}>
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Back to Home
          </Button>
        </div>
      </section>
    );
  }

  return (
    <article itemScope itemType="https://schema.org/Article">
      {/* Back navigation */}
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={goHome}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        </div>
      </div>

      {/* Featured image — full width per Skill Section 19 */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl sm:aspect-[21/9]">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Article header per Skill Section 19 */}
      <header className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4 text-xs font-medium">
          {article.category}
        </Badge>

        <h1
          itemProp="headline"
          className="font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
        >
          {article.title}
        </h1>

        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>

        {/* Author block per Skill Section 19 */}
        <div className="mt-6 flex items-center gap-4">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
            <Image
              src={article.author.avatar}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              itemProp="author"
              className="text-sm font-medium text-foreground"
            >
              {article.author.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {article.author.role}
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time itemProp="datePublished" dateTime={article.date}>
                {formatDate(article.date)}
              </time>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{article.readTime}</span>
            </span>
          </div>
        </div>
      </header>

      <Separator className="mx-auto mt-8 max-w-3xl sm:px-0 lg:px-8" />

      {/* Article body — prose typography per Skill Section 4 & 19 */}
      <div
        itemProp="articleBody"
        className="mx-auto max-w-3xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="prose-optimized">
          <ProseContent content={article.content} />
        </div>
      </div>

      {/* Author bio at end per Skill Section 19 */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Separator />
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:items-start">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={article.author.avatar}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Written by {article.author.name}
            </p>
            <p className="mt-0.5 text-xs font-medium text-primary">
              {article.author.role}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {article.author.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Related posts per Skill Section 19 */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t bg-muted/30 py-12 sm:py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
              id="related-heading"
              className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
            >
              Continue Reading
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((relArticle) => (
                <RelatedCard key={relArticle.slug} article={relArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

/* Simple Markdown-to-JSX renderer for article content */
function ProseContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let listItems: string[] = [];
  let listOrdered = false;
  let tableRows: string[][] = [];
  let inTable = false;
  let tableHeader = false;

  function flushList() {
    if (listItems.length === 0) return;
    const Tag = listOrdered ? "ol" : "ul";
    elements.push(
      <Tag
        key={`list-${i}`}
        className={listOrdered ? "list-decimal pl-6" : "list-disc pl-6"}
      >
        {listItems.map((item, idx) => (
          <li key={idx} className="mb-1.5 leading-relaxed">
            <InlineMarkdown text={item} />
          </li>
        ))}
      </Tag>
    );
    listItems = [];
  }

  function flushTable() {
    if (tableRows.length === 0) return;
    elements.push(
      <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {tableRows[0]?.map((cell, ci) => (
                <th
                  key={ci}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, ri) => (
              <tr
                key={ri}
                className="border-b last:border-b-0"
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-foreground"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    tableHeader = false;
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === "") {
      flushList();
      i++;
      continue;
    }

    // Table detection
    if (trimmed.startsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableHeader = true;
        i++;
        continue;
      }
      // Skip separator row
      if (/^\|\s*[-:]+/.test(trimmed)) {
        tableHeader = false;
        i++;
        continue;
      }
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      tableRows.push(cells);
      i++;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-10 mb-3 font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {trimmed.slice(4)}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-12 mb-3 font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {trimmed.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList();
      const quoteContent = trimmed.slice(2);
      const isMultiLine =
        i + 1 < lines.length && lines[i + 1].trim().startsWith(">");
      const quoteLines = [quoteContent];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith("> ")) {
        quoteLines.push(lines[j].trim().slice(2));
        j++;
      }
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="my-6 border-l-4 border-primary/40 bg-accent/50 py-4 pl-5 pr-4 italic text-foreground/90"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="leading-relaxed">
              <InlineMarkdown text={ql} />
            </p>
          ))}
        </blockquote>
      );
      i = j;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!listOrdered) {
        flushList();
        listOrdered = true;
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      i++;
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listOrdered) {
        flushList();
        listOrdered = false;
      }
      listItems.push(trimmed.slice(2));
      i++;
      continue;
    }

    // Horizontal rule
    if (trimmed === "---") {
      flushList();
      elements.push(
        <hr
          key={`hr-${i}`}
          className="my-8 border-border"
        />
      );
      i++;
      continue;
    }

    // Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-4 leading-[1.8] text-foreground/85"
      >
        <InlineMarkdown text={trimmed} />
      </p>
    );
    i++;
  }

  flushList();
  flushTable();

  return <>{elements}</>;
}

/* Handles inline markdown: **bold**, *italic*, `code` */
function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }
    if (match[1]) {
      parts.push(
        <strong key={`b-${key++}`} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <em key={`i-${key++}`}>{match[4]}</em>
      );
    } else if (match[5]) {
      parts.push(
        <code
          key={`c-${key++}`}
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground/80"
        >
          {match[6]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

/* Related article card that navigates to article view */
function RelatedCard({ article }: { article: (typeof import("@/lib/data").articles)[number] }) {
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
