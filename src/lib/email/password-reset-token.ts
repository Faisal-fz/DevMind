import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants/auth";

const TOKEN_TTL_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SECONDS * 1000;

// Shares the VerificationToken table with email verification; the prefix keeps them apart
const IDENTIFIER_PREFIX = "password-reset:";

export type ResetTokenStatus = "valid" | "invalid" | "expired";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toIdentifier(email: string): string {
  return `${IDENTIFIER_PREFIX}${email}`;
}

async function findResetToken(token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token: hashToken(token) },
  });
  return record?.identifier.startsWith(IDENTIFIER_PREFIX) ? record : null;
}

/** Replaces any existing reset token for this email and returns the new raw token. */
export async function createPasswordResetToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const identifier = toIdentifier(email);
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: {
        identifier,
        token: hashToken(token),
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    }),
  ]);
  return token;
}

/** True if a reset token was issued for this email within the resend cooldown. */
export async function isInPasswordResetCooldown(email: string): Promise<boolean> {
  const latest = await prisma.verificationToken.findFirst({
    where: { identifier: toIdentifier(email) },
    orderBy: { expires: "desc" },
    select: { expires: true },
  });
  if (!latest) return false;

  // The model has no createdAt; derive the issue time from the fixed TTL
  const issuedAt = latest.expires.getTime() - TOKEN_TTL_MS;
  return Date.now() - issuedAt < RESEND_COOLDOWN_MS;
}

export async function getPasswordResetTokenStatus(token: string): Promise<ResetTokenStatus> {
  const record = await findResetToken(token);
  if (!record) return "invalid";
  return record.expires.getTime() < Date.now() ? "expired" : "valid";
}

/** Consumes the token and sets the new password hash. Single-use even under concurrent requests. */
export async function resetPasswordWithToken(
  token: string,
  passwordHash: string,
): Promise<ResetTokenStatus> {
  const record = await findResetToken(token);
  if (!record) return "invalid";

  if (record.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({ where: { token: record.token } });
    return "expired";
  }

  // Claim the token first: only one request can delete it
  const claimed = await prisma.verificationToken.deleteMany({ where: { token: record.token } });
  if (claimed.count === 0) return "invalid";

  const email = record.identifier.slice(IDENTIFIER_PREFIX.length);
  const updated = await prisma.user.updateMany({
    where: { email, password: { not: null } },
    data: { password: passwordHash },
  });
  return updated.count > 0 ? "valid" : "invalid";
}
