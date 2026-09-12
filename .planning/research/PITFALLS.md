# Pitfalls Research

**Domain:** Local-first offline Expo SDK 57 / RN 0.86 (New Architecture) newborn care tracker — NativeWind, MMKV (Nitro), expo-sqlite, crypto-js on Hermes, react-native-iap (Nitro), react-native-google-mobile-ads, expo-print, EAS
**Researched:** 2026-09-12
**Confidence:** MEDIUM overall (all findings from official versioned docs, npm registry metadata, and library issue trackers cross-checked; exact PBKDF2/AES timings on Hermes are LOW confidence — no reliable published mobile benchmark exists, benchmarking on device is mandated below)

Research note: WebSearch was rate-limited during this session; all findings come from direct fetches of official docs (docs.expo.dev v57, nativewind.dev, GitHub raw docs/READMEs, GitHub issue-search API, npm registry), then cross-checked against library issue trackers. Single-source claims are flagged.

---

## Critical Pitfalls

### Pitfall 1: Pure-JS crypto (crypto-js) on Hermes freezes the JS thread and will likely miss the < 2 s / 10 MB backup target

**What goes wrong:**
crypto-js PBKDF2 is fully synchronous and single-threaded. 100k iterations of PBKDF2-SHA256 is a sequential loop of 100k hash operations executed on the JS thread — on Hermes (which has no JIT) this is expected to take multiple seconds on mid-range Android devices (order of 3–15 s; exact numbers are device-dependent and LOW confidence). AES-256 encrypting a ~10 MB serialized backup through crypto-js is likewise multi-second. The result: the 3 a.m. export path either freezes the UI (perceived ANR, App Store/Play unresponsiveness risk) or blows the project's "chiffrement backup < 2 s / 10 Mo" performance constraint. Separately, crypto-js is officially **discontinued**: its README states *"Active development of CryptoJS has been discontinued. This library is no longer maintained."* (verified from repo README, 2026-04 issue activity notwithstanding).

