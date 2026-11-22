# DevMind

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types: one fast, searchable place for everything you'd otherwise scatter across tools.

## Tech Stack

- Next.js 16 and React 19, with TypeScript
- Tailwind CSS v4 and shadcn/ui
- Prisma 7 with Neon PostgreSQL (`@prisma/adapter-neon`)

## Getting Started

1. Install dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon connection string.

3. Apply the migrations and seed the database:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the dev server and open http://localhost:3000/dashboard:

   ```bash
   npm run dev
   ```

## Commands

- `npm run dev`: dev server at http://localhost:3000
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: ESLint

## Database

Never use `prisma db push`. Change the schema with `npx prisma migrate dev --name <name>`, and apply migrations in production with `npx prisma migrate deploy`.

## Project Context

The product spec, coding standards and current feature are in [`context/`](context/).
