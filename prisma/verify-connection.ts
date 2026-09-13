import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

export async function verifyDatabase() {
  console.log("🔍 Checking Database Connection...");

  try {
    // 1. Check connection
    await prisma.$connect();
    console.log("✅ Successfully connected to PostgreSQL database!");

    // 2. Read test
    console.log("\n📊 Verifying Database Reads:");
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    const categoryCount = await prisma.category.count();
    const commentCount = await prisma.comment.count();
    const subscriberCount = await prisma.subscriber.count();
    const settingCount = await prisma.siteSetting.count();

    console.log(`- Users: ${userCount}`);
    console.log(`- Posts/Articles: ${postCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Comments: ${commentCount}`);
    console.log(`- Subscribers: ${subscriberCount}`);
    console.log(`- Site Settings: ${settingCount}`);

    // 3. Write test (CRUD cycle with cleanup)
    console.log("\n✍️ Verifying Database Writes (Create -> Read -> Delete):");
    const testEmail = `test_verification_${Date.now()}@verdant.test`;
    const created = await prisma.subscriber.create({
      data: {
        email: testEmail,
      },
    });
    console.log(`- Created test record (ID: ${created.id}, Email: ${created.email})`);

    const readBack = await prisma.subscriber.findUnique({
      where: { id: created.id },
    });
    if (!readBack) {
      throw new Error("Failed to read back created test record");
    }
    console.log("- Successfully read back test record");

    await prisma.subscriber.delete({
      where: { id: created.id },
    });
    console.log("- Cleaned up test record successfully (production tables remain clean)");

    console.log("\n🎉 ALL DATABASE CHECKS PASSED!");
    return true;
  } catch (error) {
    console.error("❌ Database verification failed:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  verifyDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
