# Architecture Research

**Domain:** Offline-first, local-only baby-tracking mobile app (React Native / Expo SDK 57, zero backend)
**Researched:** 2026-09-18
**Confidence:** HIGH (layering validated against authoritative specs docs/04 + docs/05 and official SDK 57 docs; general local-first pattern claims MEDIUM where from community canon)

## Standard Architecture

### The core insight

A 100%-offline app has a *simpler* shape than a normal mobile app: there is no network layer, no API client, no sync engine, no auth. The whole "backend" is SQLite + MMKV living on the device. The architecture question reduces to two rules:

1. **Every cross-cutting concern is enforced in exactly one layer.** Entitlements are read-filtered at the UI/service boundary, never in the database. Timers are a stored timestamp with derived elapsed time. Exports and backups are pure transform pipelines with thin platform wrappers.
2. **Every layer below the screens is pure or injectable, so it runs in Vitest without a device.** docs/04 already mandates this ("faux DB injectés", services know neither React nor SQLite) — the research confirms this is exactly how local-first RN apps are structured in practice.

The offline guarantee is architectural, not behavioral: if no component except `iapService`/`aiService`/`driveService` (explicit user action only) even *has* a network API, the app cannot leak data or stall on connectivity. The measurable budget "0 network calls at boot" (docs/04) is enforced by construction.

### System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ L5  ROUTES (src/app — Expo Router, 3 tabs / 7 screens)                 │
│     thin screens: read hooks, render UI, call gate hooks               │
├────────────────────────────────────────────────────────────────────────┤
│ L4  VIEW MODELS / STATE (hooks + Zustand stores)                       │
│     useEntitlements  usePremiumGate  useTimer  useTimeline             │
│     useSettingsStore (MMKV persist)  useEntitlementsStore              │
│     usePaywallStore (transient)        ← the ONLY entitlement readers   │
├────────────────────────────────────────────────────────────────────────┤
│ L3  SERVICES (pure business logic, deps injected, no React/SQL)        │
│     trialService     entitlementService      timerService              │
│     pdfHtmlBuilder   backupSerializer  encryptionService               │
│     analyticsService errorLogger             iapService (net, on-action)│
├────────────────────────────────────────────────────────────────────────┤
│ L2  REPOSITORIES (the ONLY place SQL lives — docs/05 §8)               │
│     babyProfileRepository   logEventRepository   timerRepository       │
│     fileExportRepository    eventRepository      errorLogRepository    │
│     Zod-validated writes · keyset pagination · explicit transactions   │
├────────────────────────────────────────────────────────────────────────┤
│ L1  CORE / PLATFORM PRIMITIVES (core/)                                 │
│     database/client.ts (openDatabaseAsync, PRAGMAs, migrate runner)    │
│     storage/ (MMKV standard + encrypted instances, SecureStore,        │
│              zustand adapter)         errors/ (ErrorBoundary, error_log)│
├────────────────────────────────────────────────────────────────────────┤
│ L0  DEVICE: SQLite (WAL) · MMKV · SecureStore/Keychain · cache dir ·   │
│     StoreKit 2 / Play Billing · Share sheet · Document picker          │
└────────────────────────────────────────────────────────────────────────┘
     Network exists ONLY inside iapService (and optional ai/drive services),
     entered solely on explicit user action: purchase, restore, paywall open.
