# Phase 1: Foundation & Data Layer - Pattern Map

**Mapped:** 2026-09-18
**Files analyzed:** 34 (files/file-groups to create or modify)
**Analogs found:** 7 / 34 — expected for a foundation phase on a fresh `create-expo-app` scaffold

**Context:** The codebase is a virgin Expo SDK 57 scaffold (verified: zero sqlite/mmkv/nativewind/zod/i18next/zustand deps, zero tests, no eas.json/babel.config.js/metro.config.js/tailwind.config.js/vitest.config.ts). Per D-008-ctx, the entire `src/core`, `src/db`, `src/services`, `src/stores`, `src/i18n`, `src/theme` tree is NEW — no analogs exist and none should be forced. Authoritative source material for no-analog files is `docs/05-data-model.md` (line-anchored below) plus the verbatim code in `01-RESEARCH.md` Patterns 1-4. All analog paths below are git-TRACKED (verified via `git ls-files`).

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `package.json` (modify) | config | n/a | `package.json` (itself — scripts + deps blocks) | exact |
| `tsconfig.json` (verify only) | config | n/a | `tsconfig.json` (itself — `@/` alias already present per D-009-ctx) | exact |
| `app.json` (modify) | config | n/a | `app.json` (itself — plugins array-form pattern) | exact |
| `src/global.css` (modify) | config/style entry | n/a | `src/global.css` (itself — add `@tailwind` directives) | exact |
| `src/app/_layout.tsx` (rewrite) | layout/entry component | boot sequence (request-response) | `src/app/_layout.tsx` current content | exact |
| `src/app/index.tsx` (rewrite) | component (screen) | request-response | `src/app/index.tsx` current content | exact |
| `src/theme/tokens.ts` (new) | config (design tokens) | n/a | `src/constants/theme.ts` | role-match (convention only — file slated for purge) |
| `babel.config.js` (new) | build config | n/a | none — RESEARCH.md Code Examples verbatim | none |
| `metro.config.js` (new) | build config | n/a | none — RESEARCH.md Code Examples verbatim | none |
| `tailwind.config.js` (new) | build config | n/a | none — nativewind preset + tokens import | none |
| `vitest.config.ts` (new) | test config | n/a | `tsconfig.json` (mirror the `@/` alias — vitest does NOT read tsconfig paths) | partial |
| `eas.json` (new) | build config | n/a | none — RESEARCH.md eas.json verbatim | none |
| `src/core/database/client.ts` (new) | service (db client) | CRUD (boot) | none — docs/05 §6 PRAGMAs + RESEARCH Code Examples | none |
| `src/core/database/migrations/m001.ts` (new) | migration | batch (DDL) | none — docs/05 §6 lines 155-350 + docs/05-addendum-01.md | none |
| `src/core/database/migrations/runner.ts` (new) | migration runner | batch | none — docs/05 §7 lines 353-380 | none |
| `src/db/schemas/*.ts` (new, 1 file per table + backup/analytics/settings per D-042) | model/validation (leaf modules) | transform | none — docs/05 §8 lines 423-732 Zod code | none |
| `src/db/repositories/*.ts` (new, 6 repos) | repository (ONLY SQL) | CRUD + keyset | none — docs/05 §8 lines 411-1792 | none |
| `src/core/storage/mmkv.ts` (new) | utility (storage) | CRUD (KV) | none — RESEARCH.md Pattern 2 verbatim | none |
| `src/core/storage/secureStorage.ts` (new) | utility (storage) | n/a | none — fail-hard policy (RESEARCH Anti-Patterns) | none |
| `src/core/storage/zustandAdapter.ts` (new) | utility (adapter) | n/a | none — RESEARCH.md Pattern 2 verbatim | none |
| `src/stores/settingsStore.ts` (new) | store | CRUD (KV persist) | none — RESEARCH.md Pattern 2 + D-007 seed keys | none |
| `src/stores/entitlementsStore.ts` (new) | store | CRUD (KV encrypted) | none — encrypted instance wiring only | none |
| `src/core/errors/logger.ts` (new) | utility | event-driven (insert) | none — docs/05 errorLogInsertSchema lines 719-732 | none |
| `src/core/errors/ErrorBoundary.tsx` (new) | component (class boundary) | event-driven | none (styling convention only: `src/components/themed-text.tsx`) | none |
| `src/core/backupGuard/index.ts` (new) | utility (JS wrapper) | n/a | none — RESEARCH.md Pattern 3 | none |
| `modules/backup-guard/` (new local Expo module, Swift) | native module bridge | n/a | none — `npx create-expo-module --local` template | none |
| `plugins/withDataExtractionRules/` (new config plugin) | config plugin | build-time transform | none — RESEARCH.md Pattern 3 | none |
| `src/i18n/index.ts` (new) | config/boot | n/a | none — i18next static `resources` init | none |
| `src/i18n/locales/{en,fr}/common.json` (new) | resource | n/a | none — D-030 namespaces | none |
| `src/services/` (new, empty scaffold + .gitkeep) | service layer placeholder | n/a | none — layer named per D-008, empty this phase | none |
| `tests/harness/sqliteHarness.ts` (new) | test utility | CRUD | none — RESEARCH.md Pattern 1 verbatim | none |
| `tests/**/*.test.ts` (new, ~13 files per RESEARCH Test Map) | test | n/a | none — RESEARCH.md Validation Architecture table | none |
| `tests/__fixtures__/*.json` (new) | test fixture | n/a | none — fail-first audit fixtures | none |
| `vitest.config.ts` — see row above | | | | |

