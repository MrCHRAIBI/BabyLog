# Roadmap: BabyLog

## Overview

BabyLog ships as a strictly ordered vertical MVP: first a corrected, production-grade local data foundation (stack fixes land before any code depends on them); then a complete offline tracking product that is genuinely usable with zero monetization; then the 3 a.m. experience (night mode, EN/FR); then the trial/entitlement gate as a pure layer over working features; then real money (native IAP — the only phase with network code and external sandbox risk); then data-out (free emergency export first on the same pipeline as the Premium PDF, plus free encrypted backup); and finally compliance, local analytics, and store submission. A parallel release-track workstream — Play closed testing (12 testers × 14 consecutive days) — starts at the first preview build (Phase 5) and is calendar time that cannot be compressed; it is carried in Phase 5 as a workstream note and verified in Phase 7.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Data Layer** - Corrected stack, SQLite + migrations + repositories, MMKV/SecureStore, i18n boot, cloud auto-backup excluded
- [ ] **Phase 2: Core Tracking Slice** - Offline, ungated 1-tap tracking with kill-safe timer, timeline, totals, edit/delete/undo
- [ ] **Phase 3: 3am Experience** - Auto OLED night mode 20:00–07:00, persisted settings, full EN/FR delivery
- [ ] **Phase 4: Trial, Entitlements & Free-Tier Gating** - 72h local trial, graceful Free downgrade, hidden-not-deleted history, pure offline-testable gate
- [ ] **Phase 5: Billing Integration (IAP)** - Native $39.99/yr + $99.99 lifetime purchases with Restore on both stores; Play closed-testing track starts
- [ ] **Phase 6: Exports & Encrypted Backup** - Free 24/48h emergency export, Premium 7/14d pediatrician PDF, free AES-256 backup/restore
- [ ] **Phase 7: Compliance, Analytics & Store Submission** - Disclaimers, privacy declarations, accessibility, local-only analytics, closed testing complete, both stores submitted

## Phase Details

### Phase 1: Foundation & Data Layer

**Goal**: A production-grade local-first foundation on the corrected stack: react-native-quick-crypto replaces crypto-js, expo-iap chosen over react-native-iap, expo-file-system new File/Directory API, NativeWind 4.2 + tailwindcss 3.4 pinned; SQLite client (WAL, foreign_keys) with schema_version migration runner + m001, all six repositories (SQL-only, Zod-validated, keyset pagination), MMKV standard + encrypted instances with SecureStore keys, Zustand MMKV adapter, error logger + ErrorBoundary, i18n boot, and Android cloud auto-backup excluded — zero network code anywhere.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: OPS-02
**Success Criteria** (what must be TRUE):

  1. The app installs and launches on a physical Android and iOS device from an EAS dev build with all native modules (expo-sqlite, MMKV, react-native-quick-crypto) loading — no Expo Go — and makes zero network calls at boot.
  2. The m001 schema (7 tables, 10 indexes, 6 triggers) is created through the schema_version migration runner, and all six repositories pass the Vitest in-memory-SQLite harness with Zod-validated writes and keyset pagination.
  3. The built Android artifact carries allowBackup=false and dataExtractionRules so the database and MMKV stores are excluded from OS cloud auto-backup (verified in the merged manifest).
  4. A changed setting survives app kill and relaunch via the Zustand + MMKV persistence path (standard instance for settings/trial; encrypted instance with key in SecureStore for entitlements).
  5. The app boots with i18next initialized from static EN/FR JSON with EN fallback and no network fetch at startup.
  6. The iOS build excludes babylog.db and MMKV files from iCloud backup (isExcludedFromBackup=true via config plugin), verified by container inspection on a real device.

**Plans:** 7 plans

Plans:
**Wave 1**

- [ ] 01-01-PLAN.md — Corrected stack install (D-024), scaffold purge + src/services/.gitkeep, design tokens source unique, wiring NativeWind + eas.json (D-001-ctx)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Wave 0 : harness Vitest better-sqlite3 + trois audits fail-first (isolation SQL, migrations non destructives, zéro cloud) + fixtures

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03-PLAN.md — DB spine : client SQLite + PRAGMAs + runner + m001 amendée + schémas Zod feuilles (D-042) + tests de caps

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 01-04-PLAN.md — Six repositories SQL-exclusifs (docs/05 §8) + suite de tests harness (listes vides, keyset ties, rollback)
- [ ] 01-05-PLAN.md — MMKV v4 dual-instance + SecureStore fail-hard + Zustand persist + seed D-007 + boot i18n EN/FR

**Wave 5** *(blocked on Wave 4 completion)*

- [ ] 01-06-PLAN.md — Logger + ErrorBoundary D-005/D-006 + exclusions backup OS (plugin Android OPS-02, module natif iOS + sweep)

**Wave 6** *(blocked on Wave 5 completion)*

