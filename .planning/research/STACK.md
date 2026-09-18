# Stack Research

**Domain:** Offline-first baby-tracking mobile app (Expo, local SQLite, encrypted local backups, native IAP, zero cloud)
**Researched:** 2026-09-18
**Confidence:** MEDIUM-HIGH overall (versions verified against npm registry + official docs + first-party SDK 57 artifacts in local `node_modules`; per-claim levels below)

## Verdict on the Imposed Stack

**The imposed stack is SOUND and mutually compatible on Expo SDK 57, with two corrections and two pin warnings:**

1. **CORRECTION — crypto-js is dead.** docs/04 prescribes crypto-js for backup encryption (AES-256-CBC + PBKDF2-SHA256 210k + HMAC). The crypto-js README states verbatim: *"Active development of CryptoJS has been discontinued. This library is no longer maintained."* Last release 4.2.0 (2020). Beyond being unmaintained, pure-JS PBKDF2 at 210,000 iterations takes **seconds** on a low-end phone — a real UX problem for the backup flow. Replace with `react-native-quick-crypto` (native JSI speed, project already requires a dev build for MMKV). Confidence: **HIGH** (official README quote + npm).
2. **CORRECTION — swap react-native-iap for expo-iap (same core, less friction).** react-native-iap v16 is maintained but its GitHub repo is archived (moved to the `hyodotdev/openiap` monorepo), it now requires Nitro Modules pinned to `^0.36.5` (latest is 0.37.1 — a singleton-native-module pinning footgun alongside MMKV), and Expo's own IAP guide no longer mentions it. `expo-iap` is the Expo-Module binding of the **same OpenIAP core** (openiap-apple = StoreKit 2, openiap-google = Play Billing 8.x), installable with `npx expo install expo-iap`, and is what Expo's official guide now features. Either satisfies the "native IAP, StoreKit 2 / Play Billing, no server" constraint; expo-iap does it with fewer moving parts. Confidence: **MEDIUM-HIGH**.
3. **PIN WARNING — NativeWind:** stable is v4.2.7; it requires **tailwindcss ^3.4.17** (Tailwind v4 is NOT supported). NativeWind v5 exists only as pre-release — do not adopt. Confidence: **HIGH**.
4. **PIN WARNING — expo-file-system:** in SDK 57 the new `File`/`Directory`/`Paths` API is the default import; the classic functions (`writeAsStringAsync` etc.) **throw at runtime** unless imported from `expo-file-system/legacy`. All backup/export code in docs/04's vocabulary must be written against the new API. Confidence: **HIGH**.

