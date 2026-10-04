import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticleRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
