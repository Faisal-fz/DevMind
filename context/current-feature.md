# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

Dashboard Collections — replace the mock collection data in the dashboard main area with real data from the Neon database via Prisma:

- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the server component (no mock data from `src/lib/mock-data.ts`)
- Keep the current design: the 6 recent collection cards
- Collection card border color derived from the most-used item type in that collection
- Show small icons of all item types in that collection
- Update the collection stats display
- Do not add the items underneath yet (later feature)

## Notes

<!-- Any extra notes -->

- Spec: @context/features/dashboard-collections-spec.md
- Reference screenshot: @context/screenshots/dashboard-ui-main.png (layout and design already exist)
- Schema: @prisma/schema.prisma

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup — Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 — shadcn/ui setup (Button, Input, Kbd), /dashboard route and layout, dark mode by default, item type theme colors, top bar with search and New Item button (display only), sidebar/main placeholders
- Dashboard UI Phase 2 — collapsible sidebar with top bar toggle (always a drawer below 1024px via shadcn Sheet), item types linking to /items/TYPE with icons and counts, favorite and recent collections, user avatar area (shadcn Avatar), item type icon/color constants
- Dashboard UI Phase 3 — main area with 4 stats cards, recent collection cards, pinned items and 10 recent items from mock data; sidebar collapses to an icon rail (logo, type icons, avatar); New Collection button and centered search in top bar; dark themed scrollbars
- Database Setup — Prisma 7 with Neon PostgreSQL via `@prisma/adapter-neon`, initial schema (NextAuth models, indexes, cascade deletes), `init` migration applied to the dev branch, shared Prisma client in `src/lib/prisma.ts`, re-runnable seed for the 7 system item types
- Seed Data — demo user (bcryptjs-hashed password), 7 system item types, 5 collections with 18 items (snippets, prompts, commands, real links); data in `prisma/seed-data.ts`, safe to re-run
- Dashboard Collections — recent collection cards and collection stats loaded from Neon via Prisma (`src/lib/db/collections.ts`), card border from the most-used item type, type icons per collection, Suspense skeletons (scoped to the demo user until auth)
