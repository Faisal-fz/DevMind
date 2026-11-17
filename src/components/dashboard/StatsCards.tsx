import { FolderOpen, FolderHeart, Layers, Star, type LucideIcon } from "lucide-react";
import type { DashboardStats } from "@/lib/dashboard-data";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    { label: "Items", value: stats.items, icon: Layers },
    { label: "Collections", value: stats.collections, icon: FolderOpen },
    { label: "Favorite Items", value: stats.favoriteItems, icon: Star },
    { label: "Favorite Collections", value: stats.favoriteCollections, icon: FolderHeart },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
