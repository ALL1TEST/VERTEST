import { PrismaClient } from '@prisma/client';

const SUPABASE_POSTGRES_URL =
  "postgresql://postgres.xngpgftvnadjtztkvkgc:fnj%40gnfE53dj%40e@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=verdant";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.includes("xeffsctpfbwmwdsorhns") || envUrl.startsWith("file:")) {
    return SUPABASE_POSTGRES_URL;
  }
  if (envUrl.includes("supabase.com") && !envUrl.includes("schema=")) {
    const separator = envUrl.includes("?") ? "&" : "?";
    return `${envUrl}${separator}schema=verdant`;
  }
  return envUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
