import { Suspense } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import SidebarSection from "@/components/layout/SidebarSection";
import SidebarTypeList, { SidebarTypeListSkeleton } from "@/components/layout/SidebarTypeList";
import SidebarCollectionList, {
  SidebarCollectionListSkeleton,
} from "@/components/layout/SidebarCollectionList";
import SidebarUser, { SidebarUserSkeleton } from "@/components/layout/SidebarUser";

export default function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/dashboard" title="DevMind" className="flex items-center gap-2.5 font-semibold">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Layers className="size-4" />
          </span>
          <span className="in-data-[collapsed]:hidden">DevMind</span>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-2 py-3">
        <SidebarSection title="Types">
          <Suspense fallback={<SidebarTypeListSkeleton />}>
            <SidebarTypeList />
          </Suspense>
        </SidebarSection>
        <div className="space-y-4 in-data-[collapsed]:hidden">
          <div className="mx-2 border-t border-sidebar-border" />
          <SidebarSection title="Collections">
            <Suspense fallback={<SidebarCollectionListSkeleton />}>
              <SidebarCollectionList />
            </Suspense>
          </SidebarSection>
        </div>
      </nav>

      <Suspense fallback={<SidebarUserSkeleton />}>
        <SidebarUser />
      </Suspense>
    </div>
  );
}
