# Roadmap: BabyLog Offline

## Overview

BabyLog ships as seven vertical slices that follow the research-validated build order: the Expo-Go-incompatible native stack is stood up first (dev builds on day 1), then the secure local data layer, then end-to-end user capabilities in dependency order — onboarding, the 3 a.m. 1-tap tracking loop, the differentiators (SweetSpot prediction + pediatrician PDF), the free encrypted backup promise, and finally monetization + compliance hardening for store submission. Mode is MVP: every phase delivers one complete, user-visible capability that is verifiable offline on a real device, so the zero-network promise stays continuously testable rather than audited once at the end.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Scaffold** - Dev builds, dark-only Nocturne Glow shell, DbAdapter/boot seams and quality gates
- [ ] **Phase 2: Secure Data Layer** - m001 schema, master-key encrypted MMKV, @noble crypto wrapper with on-device benchmark
- [ ] **Phase 3: Onboarding Vertical Slice** - < 45 s accountless onboarding, encrypted baby profile, protected-route gate
- [ ] **Phase 4: Tracking Core (the 3 a.m. Loop)** - 1-tap timers + diaper chips, crash-safe timer, editable 7-day timeline
- [ ] **Phase 5: Stats, SweetSpot & Pediatrician PDF** - Local daily aggregates, EMA prediction (teaser/premium flag), local PDF export
- [ ] **Phase 6: Encrypted Backup** - Free AES-256 `.babylog` export/import, transactional restore, J30 local reminder
- [ ] **Phase 7: Monetization, Compliance & Hardening** - expo-iap paywall + entitlements, deferred ads + UMP, i18n ×5, offline boot proof

## Phase Details

### Phase 1: Foundation & Scaffold
**Goal**: The app runs on real devices from a dev build: a dark-only Nocturne Glow shell with the 4-tab route skeleton boots fully offline, and the database adapter, centralized boot pipeline, and quality gates exist for every later phase to compile against.
**Mode**: mvp
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-02, INFRA-04, INFRA-05, NIGHT-01, NIGHT-04
**Success Criteria** (what must be TRUE):
  1. A development build (EAS profiles development/preview/production) installs and launches on a physical iOS/Android device — Expo Go is never required at any point
  2. The app cold-boots in airplane mode into the dark-only Nocturne Glow shell (zero pure `#FFFFFF` on screen) with the 4-tab skeleton (Journal, Tracker, Stats, Paramètres) and the `+not-found` route reachable
  3. SQLite opens through the `DbAdapter` on device while Vitest runs the same repositories against better-sqlite3 in-memory; the migration runner reports and advances `schema_version`
  4. A styled smoke screen renders Nocturne Glow tokens and the bundled Plus Jakarta Sans through the `core/ui` design system
  5. TypeScript strict (`noUncheckedIndexedAccess`), ESLint flat config with `no-restricted-imports` guards (no SQL outside repositories, no billing/ads imports outside `core/`) and Prettier pass with zero warnings; the boot pipeline (migrations → MMKV → stores → routes) executes on startup
**Plans**: TBD
**UI hint**: yes

### Phase 2: Secure Data Layer
**Goal**: All persistence foundations are real and safe: the complete m001 schema exists, the master-key-protected encrypted MMKV boots without crash loops, and the @noble crypto wrapper is benchmarked on-device against the < 2 s / 10 MB backup budget — so every later feature can read and write securely.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: INFRA-01, INFRA-03, INFRA-06, TRACK-08
**Success Criteria** (what must be TRUE):
  1. Migration m001 creates the complete schema (singular snake_case tables, TEXT uuid IDs, epoch-ms UTC dates, `created_at`/`updated_at` triggers, required indexes, feed-modality enum nurse/bottle/pump) and re-running it is a no-op
  2. A master key is created in Keychain/Keystore on first run; the explicitly AES-256 MMKV instance plus standard instances read and write correctly, including after a reboot-before-unlock
  3. Zustand stores persist through the Zod-validating MMKV adapter with strict `partialize`
  4. The crypto wrapper performs AEAD 256-bit encrypt/decrypt via the @noble ecosystem (pure JS) and an on-device benchmark report states PBKDF2 + AES timings versus the < 2 s / 10 MB budget
  5. All SQL access flows through typed repositories over `DbAdapter`; a lint/CI guard confirms zero SQL outside `repository/` and `core/database/`
**Plans**: TBD

