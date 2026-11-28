import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const CREDENTIALS_FIELDS = {
  email: { type: "email", label: "Email", placeholder: "you@example.com" },
  password: { type: "password", label: "Password" },
};

// Edge-safe config: the real Credentials authorize (Prisma + bcrypt) lives in auth.ts
export default {
  providers: [
    GitHub,
    Credentials({
      credentials: CREDENTIALS_FIELDS,
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
