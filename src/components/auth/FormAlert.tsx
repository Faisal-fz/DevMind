import { cn } from "cn";

interface FormAlertProps {
  message: string;
  variant?: "error" | "success";
}

export default function FormAlert({ message, variant = "error" }: FormAlertProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        variant === "error"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      )}
    >
      {message}
    </p>
  );
}
