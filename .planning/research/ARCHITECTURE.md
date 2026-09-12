# Architecture Research

**Domain:** Local-first offline-only mobile app (newborn care tracker), Expo SDK 57 / RN 0.86.3 / New Architecture
**Researched:** 2026-09-12
**Confidence:** HIGH (primary claims cross-verified against the actual npm package tarballs for SDK 57 — expo-sqlite@57.0.3, react-native-mmkv@4.3.2, expo-iap@5.6.0, react-native-iap@16.6.0, react-native-google-mobile-ads@16.5.0 — and official docs.expo.dev v57 pages)

## Verdict on the Specified Architecture (docs/04 + docs/05)

The layered architecture in `docs/04` (thin routes → feature folders → services → repositories → SQLite/MMKV) and the data layer in `docs/05` (m001 DDL, DbAdapter, backup format) are **validated as fundamentally sound for SDK 57**. The layering matches how offline-first Expo apps are structured in 2026 and requires **no restructuring**. Five concrete corrections are needed because several pinned library APIs changed since the docs were written (2026-09-10 drafts), and one upgrade opportunity exists:

| # | Spec item (docs/04) | Status | Evidence (SDK 57 ground truth) |
|---|---------------------|--------|-------------------------------|
| 1 | Folder tree `src/app` + `src/features` + `src/core` + `src/lib`, conventions 1–12 | **VALIDATED** | Matches current Expo Router v6 best practice; scaffold alias `@/*` → `./src/*` already present; `src/app` is natively supported |
| 2 | `react-native-mmkv/plugin` in app.json plugins; MMKV instance API | **CORRECT — plugin obsolete, API renamed** | MMKV v4.3.2 is a Nitro Modules rewrite: it ships **no Expo config plugin** anymore (Nitro autolinking handles prebuild) and the API is `createMMKV({ id, encryptionKey })`, not `new MMKV()` |
| 3 | `react-native-iap` + config plugin `react-native-iap`; API `requestPurchase(productId)` / `getPurchases()` | **CORRECT — switch to expo-iap** | react-native-iap v16.6.0 is Nitro/OpenIAP-based, peers on `react-native-nitro-modules ^0.36.5`, ships **no Expo config plugin**, and its README explicitly states Expo Go **and** Expo Dev Client are unsupported, directing Expo projects to **expo-iap** (v5.6.0: peers only `expo`, ships a full `withIAP` config plugin, same OpenIAP spec, hook-based API) |
| 4 | AdMob plugin keys `userTrackingPermission`, `childDirectedTreatment`, `maxAdContentRating` | **CORRECT — keys moved** | Plugin v16.5.0 accepts only: `androidAppId`, `iosAppId`, `delayAppMeasurementInit`, `optimizeInitialization`, `optimizeAdLoading`, `skAdNetworkItems`, `userTrackingUsageDescription`. `maxAdContentRating` / `tagForChildDirectedTreatment` are now **runtime** `mobileAds().setRequestConfiguration({...})` |
| 5 | "openDatabaseSync" + WAL + foreign_keys + schema_version migrations | **VALIDATED** | `openDatabaseSync(name, options?)` unchanged; docs recommend exactly `PRAGMA journal_mode = WAL` + `PRAGMA foreign_keys = ON` at creation; transaction helpers exist (`withTransactionSync`, `withExclusiveTransactionAsync`) matching the m001/backup needs |
| 6 | PII column-level AES-256 (crypto-js) | **VALIDATED + optional upgrade** | expo-sqlite has **no** per-open encryption option (verified in `SQLiteOpenOptions`), but SDK 57 supports **full-database SQLCipher** via its own config plugin (`["expo-sqlite", { "useSQLCipher": true }]` + `PRAGMA key`). Keep column-level encryption (spec guarantee); adopt SQLCipher as one-line defense-in-depth. Not available on Expo Go (irrelevant — MMKV/ads/IAP already force a dev build) |
| 7 | Timer crash-survival in MMKV `timer:`, strict `partialize` | **VALIDATED** | Zustand 5 `persist` + `partialize` unchanged; docs warn persisted data gets **no runtime validation** — validate rehydrated state with Zod in the adapter (aligns with "Zod at every boundary") |
| 8 | `(auth)` group → renamed `(setup)` (addendum v2) | **VALIDATED + upgrade path** | Router v6's official gating is **`<Stack.Protected guard={...}>`** in the root layout (SDK 53+), replacing redirect-in-useEffect patterns. Use it for the onboarding gate |

