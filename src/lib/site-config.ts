export const siteConfig = {
  name: "Verdant",
  description:
    "Your trusted guide to growing beautiful indoor plants. Expert care tips, plant guides, and inspiration for plant lovers at every level.",
  url: "https://verdant.com",
  ogImage: "/images/hero-plant.jpg",
  author: "Verdant Editorial Team",
  creator: "Verdant",
  keywords: [
    "indoor plants",
    "houseplant care",
    "plant guides",
    "gardening tips",
    "plant care for beginners",
    "indoor gardening",
    "houseplants",
    "urban jungle",
    "plant propagation",
  ],
} as const;

export const navigationItems = [
  { label: "Plant Care", href: "/category/plant-care" },
  { label: "Beginner Guides", href: "/category/beginner-guides" },
  { label: "Design Ideas", href: "/category/design-ideas" },
  { label: "Plant Profiles", href: "/category/plant-profiles" },
  { label: "Tools & Supplies", href: "/category/tools" },
  { label: "About", href: "/about" },
] as const;

export const categories = [
  {
    name: "Plant Care",
    slug: "plant-care",
    description:
      "Essential tips and techniques for keeping your indoor plants healthy and thriving.",
    icon: "Sprout" as const,
  },
  {
    name: "Beginner Guides",
    slug: "beginner-guides",
    description:
      "Start your plant journey with our easy-to-follow guides for new plant parents.",
    icon: "BookOpen" as const,
  },
  {
    name: "Design Ideas",
    slug: "design-ideas",
    description:
      "Inspiring ways to style and arrange indoor plants in your living spaces.",
    icon: "Lamp" as const,
  },
  {
    name: "Plant Profiles",
    slug: "plant-profiles",
    description:
      "In-depth looks at popular and rare houseplant species.",
    icon: "Flower2" as const,
  },
  {
    name: "Tools & Supplies",
    slug: "tools",
    description:
      "Reviews and recommendations for pots, soil, tools, and plant accessories.",
    icon: "Shovel" as const,
  },
  {
    name: "Propagation",
    slug: "propagation",
    description:
      "Learn to multiply your plant collection through cuttings, division, and more.",
    icon: "Scissors" as const,
  },
] as const;
