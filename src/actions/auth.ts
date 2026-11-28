"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { EMAIL_NOT_VERIFIED_CODE, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emailSchema, signInSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email/verification-email";
import { isInResendCooldown } from "@/lib/email/verification-token";

const DEFAULT_REDIRECT = "/dashboard";

export interface SignInState {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
  email?: string;
  unverified?: boolean;
}

export interface ResendVerificationResult {
  success: boolean;
  data?: { message: string };
  error?: string;
}

// Only allow same-site relative paths to prevent open redirects
function safeRedirect(callbackUrl: FormDataEntryValue | null): string {
  if (typeof callbackUrl !== "string") return DEFAULT_REDIRECT;
  // Browsers treat "\" like "/", so "/\evil.com" would act as "//evil.com"
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//") || callbackUrl.includes("\\")) {
    return DEFAULT_REDIRECT;
  }
  return callbackUrl;
}

export async function signInWithCredentials(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const rawEmail = formData.get("email");
  const email = typeof rawEmail === "string" ? rawEmail : "";

  const parsed = signInSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) {
    const fieldErrors: SignInState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "password") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { fieldErrors, email };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeRedirect(formData.get("callbackUrl")),
    });
    return {};
  } catch (error) {
    if (error instanceof CredentialsSignin && error.code === EMAIL_NOT_VERIFIED_CODE) {
      return {
        error: "Please verify your email before signing in. Check your inbox for the link.",
        email: parsed.data.email,
        unverified: true,
      };
    }
    if (error instanceof AuthError) {
      const message =
        error.type === "CredentialsSignin"
          ? "Invalid email or password"
          : "Something went wrong. Please try again.";
      return { error: message, email };
    }
    // Re-throw so Next.js can handle the redirect on success
    throw error;
  }
}

export async function signInWithGitHub(formData: FormData): Promise<void> {
  await signIn("github", { redirectTo: safeRedirect(formData.get("callbackUrl")) });
}

const RESEND_MESSAGE =
  "If an unverified account exists for that email, we've sent a new verification link.";

// Same response whether or not the account exists, so it can't be used to look up emails
export async function resendVerificationEmail(email: string): Promise<ResendVerificationResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { success: false, error: "Enter a valid email address." };

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data },
      select: { email: true, name: true, password: true, emailVerified: true },
    });

    const canResend = user?.password && !user.emailVerified;
    if (canResend && !(await isInResendCooldown(user.email))) {
      await sendVerificationEmail(user.email, user.name);
    }
    return { success: true, data: { message: RESEND_MESSAGE } };
  } catch (error) {
    console.error("Resend verification failed:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function signOutUser(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}
