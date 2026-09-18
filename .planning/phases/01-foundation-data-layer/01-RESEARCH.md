# Phase 1: Foundation & Data Layer - Research

**Researched:** 2026-09-18
**Domain:** Expo SDK 57 local-first foundation — SQLite + migrations + repositories, MMKV/SecureStore/Zustand, OS backup exclusions, EAS dev builds, Vitest in-memory SQLite harness
**Confidence:** HIGH overall (versions verified against npm registry today; Expo SDK 57 versioned docs fetched per AGENTS.md mandate; better-sqlite3 driver, m001 DDL, Zod v4 APIs all **empirically probed on this machine** — see Sources)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Workflow dev build**
- **D-001-ctx :** Build hybride — iOS via EAS cloud (obligatoire : pas de Xcode sous Windows), Android en local `expo run:android` (itération rapide, sans file d'attente EAS)
- **D-002-ctx :** Matériel de vérification — Android 14 physique en permanence ; iPhone 12 emprunté à un proche à la demande pour chaque session d'UAT
- **D-003-ctx :** Conditions d'UAT iOS journalisées — (1) D-036 : enrollment Apple Developer Program (PR-2) approuvé AVANT l'UAT de la Phase 1 ; (2) D-035 : UDID de l'iPhone 12 enregistré via `eas device` pour le dev build ad-hoc
- **D-004-ctx :** Contingence — si l'iPhone est indisponible le jour de l'UAT, la vérification de l'AC iOS est replanifiée dans la fenêtre de la phase avec un todo explicite ; jamais waivée, jamais remplacée par un simulateur

**Écran de crash (ErrorBoundary racine)**
- **D-005-ctx :** Fallback brandé rassurant — palette lavande, dark OLED-ready, message « Rien n'est perdu — tes données sont sur cet appareil »
- **D-006-ctx :** Actions = bouton **Relancer** + bouton **« Exporter le rapport »** écrivant un fichier local partageable dès la Phase 1

**Contrat settings store**
- **D-007-ctx :** Le store settings seed le **contrat complet** des clés `settings:*` du doc 05 dès la Phase 1 (`settings:night_mode` off/on/auto, `settings:night_mode_start_minutes`=1200, `settings:night_mode_end_minutes`=420) — le schéma MMKV est figé, la Phase 3 branche l'UI dessus sans migration. Les clés `trial:*` restent hors du seed Phase 1.

**Structure src/ + conventions**
- **D-008-ctx :** Arborescence en couches : `src/core` (db client, PRAGMAs, migrations, mmkv, secure-store, logger), `src/db/schemas`, `src/db/repositories`, `src/services`, `src/stores`, `src/i18n`, `src/theme`
- **D-042 :** Schémas Zod **centralisés en module feuille** `src/db/schemas/` — n'importe que `zod`, aucun import db/SQL ; un fichier par table + schémas backup/analytics/settings ; les repositories importent leurs schémas depuis `src/db/schemas`, et les hooks/UI/backup importent les schémas sans jamais importer un repository (direction d'import D-041 préservée)
- **D-030 (confirmé) :** i18n **namespaces par domaine** (`common`, `tracking`, `settings`, `exports`, `crash`) en `en/` et `fr/` ; `en/common.json` minimal dès la Phase 1
- **D-009-ctx :** Alias `@/` → `src/` pour tous les imports internes (déjà présent dans tsconfig.json)

