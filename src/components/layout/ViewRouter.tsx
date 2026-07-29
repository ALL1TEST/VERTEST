"use client";

import { useNavigation } from "@/lib/store";
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

export function ViewRouter() {
  const { view, articleSlug } = useNavigation();

  if (view === "article" && articleSlug) {
    return <ArticleView slug={articleSlug} />;
  }

  if (view === "blog") {
    return <BlogListing />;
  }

  if (view === "about") {
    return <AboutPage />;
  }

  if (view === "contact") {
    return <ContactPage />;
  }

  if (view === "privacy") {
    return <PrivacyPage />;
  }

  return <HomeView />;
}