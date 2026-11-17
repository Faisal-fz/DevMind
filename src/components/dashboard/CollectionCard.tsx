import Link from "next/link";
import { File, Star } from "lucide-react";
import { cn } from "cn";
import { getItemType, type CollectionSummary } from "@/lib/dashboard-data";
import {
  ITEM_TYPE_BORDER_COLORS,
  ITEM_TYPE_ICONS,
  ITEM_TYPE_TEXT_COLORS,
  isItemTypeName,
} from "@/lib/constants/item-types";

interface CollectionCardProps {
  summary: CollectionSummary;
}

export default function CollectionCard({ summary }: CollectionCardProps) {
  const { collection, itemCount, types } = summary;
  const defaultType = getItemType(collection.defaultTypeId);
  const borderClass =
    defaultType && isItemTypeName(defaultType.name)
      ? ITEM_TYPE_BORDER_COLORS[defaultType.name]
      : "border-l-border";

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-l-2 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        borderClass,
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
      {types.length > 0 && (
        <div className="flex items-center gap-2">
          {types.map((type) => {
            const Icon = isItemTypeName(type.name) ? ITEM_TYPE_ICONS[type.name] : File;
            const colorClass = isItemTypeName(type.name) ? ITEM_TYPE_TEXT_COLORS[type.name] : "";
            return <Icon key={type.id} className={cn("size-4", colorClass)} aria-label={type.name} />;
          })}
        </div>
      )}
    </Link>
  );
}
