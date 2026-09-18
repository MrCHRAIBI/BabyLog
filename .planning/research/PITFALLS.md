# Pitfalls Research

**Domain:** Offline-first mobile app (Expo/RN) with local-only monetization (IAP, no backend), local trial, local entitlements, encrypted local backups
**Researched:** 2026-09-18
**Confidence:** HIGH for store-policy and OS-backup pitfalls (verified against official Apple/Google docs); MEDIUM for library-behavior pitfalls flagged for build-phase verification

Scope note: settled decisions from `docs/03` and `docs/05` are not re-opened. Each pitfall below is a failure mode *around* those decisions, with warning signs, prevention, and the phase that must own it.

---

## Critical Pitfalls

### Pitfall 1: Android Auto-Backup silently restores an undecryptable or corrupt data store onto a new device

**What goes wrong:**
`android:allowBackup` defaults to **true**. Google's Auto Backup ships the app's `getDatabasePath()` SQLite files, SharedPreferences, and files dir to Google Drive (25 MB app quota) and via device-to-device transfer — this includes `babylog.db` **and both MMKV instances** (react-native-mmkv stores under the app's private dir). Two failure modes follow:
1. **Undecryptable entitlements:** the MMKV `secrets:`/`billing:` encryption key lives in `expo-secure-store`, which on Android is backed by Android Keystore / EncryptedSharedPreferences. **Keystore keys never leave the device and are not backed up.** After a phone migration, the restored encrypted MMKV blobs cannot be decrypted → entitlements/trial state unreadable → a paying customer appears Free.
2. **Corrupt DB snapshot:** SQLite in WAL mode is backed up as separate `-wal`/`-shm` files at backup time; a mid-write capture or partial restore can produce a stale or inconsistent database.

**Why it happens:**
The default is opt-out, nobody tests "restore from Google device migration" during development, and docs/04 says "backup automatique interdit" without stating that Android auto-backup must be *explicitly disabled in the manifest* — intent is not configuration.

**How to avoid:**
- Disable backup in app config: set `android.allowBackup = false` (expo config supports this) — this kills both cloud backup and D2D transfer and matches the spec's "backup automatique interdit". If product ever wants D2D transfer for the *user-initiated* backup file only, instead write a `dataExtractionRules` XML with empty `<cloud-backup>` / `<device-transfer>` exclusion domains via a small custom config plugin (Android 12+; `<full-backup-content>` for older).
- Verify on a real flow: `adb shell bmgr` backup/restore round-trip or an actual device migration, checking first launch after restore (DB opens, MMKV decrypts or cleanly reinitializes).
- Same audit for iOS: MMKV (Application Support) and the SQLite DB are included in iCloud backups by default; Expo's FileSystem API exposes no `NSURLIsExcludedFromBackupKey` switch. Decide consciously: either accept OS-level encrypted backups (and soften the "data never leaves the device" marketing line to "no telemetry, no servers — only your own encrypted OS backups") or add a tiny config plugin to exclude the DB/MMKV directories.

**Warning signs:**
Any tester report of "app reset after switching phones"; `error_log` entries with MMKV decrypt/null entitlements on first launch; QA plan that only tests fresh installs.

**Phase to address:**
Data-layer/foundation phase (config plugin + manifest), verified again in the release-hardening phase.

---

### Pitfall 2: Google Play production access is locked behind the closed-testing gate (new personal accounts)

**What goes wrong:**
Play Console **personal accounts created after Nov 13, 2023** cannot access the Production track until the app has run a closed test with **at least 12 testers opted in continuously for the last 14 days**, followed by an "Apply for production" questionnaire that Google reviews (~7 days, sometimes longer). If the team assumes "build → submit → live", launch slips by **3–4+ weeks**. There is no way to pay or waive this.

**Why it happens:**
It's an account/policy constraint, invisible during development; many indie devs discover it at submission time.

**How to avoid:**
- Decide account type **now**: an organization account requires a D-U-N-S number (days-to-weeks to obtain) but skips the testing gate; a personal account starts the clock immediately.
- If personal: stand up the closed testing track as soon as a preview build exists — recruit the 12+ testers (friends/family/beta communities) and require them to *stay opted in*; then budget a week for the questionnaire review.
- Note the related recurring trap: Play periodically blocks updates that use an outdated Billing Library (see Pitfall 3) — submission-time policy checks are a category of risk, not a one-off.

**Warning signs:**
Roadmap with "Play launch" on the same date as iOS; no D-U-N-S discussion; fewer than 12 recruited testers two weeks before launch.

**Phase to address:**
Not a code phase — must appear in the roadmap as a parallel release-track workstream starting no later than the first preview build.

---

### Pitfall 3: Play Billing Library version drift → update blocked by Play; Apple subscription metadata → 3.1.2 rejection

**What goes wrong:**
Two store-policy traps around the same paywall code:
1. **Android:** all new apps and updates must use **Billing Library 8+ by Aug 31, 2026** (extension possible to Nov 1, 2026), and Billing 9.0.0 already shipped (May 2026) so a Billing 9 deadline lands in 2027. If dependency drift or an old `react-native-iap` major is pinned, the update is rejected at upload time.
2. **iOS:** auto-renewable subscription apps are rejected for missing mechanical requirements: a functional **Restore purchases** button (3.1.1), **privacy policy URL in App Store Connect metadata AND inside the app** (5.1.1(i)), the **Terms of Use (EULA) link in metadata** (Schedule 2 of the PLA), and clear pre-purchase price/duration/renewal/cancel disclosures (3.1.2(c)).

**Why it happens:**
The billing layer is built once and rarely revisited; store metadata lives outside the repo with no CI to catch drift.

**How to avoid:**
- Pin `react-native-iap` at **14.7.x+** (current releases ship Play Billing 8.x via openiap and StoreKit 2, requires iOS 15+) and add a release-checklist item to re-verify the Billing Library requirement each year (Billing 9 → expect a 2027 deadline).
- Put the four Apple requirements on the paywall itself and in the submission checklist: Restore button, in-app privacy policy link, in-app Terms link (Apple's standard EULA acceptable), price/duration/renewal/cancel text from store-provided localized strings only.
- Test both IAP flows in sandbox *on preview/production builds*, not Expo Go (neither MMKV nor IAP works in Expo Go) — StoreKit sandbox on iOS, license-tester purchases on Android.

**Warning signs:**
`package.json` with `react-native-iap` on a floating `^13` range; paywall screen without a visible Restore button in screenshots; no legal-links task in the submission phase.

**Phase to address:**
Billing/monetization phase (library pin, paywall content), re-verified in the store-submission phase.

---

### Pitfall 4: The 24h+ forgotten timer violates a schema CHECK and the feeding log is lost

**What goes wrong:**
`log_event` enforces `CHECK (duration_ms IS NULL OR duration_ms <= 86400000)`. The timer design (correctly) stores only `started_at` and computes duration at stop. If a parent starts a breast/bottle timer and forgets it for >24 h — extremely common with a sleeping newborn — stopping the timer computes `duration_ms > 86400000`, `completeTimerAndCreateEvent` **throws on the CHECK constraint**, the transaction rolls back, and the user loses the log entirely at the worst possible moment.

**Why it happens:**
The constraint and the timer service are designed in different phases; every happy-path test uses durations under an hour. The failure is a *spec-interaction* bug, invisible until real usage.

**How to avoid:**
- Clamp at the service layer, before the repository call: if elapsed > 24 h, do not attempt a plain insert — offer explicit UX ("this timer has been running 2 days — log as-is, cap at 24 h, or discard"), defaulting to a capped log with `source='timer'` so nothing is silently lost.
- Unit-test `completeTimerAndCreateEvent` with elapsed = 23:59, 24:00:01, and 8 days (crossing DST and clock changes).
- Same audit for `amount_ml` (>5000) and any other CHECK: every write path needs a guard *before* SQLite rejects.

**Warning signs:**
Timer UI that displays elapsed > 24 h with a normal "stop" button and no special case; repository tests only with realistic durations.

**Phase to address:**
Tracking/timer phase (the phase that builds `completeTimerAndCreateEvent`).

---

### Pitfall 5: Local 72 h trial clock — naive timestamp diff is trivially reset or rolled back

**What goes wrong:**
`trial_ends_at - Date.now()` breaks in three ways: (a) uninstall/reinstall wipes MMKV → fresh 72 h forever (Android: even SecureStore is wiped; iOS: Keychain survives — **asymmetric behavior** between platforms); (b) user rolls the device clock back → trial extends indefinitely or ends in the past with ugly UI; (c) clock skew/NTP corrections mid-trial produce negative remaining time.

**Why it happens:**
Offline-by-design means no trusted server time; docs/03 already accepts residual abuse ("best-effort, pas de fingerprinting") — but "accepted abuse risk" is not the same as "implemented regression guards".

**How to avoid:**
- Implement exactly the docs/03 model (`trial_claimed_local` in MMKV + `trial_claimed_secure` in SecureStore), **plus one cheap addition: a `last_seen_at` high-water mark** written on every foreground. If `now < last_seen_at - 5 min`, treat the clock as rolled back: freeze remaining time (do not extend, do not expire into a broken state) and log `trial_clock_anomaly` locally.
- On launch, check order per docs: premium entitlement > secure flag > local state; restoration from backup restores trial state, but a present OS secure flag **forces `already_used`** (docs/05 rule) — implement that precedence in a single pure function with unit tests for all 6 state combinations.
- Document the platform asymmetry (iOS Keychain persists across uninstall; Android does not) as a known, accepted limit — it is consistent with the no-fingerprinting privacy promise, and reviewers don't care.

**Warning signs:**
Trial state read scattered across screens instead of one `trialService` function; no test for "secure flag present, local state absent"; countdown that can render negative.

**Phase to address:**
Monetization phase (with the entitlement service); clock-tamper unit tests in the same phase.

---

### Pitfall 6: UI-side-only entitlement gating regresses into "data hostage" — the #1 review and review-bomb risk

**What goes wrong:**
Gating is enforced purely in hooks (`usePremiumGate`). Two directions of regression:
1. **Over-blocking:** a paywall sneaks into the emergency path (Emergency Doctor Mode >24 h free tier), tracking gets rate-limited, or the end-of-trial paywall is full-screen with no close — Apple 3.1.2(a)/5.1.1 territory ("must not take away primary functionality"; no blocking paywalls without visible exit) and the exact "données prises en otage" perception docs/03 warns sinks ratings.
2. **Leaking:** hidden >24 h history leaks through a path the gate doesn't cover — day-summary totals computed over all rows, search, export accidentally using premium ranges, stats query with wrong `sinceMs`.

**Why it happens:**
Free-tier rules live in prose (docs/03 §5.5); nothing mechanically distinguishes "hidden" from "destroyed" or "gated" from "free" once five screens each implement their own windowing.

**How to avoid:**
- Route every free-tier data access through exactly one service function (`getVisibleWindow(profileId)`) that computes `sinceMs = now - 24h` and passes it to `getRecentWindow` — never post-filter in JS, never let screens build their own windows (docs/05 hot query 3's acceptance criterion already says this: limit applied by `since` parameter, not app-side filtering).
- Write an entitlement conformance test suite as a first-class deliverable: for each premium action × {trial, free, premium, lifetime, offline-grace} assert allowed/blocked + paywall trigger, including "Emergency 24 h export succeeds in Free with zero paywall events".
- Hard rules to encode in lint/review: no paywall before first profile/log, no paywall during timer or Emergency mode, ≥1 spontaneous paywall per 7 days (query `listByNameSince('paywall_shown', ...)`), always a visible close.

**Warning signs:**
Timeline screen computing totals from an unwindowed array; Emergency export importing from the premium export feature; `history_limit_reached` firing but data still rendered.

**Phase to address:**
Monetization phase for the gate service; timeline/data phase for the windowing discipline; conformance tests written alongside each, run in release-hardening.

---

### Pitfall 7: Paying customer locked out after device migration (entitlement cache without reconciliation)

**What goes wrong:**
Entitlements live in encrypted MMKV; the encryption key lives in SecureStore/Keychain. After a phone migration (Pitfall 1's restore path or a Keychain-less Android move), a **payer** opens the app as Free. Without a server, the only recovery is Restore Purchases — which requires network and a store session. If restore fails offline (or the user never finds the button), revenue-generating users churn angry: 1-star reviews "they took my purchase", refund requests, support load with zero telemetry to debug.

**Why it happens:**
Local-first means the app optimistically trusts its cache; the failure scenario only exists *after* a device migration, which no developer tests.

**How to avoid:**
- Treat local entitlements strictly as a cache with a documented rebuild path: on launch, if `is_premium && lastStoreCheckAt` is null-or-stale (e.g. > 30 days) and network is available, silently reconcile via `getAvailablePurchases` (StoreKit 2 `currentEntitlements` / Play `queryPurchasesAsync`); use `offline_grace_flag` per docs for the offline case.
- Detect the "payer in Free body" state (purchase history shows an entitlement but local says free) and show a non-blocking "Restore your purchase" banner for N days rather than a paywall.
- Make Restore reachable from Settings and every paywall, functional without trial interaction (premium > trial per docs).
- For expired annual subscriptions: StoreKit 2 exposes `expirationDate` locally; on expiry downgrade gracefully — never lock the user out mid-session; queue the downgrade for next launch.

**Warning signs:**
`lastStoreCheckAt` written but never read; no migration-device test in QA plan; restore button only on the paywall.

**Phase to address:**
Billing/monetization phase; migration/restore scenario added to release-hardening test plan.

---

### Pitfall 8: Encrypted backup format — forward incompatibility and a multi-second JS-thread freeze

**What goes wrong:**
Three compounding issues in F09:
1. **Strict Zod (`z.object(...).strict()` + `z.literal(1)`) rejects every future file**: a backup exported by v1.1 with one additive field, or any `format_version: 2` file, fails import into the current app with a cryptic validation error. A user who upgraded, backed up, then restored onto another device running the old version loses everything with no explanation.
2. **PBKDF2-SHA256 @ 210,000 iterations in crypto-js is pure JS on the JS thread** — realistically 1–6 s of frozen UI on mid-range Android, twice (HMAC + key derivation) with no worklets available. crypto-js itself is officially **discontinued/unmaintained** (README) with CVE-2026-71851 covering its weak `WordArray.random()` (< 4.0.0).
3. **Import-destroys-data**: restore purges all tables then inserts, inside one transaction — correct, but a validation failure after the confirm dialog still leaves users staring at an error with their original data intact (good) and zero guidance (bad).

**Why it happens:**
The format spec (docs/05 §10) is solid for v1-to-v1; versioning *policy* (what older/newer versions do) was never specified, and KDF cost was chosen for security without a device-performance budget.

**How to avoid:**
- Define the version contract in the backup phase: importer accepts `format_version <= its own max`; a **future** version gets a dedicated, translated error ("created by a newer version of BabyLog — please update the app"), never a raw Zod dump. Bump `format_version` only for breaking changes; additive fields require a versioned minor policy (either tolerated-unknown-keys on import, or explicit `z.literal` bump — pick one and document it in the schema file).
- Keep `z.literal(1)` but wrap the top-level parse to branch on `format_version` *before* strict parsing of the rest.
- Benchmark PBKDF2 on a real low-end device in the backup phase spike; if > ~2 s, either lower iterations for this threat model (data is non-secret baby logs, attacker = opportunistic file snoop) or keep 210k with an explicit "encrypting…" blocking state that appears *before* the freeze. Keep all randomness (salt/IV/UUID) in `expo-crypto` as docs/04 already mandates — never `crypto-js.randomWords`.
- Pre-flight the import: validate everything (HMAC → decrypt → Zod) *before* the destructive confirm dialog; on transaction rollback show "your data was not modified".

**Warning signs:**
No test importing a file with an extra unknown key; no device benchmark of export duration; error message surface showing Zod issue paths.

**Phase to address:**
Backup phase (Release 1 scope) — version contract + KDF benchmark are entry criteria for writing the encryption service.

---

### Pitfall 9: expo-print PDF output that embarrasses at the pediatrician's office

**What goes wrong:**
`expo-print` renders HTML through a WebView, and the classic failures are all platform/theme-specific: (a) **dark mode** leaks into the PDF (system/WebView dark scheme → dark background baked into the print, or the app's OLED theme yields white-on-transparent text that prints invisible); (b) **fonts differ per OS** (iOS vs Android system fonts, missing weights); (c) 7/14-day tables paginate badly (rows split across pages, no repeated headers); (d) large HTML for 14 days can spike memory. The pediatrician PDF is a Premium marquee feature — a broken export is a refund and a review.

**Why it happens:**
The PDF looks fine on the dev device (light mode, iOS), and there is no E2E test for "open the generated file on Android, dark mode on".

**How to avoid:**
- Generate the HTML from a **fixed, theme-independent stylesheet**: explicit `background: #fff; color: #000`, embedded font via asset base64 or a bundled web-safe stack, `@page` margins, `page-break-inside: avoid` on rows, and a test that sets the device to dark mode + Arabic-locale system before export.
- Snapshot-test the HTML generator (pure function) per event-type fixture; on-device, verify both platforms manually in the release checklist.
- Name and share the file via `expo-sharing` with an explicit filename (baby name + period), per docs/05 `file_export` metadata.

**Warning signs:**
HTML template importing the app's Tailwind theme tokens; no dark-mode-on-device check in QA; PDF tested only with 5 events.

**Phase to address:**
Export phase (F07/F08).

---

### Pitfall 10: Night-mode window and "day" boundaries break at midnight and on DST-change nights

**What goes wrong:**
The auto night window is **20:00–07:00** (minutes 1200→420) — it **crosses midnight**. The naive range check `now >= start && now <= end` is false for every minute after 00:00, so night mode silently turns off at midnight (in the app used *most* between 00:00 and 07:00). Separately, "today's timeline/summary" computed as `dayStart = midnightUTC + tzOffset` or as `epoch - (epoch % 86400000)` is wrong on DST-change nights (days are 23 or 25 h in US/EU/AU markets — all whitelisted except JP/GCC) and after timezone travel, producing double-counted or missing feedings in the day summary.

**Why it happens:**
Epoch-ms storage (correct, per docs/05) makes people believe wall-clock problems are solved; but *windowing* is wall-clock by nature.

**How to avoid:**
- Window check with wrap: `startsTonight = start > end`; active if `start > end ? (m >= start || m < end) : (m >= start && m < end)`. Unit-test minutes 0, 419, 420, 1199, 1200, 1439.
- Day boundaries via dayjs local `startOf('day')`/`endOf('day')` at query time — never cache `dayStartMs` across midnight or across a timezone change (recompute on `AppState` foreground and on `expo-localization` timezone-change events where available). Add the dayjs utc/timezone plugins only if genuinely needed; for boundaries, local-time `startOf('day')` suffices.
- Duration math stays in epoch ms (immune to DST by design) — add one regression test: sleep 01:30→04:30 across a spring-forward night = 2 h, not 3.
- Store night-mode preference as minutes-of-day (docs/05: 1200/420) — display localized 12 h/24 h clock via dayjs, don't hand-roll formatting.

**Warning signs:**
A modulo-based "start of day" anywhere in the codebase; night-mode unit tests that only test 21:00; QA only in a fixed timezone.

**Phase to address:**
Timeline/night-mode phase (F02/F03), with DST fixtures (Europe/Paris, America/New_York, Asia/Tokyo) in the date utilities' test suite.

---

### Pitfall 11: Privacy declarations that contradict the app → blocked updates or removal

**What goes wrong:**
Both stores demand accurate paperwork even for zero-collection apps: Play's **Data safety form is mandatory for all apps** ("Even developers with apps that do not collect any user data must complete this form and provide a link to their privacy policy"), accuracy is the developer's sole responsibility, and discrepancies bring **blocked updates or removal**. Apple's nutrition label "Data Not Collected" plus 5.1.1(i) require the privacy policy in metadata **and in-app**. For BabyLog the truthful "no collection" claim holds only while: no remote SDK, no crash reporter, analytics stay in SQLite, and no IDFA/GAID APIs are linked. One accidental Firebase/ Sentry dependency in a transitive package or an opt-out crash SDK flips the claim false.

**Why it happens:**
Forms are filled at submission time from memory, by someone who didn't review the dependency tree.

**How to avoid:**
- Dependency hygiene gate in release-hardening: audit the final bundle for network-capable SDKs (the app legitimately has none in the MVP), confirm zero `Info.plist` usage descriptions beyond needs, no `AdSupport`/`AppTrackingTransparency` frameworks.
- Draft both declarations **from the same one-page data-flow inventory**: "data in: user input; data out: IAP purchase flow only; storage: on-device; third parties contacted: Apple/Google only at purchase/restore time."
- Host the privacy policy URL early (both stores hard-require it); add the in-app privacy + terms links when building the paywall (they are mandatory there anyway — Pitfall 3).
- Do **not** select the Kids category (docs/03 already decides this); parent-tool positioning avoids Apple's kids-privacy regime and Play's Families policy entirely.

**Warning signs:**
Submission checklist with "privacy forms — TBD"; any analytics/crash dependency added "temporarily"; no hosted policy URL two weeks before submission.

**Phase to address:**
Store-submission phase, with the dependency audit owned by release-hardening.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Filtering >24 h history in JS after fetching all rows | Faster to build timeline than windowed SQL | Leaks hidden data via every new screen; breaks 16 ms budget as history grows | Never — docs/05 hot query 3 mandates `sinceMs` in SQL |
| Scattering trial/entitlement reads across screens instead of one service | Quick paywall wiring | Impossible to reason about precedence (premium > trial > secure flag); regression bugs in every new screen | Never — one `trialService`/`entitlementService` |
| Storing entitlements in SQLite "just for queries" | Convenient joins | Directly violates docs/05 rule; tamper surface; backup would export them | Never |
| Floating dependency ranges for react-native-iap / mmkv | Fresh installs get fixes | Billing Library drift → Play update rejection (Pitfall 3); New-Arch breakage mid-milestone | Pin exact or `~`; bump deliberately |
| Hard-coded English paywall strings "for now" | Faster paywall iteration | Rejection risk is nil but FR launch quality dies; trial disclosure wording is compliance-relevant (docs/03) | MVP ships EN+FR — never for paywall/trial text |
| Skipping the `error_log`-without-sensitivity discipline ("we'll clean up later") | Faster debugging | Baby names in stack traces live forever in a local table that backups may carry | Never — docs/04/05 already mandate |
| Manual SQL for one-off screens outside repositories | Speed on a small screen | Breaks the soft-delete/hidden-history invariant globally | Never — repositories exist for exactly this |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| StoreKit 2 (iOS) | Assuming sandbox purchase == production behavior; forgetting `App Store` country/sandbox account quirks; expecting restore to fire purchase listeners synchronously | Test restore as a distinct flow on a fresh install with a sandbox tester; finish/`unfinish` transactions on every delivery path; treat restore as async with its own UI state |
| Play Billing 8 (Android) | Launching billing flow before `queryProductDetails` resolves; missing `offerToken` for subscriptions (throws on empty since Billing 7); not handling `onProductDetailsResponse` unfetched-product status codes (new in 8) | Gate purchase button on loaded products; pass offer tokens from product details; handle partial product fetch failures per react-native-iap 14.x API |
| Play purchase acknowledgment | Treating purchase-complete as done — unacknowledged purchases are **auto-refunded after 3 days** | Acknowledge/finish immediately after entitlement write (react-native-iap exposes `finishTransaction`); test with license testers |
| App Store Connect | Subscription app metadata missing EULA/Terms link; privacy policy URL placeholder; review notes with no guidance on where the paywall/trial lives | Fill Schedule 2 fields before submission; review notes: "tap gear → BabyLog Premium; local 72 h trial requires no payment" |
| Play Console (new account) | Assuming production access at submission (Pitfall 2) | Closed test 12 testers × 14 consecutive days before "Apply for production" |
| expo-sqlite WAL | Opening the DB, running migrations, but asserting on a connection where `PRAGMA foreign_keys` silently didn't apply per-connection | Execute PRAGMAs on the exact connection used by repositories at every open (docs/05 ordering: PRAGMAs before migration transaction) |
| MMKV + SecureStore | Generating a new MMKV encryption key on every launch when SecureStore read fails (silently resets entitlements) | On SecureStore read failure: hard-fail into a recovery path, never regenerate over existing encrypted instances |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| PBKDF2/HMAC (crypto-js, pure JS) on JS thread | 1–6 s frozen UI during backup export/import | Budget in backup phase: measure on low-end device; iterate count or explicit blocking state (Pitfall 8) | First real backup on a mid-range Android (~3,000 events) |
| Backup JSON.stringify of the whole DB in one shot | Memory spike, possible OOM crash on export | Use docs/05 `listForBackup` keyset pagination to build the JSON incrementally | Years of data, ~50k+ events (also device-to-device transfer users) |
| Timeline FlatList re-render on every 1-s timer tick | Dropped frames on the home screen while timer runs | Timer elapsed in its own isolated component/store slice; timeline memoized on event IDs | Immediately on low-end devices; invisible on simulators |
| Unwindowed stats/aggregates as history grows | Timeline/summary creeping past 16 ms | `sinceMs`-bounded queries + partial indexes (docs/05 §6); daily_aggregate migration only if benchmarks demand | ~6–12 months of usage (docs/05 anticipates 10k+ rows) |
| Event/error tables never purged in practice | DB bloat slows the whole DB file | Schedule `purgeBefore`/`purgeSoftDeletedBefore` maintenance at app-launch intervals; never purge non-deleted free-tier rows | Many months of usage |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `crypto-js.randomWords()` for backup salt/IV/PIN salt | CVE-2026-71851 weak PRNG → guessable backup keys | All randomness via `expo-crypto` (already mandated docs/04); add lint/import rule against `crypto-js/lib.WordArray.random` |
| Storing the backup PIN/password (or a derived hash) anywhere | Turns a "your file, your password" design into a liability | Password never persisted; only user-typed at import; document "lost PIN = lost backup" in UI copy (honest, no recovery) |
| Logging event names with properties containing baby name/note text into `error_log` | Sensitive child data leaks into logs that backups (docs/05 excludes `error_log` — verify) or manual exports reveal | Keep the docs/04 discipline: message/code only; test that error logger strips payloads |
| Treating trial `trial_claimed_secure` as tamper-proof | Keystore is strong but the app around it isn't; over-claiming security → bad design (e.g., trusting MMKV values for entitlements on jailbroken devices) | Expectation per docs/03: best-effort anti-abuse only; entitlement gate is UX, not DRM — never let a tamper assumption drive roadmap scope |
| Restoring premium entitlements from a backup file | User (or attacker) edits JSON → free premium; violates docs/05 rule | Entitlements are never in the backup payload (already specified) — enforce with strict Zod + a test asserting `billing` keys are absent |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hidden >24 h history presented as if deleted ("where did my 3 days of logs go?!") | Panic, 1-star reviews, "hostage data" perception docs/03 explicitly warns about | Explicit "Your history is safe — shown with Premium" affordance with count (e.g., "42 more days protected"), never a silent cliff |
| End-of-trial paywall as the *first* thing seen at 3 a.m. launch | Rage-close, uninstall | Docs/03: non-blocking end-of-trial paywall; free tracking keeps working in the same gesture path |
| Undo affordance that scrolls away before a sleep-deprived parent sees it | Permanent-feeling accidental deletes (soft-deleted rows are invisible to the user) | Persistent undo toast ≥ 5–10 s; edit screen reachable for the >24 h hidden tier for *delete* (deletion is free per docs/03) even if edit is gated |
| Trial countdown using wall-clock calendars ("2 days left" jumping when clock/NTP changes) | Distrust in an app whose whole brand is reliability | Compute remaining from timestamps, round up to hours, freeze on clock-anomaly (Pitfall 5) |
| Night-mode contrast inversion making the OLED screen unreadable with sleepy eyes | The core 3 a.m. use case fails | Docs/06 palette; test with true-black OLED device in a dark room; avoid pure `opacity` tricks on Android |

## "Looks Done But Isn't" Checklist

- [ ] **Restore purchases:** works on a *fresh install, offline-first launch, then online* — verify entitlement rebuild, not just "button exists"; verify premium > trial precedence after restore
- [ ] **Trial end:** exactly at 72 h the downgrade happens *without* app restart; hidden history stays intact; Emergency Doctor 24 h still free; no data deleted (verify row counts before/after)
- [ ] **Timer:** kill app mid-timer (swipe away), reopen — elapsed continues from `started_at`; stop after 25 h — capped log, no crash (Pitfall 4)
- [ ] **Night mode:** works 23:59→00:01; toggles correctly on DST-change night; preference survives restart (MMKV) and backup/restore
- [ ] **Backup round-trip:** export on device A → wipe → import on device B; trial state restored but secure-flag precedence respected; rollback leaves original data untouched on injected failure
- [ ] **Backup forward-compat:** file with `format_version: 999` and file with one extra unknown key both produce friendly errors, not Zod dumps
- [ ] **Free-tier windowing:** every screen (timeline, summary, stats, export, search) bounded by `sinceMs`; no screen shows >24 h data in Free (automated conformance test)
- [ ] **Paywall content:** store-provided localized prices render offline-failure state gracefully; Restore + privacy + terms links present; closable everywhere
- [ ] **Android manifest:** `allowBackup=false` (or dataExtractionRules) actually in the built APK/AAB — inspect the merged manifest, not app.json
- [ ] **Billing:** purchases acknowledged/finished on both platforms within seconds; license-tester purchase doesn't auto-refund after 3 days
- [ ] **PDF:** generated in dark mode + FR locale on Android shows black-on-white with correct page breaks
- [ ] **Privacy forms:** Play Data safety + Apple label completed with real dependency audit; privacy policy URL live and linked in-app

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Entitlement lost after migration (Pitfall 7) | LOW | One-tap Restore rebuilds from store; if Billing/StoreKit fails, support path = re-purchase + refund via store; ship banner before reviews accumulate |
| Play update blocked on Billing version (Pitfall 3) | MEDIUM | Bump react-native-iap, re-test IAP flows, resubmit; days not weeks — but discover via pre-submission audit, not console rejection |
| Production-access gate discovered late (Pitfall 2) | HIGH (schedule) | Start closed test immediately with recruited testers; consider shipping iOS first while Play cooks; cannot be waived |
| Data "lost" by auto-backup corruption (Pitfall 1) | MEDIUM | App-side: user's own encrypted backup (F09, free) is the designed recovery — which is exactly why backup-exclusion config must ship before launch; support: nothing recoverable server-side, be honest |
| Trial logic bug extends/breaks trial for existing users (Pitfall 5) | LOW–MEDIUM | Ship a corrective migration in MMKV state; worst case grant free trial restart (cheap goodwill, no server to coordinate) |
| CHECK-constraint insert failure loses a log (Pitfall 4) | LOW | Clamp path makes it impossible going forward; lost rows unrecoverable (no server) — prevention is the only cure |
| 3.1.2 / metadata rejection (Pitfall 3/11) | LOW | Add links/disclosures, resubmit; each rejection costs ~1–2 days review — batch all metadata fixes at once |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Android auto-backup restores undecryptable/corrupt state | Data-layer foundation (config plugin) | `bmgr` backup/restore round-trip + merged-manifest inspection |
| 2. Play closed-testing gate | Release track (parallel workstream from first preview build) | 12+ testers opted-in continuously; production access approved before launch date |
| 3. Billing version drift + Apple subscription metadata | Billing phase; store-submission phase | Pinned react-native-iap 14.7.x; paywall checklist (restore, prices, links) passes review dry-run |
| 4. 24 h+ timer vs CHECK constraint | Tracking/timer phase | Unit tests at 24 h boundaries; manual 25 h timer stop |
| 5. Trial clock tamper/reinstall | Monetization phase | State-precedence unit tests; clock-rollback and reinstall scenarios on both OSes |
| 6. Entitlement gating regressions (hostage-data risk) | Monetization + timeline phases; conformance suite in hardening | Automated matrix: feature × tier × offline-grace; Emergency mode free-path test |
| 7. Payer locked out after migration | Billing phase | Device-migration test: purchase → migrate → restore → premium |
| 8. Backup format forward-compat + KDF freeze | Backup phase | Future-version error path test; low-end-device export benchmark < 2 s or explicit blocking UI |
| 9. expo-print PDF quality | Export phase | Dark-mode + FR-locale Android PDF review in checklist |
| 10. Midnight/DST window bugs | Timeline/night-mode phase | Wrap-comparison and DST fixture tests (Paris/New York/Tokyo) |
| 11. Privacy declaration accuracy | Store-submission + hardening | Dependency audit script output archived; both forms completed from data-flow inventory |

## Sources

- Google Play Console Help — closed testing requirements for personal accounts (12 testers / 14 consecutive days / production application): https://support.google.com/googleplay/android-developer/answer/14151465 (fetched 2026-09-18)
- Android Developers — Play Billing release notes (Billing 8 required by Aug 31, 2026; Billing 9.0.0 2026-05-19; API removals): https://developer.android.com/google/play/billing/release-notes (fetched 2026-09-18)
- Android Developers — Auto Backup guide (default-included databases/shared prefs, allowBackup, dataExtractionRules cloud-backup vs device-transfer): https://developer.android.com/identity/data/autobackup (fetched 2026-09-18)
- Apple — App Review Guidelines (3.1.1 restore mechanism; 3.1.2 disclosures; 5.1.1(i) privacy policy in metadata + in-app; 5.1.1(ii)): https://developer.apple.com/app-store/review/guidelines/ (fetched 2026-09-18)
- Google Play Console Help — Data safety form (mandatory for zero-collection apps; privacy policy required; enforcement for inaccuracies): https://support.google.com/googleplay/android-developer/answer/10787469 (fetched 2026-09-18)
- crypto-js README — "Active development of CryptoJS has been discontinued" + repo metadata and GHSA-rg76-677x-56q9 / CVE-2026-71851 (weak PRNG < 4.0.0): https://github.com/brix/crypto-js (fetched 2026-09-18)
- react-native-iap README/releases — v14.7.x active (Apr 2026), StoreKit 2 (iOS 15+), Play Billing 8.x, Expo dev-client only: https://github.com/dooboolab-community/react-native-iap (fetched 2026-09-18)
- Expo SDK 57 FileSystem reference — no iCloud-backup-exclusion API surfaced (absence-of-evidence, MEDIUM confidence): https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/
- Project specs (settled, not re-opened): `docs/03-monetization-strategy.md` (trial/paywall/free-tier rules), `docs/05-data-model.md` (backup format v1, entitlement storage rules, CHECK constraints, hot queries), `docs/04-tech-stack.md` (crypto/stack constraints), `.planning/PROJECT.md`
- Community knowledge flagged for build-phase verification (MEDIUM/LOW; not independently fetched — WebSearch provider was rate-limited during this run): expo-print dark-mode/font/pagination behaviors, StoreKit sandbox renewal acceleration, Expo new-architecture compatibility details

---
*Pitfalls research for: offline-first baby tracking app with local-only monetization (BabyLog)*
*Researched: 2026-09-18*
