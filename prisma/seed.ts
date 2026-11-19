import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { ContentType, PrismaClient } from "../src/generated/prisma/client";
import {
  COLLECTIONS,
  DEMO_USER,
  SYSTEM_ITEM_TYPES,
  type SeedCollection,
  type SeedItem,
  type SystemTypeName,
} from "./seed-data";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type TypeIdMap = Record<SystemTypeName, string>;

const CONTENT_TYPE_BY_ITEM_TYPE: Record<SystemTypeName, ContentType> = {
  snippet: ContentType.TEXT,
  prompt: ContentType.TEXT,
  command: ContentType.TEXT,
  note: ContentType.TEXT,
  file: ContentType.FILE,
  image: ContentType.FILE,
  link: ContentType.URL,
};

async function seedDemoUser() {
  const password = await bcrypt.hash(DEMO_USER.password, 12);

  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, password },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password,
      isPro: false,
      emailVerified: new Date(),
    },
  });
}

// System types have userId = null. Postgres treats NULLs as distinct in unique
// constraints, so upsert on (name, userId) can't match them — look up by name instead.
async function seedSystemItemTypes(): Promise<TypeIdMap> {
  const ids = {} as TypeIdMap;

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null, isSystem: true },
    });

    const saved = existing
      ? await prisma.itemType.update({
          where: { id: existing.id },
          data: { icon: type.icon, color: type.color },
        })
      : await prisma.itemType.create({ data: { ...type, isSystem: true } });

    ids[type.name] = saved.id;
  }

  return ids;
}

async function seedItem(item: SeedItem, userId: string, typeIds: TypeIdMap) {
  const data = {
    title: item.title,
    description: item.description,
    contentType: CONTENT_TYPE_BY_ITEM_TYPE[item.type],
    content: item.content ?? null,
    language: item.language ?? null,
    url: item.url ?? null,
    itemTypeId: typeIds[item.type],
  };

  const existing = await prisma.item.findFirst({ where: { userId, title: item.title } });

  return existing
    ? prisma.item.update({ where: { id: existing.id }, data })
    : prisma.item.create({ data: { ...data, userId } });
}

async function seedCollection(collection: SeedCollection, userId: string, typeIds: TypeIdMap) {
  const existing = await prisma.collection.findFirst({
    where: { userId, name: collection.name },
  });

  const saved = existing
    ? await prisma.collection.update({
        where: { id: existing.id },
        data: { description: collection.description },
      })
    : await prisma.collection.create({
        data: { name: collection.name, description: collection.description, userId },
      });

  for (const item of collection.items) {
    const savedItem = await seedItem(item, userId, typeIds);

    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId: savedItem.id, collectionId: saved.id } },
      update: {},
      create: { itemId: savedItem.id, collectionId: saved.id },
    });
  }
}

async function main() {
  const user = await seedDemoUser();
  console.log(`Seeded demo user ${user.email}`);

  const typeIds = await seedSystemItemTypes();
  console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types`);

  for (const collection of COLLECTIONS) {
    await seedCollection(collection, user.id, typeIds);
    console.log(`Seeded collection "${collection.name}" (${collection.items.length} items)`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
