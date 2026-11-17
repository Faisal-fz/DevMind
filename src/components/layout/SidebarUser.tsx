import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SidebarUser() {
  return (
    <div className="flex items-center gap-3 border-t border-sidebar-border p-3">
      <Avatar size="lg">
        {currentUser.image && <AvatarImage src={currentUser.image} alt={currentUser.name} />}
        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{currentUser.name}</p>
        <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
      </div>
      <Button variant="ghost" size="icon" aria-label="Settings">
        <Settings />
      </Button>
    </div>
  );
}
