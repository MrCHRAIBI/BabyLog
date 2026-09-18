# Project Research Summary

**Project:** BabyLog — offline-first newborn tracker (iOS + Android)
**Domain:** Offline-first mobile app (React Native / Expo SDK 57, local-only data, native IAP, zero backend)
**Researched:** 2026-09-18
**Confidence:** MEDIUM-HIGH overall (Architecture HIGH, Stack MEDIUM-HIGH, Features MEDIUM, Pitfalls HIGH for store/OS policy)

## Executive Summary

BabyLog is a 100%-offline, zero-account baby tracker (one-tap feed/sleep/diaper logging, day timeline, pediatrician PDF export, encrypted local backup) monetized by a local 72-hour trial plus native IAP ($39.99/yr or $99.99 lifetime), with no server anywhere. Research confirms the settled MVP scope is launch-viable: it covers 12 of 13 verified table stakes and exceeds the market on exactly the axes parents review — night UX (dark mode is Nighp's #1 unmet request), backup privacy, a free Emergency Doctor Mode export, and monetization ethics (every major competitor has public 1-star waves over paywalls, forced AI, or data loss). The one genuine gap is caregiver sharing, which every verified competitor ships free; the recommendation is to own it honestly in positioning ("private, single-device tracker"), ship a cheap handoff screen, and accelerate the local transfer feature rather than re-open the no-cloud decision.

The imposed stack is sound on Expo SDK 57 with two mandatory corrections and two pins: (1) crypto-js is officially discontinued and its pure-JS PBKDF2 at 210k iterations freezes the JS thread for seconds — replace with react-native-quick-crypto; (2) prefer expo-iap over react-native-iap (same OpenIAP core — StoreKit 2 / Play Billing 8 — but an Expo Module with no Nitro version pinning). Pin NativeWind 4.2.x to tailwindcss ^3.4.17 (never Tailwind 4, never NativeWind v5 pre-release), and write all file code against expo-file-system's new File/Directory/Paths API (the legacy import throws at runtime on SDK 57). The architecture is a strictly layered local-first design (thin screens → hooks → pure injectable services → SQL-only repositories) where the offline guarantee holds by construction: the only network code is IAP, invoked on explicit user action.

The dominant risks are operational, not architectural. Android auto-backup can silently restore an undecryptable/corrupt data store after a phone migration (disable `allowBackup`); new Google Play personal accounts are locked out of production until 12 testers run a closed test for 14 consecutive days (a 3–4+ week slip if discovered late — start the release track in parallel at the first preview build); Play Billing 8 is mandatory by Aug 31, 2026 and Apple 3.1.2 has mechanical paywall requirements; and a handful of spec-interaction bugs (a forgotten >24h timer hitting a schema CHECK constraint, the midnight-crossing night window, trial clock rollback) destroy trust at 3 a.m. if untested. Every one has a cheap, known prevention that should be assigned to a specific phase.

## Key Findings

### Recommended Stack

The imposed stack validates on SDK 57 with the corrections above. EAS dev builds are mandatory from day one — MMKV, quick-crypto, and IAP are native modules; Expo Go cannot load them.

**Core technologies:**
- Expo SDK 57 (~57.0.24) / RN 0.86.3 / React 19.2.3 — installed scaffold already matches; New Architecture only; never bump RN independently of the SDK
- expo-sqlite — local relational store; WAL + foreign_keys PRAGMAs, `withExclusiveTransactionAsync` for timer completion and restore; SDK has no migrations API, so the spec's `schema_version` table *is* the migration runner
- react-native-mmkv ^4.3.2 (+ nitro-modules) — settings/trial (standard instance) + entitlements (encrypted instance, key in expo-secure-store); Zustand persist via a tiny MMKV adapter, `partialize` to whitelist keys
- expo-iap ^5.6.2 (recommended) or react-native-iap ^16.6.1 — same OpenIAP core; if docs/04 is kept literally on react-native-iap, pin nitro ~0.36.5 + kotlin 2.2.0 and smoke-test purchases early
- react-native-quick-crypto ^1.1.7 — REPLACES crypto-js for backup encryption (AES-256-CBC, PBKDF2, HMAC at native speed)
- nativewind ^4.2.7 + tailwindcss ^3.4.17 — styling; NativeWind v5 is pre-release, do not adopt
- expo-print + expo-sharing — local HTML→PDF; inline base64 assets only (iOS WKWebView cannot load local file URLs)
- expo-file-system ~57 (new `File`/`Directory`/`Paths` API), expo-secure-store (keys/flags only, ~2KB cap), expo-crypto (all randomness — never `crypto-js.randomWords`, CVE-2026-71851)
- zod ^4.6.5 + react-hook-form/@hookform/resolvers ^5; i18next 26 + react-i18next 17 (static JSON import only — no http-backend); dayjs; expo-build-properties (iOS 16.0 target, Android minSdk 33 — product decision to confirm)
- vitest 5 + @testing-library/react-native 14 — services/repositories run in Vitest with injected fakes (the seam behind the 80% coverage target)

**Never use:** crypto-js, Tailwind 4 with NativeWind 4, NativeWind v5, expo-in-app-purchases (deprecated), RevenueCat (violates zero-cloud), i18next-http-backend (network at boot), legacy expo-file-system import, AsyncStorage for critical data, moment.js, any cloud/analytics/crash SDK.

### Expected Features

**Must have (table stakes — launch set, validated against 10+ competitors):**
- F01 one-tap feed/sleep/diaper logging + kill-safe persistent timer (SQLite timestamp, derived elapsed)
- F02 auto night mode 20:00–07:00 + OLED — competitors' #1 unmet request; never paywall it
- F03 day timeline + automatic daily totals
- F04 edit/delete/undo + backdating with seconds precision, mixed pee+poo diaper, mL/oz units by locale, notes attachable to any event (market-verified spec details — fold in, no scope change)
- F05 zero-account minimal profile; first log reachable <30s from install
- F08 Emergency Doctor Mode 24/48h export — free for all (differentiator + ethical shield)
- F09 free encrypted backup/restore — unique in category; big trust signal
- F07 pediatrician PDF 7/14d (premium) — same pipeline as F08, built once
- 72h local trial → graceful downgrade (history >24h hidden but kept forever); working Restore purchases is a launch-blocking acceptance test

**Should have (post-v1, priority order):**
- F10 co-parent local transfer — the single biggest table-stakes gap (every competitor ships sync free); accelerate from Release 2 if capacity allows
- F14 handoff/relais screen — cheap softener for the no-sync gap, reads existing data
- F13 nursing side + pumped-mL; growth measurements lite; DE/JA/AR localization (archi already ready)

**Defer (v2+/backlog):** sleep-window estimation (F06), multi-period stats (F15), notifications/dream feed (F11/F12), solids/meds/multi-baby (F16–F18), widgets/Watch (native work — likely never per constraints), milestones.

**Anti-features (validated by competitor failures — as valuable as the feature list):** no forced AI (Nighp's Sept 2026 backlash), no paywalling comfort/UX basics (Huckleberry's top anger source), no ads/banners anywhere, no data hostage (free tier hides >24h but never deletes), no cloud sync, no medical interpretation (regulatory), no community/content (scope explosion).

### Architecture Approach

A strictly layered local-first architecture validated against docs/04/05: thin Expo Router screens → hooks/Zustand stores → pure injectable services → repositories (the only SQL) → SQLite/MMKV/SecureStore. The offline guarantee is structural — network exists only inside `iapService` on explicit user action; "0 network calls at boot" holds by construction. SQLite is the single domain truth; MMKV holds config + entitlements (never SQLite); the two meet only in the backup envelope (7 whitelisted MMKV keys, entitlements excluded, never restored). Long-running state (timer, trial) is timestamp-derived — persist `started_at`, derive elapsed on read, `setInterval` drives pixels only. Entitlement gating is a query-parameter choice at the hook layer (`sinceMs` window), never SQL filtering or JS post-filtering — so a purchase reveals existing history with zero migration.

**Major components:**
1. `core/database` — DB client, PRAGMAs, schema_version migration runner + m001
2. Six repositories — all SQL, Zod-validated writes, keyset pagination, exclusive transactions (docs/05 §8 verbatim)
3. `trialService` / `entitlementService` — pure predicates; entitlements never read from SQLite; backup never restores them
4. Export/backup pipeline — pure builders (HTML, envelope v1) + thin platform sinks; restore = HMAC verify → decrypt → strict Zod → confirm → one exclusive transaction with rollback
5. `iapService` — the only network code, behind a narrow swappable port
6. `errorLogger` + ErrorBoundary + local `event` table — offline diagnostics without a crash SDK

### Critical Pitfalls

1. **Android auto-backup restores undecryptable/corrupt state** — `allowBackup` defaults true; Keystore keys never migrate (encrypted MMKV becomes unreadable; a payer appears Free) and WAL snapshots can restore inconsistent. Set `android.allowBackup=false` in config; audit iOS iCloud backup inclusion; test a real device migration.
2. **Google Play production gate** — new personal accounts need 12 testers opted in for 14 consecutive days, then a ~7-day production application review. Start the closed-testing track at the first preview build as a parallel release workstream; decide personal-vs-organization (D-U-N-S) account now; consider iOS-first launch.
3. **Store billing compliance** — Play Billing 8+ mandatory for updates by Aug 31, 2026 (a Billing 9 deadline lands in 2027): pin the IAP dependency exactly. Apple requires a functional Restore button, in-app privacy + EULA links, and pre-purchase price/duration disclosures (3.1.1/3.1.2/5.1.1). Acknowledge Play purchases immediately or they auto-refund after 3 days.
4. **Spec-interaction data-loss bugs** — a forgotten >24h timer hits the `duration_ms <= 86400000` CHECK and the transaction rolls back the log (clamp at the service layer + explicit UX); night window 20:00–07:00 crosses midnight (wrap comparison, not `start <= now <= end`); day summaries break on DST (local `startOf('day')` at query time; durations stay in epoch ms).
5. **Trial/entitlement trust failures** — naive trial diff is reset by reinstall (Android; iOS Keychain persists — asymmetric) or clock rollback (add a `last_seen_at` high-water mark + a pure 6-state precedence function); a payer after device migration opens as Free (treat local entitlements as a cache with a Restore rebuild path and a non-blocking banner). Gating regressions read as "data hostage" reviews: one `getVisibleWindow` function plus an automated conformance suite (feature × tier × offline-grace).

Also load-bearing: backup format versioning policy + PBKDF2 device benchmark are entry criteria for the backup phase; PDF must use a theme-independent stylesheet with dark-mode/FR-locale Android QA; privacy declarations (Play Data safety is mandatory even for zero-collection apps) must match a dependency audit.

## Implications for Roadmap

Based on research, suggested phase structure — this matches the dependency-driven build order from ARCHITECTURE.md and the pitfall-to-phase mapping from PITFALLS.md:

### Phase 1: Foundation & Data Layer
**Rationale:** the leaf of the dependency graph — everything else builds on it, and the stack corrections must land before any code depends on the wrong library.
**Delivers:** Expo SDK 57 scaffold with NativeWind wired (babel/metro/tailwind 3.4), DB client + PRAGMAs + migration runner + m001, all six repositories + Zod schemas with an in-memory-SQLite Vitest harness, MMKV instances + SecureStore + Zustand adapter, error logging, i18n boot (en/fr skeletons), `android.allowBackup=false` + expo-build-properties.
**Addresses:** stack corrections (quick-crypto swap, IAP library choice, file-system new API)
**Avoids:** Pitfall 1 (config part); establishes the seams that structurally prevent the anti-patterns (SQL only in repositories, services injectable)

### Phase 2: Core Tracking Slice (offline, ungated)
**Rationale:** first end-to-end data flow — the product is genuinely usable and testable before any monetization exists.
**Delivers:** F05 profile creation, F01 one-tap logging + kill-safe persistent timer (timestamp-derived, atomic completion transaction), F03 timeline + daily totals, F04 edit/delete/undo with backdating and seconds precision.
**Addresses:** F01, F03, F04, F05 + folded spec details (mixed diaper, units, notes-on-event)
**Avoids:** Pitfall 4 (24h timer clamp + boundary tests at 23:59/24:00:01/days), Pitfall 10 (day-boundary correctness, keyset pagination discipline)

### Phase 3: 3am Experience (night mode, settings, i18n)
**Rationale:** pure presentation over the working core; this is the designed use case and the category's top unmet request.
**Delivers:** F02 auto night mode 20:00–07:00 with midnight-wrap logic, OLED palette, settings store (MMKV persist), complete EN/FR strings, dayjs locales.
**Addresses:** F02
**Avoids:** Pitfall 10 (wrap unit tests for minutes 0/419/420/1199/1200/1439; DST fixtures for Paris/New York/Tokyo)

### Phase 4: Trial, Entitlements & Free-Tier Gating (pure core)
**Rationale:** the gate is a layer applied over working features, never baked in; pure services are 100% branch-testable offline before any SDK or store account exists.
**Delivers:** `trialService` + `entitlementService` (pure, with clock-tamper guard and 6-state precedence tests), `useEntitlements`/`usePremiumGate` wired into existing screens, free 24h window via `sinceMs` query parameter, paywall UI shell (no store yet).
**Addresses:** trial + free-tier graceful downgrade behavior
**Avoids:** Pitfall 5 (clock rollback, reinstall asymmetry), Pitfall 6 (single `getVisibleWindow`; conformance suite started here)

### Phase 5: Billing Integration (IAP)
**Rationale:** the only external-sandbox risk, deferred until the gate exists so store testing exercises real flows; the only phase where network code appears.
**Delivers:** expo-iap integration, paywall with store-provided localized prices + Restore + privacy/terms links, purchase/restore flows with immediate acknowledgment/finish, entitlements written to encrypted MMKV, offline-grace + payer-recovery banner, sandbox device tests via EAS builds.
**Addresses:** IAP $39.99/yr + $99.99 lifetime + Restore purchases
**Avoids:** Pitfall 3 (Billing 8 pin, Apple 3.1.2 paywall checklist, 3-day auto-refund), Pitfall 7 (migration recovery path)

### Phase 6: Exports & Encrypted Backup
**Rationale:** depends only on repositories + pure transforms; the free Emergency export precedes and shares one pipeline with the premium pediatrician PDF; backup reuses the same crypto stack.
**Delivers:** F08 Emergency Doctor Mode (free, 24/48h) first, F07 pediatrician PDF 7/14d (premium), F09 encrypted backup export/import (envelope v1, documented version contract, HMAC→decrypt→Zod→confirm→exclusive transaction with rollback), low-end-device PBKDF2 benchmark.
**Addresses:** F08, F07, F09
**Avoids:** Pitfall 8 (forward-compat version policy + KDF freeze), Pitfall 9 (theme-independent PDF stylesheet; dark-mode Android QA)

### Phase 7: Hardening, Analytics & Store Submission
**Rationale:** instruments flows that already exist; store paperwork and conformance verification are release gates, not afterthoughts.
**Delivers:** analytics allowlist + manual export, entitlement conformance suite green, dependency audit (zero network-capable SDKs), privacy policy URL + Play Data safety + Apple label from one data-flow inventory, "Looks Done But Isn't" checklist executed, production builds.
**Addresses:** release readiness for both stores
**Avoids:** Pitfall 11 (declaration accuracy), final verification of Pitfalls 1/3

### Phase Ordering Rationale

- Phases 1→4 deliver a complete, shippable offline product before any network code exists. The gate is additive by design, so monetization never forces a rewrite of the core.
- Billing (5) is separated from gating (4) because it carries the only external-sandbox risk and requires device builds + store accounts; export/backup (6) can start any time after Phase 2 but benefits from gated screens for testing the premium window.
- A parallel release-track workstream (Play closed testing: 12 testers × 14 consecutive days, then production application) must start at the first preview build — around Phase 5. It is calendar time, not code, and cannot be compressed; if it threatens the launch date, ship iOS first.
- Each phase owns its pitfall preventions per PITFALLS.md's pitfall-to-phase mapping, so verification criteria are defined before implementation.

### Research Flags

Phases likely needing deeper research during planning (`/gsd:plan-phase --research-phase`):
- **Phase 5 (Billing):** expo-iap API specifics, StoreKit 2 sandbox behaviors, Play offer tokens/acknowledgment — live store integration against a library that moved to the OpenIAP monorepo; pitfalls research flagged library-behavior items as build-phase-verify
- **Phase 6 (Backup/crypto/exports):** quick-crypto API details, PBKDF2 performance budget on low-end devices, expo-print platform quirks (dark mode, fonts, pagination — flagged MEDIUM/LOW, not independently verified)
- **Phase 7 (Store submission):** checklists are documented in PITFALLS.md, but the Play closed-testing questionnaire, Data safety form, and Apple nutrition-label flows deserve a light research pass

Phases with standard patterns (skip research-phase):
- **Phases 1–4:** well-documented, established Expo/SQLite/MMKV/Zustand patterns; specs docs/04/05 are authoritative and architecture research validated them against official SDK 57 docs
- **Phase 3:** trivial presentation logic with a clear test strategy

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Versions verified against npm registry, official SDK 57 docs, and first-party artifacts in local `node_modules`; quick-crypto fit is MEDIUM until device-verified |
| Features | MEDIUM | Competitor feature sets verified via iTunes API + review feeds across 4 storefronts; generic market claims and privacy-practice angles are LOW (WebSearch quota exhausted; Reddit/Mozilla blocked 403) |
| Architecture | HIGH | Validated against authoritative specs (docs/04/05) and official SDK 57 docs; layering confirmed, not redesigned |
| Pitfalls | HIGH | Store-policy and OS-backup pitfalls verified against official Apple/Google docs; library-behavior items MEDIUM, explicitly flagged for build-phase verification |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **docs/04 deviations need explicit sign-off:** crypto-js → quick-crypto and (recommended) react-native-iap → expo-iap contradict the imposed spec. Confirm at requirements/roadmap time — the IAP choice also determines Nitro pinning and the Phase 1 install list.
- **iOS iCloud backup stance:** the SQLite DB and MMKV are included in iCloud backups by default and Expo exposes no exclusion key. Decide: accept + soften marketing copy ("only your own encrypted OS backups") or write a small config plugin. Blocks Phase 1 config and marketing wording.
- **Play account type:** personal (12-tester × 14-day gate) vs organization (D-U-N-S, days-to-weeks to obtain) — decide at roadmap time; it sets the launch critical path.
- **Android minSdk 33:** valid above the RN floor (24) but cuts Android 12-and-below reach — explicit product confirmation required.
- **Caregiver-sync positioning:** store-listing wording and F10 timing (accelerate to Release 1.5?) — product decision to be informed by early reviews; monitor for "can't share with partner" as the expected top churn driver.
- **PBKDF2 iterations (docs' 210k vs OWASP's 600k) and the <2s backup budget:** benchmark on a real low-end device in Phase 6 before writing the encryption service.
- **expo-print rendering behaviors** (dark mode, fonts, pagination): community-canonical, not independently verified this session — verify on-device in Phase 6.
- **MMKV v4 API vs specs written against v3:** instance-per-namespace design unchanged, but `new MMKV()` became `createMMKV({id, encryptionKey})` — handle in Phase 1.

## Sources

### Primary (HIGH confidence)
- Local SDK 57 artifacts — `node_modules/expo/bundledNativeModules.json`, RN 0.86.3 sources, scaffold `package.json` (exact version pins, iOS 15.1 floor)
- Expo SDK 57 official docs (docs.expo.dev/versions/v57.0.0) — sqlite, file-system (new API default), print, localization, IAP guide
- Apple App Review Guidelines (3.1.1, 3.1.2, 5.1.1); Android Auto Backup guide; Play Billing release notes (Billing 8 deadline); Play Console closed-testing requirements; Play Data safety form
- crypto-js README ("discontinued / no longer maintained") + CVE-2026-71851
- Project specs docs/03–06 (authoritative, settled decisions — not re-opened)

### Secondary (MEDIUM confidence)
- npm registry metadata (fetched 2026-09-18) for all JS libraries
- iTunes Search/Lookup API + App Store review RSS feeds (US/DE/FR/JP storefronts) — competitor features, ratings, review-anger themes (Nighp, Huckleberry, Nara, Baby Connect, PiyoLog, etc.)
- Official competitor sites (glowing.com, nara.com, cubtale.com); Hacker News (Algolia) indie offline-tracker threads
- NativeWind v4 docs; react-native-iap / expo-iap READMEs (OpenIAP); react-native-mmkv README

### Tertiary (LOW confidence)
- expo-print dark-mode/font/pagination behaviors — community canon, on-device verification required
- Reddit / Mozilla Privacy Not Included privacy-practice angles — blocked (403) this session; claims rest on App Store reviews + HN instead
- Google Play feature parity with iOS — assumed, not verified

---
*Research completed: 2026-09-18*
*Ready for roadmap: yes*
