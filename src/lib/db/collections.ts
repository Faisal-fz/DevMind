import { prisma } from "@/lib/prisma";
import { DEMO_USER_EMAIL } from "@/lib/db/demo-user";

const RECENT_COLLECTIONS_LIMIT = 6;

export interface CollectionItemType {
  id: string;
  name: string;
  itemCount: number;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Sorted by item count (most-used first), so types[0] is the dominant type.
  types: CollectionItemType[];
}

export interface CollectionStats {
  collections: number;
  favoriteCollections: number;
}

function summarizeTypes(itemTypes: { id: string; name: string }[]): CollectionItemType[] {
  const counts = new Map<string, CollectionItemType>();

  for (const { id, name } of itemTypes) {
    const entry = counts.get(id) ?? { id, name, itemCount: 0 };
    entry.itemCount += 1;
    counts.set(id, entry);
  }

  return [...counts.values()].toSorted(
    (a, b) => b.itemCount - a.itemCount || a.name.localeCompare(b.name),
  );
}

export async function getRecentCollections(
  email: string = DEMO_USER_EMAIL,
): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email } },
    orderBy: { createdAt: "desc" },
    take: RECENT_COLLECTIONS_LIMIT,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      items: {
        select: { item: { select: { itemType: { select: { id: true, name: true } } } } },
      },
    },
  });

  return collections.map(({ items, ...collection }) => ({
    ...collection,
    itemCount: items.length,
    types: summarizeTypes(items.map(({ item }) => item.itemType)),
  }));
}

export async function getCollectionStats(
  email: string = DEMO_USER_EMAIL,
): Promise<CollectionStats> {
  const [collections, favoriteCollections] = await Promise.all([
    prisma.collection.count({ where: { user: { email } } }),
    prisma.collection.count({ where: { user: { email }, isFavorite: true } }),
  ]);

  return { collections, favoriteCollections };
}
