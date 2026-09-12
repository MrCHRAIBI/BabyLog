# Project Research Summary

**Project:** BabyLog Offline — local-first newborn tracker (100% offline, zero backend)
**Domain:** Offline-first mobile app (Expo SDK 57 / RN 0.86.3 / React 19.2.3 / New Architecture)
**Researched:** 2026-09-12
**Confidence:** HIGH on stack versions and architecture (verified against the SDK 57 shipped version map, npm tarballs, and docs.expo.dev/versions/v57.0.0); MEDIUM overall (competitor feature claims are vendor-authored; PBKDF2 timings on Hermes are unmeasured; two integration risks flagged below)

## Executive Summary

BabyLog is a local-first, offline-only newborn care tracker (feed/sleep/diaper logging, "≤ 2 taps at 3 a.m. with the screen off") monetized by day-surface AdMob + a $29.99 Lifetime IAP, with zero backend, zero accounts, and zero network calls before `onboarding_completed`. Experts build this class of product as a layered Expo app: thin Expo Router routes → feature folders (screens/hooks/services/repository/models) → pure dependency-injected services → typed repositories over a `DbAdapter` seam → expo-sqlite (WAL) + MMKV. The competitive research validates the locked 5-feature MVP as covering the table stakes (1-tap timers, edit/backdate, daily totals, reports) while owning four differentiators no competitor holds simultaneously: a true OLED night UI, local SweetSpot prediction from ~3 days of data (Huckleberry needs 2+ months and charges $11.99/mo), a free never-paywalled AES-256 encrypted local backup, and Lifetime-first pricing.

The recommended approach: keep the repo's coherent SDK 57 baseline (expo ~57.0.22, RN 0.86.3, expo-router ~57.0.21, Reanimated 4.5.1) and install the specified stack on top — NativeWind **4.2.6 + Tailwind ~3.4.19** (the only stable pairing; not Tailwind 4, not NativeWind 5 preview), react-native-mmkv 4.3.2 + react-native-nitro-modules (v4 API: `createMMKV`, **no config plugin**, **explicit `encryptionType: 'AES-256'`** — default is AES-128), expo-sqlite sync API + WAL, zustand/zod/react-hook-form, crypto-js per spec, i18next × 5 locales. The architecture in docs/04 + docs/05 is **validated as sound** — no restructuring — with one genuine addition (a `core/boot/bootstrap.ts` ordered boot pipeline as the single auditable seam for the offline guarantee) and `Stack.Protected` route gating. Three spec-doc assumptions are outdated for SDK 57 and must be corrected at scaffold time: (1) MMKV plugin removed / API renamed, (2) `expo-file-system` legacy functions **throw at runtime** from the main entry — use the new `File`/`Directory`/`Paths` API, (3) AdMob plugin props changed (`delayAppMeasurementInit` yes; `childDirectedTreatment`/`maxAdContentRating` are now runtime `setRequestConfig` calls).

