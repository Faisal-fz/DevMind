import { connection } from "next/server";
import CollectionCard from "@/components/dashboard/CollectionCard";
import { getRecentCollections } from "@/lib/db/collections";

const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3";
const SKELETON_COUNT = 6;

export default async function RecentCollections() {
  await connection();
  const collections = await getRecentCollections();

  if (collections.length === 0) {
    return <p className="text-sm text-muted-foreground">No collections yet.</p>;
  }

  return (
    <div className={GRID_CLASS}>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

export function RecentCollectionsSkeleton() {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}
