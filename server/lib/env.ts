import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  sessionSecret: required("SESSION_SECRET") || process.env.SESSION_SECRET || "default-session-secret-change-me",
  adminUsername: process.env.ADMIN_USERNAME ?? "admin",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL") || process.env.DATABASE_URL || process.env.MYSQL_URL || "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "",
};
