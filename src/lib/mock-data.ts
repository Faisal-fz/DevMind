// Temporary mock data for the dashboard UI. Replace with Prisma queries once the database is set up.

export type ContentType = "TEXT" | "FILE" | "URL";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  defaultTypeId: string;
  createdAt: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileName: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: false,
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981", isSystem: true },
];

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    defaultTypeId: "type_snippet",
    createdAt: "2026-01-02T10:00:00.000Z",
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    defaultTypeId: "type_snippet",
    createdAt: "2026-01-03T10:00:00.000Z",
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    defaultTypeId: "type_file",
    createdAt: "2026-01-04T10:00:00.000Z",
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    defaultTypeId: "type_note",
    createdAt: "2026-01-05T10:00:00.000Z",
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    defaultTypeId: "type_command",
    createdAt: "2026-01-06T10:00:00.000Z",
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    defaultTypeId: "type_prompt",
    createdAt: "2026-01-07T10:00:00.000Z",
  },
];

export const items: MockItem[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "TEXT",
    content: `export function useAuth() {
  const { data: session, status } = useSession();
  return { user: session?.user, isLoading: status === "loading" };
}`,
    url: null,
    fileName: null,
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "auth", "hooks"],
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "TEXT",
    content: `export async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.ok) return res;
    await new Promise((r) => setTimeout(r, 2 ** i * 500));
  }
  throw new Error("Request failed");
}`,
    url: null,
    fileName: null,
    language: "typescript",
    isFavorite: false,
    isPinned: true,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["api", "fetch", "error-handling"],
    createdAt: "2026-01-12T09:00:00.000Z",
    updatedAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "item_3",
    title: "React Server Components Notes",
    description: "Key rules for server vs client components",
    contentType: "TEXT",
    content: "- Server components by default\n- Add 'use client' only for interactivity\n- Pass serializable props only",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "nextjs"],
    createdAt: "2026-01-11T09:00:00.000Z",
    updatedAt: "2026-01-11T09:00:00.000Z",
  },
  {
    id: "item_4",
    title: "React Docs",
    description: "Official React documentation",
    contentType: "URL",
    content: null,
    url: "https://react.dev",
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_link",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "docs"],
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "item_5",
    title: "List Comprehension Examples",
    description: "Common Python list comprehension patterns",
    contentType: "TEXT",
    content: "squares = [x**2 for x in range(10)]\nevens = [x for x in nums if x % 2 == 0]",
    url: null,
    fileName: null,
    language: "python",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_snippet",
    collectionIds: ["col_python"],
    tags: ["python", "lists"],
    createdAt: "2026-01-09T09:00:00.000Z",
    updatedAt: "2026-01-09T09:00:00.000Z",
  },
  {
    id: "item_6",
    title: "Python Virtual Env Setup",
    description: "Steps for setting up a venv",
    contentType: "TEXT",
    content: "python -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_python"],
    tags: ["python", "setup"],
    createdAt: "2026-01-08T09:00:00.000Z",
    updatedAt: "2026-01-08T09:00:00.000Z",
  },
  {
    id: "item_7",
    title: "CLAUDE.md Template",
    description: "Base context file for AI coding assistants",
    contentType: "FILE",
    content: null,
    url: null,
    fileName: "CLAUDE.md",
    language: null,
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type_file",
    collectionIds: ["col_context"],
    tags: ["ai", "context"],
    createdAt: "2026-01-14T09:00:00.000Z",
    updatedAt: "2026-01-14T09:00:00.000Z",
  },
  {
    id: "item_8",
    title: "Project Context Guidelines",
    description: "What to include in project context files",
    contentType: "TEXT",
    content: "Include: overview, tech stack, coding standards, current feature.",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_context"],
    tags: ["ai", "context"],
    createdAt: "2026-01-13T09:00:00.000Z",
    updatedAt: "2026-01-13T09:00:00.000Z",
  },
  {
    id: "item_9",
    title: "Explain Big O Prompt",
    description: "Prompt for analyzing time complexity",
    contentType: "TEXT",
    content: "Analyze the time and space complexity of the following code and explain your reasoning step by step.",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_prompt",
    collectionIds: ["col_interview", "col_ai"],
    tags: ["interview", "algorithms"],
    createdAt: "2026-01-07T09:00:00.000Z",
    updatedAt: "2026-01-07T09:00:00.000Z",
  },
  {
    id: "item_10",
    title: "Undo Last Commit",
    description: "Reset to the previous commit, discarding changes",
    contentType: "TEXT",
    content: "git reset --hard HEAD~1",
    url: null,
    fileName: null,
    language: "bash",
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type_command",
    collectionIds: ["col_git"],
    tags: ["git", "reset"],
    createdAt: "2026-01-06T09:00:00.000Z",
    updatedAt: "2026-01-06T09:00:00.000Z",
  },
  {
    id: "item_11",
    title: "Git Branching Workflow",
    description: "Feature branch workflow notes",
    contentType: "TEXT",
    content: "1. git checkout -b feature/x\n2. Commit work\n3. Merge to main\n4. Delete branch",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_git"],
    tags: ["git", "workflow"],
    createdAt: "2026-01-05T09:00:00.000Z",
    updatedAt: "2026-01-05T09:00:00.000Z",
  },
  {
    id: "item_12",
    title: "Code Review Prompt",
    description: "Thorough code review for bugs, security and performance",
    contentType: "TEXT",
    content: "Review the following code for bugs, security issues, and performance problems. Suggest concrete fixes.",
    url: null,
    fileName: null,
    language: null,
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai"],
    tags: ["ai", "code-review"],
    createdAt: "2026-01-04T09:00:00.000Z",
    updatedAt: "2026-01-04T09:00:00.000Z",
  },
  {
    id: "item_13",
    title: "Debounce Utility",
    description: "Generic debounce function in TypeScript",
    contentType: "TEXT",
    content: `export function debounce<T extends unknown[]>(fn: (...args: T) => void, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}`,
    url: null,
    fileName: null,
    language: "typescript",
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_snippet",
    collectionIds: ["col_ai"],
    tags: ["utils", "typescript"],
    createdAt: "2026-01-03T09:00:00.000Z",
    updatedAt: "2026-01-03T09:00:00.000Z",
  },
  {
    id: "item_14",
    title: "Prompt Writing Tips",
    description: "Guidelines for writing effective coding prompts",
    contentType: "TEXT",
    content: "Be specific, give context, state constraints, and show examples of expected output.",
    url: null,
    fileName: null,
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_ai"],
    tags: ["ai", "prompts"],
    createdAt: "2026-01-02T09:00:00.000Z",
    updatedAt: "2026-01-02T09:00:00.000Z",
  },
  {
    id: "item_15",
    title: "Architecture Diagram",
    description: "System architecture overview",
    contentType: "FILE",
    content: null,
    url: null,
    fileName: "architecture.png",
    language: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_image",
    collectionIds: [],
    tags: ["architecture"],
    createdAt: "2026-01-01T09:00:00.000Z",
    updatedAt: "2026-01-01T09:00:00.000Z",
  },
];
