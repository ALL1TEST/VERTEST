import { Article } from "./types";
import { articleContent } from "./article-content";

export const authorElena = {
  name: "Elena Greenfield",
  role: "Horticulturist & Plant Consultant",
  avatar: "/images/author-elena.jpg",
  bio: "Certified horticulturist with 12 years of experience helping people create thriving indoor gardens.",
  url: "/author/elena-greenfield",
};

export const articles: Article[] = [
  {
    title: "The Complete Monstera Care Guide: From Propagation to Blooming",
    slug: "complete-monstera-care-guide",
    excerpt:
      "Everything you need to know about growing and maintaining stunning monstera plants, including watering schedules, light requirements, and common problems.",
    content: articleContent["complete-monstera-care-guide"],
    category: "Plant Care",
    categorySlug: "plant-care",
    author: authorElena,
    coverImage: "/images/article-monstera-care.jpg",
    date: "2025-01-10",
    readTime: "12 min read",
    featured: true,
  },
  {
    title: "15 Best Low-Light Plants That Thrive in Dark Apartments",
    slug: "best-low-light-plants",
    excerpt:
      "No sunny windows? No problem. These resilient plants flourish in low-light conditions and are perfect for apartments with limited natural light.",
    content: articleContent["best-low-light-plants"],
    category: "Beginner Guides",
    categorySlug: "beginner-guides",
    author: authorElena,
    coverImage: "/images/article-beginner-plants.jpg",
    date: "2025-01-08",
    readTime: "9 min read",
  },
  {
    title: "How to Create a Lush Plant Shelf That Looks Professionally Styled",
    slug: "styled-plant-shelf",
    excerpt:
      "Transform any shelf into a stunning botanical display with our expert styling tips, plant pairings, and arrangement principles.",
    content: articleContent["styled-plant-shelf"],
    category: "Design Ideas",
    categorySlug: "design-ideas",
    author: authorElena,
    coverImage: "/images/article-living-room.jpg",
    date: "2025-01-05",
    readTime: "7 min read",
  },
  {
    title: "Succulent Care 101: The Definitive Beginner Handbook",
    slug: "succulent-care-beginner-handbook",
    excerpt:
      "Master the art of growing succulents indoors with our comprehensive guide covering soil, watering, light, and troubleshooting.",
    content: articleContent["succulent-care-beginner-handbook"],
    category: "Beginner Guides",
    categorySlug: "beginner-guides",
    author: authorElena,
    coverImage: "/images/article-succulents.jpg",
    date: "2025-01-03",
    readTime: "10 min read",
  },
  {
    title: "Calathea Care: Why Your Prayer Plant Is Crispy and How to Fix It",
    slug: "calathea-care-crispy-leaves",
    excerpt:
      "Calatheas are famously finicky, but they reward patient caregivers with breathtaking foliage. Learn the exact conditions these tropical beauties need.",
    content: articleContent["calathea-care-crispy-leaves"],
    category: "Plant Profiles",
    categorySlug: "plant-profiles",
    author: authorElena,
    coverImage: "/images/article-calathea.jpg",
    date: "2024-12-28",
    readTime: "8 min read",
    trending: true,
  },
  {
    title: "The Best Air-Purifying Houseplants Backed by NASA Research",
    slug: "air-purifying-houseplants-nasa",
    excerpt:
      "Discover which houseplants are scientifically proven to clean indoor air, and how many you actually need to make a difference in your home.",
    content: articleContent["air-purifying-houseplants-nasa"],
    category: "Plant Care",
    categorySlug: "plant-care",
    author: authorElena,
    coverImage: "/images/article-air-purifying.jpg",
    date: "2024-12-25",
    readTime: "11 min read",
    trending: true,
  },
  {
    title: "Pothos Varieties: A Visual Guide to 12 Stunning Cultivars",
    slug: "pothos-varieties-visual-guide",
    excerpt:
      "From the classic Golden Pothos to the rare Cebu Blue, explore the diverse world of Epipremnum aureum cultivars for your collection.",
    content: articleContent["pothos-varieties-visual-guide"],
    category: "Plant Profiles",
    categorySlug: "plant-profiles",
    author: authorElena,
    coverImage: "/images/article-pothos.jpg",
    date: "2024-12-22",
    readTime: "8 min read",
  },
  {
    title: "Step-by-Step Guide to Repotting Your Houseplants Without Stress",
    slug: "repotting-houseplants-guide",
    excerpt:
      "Repotting doesn't have to be messy or stressful. Our horticulturist walks you through the process with clear, foolproof steps.",
    content: articleContent["repotting-houseplants-guide"],
    category: "Plant Care",
    categorySlug: "plant-care",
    author: authorElena,
    coverImage: "/images/article-repotting.jpg",
    date: "2024-12-18",
    readTime: "6 min read",
  },
  {
    title: "10 Rare Houseplants Worth the Investment for Serious Collectors",
    slug: "rare-houseplants-worth-investment",
    excerpt:
      "For plant enthusiasts ready to expand beyond the basics, these rare specimens offer unique beauty and the thrill of the hunt.",
    content: articleContent["rare-houseplants-worth-investment"],
    category: "Plant Profiles",
    categorySlug: "plant-profiles",
    author: authorElena,
    coverImage: "/images/article-rare-plants.jpg",
    date: "2024-12-15",
    readTime: "9 min read",
    trending: true,
  },
];

export const featuredArticle = articles.find((a) => a.featured)!;
export const latestArticles = articles.slice(0, 6);
export const trendingArticles = articles.filter((a) => a.trending);
export const plantCareArticles = articles.filter(
  (a) => a.categorySlug === "plant-care"
);
export const plantProfileArticles = articles.filter(
  (a) => a.categorySlug === "plant-profiles"
);

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = articles.find((a) => a.slug === currentSlug);
  if (!current) return articles.slice(0, limit);
  return articles
    .filter(
      (a) => a.slug !== currentSlug && a.categorySlug === current.categorySlug
    )
    .slice(0, limit);
}
