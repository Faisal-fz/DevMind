import Link from "next/link";
import { Layers } from "lucide-react";
import SidebarSection from "@/components/layout/SidebarSection";
import SidebarTypeList from "@/components/layout/SidebarTypeList";
import SidebarCollectionList from "@/components/layout/SidebarCollectionList";
import SidebarUser from "@/components/layout/SidebarUser";

export default function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Layers className="size-4" />
          </span>
          DevMind
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        <SidebarSection title="Types">
          <SidebarTypeList />
        </SidebarSection>
        <div className="mx-2 border-t border-sidebar-border" />
        <SidebarSection title="Collections">
          <SidebarCollectionList />
        </SidebarSection>
      </nav>

      <SidebarUser />
    </div>
  );
}