## Pattern Assignments

### `src/app/_layout.tsx` (rewrite — layout/entry, boot sequence)

**Analog:** `src/app/_layout.tsx` (current scaffold content — the ONLY existing entry-point wiring in the repo)

**Entry-point wiring pattern** (lines 1-18 of current file):
```tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
```

**What to copy into the rewrite:**
- `SplashScreen.preventAutoHideAsync()` module-scope call + the splash gate concept: RESEARCH.md Pattern 2 requires an awaited boot function (DB open → migrate → MMKV key → instances → i18n) before rendering, then `SplashScreen.hideAsync()`. The scaffold's `preventAutoHideAsync()` at module scope is the exact mechanism to keep.
- Default-export root component, `@/` alias imports, group-import blank-line convention.
- Replace `ThemeProvider`/`AppTabs` with: `import '@/global.css'` (NativeWind), ErrorBoundary wrapper (D-005/006), i18n boot, walking-skeleton children.

### `src/app/index.tsx` (rewrite — screen, request-response)

**Analog:** `src/app/index.tsx` (current scaffold content — only existing screen)

**Screen structure pattern** (lines 31-62 and 64-98 of current file):
```tsx
export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* ... */}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  // ...
});
```

**What to copy:** default-export screen function; `StyleSheet.create` at file bottom; `@/` imports; one-button skeleton that calls `babyProfileRepository.create` (Zod-validated, `expo-crypto randomUUID`) then `listProfiles()` through the repository chain (RESEARCH.md Pattern 4). All template components (`ThemedText`, `HintRow`, `WebBadge`, `AnimatedIcon`) are purged — do not import them in the rewrite.

### `src/theme/tokens.ts` (new — design tokens, single source)

**Analog:** `src/constants/theme.ts` (role-match: token-constant convention; the file itself is purged — copy the CONVENTION, then delete the file)

**Token constant pattern** (lines 6-7, 10-27, 54-62 of `src/constants/theme.ts`):
```ts
import '@/global.css';                    // side-effect style entry import

export const Colors = {
  light: { text: '#000000', background: '#ffffff', /* ... */ },
  dark:  { text: '#ffffff', background: '#000000', /* ... */ },
} as const;                               // `as const` on every token object

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;  // derived type export

export const Spacing = {
  half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64,
} as const;
```

**What to copy:** `as const` objects, derived `keyof typeof` type exports, side-effect `import '@/global.css'`. What to replace: lavender palette `#8893FE` etc. from `docs/06-ui-ux-design.md` as the single source (audit test `tests/theme/tokens-audit.test.ts` enforces `#8893FE` appears ONLY here). Tailwind mapping: `tailwind.config.js` (new, no analog) imports these tokens via `preset: require("nativewind/preset")` + `theme.extend.colors` from `@/theme/tokens`.

### `vitest.config.ts` (new — test config)

**Analog:** `tsconfig.json` (partial: the alias to mirror)

