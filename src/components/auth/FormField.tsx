"use client";

import { useId, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends ComponentProps<"input"> {
  name: string;
  label: string;
  error?: string;
}

export default function FormField({ name, label, error, ...inputProps }: FormFieldProps) {
  // Unique ids: Next keeps previously visited routes mounted (hidden), so plain ids can collide
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-9"
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
