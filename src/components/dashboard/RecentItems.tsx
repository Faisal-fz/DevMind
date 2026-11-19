import { connection } from "next/server";
import ItemCard from "@/components/dashboard/ItemCard";
import { getRecentItems } from "@/lib/db/items";

const SKELETON_COUNT = 5;

export default async function RecentItems() {
  await connection();
  const items = await getRecentItems();

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function RecentItemsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className="h-[74px] animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}
