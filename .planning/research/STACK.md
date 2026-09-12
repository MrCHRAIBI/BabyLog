# Stack Research

**Project:** BabyLog Offline — local-first newborn tracker (100% offline, zero backend)
**Target runtime:** Expo SDK 57 / React Native 0.86.3 / React 19.2.3 / New Architecture
**Researched:** 2026-09-12
**Confidence:** HIGH (versions verified against the SDK 57 shipped version map, npm registry peer-dependency data, and docs.expo.dev/versions/v57.0.0 on 2026-09-12)

## Verdict in one paragraph

The repo is already scaffolded on a coherent SDK 57 baseline (expo ~57.0.22, RN 0.86.3, expo-router ~57.0.21, Reanimated 4.5.1 + react-native-worklets 0.10.1, typedRoutes + reactCompiler experiments). Everything the specs mandate installs cleanly on top of it today. The one contested choice — NativeWind — is settled: **NativeWind v4.2.6 + Tailwind v3.4.x is the only stable pairing** (v5 is still `5.0.0-preview.4`); the spec's "NativeWind v4" assumption is correct and needs no change. Three spec-doc assumptions ARE outdated for SDK 57 and must be corrected at scaffold time: (1) `react-native-mmkv/plugin` no longer exists (MMKV v4 is a Nitro module with no config plugin), (2) `expo-file-system` legacy functions (`writeAsStringAsync` etc.) **throw at runtime** from the main entry on SDK 57 — use the new `File`/`Directory`/`Paths` API or `expo-file-system/legacy`, (3) the AdMob config plugin props changed (`userTrackingUsageDescription` string, not `userTrackingPermission` boolean; `childDirectedTreatment`/`maxAdContentRating` are runtime `setRequestConfig` options, not plugin props).

---

## Spec-doc-vs-SDK57 conflicts (explicit resolutions)

