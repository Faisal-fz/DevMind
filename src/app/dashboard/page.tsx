import { Suspense } from "react";
import { Clock, Pin } from "lucide-react";
import StatsCards, { StatsCardsSkeleton } from "@/components/dashboard/StatsCards";
import DashboardSection from "@/components/dashboard/DashboardSection";
import RecentCollections, {
  RecentCollectionsSkeleton,
} from "@/components/dashboard/RecentCollections";
import ItemCard from "@/components/dashboard/ItemCard";
import { getPinnedItems, getRecentItems } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems();

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      <DashboardSection title="Collections" viewAllHref="/collections">
        <Suspense fallback={<RecentCollectionsSkeleton />}>
          <RecentCollections />
        </Suspense>
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
