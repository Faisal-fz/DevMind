import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants/auth";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SECONDS * 1000;

export type VerifyTokenResult = "verified" | "invalid" | "expired";

// Only the hash is stored, so a database leak can't be used to verify accounts
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Replaces any existing token for this email and returns the new raw token. */
export async function createVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
    prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashToken(token),
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ]);
  return token;
}

/** True if a token was issued for this email within the resend cooldown. */
export async function isInResendCooldown(email: string): Promise<boolean> {
  const latest = await prisma.verificationToken.findFirst({
    where: { identifier: email },
    orderBy: { expires: "desc" },
    select: { expires: true },
  });
  if (!latest) return false;

  // The model has no createdAt; derive the issue time from the fixed TTL
  const issuedAt = latest.expires.getTime() - TOKEN_TTL_MS;
  return Date.now() - issuedAt < RESEND_COOLDOWN_MS;
}

export async function verifyEmailToken(token: string): Promise<VerifyTokenResult> {
  const record = await prisma.verificationToken.findUnique({
    where: { token: hashToken(token) },
  });
  if (!record) return "invalid";

  if (record.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({ where: { token: record.token } });
    return "expired";
  }

  const [updated] = await prisma.$transaction([
    prisma.user.updateMany({
      where: { email: record.identifier, emailVerified: null },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } }),
  ]);

  return updated.count > 0 ? "verified" : "invalid";
}
