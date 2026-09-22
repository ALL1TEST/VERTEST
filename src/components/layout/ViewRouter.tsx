"use client";

import { useEffect } from "react";
import { useNavigation } from "@/lib/store";
import { ArticlesProvider } from "@/hooks/use-articles";
import type { Article, ViewType } from "@/lib/types";
import { HeroSection } from "@/components/blog/HeroSection";
import { CategoryLinks } from "@/components/blog/CategoryLinks";
import { LatestPosts } from "@/components/blog/LatestPosts";
import { TrendingPosts } from "@/components/blog/TrendingPosts";
import { CategorySpotlight } from "@/components/blog/CategorySpotlight";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { BlogListing } from "@/components/blog/BlogListing";
import { ArticleView } from "@/components/blog/ArticleView";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { PrivacyPage } from "@/components/pages/PrivacyPage";

function HomeView() {
  return (
    <>
      <HeroSection />
      <CategoryLinks />
      <LatestPosts />
      <TrendingPosts />
      <CategorySpotlight />
      <NewsletterSection />
    </>
  );
}

function ViewContent({ defaultView }: { defaultView?: ViewType }) {
  const { view, articleSlug } = useNavigation();
  const activeView = defaultView && view === "home" ? defaultView : view;

  if (activeView === "article" && articleSlug) {
    return <ArticleView slug={articleSlug} />;
  }

  if (activeView === "blog") {
    return <BlogListing />;
  }

  if (activeView === "about") {
    return <AboutPage />;
  }

  if (activeView === "contact") {
    return <ContactPage />;
  }

  if (activeView === "privacy") {
    return <PrivacyPage />;
  }

  return <HomeView />;
}

export function ViewRouter({
  initialArticles,
  initialView,
}: {
  initialArticles?: Article[];
  initialView?: ViewType;
}) {
  useEffect(() => {
    if (initialView) {
      useNavigation.setState({ view: initialView });
    }
  }, [initialView]);

  return (
    <ArticlesProvider initialArticles={initialArticles}>
      <ViewContent defaultView={initialView} />
    </ArticlesProvider>
  );
}
