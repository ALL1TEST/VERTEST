import { BlogListing } from "@/components/blog/BlogListing";
import { categories } from "@/lib/site-config";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  const name = cat ? cat.name : slug.replace(/-/g, " ");

  return {
    title: `${name} Articles`,
    description: cat?.description || `Explore ${name} guides and care advice on Verdant.`,
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <BlogListing initialCategory={slug} />;
}
