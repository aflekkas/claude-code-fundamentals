import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Built with Next.js &amp; Supabase
        </p>
        <nav className="flex gap-6">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </footer>
  );
}
