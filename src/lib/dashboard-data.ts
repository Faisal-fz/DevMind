// Item selectors over the mock data. Collections now come from src/lib/db/collections.ts.

import { items, itemTypes, type MockItem, type MockItemType } from "@/lib/mock-data";

const RECENT_ITEMS_LIMIT = 10;

export interface ItemStats {
  items: number;
  favoriteItems: number;
}

export function getItemType(itemTypeId: string): MockItemType | undefined {
  return itemTypes.find((type) => type.id === itemTypeId);
}

export function getItemStats(): ItemStats {
  return {
    items: items.length,
    favoriteItems: items.filter((item) => item.isFavorite).length,
  };
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
