import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogListing } from "@/components/blog/BlogListing";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { getArticlesFromDb } from "@/lib/services/articles";
import { ArticlesProvider } from "@/hooks/use-articles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blog | Verdant",
  description: "Expert guides, care tips, and inspiration for your indoor garden.",
};

export default async function BlogPage() {
  const initialArticles = await getArticlesFromDb();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <ArticlesProvider initialArticles={initialArticles}>
          <BlogListing />
        </ArticlesProvider>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