```

Dependency direction is strictly downward. Screens never import repositories (docs/04 convention); repositories never import services; services receive repository *interfaces* via constructor/factory parameters, which is what makes fake-DB unit tests possible.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `core/database/client.ts` | Owns the single `babylog.db` handle, PRAGMAs (WAL, foreign_keys, busy_timeout), idempotent `migrate()` over `schema_version` | `SQLite.openDatabaseAsync('babylog.db')` + `execAsync('PRAGMA journal_mode = WAL')` etc.; m001 applied in one transaction. SDK 57 has no migrations API — the spec's `schema_version` table *is* the migration runner's state store (verified against v57 docs) |
| Repositories (6) | All SQL. Reads return typed rows; writes are Zod-validated first; multi-write operations are explicit transactions | Exactly the methods and SQL text from docs/05 §8; `withExclusiveTransactionAsync` for `completeTimerAndCreateEvent`, `startTimer`, and backup restore |
| `trialService` | Pure trial clock: `evaluateTrial(nowMs, TrialState) → {state, remainingMs}`; start/claim writes | Timestamp math only — no interval timers, no background jobs. State read from MMKV `trial:` namespace; `trialClaimedSecure` best-effort via SecureStore |
| `entitlementService` | Pure predicate layer: given `EntitlementState` + profile count, answer `can(action: PremiumAction)`; writes MMKV encrypted instance after purchase/restore | Uses `babyProfileRepository.countProfiles()` (hot query 6, <1 ms) — never queries entitlements from SQLite (forbidden) |
| `timerService` + `useTimer` | Persist only `started_at`; derive elapsed = `now − started_at`; complete = atomic event+cleanup | `setInterval(1s)` is cosmetic only and never the source of truth; kill/reboot-safe by construction |
| `pdfService` (export feature) | Pediatrician 7/14-day and Emergency Doctor 24/48-hour PDFs | Split: pure `pdfHtmlBuilder(events, t, locale) → html string` (Vitest-testable) + 10-line `printToFileAsync` wrapper → `Sharing.shareAsync(uri, {mimeType:'application/pdf'})` |
| `backupService` + `encryptionService` | Encrypted JSON v1 export/import; trial+allowed settings included; entitlements never restored | Pure serializer (docs/05 §10 envelope) + AES-256-CBC/PBKDF2-210k/HMAC port; import = HMAC verify → decrypt → strict Zod → explicit confirm → one exclusive transaction with reverse-order purge, forward-order insert, rollback on any failure |
| `analyticsService` | Local-only `event()` sink; allowlisted names; fire-and-forget; manual export | One `track()` call site pattern; Zod allowlist (docs/05 §11); never awaited, never throws into UI paths |
| `iapService` (billing feature) | The only network component: connect, purchase, restore — only when paywall opens or user acts | react-native-iap v14 (StoreKit 2 / Play Billing 8) behind a narrow port so the library can be swapped (OpenIAP migration history shows why) |
| `useEntitlements` / `usePremiumGate` | The single point where free/premium decisions touch the UI | Reads `useEntitlementsStore`; gate = conditional render / `sinceMs` parameter choice; UI-level enforcement only (accepted in docs/03) |
| `errorLogger` + `errorRepository` | Offline crash/diagnostic trail without crash-reporting SDK | Global `ErrorBoundary` + try/catch convention; sanitized writes to `error_log` (no user payload) |

## Recommended Project Structure

docs/04's folder architecture is validated as-is by this research — it matches the feature-slice + core/ pattern used by the local-first RN ecosystem. Restating it with the architecture-relevant annotations:

```
src/
├── app/                     # L5: file routes only — thin, import from features
│   ├── (tabs)/              # index (tracking) · timeline · settings
│   ├── paywall.tsx
│   └── settings/            # backup.tsx · billing.tsx
├── features/                # L3+L4 slices; public API via index.ts only
│   ├── tracking/            # screens/ hooks/ services/ repository/ models/
│   ├── timeline/            #   repository = the SQL of docs/05 §8
│   ├── profile/
│   ├── export/              # pdf builder (pure) + print/share wrappers
│   ├── backup/              # serializer (pure) + encryption + restore txn
│   ├── stats/               # (release 3) reads getStatsByRange
│   └── billing/             # iapService — the only network code
├── components/ui/           # design-system primitives (Button, Card, Modal…)
├── core/                    # L1: cross-feature singletons
│   ├── database/            # client.ts + migrations/ (m001…, schema_version)
│   ├── storage/             # mmkv.ts (standard + encrypted) secureStorage.ts zustandAdapter.ts
│   ├── billing/             # entitlementService · trialService (pure core)
│   ├── backup/              # transferService · driveService (backlog)
│   ├── analytics/           # analyticsService + eventRepository + allowlist schema
│   └── errors/              # ErrorBoundary · errorLogger · errorRepository
├── lib/i18n/                # i18next boot, rtl.ts, locales/ (en, fr now; de/ja/ko/ar later)
└── utils/                   # dates (epoch ms ↔ dayjs), numbers, async
```

### Structure Rationale

- **`features/*` slices with `index.ts` public APIs:** the gate (entitlement) is a UI-level concern; slices keep "free core" (tracking/timeline/profile) physically separate from gated features (export/backup/billing), so gating never leaks into core data flow.
- **`core/billing` separate from `features/billing`:** the *pure* entitlement/trial logic (used by every gate) must not transitively import the IAP SDK — otherwise every unit test needs native mocks. Only the paywall screen and iapService touch react-native-iap.
- **SQL confined to `repository/` + `core/database/`:** one grep proves the privacy/no-network and Zod-at-boundaries invariants; also the single place to performance-tune the 6 hot queries.

## Architectural Patterns

### Pattern 1: Repository with injected port (the testability seam)

**What:** Services receive a repository interface, not the DB handle. Repos are the only SQL; services are the only logic; both run in Vitest with in-memory SQLite or fakes.
**When to use:** Always — this is the backbone. docs/04 requires it; it is what makes "entitlement gating, timers, exports and backup never touch the network and stay testable" achievable.
**Trade-offs:** One indirection layer more than calling SQLite from components — negligible at this scale, and it is precisely what docs/04's 80% coverage targets assume.

**Example:**
```typescript
// features/timeline/repository/logEventRepository.ts — the ONLY SQL for log_event
export function createLogEventRepository(db: SQLiteDatabase) {
  return {
    getRecentWindow: (profileId: string, sinceMs: number, limit: number) =>
      db.getAllAsync<LogEventRow>(SQL_RECENT_WINDOW, [profileId, sinceMs, limit]),
    // ... exact SQL from docs/05 §8
  };
}
export type LogEventRepository = ReturnType<typeof createLogEventRepository>;

// features/timeline/services/timelineService.ts — pure, testable
export function createTimelineService(repo: LogEventRepository) {
  return {
    // free window is enforced by the QUERY PARAMETER, not post-filtering
    getVisibleTimeline: (gate: HistoryGate, profileId: string) =>
      gate.historyWindowMs === Infinity
        ? repo.getTimelineDay(profileId, startOfDay(now), startOfDay(now) + 1)
        : repo.getRecentWindow(profileId, now() - gate.historyWindowMs, 200),
  };
}
```

### Pattern 2: Timestamp-derived state (timer + trial clock — no background execution)

**What:** Any long-running condition (feeding timer, 72h trial) persists only its anchor timestamp. Elapsed/remaining is *derived* on every read; `setInterval` drives pixels, never truth. Nothing runs in the background; app kill and reboot cost nothing.
**When to use:** For both `timer_state.started_at` (docs/05) and the trial. This is the canonical pattern for breastfeeding/baby timers and matches the hot-query budgets (<1 ms timer read).
**Trade-offs:** None meaningful. (Device clock changes are out of scope for a local-only, best-effort trial — already accepted in docs/03/04.)

**Example:**
```typescript
// useTimer.ts — survives kill: truth lives in timer_state.started_at
const timer = useQuery(() => timerRepository.getActiveByProfile(profileId));
const [, forceTick] = useReducer((n) => n + 1, 0);
useEffect(() => {
  if (!timer) return;
  const id = setInterval(forceTick, 1000);   // cosmetic re-render only
  return () => clearInterval(id);
}, [timer?.id]);
const elapsedMs = timer ? Date.now() - timer.started_at : 0;

// completion — atomic (hot query 4, docs/05):
await db.withExclusiveTransactionAsync(async (txn) => {
  await logEventRepo(txn).create(buildFeedingInsert(timer, Date.now()));
  await timerRepo(txn).stopTimer(profileId);
});
```

### Pattern 3: Pure transform pipeline + thin platform sink (exports, backup)

**What:** Data out of the app = read (repository) → transform (pure function) → sink (platform wrapper). The transform is a string/JSON builder with an injected `t` function; the sink is a ~10-line wrapper over `printToFileAsync`/` Sharing.shareAsync`/file write + `expo-crypto`/crypto-js.
**When to use:** PDF export (both kinds), encrypted backup export, backup import (reverse pipeline: HMAC → decrypt → strict Zod → confirm → exclusive transaction → rollback).
**Trade-offs:** The HTML-in-WKWebView path has one platform quirk (iOS cannot load local asset URLs — inline base64 only), contained entirely inside the sink wrapper.

**Example:**
```typescript
// 100% unit-testable, zero platform imports:
export function buildBackupEnvelopeV1(snapshot: DbSnapshot, meta: AppMeta): BackupFileV1 { /* docs/05 §10 */ }
export function buildPediatricHtml(events: LogEventRow[], t: TFn, locale: string): string { /* … */ }

