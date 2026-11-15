# WattSpot: průvodce implementací (React + Tailwind)

---

## 0. Jak s tím pracovat

- **Cíl:** funkční frontend (SPA) pro semestrální práci, s mock daty a bez backendu. Backend se řeší později ve volném čase.
- **Zásada:** nejdřív jednoduché a funkční, potom hezké. Žádné knihovny navíc, pokud nejsou nutné.
- **Mobile-first:** všechno píšeš nejdřív pro mobil (bez předpon v Tailwindu), pak přidáváš `md:` a `lg:` pro větší obrazovky.
- Co se **nedělá** (overkill): skutečné přihlášení a backend, push notifikace, skutečné API OTE a výroby FVE, animace nad rámec CSS přechodů, PWA, i18n knihovna.

## 1. Produkt v kostce

WattSpot ukazuje ceny elektřiny na spotu (OTE, day-ahead, po hodinách) a doporučuje nejlepší čas pro spuštění spotřebičů (pračka, myčka, bojler …). Uživatelé s fotovoltaikou (FVE) navíc vidí odhad výroby.

| Persona | Popis | Rozdíl v aplikaci |
|---|---|---|
| **A: s FVE** | dům s FVE (≈ 8 kWp) na spotu | graf cen + křivka výroby, doporučení s „FVE pokryje ~70 %", krok „Parametry FVE" v onboardingu |
| **B: bez FVE** | byt/dům bez FVE na spotu | jen graf cen a doporučení podle ceny |

V kódu je to jedna proměnná `user.hasPv` (boolean).

**Upřímná hodnota:** úspora na jeden spotřebič je jednotky až desítky Kč měsíčně. Texty proto říkají „zhruba" a nic nepřehánějí.

**Jazyk a formáty:** celé UI česky. Cena v **Kč/kWh**, desetinná čárka ("2,35"). Datum "Neděle, 1. listopadu".

```ts
// src/lib/format.ts
export const formatPrice = (n: number) =>
  new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const formatDate = (d: Date) => {
  const s = new Intl.DateTimeFormat('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
};
```

---

## 2. Technologie (jednoduchý základ)

| Oblast | Volba | Poznámka |
|---|---|---|
| Build | **Vite** + **React** + **TypeScript** | TypeScript je doporučený, není povinný |
| Routing | **React Router** | `createBrowserRouter`, vnořené layouty |
| Styly | **Tailwind CSS v4** | tokeny jako CSS proměnné (kap. 4) |
| Ikony | **lucide-react** | stejná sada jako ve Figmě |
| Písmo | **Inter** přes `@fontsource-variable/inter` | tabulární číslice přes třídu `tabular-nums` |
| Stav | **React Context + useReducer** | uživatel, spotřebiče, téma; ukládá se do `localStorage` |
| Data | `data/prices.json` + falešné API s `setTimeout` | zdroj: OTE-CR (reálný den doplníš později) |
| Validace | vlastní malé funkce | `zod` až když budeš chtít |
| Testy | **Vitest** + **React Testing Library**, volitelně **Playwright** | kap. 12 |
| Graf | **ručně z `div`** (flex) + jeden SVG pro křivku | žádná chart knihovna |

Doporučené příkazy (ověř podle aktuální dokumentace Vite a Tailwindu):

