import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <aside className="bg-[var(--color-dark-900)] text-[var(--color-light-100)] flex flex-col justify-between rounded-b-[24px] md:rounded-none p-6 md:p-10">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-500">
            <Image src="/logo.svg" alt="Logo" width={24} height={24} />
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl md:text-[var(--text-heading-3)] font-medium mb-3">Just Do It</h1>
          <p className="text-[var(--color-light-400)] text-sm">
            Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
          </p>
          <div className="mt-6 flex gap-2">
            <span className="h-2 w-2 rounded-full bg-white/80" />
            <span className="h-2 w-2 rounded-full bg-white/50" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
        </div>
        <p className="text-[var(--color-light-400)] text-xs">© {new Date().getFullYear()} Nike. All rights reserved.</p>
      </aside>

      <main className="bg-[var(--color-light-100)] flex items-center justify-center py-10">
        <div className="w-full max-w-md px-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
