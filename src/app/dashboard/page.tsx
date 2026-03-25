"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp, Pillar, Horizon, Status } from "../context";

const PILLARS: Pillar[] = ["Physical Health", "Emotional Health", "Financial Health"];

function StatusDot({ status, onClick }: { status: Status; onClick: () => void }) {
  const colors = {
    green: "bg-status-green",
    amber: "bg-status-amber",
    red: "bg-status-red",
  };
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="relative w-10 h-10 flex items-center justify-center shrink-0 -ml-2"
      title={`${status} — tap to cycle`}
    >
      <span className={`w-4 h-4 rounded-full ${colors[status]} transition-all active:scale-150`} />
    </button>
  );
}

function MiniDots({ goals }: { goals: { status: Status }[] }) {
  return (
    <div className="flex gap-1.5 items-center">
      {goals.map((g, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            g.status === "green" ? "bg-status-green" : g.status === "amber" ? "bg-status-amber" : "bg-status-red"
          }`}
        />
      ))}
    </div>
  );
}

function AddGoalForm({ pillar, onAdd, onCancel }: { pillar: Pillar; onAdd: (text: string, horizon: Horizon) => void; onCancel: () => void }) {
  const [text, setText] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("Short-term");
  return (
    <div className="flex flex-col gap-3 pt-3 border-t border-border">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New goal..."
        autoFocus
        className="w-full bg-transparent border-b border-gray-700 focus:border-mint text-sm py-2 outline-none text-foreground placeholder:text-gray-600"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => setHorizon("Short-term")}
          className={`text-xs px-2.5 py-1 rounded border transition-colors ${
            horizon === "Short-term" ? "border-mint text-mint" : "border-gray-700 text-gray-500"
          }`}
        >
          Short-term
        </button>
        <button
          onClick={() => setHorizon("Long-term")}
          className={`text-xs px-2.5 py-1 rounded border transition-colors ${
            horizon === "Long-term" ? "border-mint text-mint" : "border-gray-700 text-gray-500"
          }`}
        >
          Long-term
        </button>
        <div className="flex-1" />
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-400">Cancel</button>
        <button
          onClick={() => { if (text.trim()) onAdd(text.trim(), horizon); }}
          disabled={!text.trim()}
          className={`text-xs font-semibold ${text.trim() ? "text-mint" : "text-gray-700"}`}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PillarTile({ pillar }: { pillar: Pillar }) {
  const { getPillarGoals, getPillarScore, cycleGoalStatus, addGoal } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const goals = getPillarGoals(pillar);
  const score = getPillarScore(pillar);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-surface-hover transition-colors"
      >
        <span className="text-sm font-semibold text-foreground flex-1 text-left">{pillar}</span>
        <MiniDots goals={goals} />
        <span className="text-sm font-mono text-gray-400 w-10 text-right">{score}%</span>
        <span className={`text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}>
          &#9662;
        </span>
      </button>

      {/* Expanded goals */}
      {expanded && (
        <div className="px-5 pb-4 max-h-64 overflow-y-auto space-y-1">
          {goals.map(g => (
            <div key={g.id} className="flex items-center gap-3 py-2 group">
              <StatusDot status={g.status} onClick={() => cycleGoalStatus(g.id)} />
              <span className="text-[15px] font-medium text-foreground flex-1">{g.text}</span>
              <span className="text-[11px] text-gray-500 bg-background px-2 py-0.5 rounded">
                {g.horizon}
              </span>
            </div>
          ))}

          {adding ? (
            <AddGoalForm
              pillar={pillar}
              onAdd={(text, horizon) => { addGoal(pillar, text, horizon); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="text-xs text-gray-500 hover:text-mint transition-colors pt-2"
            >
              + Add a goal
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { defineAnswers, getOverallScore } = useApp();
  const name = defineAnswers.name;
  const score = getOverallScore();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {name ? `${name}\u2019s Aligned Life` : "Your Aligned Life"}
          </h1>
        </div>
        <span className="text-4xl font-serif italic text-mint">{score}%</span>
      </header>

      {/* Equation */}
      <div className="px-6 pb-4">
        <p className="text-xs text-gray-500 tracking-wide">
          Achieving <span className="text-gray-600">=</span> Success <span className="text-gray-600">=</span> Happiness
        </p>
      </div>

      {/* Pillar tiles */}
      <main className="flex-1 px-6 space-y-3 pb-28">
        {PILLARS.map(p => (
          <PillarTile key={p} pillar={p} />
        ))}
      </main>

      {/* Bottom CTAs — fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur border-t border-border px-6 py-4 flex flex-col gap-2 items-center">
        <Link
          href="/today"
          className="text-sm font-semibold text-foreground hover:text-mint transition-colors"
        >
          Start achieving today &rarr;
        </Link>
        <Link
          href="/plan"
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
        >
          Full plan &#8599;
        </Link>
      </div>
    </div>
  );
}
