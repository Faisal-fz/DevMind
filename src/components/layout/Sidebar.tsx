"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "cn";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/components/layout/SidebarProvider";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { isDesktopOpen, isMobileOpen, setMobileOpen } = useSidebar();

  const closeOnLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <aside
        aria-label="Sidebar"
        data-collapsed={isDesktopOpen ? undefined : ""}
        className={cn(
          "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out lg:block",
          isDesktopOpen ? "w-64" : "w-16",
        )}
      >
        {children}
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground lg:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="h-full" onClick={closeOnLinkClick}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