| # | docs/04 says | Reality on SDK 57 (verified) | Resolution |
|---|-------------|------------------------------|------------|
| 1 | "Expo SDK 53+" | Repo is SDK 57 (expo ~57.0.22, RN 0.86.3). All `expo-*` packages are now SDK-versioned (`~57.0.x`) — install with `npx expo install`, never bare `npm install`. | Keep SDK 57. Pin every expo package from the map below (matches `node_modules/expo/bundledNativeModules.json`). **HIGH** |
| 2 | "Expo Router v4" | SDK 57 ships `expo-router ~57.0.21` (SDK-versioned line, post-v4 generation). Typed routes via `experiments.typedRoutes: true` — already set in app.json. | Keep scaffolded `expo-router ~57.0.21`. File-based routing/typed routes behave as specced. **HIGH** |
| 3 | `react-native-mmkv/plugin` in app.json plugins | MMKV **v4.3.2 is a Nitro Module**: config plugin **removed** (no `app.plugin.js` in the published tarball). Requires peer `react-native-nitro-modules`. | No plugin entry. Install `react-native-mmkv` + `react-native-nitro-modules` together via `npx expo install`. **HIGH** |
| 4 | MMKV `new MMKV()` usage | MMKV v4 API changed to `createMMKV({ encryptionKey, encryptionType })`. Encryption default is **AES-128** — you must pass `encryptionType: 'AES-256'` explicitly to honor the security spec. | Use `createMMKV({ ..., encryptionType: 'AES-256' })` for the encrypted instance. **HIGH** |
| 5 | expo-file-system with `writeAsStringAsync`/`readAsStringAsync` | On SDK 57 the default export is the new object API (`import { File, Directory, Paths }`). Legacy functions **throw at runtime** from the main entry; they only work via `import * as FileSystem from 'expo-file-system/legacy'`. | Write backup/PDF code against the new API: `new File(Paths.document, name).write(str)`; `Paths.document`/`Paths.cache`; Android `file.contentUri` for sharing. Legacy import only if a shim is needed. **HIGH** |
| 6 | AdMob plugin props `userTrackingPermission: false`, `childDirectedTreatment: false`, `maxAdContentRating: "G"` | v16.5.0 plugin props (read from shipped `.d.ts`): `androidAppId`, `iosAppId`, `delayAppMeasurementInit`, `optimizeInitialization`, `optimizeAdLoading`, `skAdNetworkItems`, `userTrackingUsageDescription` (string). No `userTrackingPermission` boolean, no `childDirectedTreatment`, no `maxAdContentRating`. | Omit `userTrackingUsageDescription` entirely (no ATT prompt = no IDFA tracking). Set `childDirectedTreatment`/`maxAdContentRating` at runtime via `setRequestConfig({ maxAdContentRating: 'G', childDirectedTreatment: false })` in `core/ads`. **HIGH** |
| 7 | `expo-print` "orientation" option | `printToFileAsync` has NO `orientation` option (orientation only exists on iOS `printAsync`). Portrait is default; landscape is done via CSS `@page { size: landscape }`. | Use `printToFileAsync({ html })` + CSS `@page`. Pediatric PDF is portrait anyway. **HIGH** |
| 8 | babel: reanimated plugin in babel.config.js | On SDK 57, Reanimated 4.5.1 + `react-native-worklets 0.10.1` are configured **automatically by babel-preset-expo**. Never add `react-native-reanimated/plugin` (wrong location, double-registration errors). | Only `["babel-preset-expo", { jsxImportSource: "nativewind" }]` + `"nativewind/babel"`. **HIGH** |
| 9 | "expo-iap inexistant/immature" (rejected alternative) | expo-iap 5.6.0 exists and is active (sibling project in hyochan's OpenIAP monorepo, same core as react-native-iap). react-native-iap itself is NOT deprecated — "actively maintained — development simply moved home" to OpenIAP; npm package name unchanged. | Spec decision stands (react-native-iap 16.6.0). Noted for due diligence only. **HIGH** |

---

## Recommended Stack

### Core Technologies (already scaffolded — keep)

| Technology | Version | Purpose | Why / Confidence |
|------------|---------|---------|------------------|
| expo | ~57.0.22 | Runtime, config plugins, prebuild, EAS | Repo baseline; latest stable SDK. **HIGH** |
| react-native | 0.86.3 | Native runtime (New Architecture default) | Paired with SDK 57. **HIGH** |
| react | 19.2.3 | UI runtime | SDK 57 pairing. **HIGH** |
| expo-router | ~57.0.21 | File-based navigation, typed routes | SDK-versioned; `main: "expo-router/entry"` already set; `experiments.typedRoutes: true` already on. **HIGH** |
| react-native-reanimated | 4.5.1 | Gestures/animations (NativeWind peer) | Already installed. SDK 57 generation uses the split `react-native-worklets` package — **do not downgrade and do not add babel plugins manually**. **HIGH** |
| react-native-worklets | 0.10.1 | Worklet runtime under Reanimated 4 | Auto-configured by babel-preset-expo. **HIGH** |
| react-native-gesture-handler | ~2.32.0 | Native gestures | Already installed. **HIGH** |
| react-native-screens | ~4.26.0 | Native screen stacking | Already installed (expo-router peer). **HIGH** |
| react-native-safe-area-context | ~5.7.0 | Safe areas (NativeWind peer) | Already installed. **HIGH** |
| typescript | ~6.0.3 | Strict typing (`noUncheckedIndexedAccess`) | Compatible with the whole stack (react-i18next 17 peers allow TS ^5\|\|^6\|\|^7). **HIGH** |

### Core Technologies (to add)

| Technology | Version | Purpose | Why / Confidence |
|------------|---------|---------|------------------|
| nativewind | 4.2.6 | Tailwind styling (sole styling paradigm) | Latest stable. **v5 is still 5.0.0-preview.4 — do not adopt.** 4.2.6 (2026-06-22) ships Metro 0.83+/0.84+ forward-compat fixes ("Expo SDK 55/56" hot-reload fix + metro-file-map forward compatibility), which is the closest verified signal to SDK 57's Metro. Smoke-test on a dev build at scaffold. **HIGH (version) / MEDIUM (SDK 57-specific)** |
| tailwindcss | ~3.4.19 | CSS engine for NativeWind 4 | NativeWind 4 requires the Tailwind **v3** line (`tailwindcss@^3.4.17` per official install docs; v4 engine unsupported until NativeWind 5). Do NOT install tailwindcss 4.x. **HIGH** |
| react-native-mmkv | 4.3.2 | KV storage: settings, timer, quotas, encrypted entitlements | Latest (2026-06). v4 = Nitro module, RN >= 0.76 — fine on 0.86. JSI/C++ = sync reads at 3am with zero bridge latency; this is why MMKV and not AsyncStorage. **HIGH** |
| react-native-nitro-modules | ~0.37.1 | Nitro runtime required by MMKV 4.3.2 and react-native-iap 16.x (shared peer) | Install once; both native libs depend on it. **HIGH** |
| expo-sqlite | ~57.0.3 | Local relational DB (raw SQL in typed repositories only) | SDK version map. Sync API fully supported on SDK 57: `openDatabaseSync`, `runSync`, `getAllSync`, `withTransactionSync`, `withExclusiveTransactionAsync` (the exclusive variant is the correct one for backup import — queries must run on the `txn` object). `enableChangeListener: false` default fits (no sync). **HIGH** |
| zustand | 5.0.15 | Global state | Latest; React 19-native (useSyncExternalStore). `persist` + `createJSONStorage(() => mmkvStorage)` adapter is the standard MMKV integration; `partialize` supported (spec mandate). **HIGH** |
| zod | 4.6.2 | Validation at every boundary (forms, backup import, DB mirrors) | v4 is the stable line now. `@hookform/resolvers` 5.x peers `zod ^3.25.0 \|\| ^4.0.0` — verified. **HIGH** |
| react-hook-form | 7.88.0 | Forms (uncontrolled, minimal re-renders) | Latest 7.x. **HIGH** |
| @hookform/resolvers | 5.9.1 | `zodResolver` for RHF+Zod | Latest; zod v4 supported. **HIGH** |
| expo-crypto | ~57.0.3 | `randomUUID()` for all IDs; random salt for PBKDF2 | SDK version map. Also the source of randomness — do NOT use `crypto-js.random` for salts. **HIGH** |
| expo-secure-store | ~57.0.4 | Master key in Keychain/Keystore (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`) | SDK version map. Caveat: iOS per-value limit 2048 bytes — a 32-byte master key fits trivially. **HIGH** |
| crypto-js | 4.2.0 | AES-256 + PBKDF2 (100k iters) — pure JS, per spec mandate | Last publish 4.2.0; upstream README states "Active development of CryptoJS has been discontinued." Frozen but stable and battle-tested; acceptable per the explicit quick-crypto ban. Mitigation: generate all randomness via `expo-crypto`, keep the crypto wrapper (`core/utils/crypto.ts`) single-file so it can be swapped in V2. **HIGH (version) / accepted-risk (maintenance)** |
| dayjs | 1.11.23 | Dates, epoch ms, timezone display | Latest; ~2 kB; chainable; `utc`/`duration`/`timezone` plugins. **HIGH** |
| i18next | 26.4.2 | i18n core (en, fr, es, it, ja) | Latest major. **HIGH** |
| react-i18next | 17.0.13 | React bindings | Peers: react >= 16.8, i18next >= 26.2, TS ^5\|\|^6\|\|^7 — all satisfied. **HIGH** |
| expo-localization | ~57.0.2 | Locale detection (`getLocales()[0].languageCode`), feeds i18next fallback chain | SDK version map. **HIGH** |
| expo-notifications | ~57.0.18 | Local notifications only (J30 backup reminder) | SDK version map. Plugin options on SDK 57: `icon`, `color`, `defaultChannel`, `sounds`, `enableBackgroundRemoteNotifications` (iOS, default **false — keep false**, this is a local-only app). Android 13+ `POST_NOTIFICATIONS` via `Notifications.requestPermissionsAsync()` — request only when the user enables the backup reminder. **HIGH** |
| expo-haptics | ~57.0.3 | Haptic feedback on 1-tap tracking (core UX) | SDK version map; no config plugin needed. **HIGH** |
| expo-print | ~57.0.2 | HTML → PDF pediatric export (`printToFileAsync({ html })`) | SDK version map, non-deprecated. iOS WKWebView cannot load local asset URLs → inline images as base64 (confirms spec annex §3). No `orientation` option — use CSS `@page`. **HIGH** |
| expo-file-system | ~57.0.7 | Write PDF/backup files | **New API on SDK 57**: `import { File, Directory, Paths } from 'expo-file-system'`. `new File(Paths.document, 'x.babylog').write(str)`; `file.textSync()`; legacy funcs throw from main entry (`expo-file-system/legacy` if ever needed). **HIGH** |
| expo-sharing | ~57.0.19 | Native Share Sheet for PDF + `.babylog` backup | `Sharing.shareAsync(uri, { mimeType, UTI, dialogTitle })` unchanged on SDK 57. PDF: `mimeType: 'application/pdf'`, iOS `UTI: 'com.adobe.pdf'`. Android can also use `file.contentUri` from the new FS API. **HIGH** |
| expo-asset | ~57.0.17 | Font/asset bundling (spec addendum v2 item 4) | SDK version map. **HIGH** |
| react-native-iap | 16.6.0 | IAP StoreKit 2 / Play Billing (Lifetime + subs) | Latest. NOT deprecated — maintained in the OpenIAP monorepo, npm package unchanged. Nitro-based since v14, requires RN >= 0.79 + `react-native-nitro-modules` (already added for MMKV). The package itself is the Expo config plugin (`"react-native-iap"` in plugins). Expo Go unsupported → dev build required (already required by MMKV). Init deferred until after onboarding per zero-network-at-boot. **HIGH (version/status) / MEDIUM (API details at implementation time — v14+ API renamed several methods, verify signatures when building `core/billing`)** |
| react-native-google-mobile-ads | 16.5.0 | AdMob Native/Banner/Rewarded + Google UMP consent | Latest. Officially supports Old AND New Architecture (iOS fully migrated; Android runs most formats through the interop layer — works, expect occasional New-Arch interop quirks; Banner/Native/Rewarded are the widely-used paths). UMP is built in: `import { AdsConsent } from 'react-native-google-mobile-ads'` → `AdsConsent.gatherConsent()`, `getConsentInfo().canRequestAds`, `AdsConsentStatus.OBTAINED`. Defer `mobileAds().initialize()` until after onboarding AND set `delayAppMeasurementInit: true` so nothing phones home at boot. **HIGH (version) / MEDIUM (New-Arch Android interop)** |

### Development Tools

| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| eslint-config-expo | ~57.0.2 | Lint baseline | SDK-versioned. **Flat config**: `eslint.config.js` → `defineConfig([require('eslint-config-expo/flat'), ...])` with `defineConfig` from `eslint/config`. Add `eslint-config-prettier` 10.1.8 last. **HIGH** |
| prettier | 3.9.6 | Formatting | Pair with `prettier-plugin-tailwindcss` 0.8.1 (class sorting for NativeWind). **HIGH** |
| vitest | 5.0.0 | Unit tests (services, repos, prediction, ads rules) | Requires Node >= 22.12. No official Expo RN runner — correct fit here because the spec already confines tests to pure-JS services/repos with DI (DbAdapter). `vitest.config.ts` with `resolve.alias: { '@': './src' }`, `environment: 'node'`, coverage via `@vitest/coverage-v8` 5.0.0. **HIGH (tooling) / MEDIUM (no first-class RN support — this is by design for this architecture)** |
| @vitest/coverage-v8 | 5.0.0 | Coverage thresholds (80% services/repos) | Must match vitest major. **HIGH** |
| better-sqlite3 | 13.0.3 | In-memory SQLite for repository tests (DbAdapter test impl) | Spec addendum v2 item 2 (interface DbAdapter; prod = expo-sqlite, test = better-sqlite3). Node-only, used exclusively by vitest. **HIGH** |
| @types/crypto-js | 4.2.2 | Types for crypto-js | crypto-js ships no types. **HIGH** |
| expo-dev-client | ~57.0.19 | Dev builds (required: MMKV, IAP, AdMob are all unusable in Expo Go) | Install before first EAS dev build. **HIGH** |
| babel-preset-expo | (ships with expo) | Babel preset — worklets + JSX import source | Listed as dev dep by NativeWind docs; already present transitively via expo. **HIGH** |

---

## Installation

```bash
# Expo SDK-versioned modules — ALWAYS via expo install (pins ~57.0.x automatically)
npx expo install expo-sqlite expo-crypto expo-secure-store expo-notifications \
  expo-haptics expo-print expo-file-system expo-sharing expo-localization \
  expo-asset expo-dev-client

# Nitro-based community modules (single install covers both)
npx expo install react-native-mmkv react-native-nitro-modules

# IAP + Ads
npx expo install react-native-iap react-native-google-mobile-ads

# Styling (NativeWind 4 = Tailwind v3 line — do NOT install tailwindcss 4)
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npm install -D tailwindcss@~3.4.19 prettier prettier-plugin-tailwindcss eslint-config-expo@~57.0.2

# State / forms / validation / dates / i18n / crypto
npm install zustand zod react-hook-form @hookform/resolvers dayjs i18next react-i18next crypto-js
npm install -D @types/crypto-js

# Testing
npm install -D vitest @vitest/coverage-v8 better-sqlite3 @types/better-sqlite3 eslint-config-prettier
```

---

## Exact scaffold configuration

### babel.config.js (create — repo has none today)

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

- `nativewind/babel` goes **last**, after babel-preset-expo.
- **Do NOT add** `react-native-reanimated/plugin` or `react-native-worklets/plugin` — babel-preset-expo on SDK 57 auto-configures worklets (Reanimated 4 + react-native-worklets are already in package.json).
- NativeWind docs require `babel-preset-expo` present as a dev dep (already available transitively).

### metro.config.js (create)

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### global.css + type reference (NativeWind)

```css
/* global.css (project root, imported once in src/app/_layout.tsx) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```ts
// nativewind-env.d.ts (project root — do NOT name it nativewind.d.ts, docs warn types then fail to load)
/// <reference types="nativewind/types" />
```

### tailwind.config.js (dark-only OLED tokens)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#14121e",       // app background (spec)
        cream: "#F9ECE5",       // text (spec)
        primary: "#7665FA",     // indigo (spec)
      },
      fontFamily: { sans: ["PlusJakartaSans_400Regular", /* …weights */] },
    },
  },
  plugins: [],
};
```

### app.json — final plugins array (SDK 57)

```jsonc
{
  "expo": {
    "userInterfaceStyle": "dark",
    "backgroundColor": "#14121e",
    "newArchEnabled": true,
    "experiments": { "typedRoutes": true, "reactCompiler": true },
    "plugins": [
      "expo-router",
      ["expo-splash-screen", { "backgroundColor": "#14121e", "image": "./assets/images/splash-icon.png" }],
      "expo-secure-store",
      ["expo-notifications", { "color": "#7665FA", "defaultChannel": "backup-reminder" }],
      ["react-native-google-mobile-ads", {
        "androidAppId": "ca-app-pub-XXXXX~YYYYY",
        "iosAppId": "ca-app-pub-XXXXX~ZZZZZ",
        "delayAppMeasurementInit": true,        // critical: no measurement calls at boot (offline boot budget)
        "optimizeInitialization": true,
        "optimizeAdLoading": true
        // NO userTrackingUsageDescription → no ATT prompt, no IDFA (privacy spec)
      }],
      "react-native-iap",
      ["expo-build-properties", { "android": { "minSdkVersion": 33 } }],
      ["expo-file-system", { "enableFileSharing": true, "supportsOpeningDocumentsInPlace": true }]
    ]
  }
}
```

Plugin notes (all verified against shipped plugin sources/docs):

| Plugin | On SDK 57 |
|--------|-----------|
| `expo-router` | Keep (already present). |
| `expo-secure-store` | Optional but harmless; enables the FaceID permission prop if ever needed. Master key needs no plugin config. |
| `expo-notifications` | `icon`/`color`/`defaultChannel`/`sounds`/`enableBackgroundRemoteNotifications` (default false — keep, local-only app). |
| `react-native-google-mobile-ads` | Package IS the plugin (`app.plugin.js`). Props are exactly: `androidAppId`, `iosAppId`, `delayAppMeasurementInit`, `optimizeInitialization`, `optimizeAdLoading`, `skAdNetworkItems`, `userTrackingUsageDescription`. `childDirectedTreatment=false` and `maxAdContentRating="G"` are **runtime** `setRequestConfig()` calls in `core/ads`, NOT plugin props (docs/04 §app.json is wrong here). |
| `react-native-iap` | Package IS the plugin (v14+ Nitro line). IAP docs show it alongside `expo-build-properties` (kotlinVersion override if the Kotlin pairing complains at prebuild). |
| ~~`react-native-mmkv/plugin`~~ | **REMOVED in MMKV v4** — do not add; Nitro autolinking handles everything. |
| `expo-haptics` | No plugin needed (docs/04 lists it; omit). |
| `expo-build-properties` | For `minSdkVersion: 33` (spec) and any Kotlin override IAP needs. |
| `expo-file-system` | Optional: `enableFileSharing`/`supportsOpeningDocumentsInPlace` make `Paths.document` visible in the iOS Files app — recommended so users can retrieve `.babylog` backups without Share Sheet. |

### MMKV instances (spec-conformant, v4 API)

```ts
// core/storage/mmkv.ts
import { createMMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";

export const storage = createMMKV();                          // settings:/timer:/quota:/ads:/onboarding:

// master key: 32 random bytes (expo-crypto), base64 in Keychain/Keystore
export const encryptedStorage = createMMKV({
  id: "babylog-secure",
  encryptionKey: masterKeyFromSecureStore,                    // derived/stored via expo-secure-store
  encryptionType: "AES-256",                                  // MANDATORY: v4 default is AES-128
});
```

### Zustand persist over MMKV (partialize mandate)

```ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/core/storage/mmkv";

const mmkvAdapter = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

export const useTimerStore = create(
  persist(
    (set) => ({ /* … */ }),
    {
      name: "timer:active",
      storage: createJSONStorage(() => mmkvAdapter),
      partialize: (s) => ({ type: s.type, startedAt: s.startedAt, isRunning: s.isRunning }), // MANDATORY per spec
    },
  ),
);
```

### Vitest (services/repos only, per spec)

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: { provider: "v8", include: ["src/features/*/services/**", "src/features/*/repository/**"] },
  },
});
```

Repositories depend only on the `DbAdapter` interface (spec addendum v2); tests inject a `better-sqlite3` in-memory adapter. React-component testing is out of scope for vitest (if ever needed, `jest-expo ~57.0.5` is the Expo-official option — do not mix both runners casually).

### Runtime config snippets the stack forces

```ts
// core/ads — runtime AdRequest config (NOT plugin props on v16)
import { setRequestConfig, AdsConsent, mobileAds } from "react-native-google-mobile-ads";
setRequestConfig({ maxAdContentRating: "G", childDirectedTreatment: false });
// after onboarding && !premium:
await AdsConsent.gatherConsent();                 // UMP, EEA/UK; wraps official UMP SDK
if ((await AdsConsent.getConsentInfo()).canRequestAds) await mobileAds().initialize();
```

```ts
// core/database — expo-sqlite SDK 57 (sync API is fully supported)
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseSync("babylog.db", { enableChangeListener: false });
db.execSync("PRAGMA journal_mode = WAL;");
db.execSync("PRAGMA foreign_keys = ON;");
// backup import: await db.withExclusiveTransactionAsync(async (txn) => { … txn.runSync(…) });
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| NativeWind 4.2.6 + Tailwind 3.4.x | NativeWind 5.0.0-preview.4 (Tailwind v4 engine) | Only if v5 reaches stable AND the project wants Tailwind v4 plugins. Not before launch. |
| react-native-mmkv 4.3.2 | expo-secure-store as general KV / AsyncStorage | Never for this project (spec bans AsyncStorage; secure-store is 2KB-limited secrets storage). |
| react-native-iap 16.6.0 | expo-iap 5.6.0 | If react-native-iap ever abandons the npm line — expo-iap shares the same OpenIAP core, migration is contained inside `core/billing/iapService.ts`. |
| crypto-js 4.2.0 | react-native-quick-crypto | **Forbidden by spec** (C++ JSI binding). If PBKDF2 100k proves too slow on mid-range devices, spec addendum authorizes 50k iters before any library change. |
| Vitest 5 | jest-expo ~57.0.5 | If component/hook testing becomes a requirement (Expo-official RN test runner). |
| FlatList | @shopify/flash-list 2.0.2 | V1.1 if unlimited history > 200 items (per docs/04 — correct call; flash-list 2.0.2 is in the SDK 57 map when needed). |

## What NOT to Use (spec bans, re-verified 2026-09-12)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Firebase / Supabase / any backend | Violates zero-backend + zero-network-at-boot | expo-sqlite + MMKV + encrypted local backup |
| RevenueCat | Server-side entitlements; violates local entitlements | react-native-iap + encrypted MMKV |
| Sentry / Mixpanel / any SaaS analytics | Sends data to third parties | local `error_log` / `event` SQLite tables |
| AsyncStorage | JS-bridge slow, unencrypted | react-native-mmkv |
| Redux / MobX / Jotai | Second state paradigm | zustand 5 |
| styled-components / Tamagui / Gluestack | Second styling paradigm | nativewind 4.2.6 only |
| WatermelonDB / Realm | Native-heavy, sync-oriented, useless mono-device | expo-sqlite + typed repositories |
| react-native-quick-crypto | Forbidden (C++ JSI) | crypto-js 4.2.0 (pure JS) |
| `expo-ads-admob` | Removed/deprecated in modern SDKs | react-native-google-mobile-ads 16.5.0 |
| expo-notifications remote push / Expo push tokens | Requires server + Expo backend; offline violation | local `scheduleNotificationAsync` only |
| Interstitial ads | Banned by product spec | Native/Banner/Rewarded only, hard-capped |
| OneSignal / FCM push | Backend requirement | expo-notifications local |

## Version Compatibility (verified pairings)

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| expo ~57.0.22 | RN 0.86.3, React 19.2.3, TS ~6.0.3 | SDK 57 lockstep (bundledNativeModules.json). |
| nativewind 4.2.6 | tailwindcss ~3.4.19 (NOT 4.x), reanimated 4.5.1, safe-area-context 5.7.0, babel-preset-expo | 4.2.6 patches Metro 0.83+/0.84+ interop (SDK 55/56 era) — closest verified to SDK 57's Metro; smoke-test in dev build. |
| react-native-mmkv 4.3.2 | react-native-nitro-modules ~0.37.1, RN >= 0.76, New Arch | Nitro module. No config plugin. AES-256 must be explicit. No remote Chrome debugging (JSI). |
| react-native-iap 16.6.0 | react-native-nitro-modules (same install), RN >= 0.79 | Nitro since v14. Package = config plugin. Expo Go unsupported. |
| react-native-google-mobile-ads 16.5.0 | expo >= 47, New Arch (iOS full; Android via interop) | UMP (`AdsConsent`) built in. Plugin props changed vs docs/04. |
| zod 4.6.2 | @hookform/resolvers 5.9.1 (peer `^3.25 \|\| ^4`), RHF 7.88 | v4 line is safe. |
| i18next 26.4.2 | react-i18next 17.0.13 (peer `>= 26.2`), TS 6 | Pair exactly; don't mix i18next 25 with react-i18next 17. |
| vitest 5.0.0 | Node >= 22.12, @vitest/coverage-v8 5.0.0, better-sqlite3 13.0.3 | Match vitest/coverage majors. |
| expo-file-system ~57.0.7 | New API default; `expo-file-system/legacy` for old funcs | Legacy funcs **throw** from main entry — the single most likely scaffold-time runtime crash. |

## Stack Patterns by Variant

**If NativeWind hot-reload misbehaves on SDK 57 (styles not updating):**
- Verify `nativewind` is exactly 4.2.6 (the Metro-forward-compat fix), delete `.expo` and restart Metro with `--clear`.
- Escape hatch: NativeWind 5 preview — do not take it before GA; instead pin and report.

**If react-native-iap or google-mobile-ads fails prebuild (Kotlin/AGP mismatch):**
- Add `["expo-build-properties", { "android": { "kotlinVersion": "…" } }]` with the version each library's install docs name; both are the two native libs most likely to drag toolchain requirements.

**If PBKDF2 100k iterations exceeds the 2s budget on mid-range devices:**
- Spec addendum v2 authorizes 50k iterations; keep the iteration count and salt inside the backup envelope so old exports still import.

**If React Compiler (`experiments.reactCompiler: true`, on by default in this template) interacts oddly with NativeWind class components:**
- Disable `reactCompiler` first and re-test; NativeWind's css-interop is the more load-bearing dependency for this product. (No known blocker as of research date; flagging as a cheap first diagnostic.)

## Sources

- `node_modules/expo/bundledNativeModules.json` (SDK 57.0.22 shipped version map) — authoritative exact versions — **HIGH**
- npm registry (`npm view`, versions + peerDependencies + publish dates + tarball inspection for `react-native-mmkv@4.3.2` and `react-native-google-mobile-ads@16.5.0`) — **HIGH**
- https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/ — sync API, transactions, provider — **HIGH**
- https://docs.expo.dev/versions/v57.0.0/sdk/filesystem/ — new File/Directory/Paths API; legacy throws from main entry — **HIGH**
- https://docs.expo.dev/versions/v57.0.0/sdk/notifications/ — plugin options, local scheduling, POST_NOTIFICATIONS — **HIGH**
- https://docs.expo.dev/versions/v57.0.0/sdk/print/ — `printToFileAsync` options, no orientation, WKWebView base64 constraint — **HIGH**
- https://docs.expo.dev/versions/v57.0.0/sdk/sharing/ — `shareAsync(uri, {mimeType, UTI, dialogTitle})` — **HIGH**
- https://www.nativewind.dev/docs/getting-started/installation — NativeWind 4 install: babel/metro/tailwind/types — **HIGH**
- https://github.com/NativeWind/nativewind/releases — 4.2.6 = Metro 0.83+ / "SDK 55/56" fixes; v5 preview status — **HIGH**
- https://github.com/mrousavy/react-native-mmkv (README) — v4 Nitro requirement, `createMMKV` + AES-256 — **HIGH**
- https://github.com/hyochan/react-native-iap (README) — OpenIAP move, Nitro since v14, Expo plugin usage — **HIGH**
- https://github.com/invertase/react-native-google-mobile-ads (README, `docs/european-user-consent.mdx`, shipped `plugin/build/index.d.ts`) — New Arch status, UMP API, plugin props — **HIGH**
- https://github.com/brix/crypto-js — maintenance-discontinued statement, module list — **HIGH**
- unpkg `eslint-config-expo@57.0.2/README.md` — flat-config usage — **HIGH**

---
*Stack research for: BabyLog Offline (local-first Expo SDK 57)*
*Researched: 2026-09-12*
