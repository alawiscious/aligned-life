"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context";

const QUOTES = [
  "\u201CYou can\u2019t achieve success until you properly define it.\u201D",
  "\u201CBe honest. Be shameless. Be selfish, even. The rest will fall into place.\u201D",
  "\u201CThe most important skill someone can bring to this process is an acute sense of self.\u201D",
  "\u201CSuccess is not some far-off notion. Happiness is here, in the present tense.\u201D",
  "\u201CIt\u2019s not about taking more time away. It\u2019s about rediscovering joy.\u201D",
  "\u201CA plan isn\u2019t a cage. It\u2019s permission to let go and enjoy the walk.\u201D",
];

interface Question {
  question: string;
  hint: string;
  type: "text" | "textarea" | "options";
  options?: string[];
  field: string;
}

const QUESTIONS: Question[] = [
  {
    question: "What is your name?",
    hint: "This plan is for you. Let\u2019s make it personal.",
    type: "text",
    field: "name",
  },
  {
    question: "When you imagine your ideal life five years from now, what does it look like?",
    hint: "Be honest. Be selfish even. This is yours alone.",
    type: "textarea",
    field: "vision",
  },
  {
    question: "Which area of life needs the most attention right now?",
    hint: "Your honest answer becomes the starting line.",
    type: "options",
    options: ["Physical Health", "Emotional Health", "Financial Health", "All three, honestly"],
    field: "focusArea",
  },
  {
    question: "What does success actually mean to you?",
    hint: "Not what you think it should mean \u2014 what genuinely makes you feel fulfilled?",
    type: "textarea",
    field: "successMeaning",
  },
  {
    question: "What is the one thing you keep putting off that you know would change everything?",
    hint: "The nagging thing. The one that keeps coming back.",
    type: "textarea",
    field: "puttingOff",
  },
  {
    question: "How honest have you been with yourself in the last year?",
    hint: "The only way a plan works is if you know precisely where you\u2019re starting.",
    type: "options",
    options: [
      "Very honest \u2014 I see myself clearly",
      "Somewhat honest \u2014 some blind spots",
      "Not very honest \u2014 I tend to avoid hard truths",
      "Starting to figure that out",
    ],
    field: "honesty",
  },
];

export default function PlanPage() {
  const router = useRouter();
  const { setDefineAnswers, completeDefine } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const q = QUESTIONS[step];
  const value = answers[q.field] || "";
  const isLast = step === QUESTIONS.length - 1;

  function handleNext() {
    if (isLast) {
      setDefineAnswers({
        name: answers.name || "",
        vision: answers.vision || "",
        focusArea: answers.focusArea || "",
        successMeaning: answers.successMeaning || "",
        puttingOff: answers.puttingOff || "",
        honesty: answers.honesty || "",
      });
      completeDefine();
      router.push("/dashboard");
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const canContinue = value.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-8 pt-8 pb-4 flex items-center justify-between">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 font-sans">
          Define
        </p>
        <p className="text-sm text-gray-500 font-mono">
          {step + 1} / {QUESTIONS.length}
        </p>
      </header>

      <main className="flex-1 flex flex-col justify-center px-8 max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-snug">
            {q.question}
          </h2>

          <p className="text-sm text-gray-400 italic">{q.hint}</p>

          {q.type === "text" && (
            <input
              type="text"
              value={value}
              onChange={e => setAnswers({ ...answers, [q.field]: e.target.value })}
              placeholder="Type here..."
              autoFocus
              className="w-full bg-transparent border-b border-gray-700 focus:border-mint text-lg py-3 outline-none text-foreground placeholder:text-gray-600 transition-colors"
            />
          )}

          {q.type === "textarea" && (
            <textarea
              value={value}
              onChange={e => setAnswers({ ...answers, [q.field]: e.target.value })}
              placeholder="Type here..."
              autoFocus
              rows={4}
              className="w-full bg-transparent border-b border-gray-700 focus:border-mint text-lg py-3 outline-none text-foreground placeholder:text-gray-600 resize-none transition-colors"
            />
          )}

          {q.type === "options" && (
            <div className="space-y-3">
              {q.options!.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.field]: opt })}
                  className={`block w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                    value === opt
                      ? "border-mint text-mint bg-mint/10"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="px-8 py-8 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              &larr; Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className={`text-sm font-semibold transition-colors ${
              canContinue
                ? "text-foreground hover:text-mint"
                : "text-gray-700 cursor-not-allowed"
            }`}
          >
            {isLast ? "See my assessment \u2192" : "Continue \u2192"}
          </button>
        </div>

        <p className="text-xs text-gray-600 italic text-center">
          {QUOTES[step]}
        </p>
      </footer>
    </div>
  );
}
