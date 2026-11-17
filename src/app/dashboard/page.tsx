import { Clock, Pin } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import DashboardSection from "@/components/dashboard/DashboardSection";
import CollectionCard from "@/components/dashboard/CollectionCard";
import ItemCard from "@/components/dashboard/ItemCard";
import {
  getDashboardStats,
  getPinnedItems,
  getRecentCollections,
  getRecentItems,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
  const recentCollections = getRecentCollections();
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <StatsCards stats={getDashboardStats()} />

      <DashboardSection title="Collections" viewAllHref="/collections">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentCollections.map((summary) => (
            <CollectionCard key={summary.collection.id} summary={summary} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned" icon={Pin}>
          <div className="space-y-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </DashboardSection>
      )}

      <DashboardSection title="Recent Items" icon={Clock}>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