**Why it happens:**
Developers benchmark crypto on desktop Node (JIT'd, fast) and assume parity. Hermes interprets bytecode without a JIT, so hot numeric loops are several times slower. crypto-js has no async/chunked API — issue #213 reports UI freeze from PBKDF2 with only 100 SHA-512 iterations in browsers; scaling to 100k iterations on a phone engine is a different magnitude.

**How to avoid:**
1. Derive the AES key **once** (first run), cache it in expo-secure-store (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`), never re-run PBKDF2 on the export path. PBKDF2 runs only during (a) first-run key genesis and (b) optional backup-passphrase mode.
2. Make the export path incremental: chunk the JSON payload into record blocks, AES-encrypt per chunk, `await new Promise(r => setImmediate(r))` between chunks so the UI stays responsive, and show a determinate "Encrypting…" state.
3. **Benchmark in week 1 of the data-layer phase**: a 10 MB synthetic payload through PBKDF2-100k and AES-256 on the cheapest supported Android device. If the 2 s/10 MB target fails, the in-constraint fallback is `@noble/hashes` `pbkdf2`/`sha256` — pure JS like crypto-js (respects the quick-crypto ban rationale), audited, actively maintained, and meaningfully faster than crypto-js. This is a stack decision to raise with the orchestrator, not a silent swap.
4. Whatever KDF is chosen, write the algorithm + iteration count into the versioned `.babylog` header (Zod schema already specified in docs/05) so imports remain possible for years.

**Warning signs:**
Backup export test takes > 2 s on a mid-range Android; UI freezes/haptics stutter during export; Metro/Hermes profiling shows > 90% JS-thread occupancy during encryption.

**Phase to address:**
Data-layer phase (benchmark spike, key-caching design) and Backup/export phase (chunked pipeline). Ban justification noted: react-native-quick-crypto (JSI/OpenSSL) would make this a non-issue but is correctly banned for native complexity — the mitigation is one-time derivation + chunking.

---

### Pitfall 2: The entire native stack is Expo-Go-incompatible — Expo Go cannot be part of any workflow

**What goes wrong:**
MMKV 4.3.2 (Nitro/C++), react-native-iap 16.6.0 (Nitro, peer `react-native-nitro-modules ^0.36.5`), and react-native-google-mobile-ads 16.5.0 all ship custom native code. Opening the project in Expo Go produces "Cannot find native module 'MMKV'" (or the ads/IAP equivalent). Teams that scaffold with Expo Go for convenience then discover mid-sprint that billing/ads/storage are untestable and scramble to set up EAS dev builds while features pile up unverified.

**Why it happens:**
Expo Go bundles a fixed set of native modules; Nitro Modules and the ads SDK are compiled per-app. The library docs are explicit: ads — "This module contains custom native code which is NOT supported by Expo Go"; IAP — "Expo Go: ❌ not supported. Expo Dev Client: ✅ full support"; MMKV — requires `expo prebuild`.

**How to avoid:**
1. Create the EAS **development profile with a dev client in the scaffold phase, before any feature work** (`developmentClient: true`). Install one internal-distribution dev build on every device used for testing.
2. Add a README/workspace rule: `npx expo start` is always used with the installed dev build, never Expo Go.
3. Keep a smoke screen in the scaffold phase: one screen that touches MMKV, SQLite, and haptics so a broken native build fails fast and visibly.

**Warning signs:** anyone on the team has Expo Go installed; a red screen mentioning missing native modules; `expo prebuild` has never been run locally.

**Phase to address:**
Scaffold/config phase — day 1, blocking everything else.

---

### Pitfall 3: MMKV encrypted instances vs. the async secure-store key — boot crash loops and silent AES-128

**What goes wrong:**
`new MMKV({ encryptionKey, encryptionType })` is **synchronous** and happens at module scope in most codebases. But the key comes from expo-secure-store, which is **async** — and `WHEN_UNLOCKED_THIS_DEVICE_ONLY` keychain/keystore entries are **unavailable after a reboot until first unlock**. Module-scope instantiation therefore (a) crashes because the key isn't loaded yet, or (b) crashes specifically on a freshly-rebooted, locked device — exactly the "3 a.m." scenario this app exists for. Two more silent failures: MMKV's default encryption is **AES-128** — AES-256 must be passed explicitly (`encryptionType`) or the security spec is quietly unmet; and there is **no official MMKV↔secure-store helper in v3/v4 docs** (the old v2-era `MMKV.encryptionKey()` example is gone) — the key plumbing is DIY and therefore easy to get wrong.

**Why it happens:**
The synchronous JSI API (MMKV's headline feature) is incompatible with the asynchronous security API (secure-store), and nobody notices until they test reboot-before-unlock.

**How to avoid:**
1. Build a `core/storage/init.ts` that: reads-or-creates a random 32-byte key (`expo-crypto` `getRandomBytesAsync`) → persists via secure-store → **then** exposes MMKV instances. Root layout awaits this init before rendering (or gates on a loaded state). No `new MMKV(...)` at module scope anywhere.
2. Handle "key unavailable (device rebooted, not yet unlocked)" explicitly: show a neutral "Unlock your phone once to decrypt data" state instead of crashing. Consider `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` if product accepts it — discuss in planning; the current spec (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`) is fine **iff** the boot path handles the unavailable window.
3. Pass `encryptionType: 'AES-256'` explicitly on the `billing:`/`secrets:` instances.
4. Treat MMKV entitlements as a cache, not the source of truth: after reinstall/restore the MMKV file is gone or unreadable. The offline restore path must be: IAP `restorePurchases`/query (when online) → rewrite entitlements. Design a "probable-entitlement" state for the offline-first story, and consider embedding a copy of entitlements in the encrypted `.babylog` backup.
5. On wrong/missing encryption keys MMKV can throw or return garbage — wrap instance creation and surface a diagnostic event to the local error log (no PII).

**Warning signs:** app works in dev (device always unlocked) but crashes after "Reboot and launch without unlocking" test; entitlements vanish on fresh install; hex-dump of the MMKV file shows plaintext values (means encryption wasn't applied); audit shows AES-128.

**Phase to address:**
Data-layer/storage phase (init module + reboot test); Monetization phase (entitlement recovery flow).

---

### Pitfall 4: The AdMob SDK silently breaks the "zero network calls before onboarding_completed" promise

**What goes wrong:**
The ads library's own docs warn: *"Ads may be preloaded by the Mobile Ads SDK or mediation partner SDKs upon calling `initialize`."* Calling `mobileAds().initialize()` at launch (the docs' own "ideally at app launch" advice — for the *typical* app, not this one) triggers network traffic before onboarding completes, violating the core product promise and, worse, running before UMP consent in the EEA/UK (policy violation). Android's Google Mobile Ads SDK additionally performs measurement init at app launch unless `delayAppMeasurementInit: true` is set. UMP `AdsConsent.requestInfoUpdate()` is itself a network call.

**Why it happens:**
Every tutorial calls `initialize()` in the root component. The SDK is designed for ad-first apps, not offline-purity apps.

**How to avoid:**
1. Set `delayAppMeasurementInit: true` in the Expo config plugin props (scaffold phase, so it's baked into all builds).
2. Never call `initialize()` before `onboarding_completed === true` **and** user is free tier. Gate order: onboarding done → free tier check → `AdsConsent.gatherConsent()` (network, EEA) → `canRequestAds` → `setRequestConfiguration({ maxAdContentRating: 'G', childDirectedTreatment: false ... })` **before** initialize → `mobileAds().initialize()`.
3. Never render a `<BannerAd>` component before initialization completes — mounting one triggers a load request.
4. Verify empirically: airplane-mode cold-boot test on device (boot must succeed fully), plus a proxy/Charles check on a normal boot for any `doubleclick.net`/`googlesyndication.com` traffic before onboarding. Add this to the phase's acceptance criteria — it is the only way to *prove* the marketing claim.
5. On UMP errors, follow the docs: still allow ad requests using prior-session consent status; do not persist consent status yourself ("Do not persist the status" — refresh via `getConsentInfo()` each launch).

**Warning signs:** proxy shows Google ad traffic during onboarding; consent form appears before onboarding completes; Play policy warnings; airplane-mode boot fails or hangs.

**Phase to address:**
Scaffold phase (delay flag, init-service skeleton with hard gates); Ads phase (wiring); Release phase (airplane-mode boot verification as a checklist item).

---

### Pitfall 5: expo-sqlite WAL + backup file copies, non-exclusive transactions, and JS-thread blocking

**What goes wrong:**
1. **Backup/export data loss:** BabyLog enables WAL (per docs tip: `PRAGMA journal_mode = WAL`). Copying the raw `.sqlite` file for the `.babylog` backup while recent commits still live in the `-wal` file produces a backup missing today's feeds — or a corrupt copy if copied mid-write. This is the single most likely silent data-loss bug in this project.
2. **Transaction foot-guns (quoted from SDK 57 docs):** `withTransactionAsync` — "This transaction is not exclusive and can be interrupted by other async queries"; any query issued anywhere while the transaction is open gets pulled into it (the docs show an outside `UPDATE` being rolled back by an unrelated failure). `withExclusiveTransactionAsync` — concurrent writes "will abort with `database is locked` error."
3. **JS-thread blocking:** every `*Sync` method in the SDK 57 docs carries the warning "Running heavy tasks with this function can block the JavaScript thread and affect performance."
4. **Injection:** `execAsync()` "does not escape parameters and may lead to SQL injection."

**How to avoid:**
1. Build exports on `db.serializeAsync()` (returns the full committed database as bytes — WAL-consistent) instead of file copies; if a file copy is ever needed, run `PRAGMA wal_checkpoint(TRUNCATE)` first and copy all three files (`db`, `-wal`, `-shm`). Same discipline for any diagnostic export.
2. Wrap the backup **import** in `withExclusiveTransactionAsync`, and route all writes through the repository layer so no stray query runs concurrently (already spec'd: SQL only in `repository/` + `core/database/`).
3. Use async APIs everywhere in production paths; reserve `*Sync` for tiny reads on the 1-tap path if ever needed, and profile with the 16 ms budget (EXPLAIN QUERY PLAN, per spec).
4. Prepared statements (`prepareAsync`/`$sql` tagged templates) only — never string-interpolate into `execAsync`. Finalize statements in `try/finally`; call `resetAsync()` before re-fetching cursors.
5. Migrations: the docs' `PRAGMA user_version` pattern inside `SQLiteProvider`'s `onInit`, idempotent blocks per schema version (matches docs/05 `schema_version` design — align the two, don't run both mechanisms).

**Warning signs:** restored backup is missing recent records; intermittent "database is locked" during import; timeline list query > 16 ms as data grows past a few thousand rows; interpolated user strings in SQL review.

**Phase to address:**
Data-layer phase (transactions, WAL, migration pattern); Backup/export phase (serialize-based export, transactional import).

---

### Pitfall 6: Google Mobile Ads on New Architecture has live gaps — native ads broken on Android, rewarded-ad dismissal fragile on iOS

**What goes wrong:**
SDK 57 runs RN 0.86 with New Architecture on by default, and the ads library's Fabric support is still maturing. Verified from the issue tracker: **#870 (open, updated 2026-09-03)** — `NativeAd.createForAdRequest()` never resolves or rejects on RN 0.85 + New Architecture (Fabric) on Android (BannerAd works); the Android New-Architecture TurboModule migration PRs (#817/#819) were **closed unmerged**; iOS native-ad Fabric fixes only landed through 2026 (#843, #860 merged; #853 not merged — blank `NativeMediaView` under bridgeless); and **#859** — app frozen (touches dead) after a rewarded ad auto-dismisses on iOS 26.x physical devices. The project plans Native + Banner + Rewarded formats; Native (Android) is currently the riskiest and Rewarded dismissal needs real-device testing.

**Why it happens:**
New Architecture changes the native view/module contract; ad mediation SDKs have deep imperative lifecycle code that lags Fabric adoption.

**How to avoid:**
1. Sequence ad formats by risk: Banner first (works per #870), then Rewarded with a **real-device dismissal test** (iOS physical device, auto-dismiss path), Native last — and only after re-checking #870's status at Ads-phase start.
2. Pin the library version in package.json (no `^` drift into a mid-phase major), and re-run the format smoke tests after every ads-library bump.
3. Keep ad-loading failures non-fatal: every load/show path wrapped in try/catch with the local error log — the app must be 100% usable with ads entirely failing (offline, no-fill, SDK bugs).

**Warning signs:** a load promise that never settles (add a timeout + fallback UI); freeze after ad dismissal on iOS device; blank native ad views on iOS bridgeless.

**Phase to address:**
Ads phase; re-verify at Release phase with store-channel builds.

---

### Pitfall 7: AdMob app-ID and test-credential mistakes — launch crashes, silent ad failures, or an AdMob account ban

**What goes wrong:**
Three distinct failure modes: (1) missing `androidAppId`/`iosAppId` in the config plugin — docs: "will cause the app to crash on start or fail to build"; (2) wiring real ad unit IDs into development/preview builds — docs: use `TestIds` "during development to avoid account disablement" (clicking your own live ads in testing is a classic path to an AdMob ban — an existential risk for an ad-funded MVP); (3) Android release builds missing the consent-SDK Proguard keep rule (`-keep class com.google.android.gms.internal.consent_sdk.** { *; }` — add via `extraProguardRules`) causing release-only consent crashes that never appear in debug.

**Why it happens:**
App IDs live in app config, ad unit IDs live in code, and neither is tied to the build profile unless deliberately wired through env.

**How to avoid:**
1. All ad unit IDs flow from `app.config.ts` env layering: dev builds → `TestIds.*`; preview → TestIds (or dedicated test ad units); production → real IDs via EAS server-side environment variables (the `environment` field selects the `development`/`preview`/`production` variable set — never put the real IDs in committed `env`).
2. App IDs (`ca-app-pub-xxx~yyy`) in plugin props from env too, with safe dev fallbacks so dev builds never crash.
3. Add the Proguard rule at scaffold time, not at release time.
4. Play Console: declare "contains ads" before release; keep `childDirectedTreatment: false`, `maxAdContentRating: 'G'` set **before** `initialize()` (docs: configuration must precede init).

**Warning signs:** `EXPO_PUBLIC_AD_*` hardcoded in a component; a release build without the Proguard rule in the diff; TestIds present in a production-profile config dump.

**Phase to address:**
Scaffold phase (env layering, plugin props, Proguard rule); Ads phase (ID wiring); Release phase (config audit).

---

### Pitfall 8: NativeWind v4 setup traps — Tailwind v4, babel/metro wiring, type file naming, and dark-only theming

**What goes wrong:**
1. `npm i tailwindcss` installs **v4** — NativeWind v4 (stable line 4.2.6, peer `tailwindcss >3.3.0`) does not support it; docs require `tailwindcss@^3.4.17` plus `nativewind/preset` in the Tailwind config. This breaks the build immediately and the error messages don't point at the version mismatch.
2. Babel must be exactly: `presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"]`, and Metro wrapped with `withNativeWind(config, { input: './global.css' })`, with `import "./global.css"` in the entry. A custom `babel.config.js` written later (e.g., for React Compiler options) that drops either the `jsxImportSource` option or the preset silently kills all styling.
3. TypeScript types live in a file named `nativewind-env.d.ts` containing `/// <reference types="nativewind/types" />` — the docs explicitly warn that naming it `nativewind.d.ts` (or anything matching an existing file/folder) makes the types not load, so `className` becomes a TS error everywhere.
4. **Dark-only theming:** by default NativeWind follows system appearance, and "Expo apps only follow the system appearance if `userInterfaceStyle` is set to automatic." In a dark-only app with the OS in light mode, `dark:` variants don't apply → cream-on-white unreadable screens, violating the Nocturne Glow spec (`#FFFFFF` interdit).
5. Custom components in `core/ui` don't accept `className` until registered with `cssInterop` — styles get silently dropped.

**Why it happens:**
NativeWind touches three config surfaces (babel, metro, tailwind) plus types; every Expo SDK major has produced a wave of "not working with SDK N" issues (e.g., #1483, #1622, both closed not-planned), so version discipline matters more than for most libraries.

**How to avoid:**
1. Pin exact versions: `nativewind@4.2.x`, `tailwindcss@^3.4.17`, `react-native-css-interop` (dependency-matched to nativewind 4.2.6 = 0.2.6). **Do not adopt v5 (pre-release)** — issue #1850 questions active maintenance (months of inactivity) and #1855 catalogues ~45 latent open issues, with silent class drops (e.g., `text-start`/`text-end`, `rtl:`/`ltr:`).
2. Set `"userInterfaceStyle": "dark"` in app config (forces OS-level dark for the app) **and** call `colorScheme.set('dark')` at boot as belt-and-braces; define Nocturne tokens (`#14121e`, `#F9ECE5`, `#7665FA`) in `tailwind.config` theme and avoid `dark:` prefixes entirely (single theme = no variant logic).
3. Register every `core/ui` component with `cssInterop`/`remapProps` at creation time; make it a checklist item in the component template.
4. Test one screen in **OS light mode** during the UI phase to prove nothing white flashes or renders unreadable (splash screen included).

**Warning signs:** styles apply in web but not native (preset/metro issue); `className` type errors (env.d.ts naming); screens look broken on light-mode devices (dark-only wiring); a freshly installed tailwind resolves to 4.x.

**Phase to address:**
Scaffold phase (versions pinned, config files committed); UI phase (dark-only verification, cssInterop checklist).

---

### Pitfall 9: React Compiler enabled on day 1 — subtle rendering bugs you can't attribute

**What goes wrong:**
React Compiler's automatic memoization changes render semantics. App code that violates the rules of React (mutating props/state during render) compiles into bugs that appear only under the compiler. Library interactions are possible: NativeWind issue #1812 (open) — the dev-only `printUpgradeWarning` crashes when serializing props containing context objects in an environment with React Compiler enabled. Debugging compiler-caused issues while simultaneously building core tracking UX multiplies cost.

**Why it happens:** SDK 57 makes enabling trivial (`experiments.reactCompiler: true`, babel auto-configured on SDK 54+), so it gets flipped on early and forgotten.

**How to avoid:**
1. Scaffold **without** the flag; ship the vertical slice first. Enable in the UI/hardening phase once core flows are stable.
2. When enabling: run `npx react-compiler-healthcheck@latest` first; add the ESLint rules (built into `eslint-config-expo` on SDK 55+ — SDK 57 has them by default) so violations are caught at lint, not runtime.
3. Use `'use no memo'` as the escape hatch on any component that misbehaves; scope compilation with the `sources` option if adoption needs to be incremental.
4. Remember node_modules are **not** compiled — compiler bugs can only come from app code (plus dev-only library warnings like #1812, which are dev-mode-only).

**Warning signs:** memoization-dependent tests flaky after enabling; "more renders than expected" or stale-value bugs appearing only in compiler-on builds.

**Phase to address:** UI/hardening phase (flag on, healthcheck, lint gate) — not scaffold.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copying the SQLite file directly for backups instead of `serializeAsync` | 5 lines of code | Silent data loss from WAL (`-wal` pages not in copy) — worst possible bug for a baby-data app | Never |
| Module-scope `new MMKV()` with a placeholder encryption key | Instant storage access | Crash loop after reboot-before-unlock; re-keying later requires `recrypt()` migration of all instances | Never for `billing:`/`secrets:` instances |
| Hardcoded ad unit IDs "just for now" | Faster first ad render | AdMob account-disablement risk when a dev build ships; config drift between profiles | Never in anything but a throwaway branch |
| Running PBKDF2 on every export instead of caching the derived key | Simpler crypto code | Multi-second UI freeze per export on mid-range devices | Only if product decides backups are passphrase-based (then must chunk + show progress) |
| `getAllAsync()` without LIMIT on the timeline | Simple query code | List latency grows linearly with history; misses the 16 ms budget within weeks of real use (8–12 records/day ≈ 3–4k rows/year) | Never for the 7-day Timeline; fine for tiny config reads |
| Adopting NativeWind v5 pre-release "to be current" | Newer API | Maintenance-stalled line with ~45 catalogued latent issues and silent style drops | Never for this MVP; re-evaluate at V1.1 |
| Skipping `cssInterop` on a `core/ui` component and passing styles via inline `style` prop | Fast component delivery | Two styling paradigms in the codebase — violates the "NativeWind unique paradigme styling" constraint; drains consistency | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| react-native-mmkv v4 | Forgetting `react-native-nitro-modules` peer install | `npx expo install react-native-mmkv react-native-nitro-modules` + prebuild; verify both appear in the dev build |
| MMKV encryption | Assuming default = AES-256 | Default is AES-128; pass `encryptionType: 'AES-256'` explicitly |
| expo-secure-store | Treating it as always-available synchronous storage | It's async and lock-state dependent (`WHEN_UNLOCKED_THIS_DEVICE_ONLY` unavailable after reboot-before-unlock); gate boot on it |
| UMP consent | Persisting consent status in MMKV and skipping `requestInfoUpdate` on later launches | Docs: "Do not persist the status" — call `requestInfoUpdate()` every launch (offline-safe: falls back to prior session) |
| UMP testing | Testing consent only from a US IP | Use `debugGeography: AdsConsentDebugGeography.EEA` + `testDeviceIdentifiers` (emulators auto-whitelisted); `AdsConsent.reset()` between runs |
| react-native-iap | Assuming IAP works from an EAS build straight to a device | Android IAP needs the app on a Play internal-testing track with matching `applicationId`; iOS needs StoreKit 2 (iOS 15+) — simulator testing requires a StoreKit configuration file, plan device testing |
| react-native-iap (Nitro) | Ignoring the Swift version interop issue | Known Nitro Swift 6 C++ interop problem — pin Swift 5.10 for the NitroModules pod if the EAS iOS build fails in Nitro sources; IAP config plugin + `expo-build-properties` `kotlinVersion: "2.2.0"` on Android |
| react-native-google-mobile-ads | Calling `setRequestConfiguration` after `initialize()` | Configuration must be set **before** initialize or it doesn't apply to the first requests |
| expo-print | Referencing `require('./logo.png')` asset paths in the HTML | iOS cannot load local asset URLs in WKWebView printing — base64-inline images **and the Plus Jakarta Sans font** (a remote font URL would violate the offline promise) |
| expo-print | Using `useMarkupFormatter: true` to fix iOS layout | That renderer "doesn't display images" and can add a blank trailing page unless HTML is well-formed (`<!DOCTYPE html>`) — keep WebView rendering |
| EAS builds | Putting real ad IDs / secrets in `eas.json` `env` | Docs: `env` is "only for values that you would commit to your git repository" — real credentials go in EAS server-side variables, selected via the profile's `environment` field |
| expo-sqlite | `addDatabaseChangeListener` without `enableChangeListener: true` at open | The listener silently never fires unless the open option was set (only enable if actually used — it has overhead) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| crypto-js PBKDF2 re-derivation on hot paths | 3–15 s freezes during export on mid-range Android | One-time derivation, key cached in secure-store; chunked encryption with async yields | Immediately at first real backup (~100 KB–10 MB) |
| Unbounded `getAllAsync` timeline queries | Timeline scroll jank; > 16 ms queries | Indexed 7-day window queries (`created_at` index), `LIMIT`, `getEachAsync` for large sets (docs-recommended) | ~4k+ rows (≈ 1 year of 3 users' tracking), much sooner with unindexed joins |
| Sync SQLite calls on the 1-tap path | Missed taps at 3 a.m., dropped frames during haptics | Async repository APIs; writes are tiny (single INSERT, WAL) — keep them that way; never a transaction wrapping UI work | When transaction scope creeps |
| Encrypted MMKV for high-frequency tracking writes | Write latency on every event | Per spec: tracking events go to SQLite; MMKV holds timers/entitlements/secrets only (small, infrequent) | If spec boundary erodes |
| Base64-inlined PDF assets (fonts + images) | Multi-MB HTML strings, slow `printToFileAsync`, memory spikes | Subset the font, single small logo, generate HTML from a template with placeholders | First pediatric export with full 7-day data + fonts |
| Dev-mode NativeWind + React Compiler warnings | Dev-only crashes unrelated to prod (#1812-class) | Keep dev tooling updated; treat dev-only crashes as signal, not noise | Throughout development |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Deriving the MMKV encryption key from a constant or storing it inside MMKV/SQLite | Encryption theatre — ciphertext trivially decryptable on-device | Random 32-byte key via `expo-crypto`, lives only in Keychain/Keystore via secure-store |
| Logging decrypted payloads or SQL params during development, then shipping | PII (baby name, notes) in on-device logs / console | Local error log sanitizes by construction; never stringify record payloads; spec already bans PII in logs |
| Assuming MMKV default encryption meets the AES-256 spec | Silent downgrade to AES-128 | Explicit `encryptionType: 'AES-256'`; assert in a unit test by inspecting instance options |
| Using `crypto-js.lib.WordArray.random` as the source of salt/UUIDs instead of expo-crypto | Weaker RNG; violates spec (`expo-crypto` randomUUID) | All randomness through `expo-crypto` (`getRandomBytesAsync`, `randomUUID`) |
| Backup file encrypted without per-backup random salt | Rainbow-table attacks on the passphrase-derived key | Fresh random salt per export in the versioned header (docs/05 Zod schema) |
| Skipping the consent-SDK Proguard keep rule | Release-only consent crashes in EEA (the exact market that requires UMP) | `extraProguardRules` in config from scaffold phase |
| ATT over-reach | Adding `userTrackingUsageDescription`/IDFA prompts while spec says "pas d'IDFA/user tracking" | Don't add the tracking permission at all; no ATT message configured in AdMob; UMP handles what's needed without tracking |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Blocking encrypt/export UI without feedback | App feels dead mid-backup — worst moment to lose trust | Chunked pipeline with determinate progress + cancel; encryption happens off the interaction moment |
| Notification permission asked at first launch | Permission denied reflexively; reminder feature permanently dead | Per spec: ask only when the user activates the J30 backup reminder (Android 13+ POST_NOTIFICATIONS / iOS provisional) |
| White flash at launch on light-mode devices | Breaks the "night eyes" promise in the first second | `userInterfaceStyle: "dark"` + dark splash asset; test OS-light-mode launch |
| Ads appearing immediately after onboarding completes | Trust collapse for an "anti-ads-at-night" brand | Delay first ad impression to first natural content surface (diurnal gating already spec'd); never on the onboarding success screen |
| Requiring network for restore-purchases with no offline messaging | Dead-end screen for a local-first app | "Restore will complete when you're online" state; entitlements degrade gracefully per Pitfall 3 |

## "Looks Done But Isn't" Checklist

- [ ] **Offline-boot promise:** Often missing an airplane-mode boot test — verify zero network before `onboarding_completed` (proxy check catches what airplane mode can't: delayed/deferred calls).
- [ ] **Encrypted backup:** Often missing a **restore** test — round-trip export→wipe→import on device, verifying Zod version gate and transactional import.
- [ ] **MMKV encryption:** Often missing the reboot-before-unlock test — reboot device, launch without unlocking, app must not crash.
- [ ] **Entitlements:** Often missing the reinstall test — reinstall, go offline, confirm premium state story is defined (and honest).
- [ ] **PDF export:** Often tested on Android only — verify iOS (base64 assets, margins, font rendering) on a real device.
- [ ] **Dark-only UI:** Often tested only on dark-mode devices — verify in OS light mode (splash, keyboard, permission dialogs, native date pickers).
- [ ] **UMP consent:** Often tested only outside the EEA — run with `debugGeography: EEA` and verify non-personalized fallback.
- [ ] **Rewarded ads:** Often tested only via "skip" in dev — test real auto-dismiss on an iOS physical device (issue #859 class freeze).
- [ ] **IAP:** Often "done" in sandbox only — verify Play internal-testing track purchase + restore, StoreKit 2 sandbox purchase + restore.
- [ ] **Migrations:** Often written but never exercised — test v1→v2 upgrade on a populated database before adding v3.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| WAL-truncated backup discovered late | MEDIUM | If any user data affected, treat as data-loss incident; switch export to `serializeAsync`, add round-trip test; existing users re-export |
| MMKV instances live with AES-128 or placeholder key | MEDIUM | `recrypt()` to re-key with AES-256 after key plumbing fixed; requires migration code per instance |
| React Compiler enabled causes unattributable bugs | LOW | Flip `experiments.reactCompiler: false` (instant); bisect with `'use no memo'` per component |
| AdMob account flagged from test-clicks | HIGH | Appeal immediately with evidence; prevention (TestIds per profile) is the only real fix — recovery is uncertain |
| NativeWind v4/Tailwind v4 mismatch discovered late | LOW | Pin `tailwindcss@^3.4.17`, add `nativewind/preset`; styles compile once fixed — no code changes |
| Native ads blocked on Android Fabric (#870) | LOW | Ship Banner-first; re-evaluate #870 at each ads-library bump |
| Secure-store key lost (device migration, restore) | MEDIUM | By design: MMKV data unreadable → treat as fresh install + IAP restore reconciliation; document in-app messaging |
| crypto-js export exceeds 2 s budget | LOW–MEDIUM | Chunk + yield + progress (hours of work); if still too slow, swap KDF to `@noble/hashes` with versioned header change |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Expo Go incompatibility (dev builds) | Phase 1 — Scaffold/config | Dev build installed and boots smoke screen touching MMKV + SQLite |
| NativeWind v4/Tailwind/babel/metro wiring | Phase 1 — Scaffold/config | Pinned versions committed; a styled screen renders; `className` typechecks |
| Dark-only theming (`userInterfaceStyle`, tokens) | Phase 1 — Scaffold + UI phase | OS light-mode launch shows no white flash; token audit shows no `#FFFFFF` |
| AdMob `delayAppMeasurementInit` + init-service gates | Phase 1 — Scaffold/config | Plugin props in built app manifest; init service refuses to run pre-onboarding (unit test) |
| Proguard consent rule + env-layered ad IDs | Phase 1 — Scaffold/config | Release-profile config audit; TestIds in dev/preview env dumps |
| SQLite WAL/transactions/migration pattern | Phase 2 — Data layer | Transaction unit tests (rollback, exclusivity); EXPLAIN QUERY PLAN on hot queries < 16 ms |
| crypto-js benchmark + key-caching design | Phase 2 — Data layer | On-device benchmark report: PBKDF2-100k and AES-256/10MB timings vs 2 s budget |
| MMKV encrypted-instance init + reboot test | Phase 2 — Data layer/storage | Reboot-before-unlock launch test passes; AES-256 assertion test |
| React Compiler enablement | UI/hardening phase | Healthcheck clean; ESLint rules green; flag toggled after core flows stable |
| expo-print iOS base64 + font embedding | Export phase | iOS device export renders logo + font + disclaimers; Android parity check |
| Backup WAL-safe export + transactional import | Backup/export phase | Round-trip export→wipe→import test on device; restore includes latest pre-export record |
| Offline entitlements + IAP restore flow | Monetization phase | Play internal-testing purchase + offline-launch state + online restore; StoreKit sandbox equivalent |
| AdMob new-arch format risk (Banner → Rewarded → Native) | Ads phase | Real-device rewarded dismissal test; load-timeout fallback verified; #870 status re-checked |
| UMP consent flow (EEA debug geography) | Ads phase | EEA-debug run shows form → non-personalized fallback; `canRequestAds` gate before initialize |
| Airplane-mode boot + proxy boot purity | Release phase | Airplane-mode cold boot succeeds; proxy shows no ad/UMP traffic pre-onboarding |
| EAS profile matrix (dev/preview/prod) | Phase 1 — Scaffold, verified at Release | Three profiles each build once early; prod profile config audit before submission |

## Sources

**Official documentation (fetched 2026-09-12):**
- expo-sqlite SDK 57 — https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/ (WAL tip, transaction exclusivity warnings, JS-thread warnings, `execAsync` injection note, user_version migration pattern, `serializeAsync`)
- expo-print SDK 57 — https://docs.expo.dev/versions/v57.0.0/sdk/print/ (iOS WKWebView local-asset limitation + base64 workaround quotes, `useMarkupFormatter` caveats)
- Expo React Compiler guide — https://docs.expo.dev/guides/react-compiler/ (SDK 54+ auto babel config, healthcheck, `'use no memo'`, node_modules exclusion)
- eas.json reference — https://docs.expo.dev/eas/json/ (profiles, `extends`, `env` commit-safety warning, `environment` field, `developmentClient` implications)
- NativeWind v4 docs — https://www.nativewind.dev/docs/getting-started/installation (babel/metro/Tailwind 3.4.17 requirements, nativewind-env.d.ts naming warning) and https://www.nativewind.dev/docs/core-concepts/dark-mode (system-follow behavior, `colorScheme.set()`, Expo `userInterfaceStyle` gotcha)
- react-native-mmkv READMEs (main/v4 + README_V3) — https://github.com/margelo/react-native-mmkv (v4 Nitro, RN 0.76+, `react-native-nitro-modules`, AES-128 default/AES-256 option, `recrypt`, remote-debugging limitation, new-arch requirement)
- react-native-google-mobile-ads docs (index, european-user-consent, migrating-to-v17) — https://github.com/invertase/react-native-google-mobile-ads (plugin props, app-ID crash warning, TestIds warning, "ads may be preloaded upon initialize", `delayAppMeasurementInit`, UMP flow + "do not persist the status", Proguard rule)

**Issue trackers / registry (fetched 2026-09-12):**
- nativewind/nativewind issues: #1812 (React Compiler env dev-warning crash, open), #1850 (maintenance question), #1855 (~45 latent issues), #1483/#1622 (SDK-upgrade breakage waves)
- invertase/react-native-google-mobile-ads issues: #870 (NativeAd hang on RN 0.85 Fabric Android, open), #860/#843 (iOS native-ad Fabric fixes, merged 2026), #853 (blank NativeMediaView bridgeless, unmerged), #859 (rewarded-dismissal freeze iOS 26.x), #817/#819 (Android new-arch migration, closed unmerged), #837 (nil-info crash, fixed)
- brix/crypto-js: README "Discontinued" notice; issue #213 (PBKDF2 synchronous UI freeze)
- dooboolab-community/react-native-iap README (Nitro, Expo Go unsupported, StoreKit 2/Play Billing 8, Swift 5.10 pin, kotlin 2.2.0)
- npm registry: nativewind@4.2.6 (peer tailwindcss >3.3.0), react-native-mmkv@4.3.2, react-native-iap@16.6.0, react-native-google-mobile-ads@16.5.0 (peer expo >=47)

**LOW-confidence items (flagged, need on-device measurement):** exact PBKDF2-100k and AES-256/10MB timings on Hermes mid-range devices — no reliable published benchmark found; the mandated benchmark spike is the authoritative source. NativeWind 4.2.6 ↔ RN 0.86.3 specific compatibility has no explicit published statement (latest issues reference RN 0.81–0.85) — verify with the scaffold smoke screen.

---
*Pitfalls research for: BabyLog Offline — local-first Expo SDK 57 / New Architecture tracker*
*Researched: 2026-09-12*
