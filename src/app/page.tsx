import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/blog/HeroSection";
import { CategoryLinks } from "@/components/blog/CategoryLinks";
import { LatestPosts } from "@/components/blog/LatestPosts";
import { TrendingPosts } from "@/components/blog/TrendingPosts";
import { CategorySpotlight } from "@/components/blog/CategorySpotlight";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { AboutBlurb } from "@/components/blog/AboutBlurb";
import { siteConfig } from "@/lib/site-config";

/* Schema.org JSON-LD per Skill Section 9 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.svg`,
    },
  },
};

export default function HomePage() {
  return (
    <>
      {/* Structured data for SEO per Skill Section 9 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      {/* Main content — min-h-screen flex layout for sticky footer per Section 17 */}
      <main id="main-content" className="min-h-screen flex-1">
        {/* Homepage sections per Skill Section 18 recommended order */}
        <HeroSection />
        <CategoryLinks />
        <LatestPosts />
        <TrendingPosts />
        <CategorySpotlight />
        <NewsletterSection />
        <AboutBlurb />
      </main>

      <Footer />
    </>
  );
}
