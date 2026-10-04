import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { getPageBySlugFromDb } from "@/lib/services/pages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugFromDb("privacy-policy");
  return {
    title: page?.seoTitle || "Privacy Policy",
    description: page?.seoDescription || page?.excerpt || "Verdant Privacy Policy",
  };
}

export const dynamic = "force-dynamic";

export default async function PrivacyPageRoute() {
  const initialPage = await getPageBySlugFromDb("privacy-policy");
  return <PrivacyPage initialPage={initialPage} />;
}
