import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-8 pt-10 pb-6">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 font-sans">
          Brett Macauley &middot; The Aligned Life
        </p>
      </header>

      <main className="flex-1 flex flex-col justify-center px-8 pb-16">
        <div className="max-w-3xl">
          <h1 className="font-serif leading-[0.9] tracking-tight">
            <span className="block text-[clamp(4rem,12vw,9rem)] font-black text-gray-400">
              The
            </span>
            <span className="block text-[clamp(4rem,12vw,9rem)] font-black italic text-mint">
              Aligned
            </span>
            <span className="block text-[clamp(4rem,12vw,9rem)] font-black text-gray-400">
              Life.
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-2 font-sans">
            <div className="flex items-center gap-4 text-sm tracking-wide">
              <span className="text-mint font-medium">Achieving</span>
              <span className="text-gray-600">=</span>
              <span className="text-mint font-medium">Success</span>
              <span className="text-gray-600">=</span>
              <span className="text-mint font-medium">Happiness</span>
            </div>
            <div className="flex items-center gap-4 text-sm tracking-wide">
              <span className="text-gray-400 font-medium">Physical</span>
              <span className="text-gray-600">+</span>
              <span className="text-gray-400 font-medium">Emotional</span>
              <span className="text-gray-600">+</span>
              <span className="text-gray-400 font-medium">Financial</span>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start gap-4">
            <Link
              href="/plan"
              className="text-lg font-semibold text-foreground hover:text-mint transition-colors"
            >
              Build my plan &rarr;
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-500 hover:text-gray-400 transition-colors"
            >
              See dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