Also: `tsconfig.json` in the repo currently lacks `"noUncheckedIndexedAccess": true` required by the spec — add it at scaffold phase (one line).

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  ROUTES  src/app (Expo Router v6, typed routes) — thin, zero logic   │
│  ┌──────────────┐ ┌───────────────────────────────────────────────┐  │
│  │ (setup)/     │ │ (tabs)/  index=Timeline · track · stats ·     │  │
│  │  onboarding  │ │          settings      paywall(modal) backup/ │  │
│  └──────┬───────┘ └───────────────┬───────────────────────────────┘  │
│         │      <Stack.Protected guard={onboarded}> in _layout       │
├─────────┼──────────────────────────┼──────────────────────────────────┤
│  FEATURES  src/features/<name>/{screens,hooks,services,repository,   │
│            models,stores,index.ts}   — only public via index.ts      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌────────┐           │
│  │ tracking     │ │ prediction   │ │ backup   │ │ onb.   │ …         │
│  └──────┬───────┘ └──────┬───────┘ └────┬─────┘ └───┬────┘           │
├─────────┼────────────────┼──────────────┼───────────┼────────────────┤
│  HOOKS (ViewModels)  useTracking / useTimeline / useBackupExport …   │
│         try/catch → error_log · Zod at every boundary                │
├──────────────────────────────────────────────────────────────────────┤
│  SERVICES  pure JS, dependency-injected (no React, no SQL, no MMKV)  │
│  trackingService · predictionService(EMA) · backupService · pdf      │
├──────────────────────────────────────────────────────────────────────┤
│  REPOSITORIES  typed methods only, SQL nowhere else, depend ONLY on  │
│  DbAdapter { exec, run, get, getAll, transaction }                   │
│  sessionRepository · babyProfileRepository · wakeWindowRepository ·  │
│  reportRepository · backupRepository · eventRepository …             │
├──────────────────────────────────────────────────────────────────────┤
│  CORE  src/core — the only place that touches platform SDKs          │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────┐ ┌────────────────┐    │
│  │ database/   │ │ storage/     │ │ boot/    │ │ billing/ ads/  │    │
│  │ init migrate│ │ mmkv.ts      │ │ bootstrap│ │ (lazy-loaded,  │    │
│  │ DbAdapter   │ │ zustand-     │ │ .ts (NEW)│ │  post-onboard  │    │
│  │ migrations/ │ │ adapter      │ └──────────┘ │  only)         │    │
│  └─────────────┘ └──────────────┘              └────────────────┘    │
├──────────────────────────────────────────────────────────────────────┤
│  PLATFORM  expo-sqlite (WAL) · MMKV v4 (std + encrypted instance) ·  │
│  expo-secure-store (master key) · expo-print/sharing · haptics ·     │
│  notifications                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/_layout.tsx` | Boot orchestration mount, splash hold, `Stack.Protected` onboarding gate, ErrorBoundary, providers (i18n, SafeArea, NavTheme) | `SplashScreen.preventAutoHideAsync()` at module scope; run `bootstrap()` in `useEffect`; render `<Stack>` with guarded groups only when ready |
| Routes (`app/**/*.tsx`) | Parse params, render feature screen, define `Stack.Screen` options (paywall = `presentation: 'modal'`) | ≤ 20 lines each; never import services/repositories |
| Feature `hooks/` | ViewModels: call services + repositories, own async/error state, expose actions + derived data | Plain hooks; try/catch → `error_log` via `core/analytics`; Zod-parse external inputs |
| Feature `services/` | Pure business logic (session duration, EMA SweetSpot, backup envelope) | Functions with injected deps `(db, now, crypto)` — 80 % Vitest target |
| Feature `repository/` | The ONLY SQL: typed methods mirroring docs/05 exact SQL | Depend solely on `DbAdapter` interface; positional `?` params |
| `core/database/` | Singleton open + PRAGMAs, `schema_version` migrator, `DbAdapter` type + expo-sqlite impl | `openDatabaseSync` once at boot; migrations transactional + idempotent |
| `core/storage/` | MMKV instances (default + encrypted), Zustand↔MMKV `createJSONStorage` adapter with Zod validation, MMKV namespace constants | `createMMKV()` (v4 API); encrypted instance key derived from secure-store master key |
| `core/boot/bootstrap.ts` (**new, recommended**) | The ordered boot pipeline as one testable function | Returns `{ onboarded, bootDurationMs }`; no feature imports; the single seam for the offline guarantee |
| `core/billing/`, `core/ads/` | Entitlements in encrypted MMKV; deferred IAP/ads init; UMP consent; hard-coded frequency rules | **Lazily imported** (`await import(...)`) only after `onboarding_completed`; never at module scope of any route |
| `core/ui/` | 26 Nocturne Glow components; `#FFFFFF` ban | Thin RN wrappers, NativeWind classes only |
| `lib/` | constants, config flags, i18n | Pure data/modules, no side effects at import |

