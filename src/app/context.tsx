"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Status = "green" | "amber" | "red";
export type Horizon = "Short-term" | "Long-term";
export type Pillar = "Physical Health" | "Emotional Health" | "Financial Health";

export interface Goal {
  id: string;
  pillar: Pillar;
  text: string;
  horizon: Horizon;
  status: Status;
  todayAction: string;
}

export interface DefineAnswers {
  name: string;
  vision: string;
  focusArea: string;
  successMeaning: string;
  puttingOff: string;
  honesty: string;
}

const DEFAULT_GOALS: Goal[] = [
  // Physical Health
  { id: "p1", pillar: "Physical Health", text: "Exercise 2.5 hours per week", horizon: "Short-term", status: "red", todayAction: "30-minute walk today. That\u2019s 20% of your weekly goal \u2014 done." },
  { id: "p2", pillar: "Physical Health", text: "Annual physical and checkups", horizon: "Long-term", status: "amber", todayAction: "Book your annual physical. Open your calendar and find a slot." },
  { id: "p3", pillar: "Physical Health", text: "Sleep 7+ hours per night", horizon: "Short-term", status: "red", todayAction: "Set a sleep alarm 8 hours before your wake-up time. Tonight." },
  { id: "p4", pillar: "Physical Health", text: "Eat well most of the time", horizon: "Short-term", status: "amber", todayAction: "One real meal today \u2014 no shortcuts, no guilt." },
  { id: "p5", pillar: "Physical Health", text: "Strong energy through the day", horizon: "Long-term", status: "red", todayAction: "No screens for the first 20 minutes after waking." },
  // Emotional Health
  { id: "e1", pillar: "Emotional Health", text: "Quality time with people I love", horizon: "Short-term", status: "green", todayAction: "Send one message to someone you care about right now." },
  { id: "e2", pillar: "Emotional Health", text: "Friendships that fill my tank", horizon: "Long-term", status: "amber", todayAction: "Reach out to a friend you\u2019ve been meaning to call." },
  { id: "e3", pillar: "Emotional Health", text: "Personal growth and learning", horizon: "Long-term", status: "green", todayAction: "20 minutes of something that stretches your mind today." },
  { id: "e4", pillar: "Emotional Health", text: "Managing stress well", horizon: "Short-term", status: "red", todayAction: "Five slow breaths. Right now. That\u2019s it." },
  { id: "e5", pillar: "Emotional Health", text: "Making an impact beyond myself", horizon: "Long-term", status: "red", todayAction: "Do one thing for someone else today, no strings attached." },
  // Financial Health
  { id: "f1", pillar: "Financial Health", text: "Monthly spending on budget", horizon: "Short-term", status: "green", todayAction: "Check last week\u2019s spending. Just look \u2014 that\u2019s the first step." },
  { id: "f2", pillar: "Financial Health", text: "Emergency fund (3\u20136 months)", horizon: "Long-term", status: "amber", todayAction: "Transfer any amount to your emergency fund today. Anything." },
  { id: "f3", pillar: "Financial Health", text: "Retirement contributions on track", horizon: "Long-term", status: "green", todayAction: "Confirm your contributions are set up correctly." },
  { id: "f4", pillar: "Financial Health", text: "Debt under control", horizon: "Short-term", status: "red", todayAction: "Write down your debt total. Knowing is the first act of control." },
  { id: "f5", pillar: "Financial Health", text: "Financial security for my family", horizon: "Long-term", status: "amber", todayAction: "Review one aspect of your financial plan this week." },
];

interface AppState {
  defineAnswers: DefineAnswers;
  defineComplete: boolean;
  goals: Goal[];
  todayCompleted: Set<string>;
}

interface AppContextType extends AppState {
  setDefineAnswers: (answers: DefineAnswers) => void;
  completeDefine: () => void;
  cycleGoalStatus: (goalId: string) => void;
  setGoalStatus: (goalId: string, status: Status) => void;
  addGoal: (pillar: Pillar, text: string, horizon: Horizon) => void;
  toggleTodayTask: (goalId: string) => void;
  getPillarGoals: (pillar: Pillar) => Goal[];
  getPillarScore: (pillar: Pillar) => number;
  getOverallScore: () => number;
  getTodayTasks: () => Goal[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [defineAnswers, setDefineAnswersState] = useState<DefineAnswers>({
    name: "", vision: "", focusArea: "", successMeaning: "", puttingOff: "", honesty: "",
  });
  const [defineComplete, setDefineComplete] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [todayCompleted, setTodayCompleted] = useState<Set<string>>(new Set());

  const setDefineAnswers = useCallback((answers: DefineAnswers) => {
    setDefineAnswersState(answers);
  }, []);

  const completeDefine = useCallback(() => {
    setDefineComplete(true);
    // Pre-colour focused pillar goals red per brief
    const focus = defineAnswers.focusArea;
    if (focus && focus !== "All three, honestly") {
      setGoals(prev => prev.map(g =>
        g.pillar === focus ? { ...g, status: "red" as Status } : g
      ));
    } else if (focus === "All three, honestly") {
      setGoals(prev => prev.map(g => ({ ...g, status: "red" as Status })));
    }
  }, [defineAnswers.focusArea]);

  const cycleGoalStatus = useCallback((goalId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const next: Status = g.status === "green" ? "amber" : g.status === "amber" ? "red" : "green";
      return { ...g, status: next };
    }));
  }, []);

  const setGoalStatus = useCallback((goalId: string, status: Status) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status } : g));
  }, []);

  const addGoal = useCallback((pillar: Pillar, text: string, horizon: Horizon) => {
    const id = `custom_${Date.now()}`;
    setGoals(prev => [...prev, { id, pillar, text, horizon, status: "red", todayAction: text }]);
  }, []);

  const toggleTodayTask = useCallback((goalId: string) => {
    setTodayCompleted(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
        // Nudge goal status: red→amber, amber→green
        setGoals(gs => gs.map(g => {
          if (g.id !== goalId) return g;
          if (g.status === "red") return { ...g, status: "amber" as Status };
          if (g.status === "amber") return { ...g, status: "green" as Status };
          return g;
        }));
      }
      return next;
    });
  }, []);

  const getPillarGoals = useCallback((pillar: Pillar) => {
    return goals.filter(g => g.pillar === pillar);
  }, [goals]);

  const getPillarScore = useCallback((pillar: Pillar) => {
    const pg = goals.filter(g => g.pillar === pillar);
    if (pg.length === 0) return 0;
    const total = pg.reduce((sum, g) => {
      if (g.status === "green") return sum + 100;
      if (g.status === "amber") return sum + 50;
      return sum;
    }, 0);
    return Math.round(total / pg.length);
  }, [goals]);

  const getOverallScore = useCallback(() => {
    if (goals.length === 0) return 0;
    const total = goals.reduce((sum, g) => {
      if (g.status === "green") return sum + 100;
      if (g.status === "amber") return sum + 50;
      return sum;
    }, 0);
    return Math.round(total / goals.length);
  }, [goals]);

  const getTodayTasks = useCallback(() => {
    return goals.filter(g => g.status === "red" || g.status === "amber");
  }, [goals]);

  return (
    <AppContext.Provider value={{
      defineAnswers, defineComplete, goals, todayCompleted,
      setDefineAnswers, completeDefine, cycleGoalStatus, setGoalStatus,
      addGoal, toggleTodayTask, getPillarGoals, getPillarScore,
      getOverallScore, getTodayTasks,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
