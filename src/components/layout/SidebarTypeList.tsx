import Link from "next/link";
import { File } from "lucide-react";
import { connection } from "next/server";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { getSystemItemTypes } from "@/lib/db/items";
import {
  ITEM_TYPE_ICONS,
  ITEM_TYPE_TEXT_COLORS,
  getItemTypeHref,
  getItemTypeLabel,
  isItemTypeName,
  isProItemType,
} from "@/lib/constants/item-types";

const SKELETON_COUNT = 7;

export default async function SidebarTypeList() {
  await connection();
  const itemTypes = await getSystemItemTypes();

  return (
    <ul className="space-y-0.5">
      {itemTypes.map((type) => {
        const Icon = isItemTypeName(type.name) ? ITEM_TYPE_ICONS[type.name] : File;
        const colorClass = isItemTypeName(type.name) ? ITEM_TYPE_TEXT_COLORS[type.name] : "";
        const label = getItemTypeLabel(type.name);

        return (
          <li key={type.id}>
            <Link
              href={getItemTypeHref(type.name)}
              title={label}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground in-data-[collapsed]:justify-center in-data-[collapsed]:py-2"
            >
              <Icon className={cn("size-4 shrink-0", colorClass)} />
              <span className="flex-1 truncate in-data-[collapsed]:hidden">{label}</span>
              {isProItemType(type.name) && (
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground in-data-[collapsed]:hidden"
                >
                  PRO
                </Badge>
              )}
              <span className="text-xs text-muted-foreground tabular-nums in-data-[collapsed]:hidden">
                {type.itemCount}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SidebarTypeListSkeleton() {
  return (
    <ul className="space-y-0.5">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li key={index} className="h-8 animate-pulse rounded-md bg-sidebar-accent/50" />
      ))}
    </ul>
  );
}
