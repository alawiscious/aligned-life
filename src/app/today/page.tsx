"use client";

import Link from "next/link";
import { useApp } from "../context";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

const PILLAR_LABEL: Record<string, string> = {
  "Physical Health": "Physical",
  "Emotional Health": "Emotional",
  "Financial Health": "Financial",
};

export default function TodayPage() {
  const { defineAnswers, getTodayTasks, todayCompleted, toggleTodayTask } = useApp();
  const name = defineAnswers.name;
  const tasks = getTodayTasks();
  const doneCount = tasks.filter(t => todayCompleted.has(t.id)).length;
  const allDone = tasks.length > 0 && doneCount === tasks.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <p className="text-2xl font-serif text-foreground">{getGreeting()}</p>
        {name && <p className="text-2xl font-serif text-mint">{name}.</p>}
        <p className="text-sm italic text-gray-400 mt-1">One step at a time.</p>
        <p className="text-xs text-gray-500 mt-3">
          Each task you complete today is a win. Not tomorrow &mdash; today.
        </p>
      </header>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono">
            Today: {doneCount} / {tasks.length}
          </span>
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-mint transition-all duration-500"
              style={{ width: tasks.length > 0 ? `${(doneCount / tasks.length) * 100}%` : "0%" }}
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <main className="flex-1 px-6 pb-8 space-y-3">
        {allDone ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <p className="text-xl font-serif text-foreground">
              That&rsquo;s {doneCount} step{doneCount !== 1 ? "s" : ""} forward.
            </p>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Come back tomorrow. The green will spread. That&rsquo;s how aligned lives are built &mdash; one day at a time.
            </p>
            <p className="text-xs text-gray-600 font-mono mt-6">
              Achieving = Success = Happiness
            </p>
          </div>
        ) : (
          <>
            {tasks.map(task => {
              const done = todayCompleted.has(task.id);
              return (
                <div
                  key={task.id}
                  className={`bg-surface rounded-xl border border-border p-4 transition-all ${
                    done ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.status === "red" ? "bg-status-red" : "bg-status-amber"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">{PILLAR_LABEL[task.pillar]}</p>
                      <p className="text-sm text-foreground leading-relaxed">{task.todayAction}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTodayTask(task.id)}
                    className={`mt-3 text-xs font-semibold transition-colors ${
                      done
                        ? "text-status-green"
                        : "text-gray-500 hover:text-foreground"
                    }`}
                  >
                    {done ? "Done \u2014 well played" : "Mark as done"}
                  </button>
                </div>
              );
            })}

            {/* Saturday Morning Effect */}
            <div className="bg-surface rounded-xl border border-border p-4 mt-6">
              <p className="text-xs font-semibold text-mint mb-2">The Saturday Morning Effect</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                When you have a plan, your brain can finally let go. Every check brings you one step closer to your aligned life.
              </p>
            </div>
          </>
        )}
      </main>

      {/* Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur border-t border-border px-6 py-3 flex justify-center gap-8">
        <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Dashboard
        </Link>
        <Link href="/today" className="text-xs text-mint font-medium">
          Today
        </Link>
        <Link href="/peer" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
          Peer Input
        </Link>
      </div>
    </div>
  );
}
