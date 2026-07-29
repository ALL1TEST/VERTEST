import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ViewRouter } from "@/components/layout/ViewRouter";
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
        <ViewRouter />
      </main>

      <Footer />
    </>
  );
}