### Phase 3: Onboarding Vertical Slice
**Goal**: A new parent goes from first launch to a personalized, protected app in under 45 seconds — no account, no permission, fully offline — with the baby's name encrypted before it ever touches SQLite.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05
**Success Criteria** (what must be TRUE):
  1. A new user completes onboarding (auto-focused baby name, native date picker, optional time and weight, blocking non-medical disclaimer checkbox) in < 45 s with zero accounts and zero permission prompts
  2. The baby's first name is AES-256-encrypted before the SQLite write and the UI displays the « Chiffré localement » badge
  3. Before completion the tabs group is unreachable (route guard redirects to onboarding); after completion, force-quit and relaunch lands directly in the tabs — verified in both directions
  4. Killing and relaunching the app in airplane mode restores the profile with zero network calls before `onboarding_completed`
  5. The non-medical disclaimer can be re-opened from the (minimal) Paramètres screen
**Plans**: TBD
**UI hint**: yes

### Phase 4: Tracking Core (the 3 a.m. Loop)
**Goal**: At 3 a.m. a parent logs any feed, sleep, or diaper in ≤ 2 taps with native haptic feedback and zero glare; the running timer survives any crash, and the last 7 days stay reviewable and correctable.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07, TRACK-09, NIGHT-02, NIGHT-03
**Success Criteria** (what must be TRUE):
  1. One tap starts/stops a Feed or Sleep timer on the Track screen (native haptic on each action, toast + duration on stop) and the session is saved to the database
  2. A diaper is logged in one tap via Mouillée/Sale/Mixte/Propre chips and stored immediately — no timer
  3. Force-killing the app mid-timer and reopening restores the running timer with the correct elapsed time (MMKV `timer:` state)
  4. Breast side (gauche/droite) switches during a running feed; any past session can be edited, re-timed/backdated, or deleted via the EditSessionSheet, with notes (≤ 500 chars) encrypted before the SQLite write
  5. The Timeline shows the last 7 days grouped by day with daily totals (nb tétées/couches, heures de sommeil) and type filters; every tracking button displays « Dernière [tétée/sieste/couche] il y a X »; the running TimerButton shows ambient pulse + 48 px countdown (max 2 custom animations); haptics are toggleable in Paramètres
**Plans**: TBD
**UI hint**: yes

### Phase 5: Stats, SweetSpot & Pediatrician PDF
**Goal**: The differentiators become visible: a daily totals dashboard, a 100% local SweetSpot prediction (teased free, full behind the premium flag stub), and a shareable pediatrician PDF — all computed on-device with zero network.
**Mode**: mvp
**Depends on**: Phase 4
**Requirements**: PRED-01, PRED-02, PRED-03, PDF-01, PDF-02, PDF-03, PDF-04
**Success Criteria** (what must be TRUE):
  1. The daily dashboard shows cumuls (nb tétées/couches, heures de sommeil) computed by the shared aggregate service, with list queries < 16 ms (EXPLAIN QUERY PLAN verified)
  2. SweetSpot computes 100% locally in < 1 ms: below 3 days of data the dashboard shows « Collecte en cours… Données insuffisantes », at 3 days free users see the locked teaser, and the premium flag unlocks the full window + confidence that refreshes after each completed sleep session
  3. The user generates an A4 PDF of the last 7 days (non-medical disclaimer included, 100% local via expo-print) and opens it through the native Share Sheet (AirDrop, Fichiers, email)
  4. Free tier allows 1 export per rolling 7 days (MMKV quota); when reached, the button disables and offers the opt-in « +1 export » (max 1/7 j — the rewarded playback itself activates when ads land in Phase 7)
  5. The export button is disabled with a tooltip when the last 7 days contain no data
**Plans**: TBD
**UI hint**: yes

### Phase 6: Encrypted Backup
**Goal**: Data ownership is guaranteed: any user exports everything into an encrypted `.babylog` file and restores it on a wiped device — free forever, offline, with zero data loss.
**Mode**: mvp
**Depends on**: Phase 4 (schema + session data); crypto decisions from Phase 2
**Requirements**: BACKUP-01, BACKUP-02, BACKUP-03, BACKUP-04, BACKUP-05, BACKUP-06
**Success Criteria** (what must be TRUE):
  1. The user exports all data to a `.babylog` file encrypted with a 6-digit PIN or 8-128 char password (PBKDF2, random salt) and shares it via the native Share Sheet — never paywalled, encryption completes within the < 2 s / 10 MB budget
  2. A full round-trip device test passes: export → wipe app → import restores the profile and every session identically; import validates Zod strictly before any write, runs inside an exclusive transaction, and any failure rolls back completely leaving local data untouched
  3. A wrong code or invalid file produces the single generic message « Code incorrect ou fichier invalide » with zero information leakage
  4. Import requires an explicit confirmation of local-data overwrite before any restoration begins
  5. With the reminder enabled, no export for 30 days triggers a local notification; the POST_NOTIFICATIONS permission is requested only at the moment of activation, and the reminder is disableable
