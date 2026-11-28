import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/validations/auth";
import authConfig, { CREDENTIALS_FIELDS } from "./auth.config";

const credentialsProvider = Credentials({
  credentials: CREDENTIALS_FIELDS,
  async authorize(credentials) {
    const parsed = signInSchema.safeParse(credentials);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { id: user.id, name: user.name, email: user.email, image: user.image };
  },
});

// Swap the edge-safe Credentials placeholder for the real provider
const providers = authConfig.providers.map((provider) =>
  typeof provider !== "function" && provider.id === "credentials"
    ? credentialsProvider
    : provider,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