**Alias pattern** (lines 3-13 of `tsconfig.json`):
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./src/*"], "@/assets/*": ["./assets/*"] }
  }
}
```

**What to copy:** tsconfig `strict: true` is already set — do not weaken it; `@/` alias needs NO tsconfig change (D-009-ctx confirmed present). What to build new: vitest does NOT auto-apply tsconfig paths — `vitest.config.ts` must declare `resolve: { alias: { '@': path.resolve(__dirname, './src') } }` and `include: ['tests/**/*.test.ts']` (RESEARCH.md Validation Architecture, Wave 0 gap).

### `app.json` (modify — build config)

**Analog:** `app.json` itself (exact — plugins array-form-with-options convention)

**Plugins pattern** (lines 26-36 of current file):
```json
"plugins": [
  "expo-router",
  ["expo-splash-screen", { "backgroundColor": "#208AEF", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }]
],
```

**What to add:** `"android": { "allowBackup": false, ... }` (first-class SDK 57 config key — merge into the existing `android` block at lines 13-21, keep `adaptiveIcon`/`predictiveBackGestureEnabled`); plugins array gains `expo-sqlite` (implicit via install), `"expo-iap"`, `["expo-build-properties", { "android": { "minSdkVersion": 33 } }]` (D-026), `"./plugins/withDataExtractionRules"` (local plugin). KEEP `"userInterfaceStyle": "automatic"` (line 9) — Phase 3 night mode branches onto it. Do not remove `experiments.typedRoutes`.

### `package.json` (modify — deps + scripts)

**Analog:** `package.json` itself (exact — scripts-block convention)

**Scripts pattern** (lines 34-41 of current file):
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

**What to add:** `"test": "vitest run"`, `"android:dev": "expo run:android"` (RESEARCH.md Wave 0 gaps). Dependencies per RESEARCH.md Installation block — first-party modules via `npx expo install` (SDK-matched pins), JS/Nitro libs via `npm install`, dev deps `vitest better-sqlite3 @types/better-sqlite3 tailwindcss@~3.4.19`. Keep `"main": "expo-router/entry"` and `"private": true`.

### `src/global.css` (modify)

**Analog:** `src/global.css` itself (exact — file already exists with `:root` font vars at lines 1-9)

**What to add:** `@tailwind base; @tailwind components; @tailwind utilities;` at the top (RESEARCH.md NativeWind wiring). The existing `:root` block is web-only font vars — harmless to keep, but it is NOT the NativeWind entry itself; the `@tailwind` directives are.

---

## No Analog Found

All files below are NEW. The planner must source their content from `docs/05-data-model.md` (line-anchored), `01-RESEARCH.md` verbatim patterns, and the canonical refs — NOT from scaffold files.