## Recommended Project Structure

```
src/
├── app/                          # Expo Router v6 routes — THIN, typed routes ON
│   ├── _layout.tsx               # preventAutoHideAsync, bootstrap(), Stack.Protected gate
│   ├── (setup)/                  # pre-onboarding group (guarded when onboarded)
│   │   └── onboarding.tsx
│   ├── (tabs)/                   # post-onboarding group (guarded when !onboarded)
│   │   ├── _layout.tsx           # Tabs: Timeline(index), Track, Stats, Settings
│   │   ├── index.tsx  track.tsx  stats.tsx  settings.tsx
│   ├── paywall.tsx               # presentation: 'modal'
│   ├── backup/  export.tsx  import.tsx
│   └── +not-found.tsx
├── features/
│   ├── tracking/     {screens, hooks, services, repository, models, index.ts}
│   │   └── stores/timerStore.ts     # NEW: crash-surviving timer lives with its domain
│   ├── prediction/   {hooks, services, repository, models, index.ts}
│   ├── pdf-export/   {screens, hooks, services, repository, models, index.ts}
│   ├── backup/       {screens, hooks, services, repository, models, index.ts}
│   ├── onboarding/   {screens, hooks, repository(babyProfile), index.ts}
│   ├── paywall/      {screens, hooks, index.ts}
│   └── settings/     {screens, hooks, index.ts}
├── core/
│   ├── boot/bootstrap.ts           # NEW: ordered pipeline, returns boot state
│   ├── database/ {init, migrate, query(DbAdapter), migrations/m001_initial.ts}
│   ├── storage/  {mmkv.ts, zustandMmkvStorage.ts, namespaces.ts}
│   │   └── stores/settingsStore.ts # only truly global store stays in core
│   ├── billing/  {iapService, entitlements, products, hooks/}
│   ├── ads/      {adService, consent, rules, hooks/}
│   ├── analytics/{tracker, events, export}
│   ├── notifications/  security/crypto  ui/  utils/
├── lib/  {constants, config, i18n/{index,locales/{en,fr,es,it,ja},i18next.d.ts}}
└── components/ hooks/ constants/     # template leftovers — DELETE (docs/04: template replaced)
```

### Structure Rationale

- **`app/` stays route-thin and the tree stays exactly as docs/04** — Expo Router v6 file conventions and typed routes are stable; nothing in SDK 57 invalidates it.
- **`core/boot/` is the one genuine gap in docs/04.** Without it, boot steps scatter across `_layout.tsx` effects and become untestable and un-auditable against the zero-network rule. One `bootstrap()` function = one place to review, one place to time (`boot_duration_ms` event), one place to unit-test the ordering.
- **Feature stores move next to their domain** (`features/tracking/stores/timerStore.ts`). docs/04 put both stores under `core/storage/stores/`; only genuinely global state (settings, and arguably `quota:` counters) belongs in core. Same information architecture, better cohesion — hooks import it via the feature's `index.ts` barrel exactly as before.
- **Delete `src/components`, `src/hooks`, `src/constants` template dirs** — already decided in PROJECT.md ("template remplacé"), listed here so the scaffold phase has an explicit checklist item.

