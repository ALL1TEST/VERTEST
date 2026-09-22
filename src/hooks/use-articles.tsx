"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { articles as baselineArticles } from "@/lib/data";
import type { Article } from "@/lib/types";

interface ArticlesContextValue {
  articles: Article[];
  featuredArticle: Article | undefined;
  latestArticles: Article[];
  trendingArticles: Article[];
  plantCareArticles: Article[];
  plantProfileArticles: Article[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null);

export function ArticlesProvider({
  initialArticles,
  children,
}: {
  initialArticles?: Article[];
  children: React.ReactNode;
}) {
  const [articles, setArticles] = useState<Article[]>(
    initialArticles && initialArticles.length > 0 ? initialArticles : baselineArticles
  );
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch fresh articles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const value = useMemo(() => {
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
      refetch: fetchArticles,
    };
  }, [articles, loading]);

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles(): ArticlesContextValue {
  const context = useContext(ArticlesContext);
  if (context) return context;

  // Fallback for standalone usage outside provider
  const [articles, setArticles] = useState<Article[]>(baselineArticles);
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
    refetch: async () => {},
  };
}
