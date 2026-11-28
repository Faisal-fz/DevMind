# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

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
- Dashboard Items — pinned and recent items plus item stats loaded from Neon via Prisma (`src/lib/db/items.ts`), card icon/border from the item type, Pinned section hidden when empty, shared `DEMO_USER_EMAIL` in `src/lib/db/demo-user.ts`, removed `src/lib/dashboard-data.ts`
- Stats & Sidebar — sidebar item types (system types with icons and item counts, linking to /items/TYPE) and collections loaded from Neon via Prisma (`getSystemItemTypes` in `src/lib/db/items.ts`, `getSidebarCollections` in `src/lib/db/collections.ts`), favorites keep the star, recent collections show a colored dot for their most-used item type, "View all collections" link to /collections, Suspense skeletons; seed now sets `isFavorite` (AI Workflows and DevOps)
- Add Pro Badge to Sidebar — subtle outline "PRO" badge (shadcn/ui Badge) on the File and Image types in the sidebar, hidden on the collapsed icon rail; `isProItemType` helper in `src/lib/constants/item-types.ts`
- Auth Phase 1 — NextAuth v5 (`next-auth@beta`) with GitHub OAuth; split config (`src/auth.config.ts` edge-safe providers, `src/auth.ts` with Prisma adapter and JWT sessions, `user.id` on the session); API route at `src/app/api/auth/[...nextauth]`; `src/proxy.ts` redirects signed-out users from `/dashboard/*` to NextAuth's default sign-in page; Session type extended in `src/types/next-auth.d.ts`
- Auth Phase 2 — email/password sign-in via the NextAuth Credentials provider (edge-safe `authorize: () => null` placeholder in `src/auth.config.ts`, replaced in `src/auth.ts` with a bcrypt check against `User.password`); `POST /api/auth/register` (name, email, password, confirmPassword; 201/400/409/500 with `{ success, data, error }`, cost-12 bcrypt hash); Zod added for validation with shared schemas in `src/lib/validations/auth.ts` (emails trimmed and lowercased, passwords 8–72 chars); `.playwright-mcp/` gitignored
- Auth Phase 3 — custom `/sign-in` and `/register` pages in the `(auth)` route group (`pages.signIn` in `src/auth.config.ts`); credentials sign-in, GitHub sign-in and sign-out as server actions in `src/actions/auth.ts` (`callbackUrl` limited to relative paths); register form validates with the shared `registerSchema` before posting to `/api/auth/register`, then redirects to `/sign-in?registered=1`; proxy redirects signed-out users to `/sign-in`; sidebar shows the session user via reusable `UserAvatar` (`src/components/shared/UserAvatar.tsx`, image or initials) with a dropup menu (Profile, Sign out) and a settings link to `/profile`; `SidebarUser` uses Suspense + `connection()` for Cache Components; form fields use `useId` since Next keeps previous routes mounted; shadcn dropdown-menu and label added; removed `src/lib/mock-data.ts`
- Email Verification — `resend` SDK; registration sends a verification email (`src/lib/email/verification-email.ts`, lazy client via `getResend()` in `src/lib/email/resend.ts`, `EMAIL_FROM`/`APP_URL` env with dev defaults `onboarding@resend.dev`/`http://localhost:3000`); single-use 24h tokens in `VerificationToken` storing only a SHA-256 hash (`src/lib/email/verification-token.ts`, no migration); `GET /api/auth/verify-email` sets `emailVerified` and redirects to `/sign-in?verified=1` or `?verifyError=invalid|expired`; credentials sign-in blocked for unverified users via `EmailNotVerifiedError` (custom `CredentialsSignin` code, checked after the password matches); register form shows `CheckInboxNotice` instead of redirecting; `resendVerificationEmail` action + `ResendVerificationButton` with 60s cooldown (`RESEND_COOLDOWN_SECONDS` in `src/lib/constants/auth.ts`) and a response that doesn't reveal whether the account exists; shared `emailSchema` exported from `src/lib/validations/auth.ts`