// thin sink:
const { uri } = await Print.printToFileAsync({ html });
await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: '.pdf' });
await fileExportRepo.markCompleted(exportId, fileName);   // only after success
```

### Pattern 4 (validated, not new): Entitlement gate as read-filter, never as storage

**What:** The database always stores everything; free/post-trial "hiding" of >24 h history is expressed as a *query parameter choice* made at the hook layer (`getRecentWindow(since = now−24h)` vs premium full pagination). Trial/premium state lives in MMKV (standard `trial:` / encrypted `billing:`) + SecureStore best-effort flag — never in SQLite, never restored from backup (docs/05 rules).
**Why this is the right shape (validated):** (a) repositories stay billing-blind → testable without billing fixtures; (b) a purchase instantly reveals existing history — no data migration, no sync; (c) hot query 3 is already specified to enforce the free window "par paramètre since, pas par filtrage applicatif massif".
**Trade-offs:** It is UI-level enforcement and technically bypassable — explicitly accepted for a local-only app (docs/03); there is no server to enforce against anyway.

## Data Flow

### Boot sequence (zero network, cold-start budget < 2 s)

```
launch → openDatabaseAsync → PRAGMAs (WAL, FK, busy_timeout)
       → migrate() [read schema_version, apply pending in one txn]
       → read MMKV standard (settings, trial) + encrypted (billing) + SecureStore flags
       → rehydrate Zustand stores → evaluateTrial(now) → render (tabs)
       → lazily: getActiveByProfile (<1 ms) + getTimelineDay (<16 ms)