Everything else in docs/04 (expo-sqlite, MMKV, Zustand+MMKV persist, Zod, i18next, expo-print, expo-secure-store) validates cleanly against SDK 57 current versions.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Conf. |
|------------|---------|---------|-----------------|-------|
| expo (SDK 57) | ~57.0.24 (installed) | Runtime, managed workflow, EAS Build | SDK 57 = RN 0.86.3 + React 19.2.3; New Architecture is the only architecture on RN 0.8x; verified in local scaffold | HIGH |
| react-native | 0.86.3 (installed) | Native runtime | No breaking changes from 0.85; min iOS 15.1 (verified in `react-native/scripts/cocoapods/helpers.rb`), min Xcode 16.1, Android API 24 | HIGH |
| expo-router | ~57.0.22 (installed) | File-based navigation | Already scaffolded; matches docs/04 thin-screens architecture | HIGH |
| expo-sqlite | ~57.0.3 | Local relational store | Modern async API (`openDatabaseAsync`, `prepareAsync`, `withExclusiveTransactionAsync` for transactional restore), `execAsync` for `PRAGMA journal_mode=WAL` / `foreign_keys=ON`; optional SQLCipher via config plugin if threat model ever changes. Exact match for docs/05 raw-SQL-repository design | HIGH |
| react-native-mmkv | ^4.3.2 + react-native-nitro-modules | Fast KV store (settings, trial, encrypted entitlements) | v4 is Nitro-based = New-Architecture native, first-class on RN 0.86; standard + encrypted instances; ships Expo config plugin. MMKV encryption is AES-CFB-128 with key held in SecureStore — acceptable for entitlements/secrets (not bulk data) | MEDIUM-HIGH |
| nativewind | ^4.2.7 | Styling (Tailwind syntax in RN) | Current stable; v5 is pre-release only. Pin tailwindcss ^3.4.17. Works with reanimated 4 + worklets on SDK 57 | HIGH |
| expo-print | ~57.0.2 | Local HTML → PDF (pediatrician export) | `printToFileAsync({ html })` → `{ uri }`, fully offline when images are base64-inlined. iOS WKWebView does not support local asset URLs — inline everything | HIGH |
| **expo-iap** (recommended) or react-native-iap | ^5.6.2 (or ^16.6.1) | Native IAP (StoreKit 2 / Play Billing 8) | Both are OpenIAP-spec bindings of the same openiap-apple/openiap-google core. expo-iap is an Expo Module (`npx expo install expo-iap`), no Nitro pinning, featured in Expo's official IAP guide. See "Stack Patterns by Variant" if staying on react-native-iap | MEDIUM-HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Conf. |
|---------|---------|---------|-------------|-------|
| zustand | ^5.0.15 | Global state | `persist` + `createJSONStorage` with a tiny MMKV `StateStorage` adapter; `partialize` to whitelist persisted keys (settings, entitlements) per docs/04 | HIGH |
| react-native-quick-crypto | ^1.1.7 (+ react-native-quick-base64 ^3) | **Backup encryption** (replaces crypto-js) | AES-256-CBC, PBKDF2-SHA256, HMAC-SHA256 at native speed; peers expo >=48 / nitro >=0.31.2; needs dev build (already required for MMKV) | MEDIUM |
| expo-secure-store | ~57.0.4 | MMKV encryption key, best-effort trial flag | Keychain/Keystore; ~2KB per value — store keys/flags only, never bulk data | HIGH |
| expo-crypto | ~57.0.3 | UUIDv4 (`randomUUID`), salt + IV (`getRandomBytes`) | Does NOT do AES/PBKDF2 — that's why quick-crypto is needed | HIGH |
| expo-file-system | ~57.0.7 | Backup file write/read, PDF handling | New API only: `File`, `Directory`, `Paths` (default import); legacy import throws | HIGH |
| expo-sharing | ~57.0.21 | Native share sheet for PDF/backup files | On export action only | HIGH |
| expo-document-picker | ~57.0.2 | Manual backup import | User-initiated restore | HIGH |
| zod | ^4.6.5 | Validation at all boundaries | Zod 4 stable line; use for forms, backup import, analytics allowlist | HIGH |
| react-hook-form + @hookform/resolvers | ^7.88.0 + ^5.9.1 | Forms | resolvers 5.x peers `zod ^3.25 \|\| ^4` — Zod-4 ready via `zodResolver` | HIGH |
| i18next + react-i18next | ^26.4.2 + ^17.0.14 | i18n (EN/FR now, de/ja/ko/ar later) | Bundle locale JSON statically (NO http-backend in RN); init once in root layout; detect via expo-localization; react-i18next 17 peers i18next >=26.2 | MEDIUM-HIGH |
| expo-localization | ~57.0.2 | Locale detection, RTL direction | `getLocales()[0].languageTag`; combine with `I18nManager.allowRTL` at boot for ar | HIGH |
| dayjs | ^1.11.23 | Localized date display | Epoch-ms storage per docs/04; tiny | HIGH |
| expo-build-properties | ~57.0.21 | minSdk / deploymentTarget / kotlinVersion | Set iOS 16.0 (docs/04; floor is 15.1 so valid) and Android minSdk 33 (valid choice above floor 24 — note it cuts Android 12-and-below reach, ~product decision) | HIGH |
| expo-notifications | ~57.0.20 | Local notifications only | Release 3; defer installation until then | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| typescript ~6.0.3 (installed) | Strict typing | Keep `strict` + `noUncheckedIndexedAccess` per docs/04 |
| vitest ^5.0.1 + @vitest/coverage-v8 | Unit tests (services, repos, migrations, entitlements, backup validation) | Pure-logic tests only; inject fake DB per docs/04 — no RN runtime needed |
| @testing-library/react-native ^14.0.1 | Component/hook tests | Peers react >=19, RN >=0.78 — matches SDK 57 |
| tailwindcss ^3.4.17 | NativeWind build-time compiler (devDep) | NEVER tailwind 4.x with NativeWind 4.x |
| eslint-config-expo (^57.x) + prettier | Lint/format | Zero-warning CI per docs/04 |
| eas-cli | EAS Build (development / preview / production) | Dev build mandatory: MMKV, quick-crypto and IAP are native modules; Expo Go cannot load them |

