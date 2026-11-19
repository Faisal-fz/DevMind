import { FolderOpen, FolderHeart, Layers, Star, type LucideIcon } from "lucide-react";
import { connection } from "next/server";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats } from "@/lib/db/items";

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
}

const GRID_CLASS = "grid grid-cols-2 gap-4 lg:grid-cols-4";
const SKELETON_COUNT = 4;

export default async function StatsCards() {
  await connection();
  const [itemStats, collectionStats] = await Promise.all([getItemStats(), getCollectionStats()]);

  const cards: StatCard[] = [
    { label: "Items", value: itemStats.items, icon: Layers },
    { label: "Collections", value: collectionStats.collections, icon: FolderOpen },
    { label: "Favorite Items", value: itemStats.favoriteItems, icon: Star },
    { label: "Favorite Collections", value: collectionStats.favoriteCollections, icon: FolderHeart },
  ];

  return (
    <div className={GRID_CLASS}>
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className="h-[90px] animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}