```

### Key Data Flows

1. **1-tap log (3 a.m. path):** press → hook → Zod (`logEventInsertSchema`) → `create` (<16 ms) → `track('core_action_completed')` (fire-and-forget) → re-read today's block → UI. No gate ever blocks this (spec: tracking core never limited).
2. **Timer lifecycle:** start (`startTimer` txn: DELETE+INSERT, UNIQUE profile) → background/kill → relaunch (boot reads `timer_state`) → derived elapsed → stop (`completeTimerAndCreateEvent` txn: INSERT log_event + DELETE timer_state, source='timer').
3. **Trial expiry:** every boot / gate check re-evaluates `evaluateTrial(now)` → downgrade is graceful: free queries simply pass `sinceMs = now−24h` (history hidden but preserved); paywall shown at natural gestures; `usePremiumGate` emits `premium_feature_attempted` / `history_limit_reached`.
4. **Purchase/restore (only network):** paywall open → `iapService.connect()` → buy/restore → `entitlementService` writes encrypted MMKV → store rehydrates → gates flip instantly, full history query unlocked. Store prices rendered from store data only.
5. **PDF export:** gate → `getRangeForExport` → pure HTML builder → `printToFileAsync` → `shareAsync` → `file_export` create→markCompleted (or markFailed). Emergency Doctor Mode = same pipeline, free for all, 24/48 h window.
6. **Backup export:** snapshot tables (incl. soft-deleted rows) **before** inserting the `file_export` backup row (anti-self-inclusion rule, docs/05 §10) → envelope v1 → strict Zod self-check → AES-256-CBC + PBKDF2(210k) + HMAC → file `.babylog` → share.
7. **Backup import:** pick file → read → HMAC verify → decrypt → `backupFileSchema` strict → explicit UI confirmation → one `withExclusiveTransactionAsync`: purge file_export/timer_state/log_event/baby_profile in reverse order, insert in FK order via `insertRestoredRow*` → write allowed MMKV keys (trial + preferences) → analytics. Any failure ⇒ full rollback, zero partial state.
8. **Analytics:** everything above calls `track()` → allowlist Zod → `event` table. Exported only by explicit user action. Same table answers trial/paywall frequency checks via `listByNameSince`.

### State Management

```
SQLite (truth: events, profiles, timers, exports)      MMKV (settings, trial) · SecureStore (flags, MMKV key)
        │  repositories (SQL only)                              │  adapters
        ▼                                                       ▼
   services (pure logic) ──────────────► Zustand stores (useEntitlementsStore · useSettingsStore · usePaywallStore*)
        ▲                                                       │  select
        └────────────── hooks (view models) ◄───────────────────┘
                            │
                       screens (L5)
