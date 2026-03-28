# Test Coverage Analysis

**Date:** 2026-03-28
**Current test coverage:** 0% — no tests, no test runner, no test dependencies exist.

---

## Summary

The codebase has **zero test infrastructure**. There are no test files, no test runner (Jest/Vitest), no testing libraries (`@testing-library/react`, etc.), and no test scripts in `package.json`. The CI/CD pipeline (`deploy.yml`) runs only `npm run build` with no test step.

---

## Priority Areas for Test Coverage

### 1. **State Logic in `context.tsx`** — Critical Priority

This is the highest-value target. All business logic lives here as pure-ish functions inside React hooks. Key functions to test:

| Function | Why it needs tests |
|---|---|
| `getPillarScore(pillar)` | Weighted scoring (green=100, amber=50, red=0) averaged across goals. Incorrect math here silently corrupts the dashboard. |
| `getOverallScore()` | Same weighted average across all 15 goals. |
| `cycleGoalStatus(id)` | Status cycle: green → amber → red → green. A wrong rotation breaks the core interaction. |
| `toggleTodayTask(id)` | Has a side effect: completing a task nudges the goal status (red→amber, amber→green). This coupling is easy to break during refactoring. |
| `completeDefine()` | Conditionally resets goal statuses based on `focusArea`. The "All three, honestly" branch sets every goal to red — needs explicit coverage. |
| `addGoal(pillar, text, horizon)` | Generates IDs via `Date.now()`, sets default status to red, uses `text` as `todayAction`. |
| `getTodayTasks()` | Filters to red/amber goals only. Verify that green goals are excluded. |

**Recommended approach:** Extract the pure logic (score calculation, status cycling) into standalone utility functions that can be unit-tested without React rendering. Then add integration tests for the context hooks using `@testing-library/react` + `renderHook`.

### 2. **`today/page.tsx` — `getGreeting()` helper** — Medium Priority

The `getGreeting()` function returns time-of-day greetings based on `new Date().getHours()`. This is a pure function that's easy to test but also easy to break (off-by-one at boundary hours like 12 and 17).

| Input | Expected |
|---|---|
| hour < 12 | "Good morning." |
| 12 ≤ hour < 17 | "Good afternoon." |
| hour ≥ 17 | "Good evening." |

### 3. **Component Rendering — Dashboard** — Medium Priority

`dashboard/page.tsx` has the most complex UI logic:

- **`PillarTile`**: expand/collapse, inline goal list, add-goal form toggle
- **`StatusDot`**: click handler with `stopPropagation`
- **`AddGoalForm`**: form validation (empty text disables submit), horizon toggle
- **`MiniDots`**: renders correct color classes for each status
- **Display logic**: `{name}'s Aligned Life` vs `Your Aligned Life` based on whether a name is set

**Recommended tests:**
- Pillar tile expands on click and shows goals
- Clicking a status dot cycles the status
- Add-goal form validates non-empty text
- Score percentage displays correctly

### 4. **Component Rendering — Plan Flow** — Medium Priority

`plan/page.tsx` is a 6-step wizard with:

- Step progression and back navigation
- Three input types: `text`, `textarea`, `options`
- "Continue" button disabled when input is empty
- Final step triggers `completeDefine()` + router navigation to `/dashboard`
- Quote display per step (index-based)

**Recommended tests:**
- Navigation forward/backward through steps
- Continue button disabled when field is empty
- Selecting an option enables continue
- Final submission calls `completeDefine` and navigates

### 5. **Component Rendering — Peer Feedback** — Lower Priority

`peer/page.tsx` is simpler but still worth covering:

- Submit disabled until all 3 questions rated
- Submitted state shows thank-you message
- Rating selection highlights correctly

### 6. **Component Rendering — Today Page** — Medium Priority

`today/page.tsx` has conditional rendering worth testing:

- "All done" state shown when every task is completed
- Progress bar width calculation: `(doneCount / tasks.length) * 100%`
- Task cards show "Done — well played" vs "Mark as done"
- Tasks only include red/amber goals (not green)

---

## Recommended Test Infrastructure Setup

1. **Install dependencies:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
   ```

2. **Add `vitest.config.ts`** with React + jsdom environment

3. **Add `package.json` script:**
   ```json
   "test": "vitest",
   "test:ci": "vitest run"
   ```

4. **Add test step to `.github/workflows/deploy.yml`** before the build step

---

## Suggested Test File Structure

```
src/
├── app/
│   ├── context.test.tsx          # State logic unit + integration tests
│   ├── dashboard/
│   │   └── page.test.tsx         # Dashboard component tests
│   ├── plan/
│   │   └── page.test.tsx         # Plan wizard tests
│   ├── today/
│   │   └── page.test.tsx         # Today page tests
│   └── peer/
│       └── page.test.tsx         # Peer feedback tests
```

---

## Implementation Order (by ROI)

1. **`context.test.tsx`** — highest value, tests all business logic, catches regressions in scoring/status
2. **`today/page.test.tsx`** — `getGreeting()` + task completion flow
3. **`dashboard/page.test.tsx`** — expand/collapse, status cycling, add goal
4. **`plan/page.test.tsx`** — wizard navigation, form validation
5. **`peer/page.test.tsx`** — rating + submit flow