Key risks and mitigations: the **entire native stack (MMKV, IAP, ads) is Expo-Go-incompatible** — EAS dev builds must exist on day 1 before any feature work. **crypto-js PBKDF2 on Hermes** (no JIT) will likely freeze the UI and miss the < 2 s / 10 MB backup budget — derive the AES key once at first run, chunk + yield the export pipeline, and run a week-1 on-device benchmark (fallback: `@noble/hashes`, needs an explicit spec-level decision). The **AdMob SDK silently breaks the zero-network promise** unless `delayAppMeasurementInit: true` is baked in at scaffold and `initialize()` is hard-gated behind onboarding + free tier + UMP consent — verified by airplane-mode and proxy boot tests, not by code review. **MMKV-encrypted-instance boot crashes after reboot-before-unlock** (sync MMKV vs async secure-store) need an explicit async init module and a tested "locked device" path. **Ads on New Architecture have live gaps** (native ads broken on Android Fabric #870; rewarded-dismissal freeze on iOS #859) — sequence formats Banner → Rewarded → Native. One **open conflict between researchers**: the IAP library (spec's react-native-iap vs expo-iap, which react-native-iap's own README directs Expo projects to) — must be decided before the monetization phase (see Gaps).

## Key Findings

### Recommended Stack

The repo baseline is already correct and locked by the SDK 57 version map; everything installs cleanly via `npx expo install` (never bare `npm install` for `expo-*` packages). Full details, exact versions, config files (babel/metro/tailwind/app.json), and verified pairings are in `.planning/research/STACK.md`.

**Core technologies (keep/add):**
- **Expo SDK 57 / RN 0.86.3 / React 19.2.3** — repo baseline; all `expo-*` packages are SDK-versioned (`~57.0.x`)
- **expo-router ~57.0.21** — file-based navigation, typed routes already enabled
- **NativeWind 4.2.6 + tailwindcss ~3.4.19** — sole styling paradigm; v5 is a stalled preview (~45 catalogued latent issues), Tailwind v4 engine unsupported — do not adopt either
- **react-native-mmkv 4.3.2 + react-native-nitro-modules ~0.37.1** — JSI-fast KV for timer/settings/quotas/entitlements; v4 is a Nitro module: `createMMKV()`, no config plugin, explicit AES-256
- **expo-sqlite ~57.0.3** — local relational DB; WAL + foreign_keys; `withExclusiveTransactionAsync` for backup import (the non-exclusive variant can be interleaved)
- **zustand 5 + zod 4 + react-hook-form 7 + @hookform/resolvers 5** — state/validation/forms; `persist` + `partialize` over a Zod-validating MMKV adapter
- **expo-crypto + expo-secure-store + crypto-js 4.2.0** — UUIDs/randomness, master key in Keychain (≤ 2 KB values), AES-256 + PBKDF2 per spec (quick-crypto banned); crypto-js is discontinued-but-stable — keep it behind a single swappable wrapper
- **expo-print/file-system/sharing** — local pediatrician PDF + `.babylog` backups; images/fonts must be base64-inlined (iOS WKWebView cannot load local asset URLs); `printToFileAsync` has no `orientation` option — use CSS `@page`
- **react-native-google-mobile-ads 16.5.0** — Banner/Native/Rewarded + built-in UMP consent; `delayAppMeasurementInit: true` is what makes deferred init real
- **IAP library — OPEN DECISION** (see Gaps): spec says react-native-iap 16.6.0; ARCHITECTURE research found its README states Expo Dev Client is unsupported and directs Expo projects to **expo-iap 5.6.0** (ships `withIAP` config plugin, same OpenIAP core)
- **Vitest 5 + @vitest/coverage-v8 5 + better-sqlite 13** — services/repos only via the `DbAdapter` seam (prod = expo-sqlite, test = better-sqlite3 `:memory:`); 80% coverage target

**Notable bans (re-verified 2026-09-12):** any backend/SaaS (Firebase, RevenueCat, Sentry), AsyncStorage, Redux/MobX, styled-components/Tamagui, WatermelonDB/Realm, react-native-quick-crypto, `expo-ads-admob`, remote push, interstitials, NativeWind 5 / Tailwind 4.

### Expected Features

Full landscape, competitor matrix, and prioritization are in `.planning/research/FEATURES.md`.

**Must have (table stakes — all in the locked MVP):**
- 1-tap feed/sleep timers + instant diaper logging, crash-surviving timer (MMKV)
- Edit / backdate / delete any entry (make acceptance criteria explicit — the universal failure mode is a timer that ran all night)
- Feed modality details: breast side + mid-feed switch, bottle ml; 4 diaper-type chips
- 7-day timeline (free) + daily totals dashboard; unlimited history is premium
- No-account < 45 s onboarding, non-medical disclaimer (Apple 1.4.1), zero permissions at boot
- Data ownership: local PDF export + full backup/restore (backup free forever — the trust moat)

**Should have (differentiators):**
- OLED "Nocturne Glow" night UI + haptics — no competitor owns 3 a.m. ergonomics; market it as a feature, not a theme
- Local SweetSpot EMA prediction (premium-gated, free teaser after 3 days of data) — beats Huckleberry on price AND age coverage; set expectations that 0–6 week schedules are chaotic
- Lifetime $29.99 as primary offer ("≈ 2.5 months of Huckleberry Plus")
- Zero-cloud/zero-account verifiable promise (airplane-mode provable)

**Known gaps vs market (accepted deferrals — own them in marketing):**
- **G3 Partner/caregiver sync** — the single largest table-stakes hole (Huckleberry has it FREE via cloud); serverless QR Delta is correctly deferred to V1.1 but must be the **first post-launch ship**
- **G1 Growth/weight logging** — every major tracker has it; cheap manual weight entry at V1.1, WHO percentiles V2
- **G2 Pumping sessions** — standard for breastfeeding mothers; LOW complexity feed sub-type; the one candidate to stretch into MVP if the feed-modality schema lands early
- Keep `baby_id` on every row and a generalizable `baby_profile` from day one so twins/multi-child is a V1.x add, not a rewrite

**Defer (v2+):** widgets/Watch (highest "power" ask — parity pressure will grow), solids/allergen tracking, medication/temperature log, nanny mode, BYOK AI.

**Anti-features (do not build):** cloud sync, AI logging via voice/photo (contradicts zero-network), community, paywalled backup/export, interstitials, streaks/gamification, mandatory accounts, heavy on-device ML.

### Architecture Approach

The layered architecture in docs/04 (thin routes → features → services → repositories → SQLite/MMKV) and the data layer in docs/05 (m001 DDL, DbAdapter, versioned Zod backup format) are **validated for SDK 57 with no restructuring**. Five library-API corrections are required (MMKV plugin/API, expo-file-system new API, AdMob plugin keys → runtime config, no `printToFileAsync` orientation, no manual Reanimated babel plugin), plus `tsconfig` needs `noUncheckedIndexedAccess: true`. Details in `.planning/research/ARCHITECTURE.md`.

**Major components:**
1. **`core/boot/bootstrap.ts` (new — the one genuine gap in docs/04)** — ordered local-only pipeline (master key → open DB + PRAGMAs → migrate → hydrate stores → read onboarding flag → local boot event); the single auditable seam for the zero-network guarantee and the `boot_duration_ms` metric
2. **Routes (`src/app`)** — thin (≤ 20 lines), typed routes; `Stack.Protected guard={onboarded}` gates `(setup)` vs `(tabs)`; splash held (module-scope `preventAutoHideAsync`) until bootstrap resolves
3. **Features** — screens/hooks/services/repository/models behind an `index.ts` barrel; the crash-surviving `timerStore` lives in `features/tracking/stores/`
4. **Repositories over `DbAdapter`** — the only SQL in the codebase; prod adapter maps `transaction()` to `withExclusiveTransactionAsync`, the better-sqlite3 test adapter must hand-roll BEGIN/COMMIT (its own `db.transaction()` rejects async fns)
5. **`core/billing` + `core/ads`** — lazily imported (`await import(...)`) only post-onboarding; entitlements in encrypted MMKV; ESLint `no-restricted-imports` + airplane-mode CI test as mechanical backstops
6. **State split (enforced by convention)** — queryable data → SQLite; tiny/crash-critical (timer, settings, quotas, entitlements) → MMKV; master key → secure-store; transient UI → React only

### Critical Pitfalls

Top pitfalls (full list with recovery strategies and a "looks done but isn't" checklist in `.planning/research/PITFALLS.md`):

1. **Expo Go cannot be part of any workflow** (MMKV/IAP/ads are all custom-native) — create the EAS dev build in the scaffold phase, day 1, with a smoke screen touching MMKV + SQLite + haptics.
2. **crypto-js on Hermes freezes the JS thread** — PBKDF2-100k and AES-256/10 MB are expected to take seconds (exact timings LOW confidence; benchmark mandated). Derive the key once, cache in secure-store, chunk + yield the export, write algorithm + iterations into the versioned backup header.
3. **AdMob silently breaks the zero-network promise** — measurement init at launch unless `delayAppMeasurementInit: true`; `initialize()` before consent violates UMP policy in EEA/UK. Gate order: onboarding → free tier → `AdsConsent.gatherConsent()` → `canRequestAds` → `setRequestConfig` (G-rating, before init) → `initialize()`. Never mount a `<BannerAd>` before init. Prove it with airplane-mode + proxy boot tests.
4. **MMKV encrypted-instance boot crash loops / silent AES-128** — sync MMKV vs async, lock-state-dependent secure-store; no module-scope instantiation; explicit `encryptionType: 'AES-256'`; test reboot-before-unlock (the literal 3 a.m. scenario); design the post-reinstall entitlement recovery story (MMKV is gone; IAP restore is the source of truth — consider embedding entitlements in the backup envelope).
5. **SQLite WAL + non-exclusive transactions = silent data loss** — never copy the raw `.sqlite` file for backups (recent commits live in `-wal`); export via `db.serializeAsync()`, import inside `withExclusiveTransactionAsync` with all statements on `txn`; async APIs on hot paths; prepared statements only.
6. **Ads on New Architecture have live gaps** — Android native ads hang (#870 open), iOS rewarded auto-dismiss freezes devices (#859); ship Banner first, real-device test Rewarded dismissal, re-check #870 at ads-phase start, pin the library version.

Plus: NativeWind v4 setup traps (Tailwind v3 pinned, exact babel/metro wiring, `nativewind-env.d.ts` naming, dark-only via `userInterfaceStyle: "dark"` + boot-time `colorScheme.set('dark')`, `cssInterop` on every `core/ui` component); React Compiler stays OFF until the hardening phase; AdMob ID hygiene (TestIds per EAS profile, Proguard consent-SDK keep rule at scaffold time, never put real IDs in committed env).

## Implications for Roadmap

Based on combined research, a 7-phase vertical-slice structure (mirrors the dependency-driven build order validated in ARCHITECTURE.md; each phase ends with a user-visible, offline-verifiable capability):

### Phase 1: Foundation & Scaffold
**Rationale:** Everything else compiles against these seams, and the whole native stack is Expo-Go-incompatible — dev builds must exist before any feature work. Pitfalls research maps 6 of its prevention items here.
**Delivers:** EAS dev profile + dev build on test devices; NativeWind 4.2.6/Tailwind 3.4.19 pinned with babel/metro/global.css/nativewind-env.d.ts wired and a styled smoke screen; dark-only tokens (`userInterfaceStyle: "dark"`, Nocturne palette, no `dark:` variants); ESLint flat config with `no-restricted-imports` guards + Prettier; Vitest + better-sqlite3 harness; `DbAdapter` interface + both implementations; m001 migration runner; `bootstrap()` + splash gate + `Stack.Protected` with empty `(setup)`/`(tabs)`; AdMob plugin props (`delayAppMeasurementInit: true`), env-layered ad IDs, Proguard consent rule; template dirs deleted; `noUncheckedIndexedAccess`; **reactCompiler OFF**.
**Addresses:** Onboarding-adjacent scaffolding; all stack installation from STACK.md.
**Avoids:** Pitfalls 2 (Expo Go), 4/7 (ads config), 8 (NativeWind), 9 (compiler).

### Phase 2: Secure Data Layer
**Rationale:** Master-key plumbing, MMKV init semantics, and the crypto perf envelope are prerequisites for onboarding (encrypted baby profile) and for every later phase's storage; the crypto benchmark must land before backup design is frozen.
**Delivers:** `core/storage/init.ts` (async master-key get-or-create → MMKV instances, explicit AES-256, no module-scope instantiation, reboot-before-unlock handling); expo-sqlite open + PRAGMAs + schema_version migrator; Zod-validating zustand↔MMKV adapter; crypto wrapper (`core/utils/crypto.ts`) + **week-1 on-device PBKDF2/AES benchmark report vs the 2 s/10 MB budget** (escalate `@noble/hashes` swap if it fails); SQLCipher adopt/skip decision (one-line plugin, defense-in-depth).
**Addresses:** Storage/security constraints from PROJECT.md; SweetSpot/backup prerequisites.
**Avoids:** Pitfalls 1 (crypto), 3 (MMKV boot), 5 (transactions/WAL).

### Phase 3: Onboarding Vertical Slice
**Rationale:** First user-visible capability; proves the protected-route boot flow end-to-end and produces the `onboarding:completed` flag that every monetization gate depends on.
**Delivers:** < 45 s onboarding flow (profile, disclaimer checkbox, zero permissions), `babyProfileRepository` with PII encrypted via AES before SQLite write, `settingsStore`, routing gate verified in both directions, offline restart safety.
**Addresses:** Onboarding requirement; Features dependency chain root.
**Avoids:** Pitfall 3 verification (reboot test as acceptance criteria).

### Phase 4: Tracking Core (the 3 a.m. loop)
**Rationale:** The product's reason to exist; depends only on Phases 2–3. Fastest loop + crash survival is the North Star (Daily Active Taps).
**Delivers:** `sessionRepository` + `trackingService` + `useTracking`/`useTimeline`; crash-surviving `timerStore` (MMKV persist, strict `partialize`, resume/discard after process death); Track screen (breast side + switch, bottle ml, 4 diaper chips, haptics < 16 ms); 7-day Timeline; edit/backdate/delete with explicit acceptance criteria; daily totals aggregates (single service reused later by the PDF).
**Addresses:** MVP Feature 1 + table-stakes editing.
**Avoids:** Pitfall 5 (async APIs, indexed 7-day queries, EXPLAIN QUERY PLAN < 16 ms).

### Phase 5: Stats, SweetSpot, Pediatrician PDF
**Rationale:** Differentiators become visible; all three consume the Phase 4 aggregates/schema. Premium gate ships as a flag-only stub here (entitlements live in Phase 7) so the gating plumbing is testable early.
**Delivers:** `aggregateDaily` service; pure EMA `predictionService` (< 1 ms, 90% test coverage via DI) + day-3 free teaser UI; `reportRepository` + `pdfService` (base64-inlined logo + Plus Jakarta Sans, CSS `@page` portrait, disclaimer header, 1-free-per-7-days quota).
**Addresses:** MVP Features 3 + 4.
**Avoids:** expo-print iOS gotchas (PITFALLS integration table).

### Phase 6: Encrypted Backup
**Rationale:** The data-safety promise must be kept before monetization arrives (ethical rule: data never hostage); depends on schema + crypto decisions from Phases 2–4.
**Delivers:** `serializeAsync`-based export, chunked + yielding AES-256 pipeline with determinate progress + cancel, `BackupSchemaV1` (Zod, versioned header with algorithm + iterations + salt), transactional import via exclusive transaction, J30 local notification reminder (permission requested only at activation), **round-trip export→wipe→import device test as acceptance criteria**.
**Addresses:** MVP Feature 5; prerequisite for V1.1 QR sync (deltas ride the same crypto + tombstone stack).
**Avoids:** Pitfalls 1 (chunked crypto) and 5 (WAL-safe export).

### Phase 7: Monetization, Compliance & Hardening
**Rationale:** Store submission is the exit criterion; IAP/ads init must be deferred until after onboarding exists (Phase 3) and are the highest external-integration risk, so they come last among product features — with the IAP library decision resolved first (see Gaps).
**Delivers:** IAP paywall + entitlements in encrypted MMKV + offline restore story ("restore completes when online" state; entitlement recovery after reinstall); deferred ads init + UMP consent flow (EEA debug-geography test) + diurnal ad rules (Banner → Rewarded → Native sequencing with #870 re-check); i18n extraction × 5 locales; local analytics/error-log sweep; React Compiler enablement (healthcheck + ESLint gate); perf budget verification (boot < 2 s, query < 16 ms); airplane-mode + proxy boot purity tests; EAS prod profile audit; "looks done but isn't" checklist sweep.
**Addresses:** Monetization + compliance requirements; MVP completion for store submission.
**Avoids:** Pitfalls 4, 6, 7; UX pitfalls (no ads post-onboarding screen, permission timing).

### Phase Ordering Rationale

- **Dependency-driven:** features gates → onboarding flag → tracking schema → aggregates (Stats/PDF/SweetSpot) → backup (needs schema + crypto) → monetization (needs onboarding + stable app) → compliance polish.
- **Risk-retirement-first:** the two potentially project-altering unknowns — crypto performance (Phase 2 benchmark) and the IAP library choice (Phase 7 decision, researched early) — are surfaced early enough to change course cheaply.
- **Pitfall mapping:** scaffold-phase pitfalls (Expo Go, NativeWind, ads config, compiler) are all Phase 1 blockers; data pitfalls cluster in Phases 2/4/6; integration pitfalls cluster in Phase 7 where their verification tests live.
- **Every phase ends offline-verifiable**, keeping the core product promise continuously testable rather than audited once at the end.

### Research Flags

Phases likely needing deeper research during planning (`/gsd:plan-phase --research-phase`):
- **Phase 7 (Monetization):** IAP library decision (expo-iap vs react-native-iap — see Gaps), purchase/restore flows on real devices (Play internal-testing track, StoreKit 2 sandbox), UMP consent edge cases, New-Arch ad format status (#870 re-check at phase start).
- **Phase 6 (Backup):** crypto benchmark spike is mandatory before finalizing the pipeline; possible `@noble/hashes` swap is a spec-level decision to raise with the orchestrator.
- **Phase 2 (Secure Data Layer):** light research — MMKV v4 `createMMKV` + secure-store plumbing has no official helper (DIY, easy to get wrong); reboot-before-unlock handling pattern.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** all configs are already written verbatim in STACK.md — execute, then smoke-test.
- **Phases 3–5 (Onboarding, Tracking, Stats/SweetSpot/PDF):** well-documented Expo Router/zustand/expo-print patterns; the architecture and SQL are fully specified in docs/04–05 and validated by research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified against `bundledNativeModules.json`, npm tarballs/peers, and docs.expo.dev/versions/v57.0.0. Residual MEDIUM: NativeWind 4.2.6 × SDK 57 Metro/RN 0.86.3 has no explicit compatibility statement (4.2.6 targets Metro SDK 55/56-era) — smoke-test at scaffold. IAP library choice contested (see Gaps). |
| Features | MEDIUM | Competitor feature sets verified against live official vendor pages (vendor-authored claims). User-complaint patterns are LOW confidence (search rate-limited; consistent with docs/01) — re-verify before using any single complaint in marketing copy. |
| Architecture | HIGH | Layering validated against actual package tarballs (expo-sqlite, MMKV, ads, IAP) and official SDK 57 + Router docs. All five spec corrections are evidence-backed. |
| Pitfalls | MEDIUM | From official versioned docs, npm metadata, and issue trackers (specific issue numbers cited). Exact PBKDF2/AES timings on Hermes are LOW confidence — no reliable published benchmark exists; the Phase 2 on-device spike is the authoritative source. |

**Overall confidence:** MEDIUM-HIGH — execution-ready on stack and architecture; three decision gaps below need resolution during planning.

### Gaps to Address

- **IAP library conflict (decide before Phase 7 planning; affects PROJECT.md constraint):** STACK.md keeps the spec's react-native-iap 16.6.0 ("spec decision stands"); ARCHITECTURE.md's tarball inspection found react-native-iap's own README states Expo Go **and Expo Dev Client** are unsupported and directs Expo projects to **expo-iap 5.6.0** (Expo-only peers, ships `withIAP` config plugin, same OpenIAP core, hook API). Recommendation: switch to expo-iap (official Expo support path, migration contained inside `core/billing`), but this amends a PROJECT.md constraint — needs explicit orchestrator sign-off.
- **crypto-js performance on Hermes (decide in Phase 2):** PBKDF2-100k / AES-256 on 10 MB may miss the < 2 s budget by seconds. Mitigation (one-time key derivation + chunking) is designed in; if the mandated benchmark still fails, swapping the KDF to `@noble/hashes` (pure JS, audited, maintained) requires a spec-addendum-level decision — raise it, don't swap silently.
- **NativeWind 4.2.6 × SDK 57 × React Compiler (verify in Phase 1):** no published compatibility statement for RN 0.86.3; compiler interaction has one open dev-only issue (#1812). Fallback is cheap: disable `reactCompiler` (one line). Compiler stays off until the hardening phase regardless.
- **SQLCipher adopt/skip (decide in Phase 2):** one-line SDK 57 plugin (`useSQLCipher: true` + `PRAGMA key`) as defense-in-depth on top of column-level AES; requires a dev-build smoke test; not available in Expo Go (irrelevant — dev build already mandatory).
- **Offline entitlement recovery story (design in Phase 7):** after reinstall, encrypted MMKV entitlements are gone; restore requires network. Define the "probable-entitlement" offline state and honest messaging; consider embedding an entitlements copy in the `.babylog` envelope.
- **`WHEN_UNLOCKED_THIS_DEVICE_ONLY` vs reboot-before-unlock (Phase 2):** spec value is acceptable **iff** the boot path handles the key-unavailable window gracefully; `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` is the alternative if product prefers — discuss in planning.
- **Ad `optimizeInitialization` true/false (Phase 1 config):** STACK.md's app.json example uses `true`; ARCHITECTURE.md recommends `false` for strictest deferred-init. `delayAppMeasurementInit: true` is agreed by both; verify the optimize flag against plugin v16.5.0 docs at scaffold and pick one.
- **Pumping (G2) into MVP? (requirements decision):** LOW-complexity feed sub-type; recommend modeling the feed modality enum (nurse/bottle/pump) in the schema now regardless, so the V1.1 add needs no migration.
- **User-complaint claims (LOW confidence):** re-verify via app-store review mining before any single complaint claim is used in copy.

## Sources

### Primary (HIGH confidence)
- `node_modules/expo/bundledNativeModules.json` (SDK 57.0.22 shipped version map) — authoritative exact versions
- npm registry + direct tarball inspection — react-native-mmkv@4.3.2, react-native-iap@16.6.0, expo-iap@5.6.0, react-native-google-mobile-ads@16.5.0, nativewind@4.2.6 (peers, plugin presence, API surfaces)
- docs.expo.dev/versions/v57.0.0 — `/sdk/sqlite/` (WAL, transaction exclusivity, SQLCipher plugin), `/sdk/filesystem/` (new File/Directory/Paths API; legacy throws), `/sdk/print/`, `/sdk/sharing/`, `/sdk/notifications/`, `/sdk/securestore/`, `/sdk/splash-screen/`
- docs.expo.dev/router/reference/authentication/ — `Stack.Protected` + splash-held boot gating
- NativeWind v4 docs (nativewind.dev) — installation, dark mode, `nativewind-env.d.ts` naming warning
- react-native-mmkv, react-native-iap, react-native-google-mobile-ads (README/docs incl. UMP guide, shipped plugin `.d.ts`), better-sqlite3 api.md, zustand persist reference, brix/crypto-js README

### Secondary (MEDIUM confidence)
- Live competitor pages (fetched 2026-09-12): huckleberrycare.com (+pricing), nighp.com, glowing.com/baby, cubtale.com — feature/tier claims are vendor-authored
- Issue trackers: nativewind #1812/#1850/#1855; react-native-google-mobile-ads #870/#859/#860/#843/#853/#817/#819; crypto-js #213 — specific, dated, but subject to change before each phase starts

### Tertiary (LOW confidence — validate on device)
- PBKDF2-100k / AES-256 10 MB timings on Hermes mid-range Android (no reliable published benchmark; Phase 2 spike is authoritative)
- User-complaint patterns (subscription fatigue, sync bugs, export pain) — background-knowledge synthesis, search rate-limited on research day
- NativeWind 4.2.6 ↔ RN 0.86.3 exact compatibility — verify with the Phase 1 smoke screen

---
*Research completed: 2026-09-12*
*Ready for roadmap: yes*
