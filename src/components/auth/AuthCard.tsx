import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      <p className="text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}
