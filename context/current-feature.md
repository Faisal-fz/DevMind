# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

Database Setup — Prisma 7 ORM with Neon PostgreSQL (serverless):

- Install and configure Prisma 7 connected to Neon PostgreSQL
- Create the initial schema based on the data models in project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create the initial migration with `prisma migrate dev` (never `db push`)

## Notes

<!-- Any extra notes -->

- Spec: @context/features/database-spec.md
- Initial data models: @context/project-overview.md
- Database standards: @context/coding-standards.md
- Use Prisma 7 — it has breaking changes. Read the upgrade guide: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- `DATABASE_URL` points to the Neon development branch; a separate production branch exists. ALWAYS create migrations, never push directly unless specified

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup — Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 — shadcn/ui setup (Button, Input, Kbd), /dashboard route and layout, dark mode by default, item type theme colors, top bar with search and New Item button (display only), sidebar/main placeholders
- Dashboard UI Phase 2 — collapsible sidebar with top bar toggle (always a drawer below 1024px via shadcn Sheet), item types linking to /items/TYPE with icons and counts, favorite and recent collections, user avatar area (shadcn Avatar), item type icon/color constants
- Dashboard UI Phase 3 — main area with 4 stats cards, recent collection cards, pinned items and 10 recent items from mock data; sidebar collapses to an icon rail (logo, type icons, avatar); New Collection button and centered search in top bar; dark themed scrollbars
- Database Setup — Prisma 7 with Neon PostgreSQL via `@prisma/adapter-neon`, initial schema (NextAuth models, indexes, cascade deletes), `init` migration applied to the dev branch, shared Prisma client in `src/lib/prisma.ts`, re-runnable seed for the 7 system item types