**Plans**: TBD

### Phase 7: Monetization, Compliance & Hardening
**Goal**: The app is store-ready: purchases and ads operate within the strict ethical rules, five languages ship, the full Settings hub works, and the zero-network promise plus performance budgets are proven on-device.
**Mode**: mvp
**Depends on**: Phase 6 (final phase; hard prerequisites: `onboarding:completed` flag from Phase 3, premium flag stubs from Phase 5)
**Requirements**: MONET-01, MONET-02, MONET-03, MONET-04, MONET-05, MONET-06, ADS-01, ADS-02, ADS-03, ADS-04, ADS-05, LOGS-01, LOGS-02, LOGS-03, SET-01, SET-02, SET-03
**Success Criteria** (what must be TRUE):
  1. The paywall modal compares Free/Premium with 3 store-priced offers (Lifetime as primary CTA, Annual, Monthly — prices fetched from the stores, never hard-coded; price cohort selected by local install-ID hash stored in MMKV); a test purchase writes the entitlement to encrypted MMKV usable offline immediately, and restore works from the paywall and Paramètres — including airplane mode when the entitlement exists locally
  2. Premium gating controls exactly: SweetSpot complet, historique illimité, exports PDF illimités — tracking, UI Nuit, timeline 7 j and backup stay free; the paywall never appears on first launch, during onboarding, an active timer, an input or an export; max 1 spontaneous per 7 days with a 24 h cooldown after closing and a ≥ 44 pt close button
  3. AdMob initializes only after `onboarding_completed` AND for the free tier (zero network at boot proven in airplane mode, `delayAppMeasurementInit` active); Banner/Native (Stats + Paramètres, diurnal, max 2/day each) and Rewarded opt-in (max 3/day) respect the zero-ad zones (tracking, timer actif, mode Nuit, timeline active, export PDF, backup, paywall, onboarding); UMP consent (EEA/UK) is stored locally with non-personalized fallback, `maxAdContentRating="G"`, no IDFA
  4. The app ships in en/fr/es/it/ja (auto-detected, `en` fallback, typed keys) and the full Paramètres hub works: profil bébé (lecture), thème OLED, langue, toggle haptique, toggle rappel backup, backup export/import, export données brutes, restore achats, disclaimer, licences
  5. Product events and errors are logged to local SQLite tables (`event`, `error_log`) with no PII or secrets, exportable via Share Sheet; cold start < 2 s and 100%-offline boot before `onboarding_completed` are measured on-device
**Plans**: TBD
**UI hint**: yes

## Coverage

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1 | INFRA-02, INFRA-04, INFRA-05, NIGHT-01, NIGHT-04 | 5 |
| 2 | INFRA-01, INFRA-03, INFRA-06, TRACK-08 | 4 |
| 3 | SETUP-01 … SETUP-05 | 5 |
| 4 | TRACK-01 … TRACK-07, TRACK-09, NIGHT-02, NIGHT-03 | 10 |
| 5 | PRED-01 … PRED-03, PDF-01 … PDF-04 | 7 |
| 6 | BACKUP-01 … BACKUP-06 | 6 |
| 7 | MONET-01 … MONET-06, ADS-01 … ADS-05, LOGS-01 … LOGS-03, SET-01 … SET-03 | 17 |

**Total: 54/54 v1 requirements mapped — no orphans, no duplicates.** Placement notes: NIGHT-01/NIGHT-04 (theme tokens, font) land with the scaffold's design system; TRACK-08 (pumping enum) is delivered and verified with the m001 migration in Phase 2; PDF-03's rewarded playback completes when ads arrive in Phase 7. Corrected count: REQUIREMENTS.md previously stated 45 v1 requirements; the actual count is 54.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 (parallelization disabled)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Scaffold | 0/TBD | Not started | - |
| 2. Secure Data Layer | 0/TBD | Not started | - |
| 3. Onboarding Vertical Slice | 0/TBD | Not started | - |
| 4. Tracking Core (the 3 a.m. Loop) | 0/TBD | Not started | - |
| 5. Stats, SweetSpot & Pediatrician PDF | 0/TBD | Not started | - |
| 6. Encrypted Backup | 0/TBD | Not started | - |
| 7. Monetization, Compliance & Hardening | 0/TBD | Not started | - |
