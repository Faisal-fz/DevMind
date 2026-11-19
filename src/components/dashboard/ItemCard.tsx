import { File, Pin, Star } from "lucide-react";
import { cn } from "cn";
import type { ItemSummary } from "@/lib/db/items";
import {
  ITEM_TYPE_BG_COLORS,
  ITEM_TYPE_BORDER_COLORS,
  ITEM_TYPE_ICONS,
  ITEM_TYPE_TEXT_COLORS,
  isItemTypeName,
} from "@/lib/constants/item-types";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

interface ItemCardProps {
  item: ItemSummary;
}

export default function ItemCard({ item }: ItemCardProps) {
  const typeName = isItemTypeName(item.typeName) ? item.typeName : null;
  const Icon = typeName ? ITEM_TYPE_ICONS[typeName] : File;

  return (
    <article
      className={cn(
        "flex items-start gap-4 rounded-xl border border-l-2 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        typeName ? ITEM_TYPE_BORDER_COLORS[typeName] : "border-l-border",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          typeName ? ITEM_TYPE_BG_COLORS[typeName] : "bg-muted",
        )}
      >
        <Icon className={cn("size-5", typeName ? ITEM_TYPE_TEXT_COLORS[typeName] : "")} />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{item.title}</h3>
          {item.isPinned && (
            <Pin className="size-3.5 shrink-0 text-muted-foreground" aria-label="Pinned" />
          )}
          {item.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">{item.description}</p>
        {item.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      <time dateTime={item.updatedAt.toISOString()} className="shrink-0 text-xs text-muted-foreground">
        {DATE_FORMAT.format(item.updatedAt)}
      </time>
    </article>
  );
}
