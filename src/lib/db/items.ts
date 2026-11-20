import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/db/demo-user";
import { getItemTypeOrder } from "@/lib/constants/item-types";

const RECENT_ITEMS_LIMIT = 10;

const ITEM_SUMMARY_SELECT = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  itemType: { select: { name: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

type ItemSummaryRow = Prisma.ItemGetPayload<{ select: typeof ITEM_SUMMARY_SELECT }>;

export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  typeName: string;
  tags: string[];
}

export interface ItemStats {
  items: number;
  favoriteItems: number;
}

function toItemSummary({ itemType, tags, ...item }: ItemSummaryRow): ItemSummary {
  return {
    ...item,
    typeName: itemType.name,
    tags: tags.map((tag) => tag.name),
  };
}

export async function getPinnedItems(email: string = DEMO_USER_EMAIL): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { user: { email }, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: ITEM_SUMMARY_SELECT,
  });

  return items.map(toItemSummary);
}

export async function getRecentItems(email: string = DEMO_USER_EMAIL): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { user: { email } },
    orderBy: { updatedAt: "desc" },
    take: RECENT_ITEMS_LIMIT,
    select: ITEM_SUMMARY_SELECT,
  });

  return items.map(toItemSummary);
}

export interface ItemTypeSummary {
  id: string;
  name: string;
  itemCount: number;
}

export async function getSystemItemTypes(
  email: string = DEMO_USER_EMAIL,
): Promise<ItemTypeSummary[]> {
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: {
      id: true,
      name: true,
      _count: { select: { items: { where: { user: { email } } } } },
    },
  });

  return itemTypes
    .map(({ _count, ...itemType }) => ({ ...itemType, itemCount: _count.items }))
    .toSorted((a, b) => getItemTypeOrder(a.name) - getItemTypeOrder(b.name));
}

export async function getItemStats(email: string = DEMO_USER_EMAIL): Promise<ItemStats> {
  const [items, favoriteItems] = await Promise.all([
    prisma.item.count({ where: { user: { email } } }),
    prisma.item.count({ where: { user: { email }, isFavorite: true } }),
  ]);

  return { items, favoriteItems };
}
