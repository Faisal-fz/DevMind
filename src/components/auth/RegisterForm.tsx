"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FormField from "@/components/auth/FormField";
import FormAlert from "@/components/auth/FormAlert";
import { registerSchema } from "@/lib/validations/auth";

type RegisterField = "name" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<RegisterField, string>>;

interface RegisterResponse {
  success: boolean;
  error?: string;
}

const REGISTER_FIELDS: RegisterField[] = ["name", "email", "password", "confirmPassword"];

function getFieldErrors(values: Record<RegisterField, string>): FieldErrors {
  const parsed = registerSchema.safeParse(values);
  if (parsed.success) return {};

  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as RegisterField;
    if (REGISTER_FIELDS.includes(field) && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export default function RegisterForm() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      REGISTER_FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
    ) as Record<RegisterField, string>;

    const errors = getFieldErrors(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsPending(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result: RegisterResponse = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error ?? "Registration failed. Please try again.");
        setIsPending(false);
        return;
      }

      router.push("/sign-in?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <FormAlert message={error} />}
      <FormField name="name" label="Name" autoComplete="name" error={fieldErrors.name} required />
      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={fieldErrors.email}
        required
      />
      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
        required
      />
      <FormField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        required
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