## Installation

```bash
# Expo-managed native modules (pins SDK 57 versions exactly)
npx expo install expo-sqlite expo-print expo-file-system expo-sharing \
  expo-document-picker expo-localization expo-secure-store expo-crypto \
  expo-build-properties expo-iap

# JS libraries + native modules needing plain npm install
npm install react-native-mmkv react-native-nitro-modules \
  react-native-quick-crypto react-native-quick-base64 \
  zustand zod react-hook-form @hookform/resolvers \
  i18next react-i18next dayjs nativewind

# Dev dependencies
npm install -D tailwindcss@^3.4.17 prettier-plugin-tailwindcss \
  vitest @vitest/coverage-v8 @testing-library/react-native prettier

# NativeWind wiring (one-time)
# babel.config.js: presets [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"]
# metro.config.js: wrap with require("nativewind/metro").withNativeWind(config, { input: "./global.css" })
# import "./global.css" in app/_layout.tsx; add tailwind.config.js with nativewind/preset

# Then regenerate native project (MMKV + quick-crypto are native)
npx expo prebuild --clean   # or: eas build --profile development
```

If docs/04's letter must be kept on IAP, substitute `npm install react-native-iap react-native-nitro-modules@~0.36.5` and add `"kotlinVersion": "2.2.0"` via expo-build-properties (see variant below).

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| expo-iap ^5.6 | react-native-iap ^16.6 | Only if Nitro-based API is preferred; then pin nitro ~0.36.5 + kotlin 2.2.0 and smoke-test early — it is the same OpenIAP core |
| react-native-quick-crypto | @noble/hashes + @noble/ciphers | If ever avoiding all extra native modules: audited, maintained pure-JS crypto; PBKDF2 210k becomes multi-second — acceptable only because backups are rare, manual actions |
| expo-sqlite + hand migrations | Drizzle ORM (expo-sqlite driver) | Only if SQL-in-repositories burden grows; docs/04 explicitly rejects ORM — keep raw SQL per docs/05 |
| expo-sqlite (unencrypted) | SQLCipher via expo-sqlite `useSQLCipher` config plugin + `PRAGMA key` | If threat model changes to on-device-attacker; costs app size; current decision (OS sandbox + encrypted exports) stands |
| MMKV encrypted instance | expo-secure-store for everything | Never for bulk values — SecureStore caps ~2KB per entry |
| FlatList | FlashList v2 | Only if a list exceeds ~200 items (docs/04 threshold) |
| expo-print | react-native-html-to-pdf | Never — expo-print is first-party, SDK-matched, offline |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **crypto-js** | Officially discontinued ("no longer maintained"); pure-JS PBKDF2 @210k = seconds of blocking on low-end phones; weak historical defaults (must remember to set SHA-256 + iterations) | react-native-quick-crypto ^1.1.7 (or @noble/*) |
| **tailwindcss v4** with NativeWind | NativeWind 4.x peer requires `>3.3.0` — Tailwind 4 is unsupported and breaks the build | tailwindcss ^3.4.17 |
| **NativeWind v5** | Pre-release; API instability risk for a shipping product | NativeWind ^4.2.7 until v5 goes stable |
| **expo-in-app-purchases** | Deprecated and absent from current Expo SDKs | expo-iap or react-native-iap |
| **RevenueCat / react-native-purchases** | Cloud entitlement service — violates the zero-cloud core promise and docs/04 interdits | expo-iap with local MMKV-encrypted entitlements |
| **i18next-http-backend / async storage plugin** | Network-at-boot violates the offline budget; RN bundling makes static JSON the correct pattern | Static `import` of locale JSON + `initReactI18next` |
| **legacy expo-file-system API** | Classic functions throw at runtime when imported from `'expo-file-system'` in SDK 57 | `File` / `Directory` / `Paths` (or explicit `expo-file-system/legacy` during migration only) |
| AsyncStorage for critical data | Slow, no encryption; docs/04 rejects | MMKV (standard + encrypted instances) |
| moment.js | Deprecated by its own maintainers; huge | dayjs |
| Remote push / analytics SaaS / any cloud SDK | Violates the privacy promise and docs/04 interdits | Local SQLite `event` table, manual export |

## Stack Patterns by Variant

**IAP library decision (the one open implementation choice docs/04 leaves):**
- If lowest-friction SDK 57 integration wins: use **expo-iap ^5.6.2** — Expo Module, `npx expo install`, StoreKit 2 + Play Billing 8 via the OpenIAP core, no Nitro version juggling with MMKV. Recommended.
- If docs/04 must be followed literally: use **react-native-iap ^16.6.1**, but then you MUST (a) pin `react-native-nitro-modules` to `~0.36.5` (its peer range — do not let npm hoist 0.37.x alongside, nitro is a singleton native module), (b) set `kotlinVersion: "2.2.0"` via expo-build-properties, (c) accept that the GitHub repo is archived upstream (npm package continues from the openiap monorepo). Test purchase + restore on both stores in the first preview build.
- Both libraries keep entitlements local: purchase → store entitlement in encrypted MMKV → read locally first, verify with store only on explicit purchase/restore action. No server needed.

**Backup encryption stack (F09):**
- Generate salt (16 B) + IV (16 B) with `expo-crypto.getRandomBytes`; derive key with PBKDF2-SHA256 — keep >=210,000 iterations (docs/04); with quick-crypto native speed, use OWASP's current 600,000 at negligible cost. AES-256-CBC encrypt, then HMAC-SHA256 over ciphertext (encrypt-then-MAC) — matches docs/05's backup format v1. Write with `new File(Paths.document, "backup.babylog")`. Restore: HMAC check → Zod validation → `withExclusiveTransactionAsync` → rollback on failure.
- Native crypto (quick-crypto) because the project already ships a dev build; noble libs only if a zero-native constraint ever appears.

**Zustand + MMKV persistence (docs/04 pattern, verified current):**
```ts
const storage = createJSONStorage(() => ({
  setItem: (k, v) => mmkv.set(k, v),
  getItem: (k) => mmkv.getString(k) ?? null,
  removeItem: (k) => mmkv.delete(k),
}));
// useSettingsStore → standard MMKV instance; useEntitlementsStore → encrypted instance
```

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| expo ~57.0.x | RN 0.86.x, React 19.2.x, TS ~6.0.x | Installed scaffold already matches; do not bump RN independently of SDK |
| nativewind 4.2.7 | tailwindcss ^3.4.17 | Tailwind 4.x breaks it; NativeWind 5 pre-release requires different setup |
| react-native-mmkv 4.3.2 | react-native-nitro-modules (peer `*`; latest 0.37.1 OK) | Nitro = New Architecture only; fine on RN 0.86 |
| react-native-quick-crypto 1.1.7 | nitro >=0.31.2, quick-base64 >=3, expo >=48 | Coexists with MMKV on a single nitro install |
| react-native-iap 16.6.1 | nitro **^0.36.5**, kotlin 2.2.0 | Pin nitro to 0.36.x — conflicts with latest 0.37.x; singleton module |
| expo-iap 5.6.2 | expo (peer `*`), no nitro | Cleanest on SDK 57 |
| zod 4.6.5 | @hookform/resolvers >=5.x (`^3.25 \|\| ^4`) | Use `zodResolver` from `/zod` entry |
| react-i18next 17.0.14 | i18next >=26.2 | Keep the pair on these majors together |
| @testing-library/react-native 14.0.1 | react >=19, RN >=0.78 | Matches SDK 57 |
| expo-file-system ~57.0.7 | — | New API default; legacy needs explicit `/legacy` subpath |
| iOS deploymentTarget 16.0 (docs/04) | RN 0.86 floor is 15.1 | Valid; set via expo-build-properties |
| Android minSdk 33 (docs/04) | RN 0.86 floor is API 24 | Valid but cuts Android 12-and-below reach — flag to product, do not silently change |

## Confidence Notes

- **HIGH** = verified in first-party SDK 57 artifacts on disk (`node_modules/expo/bundledNativeModules.json`, RN 0.86.3 sources, scaffold `package.json`) plus official Expo SDK 57 docs.
- **MEDIUM** = npm registry `latest` metadata + official docs/repo READMEs fetched 2026-09-18 (two independent sources in agreement); the GSD classify-confidence seam caps remote-web findings below HIGH.
- **MEDIUM-HIGH/MMKV-encryption** = MMKV's AES-CFB-128 cipher is from MMKV's published design (not re-verified this session); irrelevant to roadmap, relevant only if an auditor asks.

## Sources

- Local SDK 57 artifacts — `node_modules/expo/bundledNativeModules.json` (exact ~57.0.x pins), `node_modules/react-native/scripts/cocoapods/helpers.rb` (iOS 15.1 floor), scaffold `package.json` (expo 57.0.24 / RN 0.86.3 / React 19.2.3) — HIGH
- npm registry `/<pkg>/latest` (fetched 2026-09-18) — react-native-mmkv 4.3.2, nativewind 4.2.7, react-native-iap 16.6.1, expo-iap 5.6.2, zod 4.6.5, @hookform/resolvers 5.9.1, zustand 5.0.15, react-native-quick-crypto 1.1.7, expo-sqlite 57.0.3, expo-print 57.0.2, expo-file-system 57.0.7, i18next 26.4.2, react-i18next 17.0.14, tailwindcss 4.3.3 (v3 line required), react-native-nitro-modules 0.37.1, vitest 5.0.1, @testing-library/react-native 14.0.1, react-hook-form 7.88.0, dayjs 1.11.23 — MEDIUM
- Expo SDK 57 changelog (https://expo.dev/changelog/sdk-57) — RN 0.86.x, React 19.2 — MEDIUM
- Expo SDK 57 docs: expo-sqlite (API, WAL/foreign_keys, SQLCipher `useSQLCipher` plugin), expo-file-system (new File/Directory/Paths default, `expo-file-system/legacy`), expo-print (`printToFileAsync`, WKWebView local-URL limit), IAP guide (features expo-iap + RevenueCat only) — MEDIUM
- NativeWind v4 install docs (https://www.nativewind.dev) — tailwindcss ^3.4.17, v5 pre-release banner — MEDIUM
- react-native-iap README (github.com/hyochan/react-native-iap, archived → hyodotdev/openiap) — Nitro requirement, Play Billing 8, StoreKit 2, kotlin 2.2.0 — MEDIUM
- expo-iap README (OpenIAP, StoreKit 2 / Billing 8.x, `npx expo install`) — MEDIUM
- crypto-js README (github.com/brix/crypto-js) — "discontinued / no longer maintained", last release 4.2.0 — HIGH (verbatim quote)
- reactwg/react-native-releases `docs/support.md` — RN 0.86: Android 7.0 min, Xcode 16.1 min — MEDIUM

---
*Stack research for: BabyLog — offline-first newborn tracker (Expo SDK 57)*
*Researched: 2026-09-18*