## Architectural Patterns

### Pattern 1: Ordered Boot Pipeline + Splash Gate + Protected Routes

**What:** All async startup work runs as one ordered pipeline while the splash screen is held; the router renders only guarded groups afterwards. This is the officially documented SDK 53+ pattern (`Stack.Protected` + "keep splash visible until [state] loads").
**When to use:** Every app that must not render features before local state (DB, migrations, flags) is ready.
**Trade-offs:** Adds ~40 lines of boot code; in exchange, no screen ever sees an un-migrated DB and the offline guarantee is auditable in one function.

```typescript
// src/app/_layout.tsx
SplashScreen.preventAutoHideAsync();          // module scope — never inside a component

export default function RootLayout() {
  const [state, setState] = useState<BootState | null>(null);
  useEffect(() => { bootstrap().then(setState).catch(reportFatal); }, []);
  useEffect(() => { if (state) SplashScreen.hide(); }, [state]);
  if (!state) return null;                    // splash still covering
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Protected guard={state.onboarded}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!state.onboarded}>
          <Stack.Screen name="(setup)" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}
```

```typescript
// src/core/boot/bootstrap.ts — the offline guarantee lives HERE
export async function bootstrap(deps = realDeps): Promise<BootState> {
  const t0 = Date.now();
  const masterKey = await ensureMasterKey(deps.secureStore, deps.crypto);   // 1. key bootstrap
  const db = openDatabase(masterKey);                                       // 2. open + PRAGMAs (+ PRAGMA key if SQLCipher)
  await migrate(db);                                                        // 3. schema_version migrations, transactional
  hydrateStores(deps.mmkv);                                                 // 4. Zustand ← MMKV (sync rehydration)
  const onboarded = deps.mmkv.getBoolean('onboarding:completed') ?? false;  // 5. routing flag
  track('boot_completed', { duration_ms: Date.now() - t0 });                // 6. local-only event
  return { onboarded };
}
```

**Zero-network-before-onboarding guarantee — three enforced layers:**
1. **Pipeline contains no network steps.** `bootstrap()` touches only secure-store, SQLite, MMKV — all local. Ads/IAP are not in it, and step 5's flag is the only switch any UI reads to decide showing them.
2. **Native auto-init disabled at build time.** ads config plugin: `optimizeInitialization: false` + `delayAppMeasurementInit: true` (verified plugin options v16.5.0) — the native SDK then only starts when JS calls `mobileAds().initialize()`. expo-iap only connects on explicit `initConnection()`.
3. **JS import discipline.** `react-native-google-mobile-ads` and `expo-iap` are imported *only* inside `core/ads/` and `core/billing/`, loaded with `await import('@/core/ads/adService')` from the post-onboarding code path. Enforced mechanically: ESLint `no-restricted-imports` banning those packages outside `src/core/{ads,billing}` + an airplane-mode first-launch smoke test in CI.

Deferred init call-site: on `(tabs)` first mount, if `onboarded && !isPremium && !adsInitialized` → UMP consent flow → `setRequestConfiguration({ maxAdContentRating: 'G', tagForChildDirectedTreatment: false })` → `mobileAds().initialize()`. IAP: `initConnection()` lazily on paywall/settings mount (needed for both free restore and purchase).

### Pattern 2: Repository Pattern over a `DbAdapter` Interface (test seam)

**What:** Repositories receive a `DbAdapter { exec, run, get, getAll, transaction }`; production binds expo-sqlite, tests bind better-sqlite3 `:memory:`. Exactly as addendum v2 specifies — validated and kept.
**When to use:** Always; it is the single most valuable testability decision in the codebase (80 % coverage target on `repository/` + `services/` is only reachable through it).
**Trade-offs:** One indirection layer; the interface must be the *intersection* of both engines' semantics.

