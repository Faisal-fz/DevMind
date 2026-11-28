"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BCRYPT_SALT_ROUNDS, emailSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email/password-reset-email";
import {
  isInPasswordResetCooldown,
  resetPasswordWithToken,
  type ResetTokenStatus,
} from "@/lib/email/password-reset-token";

type ResetField = "password" | "confirmPassword";

export interface ForgotPasswordState {
  success: boolean;
  data?: { message: string };
  error?: string;
  email?: string;
}

export interface ResetPasswordState {
  success: boolean;
  error?: string;
  /** The reset link itself is invalid, expired or used, so the user needs a new one */
  tokenInvalid?: boolean;
  fieldErrors?: Partial<Record<ResetField, string>>;
}

const FORGOT_MESSAGE =
  "If an account exists for that email, we've sent a link to reset your password. It expires in 1 hour.";
const GENERIC_ERROR = "Something went wrong. Please try again.";

// Same response whether or not the account exists, so it can't be used to look up emails
export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail : "";

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { success: false, error: "Enter a valid email address.", email };

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data },
      select: { email: true, name: true, password: true },
    });

    // GitHub-only accounts have no password to reset
    if (user?.password && !(await isInPasswordResetCooldown(user.email))) {
      await sendPasswordResetEmail(user.email, user.name);
    }
    return { success: true, data: { message: FORGOT_MESSAGE } };
  } catch (error) {
    console.error("Password reset request failed:", error);
    return { success: false, error: GENERIC_ERROR, email };
  }
}

export async function resetPassword(
  _prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: ResetPasswordState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "token") return { success: false, tokenInvalid: true, error: issue.message };
      if ((field === "password" || field === "confirmPassword") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  let status: ResetTokenStatus;
  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_SALT_ROUNDS);
    status = await resetPasswordWithToken(parsed.data.token, passwordHash);
  } catch (error) {
    console.error("Password reset failed:", error);
    return { success: false, error: GENERIC_ERROR };
  }

  if (status === "expired") {
    return { success: false, tokenInvalid: true, error: "This reset link has expired." };
  }
  if (status === "invalid") {
    return {
      success: false,
      tokenInvalid: true,
      error: "This reset link is invalid or has already been used.",
    };
  }

  // Outside try/catch: redirect() works by throwing
  redirect("/sign-in?reset=1");
}
