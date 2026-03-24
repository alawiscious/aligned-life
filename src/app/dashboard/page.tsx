import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-8 pt-10 pb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs tracking-[0.25em] uppercase text-gray-400 font-sans hover:text-gray-600 transition-colors"
        >
          Brett Macauley &middot; The Aligned Life
        </Link>
        <nav className="flex gap-6 text-sm font-sans">
          <Link href="/plan" className="text-gray-500 hover:text-gray-800 transition-colors">
            Plan
          </Link>
          <Link href="/dashboard" className="text-mint font-medium">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8">
        <h1 className="font-serif text-5xl font-black text-gray-400 mb-4">Dashboard</h1>
        <p className="text-gray-500 font-sans text-lg">Coming soon.</p>
      </main>
    </div>
  );
}