- [ ] 01-07-PLAN.md — Walking skeleton : boot chain + écran profil réel + ACs device Android 14 et iPhone 12 (D-002/D-003-ctx)

**UI hint**: no

### Phase 2: Core Tracking Slice

**Goal**: The product is genuinely usable offline before any monetization exists: a parent creates a baby profile with no account and no permissions, logs feed/sleep/diaper/note in one tap with a kill-safe persistent timer, sees today's chronological timeline with automatic totals, and can edit, backdate, delete, and undo — completely ungated.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07, TRACK-08, TRACK-09, VIEW-01, VIEW-02, VIEW-03, EDIT-01, EDIT-02, EDIT-03, EDIT-04, PROF-01, PROF-02, LOC-02
**Success Criteria** (what must be TRUE):

  1. From a fresh install, a parent creates a baby profile (first name + birth date) in under 30 seconds with no account, no connection, and no permission prompt — and the app is fully functional in airplane mode.
  2. One tap on Sein G / Sein D starts a feeding timer; a second tap stops it and logs the feed with duration and side; a bottle logs in one tap with optional quantity in mL or oz per phone locale; a diaper logs in one tap with wet/dirty/mixed/dry; sleep start/stop logs with duration; a note can be standalone or attached to any event.
  3. An active timer survives backgrounding, force-kill, and phone restart (reopening shows correct elapsed time from the persisted SQLite timestamp); starting a new timer cleanly replaces the active one; a timer forgotten more than 24h is clamped to 24h with the feed preserved and no error.
  4. Opening the app shows today's chronological timeline (type, time, duration, details, note) with automatic daily totals for feedings, diapers, and sleep duration — rendering in under 16 ms at 200 events.
  5. A parent can edit any event's start time to the second, backdate an event to a past time, delete an event after confirmation, and undo a recent deletion.

**Plans**: TBD
**UI hint**: yes

### Phase 3: 3am Experience (Night Mode, Settings, EN/FR)

**Goal**: The designed primary use case works in the dark: the OLED night theme activates automatically on the 20:00–07:00 window (configurable off/on/auto in settings) with correct midnight-crossing and DST handling, and the app ships fully in English and French on an i18next architecture ready for de/ja/ar (RTL).
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: NIGHT-01, NIGHT-02, NIGHT-03, LOC-01
**Success Criteria** (what must be TRUE):

  1. At 20:00 the OLED dark theme activates by itself and exits at 07:00 — the parent never touches a switch during a night feed.
  2. In settings the parent chooses off / on / auto theme mode, and the choice is restored on the next launch.
  3. The night window crosses midnight correctly and handles DST changes without getting stuck (boundary fixtures at minutes 419/420/1199/1200; DST transitions for Paris, New York, Tokyo).
  4. Every screen, button label, and message renders in English and French with EN fallback, on an i18n architecture ready for de/ja/ar including RTL.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Trial, Entitlements & Free-Tier Gating

**Goal**: Monetization logic exists as a pure, fully offline-testable layer over the working product — no store SDK yet: a 72-hour local trial starts at first launch with full Premium access, expiry downgrades gracefully to Free (history >24h hidden but never deleted, 1 active profile, premium gate, export locked), entitlements live only in encrypted MMKV/SecureStore, and the Free limit is a query window rather than a data operation.
**Mode:** mvp
**Depends on**: Phase 2 (screens to gate; independent of Phase 3)
**Requirements**: PAY-01, PAY-02, PAY-03, PAY-05, PAY-06, PROF-03
**Success Criteria** (what must be TRUE):

  1. On first launch a 72-hour trial starts automatically with full Premium access — no account, no sign-in, no network.
  2. When the trial ends the app degrades gracefully: history older than 24h is hidden but intact, adding a second baby profile triggers the premium gate, and 7/14-day export is locked — nothing is ever deleted.
  3. Flipping the entitlement from Free to Premium (simulated source; real purchase verified in Phase 5) instantly reveals the entire hidden history with zero migration — the Free 24h limit is applied as a sinceMs parameter chosen by the hook/entitlement layer and passed to the repository indexed query (idx_log_event_timeline, doc 05 hot query 3) — no unindexed mass SQL, no JS post-filtering, no gate SQL outside repositories.
  4. Trial and entitlement state live only in encrypted MMKV / SecureStore (never SQLite); the OS-secure flag takes precedence over MMKV; clock rollback or reinstall cannot extend the trial beyond the 6-state precedence rules (automated conformance suite started: feature × tier × offline grace).

**Plans**: TBD
**UI hint**: yes

### Phase 5: Billing Integration (IAP)

**Goal**: Real money works: the paywall sells $39.99/year and $99.99 lifetime through native IAP (StoreKit 2 / Play Billing) on both stores, with a functional Restore Purchases, immediate acknowledgment, store-compliant disclosures, and offline grace for payers — the only phase containing network code, and the only one carrying external sandbox risk.

