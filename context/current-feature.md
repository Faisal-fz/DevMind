# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

Dashboard UI Phase 3 (final phase of the dashboard layout) — build the main content area to the right of the sidebar:

- Main area to the right of the sidebar
- 4 stats cards at the top: number of items, collections, favorite items and favorite collections (not in screenshot)
- Recent collections
- Pinned items
- 10 recent items

## Notes

<!-- Any extra notes -->

- Spec: @context/features/dashboard-phase-3-spec.md
- Use @context/screenshots/dashboard-ui-main.png as the visual reference
- Import data directly from @src/lib/mock-data.js until the database is implemented
- Builds on @context/features/dashboard-phase-1-spec.md and @context/features/dashboard-phase-2-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- Initial Next.js setup — Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 — shadcn/ui setup (Button, Input, Kbd), /dashboard route and layout, dark mode by default, item type theme colors, top bar with search and New Item button (display only), sidebar/main placeholders
- Dashboard UI Phase 2 — collapsible sidebar with top bar toggle (always a drawer below 1024px via shadcn Sheet), item types linking to /items/TYPE with icons and counts, favorite and recent collections, user avatar area (shadcn Avatar), item type icon/color constants
- Dashboard UI Phase 3 — main area with 4 stats cards, recent collection cards, pinned items and 10 recent items from mock data; sidebar collapses to an icon rail (logo, type icons, avatar); New Collection button and centered search in top bar; dark themed scrollbars
