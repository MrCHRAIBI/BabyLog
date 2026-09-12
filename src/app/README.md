# Routes (Expo Router, typed routes)

Écrans FINS — aucune logique métier, aucun SQL, aucun appel service direct (convention docs/04).

Arborescence cible (docs/06) :
- `_layout.tsx` — Root : ErrorBoundary, ThemeProvider, i18n init, import `global.css`
- `(setup)/onboarding` — onboarding express < 45 s + disclaimer
- `(tabs)/_layout` — Tab bar 4 onglets (Journal, Tracker, Stats, Paramètres)
- `(tabs)/index` — Journal / Timeline 7 jours
- `(tabs)/track` — Suivi 1-Tap (Feed / Sleep / Diaper)
- `(tabs)/stats` — Stats diurnes + SweetSpot (seule zone ads native autorisée)
- `(tabs)/settings` — Paramètres & sauvegarde
- `pdf-export` — modal Export PDF pédiatre
- `backup/export`, `backup/import` — backup chiffré `.babylog`
- `paywall` — modal paywall Lifetime
- `+not-found.tsx`
