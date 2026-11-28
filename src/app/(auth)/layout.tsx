import Link from "next/link";
import { Layers } from "lucide-react";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Layers className="size-5" />
        </span>
        DevMind
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
