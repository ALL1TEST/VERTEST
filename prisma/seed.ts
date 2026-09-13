import { PrismaClient } from "@prisma/client";
import { articles, authorElena } from "../src/lib/data";
import { categories, siteConfig } from "../src/lib/site-config";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // 1. Seed Author / User
  console.log("Seeding author...");
  const author = await prisma.user.upsert({
    where: { email: "elena@verdant.com" },
    update: {
      name: authorElena.name,
      role: authorElena.role,
      avatar: authorElena.avatar,
      bio: authorElena.bio,
      url: authorElena.url,
    },
    create: {
      email: "elena@verdant.com",
      name: authorElena.name,
      role: authorElena.role,
      avatar: authorElena.avatar,
      bio: authorElena.bio,
      url: authorElena.url,
    },
  });

  // 2. Seed Categories
  console.log("Seeding categories...");
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const categoryRecord = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      },
    });
    categoryMap.set(cat.slug, categoryRecord.id);
  }

  // 3. Seed Articles (Posts)
  console.log("Seeding articles...");
  for (const article of articles) {
    const categoryId = categoryMap.get(article.categorySlug);

    await prisma.post.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        published: true,
        featured: !!article.featured,
        trending: !!article.trending,
        coverImage: article.coverImage,
        readTime: article.readTime,
        authorId: author.id,
        categorySlug: article.categorySlug,
        categoryId: categoryId || null,
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        published: true,
        featured: !!article.featured,
        trending: !!article.trending,
        coverImage: article.coverImage,
        readTime: article.readTime,
        authorId: author.id,
        categorySlug: article.categorySlug,
        categoryId: categoryId || null,
        createdAt: new Date(article.date),
      },
    });
  }

  // 4. Seed Site Settings
  console.log("Seeding site settings...");
  const settings = [
    { key: "site_name", value: siteConfig.name },
    { key: "site_description", value: siteConfig.description },
    { key: "site_url", value: siteConfig.url },
    { key: "site_og_image", value: siteConfig.ogImage },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }

  console.log("✅ Database seeded successfully!");
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
