"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import FormAlert from "@/components/auth/FormAlert";
import { resendVerificationEmail } from "@/actions/auth";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants/auth";

interface ResendVerificationButtonProps {
  email: string;
  /** Start in cooldown, e.g. right after an email was just sent */
  startInCooldown?: boolean;
}

export default function ResendVerificationButton({
  email,
  startInCooldown = false,
}: ResendVerificationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [secondsLeft, setSecondsLeft] = useState(startInCooldown ? RESEND_COOLDOWN_SECONDS : 0);
  const [result, setResult] = useState<{ message: string; isError: boolean }>();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleResend() {
    startTransition(async () => {
      const response = await resendVerificationEmail(email);
      if (response.success && response.data) {
        setResult({ message: response.data.message, isError: false });
        setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      } else {
        setResult({ message: response.error ?? "Something went wrong.", isError: true });
      }
    });
  }

  const isDisabled = isPending || secondsLeft > 0;

  return (
    <div className="space-y-3">
      {result && (
        <FormAlert message={result.message} variant={result.isError ? "error" : "success"} />
      )}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={isDisabled}
        onClick={handleResend}
      >
        {isPending
          ? "Sending..."
          : secondsLeft > 0
            ? `Resend verification email (${secondsLeft}s)`
            : "Resend verification email"}
      </Button>
    </div>
  );
}