* paywall store is transient — never persisted (docs/04)
```

Two sources of truth, one rule: SQLite = domain data; MMKV/SecureStore = configuration + entitlements. They only meet inside the backup envelope (which whitelists exactly 7 MMKV keys, docs/05 §10).

## Scaling Considerations

For a local-only app, "scaling" = data growth on device and feature growth across releases — server scaling does not exist by design.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Newborn → 6 months (~5–15k log_event rows) | Nothing to change: partial indexes (`idx_log_event_timeline/stats`, `WHERE deleted_at IS NULL`) keep all 6 hot queries within budget; keyset pagination prevents OFFSET decay |
| Multi-year, multi-profile (premium) | If `getStatsByRange` drifts past 16 ms, apply the pre-planned `m002_daily_aggregate` migration (additive, with backfill) — already anticipated in docs/05 §7; no architecture change |
| Release 2 (co-parent transfer) | Reuses the exact backup envelope + encryption pipeline as a file hand-off; no new layer |
| Future "sync" temptation | Do **not** pre-abstract a "remote data source" behind repositories (spec forbids any cloud). If ever needed, a sync engine (PowerSync/ElectricSQL-style) would attach at the *service* boundary, not inside repositories |

### Scaling Priorities

1. **First bottleneck:** timeline/aggregates on multi-year data → fix with `m002_daily_aggregate` (planned), never with in-JS aggregation.
2. **Second bottleneck:** backup file size for large histories → docs/05 already prescribes paginated export via `listForBackup` cursor.

## Anti-Patterns

### Anti-Pattern 1: Entitlement logic inside SQL or repositories
**What people do:** `WHERE premium = 1` or repository methods like `getPremiumHistory()`.
**Why it's wrong:** Splits data access by billing state; requires billing fixtures in every data test; breaks "hidden but never deleted" (purchase must reveal history with zero migration).
**Do this instead:** Repositories take explicit window/pagination parameters; only `usePremiumGate` decides which parameters to pass.

### Anti-Pattern 2: Treating `setInterval`/`setTimeout` as the source of truth (timer or trial)
**What people do:** Accumulate elapsed seconds in state; schedule the trial end with a timeout; run a "background check".
**Why it's wrong:** JS timers die on background/kill; Android may freeze the JS loop; trial would never expire after a kill; durations drift.
**Do this instead:** Persist `started_at` / `trialEndsAt`; derive on read; complete actions in transactions on the next foreground.

### Anti-Pattern 3: Storing entitlements or trial state in SQLite
**What people do:** A `purchases` table "because it's convenient for backup".
**Why it's wrong:** Explicitly forbidden (docs/05 §11); would flow into backups and become a tamper/restore-injection vector; mixes secrets into an unencrypted DB.
**Do this instead:** MMKV encrypted instance (AES-256, key in `expo-secure-store`) + SecureStore best-effort flags; backup excludes all `secrets:`/`billing:` keys and never restores entitlements.

### Anti-Pattern 4: Network at boot (IAP init in root layout)
**What people do:** Initialize the IAP connection (or check receipts) on app start.
**Why it's wrong:** Violates the 0-network-at-boot budget and the privacy promise; slow cold start on airplane mode; poor store-review optics.
**Do this instead:** Lazily connect inside `iapService` only when the paywall opens or the user taps purchase/restore; local entitlement state is always read first.

### Anti-Pattern 5: UI code inside PDF/backup builders (or hardcoded user-visible strings)
**What people do:** Build HTML/envelopes inside screen components with inline labels.
**Why it's wrong:** Untestable without a device; i18n leaks (EN/FR now, RTL-ar later); backup format drifts from the Zod schema.
**Do this instead:** Pure builders take rows + `t` + locale and return strings; keep the backup Zod schema as the single format definition and self-validate exports in tests.

### Anti-Pattern 6: Screens importing repositories / SQL outside `repository/`
**What people do:** A quick `db.getAllAsync(...)` in a screen to save a layer.
**Why it's wrong:** Bypasses Zod validation, analytics, error logging, and the partial-index query plans; docs/04 forbids it outright.
**Do this instead:** Screen → hook → service → repository, always; enforcement via ESLint import rules (`no-restricted-imports`).

### Anti-Pattern 7: Non-atomic restore / auto-backup
**What people do:** Restore row-by-row without a transaction; back up automatically to "help" the user.
**Why it's wrong:** A mid-import failure leaves a half-deleted database (worst possible failure for baby data); automatic backup violates the privacy promise and docs/04's explicit interdicts.
**Do this instead:** One exclusive transaction with reverse-purge/forward-insert and rollback; manual, explicit, confirmed — as specified.

### Anti-Pattern 8: OFFSET pagination
**What people do:** `LIMIT 50 OFFSET 100` for history.
**Why it's wrong:** Forbidden by spec; O(offset) scans break the <16 ms budget as history grows.
**Do this instead:** Keyset cursors on `(created_at, id)` / `(started_at, id)` — every list method in docs/05 §8 is already keyset.

## Integration Points

### External Touchpoints (the complete list — nothing else may use network/OS)

| Touchpoint | Integration Pattern | Notes |
|---------|---------------------|-------|
| App Store / Google Play | `iapService` (react-native-iap v14: StoreKit 2, Play Billing 8; Expo config plugin; dev-client build required) | Only network code. Library is alive but moved to the OpenIAP monorepo (Aug 2026) — keep the port narrow so it is swappable; entitlements are always resolved locally first, offline grace flag per docs/04 |
| OS share sheet | `expo-sharing` after `printToFileAsync` / backup file write | `mimeType: 'application/pdf'`, UTI `.pdf`; files land in cache dir |
| Document picker | `expo-document-picker` on explicit "import backup" | No storage permission; file content still goes through HMAC → Zod → confirm → txn |
| SecureStore / Keychain-Keystore | MMKV encryption key + `trialClaimedSecure` flag | Best-effort by design; MMKV standard instance holds the trial timestamps |
| Local file system | `expo-file-system` cache dir for PDFs and `.babylog` files | iOS PDF quirk: inline base64 assets only (WKWebView cannot read local file URLs) |
| (Optional, backlog) Google Drive | `driveService`, OAuth PKCE via `expo-auth-session`, manual upload/download of the already-encrypted file | Never automatic; scope `drive.file` |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| screens ↔ features | `features/*/index.ts` public API only | ESLint-enforced; screens stay thin |
| hooks ↔ services | service factory functions, injected repos | the Vitest seam (80% coverage targets) |
| services ↔ repositories | repository interfaces only, no SQL elsewhere | one grep proves the invariant |
| entitlement layer ↔ everything above it | `useEntitlements` / `usePremiumGate` reads only | features never read MMKV `billing:` directly |
| analytics ↔ everything | one `track()` call, fire-and-forget | allowlist schema is the contract; callers never await |
| error handling ↔ everything | `errorLogger` from catch blocks + root ErrorBoundary | `error_log` sanitized (no user payload) |
| backup ↔ rest of app | envelope v1 + 7 whitelisted MMKV keys | entitlements excluded; secure trial flag wins on restore |
| features ↔ features | via public index.ts only | no cross-imports of internals (docs/04) |

## Suggested Build Order (dependency-driven)

Each stage is shippable/testable on its own; later stages never rewrite earlier ones.

1. **Foundation (core/):** DB client (open, PRAGMAs), migration runner + m001, MMKV instances + SecureStore + Zustand adapter, `error_log` + ErrorBoundary, i18n boot (en/fr skeletons). *Tests: migrations, PRAGMA state, adapter round-trips.*
2. **Repositories + Zod schemas:** all six repositories exactly per docs/05 §8, with in-memory SQLite Vitest harness (fake-DB injection proves itself here). *Tests: every hot query's EXPLAIN plan, transaction rollback, keyset pagination.* — **This is the leaf of the dependency graph; everything else builds on it.**
3. **Core vertical slice (offline, ungated):** profile creation → tracking home (1-tap + timer via `timerService`/`useTimer`) → timeline day → edit/soft-delete/undo. First real end-to-end data flow; still zero billing.
4. **Settings + night mode + i18n completion:** `useSettingsStore`, night-window logic (pure function over minutes), full EN/FR strings, dayjs locales.
5. **Entitlements + trial (pure core) → then gate:** `trialService`, `entitlementService` as pure units (100% branch-tested offline), then `useEntitlements`/`usePremiumGate` wired into existing screens, free-24h window via query parameters. *Gate is a layer applied over working features — never baked in.*
6. **Billing integration (risky, last of the monetization chain):** paywall screen + `iapService` (needs EAS dev builds + store sandbox accounts). Only now does any network path exist. Offline-grace and restore paths unit-tested before device testing.
7. **Export & backup:** pdf pipeline (pure builder first), Emergency Doctor Mode, then backup export/import + encryption service (HMAC/rollback paths tested against crafted corrupt files). Restore reuses step 2's `insertRestoredRow*` + exclusive transactions.
8. **Analytics + hardening:** allowlist `track()` call sites, manual export, perf verification against docs/04 budgets (including the 0-network-at-boot test with radio off), Free-downgrade UX polish.

**Ordering rationale:** the offline core must be complete and green before monetization exists (the gate is additive by design, so this is free); billing is deferred because it carries the only external-sandbox risk; export/backup depend only on repositories + pure transforms, so they can start any time after step 2 but benefit from existing gated screens for testing; analytics last among features because it instruments flows that must already exist.

## Sources

- docs/04-tech-stack.md and docs/05-data-model.md (authoritative specs — layering validated, not redesigned) — HIGH
- Expo SDK 57 official docs: expo-sqlite (`openDatabaseAsync`, PRAGMAs via `execAsync`, `withExclusiveTransactionAsync`, no migrations API — schema_version-table runner compatible), expo-print (`printToFileAsync` local cache-dir PDF + `Sharing.shareAsync`), expo-localization (`getLocales`, `textDirection` for RTL boot) — HIGH, https://docs.expo.dev/versions/v57.0.0/
- react-native-mmkv README (V4 Nitro API: `createMMKV({id, encryptionKey, encryptionType})`, `react-native-nitro-modules` required — note for implementation: specs were written against V3 `new MMKV()`; instance-per-namespace design is unchanged) — HIGH, https://github.com/mrousavy/react-native-mmkv
- react-native-iap README (v14.x via OpenIAP monorepo, StoreKit 2 / Play Billing 8, Expo plugin, dev-client required; repo archived Aug 2026 as development moved — keep `iapService` port narrow) — HIGH, https://github.com/dooboolab-community/react-native-iap
- Local-first RN architecture canon (repository-pattern + feature slices; Ink & Switch "local-first software"; WatermelonDB/PowerSync docs) — MEDIUM (community canon, consistent with specs)
- Timestamp-derived timer/trial patterns in period-tracker/baby-tracker apps — MEDIUM (standard practice; matches docs/05 design exactly)

---
*Architecture research for: BabyLog offline-first local-only baby tracker*
*Researched: 2026-09-18*
