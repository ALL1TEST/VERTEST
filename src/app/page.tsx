import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ViewRouter } from "@/components/layout/ViewRouter";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { siteConfig } from "@/lib/site-config";
import { getArticlesFromDb } from "@/lib/services/articles";
import { getPagesFromDb } from "@/lib/services/pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function HomePage() {
  const [initialArticles, initialPages] = await Promise.all([
    getArticlesFromDb(),
    getPagesFromDb(),
  ]);

  return (
    <>
      {/* Structured data for SEO per Skill Section 9 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      {/* Main content */}
      <main id="main-content" className="flex-1">
        <ViewRouter initialArticles={initialArticles} initialPages={initialPages} />
      </main>

      <Footer />

      {/* Floating scroll-to-top button */}
      <ScrollToTopButton />
    </>
  );
}