**Workstream note (parallel, calendar time — cannot be compressed):** the first preview build produced in this phase starts the Play closed-testing track (12 testers opted in for 14 consecutive days, then the ~7-day production review). It runs in parallel with Phases 6–7; completion is a Phase 7 success criterion. If it threatens the launch date, ship iOS first.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: PAY-04
**Success Criteria** (what must be TRUE):

  1. In sandbox, a tester purchases $39.99/year or $99.99 lifetime from the paywall via StoreKit 2 / Play Billing; the purchase is acknowledged/finished immediately and Premium unlocks without an app restart.
  2. Restore Purchases recovers a prior purchase on a fresh install or new device and instantly reveals the hidden >24h history — verified against real store products, not only the simulated Phase 4 entitlement flip.
  3. The paywall displays store-localized prices, pre-purchase price/duration disclosures, and in-app privacy + EULA links, passing the Apple 3.1.2 paywall checklist and Play Billing 8 requirements.
  4. Offline, a paying user keeps Premium (grace window), and a lapsed or device-migrated payer sees a non-blocking restore banner instead of a silent downgrade.

**Plans**: TBD
**UI hint**: yes

### Phase 6: Exports & Encrypted Backup

**Goal**: Data leaves the device only on explicit user action: the free 24/48h Emergency Doctor Mode export ships first for everyone (same pipeline), the Premium 7/14-day pediatrician PDF follows on that shared pipeline, and any user can export and restore an encrypted backup (AES-256 + PBKDF2) that is all-or-nothing.
**Mode:** mvp
**Depends on**: Phase 2 (hard); Phase 4 (soft — to test the gated Premium export); crypto stack from Phase 1
**Requirements**: EXPT-01, EXPT-02, EXPT-03, EXPT-04, BKUP-01, BKUP-02, BKUP-03, BKUP-04
**Success Criteria** (what must be TRUE):

  1. Any user — including Free post-trial — generates a 24h or 48h emergency report locally in one action and shares it through the native share sheet.
  2. A Premium user exports a 7- or 14-day pediatrician PDF generated on-device (expo-print) containing an editable "notes for the doctor" / patient-ID block, with a stylesheet independent of app theme (correct in dark mode and in the FR locale).
  3. Every export is journaled locally (file_export: kind, status, period) with no file content and no secret ever stored.
  4. Any user exports an encrypted backup file (AES-256 + PBKDF2, KDF benchmarked on a low-end device within the <2s budget) and restores it only after explicit confirmation; a mid-restore failure rolls back completely, leaving existing data untouched.
  5. A backup file from a future unknown version fails with clear guidance (documented version contract), and entitlements/trial state are never restored from a backup — the OS-secure flag always wins.

**Plans**: TBD
**UI hint**: yes

### Phase 7: Compliance, Analytics & Store Submission

**Goal**: Launch readiness: the non-medical disclaimer on every surface, privacy declarations that match the app's actual zero-collection behavior, app-wide accessibility, 100%-local analytics with manual export only, and both store submission gates cleared — including the Play closed-testing requirement carried since Phase 5.
**Mode:** mvp
**Depends on**: Phases 1–6
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, OPS-01, OPS-03
**Success Criteria** (what must be TRUE):

  1. The non-medical disclaimer ("BabyLog n'est pas un dispositif médical et ne fournit pas de conseil médical") is visible at onboarding, in both store listings, and in the footer of every exported PDF; no UI text claims diagnosis or medical prediction.
  2. A public privacy policy URL (100% local baby data, zero backend, zero third-party SDKs, zero advertising IDs) is linked from both store listings and in-app settings; Apple Privacy Labels and Play Data Safety declare zero collection and exactly match a dependency audit of the shipped build.
  3. Every tracking and timer control has a touch target of at least 44pt and VoiceOver/TalkBack labels, with contrast validated in both day and night themes.
  4. Analytics are 100% local (event table with a name allowlist): nothing is ever sent automatically, manual export produces a file, and no personal data is recorded.
  5. Play closed testing is complete (12 testers opted in for 14 consecutive days) and production builds for both stores pass their submission checklists (dependency audit, "Looks Done But Isn't" list executed).

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7
(Phase 6 depends only on Phase 2 and may be pulled forward; the Play closed-testing workstream starts at the first preview build in Phase 5 and runs in parallel.)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Layer | 0/6 | Not started | - |
| 2. Core Tracking Slice | 0/TBD | Not started | - |
| 3. 3am Experience | 0/TBD | Not started | - |
| 4. Trial, Entitlements & Free-Tier Gating | 0/TBD | Not started | - |
| 5. Billing Integration (IAP) | 0/TBD | Not started | - |
| 6. Exports & Encrypted Backup | 0/TBD | Not started | - |
| 7. Compliance, Analytics & Store Submission | 0/TBD | Not started | - |
