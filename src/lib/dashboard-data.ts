// Dashboard data selectors over the mock data. Replace with Prisma queries once the database is set up.

import {
  collections,
  items,
  itemTypes,
  type MockCollection,
  type MockItem,
  type MockItemType,
} from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export interface CollectionSummary {
  collection: MockCollection;
  itemCount: number;
  types: MockItemType[];
}

export function getItemType(itemTypeId: string): MockItemType | undefined {
  return itemTypes.find((type) => type.id === itemTypeId);
}

export function getDashboardStats(): DashboardStats {
  return {
    items: items.length,
    collections: collections.length,
    favoriteItems: items.filter((item) => item.isFavorite).length,
    favoriteCollections: collections.filter((collection) => collection.isFavorite).length,
  };
}

export function getRecentCollections(): CollectionSummary[] {
  return collections
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT)
    .map((collection) => {
      const collectionItems = items.filter((item) => item.collectionIds.includes(collection.id));
      const typeIds = new Set(collectionItems.map((item) => item.itemTypeId));

      return {
        collection,
        itemCount: collectionItems.length,
        types: itemTypes.filter((type) => typeIds.has(type.id)),
      };
    });
}

export function getPinnedItems(): MockItem[] {
  return items
    .filter((item) => item.isPinned)
    .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getRecentItems(): MockItem[] {
  return items
    .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_ITEMS_LIMIT);
}
