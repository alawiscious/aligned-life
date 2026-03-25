"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  "How well does this person take care of their physical health?",
  "How emotionally present are they in their close relationships?",
  "How financially grounded do they seem?",
];

export default function PeerPage() {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((_, i) => ratings[i] !== undefined);

  function handleSubmit() {
    if (allAnswered) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8">
        <p className="text-xl font-serif text-foreground mb-2">Thank you.</p>
        <p className="text-sm text-gray-400 text-center max-w-xs">
          Your anonymous answers have been recorded. They&rsquo;ll help someone you care about see themselves more clearly.
        </p>
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 mt-8 transition-colors">
          &larr; Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-serif text-foreground">A question for someone you trust</h1>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-lg">
          The best plans start with honest self-knowledge. Send this to a friend &mdash; their anonymous answers will help you see your blind spots.
        </p>
      </header>

      <main className="flex-1 px-8 py-8 space-y-8 max-w-lg">
        {QUESTIONS.map((q, i) => (
          <div key={i}>
            <p className="text-sm text-foreground mb-3">{q}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRatings({ ...ratings, [i]: n })}
                  className={`w-10 h-10 rounded-lg border text-sm font-mono transition-all ${
                    ratings[i] === n
                      ? "border-mint text-mint bg-mint/10"
                      : "border-gray-700 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer className="px-8 py-8">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`text-sm font-semibold transition-colors ${
            allAnswered
              ? "text-foreground hover:text-mint"
              : "text-gray-700 cursor-not-allowed"
          }`}
        >
          Submit anonymously &rarr;
        </button>
      </footer>
    </div>
  );
}
