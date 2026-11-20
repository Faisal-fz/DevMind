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

export const ITEM_TYPE_BORDER_COLORS: Record<ItemTypeName, string> = {
  snippet: "border-l-snippet",
  prompt: "border-l-prompt",
  command: "border-l-command",
  note: "border-l-note",
  file: "border-l-file",
  image: "border-l-image",
  link: "border-l-link",
};

export const ITEM_TYPE_BG_COLORS: Record<ItemTypeName, string> = {
  snippet: "bg-snippet/10",
  prompt: "bg-prompt/10",
  command: "bg-command/10",
  note: "bg-note/10",
  file: "bg-file/10",
  image: "bg-image/10",
  link: "bg-link/10",
};

export const ITEM_TYPE_DOT_COLORS: Record<ItemTypeName, string> = {
  snippet: "bg-snippet",
  prompt: "bg-prompt",
  command: "bg-command",
  note: "bg-note",
  file: "bg-file",
  image: "bg-image",
  link: "bg-link",
};

const ITEM_TYPE_ORDER = Object.keys(ITEM_TYPE_ICONS);

export function isItemTypeName(name: string): name is ItemTypeName {
  return name in ITEM_TYPE_ICONS;
}

// Types not in the system list sort after the system types.
export function getItemTypeOrder(name: string): number {
  const index = ITEM_TYPE_ORDER.indexOf(name);
  return index === -1 ? ITEM_TYPE_ORDER.length : index;
}

export function getItemTypeHref(name: string): string {
  return `/items/${name}s`;
}

export function getItemTypeLabel(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;
}
