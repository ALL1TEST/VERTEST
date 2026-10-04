import { ContactPage } from "@/components/pages/ContactPage";
import { getPageBySlugFromDb } from "@/lib/services/pages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugFromDb("contact");
  return {
    title: page?.seoTitle || "Contact Us",
    description: page?.seoDescription || page?.excerpt || "Contact Verdant",
  };
}

export const dynamic = "force-dynamic";

export default async function ContactPageRoute() {
  const initialPage = await getPageBySlugFromDb("contact");
  return <ContactPage initialPage={initialPage} />;
}
