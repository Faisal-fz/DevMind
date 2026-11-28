import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import FormAlert from "@/components/auth/FormAlert";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { buttonVariants } from "@/components/ui/button";
import { getPasswordResetTokenStatus } from "@/lib/email/password-reset-token";

export const metadata: Metadata = {
  title: "Reset password | DevMind",
};

const TOKEN_ERROR_MESSAGES = {
  expired: "This reset link has expired.",
  invalid: "This reset link is invalid or has already been used.",
} as const;

type ResetSearchParams = PageProps<"/reset-password">["searchParams"];

async function ResetPasswordContent({ searchParams }: { searchParams: ResetSearchParams }) {
  const { token: rawToken } = await searchParams;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const status = token ? await getPasswordResetTokenStatus(token) : "invalid";

  if (!token || status !== "valid") {
    return (
      <div className="space-y-4">
        <FormAlert message={TOKEN_ERROR_MESSAGES[status === "expired" ? "expired" : "invalid"]} />
        <Link
          href="/forgot-password"
          className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

function ResetPasswordSkeleton() {
  return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <AuthCard
      title="Choose a new password"
      description="Enter a new password for your DevMind account"
      footer={
        <>
          Back to{" "}
          <Link href="/sign-in" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPasswordContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
