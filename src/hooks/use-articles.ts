"use client";

import { useState, useEffect } from "react";
import { articles as initialArticles } from "@/lib/data";
import type { Article } from "@/lib/types";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/articles", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return;
        setArticles(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const latestArticles = articles.slice(0, 6);
  const trendingArticles = articles.filter((a) => a.trending);
  const plantCareArticles = articles.filter(
    (a) => a.categorySlug === "plant-care"
  );
  const plantProfileArticles = articles.filter(
    (a) => a.categorySlug === "plant-profiles"
  );

  return {
    articles,
    featuredArticle,
    latestArticles,
    trendingArticles,
    plantCareArticles,
    plantProfileArticles,
    loading,
  };
}
