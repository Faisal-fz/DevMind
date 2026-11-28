"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import FormAlert from "@/components/auth/FormAlert";
import { requestPasswordReset, type ForgotPasswordState } from "@/actions/password-reset";

const INITIAL_STATE: ForgotPasswordState = { success: false };

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, INITIAL_STATE);

  if (state.success && state.data) {
    return (
      <div className="space-y-4">
        <FormAlert variant="success" message={state.data.message} />
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && <FormAlert message={state.error} />}
      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={state.email}
        required
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
