"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/validations/auth";

const DEFAULT_REDIRECT = "/dashboard";

export interface SignInState {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
  email?: string;
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

export async function signOutUser(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}
