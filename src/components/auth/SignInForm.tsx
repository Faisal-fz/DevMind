"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import FormAlert from "@/components/auth/FormAlert";
import { signInWithCredentials, type SignInState } from "@/actions/auth";

interface SignInFormProps {
  callbackUrl?: string;
}

const INITIAL_STATE: SignInState = {};

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signInWithCredentials, INITIAL_STATE);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && <FormAlert message={state.error} />}
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={state.email}
        error={state.fieldErrors?.email}
        required
      />
      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
