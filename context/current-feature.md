# Current Feature: Email Verification

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Registering an email/password account sends a verification email through Resend
- The email has a link with a single-use token that expires
- Opening the link sets `User.emailVerified` and deletes the token, then sends the user to `/sign-in` with a success message
- Invalid, expired or already-used links show a clear error message
- Email/password sign-in is blocked until the email is verified, with a clear message
- After registering, the user is told to check their inbox (not just "Account created")
- "Resend verification email" option for unverified users (from the check-your-inbox message and the blocked sign-in message); issues a new token and replaces the old one, with a cooldown to prevent spamming

## Notes

<!-- Any extra notes -->

- Inline description: "when user register they get an email and user get an link to verify their email. for this we are using resend."
- `RESEND_API_KEY` is already set in `.env` and `.env.production`
- Schema already has `User.emailVerified` and the `VerificationToken` model (`identifier`, `token`, `expires`), so no migration should be needed
- Registration lives in `POST /api/auth/register`; sign-in is the `signInWithCredentials` server action plus `authorize` in `src/auth.ts`
- Store a hash of the token in the database, not the raw token; send the raw token in the link
- Need a sender address and an app base URL for the link (e.g. `EMAIL_FROM`, `AUTH_URL`/`NEXT_PUBLIC_APP_URL`). Without a verified domain, Resend only sends from `onboarding@resend.dev` and only to the Resend account owner's email
- GitHub OAuth users are not affected; GitHub has already verified those emails
- Existing users (seeded demo user, earlier test users) have `emailVerified = null` and would be locked out; the seed should set `emailVerified` for the demo user
- Resend action must not reveal whether an email is registered (same response either way)
- Out of scope: password reset

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
