"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import FormAlert from "@/components/auth/FormAlert";
import { resetPassword, type ResetPasswordState } from "@/actions/password-reset";

interface ResetPasswordFormProps {
  token: string;
}

const INITIAL_STATE: ResetPasswordState = { success: false };

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && <FormAlert message={state.error} />}
      {state.tokenInvalid && (
        <p className="text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium text-foreground hover:underline">
            Request a new reset link
          </Link>
        </p>
      )}
      <input type="hidden" name="token" value={token} />
      <FormField
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        required
      />
      <FormField
        name="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword}
        required
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
