"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/SidebarProvider";

export default function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" size="icon-lg" aria-label="Toggle sidebar" onClick={toggleSidebar}>
      <PanelLeft />
    </Button>
  );
}