### Claude's Discretion
- Choix du driver SQLite in-memory pour le harness Vitest (better-sqlite3 vs sql.js vs adaptateur expo-sqlite) — contrainte : même SQL, mêmes PRAGMAs testables
- Détails de la config plugin iOS (implémentation isExcludedFromBackup) et du manifest Android — le résultat est verrouillé par l'AC, la mécanique est libre
- Naming fin des fichiers dans chaque couche (convention interne cohérente)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| OPS-02 | allowBackup=false / dataExtractionRules Android configurés dès la couche données (DB et MMKV exclus de l'auto-backup cloud) | `android.allowBackup: false` is a first-class Expo config key [VERIFIED: docs.expo.dev/versions/v57.0.0/config/app/]; `dataExtractionRules` is NOT exposed — config plugin pattern verified (withAndroidManifest + withDangerousMod writing res/xml) [VERIFIED: docs.expo.dev/config-plugins/plugins/ + /dangerous-mods/]; verification command `aapt2 dump xmltree` available locally (aapt2.exe present in build-tools 33–37). iOS counterpart (SPEC R5/AC#8): runtime file exclusion mechanism researched in "iOS iCloud exclusion" section |
</phase_requirements>

## Summary

Phase 1 installs the corrected stack (D-024) on an empty create-expo-app scaffold and builds the entire local data layer: SQLite client + m001 migration + 6 Zod-validated repositories, dual MMKV instances (standard + encrypted via SecureStore) behind Zustand persist, OS backup exclusions on both platforms, error logger + ErrorBoundary with a shareable report export (D-006), i18n boot, design tokens + NativeWind, and EAS/local dev builds. Every version from STACK.md was re-verified against the registry today and the Expo SDK 57 versioned docs were consulted directly per AGENTS.md.

The single most consequential finding: **a config plugin alone cannot implement the iOS `isExcludedFromBackup` requirement** — config plugins run at build time and the target files (`babylog.db`, `-wal`/`-shm`, MMKV files) are created at runtime. The verified mechanism is a tiny local Expo Modules module (`npx create-expo-module --local`) whose Swift function sets `URLResourceValues.isExcludedFromBackup` on each file after creation, called from the storage boot code. Android's half IS config-plugin territory (`allowBackup` is a stock config key; `dataExtractionRules` needs a small plugin writing one XML resource). The SPEC's acceptance criterion (files absent from the iCloud backup set, verified on a real device) is unaffected; the planner should record the mechanism deviation from the SPEC's "via config plugin" wording.

Second finding, de-risking the test harness: **better-sqlite3 13.0.3 installs from prebuilt binaries on this machine's Node 26.3.0/Windows in ~2 s** (no node-gyp), and the complete m001 DDL from docs/05 (as amended by 05-addendum-01) executed successfully against it: 7 tables / 10 indexes / 6 triggers created, update-triggers fire, CHECK boundaries verified (note_text 2000 accept / 2001 reject; amount_ml 5000 accept / 5001 reject), idempotent re-run keeps exactly one `schema_version` row, and keyset pagination tie-break at identical `created_at` returns no duplicates and no skips. Two parity deltas to encode in the harness: WAL is inapplicable in `:memory:` (PRAGMA returns `memory`) and better-sqlite3 enables foreign_keys by default while expo-sqlite defaults OFF — the harness must replay the app's PRAGMA sequence rather than trust driver defaults.

Third: **docs/05's Zod schema code is v3-styled but runs unmodified on zod 4.6.5** — `z.ZodIssueCode` is still exported (`ZodIssueCode.custom === "custom"`), `.strict()` and `z.string().uuid()` are deprecated-but-functional. Write new schemas in v4 style (`z.strictObject`, `z.uuid()`) but do not "fix" docs/05 code that already works. MMKV v4 corrections: deletion is `remove()` (not `delete()` as in the old STACK.md adapter snippet), and `createMMKV()` accepts an explicit `path` option which the iOS exclusion logic should use for file-location determinism.

**Primary recommendation:** Build in dependency order — harness + DB client/migrations first, then repositories, then storage/boot (MMKV/Zustand/i18n/tokens/ErrorBoundary), then backup-exclusion plugins + local module, then EAS config and device verification; use the walking skeleton (profile create → read through real chain → minimal screen, deployed to the physical Android) as the integration checkpoint mid-phase.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| SQLite client, PRAGMAs, migration runner | src/core (L1 platform primitives) | — | Device-owned persistence; single handle owner; pure-enough to run under Vitest via injected adapter |
| 6 repositories + SQL | src/db/repositories (L2) | src/db/schemas (Zod) | docs/05 §8: SQL lives ONLY here; schemas are leaf modules importing only zod (D-042) |
| MMKV instances + SecureStore key + Zustand adapter | src/core storage | src/stores | Storage wiring is platform-tier; stores are plain Zustand over injected storage |
| Android backup exclusions | app.json + config plugins (build tier) | — | Static manifest/XML config verified at build time |
| iOS backup exclusions | src/core storage (runtime) + local Expo module (Swift) | local config plugin (module creation) | Runtime-created files can only be flagged at runtime; build-time plugin cannot see them |
| Error logger + ErrorBoundary + report export | src/core errors | expo-file-system/expo-sharing sinks | Boundary catches render crashes; report file is a thin platform sink (D-006) |
| i18n boot | src/i18n | — | Static bundled JSON, zero network (SPEC R7) |
| Design tokens + NativeWind | src/theme + build config (babel/metro/tailwind) | — | Constant is the single source; NativeWind compiles at build time |
| Dev builds | EAS cloud (iOS) / expo run:android local (Android) | eas.json + expo-dev-client | D-001-ctx hybrid workflow; native modules require dev builds, not Expo Go |

## Standard Stack

### Core (installed this phase)
| Library | Version | Purpose | Why Standard | Conf. |
|---------|---------|---------|--------------|-------|
| expo-sqlite | ~57.0.3 | Local relational store | First-party SDK 57 pin; `openDatabaseAsync`, `execAsync` for PRAGMAs, `withExclusiveTransactionAsync`; no built-in migration API → `schema_version` runner is the sanctioned pattern [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/sqlite/ + npm view] | HIGH |
| react-native-mmkv | ^4.3.2 | KV store (settings/trial + encrypted entitlements) | v4 Nitro API `createMMKV({id, path?, encryptionKey, encryptionType})`; RN ≥ 0.76 OK; sync reads [VERIFIED: github README + npm view] | HIGH |
| react-native-nitro-modules | 0.37.1 (peer of mmkv v4 + quick-crypto) | Nitro runtime (singleton) | Required by both MMKV v4 and quick-crypto; latest works with mmkv (peer `*`) [VERIFIED: npm view + STACK.md compat] | HIGH |
| expo-secure-store | ~57.0.4 | MMKV encryption key, (later) trial secure flag | Keychain/Keystore; ~2 KB per value — keys/flags only [VERIFIED: STACK.md first-party pin] | HIGH |
| expo-crypto | ~57.0.3 | UUIDv4 (`randomUUID`), key generation (`getRandomBytes`) | Does NOT do AES/PBKDF2 (that's Phase 6/quick-crypto) | HIGH |
| expo-iap | ^5.6.2 | IAP binding — installed, NOT configured | `npx expo install expo-iap`; config plugin `"expo-iap"` (options optional); SDK 57 is the validated baseline; dev-client required [CITED: openiap.dev/docs/setup/expo + npm view] | MEDIUM-HIGH |
| react-native-quick-crypto | ^1.1.7 (+ react-native-quick-base64 ^3) | Backup crypto — installed, NOT used until Phase 6 | Nitro-based; RN ≥ 0.75; `expo install` + prebuild; optional `install()` for global.Buffer [CITED: github README] | MEDIUM-HIGH |
| nativewind | ^4.2.7 | Tailwind-in-RN | 4.2.7 explicitly "adds Expo SDK 57 support"; v5 is pre-release — do not adopt; REQUIRES tailwindcss 3.4.x [CITED: nativewind.dev installation docs] | HIGH |
| tailwindcss | ~3.4.19 (pin 3.4.x; latest v3 line) | NativeWind build-time compiler | Tailwind v4 unsupported by NativeWind 4.x [VERIFIED: npm view + nativewind.dev] | HIGH |
| zod | ^4.6.5 | Validation at boundaries | v4 stable; docs/05 v3-style code runs unmodified (probed) [VERIFIED: npm view + local probe] | HIGH |
| i18next + react-i18next | ^26.4.2 + ^17.0.14 | i18n boot | react-i18next 17 peers i18next ≥ 26.2; static `resources` init pattern verified [VERIFIED: npm view + i18next.com docs] | MEDIUM-HIGH |
| expo-localization | ~57.0.2 | Locale detection for i18next `lng` | First-party | HIGH |
| zustand | ^5.0.15 | Global state + persist | `persist` + `createJSONStorage` + `StateStorage` type verified in shipped .d.ts [VERIFIED: npm view + node_modules probe] | HIGH |
| expo-dev-client | ~57.0.19 | Dev build launcher | Required by `"developmentClient": true` profiles [VERIFIED: npm view + docs.expo.dev/build/eas-json/] | HIGH |
| expo-file-system | ~57.0.7 | Crash-report file export (D-006) | New `File`/`Directory`/`Paths` API is the default import; legacy functions throw at runtime [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/filesystem/] | HIGH |
| expo-sharing | ~57.0.21 | Share sheet for crash report (D-006 "fichier local partageable") | First-party | HIGH |
| expo-build-properties | ~57.0.21 | minSdk 33 (D-026), iOS deployment target | First-party plugin for gradle.properties/podfile props | HIGH |

### Supporting (dev/test)
| Library | Version | Purpose | When to Use | Conf. |
|---------|---------|---------|-------------|-------|
| vitest | ^5.0.1 | Unit tests (repos, migrations, audits) | All Phase 1 tests; no RN runtime needed [VERIFIED: npm view] | HIGH |
| better-sqlite3 | ^13.0.3 | In-memory SQLite harness driver | **Chosen driver** — probed on this machine: Node 26.3.0/Win32 prebuilt install, full trigger/FK/CHECK/txn parity [VERIFIED: local probe] | HIGH |
| sql.js | 1.14.2 | WASM fallback driver | Only if a future Node bump breaks better-sqlite3 prebuilds [VERIFIED: npm view] | MEDIUM |
| eas-cli | latest (≥ 19.1.0 for --refresh-ad-hoc-provisioning-profile) | EAS builds/devices | Not installed locally — use `npx eas-cli@latest` or `npm i -g` [VERIFIED: absent on PATH] | HIGH |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| better-sqlite3 harness | sql.js (WASM) | Zero native install, but slower and still no WAL; better-sqlite3 already verified working here — sql.js is the documented fallback only |
| Local Expo module for iOS exclusion | AppDelegate mod via config plugin | Runs before JS creates files — cannot flag runtime files; rejected |
| `npx expo install` for everything | manual npm pins | expo-sqlite/expo-file-system/etc. MUST use `npx expo install` to get SDK-matched versions; JS libs (mmkv, zod, zustand, i18next) via npm |
| expo-iap | react-native-iap ^16.6.1 | Would pin nitro ~0.36.5 + kotlin 2.2.0 (conflicts with latest nitro 0.37.1 that MMKV wants) — expo-iap is the compatible choice [CITED: STACK.md] |

**Installation:**
```bash
# First-party SDK-57 modules — expo install pins exact versions
npx expo install expo-sqlite expo-file-system expo-sharing expo-secure-store \
  expo-crypto expo-localization expo-build-properties expo-dev-client expo-iap

# JS + Nitro native modules — npm install
npm install react-native-mmkv react-native-nitro-modules \
  react-native-quick-crypto react-native-quick-base64 \
  nativewind zustand zod i18next react-i18next

# Dev dependencies
npm install -D tailwindcss@~3.4.19 prettier-plugin-tailwindcss vitest better-sqlite3 @types/better-sqlite3
```
Then: NativeWind wiring (babel/metro/global.css — see Code Examples), `eas.json`, config plugins, `modules/` local module, and a native rebuild (`expo run:android` locally; `eas build --profile development` for iOS).

**Version verification:** All versions in the tables were verified with `npm view <pkg> version` on 2026-09-18. `react-native-quick-base64` version not re-verified this session — `npm install` will resolve its current ^3 line [ASSUMED for exact minor].

## Package Legitimacy Audit

> Seam verdicts run 2026-09-18. Every flagged verdict traces to a single heuristic: **"too-new"** — the `latest` dist-tag published within the last ~7 days. Signals for every package show `exists: true`, official first-party/canonical repo URLs, no deprecation, and **no postinstall scripts**. No SLOP verdicts; no unknown names.

| Package | Registry | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|--------------|-------------|---------|-------------|
| expo-sqlite | npm | 1.1 M | github.com/expo/expo | SUS (too-new: 2026-09-11) | Approved — first-party Expo SDK; `npx expo install` pins SDK-matched version |
| react-native-mmkv | npm | — | github.com/mrousavy/react-native-mmkv | OK | Approved |
| react-native-nitro-modules | npm | — | github.com/margelo/nitro | SUS (too-new) | Approved — required peer of MMKV v4; official Nitro repo |
| react-native-quick-crypto | npm | — | github.com/margelo/react-native-quick-crypto | OK | Approved |
| react-native-quick-base64 | npm | — | github.com/margelo/react-native-quick-base64 | OK | Approved |
| expo-iap | npm | 218 K | github.com/hyodotdev/openiap | SUS (too-new: 2026-09-15) | Approved — featured in Expo's official IAP guide; OpenIAP monorepo |
| expo-dev-client / expo-secure-store / expo-crypto / expo-localization / expo-build-properties / expo-file-system | npm | — | github.com/expo/expo | SUS (too-new) | Approved — first-party SDK 57 modules installed via `npx expo install` |
| nativewind | npm | 1.6 M | github.com/nativewind/nativewind | SUS (too-new) | Approved — official docs site active; 4.2.7 declares SDK 57 support |
| tailwindcss | npm | — | github.com/tailwindlabs/tailwindcss | OK | Approved |
| zustand | npm | — | github.com/pmndrs/zustand | OK | Approved |
| zod | npm | 264 M | github.com/colinhacks/zod | SUS (too-new: 2026-09-13) | Approved — canonical validation library, massive adoption |
| i18next / react-i18next | npm | 20 M / — | github.com/i18next/i18next | SUS (too-new) | Approved — canonical i18n stack |
| vitest | npm | 94 M | github.com/vitest-dev/vitest | SUS (too-new) | Approved — canonical test runner |
| better-sqlite3 | npm | — | github.com/WiseLibs/better-sqlite3 | OK | Approved |
| sql.js | npm | — | github.com/sql-js/sql.js | OK | Approved (fallback only) |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** all flags above are the seam's "too-new" freshness heuristic on actively-published packages — overridden by first-party provenance (expo/* in bundledNativeModules.json), official repo URLs, million-scale weekly downloads, and absence of postinstall scripts. Planner may add a single batch `checkpoint:human-verify` if policy requires, but per-package gates are not warranted.

## Architecture Patterns

### System Architecture Diagram

```
 BUILD TIME                                    RUNTIME (device / Vitest)
 ──────────                                    ─────────────────────────
 app.json                                      App start (_layout.tsx boot)
   ├─ android.allowBackup=false ──────────┐    │
   ├─ plugins: [                          │    ▼
   │    ./plugins/withDataExtractionRules │    core/boot: openDatabaseAsync('babylog.db')
   │    expo-iap, expo-build-properties,  │    │  → PRAGMAs (WAL, FK, busy_timeout, recursive_triggers)
   │    expo-splash-screen, expo-router]  │    │  → migrate(): read schema_version → apply m001 in 1 txn
   │                                      │    │  → excludeFromBackup(db + -wal + -shm)  ← local Swift module
   └─ modules/backupGuard (Expo Module)───┼──▶ │  → load MMKV encryption key from SecureStore
                                           │    │      (fail hard on read error — never regenerate)
 EAS cloud (iOS dev build, ad-hoc)  ◀──────┘    │  → createMMKV('settings') + createMMKV('entitlements',
 expo run:android (local dev build)             │      {encryptionKey}) → flag MMKV files
                                                │  → seed settings:* keys (D-007 contract)
                                                │  → i18n init from static JSON (fallback EN)
                                                │  → rehydrate Zustand stores (persist/MMKV adapter)
                                                ▼
                                          index.tsx (walking skeleton screen)
                                                │  tap → Zod insert schema → babyProfileRepository.create
                                                │        → repository reads back → render name
                                                ▼
                                          SQLite (truth)        MMKV (config)     SecureStore (key)
```

### Recommended Project Structure

```
src/
├── app/                      # expo-router: _layout.tsx (boot+ErrorBoundary) + index.tsx ONLY after purge
├── core/
│   ├── database/
│   │   ├── client.ts         # openDatabaseAsync + PRAGMA sequence + handle export
│   │   └── migrations/       # m001.ts (docs/05 §6 DDL verbatim + addendum), runner.ts (schema_version)
│   ├── storage/
│   │   ├── mmkv.ts           # createMMKV ×2 (standard + encrypted), explicit path
│   │   ├── secureStorage.ts  # key load/store, fail-hard policy
│   │   └── zustandAdapter.ts # createJSONStorage over MMKV (getString/set/remove)
│   ├── errors/
│   │   ├── logger.ts         # → errorLogRepository; swallows its own insert failures
│   │   └── ErrorBoundary.tsx # root boundary + Relancer + Export report (D-005/006)
│   └── backupGuard/          # JS wrapper calling modules/backup-guard excludeFromBackup()
├── db/
│   ├── schemas/              # D-042 leaf modules: one file per table + backup/analytics/settings (zod only)
│   └── repositories/         # 6 repositories — the ONLY SQL (docs/05 §8)
├── services/                 # (empty scaffold this phase — layers named per D-008)
├── stores/                   # settings store (seeded keys), entitlements store (encrypted instance)
├── i18n/
│   ├── index.ts              # initReactI18next boot, fallbackLng 'en'
│   └── locales/{en,fr}/      # common.json minimal (D-030 namespaces)
└── theme/tokens.ts           # single source (#8893FE etc.) feeding tailwind.config
modules/
└── backup-guard/             # npx create-expo-module --local — Swift excludeFromBackup(path)
plugins/
└── withDataExtractionRules/  # Android: writes res/xml/data_extraction_rules.xml + manifest attrs
tests/
├── harness/sqliteHarness.ts  # better-sqlite3 → expo-sqlite-surface adapter
└── …                         # audit + repository + migration tests (see Validation Architecture)
```
Note: the scaffold's demo files (`src/app/explore.tsx`, hint-row, web-badge, animated-icon, themed-text, app-tabs, external-link, collapsible, `.web` variants, `scripts/reset-project.js`) are purged; do NOT run reset-project.js.

### Pattern 1: Vitest in-memory SQLite harness (the phase's testing backbone)

**What:** A thin async adapter exposing the expo-sqlite surface used by repositories (`getAllAsync`, `getFirstAsync`, `runAsync`, `execAsync`, `withExclusiveTransactionAsync`) over better-sqlite3 `:memory:`, replaying the app's exact PRAGMA sequence.
**When to use:** Every repository/migration test; the sql-isolation and migration audits scan source files (pure fs work, no driver).
**Parity facts (probed on this machine):** triggers fire; CHECK constraints enforce boundaries; `BEGIN IMMEDIATE`/`ROLLBACK` works; FK supported — but better-sqlite3 defaults FK **ON** while expo-sqlite defaults OFF (harness replays the PRAGMAs anyway, matching docs/05 §6 ordering); `journal_mode = WAL` returns `memory` on `:memory:` (WAL behavior itself is untestable in harness — device check only).

```ts
// Source: local probe (better-sqlite3 13.0.3 on Node 26.3.0/Win32) + expo-sqlite SDK 57 API
import Database from 'better-sqlite3';
import type { SQLiteDatabase, Transaction } from 'expo-sqlite';

export function openHarnessDb(): DatabaseType {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');      // replay docs/05 §6 PRAGMAs — never trust driver defaults
  db.pragma('busy_timeout = 5000');
  db.pragma('recursive_triggers = OFF');
  // journal_mode=WAL intentionally omitted: inapplicable to :memory: (returns 'memory')
  return db;
}
// withExclusiveTransactionAsync maps to: BEGIN IMMEDIATE → task(txn) → COMMIT / ROLLBACK
```
Repositories should accept a `DatabaseLike` port (`SQLiteDatabase | Transaction`) because **`withExclusiveTransactionAsync` requires running queries on the `txn` handle, not `db`** [VERIFIED: docs.expo.dev/versions/v57.0.0/sdk/sqlite/] — this shapes the repository signatures in docs/05 §8.

### Pattern 2: MMKV dual-instance + SecureStore key + Zustand persist

```ts
// Source: react-native-mmkv v4 README (verbatim API) + zustand StateStorage (node_modules .d.ts)
import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

const mmkvStandard = createMMKV({ id: 'settings' });           // settings + (later) trial keys
const mmkvEncrypted = createMMKV({                              // entitlements ONLY (SPEC R4)
  id: 'entitlements',
  path: entitlementsDir,            // explicit path → deterministic iOS exclusion targets
  encryptionKey: keyFromSecureStore,
  encryptionType: 'AES-256',
});

const mmkvStorage = (instance: MMKV): StateStorage => ({
  getItem: (name) => instance.getString(name) ?? null,
  setItem: (name, value) => instance.set(name, value),
  removeItem: (name) => instance.remove(name),   // v4: remove(), NOT delete()
});
export const useSettingsStore = create(persist((set) => ({ /* seeded keys */ }), {
  name: 'settings',
  storage: createJSONStorage(() => mmkvStorage(mmkvStandard)),
}));
```
StateStorage interface verbatim (from shipped zustand 5.0.15 types): `getItem: (name: string) => string | null | Promise<string | null>; setItem: (name: string, value: string) => R; removeItem: (name: string) => R;`
Boot ordering: SecureStore is async → load the MMKV key and build instances in an awaited boot function before rendering (splash gate in `_layout.tsx`).

### Pattern 3: OS backup exclusions

**Android (build time):** set `android.allowBackup: false` in app.json [VERIFIED: SDK 57 config schema — "no backup or restore of the application will ever be performed"]. Add `plugins/withDataExtractionRules`: a config plugin using `withDangerousMod` to write `android/app/src/main/res/xml/data_extraction_rules.xml` (empty `<cloud-backup>` and `<device-transfer>` sections = exclude everything, self-documenting) and `withAndroidManifest` to add `android:allowBackup="false"` + `android:dataExtractionRules="@xml/data_extraction_rules"` to `<application>`. minSdk 33 (D-026) means no legacy `<full-backup-content>` needed.
**iOS (runtime):** local Expo module `modules/backup-guard` (`npx create-expo-module@latest --local` [CITED: docs.expo.dev/modules/get-started/]) exposing Swift:
```swift
// Pattern: URL.setResourceValue(true, forKey: URLResourceKey.isExcludedFromBackupKey)
Function("excludeFromBackup") { (path: String) -> Bool in
  let url = URL(fileURLWithPath: path)
  return (try? url.setResourceValue(true, forKey: .isExcludedFromBackupKey)) ?? false
}
```
Call it from `core/backupGuard` after (a) DB open + migrate — flag `babylog.db`, `-wal`, `-shm` (WAL files appear after the first write, so flag after migration), and (b) MMKV instance creation — enumerate the instance's `path` directory and flag every file found (naming-agnostic; removes any file-name assumption). `expo-sqlite` exports `defaultDatabaseDirectory` at runtime — use it to compute the DB file paths rather than hardcoding locations [VERIFIED: expo-sqlite 57.0.3 `build/SQLiteDatabase.js`]. MMKV v4 defaults its files to `$(Documents)/mmkv/` — Documents IS backed up by default, hence the exclusion (or the explicit `path` option) is mandatory, not optional [VERIFIED: MMKV README].
Verification: Android — `aapt2 dump xmltree build-*.apk AndroidManifest.xml` (aapt2 present locally in build-tools 33–37); iOS — read the same flag back in-app via `resourceValues(forKeys: [.isExcludedFromBackupKey])` on each file (see Open Questions for full container inspection from Windows).

### Pattern 4: Walking skeleton (SKELETON.md content)

Thinnest credible end-to-end slice for this phase: purge scaffold → `_layout.tsx` runs the boot chain (DB open → migrate → PRAGMAs → MMKV/i18n/tokens → ErrorBoundary mount) → `index.tsx` renders one branded screen with one button. Tap: `babyProfileRepository.create({ name, birth_date, … } validated by Zod insert schema, id = expo-crypto randomUUID)` then `listProfiles()` through the same repository chain, rendering the profile name. Deployment: `expo run:android` on the physical Android 14 (local, D-001-ctx); iOS dev build via EAS to the registered iPhone when available (D-002/003-ctx). The settings seed write + kill/relaunch check doubles as the MMKV persistence AC vehicle. This proves: native modules load, repository chain works on device, Zod validation live, MMKV persists — with zero business UI (Phase 2 owns that).

### Anti-Patterns to Avoid
- **Config-plugin-washing the iOS requirement:** a plugin cannot flag files that don't exist at build time — the runtime module is required; do not accept "plugin added" as the AC.
- **Regenerating the MMKV key on SecureStore read failure:** silently resets entitlements; fail hard into a recovery path instead [CITED: .planning/research/PITFALLS.md integration gotchas].
- **`execAsync` for parameterized queries:** `execAsync` does not escape parameters — reserve it for fixed PRAGMA/DDL text; all user-parameterized statements go through `runAsync`/prepared statements [VERIFIED: SDK 57 sqlite docs].
- **tailwindcss 4.x / NativeWind 5:** breaks the NativeWind 4 build / pre-release — pin 3.4.x + 4.2.7.
- **legacy expo-file-system imports:** classic functions throw at runtime in SDK 57 — use `File`/`Directory`/`Paths` only.
- **OFFSET anywhere:** keyset `(created_at, id)` only (SPEC prohibition, tested by sql-isolation audit).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SQLite engine for tests | A fake DB or JS SQL interpreter | better-sqlite3 (real SQLite) behind a thin adapter | Real trigger/CHECK/FK/txn semantics — a hand-rolled fake would test nothing |
| KV persistence + encryption | File-based JSON store, custom cipher | react-native-mmkv v4 + SecureStore-held key | MMKV handles atomic writes & AES; encryption key handling has OS-level storage requirements |
| Zustand persistence plumbing | Manual save/load in each store | `persist` + `createJSONStorage` + `StateStorage` | Versioning, partial hydration, rehydrate timing are handled |
| Migration bookkeeping | Ad-hoc ALTERs on boot | `schema_version` table + ordered runner | docs/05 §7 convention; idempotency + audit-testable |
| iOS iCloud exclusion via plist hacks | Info.plist keys, file naming tricks | `isExcludedFromBackupKey` resource value via local Expo module | The OS honors exactly this flag for backupd; nothing else works |
| i18n loading | Custom translation dict/cache | i18next static `resources` init | Fallback chains, namespaces, TS typing come free |
| Crash report export | Custom share implementation | expo-file-system `File` + expo-sharing | D-006 needs a shareable local file — platform sinks exist |

**Key insight:** every hand-rolled candidate above either duplicates OS/library guarantees (backup flags, MMKV atomicity) or would produce a test harness that passes while the real device fails (fake DB). The libraries are the thin part; the project's value is the repositories and contracts.

## Common Pitfalls

### Pitfall 1: Running queries on `db` inside `withExclusiveTransactionAsync`
**What goes wrong:** Queries executed on the outer handle instead of the `txn` parameter either escape the transaction or deadlock ("database is locked" aborts).
**Why:** The SDK 57 docs explicitly state the exclusive transaction passes a `Transaction` and queries must run on it [VERIFIED: sqlite docs].
**How to avoid:** Repository methods take a `DatabaseLike = SQLiteDatabase | Transaction` parameter; transactions pass `txn` down.
**Warning signs:** flaky "database is locked" in tests; writes visible before commit.

### Pitfall 2: Harness trusting driver defaults (foreign_keys, WAL)
**What goes wrong:** Tests pass on better-sqlite3 (FK ON by default) while device behavior differs (expo-sqlite FK OFF until the PRAGMA runs), or WAL expectations are asserted in `:memory:`.
**Why:** Drivers preconfigure pragmas differently; WAL is a file-journaling mode inapplicable to in-memory DBs.
**How to avoid:** The harness replays the exact docs/05 §6 PRAGMA sequence after opening; WAL device-verification is a device AC, not a harness test.
**Warning signs:** a repository test that passes without the client's PRAGMA step having run.

### Pitfall 3: MMKV v3 API habits on v4
**What goes wrong:** `mmkv.delete(key)` (v3-era snippet in older notes) fails on v4; `new MMKV()` doesn't exist; Chrome remote debugging doesn't work (JSI).
**Why:** v4 is the Nitro rewrite: `createMMKV()`, deletion is `remove()`.
**How to avoid:** Use only `createMMKV`/`getString`/`set`/`remove`/`contains`/`getAllKeys` [VERIFIED: v4 README]; adapter code review checks for `delete(`.
**Warning signs:** TypeScript errors on adapter methods; "remote debugging" black screen.

### Pitfall 4: iOS `-wal`/`-shm` files created after exclusion runs
**What goes wrong:** DB file flagged at open, but WAL/SHM appear after the first write and remain backup-eligible.
**Why:** SQLite creates them lazily; `isExcludedFromBackup` is per-file and does not propagate to later-created files in a flagged directory [ASSUMED: standard Apple resource-value semantics; Apple doc body not machine-readable this session].
**How to avoid:** Run the exclusion sweep AFTER migrate/first write; re-run at every boot open (idempotent); flag any file found in the DB/MMKV directories.
**Warning signs:** container inspection showing `-wal` present in the backup set.

### Pitfall 5: Config plugin non-idempotency breaking prebuild --clean
**What goes wrong:** withDangerousMod re-writes/duplicates XML on every prebuild, or fails in introspection mode.
**Why:** Dangerous mods are "rarely guaranteed to be idempotent" and run before other mods [VERIFIED: docs.expo.dev/config-plugins/dangerous-mods/].
**How to avoid:** Guard file-existence before writing; honor `config.modRequest.introspect`; assert final XML content in a plugin unit test.
**Warning signs:** duplicated manifest attributes after second prebuild.

### Pitfall 6: expo-iap / quick-crypto assumed working under Expo Go
**What goes wrong:** Both are native-module libraries that cannot load in Expo Go; module-load smoke tests must run in a dev build.
**How to avoid:** Everything after dependency install happens against `expo run:android` / EAS dev builds; smoke = dynamic `import()` of each module at boot resolving without throw [CITED: openiap.dev "You must use a custom development client"].
**Warning signs:** "Cannot find native module" only on device, never in dev-server-only testing.

### Pitfall 7: EAS device registration timing
**What goes wrong:** UDID registered but the first iOS build still fails — "Registering a device with Expo does not register it with Apple"; new memberships can take 24–72 h to process devices.
**Why:** Ad-hoc provisioning embeds UDIDs only at profile creation; Apple processes asynchronously [VERIFIED: docs.expo.dev/build/internal-distribution/].
**How to avoid:** Run `eas device:create` at phase start (D-035), before the first iOS build; schedule UAT with slack (D-003/004-ctx); eas-cli ≥ 19.1.0 if re-signing needed.
**Warning signs:** "device not in provisioning profile" build error.

### Pitfall 8: i18next warning/no-fallback behavior
**What goes wrong:** Booting without `resources` (or with an empty object) warns; a missing FR key returning the raw key breaks AC #11.
**How to avoid:** Pass the bundled JSON at init, `fallbackLng: 'en'`, `react` plugin via `initReactI18next`; test the missing-key path in Vitest (i18next is pure JS — runs in harness) [VERIFIED: i18next.com add-or-load-translations].
**Warning signs:** console warning "i18next::translator: missingKey"; raw key rendered.

## Code Examples

### Client open + PRAGMAs + migration (boot, device)
```ts
// Source: docs.expo.dev/versions/v57.0.0/sdk/sqlite/ (verbatim API names)
import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('babylog.db');
await db.execAsync('PRAGMA journal_mode = WAL');     // device: real WAL
await db.execAsync('PRAGMA foreign_keys = ON');
await db.execAsync('PRAGMA busy_timeout = 5000');
await db.execAsync('PRAGMA recursive_triggers = OFF');
await runMigrations(db);                              // read schema_version → apply pending in 1 txn
```

### Transactional multi-write (repository shape)
```ts
// Source: SDK 57 docs — withExclusiveTransactionAsync(task: (txn: Transaction) => Promise<void>)
await db.withExclusiveTransactionAsync(async (txn) => {
  await insertRow(txn, values);   // queries on txn, NOT db
  await cleanup(txn, id);
});
```

### NativeWind wiring (SDK 57)
```js
// Source: nativewind.dev installation docs (verbatim), reanimated plugin auto-configured by babel-preset-expo
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return { presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"] };
};
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
// global.css: @tailwind base; @tailwind components; @tailwind utilities;
// then import './global.css' in _layout.tsx; tailwind.config.js presets: [require("nativewind/preset")]
```
(The scaffold has no babel.config.js/metro.config.js yet — both are created, not edited.)

### eas.json development profile (minimal)
```json
// Source: docs.expo.dev/build/eas-json/ (default generated shape)
{
  "cli": { "version": ">= 19.1.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" }
  }
}
```
iOS device flow: `npx eas-cli device:create` (QR/URL → UDID) → build → install via the shareable build URL. Android stays local: `npx expo run:android` (adb + JDK 17 + ANDROID_HOME verified present).

### Settings seed (D-007 contract, verified key names)
```ts
// Source: docs/05-data-model.md:2019-2021 (verbatim key list) + 01-CONTEXT.md D-007-ctx
// settings:night_mode           — 'off' | 'on' | 'auto'   (default per doc 05)
// settings:night_mode_start_minutes — 1200
// settings:night_mode_end_minutes   — 420
// (trial:* keys exist in doc 05:2022-2025 but are NOT seeded in Phase 1 — Phase 4)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `new MMKV()` (v3) | `createMMKV()` Nitro API (v4) | MMKV v4 (RN ≥ 0.76 era) | Adapter code + `remove()` naming; Nitro required |
| MMKV without plugin info | explicit `path` option for deterministic file placement | v4 option | Enables clean iOS exclusion targeting |
| expo-file-system classic API | `File`/`Directory`/`Paths` default; legacy throws | SDK 54+ | Crash-report export (D-006) uses new API |
| react-native-iap | expo-iap (same OpenIAP core, Expo Module) | 2026 | No nitro pin juggling; plugin `"expo-iap"` |
| crypto-js | react-native-quick-crypto | D-024 | Installed now, used Phase 6 |
| `PRAGMA user_version` migrations | app-owned `schema_version` table | docs/05 convention | Runner + non-destructive audit tests |
| Reanimated babel plugin manual step | auto-configured by `babel-preset-expo` | SDK 57 | One less babel hazard; worklets pkg already in scaffold |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `isExcludedFromBackup` does not propagate to files created later inside a flagged directory (flag each file after creation) | Pitfall 4 / Pattern 3 | Files missed → iCloud backup includes them → AC #8 fails on device; mitigation (flag-everything sweep at every boot) removes exposure |
| A2 | MMKV per-instance file names unknown; mitigated by enumerating the instance directory instead of hardcoding names | Pattern 3 | None if enumeration is used; hardcoded names would silently miss files |
| A3 | JDK 17.0.10 suffices for local `expo run:android` on RN 0.86 (Gradle 8 supports 17) | Environment Availability | Android local build blocked → would need JDK 17/21 install (minutes) |
| A4 | Local Node 26.3.0 is fine for metro/dev loop; openiap lists Node 22.13.x as the SDK 57 baseline | Environment Availability | Tooling hiccups on Node 26 → fallback: nvm to Node 22 LTS; EAS cloud builds are unaffected |
| A5 | `react-native-quick-base64` current ^3 resolves cleanly alongside nitro 0.37.1 | Standard Stack | Install-time peer warning → pin exact version |
| A6 | In-app read-back of `isExcludedFromBackup` resource values is acceptable evidence for AC #8's "inspection container" intent (full container pull needs libimobiledevice/Xcode) | Open Questions | AC interpreted strictly → need libimobiledevice Windows install or borrowed-Mac session |

## Open Questions

1. **iOS container-inspection mechanics from Windows**
   - What we know: AC #8 requires verifying on a real device that DB/MMKV files are absent from the iCloud backup set. Xcode container download is unavailable (no macOS). libimobiledevice is not installed (checked).
   - What's unclear: whether in-app read-back of the `isExcludedFromBackupKey` resource value (the exact flag backupd consults) satisfies the AC's intent, or whether a full USB backup via `idevicebackup2` (libimobiledevice Windows build) must be inspected.
   - Recommendation: plan the in-app read-back as primary evidence (it queries the same OS flag), plus an optional libimobiledevice install step as a `checkpoint:human-verify` if strict interpretation wins. Decide in planning, not at execution.

2. **MMKV instance `path` for the encrypted instance — Application Support vs Documents**
   - What we know: default is `$(Documents)/mmkv/` (README). A custom `path` gives deterministic targets for the exclusion sweep.
   - What's unclear: whether any MMKV-internal expectation about path stability across updates conflicts with a custom path (unlikely).
   - Recommendation: set an explicit `path` for both instances (e.g. under the app's Library/Application Support) and document it; the sweep enumerates whatever directory the instance reports.

3. **Node 26 vs SDK 57 baseline Node 22 (A4)**
   - What we know: better-sqlite3 + expo-sqlite probed fine on Node 26.3.0 here; openiap lists Node 22.13.x for SDK 57.
   - Recommendation: proceed on Node 26 with `nvm use 22` as the documented fallback; revisit only if metro/eas-cli misbehaves.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | everything | ✓ | 26.3.0 | nvm → Node 22 LTS (openiap SDK 57 baseline) |
| npm | installs | ✓ | 11.16.0 | — |
| JDK | `expo run:android` | ✓ | 17.0.10 | install JDK 17/21 if gradle objects |
| Android SDK + adb | `expo run:android`, aapt2 verification | ✓ | ANDROID_HOME set; build-tools 33.0.1–37.0.0 | — |
| aapt2.exe | merged-manifest AC verification | ✓ | 36.1.0 / 37.0.0 | apkanalyzer |
| eas-cli | iOS dev builds, `device:create` | ✗ | — | `npx eas-cli@latest` (no install needed) |
| Xcode / macOS | iOS build | ✗ (by design) | — | EAS cloud builds (D-001-ctx) |
| libimobiledevice | full iOS container pull | ✗ | — | in-app resource-value read-back (Open Question 1) |
| Physical Android 14 | permanent verification device (D-002-ctx) | user-confirmed | — | — |
| iPhone 12 + Apple Developer enrollment | iOS UAT (D-002/D-036/D-003-ctx) | user-side precondition | — | replan window (D-004-ctx) |

**Missing dependencies with no fallback:** none blocking code work — iOS UAT items are user-side scheduling preconditions with a documented contingency (D-004-ctx).
**Missing dependencies with fallback:** eas-cli (npx), libimobiledevice (in-app verification), Node LTS (nvm).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest ^5.0.1 (+ better-sqlite3 ^13.0.3 harness driver) |
| Config file | `vitest.config.ts` — none exists yet; **Wave 0**: create with `resolve.alias { '@': ./src }` (tsconfig paths are NOT auto-applied by vitest) and `include: ['tests/**/*.test.ts']` |
| Quick run command | `npx vitest run tests/<changed-file>.test.ts` |
| Full suite command | `npm test` → `vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| R2/AC2 | Migration idempotency: re-run on migrated DB = no change, `schema_version=1` | unit (harness) | `npx vitest run tests/migrations/idempotency.test.ts` | ❌ Wave 0 |
| R2/AC2 + AC15 | DDL matches docs/05+addendum: note_text on any type; enums locked; Zod boundaries (note 2000/2001, amount 5000/5001); UTF-8/emoji round-trip in FR JSON + note_text | unit (harness) | `npx vitest run tests/schemas/boundaries.test.ts` | ❌ Wave 0 |
| R3/AC3+4 | All 6 repositories: list on empty DB → `[]`; keyset tie `(created_at,id)` no dup/no skip; Zod-validated writes; txn rollback | unit (harness) | `npx vitest run tests/repositories/` | ❌ Wave 0 |
| R3 prohib. | SQL only in repositories; no OFFSET anywhere | static audit | `npx vitest run tests/sql-isolation.test.ts` | ❌ Wave 0 |
| R10/AC14 | Zero-cloud dependency audit (fail-first fixture with a cloud SDK) | static audit | `npx vitest run tests/zero-cloud-dependencies.test.ts` | ❌ Wave 0 |
| R2 prohib. | Migrations non-destructive (no DROP/DELETE/ALTER-drop in migrations/) | static audit | `npx vitest run tests/migrations-non-destructive.test.ts` | ❌ Wave 0 |
| R4/AC6 | Entitlements store built on the ENCRYPTED MMKV instance, never standard/SQLite | unit (mock storage) | `npx vitest run tests/entitlements-encrypted-instance.test.ts` | ❌ Wave 0 |
| R4/AC5 | Setting survives kill/relaunch; double-write keeps last value | unit (fresh-instance re-read) + device check | `npx vitest run tests/stores/settings-persist.test.ts` (device AC manual) | ❌ Wave 0 |
| R7/AC11 | Missing FR key → EN string, never raw key; zero fetch (static resources) | unit (pure JS i18next) | `npx vitest run tests/i18n/fallback.test.ts` | ❌ Wave 0 |
| R6/AC10 | Render error lands in `error_log`; logger swallows its own insert failure | unit (fake repo) | `npx vitest run tests/errors/logger.test.ts` | ❌ Wave 0 |
| R5/AC7 | Merged manifest carries allowBackup=false + dataExtractionRules | device/build check (manual, scripted) | `aapt2 dump xmltree <apk> AndroidManifest.xml` — manual-only in CI terms; justified: requires built APK | n/a (command documented) |
| R1/AC1 | Dev build launches, modules load, zero network at boot | manual on device | — | manual-only (requires physical device + dev build) |
| R8/AC12 | `#8893FE` only in tokens file; tailwind 3.4.x pinned | static audit | `npx vitest run tests/theme/tokens-audit.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run` on the touched test files (< 30 s — harness is in-memory, no device)
- **Per wave merge:** `npm test` (full vitest suite)
- **Phase gate:** full suite green + device ACs executed on the physical Android before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — runner config + `@/` alias
- [ ] `tests/harness/sqliteHarness.ts` — better-sqlite3 adapter (Pattern 1) + m001 DDL loader
- [ ] `tests/__fixtures__/pkg-with-cloud-sdk.json` + clean/violation fixtures for the three audit tests (SPEC verification column)
- [ ] Dev deps install: `npm i -D vitest better-sqlite3 @types/better-sqlite3`
- [ ] `package.json` scripts: `"test": "vitest run"`, `"android:dev": "expo run:android"`

*(Static audit tests can be written before any implementation — they fail-first against the scaffold.)*

## Security Domain

### Applicable ASVS Categories (level 1, per config security_asvs_level: 1)

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts, no auth (local-first) |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Single-user local app; gating is Phase 4 UX-layer |
| V5 Input Validation | yes | Zod schemas at every write boundary (src/db/schemas, D-042); strict objects; boundary tests at caps |
| V6 Cryptography | yes | MMKV `encryptionType: 'AES-256'` + key from `expo-crypto.getRandomBytes` stored in SecureStore — never hand-rolled cipher; quick-crypto reserved for Phase 6 |
| V7 Errors/Logging | yes | error_log sanitized: message/code/stack/context only — MUST NOT contain baby name or note text (SPEC prohibition; review-enforced) |
| V9 Communications | no | Zero network code this phase (SPEC R10 audit enforces absence) |
| V10 Malicious Code | yes | Package legitimacy audit (above); no postinstall scripts observed; zero-cloud allowlist test |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Baby data exfiltrated via OS cloud backup | Information Disclosure | `allowBackup=false` + dataExtractionRules (Android); `isExcludedFromBackup` sweep (iOS); both AC-verified on device |
| SQL injection via unsanitized statement building | Tampering | Parameterized `runAsync`/prepared statements only; `execAsync` restricted to fixed PRAGMA/DDL text; sql-isolation audit confines SQL to repositories |
| Entitlement tampering (plaintext or SQLite) | Elevation/Tampering | Encrypted MMKV instance only, enforced by dedicated wiring test (SPEC prohibition test) |
| Sensitive child data in logs | Information Disclosure | Logger writes message/code only; semantic review gate (SPEC: judgment verification) |
| Supply-chain (slopsquatted packages) | Tampering | Legitimacy audit + first-party `npx expo install` pins + no-postinstall evidence |

## Sources

### Primary (HIGH confidence)
- Expo SDK 57 versioned docs (AGENTS.md-mandated): [sqlite](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/) — openDatabaseAsync/execAsync PRAGMAs/withExclusiveTransactionAsync-on-txn/prepareAsync/no-migration-API/defaultDatabaseDirectory; [filesystem](https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/) — File/Directory/Paths, legacy-throws, NO backup-exclusion API (absence verified); [config/app](https://docs.expo.dev/versions/v57.0.0/config/app/) — android.allowBackup present, dataExtractionRules absent
- Expo build/config-plugin docs: [eas-json](https://docs.expo.dev/build/eas-json/) (development profile shape), [internal-distribution](https://docs.expo.dev/build/internal-distribution/) (eas device:create, ad-hoc credentials, 24–72 h Apple processing, 100-device cap), [config-plugins/plugins](https://docs.expo.dev/config-plugins/plugins/) (local plugin format, withAndroidManifest), [dangerous-mods](https://docs.expo.dev/config-plugins/dangerous-mods/) (withDangerousMod, idempotency warnings)
- Local empirical probes (this machine, 2026-09-18): better-sqlite3 13.0.3 install + full m001 DDL execution (counts, triggers, CHECK boundaries, idempotency, keyset tie-break); zod 4.6.5 (ZodIssueCode.custom = "custom", strict/superRefine functional); zustand 5.0.15 (createJSONStorage/persist/StateStorage verbatim from node_modules .d.ts); expo-sqlite 57.0.3 source (`defaultDatabaseDirectory` export)
- Project authoritative specs: docs/05-data-model.md §6–§9 (DDL verbatim, migrations convention, repository SQL, hot queries), docs/05-addendum-01.md (note_text CHECK removal — addendum wins), 01-SPEC.md (locked requirements/ACs), 01-CONTEXT.md (decisions), .planning/research/STACK.md (first-party bundledNativeModules verification)

### Secondary (MEDIUM confidence)
- react-native-mmkv v4 README (github.com/mrousavy/react-native-mmkv) — createMMKV options, remove(), Documents/mmkv default, V4 upgrade guide
- openiap.dev/docs/setup/expo — expo-iap plugin name/options, dev-client requirement, SDK 57 baseline (Kotlin 2.1.20, iOS 16.4+, Node 22.13.x)
- react-native-quick-crypto README — install, nitro companion, RN ≥ 0.75, install() global shim
- nativewind.dev/docs/getting-started/installation — babel/metro/global.css verbatim, "4.2.7 adds Expo SDK 57 support", tailwind 3.x requirement
- i18next.com/how-to/add-or-load-translations — static resources init pattern
- zod.dev/v4/changelog — .strict()/format-method deprecations, z.strictObject/z.uuid, superRefine retention

### Tertiary (LOW confidence — flagged)
- Apple `URLResourceValues.isExcludedFromBackup` semantics (per-file application, Library/Caches exemption): Apple docs page is JS-rendered and body was not machine-readable this session — behavior treated as [ASSUMED] with high prior and mitigated by the flag-every-file sweep design (A1)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version registry-verified today; Expo 57 docs fetched directly; STACK.md independently verified earlier the same day
- Architecture/patterns: HIGH — harness and storage patterns empirically probed; config-plugin APIs from official docs
- iOS exclusion mechanism: MEDIUM — API names and module pattern verified; per-file propagation semantics and MMKV file naming are [ASSUMED] but engineered-around
- Pitfalls: HIGH for library/build pitfalls (docs+probes), MEDIUM for device-side behaviors (WAL files, container inspection) pending device ACs

**Research date:** 2026-09-18
**Valid until:** 2026-10-18 (stable-domain pins; registry `latest` tags moved within days — re-verify before any version bump)

---
*Phase: 01-foundation-data-layer*
*Research complete: 2026-09-18*