```bash
npm create vite@latest wattspot -- --template react-ts
cd wattspot && npm i react-router-dom lucide-react @fontsource-variable/inter
npm i tailwindcss @tailwindcss/vite
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Požadavky předmětu a jak je WattSpot plní

| Požadavek zadání | Řešení |
|---|---|
| SPA s komponentami | React, složky `components/`, `pages/` |
| Routování | React Router, kap. 5 |
| Správa stavu | Context + reducer, kap. 6 |
| Data na klientovi | mock JSON + `localStorage` |
| Zabezpečení a validace vstupů | validační funkce, route guard, React escapuje výstup, žádná hesla v `localStorage` |
| ≥ 5 různých views | Dashboard, Ceny, Doporučení (+ detail), Spotřebiče, Profil/Nastavení, + onboarding |
| Testy | Vitest (jednotkové), případně 1 e2e |
| Profilování | Lighthouse (kap. 12) |
| Dokumentace 1 až 2 strany + README | osnova v kap. 12 |

---

## 3. Responzivita: mobile-first, ale hezké i na desktopu

Figma má jen mobil. Desktop odvozuješ těmito pravidly. Breakpointy Tailwindu: `md` 768 px (tablet), `lg` 1024 px (desktop).

**Principy:**
1. Na mobilu je obsah v jednom sloupci, dole **TabBar**. Od `lg` vlevo **Sidebar** (240 px) místo TabBaru.
2. Obsah má omezenou šířku a je vycentrovaný, ať se na širokém monitoru neroztahuje.
3. Formuláře, onboarding a přihlášení jsou na desktopu **vycentrovaná karta** (max. 448 px), ne přes celou šířku.
4. Bottom sheet na mobilu se na `md+` mění v **vycentrované modální okno**.
5. Horizontální carousel na mobilu se na `lg` změní na svislý seznam vedle grafu.
6. Dotykové cíle zůstávají min. 44 px i na desktopu, přibývají `hover:` stavy.

```tsx
// src/components/layout/AppLayout.tsx: mobil: obsah + TabBar, desktop: Sidebar + obsah
export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-app text-fg lg:flex">
      <Sidebar className="hidden lg:flex" />
      <main className="flex-1 pb-24 lg:pb-10">
        <div className="mx-auto w-full max-w-md px-4 pt-6 md:max-w-2xl lg:max-w-5xl lg:px-8 lg:pt-10">
          <Outlet />
        </div>
      </main>
      <TabBar className="lg:hidden" />
    </div>
  );
}
```

**Rozložení podle typu obrazovky:**

| Obrazovka | Mobil (základ) | Desktop (`lg:`) |
|---|---|---|
| Dashboard | hero cena, přepínač Dnes/Zítra, graf, carousel doporučení | `grid lg:grid-cols-12 gap-6`: hero + graf `lg:col-span-8`, doporučení `lg:col-span-4` pod sebou |
| Ceny | graf + tooltip + seznam nejlevnějších hodin | graf vlevo (`col-span-7`), tabulka hodin vpravo (`col-span-5`) |
| Doporučení | karty pod sebou | `lg:grid-cols-2` |
| Detail doporučení | jeden sloupec | `lg:grid-cols-2`: okno + metriky vlevo, časová osa vpravo |
| Spotřebiče | seznam karet | `lg:grid-cols-2`, tlačítko „Přidat" v hlavičce |
| Profil / Nastavení | formulář pod sebou | formulář max. `max-w-xl` |
| Landing, přihlášení, onboarding | jeden sloupec | střed obrazovky, karta `md:bg-surface md:border md:rounded-2xl md:p-8` |
| Bottom sheet | `fixed bottom-0 rounded-t-2xl` | `md:` vycentrovaný modal `max-w-md rounded-2xl` |

Graf je vždy šířka 100 % rodiče a výška roste: `h-40 md:h-48 lg:h-64`.

---

## 4. Design tokeny (Tailwind v4)

Barvy jsou CSS proměnné, takže přepnutí tmavého/světlého tématu je jedna změna atributu `data-theme` na `<html>`. **Výchozí je tmavé.**

```css
/* src/index.css */
@import "tailwindcss";
@import "@fontsource-variable/inter";

:root {
  --bg-base: #121417;  --bg-surface: #1A1D22;  --bg-surface-2: #23272E;  --border: #2F343C;
  --text-primary: #E6E8EB;  --text-secondary: #9AA3AF;  --text-on-accent: #121417;
  --accent: #6B9BF2;
  --price-cheap: #34C38F;  --price-mid: #E3BE4A;  --price-expensive: #EF6B68;  --price-negative: #8E78F5;
  --solar: #F5A23A;  --grid: #7F8EA3;
  color-scheme: dark;
}
[data-theme="light"] {
  --bg-base: #F7F8FA;  --bg-surface: #FFFFFF;  --bg-surface-2: #F0F2F5;  --border: #E5E7EB;
  --text-primary: #0F1217;  --text-secondary: #5B6472;  --text-on-accent: #FFFFFF;
  --accent: #2B6BE0;
  --price-cheap: #0E7F58;  --price-mid: #B38600;  --price-expensive: #D03A36;  --price-negative: #5B3FD6;
  --solar: #C46A00;  --grid: #5A6A80;
  color-scheme: light;
}

@theme inline {
  --font-sans: "Inter Variable", system-ui, sans-serif;
  --color-app: var(--bg-base);
  --color-surface: var(--bg-surface);
  --color-surface-2: var(--bg-surface-2);
  --color-line: var(--border);
  --color-fg: var(--text-primary);
  --color-fg-muted: var(--text-secondary);
  --color-on-accent: var(--text-on-accent);
  --color-accent: var(--accent);
  --color-cheap: var(--price-cheap);
  --color-mid: var(--price-mid);
  --color-expensive: var(--price-expensive);
  --color-negative: var(--price-negative);
  --color-solar: var(--solar);
  --color-grid: var(--grid);
}

