import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export const ITEM_TYPE_ICONS = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: StickyNote,
  file: File,
  image: Image,
  link: Link,
} as const satisfies Record<string, LucideIcon>;

export type ItemTypeName = keyof typeof ITEM_TYPE_ICONS;

export const ITEM_TYPE_TEXT_COLORS: Record<ItemTypeName, string> = {
  snippet: "text-snippet",
  prompt: "text-prompt",
  command: "text-command",
  note: "text-note",
  file: "text-file",
  image: "text-image",
  link: "text-link",
};

export function isItemTypeName(name: string): name is ItemTypeName {
  return name in ITEM_TYPE_ICONS;
}

export function getItemTypeHref(name: string): string {
  return `/items/${name}s`;
}

export function getItemTypeLabel(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;
}
