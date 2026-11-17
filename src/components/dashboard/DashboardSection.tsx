import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface DashboardSectionProps {
  title: string;
  icon?: LucideIcon;
  viewAllHref?: string;
  children: ReactNode;
}

export default function DashboardSection({
  title,
  icon: Icon,
  viewAllHref,
  children,
}: DashboardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            View all
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
