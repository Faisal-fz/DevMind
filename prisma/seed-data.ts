export type SystemTypeName =
  | "snippet"
  | "prompt"
  | "command"
  | "note"
  | "file"
  | "image"
  | "link";

export interface SeedItemType {
  name: SystemTypeName;
  icon: string;
  color: string;
}

export interface SeedItem {
  title: string;
  type: SystemTypeName;
  description: string;
  content?: string;
  language?: string;
  url?: string;
}

export interface SeedCollection {
  name: string;
  description: string;
  items: SeedItem[];
}

export const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

export const SYSTEM_ITEM_TYPES: SeedItemType[] = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
];

const REACT_PATTERNS: SeedCollection = {
  name: "React Patterns",
  description: "Reusable React patterns and hooks",
  items: [
    {
      title: "useDebounce and useLocalStorage hooks",
      type: "snippet",
      language: "typescript",
      description: "Debounce a changing value and persist state to localStorage",
      content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    },
    {
      title: "Context provider with compound components",
      type: "snippet",
      language: "typescript",
      description: "Typed context plus a compound Tabs component",
      content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function Trigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
    },
    {
      title: "cn and formatRelative utilities",
      type: "snippet",
      language: "typescript",
      description: "Class name merging and relative date formatting",
      content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelative(date: Date): string {
  const diffDays = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (Math.abs(diffDays) < 1) return "today";
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}`,
    },
  ],
};

const AI_WORKFLOWS: SeedCollection = {
  name: "AI Workflows",
  description: "AI prompts and workflow automations",
  items: [
    {
      title: "Code review prompt",
      type: "prompt",
      description: "Thorough review focused on bugs, security and readability",
      content: `You are a senior software engineer reviewing a pull request.

Review the code below and report:
1. Bugs and logic errors (with the exact line and a fix)
2. Security issues (input validation, auth, injection)
3. Performance problems (unnecessary work, N+1 queries)
4. Readability and naming improvements

Rank findings by severity. Skip style nitpicks a linter would catch.

Code:
{{code}}`,
    },
    {
      title: "Documentation generator prompt",
      type: "prompt",
      description: "Generate clear docs for a function or module",
      content: `Write documentation for the code below.

Include:
- A one-sentence summary of what it does
- Parameters and return value, with types
- One realistic usage example
- Edge cases and errors it can throw

Use Markdown. Keep it concise and accurate; do not invent behavior that is not in the code.

Code:
{{code}}`,
    },
    {
      title: "Refactoring assistant prompt",
      type: "prompt",
      description: "Refactor code without changing its behavior",
      content: `Refactor the code below to improve readability and maintainability.

Rules:
- Do not change external behavior or public APIs
- Prefer small, well-named functions
- Remove duplication and dead code
- Explain each change in one line after the code

Code:
{{code}}`,
    },
  ],
};

const DEVOPS: SeedCollection = {
  name: "DevOps",
  description: "Infrastructure and deployment resources",
  items: [
    {
      title: "GitHub Actions CI for Next.js",
      type: "snippet",
      language: "yaml",
      description: "Install, lint and build on every push and pull request",
      content: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build`,
    },
    {
      title: "Deploy with Prisma migrations",
      type: "command",
      language: "bash",
      description: "Apply pending migrations, then build and start the app",
      content: "npx prisma migrate deploy && npm run build && npm run start",
    },
    {
      title: "Docker documentation",
      type: "link",
      description: "Official Docker docs and reference",
      url: "https://docs.docker.com/",
    },
    {
      title: "GitHub Actions documentation",
      type: "link",
      description: "Workflows, syntax and runner reference",
      url: "https://docs.github.com/en/actions",
    },
  ],
};

const TERMINAL_COMMANDS: SeedCollection = {
  name: "Terminal Commands",
  description: "Useful shell commands for everyday development",
  items: [
    {
      title: "Undo last commit but keep changes",
      type: "command",
      language: "bash",
      description: "Move HEAD back one commit and keep the changes staged",
      content: "git reset --soft HEAD~1",
    },
    {
      title: "Remove unused Docker data",
      type: "command",
      language: "bash",
      description: "Delete stopped containers, unused networks, images and build cache",
      content: "docker system prune -a",
    },
    {
      title: "Find and kill process on a port",
      type: "command",
      language: "bash",
      description: "Free up a port held by another process (macOS/Linux)",
      content: "lsof -ti :3000 | xargs kill -9",
    },
    {
      title: "List outdated npm packages",
      type: "command",
      language: "bash",
      description: "Show installed, wanted and latest versions of dependencies",
      content: "npm outdated",
    },
  ],
};

const DESIGN_RESOURCES: SeedCollection = {
  name: "Design Resources",
  description: "UI/UX resources and references",
  items: [
    {
      title: "Tailwind CSS documentation",
      type: "link",
      description: "Utility classes and configuration reference",
      url: "https://tailwindcss.com/docs",
    },
    {
      title: "shadcn/ui",
      type: "link",
      description: "Accessible, customizable components built with Tailwind",
      url: "https://ui.shadcn.com/",
    },
    {
      title: "Material Design 3",
      type: "link",
      description: "Google's open-source design system",
      url: "https://m3.material.io/",
    },
    {
      title: "Lucide Icons",
      type: "link",
      description: "Open-source icon library used across DevMind",
      url: "https://lucide.dev/icons/",
    },
  ],
};

export const COLLECTIONS: SeedCollection[] = [
  REACT_PATTERNS,
  AI_WORKFLOWS,
  DEVOPS,
  TERMINAL_COMMANDS,
  DESIGN_RESOURCES,
];
