"use client";

import { useNavigation } from "@/lib/store";
import { HeroSection } from "@/components/blog/HeroSection";
import { CategoryLinks } from "@/components/blog/CategoryLinks";
import { LatestPosts } from "@/components/blog/LatestPosts";
import { TrendingPosts } from "@/components/blog/TrendingPosts";
import { CategorySpotlight } from "@/components/blog/CategorySpotlight";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { AboutBlurb } from "@/components/blog/AboutBlurb";
import { BlogListing } from "@/components/blog/BlogListing";
import { ArticleView } from "@/components/blog/ArticleView";

function HomeView() {
  return (
    <>
      <HeroSection />
      <CategoryLinks />
      <LatestPosts />
      <TrendingPosts />
      <CategorySpotlight />
      <NewsletterSection />
      <AboutBlurb />
    </>
  );
}

export function ViewRouter() {
  const { view, articleSlug } = useNavigation();

  if (view === "article" && articleSlug) {
    return <ArticleView slug={articleSlug} />;
  }

  if (view === "blog") {
    return <BlogListing />;
  }

  return <HomeView />;
}
