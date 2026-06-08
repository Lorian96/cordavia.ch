import Link from "next/link";

export const metadata = {
  title: "VitaWay Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted)]">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-xl">
            <span
              aria-hidden
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-navy-950 font-black"
            >
              V
            </span>
            <span>VitaWay · Admin</span>
          </Link>
          <Link href="/" className="text-sm text-navy-50/80 hover:text-teal-300">
            Zurück zur Website →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
