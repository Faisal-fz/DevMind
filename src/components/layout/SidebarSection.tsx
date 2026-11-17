import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export default function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <details open className="group">
      <summary className="flex cursor-pointer in-data-[collapsed]:hidden list-none items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-sidebar-foreground [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 -rotate-90 transition-transform duration-150 group-open:rotate-0" />
      </summary>
      <div className="mt-1">{children}</div>
    </details>
  );
}
