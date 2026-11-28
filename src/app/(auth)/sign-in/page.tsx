import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import FormAlert from "@/components/auth/FormAlert";
import GitHubSignInButton from "@/components/auth/GitHubSignInButton";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in | DevMind",
};

// Errors Auth.js appends as ?error= when redirecting back to the sign-in page
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  AccessDenied: "Access denied.",
};
const DEFAULT_AUTH_ERROR = "Sign in failed. Please try again.";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type SignInSearchParams = PageProps<"/sign-in">["searchParams"];

async function SignInOptions({ searchParams }: { searchParams: SignInSearchParams }) {
  const params = await searchParams;
  const callbackUrl = firstParam(params.callbackUrl);
  const authError = firstParam(params.error);
  const registered = firstParam(params.registered) === "1";

  return (
    <div className="space-y-4">
      {registered && (
        <FormAlert variant="success" message="Account created. You can now sign in." />
      )}
      {authError && <FormAlert message={AUTH_ERROR_MESSAGES[authError] ?? DEFAULT_AUTH_ERROR} />}
      <GitHubSignInButton callbackUrl={callbackUrl} />
      <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}

function SignInOptionsSkeleton() {
  return <div className="h-72 animate-pulse rounded-lg bg-muted/40" />;
}

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your DevMind account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            Register
          </Link>
        </>
      }
    >
      <Suspense fallback={<SignInOptionsSkeleton />}>
        <SignInOptions searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
