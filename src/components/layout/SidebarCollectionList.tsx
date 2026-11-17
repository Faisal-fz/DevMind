import Link from "next/link";
import { Folder, Star } from "lucide-react";
import { collections, items, type MockCollection } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

interface CollectionGroupProps {
  label: string;
  collections: MockCollection[];
  showFavorite?: boolean;
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
            <Link
              href={`/collections/${collection.id}`}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Folder className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{collection.name}</span>
              {showFavorite ? (
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
              ) : (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {items.filter((item) => item.collectionIds.includes(collection.id)).length}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SidebarCollectionList() {
  const favorites = collections.filter((collection) => collection.isFavorite);
  const recent = collections
    .filter((collection) => !collection.isFavorite)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);

  return (
    <div className="space-y-2">
      <CollectionGroup label="Favorites" collections={favorites} showFavorite />
      <CollectionGroup label="Recent" collections={recent} />
    </div>
  );
}
