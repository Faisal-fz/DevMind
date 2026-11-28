import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isEmailVerificationEnabled } from "@/lib/email/verification-config";
import { signInSchema } from "@/lib/validations/auth";
import authConfig, { CREDENTIALS_FIELDS } from "./auth.config";

export const EMAIL_NOT_VERIFIED_CODE = "email_not_verified";

class EmailNotVerifiedError extends CredentialsSignin {
  code = EMAIL_NOT_VERIFIED_CODE;
}

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

    // Checked only after the password matches, so it doesn't reveal which emails exist
    if (!user.emailVerified && isEmailVerificationEnabled()) throw new EmailNotVerifiedError();

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
