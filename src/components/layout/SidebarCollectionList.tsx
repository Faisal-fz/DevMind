import Link from "next/link";
import { ArrowRight, Folder, Star } from "lucide-react";
import { connection } from "next/server";
import { cn } from "cn";
import { getSidebarCollections, type CollectionSummary } from "@/lib/db/collections";
import { ITEM_TYPE_DOT_COLORS, isItemTypeName } from "@/lib/constants/item-types";

const SKELETON_COUNT = 5;
const LINK_CLASS =
  "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

interface CollectionGroupProps {
  label: string;
  collections: CollectionSummary[];
  showFavorite?: boolean;
}

function TypeDot({ collection }: { collection: CollectionSummary }) {
  const dominantType = collection.types[0];
  const colorClass =
    dominantType && isItemTypeName(dominantType.name)
      ? ITEM_TYPE_DOT_COLORS[dominantType.name]
      : "bg-muted-foreground";

  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <span
        className={cn("size-2.5 rounded-full", colorClass)}
        aria-label={dominantType ? `Mostly ${dominantType.name}s` : "Empty collection"}
      />
    </span>
  );
}

function CollectionGroup({ label, collections, showFavorite = false }: CollectionGroupProps) {
  if (collections.length === 0) return null;

  return (
    <div>
      <p className="px-2 pt-2 pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="space-y-0.5">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.id}`} className={LINK_CLASS}>
              {showFavorite ? (
                <Folder className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <TypeDot collection={collection} />
              )}
              <span className="flex-1 truncate">{collection.name}</span>
              {showFavorite ? (
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
              ) : (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {collection.itemCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SidebarCollectionList() {
  await connection();
  const { favorites, recent } = await getSidebarCollections();

  return (
    <div className="space-y-2">
      <CollectionGroup label="Favorites" collections={favorites} showFavorite />
      <CollectionGroup label="Recent" collections={recent} />
      <Link href="/collections" className={cn(LINK_CLASS, "text-muted-foreground")}>
        <ArrowRight className="size-4 shrink-0" />
        <span className="flex-1 truncate">View all collections</span>
      </Link>
    </div>
  );
}

export function SidebarCollectionListSkeleton() {
  return (
    <ul className="space-y-0.5">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li key={index} className="h-8 animate-pulse rounded-md bg-sidebar-accent/50" />
      ))}
    </ul>
  );
}