| File | Role | Data Flow | Authoritative Source (line-anchored) |
|------|------|-----------|--------------------------------------|
| `src/core/database/client.ts` | db client | boot/CRUD | docs/05 §6 PRAGMAs (lines 157-160); RESEARCH Code Examples "Client open + PRAGMAs" (`openDatabaseAsync` + 4 `execAsync` PRAGMAs, verbatim API names) |
| `src/core/database/migrations/m001.ts` | migration | batch DDL | docs/05 §6 lines 155-350 (DDL verbatim, 7 tables/10 indexes/6 triggers) AMENDED by docs/05-addendum-01.md (note_text CHECK relaxed, enums locked) |
| `src/core/database/migrations/runner.ts` | migration runner | batch | docs/05 §7 lines 353-380: schema_version table, check-version-before-run, m001 in ONE transaction, idempotent via IF NOT EXISTS + INSERT OR IGNORE; non-transactional PRAGMAs before the migration txn |
| `src/db/schemas/*.ts` (D-042 leaf modules, zod-only imports) | validation schemas | transform | docs/05 §8 lines 425-732 (mirror schemas verbatim); note: docs code is v3-styled but RUNS on zod 4.6.5 — write NEW schemas v4-style (`z.strictObject`, `z.uuid()`), do not "fix" working docs/05 code (RESEARCH Summary) |
| `src/db/repositories/*.ts` (6: babyProfile, logEvent, timerState, fileExport, errorLog, analyticsEvent) | repositories (ONLY SQL) | CRUD + keyset | docs/05 §8: règle commune lines 413-421; babyProfileRepository exemplar lines 734-849 (listAll/getById/create/update/delete/countProfiles with exact SQL per method) |
| `src/core/storage/mmkv.ts` | storage instances | CRUD KV | RESEARCH Pattern 2 verbatim (`createMMKV` v4 API: `{id, path?, encryptionKey, encryptionType: 'AES-256'}`); deletion is `remove()` NOT `delete()` |
| `src/core/storage/secureStorage.ts` | key storage | n/a | RESEARCH Anti-Patterns: fail HARD on SecureStore read error — NEVER regenerate the key |
| `src/core/storage/zustandAdapter.ts` | persist adapter | n/a | RESEARCH Pattern 2 verbatim (`StateStorage` over MMKV: getString/set/remove + `createJSONStorage`) |
| `src/stores/settingsStore.ts` | store | CRUD KV | D-007-ctx seed contract: `settings:night_mode` (off/on/auto), `settings:night_mode_start_minutes`=1200, `settings:night_mode_end_minutes`=420 (docs/05:2019-2021). `trial:*` keys NOT seeded (Phase 4) |
| `src/stores/entitlementsStore.ts` | store | CRUD KV encrypted | RESEARCH Pattern 2 — encrypted instance ONLY (SPEC R4, wiring test AC6) |
| `src/core/errors/logger.ts` | error logger | event-driven | docs/05 errorLogInsertSchema lines 719-732 (message ≤1000, code ≤120, stack ≤20000, context ≤10000 — message/code/stack/context ONLY, never baby name or note text: SPEC V7 prohibition); logger swallows its own insert failures (RESEARCH structure tree) |
| `src/core/errors/ErrorBoundary.tsx` | root boundary | event-driven | D-005-ctx fallback (lavender palette, dark OLED, "Rien n'est perdu — tes données sont sur cet appareil") + D-006-ctx actions (Relancer + Exporter le rapport via expo-file-system `File`/`Paths` NEW API + expo-sharing). Styling convention only from scaffold components (`StyleSheet.create`, typed props) |
| `src/core/backupGuard/index.ts` | exclusion wrapper | n/a | RESEARCH Pattern 3: call Swift module AFTER migrate/first write (flag `babylog.db`+`-wal`+`-shm`) and AFTER MMKV creation (enumerate instance directory); idempotent re-run at every boot; use `expo-sqlite` `defaultDatabaseDirectory` export for paths |
| `modules/backup-guard/` | local Expo module (Swift) | n/a | RESEARCH Pattern 3 Swift verbatim: `url.setResourceValue(true, forKey: .isExcludedFromBackupKey)`; scaffold via `npx create-expo-module@latest --local` |
| `plugins/withDataExtractionRules/` | config plugin | build-time | RESEARCH Pattern 3: `withDangerousMod` writes `android/app/src/main/res/xml/data_extraction_rules.xml` (empty cloud-backup + device-transfer) + `withAndroidManifest` adds `allowBackup="false"` + `dataExtractionRules` attr; guard idempotency + honor `introspect` (RESEARCH Pitfall 5) |
| `src/i18n/index.ts` + `locales/{en,fr}/common.json` | i18n boot | n/a | RESEARCH Pitfall 8: pass bundled JSON at init, `fallbackLng: 'en'`, `initReactI18next`; D-030 namespaces (common/tracking/settings/exports/crash); `en/common.json` minimal Phase 1; pure JS — testable in Vitest |
| `src/services/` | empty layer | n/a | D-008 layer naming only — no code this phase |
| `tests/harness/sqliteHarness.ts` | test harness | CRUD | RESEARCH Pattern 1 verbatim: better-sqlite3 `:memory:`, REPLAY docs/05 §6 PRAGMAs (never trust driver defaults — better-sqlite3 defaults FK ON, expo-sqlite OFF; WAL inapplicable in `:memory:`); map `withExclusiveTransactionAsync` → BEGIN IMMEDIATE/COMMIT/ROLLBACK |
| `tests/**/*.test.ts` (~13) | tests | n/a | RESEARCH.md Validation Architecture "Phase Requirements → Test Map" (per-test file names + commands); audit tests are pure fs scans — writable before implementation (fail-first) |
| `tests/__fixtures__/*.json` | fixtures | n/a | RESEARCH Wave 0 gaps (pkg-with-cloud-sdk fail-first fixture + clean/violation pairs) |
| `babel.config.js` / `metro.config.js` / `tailwind.config.js` / `eas.json` | build configs | n/a | RESEARCH Code Examples verbatim (NativeWind babel/metro, eas.json development profile `{"developmentClient": true, "distribution": "internal"}`, cli.version `>= 19.1.0`). None exist in scaffold — CREATED, not edited |

