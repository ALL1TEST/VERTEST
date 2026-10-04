import { AboutPage } from "@/components/pages/AboutPage";
import { getPageBySlugFromDb } from "@/lib/services/pages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugFromDb("about");
  return {
    title: page?.seoTitle || "About Us",
    description: page?.seoDescription || page?.excerpt || "About Verdant",
  };
}

export const dynamic = "force-dynamic";

export default async function AboutPageRoute() {
  const initialPage = await getPageBySlugFromDb("about");
  return <AboutPage initialPage={initialPage} />;
}
