import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ViewRouter } from "@/components/layout/ViewRouter";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { getArticlesFromDb } from "@/lib/services/articles";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const initialArticles = await getArticlesFromDb();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <ViewRouter initialArticles={initialArticles} initialView="blog" />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
