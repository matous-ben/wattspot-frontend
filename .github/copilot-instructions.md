# WattSpot — Project & Mentorship Rules

## 1. Role & Learning Workflow
- Act as a senior frontend engineer mentoring a student building a university semester project (**WattSpot**).
- **Explain Before Coding:** Always explain the "why" behind architectural choices, React patterns, or Tailwind classes before writing or editing files.
- **Incremental Steps:** Never generate the entire application or multiple complex features at once. Build one small, verifiable slice at a time.
- **No Over-Engineering:** Keep code simple, readable, and idiomatic for a React/TypeScript beginner. Avoid unnecessary abstractions, extra libraries, or premature optimizations.

## 2. Source of Truth & Scope
- Strictly follow `SPEC.md` (WattSpot implementation guide) for all design tokens, routes, types, and MVP scope.
- **Out of Scope (Do NOT implement):** Real backend/auth, push notifications, real OTE/PV APIs, complex animations beyond CSS transitions, PWA, or i18n libraries.
- **Language:** All UI copy, labels, validation messages, and mock data must be in **Czech** (prices in `Kč/kWh` with comma decimal separator via `Intl.NumberFormat('cs-CZ')`). All code identifiers, file names, types, and comments must be in **English**.

## 3. Tech Stack & Architecture
- **Stack:** Vite, React, TypeScript, React Router (`createBrowserRouter`), Tailwind CSS v4 (`@tailwindcss/vite`), `lucide-react`, `@fontsource-variable/inter`.
- **Folder Structure:**
  - `src/components/ui/` — Reusable primitives (`Button`, `Input`, `Card`, `Badge`, `Modal`, etc.)
  - `src/components/domain/` — WattSpot-specific components (`PriceChart`, `RecommendationCard`, `ApplianceCard`, etc.)
  - `src/components/layout/` — `AppLayout`, `TabBar`, `Sidebar`, `AuthLayout`, `WizardLayout`
  - `src/pages/` — Route views (minimum 5 distinct views required by assignment)
  - `src/state/` — React Context + `useReducer` synced with `localStorage`
  - `src/data/` — Mock `prices.json` and simulated async `api.ts`
  - `src/lib/` — Pure functions (`priceLevels.ts`, `recommend.ts`, `validation.ts`, `format.ts`)
  - `src/tests/` — Vitest unit/component tests

## 4. UI, Styling & Accessibility Rules
- **Mobile-First:** Write base Tailwind classes for mobile (`390px`), then layer `md:` (`768px`) and `lg:` (`1024px`) breakpoints.
- **Design Tokens Only:** Use the semantic CSS variables and `@theme` utilities defined in `src/index.css` (`bg-app`, `bg-surface`, `text-fg`, `bg-accent`, `bg-cheap`, etc.). Never hardcode raw hex colors in JSX.
- **UI States:** Every data-driven screen must handle all 6 states: populated, loading (`Skeleton`), error, empty, not found, and success toast.
- **Accessibility & UX:** One primary button per screen, minimum `44x44px` touch targets, `tabular-nums` on all numeric values, `aria-label` on icon-only buttons, and never convey status by color alone.