```typescript
// core/database/query.ts
export interface DbAdapter {
  exec(sql: string): void;                                   // multi-statement (migrations, PRAGMAs)
  run(sql: string, params?: unknown[]): { changes: number };
  get<T>(sql: string, params?: unknown[]): T | null;
  getAll<T>(sql: string, params?: unknown[]): T[];
  transaction<T>(fn: (tx: DbAdapter) => Promise<T>): Promise<T>;
}
```

**Critical implementation note (verified in better-sqlite3 docs):** better-sqlite3's own `db.transaction()` **does not work with async functions**. The test adapter must implement `transaction()` with manual `BEGIN`/`COMMIT`/`ROLLBACK` via `db.exec()` around the awaited `fn` — do not wrap `db.transaction`. The production adapter maps `transaction()` to `db.withExclusiveTransactionAsync()` (the *exclusive* variant — `withTransactionAsync` is non-exclusive and can be interleaved by other async queries, which would break `backupRepository.restoreAll`'s all-or-nothing guarantee).

### Pattern 3: Zustand + MMKV Persist with Strict `partialize` and Zod Rehydration

**What:** One store per domain; `persist` middleware over a thin MMKV-backed storage; `partialize` whitelists persisted fields; a Zod schema validates what comes back out (zustand's `createJSONStorage` performs **no runtime validation** — its own docs recommend custom validating storage).
**When to use:** Global/ephemeral-but-crash-critical state (timer, settings, quotas, entitlements). Never for queryable data — that is SQLite's job.
**Trade-offs:** MMKV rehydration is synchronous (a plus: no hydration race at boot); the Zod-per-store cost is ~5 lines each.

```typescript
// features/tracking/stores/timerStore.ts — crash-surviving timer
export const useTimerStore = create<State>()(
  persist(
    (set) => ({
      active: null,                                    // { sessionId, eventType, startedAt }
      start: (s) => set({ active: s }),
      stop: () => set({ active: null }),
    }),
    {
      name: 'timer',                                   // MMKV key prefix 'timer:'
      storage: createZodMmkvStorage(TimerPersistSchema), // partialize + Zod-validate + MMKV
      partialize: (s) => ({ active: s.active }),       // actions never persisted
      version: 1,                                      // + migrate() from day one
    },
  ),
);
```

## Data Flow

### Write Flow (1-tap tracking, the app's hottest path)

```
User taps TimerButton (haptic via expo-haptics, <16 ms budget)
    ↓
useTracking.startTimer(type)                    [feature hook = ViewModel]
    ↓  uuid: expo-crypto randomUUID()
timerStore.start({sessionId, type, startedAt})  → MMKV 'timer:' (crash-safe immediately)
    ↓
trackingService.buildSession(...)                [pure, DI: now(), crypto]
    ↓  Zod SessionSchema.parse()                 [boundary]
sessionRepository.insert(session, tx?)          [only SQL in the app path]
    ↓
DbAdapter.run(INSERT INTO session ...)          → SQLite (WAL)
    ↓
on success: timerStore.stop() · on error: error_log + toast
```

### Read Flow (Timeline 7 days)

```
app/(tabs)/index.tsx  →  useTimeline(babyId)
    ↓ (on focus; no live DB listener — enableChangeListener stays OFF)
sessionRepository.findSessionsByDateRange(babyId, from, to)   [uses idx_session_baby_id_started_at, ~105 rows]
    ↓ getAllAsync (async — never *Sync on hot paths, they block the JS thread)
rows → decryption of `notes` ciphertext (only when displayed) → Zod → dayjs grouping per day → FlatList
```

### State Split (what lives where — enforced by convention)

| Data | Home | Why |
|------|------|-----|
| Sessions, baby profiles, event/error logs | SQLite via repositories | relational, queried, backed up |
| Active timer, settings, quotas, entitlements, ad counters, onboarding flag | MMKV via Zustand stores / namespace helpers | tiny, synchronous, crash-critical; entitlements in the **encrypted** instance |
| Master key, MMKV encryption key material | expo-secure-store `WHEN_UNLOCKED_THIS_DEVICE_ONLY` | Keychain/Keystore; ≤ 2 KB values only (iOS historical limit ~2048 B) |
| Transient UI state (modals, form drafts) | plain React / react-hook-form | never persisted (`partialize` whitelist) |

## Boot Sequence (the deliverable diagram)

```
launch
  │  [MODULE SCOPE — before first render]
  ├─ SplashScreen.preventAutoHideAsync()
  ├─ i18n init (pure JS, no network — bundled locales)
  ├─ createMMKV() default instance (native, sync)
  │
  │  [bootstrap() — core/boot — ALL LOCAL, zero network]
  ├─ 1. ensureMasterKey(): secure-store get-or-create (WHEN_UNLOCKED_THIS_DEVICE_ONLY)
  │      └─ derive MMKV-encrypted-instance key; open encrypted instance lazily
  ├─ 2. openDatabaseSync('babylog.db')
  │      ├─ PRAGMA key = <masterKey>          (if useSQLCipher adopted)
  │      ├─ PRAGMA journal_mode = WAL
  │      ├─ PRAGMA foreign_keys = ON
  │      └─ PRAGMA synchronous = NORMAL
  ├─ 3. migrate(db): schema_version → apply pending versions, each in a transaction;
  │      destructive → raise MigrationConfirmationRequired → UI offers backup first
  ├─ 4. hydrate Zustand stores from MMKV (sync, incl. timer crash-recovery:
  │      timer:active found → session has ended_at NULL → offer resume/discard)
  ├─ 5. read onboarding:completed flag          ← THE only routing switch
  └─ 6. track('boot_completed', {ms})           → local SQLite event table
  │
  │  [RENDER]
  ├─ SplashScreen.hide()
  ├─ <Stack.Protected guard={onboarded}> → (tabs)
  ├─ <Stack.Protected guard={!onboarded}> → (setup)/onboarding
  │
  │  [POST-ONBOARDING ONLY — first (tabs) mount, lazily imported modules]
  ├─ if free tier: UMP consent → setRequestConfiguration → mobileAds().initialize()
  └─ if paywall/settings mount: iap.initConnection() (expo-iap)
```

Budget check: steps 1–6 are all sub-100 ms local operations (m001 creates 7 tables + 8 indexes + 4 triggers); the < 2 s cold-start budget is dominated by RN startup, not this pipeline. `boot_duration_ms` proves it.

## Anti-Patterns

### Anti-Pattern 1: Network SDKs imported at module scope
**What people do:** `import mobileAds from 'react-native-google-mobile-ads'` at the top of a component file. Native modules initialize at import/link time; ads measurement can start before any JS gate runs.
**Why it's wrong:** Silently breaks the "zero network before onboarding" promise — the core product guarantee — even if `initialize()` is called later.
**Do this instead:** Network SDKs only inside `core/ads`/`core/billing`, reached via dynamic `import()` after the onboarding flag; `optimizeInitialization: false` + `delayAppMeasurementInit: true` at build time; ESLint `no-restricted-imports` + airplane-mode smoke test as the mechanical backstop.

### Anti-Pattern 2: Rendering app content while migrations run
**What people do:** Render tabs immediately, run migrations in a background effect, or hide the splash in parallel.
**Why it's wrong:** Screens query tables that may not exist yet (m001 first launch); timer crash-recovery reads stale `timer:` state against an un-migrated schema.
**Do this instead:** `preventAutoHideAsync()` at module scope, render `null` until `bootstrap()` resolves, then `Stack.Protected`. Docs are explicit: keep the splash until boot state loads.

### Anti-Pattern 3: `withTransactionAsync` for all-or-nothing writes
**What people do:** Use `withTransactionAsync` for `restoreAll`/`upsertMany` because it's the "default" transaction helper.
**Why it's wrong:** It is *non-exclusive*: any other async query executing during the task joins or aborts the transaction ("database is locked"); partial restores become possible.
**Do this instead:** `withExclusiveTransactionAsync(txn => …)` with all inner statements on `txn` — for backup restore, delta apply, tombstone+delete pairs.

### Anti-Pattern 4: SQL or storage access above the repository layer
**What people do:** A hook runs `db.getAllSync('SELECT …')` "just this once", or a service reads MMKV directly.
**Why it's wrong:** Leaks engine semantics past the `DbAdapter` seam, making the better-sqlite3 test adapter useless and the 80 % coverage target unreachable.
**Do this instead:** Hooks → services/repositories only; services take injected deps; the one exception (`core/analytics/tracker.ts`) still goes through `eventRepository`.

### Anti-Pattern 5: Persisting stores without `partialize` (or trusting rehydrated data)
**What people do:** Persist the whole Zustand state "for simplicity"; or read persisted state and assume its shape.
**Why it's wrong:** Functions/Transients get stringified (crash or silent corruption on upgrade); zustand performs zero runtime validation on rehydration.
**Do this instead:** Whitelist with `partialize` + `version`/`migrate` from day one; the shared `createZodMmkvStorage` adapter parses with a per-store Zod schema and falls back to defaults on mismatch.

## Integration Points

### Platform Modules (SDK 57)

| Module | Integration pattern | Gotchas (verified) |
|--------|--------------------|--------------------|
| expo-sqlite 57.0.3 | Open once in `core/database/init.ts`; repositories via `DbAdapter` | `*Sync` APIs block the JS thread — restrict to boot/migrations; hot paths use `runAsync/getAllAsync`. `SQLiteOpenOptions` has no encryption field — SQLCipher comes from the config plugin + `PRAGMA key` |
| react-native-mmkv 4.3.2 | `createMMKV()` for default; second `createMMKV({ id: 'secure', encryptionKey })` for `billing:`/`secrets:` | Requires `react-native-nitro-modules` peer; **no config plugin in v4** (remove `react-native-mmkv/plugin` from app.json); dev build required |
| expo-secure-store | Master key bootstrap; sync API fine at boot | Values ≤ ~2 KB (iOS); exclude from Android auto-backup; iOS Keychain may survive reinstall — never rely on it (pair with `onboarding:` flag semantics) |
| expo-iap 5.6.0 | `withIAP` config plugin; `useIAP` hook inside `core/billing`; entitlements → encrypted MMKV | Replaces react-native-iap (see verdict #3); restore via `getAvailablePurchases` semantics; test on real devices via EAS preview |
| react-native-google-mobile-ads 16.5.0 | Config plugin with corrected keys; `AdsConsent` (UMP); `mobileAds().initialize()` deferred | `maxAdContentRating`/`tagForChildDirectedTreatment` are runtime `setRequestConfiguration`; `optimizeInitialization: false` + `delayAppMeasurementInit: true` are what make deferred init real |
| expo-print/file-system/sharing | `pdfService` + `backupService`; assets as Base64 for iOS WKWebView | No permissions needed; temp files in app-specific dir |
| expo-notifications | Local only; permission requested at backup-reminder activation, never at boot | Android 13+ POST_NOTIFICATIONS fallback silent |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| routes ↔ features | feature `index.ts` barrels export hooks/screens only | Routes never see services/repos — makes route moves free |
| features ↔ features | **none directly**; cross-feature needs go through core or composition in hooks | e.g. PDF report composes session + wake-window repositories at the `reportRepository`/service level |
| services ↔ platform | injected parameters only | `predictionService(sessions, clock)` — the reason SweetSpot hits 90 % test coverage |
| repositories ↔ engine | `DbAdapter` only | Swap expo-sqlite ↔ better-sqlite3 with zero repo changes |
| billing/ads ↔ UI | hooks (`useEntitlements`, `useAds`) read flags; UI never calls SDKs | Single choke point for the gating rules (night, premium, caps) |

## Build Order Implications (feeds Vertical MVP roadmap)

Each phase ends with a user-visible, offline-verifiable capability. Dependency-driven:

1. **Foundation & skeleton** — tsconfig strict + `noUncheckedIndexedAccess`, folder tree, ESLint (`import/order`, `no-restricted-imports` guard), Vitest + better-sqlite3 harness, `DbAdapter` interface + both implementations, m001 migration runner, `bootstrap()` + root layout with splash gate + `Stack.Protected` + empty `(setup)`/`(tabs)`. *Everything else compiles against these seams.*
2. **Onboarding + profile (first vertical slice)** — `babyProfileRepository`, crypto master-key bootstrap + AES wrappers, MMKV instances + `settingsStore`, onboarding flow writing `onboarding:completed`. *App boots offline, restarts safely, routes correctly.*
3. **Tracking core (the product)** — `sessionRepository` + `trackingService` + `useTracking`/`useTimeline`, `timerStore` crash survival, Track + Timeline screens, haptics. *The 3 AM use case works end-to-end.*
4. **Stats, SweetSpot, PDF** — `aggregateDaily`, `predictionService` (EMA, pure), premium gate plumbing (flag-only at this point), `reportRepository` + `pdfService`. *Differentiators visible.*
5. **Backup** — `backupRepository.dumpAll/restoreAll` (exclusive transaction), `BackupSchemaV1`, PBKDF2 perf gate on device, share sheet, J30 local reminder. *Data-safety promise kept before monetization arrives.*
6. **Monetization** — entitlements in encrypted MMKV, expo-iap paywall flow, deferred ads init + UMP + `rules.ts`, gating hooks switch on. *Unblocks store submission.*
7. **Compliance & polish** — analytics/error-log wiring sweep, i18n extraction (5 locales), perf budgets (EXPLAIN QUERY PLAN checks, boot < 2 s), airplane-mode CI smoke test.

Flags for deeper phase-level research: expo-iap purchase/restore flow on real devices (P6 — sandbox quirks are the top integration risk); SQLCipher `useSQLCipher` dev-build smoke test (P1/P2 — decide adopt/skip in week one); NativeWind 4.2.6 × React Compiler (`reactCompiler: true` is already in app.json) rendering smoke test (P1 — MEDIUM confidence on interplay; the fallback is disabling the experiment, which is one line).

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| MVP (single baby, thousands of sessions) | Current design as specified — WAL + composite index keeps every hot query O(rows-in-range); ~105-row timeline needs no virtualization beyond FlatList |
| V1.1 (premium unlimited history, partner sync) | Keyset pagination (`findByKeysetBefore`, never OFFSET) already specified in docs/05; delta queries ride `idx_session_updated_at`; consider `getEachAsync` for large scans |
| V2 (widgets, caregiver mode) | m002–m005 migration plan in docs/05 covers schema; shared repository modules make a widget extension a matter of exposing a read-only `DbAdapter` to the widget target |

First bottleneck (if any): unbounded `event`/`error_log` growth — the prune methods already specified (`pruneBefore`) should be wired into settings "export usage data" action from day one. Second: backup encryption time on 5+ year-old devices — PBKDF2 iteration fallback (50k) is already documented in addendum v2.

## Sources

- **Primary (package ground truth, HIGH confidence):** npm tarballs inspected directly — expo-sqlite@57.0.3 + 16.0.10 (`SQLiteOpenOptions`, transaction APIs, absence of encryption options), react-native-mmkv@4.3.2 (`createMMKV({encryptionKey})`, no plugin, nitro peer), react-native-iap@16.6.0 (nitro peer, no plugin, README "use expo-iap for Expo projects"), expo-iap@5.6.0 (`withIAP` config plugin, expo-only peers), react-native-google-mobile-ads@16.5.0 (plugin options, `setRequestConfiguration`, `AdsConsent`), nativewind@4.2.6
- **Official docs (HIGH confidence):** docs.expo.dev/versions/v57.0.0 — `/sdk/sqlite/` (WAL guidance, transaction semantics, SQLCipher via `useSQLCipher` config plugin), `/sdk/securestore/` (accessibility constants, ~2 KB limit), `/sdk/splash-screen/` (module-scope `preventAutoHideAsync` pattern); docs.expo.dev/router/reference/authentication/ (`Stack.Protected` + splash-held-until-loaded)
- **Library docs (HIGH confidence):** better-sqlite3 api.md (`:memory:`, sync-only transactions), zustand persist reference (partialize, version/migrate, no-validation warning)
- **Synthesis (MEDIUM confidence):** NativeWind 4.2.6 × RN 0.86 × React Compiler exact compatibility (registry + ecosystem consensus; smoke test recommended), local-first boot-pipeline synthesis (cross-verified against the Expo pages above)

---
*Architecture research for: BabyLog Offline (local-first Expo SDK 57)*
*Researched: 2026-09-12*
