import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogViewWrapper } from "@/components/layout/BlogViewWrapper";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { getArticlesFromDb } from "@/lib/services/articles";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const initialArticles = await getArticlesFromDb();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <BlogViewWrapper initialArticles={initialArticles} />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
