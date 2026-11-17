import { FolderPlus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import SidebarToggle from "@/components/layout/SidebarToggle";

export default function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-4 md:px-6">
      <div className="flex flex-1 items-center">
        <SidebarToggle />
      </div>
      <div className="relative w-full max-w-md min-w-0">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search items..."
          aria-label="Search items"
          className="h-9 pr-12 pl-9"
        />
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="outline" size="lg" aria-label="New Collection">
          <FolderPlus />
          <span className="hidden md:inline">New Collection</span>
        </Button>
        <Button size="lg" aria-label="New Item">
          <Plus />
          <span className="hidden md:inline">New Item</span>
        </Button>
      </div>
    </header>
  );
}