## Shared Patterns

### 1. `@/` alias imports (all internal imports)
**Source:** `tsconfig.json` lines 6-12; demonstrated in every scaffold file (e.g. `src/app/_layout.tsx` lines 5-6)
```ts
import { AnimatedSplashOverlay } from '@/components/animated-icon';
```
**Apply to:** every new file under `src/`, `tests/` (via vitest alias), plugins. Third-party imports first, blank line, then `@/` imports (scaffold convention).

### 2. SQL confinement + keyset pagination (SPEC prohibitions)
**Source:** `docs/05-data-model.md` lines 413-421
```
- Tout SQL est exclusivement dans les repositories.
- Les hooks, écrans et services n'écrivent jamais de SQL.
- Les écritures sont validées par Zod avant exécution.
- La pagination keyset utilise created_at et id.
- OFFSET est interdit.
- Une transaction est utilisée pour toute opération multi-écritures.
```
**Apply to:** all 6 repositories; enforced by `tests/sql-isolation.test.ts`. Import direction (D-042/D-041): schemas (leaf, zod-only) ← repositories ← services/stores/hooks. Never the reverse.

### 3. PRAGMA sequence (boot + harness parity)
**Source:** `docs/05-data-model.md` lines 157-160
```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
PRAGMA recursive_triggers = OFF;
```
**Apply to:** `src/core/database/client.ts` (device, via `execAsync`) AND `tests/harness/sqliteHarness.ts` (replay — omit journal_mode, it returns `memory` in `:memory:`). Queries inside `withExclusiveTransactionAsync` run on the `txn` handle, never `db` (RESEARCH Pitfall 1) — shape repository methods to take `DatabaseLike = SQLiteDatabase | Transaction`.

### 4. Zod-at-boundaries, v4 style for new code
**Source:** docs/05 §8 lines 435-453 (row/insert mirror pattern) + RESEARCH Summary
```ts
const babyProfileRowSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(80),
  birth_date: epochMsSchema,
  created_at: epochMsSchema,
  updated_at: epochMsSchema
}).strict();
type BabyProfileRow = z.infer<typeof babyProfileRowSchema>;
```
**Apply to:** all `src/db/schemas/*.ts` — every table gets row+insert mirror schemas + `z.infer` type exports. Write NEW schemas v4-style (`z.strictObject`, `z.uuid()`); cross-field rules via `.superRefine` with `z.ZodIssueCode.custom` (docs/05 lines 499-549 exemplar). Boundary tests at caps: note 2000/2001, amount 5000/5001.

### 5. Migration conventions (non-destructive)
**Source:** `docs/05-data-model.md` lines 353-362
**Apply to:** `runner.ts` + `m001.ts`; enforced by `tests/migrations/idempotency.test.ts` + `tests/migrations-non-destructive.test.ts` (no DROP/DELETE/ALTER-drop in migrations/). Published migrations are never modified.

### 6. Error-log sanitization (V7)
**Source:** docs/05 errorLogInsertSchema lines 719-732 + SPEC prohibition
**Apply to:** `logger.ts` + `ErrorBoundary.tsx` — persist message/code/stack/context ONLY. Never baby name, note text, or other child data. Review-enforced.

### 7. Conventional commits
**Source:** established repo convention (CONTEXT.md "Established Patterns")
**Apply to:** all executor commits this phase.

## Metadata

**Analog search scope:** `src/**` (all 20 tracked source files), root configs (`app.json`, `package.json`, `tsconfig.json`), `docs/05-data-model.md` (targeted reads of §6/§7/§8), confirmed-absent: `tests/`, `vitest.config.*`, `babel.config.*`, `metro.config.*`, `eas.json`, `tailwind.config.*`
**Files scanned:** 14 read in full or targeted (9 scaffold files + docs/05 sections); tracked-status verified for all named analogs via `git ls-files`
**Pattern extraction date:** 2026-09-18