@layer base { body { @apply bg-app text-fg font-sans; } }
```

Přepínač tématu (stránka Nastavení): `document.documentElement.dataset.theme = 'light' | 'dark'` a uložit do `localStorage`.

**Figma token → třída v Tailwindu:**

| Figma token | Třída | Použití |
|---|---|---|
| `bg/base` | `bg-app` | pozadí aplikace |
| `bg/surface` | `bg-surface` | karty, inputy, tab bar |
| `bg/surface-2` | `bg-surface-2` | vybrané položky, skeleton, ikonová dlaždice |
| `border/default` | `border-line` | ohraničení 1 px |
| `text/primary`, `text/secondary` | `text-fg`, `text-fg-muted` | texty |
| `text/on-accent` | `text-on-accent` | text na primárním tlačítku |
| `accent/default` | `bg-accent`, `text-accent`, `border-accent` | primární akce, focus, aktivní záložka |
| `price/cheap|mid|expensive|negative` | `bg-cheap`, `bg-mid`, `bg-expensive`, `bg-negative` | sloupce grafu, tečky ve štítcích |
| `energy/solar`, `energy/grid` | `text-solar`, `stroke-solar` (SVG), `bg-grid` | výroba FVE, neutrální data |
| `feedback/*` | success = `cheap`, warning = `mid`, error = `expensive`, info = `accent` | alerty |
| `overlay` | `bg-black/60` | zatemnění pod sheetem |

**Pravidla pro barvy:** červená jen pro „drahá" a chyby. Text ve štítcích je vždy `text-fg`, barvu nese **tečka** a 16% podklad (`bg-cheap/15`). Barva nikdy není jediná informace (popisek „Levná/Střední/Drahá", výška sloupce).

**Typografie (Figma styl → třídy):** jedno písmo Inter, čísla s `tabular-nums`.

| Figma styl | Třídy |
|---|---|
| Numeric/XL 56/60, −2 % | `text-[56px] leading-[60px] font-semibold tracking-[-0.02em] tabular-nums` |
| Heading/H1 32/36 | `text-[32px] leading-9 font-semibold` |
| Heading/H2 24/28 | `text-2xl leading-7 font-semibold` |
| Heading/H3 20/24 | `text-xl leading-6 font-semibold` |
| Numeric/M 24/28 | `text-2xl leading-7 font-semibold tabular-nums` |
| Body/Regular 16/24 | `text-base` |
| Body/Small 14/20 | `text-sm` |
| Label/Button 14/20 | `text-sm font-semibold` |
| Label/Caption 12/16 | `text-xs font-medium` |

**Mezery a zaoblení:** Tailwind má škálu po 4 px: 4 = `1`, 8 = `2`, 12 = `3`, 16 = `4`, 24 = `6`, 32 = `8`, 48 = `12`. Zaoblení: 8 = `rounded-lg`, 12 = `rounded-xl`, 16 = `rounded-2xl`, kulaté = `rounded-full`. Mezery mezi bloky na stránce 24 px (`gap-6`), okraje stránky 16 px (`px-4`).

---

## 5. Struktura projektu a routy

```
src/
  main.tsx            # vstup, RouterProvider, AppProvider
  index.css           # Tailwind + tokeny
  routes.tsx          # definice rout
  components/
    ui/               # Button, IconButton, Input, NumberStepper, Toggle, Checkbox, SegmentedControl,
                      # Badge, Card, MetricCard, Alert, EmptyState, Skeleton, Modal, WizardProgress, Logo
    domain/           # PriceChart, TimeWindowBar, RecommendationCard, ApplianceCard, PriceRow
    layout/           # AppLayout, TabBar, Sidebar, AuthLayout, WizardLayout
  pages/              # jedna stránka = jeden soubor (viz tabulka)
  state/              # AppContext.tsx (context + reducer + localStorage)
  data/               # prices.json, api.ts (falešné API)
  lib/                # priceLevels.ts, recommend.ts, validation.ts, format.ts
  tests/              # *.test.ts(x)
```

**Routy a vazba na Figmu** (stav „hotovo" = návrh existuje ve Figmě):

| Route | Stránka | Figma | Layout / poznámka |
|---|---|---|---|
| `/` | Landing | 01 | AuthLayout; tlačítka → `/demo`, `/login` |
| `/demo` | Demo dashboard | 02, 02b | stejné jako dashboard se statickými daty, dá se zavřít `Alert`, CTA → `/register` |
| `/register` | Registrace | 03 | Input e-mail, heslo, Checkbox souhlas, validace → `/onboarding/welcome` |
| `/login` | Přihlášení | 04 | po odeslání krátký loading (skeleton) → `/dashboard` |
| `/forgot-password` | Zapomenuté heslo | 05 | statická, po odeslání `Alert` úspěch |
| `/onboarding/welcome` | Máš FVE? | 06 | WizardLayout, krok 1/5, nastaví `hasPv` |
| `/onboarding/location` | PSČ | 07 | krok 2/5, validace PSČ |
| `/onboarding/pv` | Parametry FVE | 08 | krok 3/5, jen když `hasPv` (jinak se přeskočí) |
| `/onboarding/appliances` | První spotřebiče | 09 | krok 4/5, Primary je zakázané bez spotřebiče |
| `/onboarding/done` | Hotovo | 10 | krok 5/5 → `/dashboard` |
| `/dashboard` | Dashboard | 11, 12, 13, 14, 15 | AppLayout; jedna stránka, varianta podle `hasPv`, stavy viz kap. 9 |
| `/prices` | Detail cen | 16, 16b | AppLayout; `day = today|tomorrow` |
| `/recommendations` | Seznam doporučení | 17 | AppLayout |
| `/recommendations/:id` | Detail doporučení | 18 | `id` = id spotřebiče |
| `/appliances` | Spotřebiče | 19, 19b, 20, 21, 21b, 22 | seznam + modaly (nejsou routy, stav v komponentě) |
| `/settings` | Nastavení (záložka Profil) | 24 | téma, odhlášení, odkaz na `/profile` |
| `/profile` | Domácnost | 23 | PSČ, FVE parametry |
| `*` | 404 | – | jednoduchý text a tlačítko zpět (ve Figmě není) |

**Záložky TabBaru / Sidebaru:** Domů → `/dashboard` (aktivní i na `/prices`), Doporučení → `/recommendations`, Spotřebiče → `/appliances`, Profil → `/settings`.

**Route guard:** `ProtectedRoute` pustí na `/dashboard`, `/prices`, `/recommendations*`, `/appliances`, `/profile`, `/settings` jen když v Contextu je `user`. Jinak redirect na `/login`. Po registraci se `user` uloží a vede se na onboarding. Odhlášení smaže `user` a vrací na `/`.

---

## 6. Data, stav a logika

```ts
// src/types.ts
export type Level = 'negative' | 'cheap' | 'mid' | 'expensive';
export type PricePoint = { hour: number; price: number };       // price v Kč/kWh, hour 0 až 23
export type DayPrices = { date: string; points: PricePoint[] };  // 24 bodů
export type PvPoint = { hour: number; kw: number };              // odhad výroby

export type Appliance = {
  id: string; name: string; powerKw: number; durationH: number; enabled: boolean;
  icon: 'washing-machine' | 'plug' | 'zap';
};
export type User = {
  email: string; hasPv: boolean; postalCode: string;
  pv?: { kwp: number; orientation: 'south' | 'east-west' | 'south-east'; tiltDeg: number };
};
export type Recommendation = {
  applianceId: string; startHour: number; endHour: number;
  avgPrice: number; nowPrice: number; savingKc: number; pvCoverPct?: number;
};
```

**Stav (Context + reducer):** `user | null`, `appliances: Appliance[]`, `theme: 'dark' | 'light'`. Akce: `register`, `logout`, `setPv`, `addAppliance`, `updateAppliance`, `removeAppliance`, `toggleAppliance`, `setTheme`. Každá změna se zapíše do `localStorage` (klíč `wattspot`) a při startu se načte.

**Falešné API (kvůli stavům loading/chyba):**

```ts
// src/data/api.ts
export async function getPrices(day: 'today' | 'tomorrow'): Promise<DayPrices | null> {
  await new Promise(r => setTimeout(r, 800));                 // ať je vidět skeleton
  if (day === 'tomorrow' && new Date().getHours() < 14) return null;   // zítřejší ceny ještě nejsou (stav 15)
  return day === 'today' ? todayJson : tomorrowJson;           // import z data/prices.json
}
```
Chybu (stav 14) vyvoláš dočasně přepínačem v kódu nebo `?error=1` v URL. `prices.json` má tvar `{ "today": { "date": "...", "points": [ {"hour":0,"price":2.10}, ... 24 položek ] }, "tomorrow": { ... } }`. Reálný den z OTE doplníš později, do té doby slouží vzorová data.

**Úrovně cen (třetiny dne, stejné pravidlo jako ve Figmě):**

```ts
// src/lib/priceLevels.ts
export function getLevels(prices: number[]): Level[] {
  const sorted = prices.filter(p => p >= 0).sort((a, b) => a - b);
  const n = sorted.length;
  const lo = sorted[Math.ceil(n / 3) - 1];
  const hi = sorted[Math.ceil((2 * n) / 3) - 1];
  return prices.map(p => (p < 0 ? 'negative' : p <= lo ? 'cheap' : p <= hi ? 'mid' : 'expensive'));
}
export const levelLabel: Record<Level, string> =
  { negative: 'Záporná', cheap: 'Levná', mid: 'Střední', expensive: 'Drahá' };
```

**Doporučení (nejlevnější souvislé okno):**

```ts
// src/lib/recommend.ts
export function bestWindow(prices: number[], durationH: number) {
  let best = { start: 0, avg: Infinity };
  for (let s = 0; s + durationH <= prices.length; s++) {
    const avg = prices.slice(s, s + durationH).reduce((a, b) => a + b, 0) / durationH;
    if (avg < best.avg) best = { start: s, avg };
  }
  return { startHour: best.start, endHour: best.start + durationH, avgPrice: best.avg };
}
// úspora v Kč = (cena teď − průměr okna) × příkon (kW) × délka (h); když je ≤ 0, doporučení se nezobrazí
```
Pro FVE: `pvCoverPct = min(100, round(průměrná výroba v okně / příkon × 100))`. Okna jsou po celých hodinách (Figma ukazuje „12:30–14:30", v kódu stačí „12:00–14:00" nebo později 15min data).

**Validace (jedna funkce = jedno pravidlo, vrací text chyby nebo `null`):**

| Pole | Pravidlo | Chybová hláška (návod) |
|---|---|---|
| e-mail | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | „Zadej e-mail ve tvaru jmeno@email.cz." |
| heslo | min. 8 znaků | „Heslo musí mít alespoň 8 znaků." |
| PSČ | `/^\d{3}\s?\d{2}$/` | „Zadej pět číslic, např. 500 03." |
| název spotřebiče | 1 až 30 znaků | „Zadej název, například Pračka." |
| příkon | 0,1 až 10 kW | „Zadej příkon mezi 0,1 a 10 kW." |
| délka cyklu | 1 až 12 h | „Zadej délku mezi 1 a 12 hodinami." |
| FVE výkon | 0,5 až 50 kWp | „Zadej výkon mezi 0,5 a 50 kWp." |

**Přihlášení je jen simulované.** Heslo se nikam neukládá, kontroluje se jen formát. Skutečné ověření přijde s backendem.

---

## 7. Komponenty

Každá komponenta ve Figmě má svůj React protějšek. Stavy ve Figmě (Hover, Pressed, Disabled …) řešíš třídami `hover:`, `active:`, `disabled:` a `focus-visible:`.

### UI (`components/ui`)

| Komponenta | Props | Tailwind (shrnutí) |
|---|---|---|
| **Button** | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'destructive'`, `size: 'md' \| 'sm'`, `loading`, `disabled`, `iconLeft`, `iconRight` | `h-12 px-6 rounded-xl text-sm font-semibold` (sm: `h-10 px-4`); primary `bg-accent text-on-accent hover:opacity-90 active:opacity-80`; secondary `bg-surface-2 border border-line`; ghost `text-accent`; destructive `border border-expensive text-expensive`; `disabled:opacity-40`; `focus-visible:outline-2 outline-accent` |
| **IconButton** | `icon`, `variant`, `label` (pro `aria-label`) | `size-11 rounded-xl` (44 px) |
| **Input** | `label`, `value`, `onChange`, `error?`, `helper?`, `suffix?`, `disabled` | label nad polem (`text-xs font-medium text-fg-muted`), pole `h-14 rounded-xl bg-surface border border-line px-4`, `focus:border-2 focus:border-accent`, chyba `border-expensive` + hláška `text-xs text-expensive` pod polem |
| **NumberStepper** | `value`, `onChange`, `min`, `max`, `step`, `unit` | `h-14 rounded-xl bg-surface border border-line`, dvě IconButton (− a +), `−` je zakázané na minimu |
| **Toggle** | `checked`, `onChange`, `label` | `w-14 h-8 rounded-full p-1`, knob `size-6 rounded-full`; zapnuto `bg-accent`, vypnuto `bg-surface-2 border border-line`; `transition-all duration-200` |
| **Checkbox** | `checked`, `onChange`, `label` | `size-6 rounded-lg border border-line`, zapnuto `bg-accent` + ikona `Check` |
| **SegmentedControl** | `options`, `value`, `onChange` | kontejner `rounded-xl bg-surface border border-line p-1`, položka `h-11 flex-1 rounded-lg text-sm font-semibold`; vybraná `bg-surface-2 text-fg`, jinak `text-fg-muted` |
| **Badge** (Tag/Badge) | `level: Level \| 'neutral'`, `status?: 'active' \| 'warning' \| 'error'`, `dot`, children | `h-6 px-2 rounded-full text-xs font-medium text-fg`, podklad `bg-cheap/15` apod., tečka `size-1.5 rounded-full bg-cheap` |
| **Card** | children | `rounded-2xl bg-surface border border-line p-4` |
| **MetricCard** | `label`, `value`, `unit`, `delta?` | Card, label `text-xs text-fg-muted`, hodnota Numeric/M, delta jako Badge |
| **Alert** (i toast) | `type: 'info' \| 'success' \| 'warning' \| 'error'`, `onClose?` | `rounded-xl p-3 flex gap-3`, podklad barva `/15`, ikona; toast zmizí sám po 2,5 s (`setTimeout`) |
| **EmptyState** | `icon`, `title`, `text`, `action?` | střed, ikona v kruhu `size-16 rounded-full bg-surface-2`, tlačítko Primary |
| **Skeleton** | `className` | `animate-pulse rounded-xl bg-surface-2` s rozměry obsahu |
| **Modal** (Bottom sheet) | `open`, `onClose`, children | `fixed inset-0 bg-black/60 flex items-end md:items-center justify-center`, panel `w-full max-w-md rounded-t-2xl md:rounded-2xl bg-surface p-4`; zavřít klikem mimo, tlačítkem × a klávesou Esc |
| **WizardProgress** | `step`, `total=5` | 5 pruhů `h-1 flex-1 rounded-full`, hotové `bg-accent`, ostatní `bg-surface-2` |
| **Logo** | `size` | SVG exportované z Figmy (`Logo/WattSpot`) do `src/assets/logo.svg` |

### Doménové (`components/domain`)

| Komponenta | Props | Poznámka |
|---|---|---|
| **PriceChart** | `points`, `levels`, `showProduction`, `pv?`, `showNow`, `onSelect` | 24 sloupců, viz kap. 8 |
| **ChartTooltip** | `hour`, `price`, `level` | po kliknutí na sloupec: čas, cena v Kč/kWh, Badge |
| **TimeWindowBar** | `startHour`, `endHour`, `solar?` | track `h-2 rounded-full bg-surface-2`, okno `bg-cheap` (absolutně, `left` a `width` v %) |
| **RecommendationCard** | `recommendation`, `appliance`, `hasPv` | Card: ikona + název + Badge „Ušetříš zhruba 8 Kč", okno „12:00–14:00" (H2), TimeWindowBar, tlačítko Detail; u FVE řádek „FVE pokryje ~70 %" |
| **ApplianceCard** | `appliance`, `onToggle`, `onEdit`, `onDelete` | řádek `min-h-[72px] p-3 gap-3`, ikona v dlaždici `size-10 rounded-xl bg-surface-2`, název + meta („2,0 kW · 2 h"), vpravo Toggle a ikony upravit/smazat |
| **PriceRow** (Table/Row) | `hour`, `price`, `level`, `selected?` | `h-14 flex items-center justify-between border-b border-line`, `hover:bg-surface-2`, vybraný `bg-surface-2` |

### Layout (`components/layout`)

| Komponenta | Poznámka |
|---|---|
| **TabBar** | `fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-line`, 4 položky (ikona 24 px + `text-xs`), aktivní `text-accent`, `pb-[env(safe-area-inset-bottom)]`, skrytý od `lg` |
| **Sidebar** | jen od `lg`: `w-60 shrink-0 border-r border-line p-4`, logo nahoře, stejné 4 položky svisle (`h-11 rounded-xl`, aktivní `bg-surface-2`), dole odhlášení; ve Figmě není, odvozuje se z TabBaru |
| **AuthLayout** | střed obrazovky, `max-w-md`, od `md` karta (`md:bg-surface md:border md:rounded-2xl md:p-8`) |
| **WizardLayout** | hlavička (IconButton zpět + WizardProgress), obsah, patička s jedním Primary tlačítkem (ve Figmě je zpět tlačítko ghost, ne primary) |

**Ikony (lucide-react):** `House`, `Sparkles`, `WashingMachine`, `Plug`, `User`, `ArrowUpRight`, `ArrowDownRight`, `ArrowLeft`, `Sun`, `Zap`, `Clock`, `ChevronRight`, `Plus`, `Minus`, `X`, `Check`, `CircleCheck`, `TriangleAlert`, `Info`, `Trash`, `Search`, `LoaderCircle`. Velikost 24 px, `strokeWidth` 2, barva `currentColor`.

---

## 8. Graf cen (nejdůležitější komponenta)

Bez knihovny. 24 sloupců ve flexboxu, výška v procentech z maxima dne.

```tsx
// src/components/domain/PriceChart.tsx (zkrácený základ)
const levelClass: Record<Level, string> = {
  cheap: 'bg-cheap', mid: 'bg-mid', expensive: 'bg-expensive', negative: 'bg-negative',
};

export function PriceChart({ points, levels, nowHour, selected, onSelect }: Props) {
  const max = Math.max(...points.map(p => p.price));
  return (
    <div className="relative">
      <div className="flex h-40 items-end gap-1 md:h-48 lg:h-64">
        {points.map((p, i) => (
          <button
            key={p.hour}
            onClick={() => onSelect(p.hour)}
            aria-label={`${p.hour}:00, ${formatPrice(p.price)} Kč/kWh, ${levelLabel[levels[i]]}`}
            style={{ height: `${Math.max(8, (Math.max(p.price, 0) / max) * 100)}%` }}
            className={`min-h-2 flex-1 rounded-t ${levelClass[levels[i]]}
              ${p.hour < (nowHour ?? 0) ? 'opacity-40' : ''}
              ${selected === p.hour ? 'ring-2 ring-fg' : ''}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs font-medium text-fg-muted tabular-nums">
        {['00', '06', '12', '18', '24'].map(h => <span key={h}>{h}</span>)}
      </div>
    </div>
  );
}
```

- **Marker „Teď"** (jen na Dnes): svislá čára `absolute top-0 bottom-6 w-0.5 bg-accent` s `left: (nowHour / 24) * 100%` a malý chip „Teď".
- **Křivka výroby** (jen když `hasPv`): SVG `absolute inset-0 pointer-events-none` s `viewBox="0 0 24 100"` a `preserveAspectRatio="none"`, `polyline` s `stroke-solar`, `fill: none`, tloušťka 2 px (`vector-effect: non-scaling-stroke`).
- **Tooltip:** po kliknutí na sloupec se zobrazí `ChartTooltip`, kliknutí mimo ho zavře.
- **Dnes/Zítra:** `SegmentedControl` mění `day`; sloupce mají přechod výšky (`transition-[height] duration-300`), takže se plynule přeanimují jako ve Figmě.
- Pod grafem poznámka „Zdroj: OTE-CR".

---

## 9. Obrazovky a stavy

Stavy má každá datová obrazovka vždy tyto: **naplněný, načítání (skeleton), chyba, prázdný, nic nenalezeno, úspěch (toast)**. Texty (česky, s návodem co dělat):

| Stav | Kde ve Figmě | Text a chování |
|---|---|---|
| Načítání | 13, 19d (archiv) | Skeleton místo grafu a karet, ne spinner |
| Chyba OTE | 14 | „Ceny se nepodařilo načíst. Zkontroluj připojení a zkus to znovu." + Primary „Zkusit znovu" |
| Zítřejší ceny nejsou | 15 | „Ceny na zítra ještě nejsou. OTE je zveřejňuje obvykle odpoledne." + Secondary „Zobrazit dnešek" |
| Prázdný seznam spotřebičů | 20 | „Zatím tu nic není. Přidej první spotřebič a ukážeme ti, kdy ho pustit." + Primary „Přidat spotřebič" |
| Nic nenalezeno | 19f (archiv) | „Nic jsme nenašli." + „Zrušit hledání" (stačí, když přidáš hledání do seznamu spotřebičů) |
| Úspěch | 19b | toast „Spotřebič uložen", zmizí po 2,5 s |
| Potvrzení smazání | 22 | modal „Smazat spotřebič Pračka?", text „Doporučení pro něj zmizí. Akci nelze vrátit.", Destructive „Smazat" + Secondary „Zrušit" |
| Přidat/upravit | 21, 21b | modal, formulář s validací, chyba u pole, Primary „Uložit", Ghost „Zrušit" |

**Pravidla formulářů:** popisek vždy nad polem (ne jen placeholder), chyba pod polem červeně s návodem, nepovinná pole označit „nepovinné", **jedno primární tlačítko na obrazovku**, tlačítko Uložit je při neplatném formuláři zakázané nebo ukáže chyby po kliknutí.

**Chování podle Figmy (pro přesnost):**
- Dashboard: nahoře datum + avatar (→ `/settings`), hero cena (Numeric XL) s Badge úrovně, přepínač Dnes/Zítra, graf, sekce „Doporučená okna" (carousel), poznámka o zdroji.
- Detail cen: graf, tooltip, „Nejlevnější hodiny" (5× PriceRow), přepnutí na Zítra.
- Seznam doporučení: karty doporučení (jedno pro každý zapnutý spotřebič), klik → detail.
- Detail doporučení: velké okno, text „Ušetříš zhruba X Kč oproti spuštění teď", TimeWindowBar s popisky hodin, dvě MetricCard (průměrná cena okna, cena teď, u FVE třetí „Pokryje FVE"), Secondary „Upravit spotřebič".
- Spotřebiče: seznam ApplianceCard (Toggle zapíná/vypíná, ikony upravit a smazat), Primary „Přidat spotřebič".
- Nastavení: téma (Tmavý/Světlý), odkaz na Domácnost, „Odhlásit se".

---

## 10. Přístupnost a kvalita (stručný seznam)

- Kontrast textu min. 4,5 : 1 (návrh ho splňuje, nepřebarvuj tokeny).
- Každé tlačítko s ikonou má `aria-label`. Sloupce grafu mají popisek (čas, cena, úroveň).
- Dotykové cíle min. 44 × 44 px, viditelný focus (`focus-visible`).
- Modal se zavře klávesou Esc a vrací focus na tlačítko, které ho otevřelo.
- Informace není jen barvou. Čísla v `tabular-nums`.
- Animace jen CSS přechody 150 až 300 ms. Ctít `prefers-reduced-motion` (`motion-reduce:transition-none`).

---

## 11. Doporučené pořadí práce (výukově, od jednoduchého k složitějšímu)

Orientační plán do začátku prosince (💡 návrh, přizpůsob podle stáže):

| Týden | Co | Co se naučíš |
|---|---|---|
| 1 (7. až 14. 11.) | scaffold Vite + Tailwind, tokeny, `Button`, `Card`, `Input`, `Badge`, layouty (`AppLayout`, `TabBar`, `Sidebar`), router s prázdnými stránkami | Tailwind, props, komponenty, React Router |
| 1–2 | `data/prices.json` + `api.ts`, `getLevels`, `PriceChart`, Dashboard (hero, přepínač, graf, stavy loading/chyba) | `useState`, `useEffect`, asynchronní data, podmíněné vykreslování |
| 2 (15. až 21. 11.) | Context + reducer + `localStorage`, stránka Spotřebiče (CRUD, Modal, validace), toast | globální stav, formuláře, validace |
| 2–3 | `bestWindow`, Doporučení + detail, Detail cen s tooltipem | čisté funkce, odvozená data |
| 3 (22. až 28. 11.) | Onboarding wizard + route guard, Profil, Nastavení (téma), registrace/přihlášení (simulované) | vnořené routy, ochrana rout, témata |
| 3–4 | testy (Vitest), Lighthouse, optimalizace (`React.lazy` pro stránky) | testování, výkon |
| 4 (29. 11. až 5. 12.) | README, dokumentace 1 až 2 strany, příprava obhajoby, rezerva | argumentace řešení |

**Pořadí důležitosti:** Dashboard → Spotřebiče (stav + formulář) → Doporučení → Ceny → Onboarding → Profil/Nastavení → Landing/Demo → vše ostatní. Pokud bude těsno, vynech `/demo`, `/forgot-password` a světlý režim (tokeny pro něj už jsou, stačí přepínač).

---

## 12. Testy, výkon a dokumentace (pro hodnocení)

**Jednotkové testy (Vitest):**
1. `getLevels`: 24 hodnot dává 8 × cheap, 8 × mid, 8 × expensive, záporná hodnota je `negative`.
2. `bestWindow`: najde nejlevnější souvislé okno daného počtu hodin.
3. validační funkce: platné a neplatné vstupy (e-mail, PSČ, příkon).
4. reducer: `addAppliance`, `removeAppliance`, `toggleAppliance`.
5. komponenty (React Testing Library): `Button` je zakázané při `disabled`, `Input` ukáže chybu, `PriceChart` vykreslí 24 sloupců.

**E2E (volitelné, Playwright):** jeden scénář: registrace → onboarding → dashboard → přidat spotřebič → je v seznamu.

**Výkon (Lighthouse):** `npm run build && npm run preview`, Lighthouse v Chrome DevTools. Cíle: Performance ≥ 90, Accessibility ≥ 95. Tipy: `React.lazy` pro stránky, jedno písmo (Inter variable), žádné velké knihovny, obrázky nejsou potřeba. Ulož si screenshot výsledku před a po optimalizaci do dokumentace.

**README musí obsahovat:** stručný popis, instalaci a spuštění (`npm install`, `npm run dev`), testy (`npm test`), build (`npm run build`), strukturu složek.

**Dokumentace (1 až 2 strany, PDF):** (1) zvolený framework a struktura projektu, (2) architektura komponent (ui / domain / layout), (3) správa stavu a dat (Context, reducer, localStorage, falešné API), (4) použité nástroje a testy, (5) výsledek Lighthouse. K obhajobě si připrav odpovědi: proč Context místo Reduxu, proč graf bez knihovny, jak funguje route guard, jak se počítá doporučení.

**Hodnocení (max. 12 b):** architektura a logika 3 b, typování a práce s daty 2 b, testy a optimalizace 2 b, dokumentace a obhajoba 5 b. Nejvíc bodů je za dokumentaci a schopnost řešení vysvětlit, takže na ně vyhraď čas.

---

## 13. Otevřené body

1. **Reálná data:** zatím vzorový `prices.json`. Později 24 hodinových cen z OTE (a odhad výroby pro PSČ).
2. **Logo:** exportovat `Logo/WattSpot` z Figmy jako SVG.
3. **Backend:** později a ve volném čase. API tvar `getPrices(day)` už připravuje výměnu mocku za skutečné volání.
4. **Světlý režim:** tokeny jsou připravené, přepínač v Nastavení stačí na jeden `data-theme`.

---

## 14. Pravidla pro každý LLM, který tento soubor používá

- Používej jen tokeny, komponenty a třídy z tohoto souboru. Nové věci nejdřív navrhni, nepřidávej tiše.
- UI texty česky, identifikátory a komentáře v kódu anglicky.
- Nepřidávej funkce mimo MVP (viz kap. 0).
- Udržuj kód jednoduchý a srozumitelný pro začátečníka: malé komponenty, jasné názvy, minimum abstrakcí.
- Dodrž: jedno primární tlačítko na obrazovku, dotykové cíle ≥ 44 px, `tabular-nums` u čísel, všech šest stavů datových obrazovek, barva není jediná informace.
