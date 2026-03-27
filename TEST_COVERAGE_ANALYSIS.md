# Test Coverage Analysis

## Current State

**Test coverage: 0%** — The project has no test files, no test framework configured, and no test dependencies installed.

- 0 test files
- 0 test configuration (no jest/vitest config)
- No test runner in `package.json` scripts
- No testing libraries in dependencies

---

## Source Files Inventory

| File | Lines | Description |
|------|-------|-------------|
| `src/app/context.tsx` | 177 | Central state management — all business logic |
| `src/app/dashboard/page.tsx` | 190 | Dashboard with pillar tiles, score display, goal management |
| `src/app/today/page.tsx` | 128 | Daily task view with progress tracking |
| `src/app/plan/page.tsx` | 195 | 6-step onboarding form |
| `src/app/peer/page.tsx` | 83 | Peer feedback rating form |
| `src/app/page.tsx` | ~40 | Home page (static) |
| `src/app/layout.tsx` | ~30 | Root layout |

---

## Recommended Test Areas (Priority Order)

### 1. Context Business Logic (CRITICAL)

**File:** `src/app/context.tsx`
**Why:** This is the heart of the app — all state transitions, scoring, and data logic live here. Pure logic tests give the highest value for the least effort.

Tests to write:
- **`getPillarScore()`** — Verify scoring: green=100, amber=50, red=0, averaged across goals. Edge case: pillar with 0 goals returns 0.
- **`getOverallScore()`** — Same scoring across all goals. Edge case: empty goals array returns 0.
- **`cycleGoalStatus()`** — Verify cycle: green → amber → red → green. Verify non-matching goal IDs are untouched.
- **`toggleTodayTask()`** — Verify toggle adds/removes from completed set. Verify the "nudge" side effect: completing a red task moves it to amber, completing an amber task moves it to green. Verify un-toggling does NOT reverse the status nudge.
- **`completeDefine()`** — When `focusArea` is a specific pillar (e.g. "Physical Health"), all goals in that pillar should become red. When `focusArea` is "All three, honestly", ALL goals should become red. When `focusArea` is empty/unset, goals should not change.
- **`addGoal()`** — New goal should have correct pillar, text, horizon, status="red", and a unique `custom_*` id.
- **`getTodayTasks()`** — Should return only goals with status "red" or "amber" (not "green").
- **`getPillarGoals()`** — Should filter goals correctly by pillar.

### 2. Dashboard Component Interactions (HIGH)

**File:** `src/app/dashboard/page.tsx`
**Why:** Most interactive page — has expand/collapse, status cycling, goal creation, and score display.

Tests to write:
- **PillarTile expand/collapse** — Clicking the tile header toggles goal visibility.
- **StatusDot click** — Clicking a status dot calls `cycleGoalStatus` and `e.stopPropagation()` prevents tile collapse.
- **AddGoalForm** — Empty text should disable the "Add" button. Submitting with text calls `addGoal` with correct pillar/horizon. Cancel hides the form.
- **Score display** — Overall score renders in the header. Per-pillar scores render in each tile.
- **Name personalization** — Shows `"{name}'s Aligned Life"` when name is set, "Your Aligned Life" otherwise.

### 3. Today Page Task Workflow (HIGH)

**File:** `src/app/today/page.tsx`
**Why:** Core daily engagement feature with progress tracking and state-dependent UI.

Tests to write:
- **Task list rendering** — Only red/amber goals appear as today tasks.
- **Toggle completion** — Clicking "Mark as done" calls `toggleTodayTask`, button text changes to "Done — well played", card gets opacity-50.
- **Progress bar** — Reflects `doneCount / tasks.length` correctly.
- **All-done state** — When all tasks are completed, shows the congratulatory message instead of the task list.
- **`getGreeting()`** — Returns correct greeting based on time of day (morning/afternoon/evening).

### 4. Plan/Onboarding Flow (MEDIUM)

**File:** `src/app/plan/page.tsx`
**Why:** Multi-step form with navigation and state submission — bugs here break onboarding.

Tests to write:
- **Step navigation** — "Continue" advances step, "Back" goes to previous step, "Back" is hidden on step 0.
- **Input validation** — Continue button is disabled when input is empty.
- **Question types** — Text input, textarea, and option-select all render correctly per question type.
- **Final submission** — On the last step, submitting calls `setDefineAnswers` with all collected answers and `completeDefine()`, then navigates to `/dashboard`.
- **Step counter** — Displays correct `{step + 1} / {total}`.

### 5. Peer Feedback Page (MEDIUM)

**File:** `src/app/peer/page.tsx`
**Why:** Standalone form with submit gating and a submitted-state view.

Tests to write:
- **Rating selection** — Clicking a rating button highlights it. Each question tracks its own rating independently.
- **Submit gating** — Submit button is disabled until all 3 questions have a rating.
- **Submitted state** — After submission, shows thank-you message with link to home.

### 6. Edge Cases and Integration (LOW — but valuable)

Tests to write:
- **useApp outside AppProvider** — Should throw `"useApp must be used within AppProvider"`.
- **Default goals** — 15 default goals: 5 per pillar, correct mix of statuses and horizons.
- **Full onboarding → dashboard flow** — Complete the plan form, verify goals are colored based on focus area, verify dashboard renders with personalized name and scores.
- **Task completion → score update** — Toggle a red task done, verify pillar score increases.

---

## Recommended Setup

**Framework:** Vitest (fast, native ESM/TypeScript, integrates well with Next.js)
**Component testing:** `@testing-library/react` + `@testing-library/user-event`
**Priorities for first PR:** Areas 1 (context logic) and 3 (today page), since they cover the most critical business logic and the primary user interaction.

### Suggested Dependencies

```
vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Summary

| Area | Priority | Effort | Impact |
|------|----------|--------|--------|
| Context business logic | CRITICAL | Low | High — covers all state transitions and scoring |
| Dashboard interactions | HIGH | Medium | High — most complex UI component |
| Today page workflow | HIGH | Medium | High — core daily engagement feature |
| Plan/onboarding flow | MEDIUM | Medium | Medium — used once per user but critical path |
| Peer feedback page | MEDIUM | Low | Low-Medium — simple isolated form |
| Integration / edge cases | LOW | High | Medium — catches cross-component bugs |
