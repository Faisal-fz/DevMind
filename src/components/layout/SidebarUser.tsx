import Link from "next/link";
import { connection } from "next/server";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarUserMenu from "@/components/layout/SidebarUserMenu";
import { auth } from "@/auth";

export function SidebarUserSkeleton() {
  return (
    <div className="flex items-center gap-3 border-t border-sidebar-border p-3 in-data-[collapsed]:justify-center">
      <div className="size-10 shrink-0 animate-pulse rounded-full bg-sidebar-accent/50" />
      <div className="h-8 flex-1 animate-pulse rounded-md bg-sidebar-accent/50 in-data-[collapsed]:hidden" />
    </div>
  );
}

export default async function SidebarUser() {
  // auth() uses crypto before reading cookies, so opt into request-time rendering first
  await connection();
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 border-t border-sidebar-border p-3 in-data-[collapsed]:justify-center">
      <SidebarUserMenu name={user.name} email={user.email} image={user.image} />
      <div className="min-w-0 flex-1 in-data-[collapsed]:hidden">
        <p className="truncate text-sm font-medium">{user.name ?? user.email}</p>
        {user.name && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Profile"
        title="Profile"
        className="in-data-[collapsed]:hidden"
        render={<Link href="/profile" />}
        nativeButton={false}
      >
        <Settings />
      </Button>
    </div>
  );
}
