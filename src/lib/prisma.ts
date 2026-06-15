import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prisma Client with PrismaPg adapter
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaFingerprint?: string;
};

/** Поля Product — при добавлении в schema.prisma дополняйте список */
const REQUIRED_PRODUCT_FIELDS = [
  "pageDescription",
  "displayContentGold",
  "displayContentCustomized",
  "showDisplayContent",
] as const;

function getSchemaFingerprint(): string {
  const product = Prisma.dmmf.datamodel.models.find((m) => m.name === "Product");
  const fieldNames = product?.fields.map((f) => f.name).sort().join(",") ?? "";
  const hasReview = Prisma.dmmf.datamodel.models.some((m) => m.name === "Review");
  return `${fieldNames}|review:${hasReview}`;
}

function createPrismaClient() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function isGeneratedClientCurrent(): boolean {
  const product = Prisma.dmmf.datamodel.models.find((m) => m.name === "Product");
  if (!product) return false;
  return REQUIRED_PRODUCT_FIELDS.every((name) =>
    product.fields.some((f) => f.name === name),
  );
}

function getPrismaClient(): PrismaClient {
  const fingerprint = getSchemaFingerprint();
  const cached = globalForPrisma.prisma;
  const cachedFingerprint = globalForPrisma.prismaSchemaFingerprint;

  if (
    cached &&
    cachedFingerprint === fingerprint &&
    isGeneratedClientCurrent()
  ) {
    return cached;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaSchemaFingerprint = fingerprint;
  return client;
}

export const prisma = getPrismaClient();

export default prisma;
