import Link from "next/link";
import { File } from "lucide-react";
import { cn } from "cn";
import { items, itemTypes } from "@/lib/mock-data";
import {
  ITEM_TYPE_ICONS,
  ITEM_TYPE_TEXT_COLORS,
  getItemTypeHref,
  getItemTypeLabel,
  isItemTypeName,
} from "@/lib/constants/item-types";

export default function SidebarTypeList() {
  return (
    <ul className="space-y-0.5">
      {itemTypes.map((type) => {
        const Icon = isItemTypeName(type.name) ? ITEM_TYPE_ICONS[type.name] : File;
        const colorClass = isItemTypeName(type.name) ? ITEM_TYPE_TEXT_COLORS[type.name] : "";
        const count = items.filter((item) => item.itemTypeId === type.id).length;
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
              <span className="text-xs text-muted-foreground tabular-nums in-data-[collapsed]:hidden">
                {count}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
