import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}

// "Brad Traversy" → "BT"; falls back to the email's first letter, then "?"
export function getInitials(name?: string | null, email?: string | null): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length > 0) {
    const first = parts[0].charAt(0);
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() || "?";
}

export default function UserAvatar({ name, email, image, size = "default", className }: UserAvatarProps) {
  const label = name || email || "User";

  return (
    <Avatar size={size} className={className}>
      {image && <AvatarImage src={image} alt={label} />}
      <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
    </Avatar>
  );
}
