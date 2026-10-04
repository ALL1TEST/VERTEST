import { BlogListing } from "@/components/blog/BlogListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — All Articles",
  description: "Explore all indoor gardening articles, plant care guides, and expert tips on Verdant.",
};

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return <BlogListing />;
}
