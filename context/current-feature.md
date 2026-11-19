# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

Seed Data — populate the database with sample data for development and demos (`prisma/seed.ts`):

- Demo user: demo@devstash.io, "Demo User", password 12345678 hashed with bcryptjs (12 rounds), isPro false, emailVerified set to the current date
- 7 system item types (snippet, prompt, command, note, file, image, link) with Lucide icon names, colors and `isSystem: true`
- 5 collections owned by the demo user, with their items:
  - **React Patterns** — 3 TypeScript snippets (custom hooks, component patterns, utility functions)
  - **AI Workflows** — 3 prompts (code review, documentation generation, refactoring assistance)
  - **DevOps** — 1 snippet (Docker/CI/CD config), 1 command (deployment script), 2 links (real documentation URLs)
  - **Terminal Commands** — 4 commands (git, Docker, process management, package manager utilities)
  - **Design Resources** — 4 links with real URLs (CSS/Tailwind, component libraries, design systems, icon libraries)

## Notes

<!-- Any extra notes -->

- Spec: @context/features/seed-spec.md
- Schema: @prisma/schema.prisma
- The existing `prisma/seed.ts` (system item types only) can be overwritten
- Install `bcryptjs` for password hashing
- The seed must be safe to re-run without creating duplicates
- Run with `npx prisma db seed` (Prisma 7 does not seed automatically after migrations)

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup — Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 — shadcn/ui setup (Button, Input, Kbd), /dashboard route and layout, dark mode by default, item type theme colors, top bar with search and New Item button (display only), sidebar/main placeholders
- Dashboard UI Phase 2 — collapsible sidebar with top bar toggle (always a drawer below 1024px via shadcn Sheet), item types linking to /items/TYPE with icons and counts, favorite and recent collections, user avatar area (shadcn Avatar), item type icon/color constants
- Dashboard UI Phase 3 — main area with 4 stats cards, recent collection cards, pinned items and 10 recent items from mock data; sidebar collapses to an icon rail (logo, type icons, avatar); New Collection button and centered search in top bar; dark themed scrollbars
- Database Setup — Prisma 7 with Neon PostgreSQL via `@prisma/adapter-neon`, initial schema (NextAuth models, indexes, cascade deletes), `init` migration applied to the dev branch, shared Prisma client in `src/lib/prisma.ts`, re-runnable seed for the 7 system item types
- Seed Data — demo user (bcryptjs-hashed password), 7 system item types, 5 collections with 18 items (snippets, prompts, commands, real links); data in `prisma/seed-data.ts`, safe to re-run
