import { Suspense } from "react";
import { Clock } from "lucide-react";
import StatsCards, { StatsCardsSkeleton } from "@/components/dashboard/StatsCards";
import DashboardSection from "@/components/dashboard/DashboardSection";
import RecentCollections, {
  RecentCollectionsSkeleton,
} from "@/components/dashboard/RecentCollections";
import PinnedItems from "@/components/dashboard/PinnedItems";
import RecentItems, { RecentItemsSkeleton } from "@/components/dashboard/RecentItems";

export default function DashboardPage() {
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

      <Suspense fallback={null}>
        <PinnedItems />
      </Suspense>

      <DashboardSection title="Recent Items" icon={Clock}>
        <Suspense fallback={<RecentItemsSkeleton />}>
          <RecentItems />
        </Suspense>
      </DashboardSection>
    </div>
  );
}
