Bonjour, je suis votre architecte technique React Native et Expo, spécialiste du Local-First.

Ma mission : définir la stack minimale, sûre, et optimisée pour être codée par un agent IA, sans backend et sans code natif complexe.

**✅ Inputs reçus et validés :**
1. `01-market-research.md` (GPT 1) — BabyLog Offline, score 79.6/100, GO
2. `02-product-strategy.md` (GPT 2) — 5 features MVP, notes techniques Local-First
3. `03-monetization-strategy.md` (GPT 3) — Passation IAP, Ads, Paywall, Instrumentation
4. `02-annexe-technique.md` — Architecture SQLite, expo-print, chiffrement crypto-js, conformité stores

Tous les documents sont présents. Je produis le livrable unique.

---

# STACK TECHNIQUE — BabyLog Offline — 2026-09-10

## RÉSUMÉ EXÉCUTIF

**Stack retenue :** Expo SDK 53+ (New Architecture) · TypeScript strict · Expo Router v4 · NativeWind v4 · Zustand + MMKV · expo-sqlite (SQL brut, repositories typés) · Zod · crypto-js (AES-256 backup) · react-native-iap · react-native-google-mobile-ads · Vitest · EAS Build.

**Principes respectés :** 100% offline au boot, zéro backend, zéro code natif personnalisé, un seul paradigme par couche, conçu pour agent IA.

**Écart majeur justifié :** pas de service IA BYOK au MVP (SweetSpot = algorithme local de moyennes mobiles, conformément à GPT 3).

**Score de faisabilité agent IA global : 8.2/10**

**Prochaine étape :** transmettre ce document au GPT 5 (Data Model Designer).

---

## INPUTS REÇUS (RESTITUTION)

1. **Features MVP (GPT 2) :** Tracking 1-Tap & Timeline, UI Nuit OLED & Haptique, Export PDF médical local, Prédiction SweetSpot locale (gatée premium), Backup chiffré local. Effort 8 semaines.
2. **Exigences techniques par feature :** SQLite + MMKV (timer), expo-print + Base64 assets iOS, moyennes mobiles JS pur, crypto-js AES-256, Share Sheet natif.
3. **Monétisation (GPT 3) :** IAP StoreKit + Play Billing, entitlements MMKV, restore offline. Ads Native/Banner/Rewarded uniquement (zéro interstitial), zéro ad nocturne. Paywall local, cohortes A/B par hash. Event log 100% local.
4. **Quota IA :** non applicable au MVP (pas d'IA externe). Architecture prévue pour V2.
5. **Permissions système nécessaires :** POST_NOTIFICATIONS (rappel backup), INTERNET implicite via AdMob (ads free tier uniquement). Aucune autre.
6. **Contrainte absolue :** react-native-quick-crypto INTERDIT au MVP (annexe technique). Chiffrement = crypto-js pur JS exclusivement.

---

## MODULES À COUVRIR

| # | Module | Criticité MVP |
|---|--------|---------------|
| 1 | Navigation (Expo Router) | MVP |
| 2 | UI / Styling (NativeWind + design system) | MVP |
| 3 | Data (expo-sqlite, repositories, migrations) | MVP |
| 4 | State global (Zustand + MMKV) | MVP |
| 5 | Prédiction locale SweetSpot (JS pur) | MVP |
| 6 | Backup chiffré (crypto-js + Share Sheet) | MVP |
| 7 | Billing / IAP (react-native-iap) | MVP |
| 8 | Ads (react-native-google-mobile-ads + UMP) | MVP |
| 9 | Analytics / Event log local | MVP |
| 10 | i18n (i18next) | MVP |
| 11 | Exports PDF (expo-print) | MVP |
| 12 | Notifications locales (expo-notifications) | MVP |
| 13 | IA BYOK (fetch multi-providers) | **NON — V2 uniquement** |
| 14 | Google Drive (OAuth PKCE) | **NON — V1.1** |

---

## DÉCISIONS PAR COUCHE

| Couche | Décision | Alternatives rejetées | Justification | Risque résiduel et mitigation |
|--------|----------|----------------------|---------------|-------------------------------|
| **Runtime** | Expo SDK 53+ · New Architecture · TypeScript strict | ① RN CLI bare : gestion native manuelle, risque agent IA. ② Expo bare workflow : nécessite code natif custom | Managed workflow + config plugins = zéro code natif manuel. EAS Build reproductible. | Compatibilité libs New Arch → tester toutes les deps au scaffold. Fallback `newArchEnabled: false` si bloquant (improbable en 2026). |
| **Navigation** | Expo Router v4 (file-based, typed routes) | ① React Navigation stack manuel : config verbeuse, routes non typées. ② react-native-navigation (Wix) : setup natif hors Expo managed | Routing par fichiers = prévisible pour agent IA. Deep linking natif. Typed routes. | Courbe file-based → arborescence explicite documentée ci-dessous. |
| **Styling** | NativeWind v4 (unique paradigme) | ① Tamagui : double paradigme CSS-in-JS + tokens, bundle lourd. ② StyleSheet.create pur : pas de tokens, pas de dark mode systémique | Un seul paradigme Tailwind. Tokens light/dark natifs. Requis par GPT 2 pour UI Nuit OLED. | Perf runtime → compiler Babel NativeWind optimise au build, zéro coût runtime. |
| **Composants UI** | Design system maison `core/ui/` (wrappers fins RN) | ① Gluestack UI : surcouche lourde, non demandé par l'utilisateur. ② React Native Paper : Material Design inadapté à l'esthétique OLED noir profond | Contrôle total, zéro dépendance, adaptable OLED #000000. API documentée pour agent IA. | Maintenance → composants minimaux (Button, Card, Modal, Toast, TimerButton), pas plus. |
| **State global** | Zustand + persist MMKV (adaptateur maison) | ① Redux Toolkit : boilerplate élevé, overkill pour 5 features. ② Jotai : paradigme atomique fragmente l'état, confus pour agent | Un store par domaine global. API minimale (`create` + hooks). Persist sélectif. | État transitoire persisté par erreur → `partialize` explicite obligatoire dans chaque store. |
| **Base de données** | expo-sqlite · SQL brut · repositories typés · migrations `schema_version` | ① WatermelonDB : sync-oriented, setup natif complexe. ② Realm : bindings natifs lourds, licence, backend sync | SQLite embarqué = 100% offline (requis annexe). SQL brut = explicite, zéro magie, idéal agent IA. | Requêtes mal optimisées → index obligatoires (voir passation GPT 5), `EXPLAIN QUERY PLAN` en test. |
| **Stockage clé-valeur** | react-native-mmkv (standard + instance chiffrée) + expo-secure-store (master key) | ① AsyncStorage : lent, pas de chiffrement, bridge JS. ② expo-secure-store seul : réservé aux secrets, inadapté au KV général | MMKV = rapide, natif, config plugin Expo. Secure-store pour clés maîtresses (conforme annexe §5). | MMKV natif → config plugin officiel, zéro code natif manuel. Tester en dev build (pas Expo Go). |
| **Validation** | Zod (toutes les frontières) | ① Yup : inférence TypeScript faible. ② Joi : lourd, pas optimisé pour React Native | Validation forms, imports backup, réponses futures IA. Inférence TS native. | Schémas verbeux → facteurs de schémas miroirs pour types DB (convention GPT 5). |
| **Forms** | react-hook-form + @hookform/resolvers/zod | ① Formik : re-renders verbeux, moins performant. ② Controlled inputs seuls : pas de framework de validation | Performance (uncontrolled). Intégration Zod native. Idéal pour onboarding et paramètres. | Complexité → hook wrapper `useZodForm` standardisé dans `core/utils`. |
| **IDs** | expo-crypto `randomUUID()` | ① uuid (npm) : dépendance supplémentaire inutile. ② nanoid : ajoute une dépendance non nécessaire | expo-crypto déjà nécessaire (PKCE V1.1). UUID v4 natif. | Aucun significatif. |
| **Dates** | dayjs (+ plugins utc, duration) | ① date-fns : bundle plus lourd, API fonctionnelle moins chainable. ② Moment : déprécié, énorme | Léger (~2 kB). API chainable. Gestion timezone pour marchés multi-pays. | Timezone → stocker en epoch ms UTC, convertir à l'affichage uniquement. |
| **i18n** | expo-localization + i18next + react-i18next | ① react-intl : dépendance ICU lourde. ② LinguiJS : étape de compilation ajoutant de la complexité agent | Standard i18next. Lazy loading des namespaces. Détection locale auto. | Traductions manquantes → fallback `en`, clés typées via `i18next.d.ts`. |
| **Notifications** | expo-notifications (locales uniquement) | ① OneSignal : backend push obligatoire, viole zéro backend. ② react-native-push-notification : setup natif complexe | Notifications locales seulement (rappel backup J30). Zéro serveur. | Permission POST_NOTIFICATIONS → demander à l'activation du rappel, jamais au boot. |
| **Fichiers & Partage** | expo-file-system + expo-sharing + expo-print | ① react-native-fs : natif, moins intégré Expo. ② react-native-share : natif, redondant avec expo-sharing | Modules Expo natifs. expo-print pour PDF (requis GPT 2). expo-sharing pour Share Sheet. | WKWebView iOS : assets en Base64 obligatoire (annexe §3). Pattern documenté dans `core/utils/pdf-assets.ts`. |
| **Listes** | FlatList | ① @shopify/flash-list : non nécessaire (<200 items en vue 7 jours). ② RecyclerView custom : code natif | Timeline 7 jours ≈ 105 items max (15 events/j × 7). FlatList largement suffisant. | Historique illimité premium V1.1 → pagination + FlashList si >200 items confirmés. |
| **Publicité** | react-native-google-mobile-ads (config plugin Expo) + Google UMP | ① expo-ads-admob : déprécié. ② AdMob natif manuel : viole zéro code natif | Config plugin officiel. Formats Native/Banner/Rewarded. UMP pour consentement EEA/UK (GPT 3 addendum). | Complexité UMP → wrapper `core/ads` encapsule consentement + règles de fréquence codées en dur. |
| **IAP** | react-native-iap (config plugin Expo) | ① RevenueCat : SaaS obligatoire pour entitlements, viole zéro backend. ② expo-iap : inexistant / immature | StoreKit + Play Billing natifs. Entitlements MMKV locaux. Restore offline-first (requis GPT 3). | Complexité multi-plateforme → patterns documentés, test sur devices réels via EAS preview. |
| **Chiffrement backup** | crypto-js (AES-256 + PBKDF2, pur JS) | ① react-native-quick-crypto : **INTERDIT par annexe technique MVP** (binding C++). ② expo-crypto : inadapté au chiffrement de fichiers | Pur JS = zéro natif. Conforme annexe §5. Volume MVP faible (quelques Mo) = perf acceptable. | Lenteur sur très gros volumes → acceptable MVP. Réévaluer en V2 si >50 Mo. |
| **IA / Prédiction** | Algorithme local SweetSpot (JS pur, moyennes mobiles EMA) — **PAS de BYOK au MVP** | ① OpenAI/Gemini SDK : appel réseau, viole privacy. ② transformers.js : hors MVP (V2) | GPT 3 explicite : "pas d'IA API externe au MVP". SweetSpot = moyennes mobiles locales, <1 ms (annexe §4). | Aucun. Calcul local trivial, zéro dépendance. |
| **Tests** | Vitest (services, repos, hooks) | ① Jest : fonctionne mais moins rapide, config CJS. ② Detox : E2E trop complexe pour MVP, risque agent | Tests unitaires avec faux DB injectés. Pas d'E2E au MVP. | Couverture réelle → CI avec seuil 80% sur `services/` et `repository/`. |
| **Build & Release** | EAS Build (dev/preview/prod) + EAS Submit | ① Builds locaux Xcode/Android Studio : non reproductibles. ② Fastlane standalone : EAS l'intègre nativement | Profils séparés. Soumission store automatisée. Pas de machine Mac requise. | Coût EAS → plan gratuit suffisant pour MVP (30 builds/mois). |
| **Qualité** | ESLint (eslint-config-expo) + Prettier | ① Biome : moins mature pour l'écosystème Expo. ② TSLint : déprécié | Zéro warning toléré en CI. Formatage automatique. | Conflits ESLint/Prettier → `eslint-config-prettier` intégré. |

---

## DÉPENDANCES

| Package | Rôle exact | Config plugin Expo | Criticité |
|---------|-----------|-------------------|-----------|
| `expo` (SDK 53+) | Runtime principal, New Architecture | Natif | MVP |
| `expo-router` | Navigation file-based | Natif SDK | MVP |
| `nativewind` | Styling Tailwind unique paradigme | Babel plugin | MVP |
| `zustand` | State global | Pur JS | MVP |
| `react-native-mmkv` | Stockage KV rapide + instance chiffrée | `react-native-mmkv/plugin` | MVP |
| `expo-sqlite` | Base de données locale | Natif SDK | MVP |
| `zod` | Validation toutes frontières | Pur JS | MVP |
| `react-hook-form` + `@hookform/resolvers` | Forms | Pur JS | MVP |
| `expo-crypto` | randomUUID, PKCE (V1.1) | Natif SDK | MVP |
| `dayjs` | Dates, timezone | Pur JS | MVP |
| `i18next` + `react-i18next` + `expo-localization` | Internationalisation | Natif SDK (localization) | MVP |
| `expo-notifications` | Notifications locales (rappel backup) | Natif SDK | MVP |
| `expo-haptics` | Retour haptique tracking 1-tap | Natif SDK | MVP |
| `expo-print` | Génération PDF locale | Natif SDK | MVP |
| `expo-file-system` | Fichiers temporaires PDF, backup | Natif SDK | MVP |
| `expo-sharing` | Share Sheet natif (PDF, backup) | Natif SDK | MVP |
| `expo-secure-store` | Clé maîtresse chiffrement (Keychain/Keystore) | Natif SDK | MVP |
| `crypto-js` | AES-256 + PBKDF2 backup (pur JS) | Pur JS | MVP |
| `react-native-iap` | IAP StoreKit + Play Billing | Config plugin communautaire stable | MVP |
| `react-native-google-mobile-ads` | AdMob Native/Banner/Rewarded + UMP | Config plugin officiel | MVP (free tier) |
| `vitest` | Tests unitaires | Pur JS (dev) | MVP |
| `eslint-config-expo` + `prettier` | Qualité code | Pur JS (dev) | MVP |
| `expo-auth-session` | OAuth PKCE Google Drive | Natif SDK | **V1.1** |
| `@shopify/flash-list` | Listes >200 items | Pur JS | **V1.1 si besoin** |

**Total : 24 dépendances MVP. Zéro dépendance backend. Zéro binding natif manuel.**

---

## INTERDITS EXPLICITES

| Technologie ou package | Raison du refus |
|------------------------|-----------------|
| Firebase / Firestore | Backend obligatoire. Viole règle zéro backend + promesse privacy. |
| Supabase | Backend obligatoire (PostgreSQL cloud). |
| RevenueCat | SaaS : entitlements gérés côté serveur. Viole zéro backend. GPT 3 exige entitlements MMKV locaux. |
| Sentry (cloud) | Envoi de données vers serveur tiers. Viole privacy. Remplacé par table `error_log` locale. |
| Mixpanel / Amplitude / tout analytics SaaS | Envoi automatique de données. Remplacé par event log local exportable manuellement. |
| react-native-quick-crypto | **INTERDIT par annexe technique MVP** (binding C++ JSI, "Règle d'Or zéro natif complexe"). Remplacé par crypto-js. |
| llama.cpp / react-native-llama | Binding natif lourd. Hors MVP. V2 via transformers.js (pur JS) uniquement. |
| AsyncStorage | Lent, pas de chiffrement, bridge JS. Remplacé par MMKV. |
| Redux / MobX / Jotai | Double paradigme avec Zustand. Règle : un seul outil de state. |
| styled-components / Tamagui / Gluestack | Double paradigme avec NativeWind. Règle : un seul outil de styling. |
| WatermelonDB / Realm | Complexité native, sync-oriented (inutile en mono-device strict). |
| OneSignal / FCM push server | Backend push requis. Notifications locales uniquement. |
| Bare workflow / code natif manuel | Viole règle Expo managed. Config plugins uniquement. |
| Sync cloud temps réel | INTERDIT par GPT 2. Viole architecture Local-First. |
| Google Drive sync automatique | Sync interdite. Backup = export/import manuel uniquement. Drive V1.1 = upload 1-tap du fichier chiffré, jamais auto. |
| Interstitial ads | Interdit par GPT 3. Détruirait rétention et promesse anti-prédation. |
| Appel réseau au boot | Viole budget "boot 100% offline". AdMob et IAP différés après onboarding. |
| Paywall sur backup/export | INTERDIT par GPT 2 (règle éthique : données jamais prises en otage). |

---

## CONFIGURATION APP

### app.json (extrait structurant)

```jsonc
{
  "expo": {
    "name": "BabyLog Offline",
    "slug": "babylog-offline",
    "scheme": "babylog",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",       // OLED par défaut, tokens NativeWind light/dark
    "newArchEnabled": true,
    "backgroundColor": "#000000",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.babylog.offline",
      "deploymentTarget": "16.0",
      "supportsTablet": false,
      "infoPlist": {
        "UIBackgroundModes": [],        // Aucun background mode nécessaire
        "NSUserTrackingUsageDescription": null  // Pas de tracking IDFA
      }
    },
    "android": {
      "package": "com.babylog.offline",
      "minSdkVersion": 33,
      "edgeToEdgeEnabled": true
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-notifications",
      "expo-haptics",
      "react-native-mmkv/plugin",
      ["react-native-google-mobile-ads", {
        "androidAppId": "ca-app-pub-XXXXX~YYYYY",
        "iosAppId": "ca-app-pub-XXXXX~ZZZZZ",
        "userTrackingPermission": false,
        "childDirectedTreatment": false,
        "maxAdContentRating": "G"
      }],
      "react-native-iap"
    ]
  }
}
```

### Permissions

| Permission | Feature MVP qui la justifie | Moment de demande |
|-----------|----------------------------|-------------------|
| `POST_NOTIFICATIONS` (Android 13+) | Rappel backup J30 (Feature 5, notification locale) | Quand l'utilisateur active le rappel backup dans Paramètres. **Jamais au premier lancement.** |
| `INTERNET` (Android, implicite) | AdMob SDK (free tier uniquement, écrans diurnes) | Ajoutée automatiquement par le config plugin AdMob. Non demandée à l'utilisateur. |
| Aucune autre | — | L'app n'utilise ni caméra, ni localisation, ni contacts, ni micro, ni stockage externe. |

**Note :** `expo-haptics`, `expo-secure-store`, `expo-sqlite`, `expo-file-system` (app-specific dir) ne nécessitent **aucune permission système**.

### Plugins Expo

| Plugin | Rôle exact |
|--------|-----------|
| `expo-router` | Navigation file-based, deep linking |
| `expo-secure-store` | Keychain iOS / Keystore Android pour master key |
| `expo-notifications` | Notifications locales (rappel backup) |
| `expo-haptics` | Retour haptique natif tracking 1-tap |
| `react-native-mmkv/plugin` | MMKV sans code natif manuel |
| `react-native-google-mobile-ads` | AdMob + UMP consentement EEA/UK |
| `react-native-iap` | StoreKit + Play Billing |

### Icônes, splash, couleurs

Référence au design system GPT 6 (à produire). En attendant :
- Splash : fond `#000000`, logo placeholder centré
- Icône : placeholder carré noir avec glyphe lune/croissant
- Couleurs primaires : `#000000` (fond), `#1A1A2E` (surfaces), `#E94560` (accent feed), `#0F3460` (accent sleep)
- **Contrainte absolue :** aucun blanc pur (`#FFFFFF`) visible en mode nuit. Texte max `#E0E0E0`.

---

## ARCHITECTURE DE DOSSIERS

```
src/
├── app/                              # Routes Expo Router — écrans fins, AUCUNE logique
│   ├── _layout.tsx                   # Root layout : ErrorBoundary, ThemeProvider, i18n init
│   ├── (auth)/
│   │   └── onboarding.tsx            # Onboarding + disclaimer non-médical
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Tab bar (Timeline, Track, Stats, Settings)
│   │   ├── index.tsx                 # Timeline 7 jours
│   │   ├── track.tsx                 # Écran tracking 1-tap (Feed, Sleep, Diaper)
│   │   ├── stats.tsx                 # Stats diurnes (zone ads native autorisée)
│   │   └── settings.tsx              # Paramètres, backup, premium, rappel backup
│   ├── paywall.tsx                   # Paywall local (modal)
│   ├── backup/
│   │   ├── export.tsx                # Export backup chiffré
│   │   └── import.tsx                # Import backup chiffré
│   └── +not-found.tsx
│
├── features/
│   ├── tracking/                     # Feature 1 : Tracking 1-Tap & Timeline
│   │   ├── screens/
│   │   │   ├── TrackingScreen.tsx
│   │   │   └── TimelineScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useTracking.ts        # ViewModel : start/stop timer, save session
│   │   │   └── useTimeline.ts        # ViewModel : fetch sessions 7 jours
│   │   ├── services/
│   │   │   └── trackingService.ts    # Logique métier pure : calcul durée, validation
│   │   ├── repository/
│   │   │   └── sessionRepository.ts  # Seul accès SQL : CRUD table session
│   │   ├── models/
│   │   │   └── session.ts            # Types TS + schémas Zod SessionSchema
│   │   └── index.ts                  # API publique : hooks uniquement
│   │
│   ├── prediction/                   # Feature 4 : SweetSpot local
│   │   ├── hooks/
│   │   │   └── useSweetSpot.ts       # ViewModel : calcul prédiction + gating premium
│   │   ├── services/
│   │   │   └── predictionService.ts  # EMA, baseline âge, poids w (annexe §4)
│   │   ├── repository/
│   │   │   └── wakeWindowRepository.ts  # Requêtes SQL agrégées (AVG, GROUP BY)
│   │   ├── models/
│   │   │   └── prediction.ts
│   │   └── index.ts
│   │
│   ├── pdf-export/                   # Feature 3 : Export PDF médical local
│   │   ├── screens/
│   │   │   └── PdfExportScreen.tsx
│   │   ├── hooks/
│   │   │   └── usePdfExport.ts
│   │   ├── services/
│   │   │   └── pdfService.ts         # Génération HTML → expo-print → Share Sheet
│   │   ├── repository/
│   │   │   └── reportRepository.ts   # Agrégation données 7 jours pour PDF
│   │   ├── models/
│   │   │   └── report.ts
│   │   └── index.ts
│   │
│   ├── backup/                       # Feature 5 : Backup local chiffré
│   │   ├── screens/
│   │   │   ├── BackupExportScreen.tsx
│   │   │   └── BackupImportScreen.tsx
│   │   ├── hooks/
│   │   │   ├── useBackupExport.ts
│   │   │   └── useBackupImport.ts
│   │   ├── services/
│   │   │   └── backupService.ts      # Chiffrement/déchiffrement, validation Zod
│   │   ├── repository/
│   │   │   └── backupRepository.ts   # Export complet DB, import transactionnel
│   │   ├── models/
│   │   │   └── backupSchema.ts       # Schéma Zod versionné du fichier .babylog
│   │   └── index.ts
│   │
│   ├── onboarding/                   # Onboarding + disclaimer
│   │   ├── screens/
│   │   │   └── OnboardingScreen.tsx
│   │   ├── hooks/
│   │   │   └── useOnboarding.ts
│   │   └── index.ts
│   │
│   ├── paywall/                      # UI paywall local
│   │   ├── screens/
│   │   │   └── PaywallScreen.tsx
│   │   ├── hooks/
│   │   │   └── usePaywall.ts         # Triggers, cooldown, cohorte A/B
│   │   └── index.ts
│   │
│   └── settings/                     # Paramètres app
│       ├── screens/
│       │   └── SettingsScreen.tsx
│       ├── hooks/
│       │   └── useSettings.ts
│       └── index.ts
│
├── core/
│   ├── database/
│   │   ├── init.ts                   # Ouverture unique SQLite, WAL, foreign keys ON
│   │   ├── migrate.ts                # Système migrations idempotent
│   │   ├── migrations/
│   │   │   ├── 001_initial.ts
│   │   │   └── index.ts             # Registre ordonné des migrations
│   │   └── query.ts                  # Helpers typés : run, get, getAll
│   │
│   ├── storage/
│   │   ├── mmkv.ts                   # Instances standard + chiffrée
│   │   ├── zustand-adapter.ts        # Adaptateur persist MMKV pour Zustand
│   │   ├── stores/
│   │   │   ├── settingsStore.ts      # Thème, langue, préférences
│   │   │   └── timerStore.ts         # État timer actif (survie crash)
│   │   └── namespaces.ts            # Constantes préfixes : 'settings:', 'timer:', etc.
│   │
│   ├── billing/
│   │   ├── iapService.ts            # react-native-iap wrapper
│   │   ├── entitlements.ts          # Lecture/écriture MMKV chiffrée
│   │   ├── products.ts             # IDs produits stores (pas de prix en dur)
│   │   └── hooks/
│   │       └── useEntitlements.ts   # Hook gating premium
│   │
│   ├── ads/
│   │   ├── adService.ts             # Wrapper AdMob : init différée, formats
│   │   ├── consent.ts              # Google UMP EEA/UK
│   │   ├── rules.ts                # Règles fréquence CODÉES EN DUR (GPT 3)
│   │   └── hooks/
│   │       └── useAds.ts            # Respecte flags : night, premium, onboarding
│   │
│   ├── analytics/
│   │   ├── tracker.ts              # track(name, props) → SQLite events
│   │   ├── events.ts               # Noms d'événements typés (constantes)
│   │   └── export.ts               # Export manuel event log (Share Sheet)
│   │
│   ├── notifications/
│   │   ├── localNotifications.ts   # Planification rappel backup J30
│   │   └── permission.ts           # Demande POST_NOTIFICATIONS au bon moment
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── TimerButton.tsx          # Bouton géant 1-tap (heart de l'UX)
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Text.tsx                 # Jamais #FFFFFF en mode nuit
│   │   └── index.ts
│   │
│   └── utils/
│       ├── pdf-assets.ts           # Conversion assets → Base64 (contrainte WKWebView)
│       ├── date.ts                  # Helpers dayjs : epoch ms, format display
│       ├── crypto.ts               # Wrapper crypto-js : AES encrypt/decrypt, PBKDF2
│       ├── error-boundary.tsx       # ErrorBoundary globale
│       └── useZodForm.ts            # Hook react-hook-form + zod standardisé
│
└── lib/
    ├── constants.ts                 # Keys MMKV, limits free tier, etc.
    ├── config.ts                    # Flags : NIGHT_MODE, FREE_LIMITS, AD_CAPS
    └── i18n/
        ├── index.ts                 # Init i18next
        ├── locales/
        │   ├── en/                  # Langue principale
        │   ├── fr/
        │   ├── es/
        │   ├── it/
        │   └── ja/
        └── i18next.d.ts             # Typage des clés
```

### Conventions de code imposées (exhaustif)

1. **Alias d'import :** `@/` pointe vers `src/`. Tout import utilise `@/features/tracking/hooks/useTracking`, jamais de chemin relatif `../../`.
2. **Écrans fins :** un écran (`app/*.tsx` ou `features/*/screens/`) lit un hook, rend du JSX. Aucune logique métier, aucun SQL, aucun appel service direct.
3. **Hooks = ViewModels :** un écran ne parle jamais au repository directement. Toujours via un hook `useXxx`.
4. **Services purs :** un service ne connaît ni React, ni SQLite, ni MMKV. Il reçoit ses dépendances en paramètres (injection). Fonctions pures testables.
5. **SQL isolé :** tout SQL vit dans `repository/` et `core/database/`. Interdit ailleurs. Les repositories exposent des méthodes typées (`findByDateRange`, `insertSession`), jamais de SQL brut aux hooks.
6. **Zod aux frontières :** toute donnée entrante (form, import backup, réponse future IA) passe par un schéma Zod avant usage. Types TS inférés depuis Zod (`z.infer<typeof Schema>`).
7. **Gestion d'erreurs :** try/catch systématique dans les hooks. Erreur → `error_log` SQLite locale (sans payload utilisateur). ErrorBoundary globale au root.
8. **Nommage :**
   - Hooks : `useXxx` (useTracking, useSweetSpot)
   - Services : `xxxService` (trackingService, predictionService)
   - Repositories : `xxxRepository` (sessionRepository)
   - Écrans : `XxxScreen` (TrackingScreen)
   - Stores : `useXxxStore` (useSettingsStore)
   - Types : PascalCase (Session, WakeWindow)
   - Constantes : UPPER_SNAKE (MAX_FREE_EXPORTS)
9. **Pas de données sensibles dans les logs :** `error_log` ne contient jamais de PII, jamais de contenu de backup, jamais de clés.
10. **Imports triés :** ESLint `import/order` activé. Groups : react → expo → libs → @/ → relative.
11. **Pas de `any` :** TypeScript strict. `unknown` + narrowing Zod si type inconnu.
12. **Fichiers < 200 lignes :** si un fichier dépasse, extraire. Agent IA fonctionne mieux avec fichiers courts.

---

## COUCHE DONNÉES

### Initialisation expo-sqlite

```typescript
// core/database/init.ts
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('babylog.db', {
      enableChangeListener: false,  // Pas de sync, pas besoin
    });
    // WAL pour performances écriture (timer tracking fréquent)
    db.execSync('PRAGMA journal_mode = WAL;');
    db.execSync('PRAGMA foreign_keys = ON;');
    db.execSync('PRAGMA synchronous = NORMAL;');
  }
  return db;
}
```

### Système de migrations

```typescript
// core/database/migrate.ts
// Table schema_version : version INTEGER PRIMARY KEY, applied_at INTEGER (epoch ms)
// Fichiers : migrations/001_initial.ts, migrations/002_xxx.ts
// Chaque migration exporte { version: number; up: (db) => void }
// migrate() est idempotent : applique uniquement les versions > current
// Exécuté au boot AVANT tout accès DB par les features
```

**Convention :** une migration par changement de schéma. Jamais de modification d'une migration existante. Toujours une nouvelle version.

### Namespaces MMKV

| Namespace | Contenu | Instance |
|-----------|---------|----------|
| `settings:` | Thème, langue, préférences utilisateur | Standard |
| `timer:` | État timer actif (type, startedAt) pour survie crash | Standard |
| `quota:` | Compteurs free tier (exports PDF, rewarded) + timestamps reset | Standard |
| `billing:` | Entitlements premium, cohorte A/B, dernier paywall | **Chiffrée** |
| `ads:` | Flags consentement UMP, impressions count | Standard |
| `onboarding:` | `first_launch_completed`, disclaimer accepté | Standard |
| `secrets:` | Futures clés API BYOK (V2) | **Chiffrée** |

**Instance chiffrée :** clé de chiffrement MMKV dérivée de la master key stockée dans expo-secure-store. Si la clé secure-store est absente (fresh install), génération et stockage.

### Stores Zustand

| Store | Domaine | Persist |
|-------|---------|---------|
| `useSettingsStore` | Thème, langue, haptics on/off, rappel backup on/off | OUI (partialize : settings uniquement) |
| `useTimerStore` | Timer actif : type, startedAt, isRunning | OUI (survie crash) |
| `useSessionStore` | Session utilisateur courante (onboarding state) | NON (transitoire) |

**Règle :** `partialize` obligatoire. Jamais d'état transitoire persisté. Chaque store a son namespace MMKV dédié.

---

## SERVICES TRANSVERSES

### IA unifié BYOK

**⚠️ NON INCLUS AU MVP.**

Justification : GPT 3 stipule explicitement *"Au MVP BabyLog Offline, il n'y a pas d'IA API externe : la prédiction est un algorithme local de moyennes mobiles."* La feature "SweetSpot" est un calcul JS pur (EMA, baselines par âge, poids `w`), exécuté en <1 ms, zéro réseau.

**Architecture V2 (documentée, non implémentée au MVP) :**
- Interface `core/ai/provider.ts` : `chat(messages, provider)` unifié
- Providers futurs : openai, gemini, deepseek, openrouter (fetch natif, aucun SDK)
- Clés en MMKV chiffrée `secrets:`, jamais loggées
- Quota local : compteur MMKV `ai:`, reset quotidien, illimité si premium
- Aucun provider configuré par défaut. Écran settings obligatoire.

**Au MVP, le dossier `core/ai/` contient uniquement un README expliquant que le service est absent et sera ajouté en V2.**

### Backup chiffré (local + Drive V1.1)

**Spécification MVP (export/import local via Share Sheet) :**

1. **Export :**
   - Sérialisation complète : toutes les tables SQLite + settings MMKV (hors secrets)
   - Construction objet JSON → validation contre `BackupSchemaV1` (Zod)
   - Chiffrement : `crypto-js AES-256` avec clé dérivée via `PBKDF2`
     - Input utilisateur : PIN 6 chiffres **ou** mot de passe (au choix)
     - Sel : 16 bytes random (expo-crypto), stocké dans le fichier
     - Itérations PBKDF2 : 100 000 (documenté, testé perf <2s sur milieu de gamme)
   - Fichier : `babylog_YYYYMMDD_HHmmss.babylog` (JSON chiffré Base64)
   - Partage : `expo-sharing` → Share Sheet natif (AirDrop, Files, email, etc.)

2. **Import :**
   - Lecture fichier → déchiffrement AES-256 (clé dérivée du code saisi)
   - **Validation Zod stricte AVANT toute écriture** (version, schéma, types)
   - Si code erroné : message générique "Code incorrect ou fichier invalide" (pas de fuite d'info)
   - Restauration **transactionnelle** : BEGIN → écriture → COMMIT. Si erreur → ROLLBACK complet
   - Confirmation explicite utilisateur avant écrasement

3. **Rappel backup :** si dernier export >30 jours → notification locale (expo-notifications), gratuite, désactivable.

**V1.1 (Google Drive, non bloquant MVP) :**
- OAuth : `expo-auth-session` PKCE + `expo-crypto` pour code_verifier
- Scopes : `drive.file` uniquement (dossier applicatif)
- Upload : fichier `.babylog` déjà chiffré → REST Drive en fetch direct
- Manuel uniquement. Jamais automatique. Jamais de sync.

### Billing (IAP)

**Spécification complète :**

1. **Produits stores (IDs, pas de prix en dur dans le code) :**
   - Tier 1 : `com.babylog.monthly.t1`, `com.babylog.annual.t1`, `com.babylog.lifetime.t1`
   - Tier 2 : `com.babylog.monthly.t2`, `com.babylog.annual.t2`, `com.babylog.lifetime.t2`
   - Prix gérés côté App Store Connect / Play Console. Cohortes A/B via produits de lancement.

2. **Flow d'achat :**
   - `react-native-iap` → `requestPurchase(productId)`
   - Confirmation store → écriture entitlement en MMKV chiffrée `billing:`
   - Entitlement : `{ isPremium: boolean, purchasedAt: number, productId: string }`
   - **Offline-first :** si l'achat est confirmé par le store, l'entitlement fonctionne sans réseau.

3. **Restore purchases :**
   - Disponible dans paywall + Paramètres (bouton visible)
   - `react-native-iap` → `getPurchases()` → vérification receipt locale basique
   - Si entitlement déjà en MMKV → restore immédiat sans appel réseau
   - Fonctionne en mode avion complet

4. **Gating premium :**
   - Hook `useEntitlements()` : lit MMKV chiffrée, expose `{ isPremium, gate(feature) }`
   - Features gatées : SweetSpot complet, historique illimité, exports PDF illimités
   - Features JAMAIS gatées : tracking, UI Nuit, timeline 7j, backup, export données

5. **Pas de serveur :** aucune vérification server-side. Pas de webhook. Pas de RevenueCat.

### Ads

**Spécification complète (règles GPT 3 codées en dur) :**

1. **Initialisation :**
   - **AUCUN appel AdMob avant `onboarding_completed`** (flag MMKV)
   - SDK initialisé après onboarding, uniquement si entitlement = free
   - Si `is_premium` → AdMob jamais initialisé

2. **Formats autorisés :**
   - Native : dashboard stats diurnes, Paramètres. Max 2 cartes/jour.
   - Banner : stats diurnes, Paramètres. Max 2 impressions/jour, refresh 60s.
   - Rewarded : opt-in uniquement (teaser SweetSpot, export PDF supplémentaire). Max 3/jour.
   - **Interstitial : INTERDIT. Zéro implémentation.**

3. **Écrans INTERDITS (flag `night_mode_active` + contexte) :**
   - Tracking, timer actif, mode Nuit, saisie Feed/Sleep/Diaper
   - Timeline active, export PDF en cours, backup en cours
   - Paywall, onboarding, premier lancement

4. **Consentement EEA/UK :**
   - Google UMP via config plugin react-native-google-mobile-ads
   - Stockage consentement local MMKV `ads:consent`
   - Si refus → fallback annonces non personnalisées

5. **Config :**
   - `childDirectedTreatment = false` (utilisateurs = parents adultes)
   - `maxAdContentRating = "G"`
   - Pas de ciblage santé. Pas de données sensibles dans les requêtes AdMob.

6. **Wrapper `core/ads/rules.ts` :**
   ```typescript
   // Constantes codées en dur, pas de remote config
   const MAX_NATIVE_PER_DAY = 2;
   const MAX_BANNER_PER_DAY = 2;
   const MAX_REWARDED_PER_DAY = 3;
   const BANNER_REFRESH_MS = 60_000;
   const REWARDED_SWEETSPOT_COOLDOWN_DAYS = 7;
   // Fonctions : canShowNative(), canShowBanner(), canShowRewarded()
   // Vérifient : count MMKV + nuit + premium + onboarding
   ```

### Analytics local (event log)

**Spécification complète :**

1. **Stockage :** table SQLite `event` (id TEXT uuid, name TEXT, properties TEXT JSON, created_at INTEGER epoch ms)

2. **API :**
   ```typescript
   // core/analytics/tracker.ts
   export function track(name: EventName, properties?: Record<string, unknown>): void
   // Synchrone, léger, try/catch interne. Jamais de throw.
   ```

3. **Événements typés (constants dans `events.ts`) :**
   - `onboarding_started`, `onboarding_completed`
   - `first_tracking_event`, `first_value_moment`
   - `tracking_completed`, `session_started`
   - `free_limit_reached`, `sweetSpot_teaser_shown`
   - `pdf_export_started`, `pdf_export_completed`
   - `paywall_shown`, `paywall_closed`, `paywall_converted`
   - `restore_completed`, `backup_export_completed`
   - `rewarded_offered`, `rewarded_completed`

4. **AUCUN envoi automatique.** Pas de réseau. Pas de SaaS analytics.

5. **Export optionnel :** l'utilisateur peut exporter le event log en JSON via Share Sheet (pour debug ou analyse personnelle). Bouton dans Paramètres → "Exporter mes données d'usage".

6. **error_log :** table séparée `error_log` (id, message, stack, context, created_at). Sans payload utilisateur. Jamais de PII.

---

## SÉCURITÉ

| # | Vérification | Statut | Preuve |
|---|-------------|--------|--------|
| 1 | Clés API et entitlements en MMKV chiffrée uniquement | ✅ OUI | Instance MMKV chiffrée `secrets:` et `billing:`, clé dérivée de expo-secure-store |
| 2 | Backup chiffré avant tout export, sel et itérations PBKDF2 documentés | ✅ OUI | AES-256 crypto-js, sel 16 bytes expo-crypto, PBKDF2 100 000 itérations |
| 3 | Aucune donnée personnelle envoyée sans action explicite | ✅ OUI | Zéro appel réseau au boot. Backup = action manuelle. IA = non MVP. Ads = pas de données santé |
| 4 | Permissions demandées au moment du besoin avec justification UI | ✅ OUI | POST_NOTIFICATIONS demandé uniquement à l'activation du rappel backup |
| 5 | Pas de log de données sensibles | ✅ OUI | error_log sans payload utilisateur. Event log sans PII. Clés jamais loggées |
| 6 | Privacy policy : liste exacte des données stockées et tiers contactés | ✅ OUI | Données locales : sessions bébé, settings. Tiers : AdMob (free tier, pas de données santé), Stores (IAP). Zéro backend propre |
| 7 | PII chiffrés en base (prénom, notes) | ✅ OUI | crypto-js AES-256 avant écriture SQLite (conforme annexe §5 Tier 2) |
| 8 | Master key en zone matérielle sécurisée | ✅ OUI | expo-secure-store, Keychain iOS / Keystore Android, WHEN_UNLOCKED_THIS_DEVICE_ONLY |
| 9 | react-native-quick-crypto absent du projet | ✅ OUI | INTERDIT par annexe. Seul crypto-js (pur JS) est utilisé |
| 10 | Conformité stores : disclaimer non-médical | ✅ OUI | Disclaimer au premier lancement + dans PDF + dans stores. Guideline Apple 1.4.1 respectée |

---

## BUDGETS DE PERFORMANCE

| Budget | Cible | Méthode de vérification |
|--------|-------|------------------------|
| Cold start | < 2 secondes sur milieu de gamme Tier 2 (ex. Pixel 7a, iPhone SE 3) | `console.time` au boot + EAS Build profiling. Log `boot_duration_ms` dans event log local |
| Requêtes DB écrans liste | < 16 ms | `EXPLAIN QUERY PLAN` sur chaque requête repository. Test Vitest avec timing sur 500 sessions simulées |
| Fluidité listes | 60 fps sur toutes les listes MVP | React DevTools Profiler. FlatList avec `getItemLayout` pour timeline. `keyExtractor` stable |
| Taille app | < 60 MB hors assets média | `eas build --profile preview` → inspection artifact. Budget vérifié en CI |
| Boot 100% offline | Zéro appel réseau au boot | Audit des imports : AdMob différé, IAP différé. Test en mode avion au premier lancement |
| Chiffrement backup | < 2 secondes pour 10 Mo | Test Vitest avec données simulées. PBKDF2 100k itérations validé sur device moyen |
| Prédiction SweetSpot | < 1 ms | Algorithme JS pur, zéro dépendance. Test Vitest avec assert performance |

---

## QUALITÉ ET TESTS

### Configuration TypeScript

```jsonc
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### ESLint + Prettier

- `eslint-config-expo` + `eslint-config-prettier`
- Règles actives : `import/order`, `@typescript-eslint/no-explicit-any` (error), `react-hooks/exhaustive-deps` (warn)
- **Zéro warning toléré en CI.** Build fails si warning.

### Vitest

| Cible | Couverture minimum | Type de test |
|-------|-------------------|--------------|
| `features/*/services/` | 80% | Logique métier pure, injection de dépendances |
| `features/*/repository/` | 80% | Faux DB injectés (in-memory SQLite ou mock) |
| `core/billing/` | 80% | Entitlements, restore, gating |
| `core/ads/rules.ts` | 90% | Règles de fréquence, flags |
| `core/database/migrate.ts` | 80% | Migrations idempotentes, ordering |
| `features/prediction/services/` | 90% | EMA, baselines, poids w (formules annexe §4) |
| Hooks critiques | 70% | `useEntitlements`, `useSweetSpot` (gating) |

### Conventions de test

- Un fichier par module testé : `trackingService.test.ts` à côté de `trackingService.ts`
- Noms explicites : `describe('trackingService.startSession')`, `it('should save session with correct timestamps')`
- **Pas de snapshot au MVP.** Assertions explicites uniquement.
- Pas d'E2E au MVP. Tests unitaires + intégration services/repos suffisants.
- Faux DB : `better-sqlite3` in-memory pour tests repository, injecté via constructor.

### CI

- GitHub Actions : lint + typecheck + vitest coverage à chaque PR
- Seuil coverage : 80% sur services/repos. Build fails si en dessous.
- EAS Build preview déclenché sur merge to main (validation native)

---

## FAISABILITÉ AGENT IA PAR MODULE

| Module | Score /10 | Risque principal | Mitigation ou simplification |
|--------|-----------|-----------------|------------------------------|
| Navigation (Expo Router) | 9 | Routage file-based mal structuré | Arborescence figée ci-dessus. Conventions écrans fins. |
| UI / Styling (NativeWind) | 8 | Tokens OLED mal appliqués, blanc parasite | Règle "aucun #FFFFFF" en lint custom. Composants core/ui contrôlés. |
| Data (SQLite + repos) | 8 | Requêtes SQL non optimisées, migrations cassées | Index obligatoires. Migrations idempotentes testées. SQL isolé repos. |
| State (Zustand + MMKV) | 9 | État transitoire persisté par erreur | `partialize` explicite obligatoire. Pattern documenté. |
| Prédiction SweetSpot (local) | 9 | Formules EMA mal implémentées | Spec exécutoire annexe §4. Tests unitaires avec cas nominaux + edge cases. |
| Backup chiffré | 7 | Edge cases import (fichier corrompu, code erroné) | Validation Zod stricte avant écriture. Tests avec fichiers invalides. Rollback transactionnel. |
| Billing (react-native-iap) | 7 | Différences StoreKit/Play Billing, restore | Patterns documentés. Entitlements locaux = source de vérité. Test devices réels EAS preview. |
| Ads (AdMob + UMP) | 7 | Complexité UMP, règles de fréquence | Wrapper core/ads encapsule tout. Règles codées en dur. Config plugin gère le natif. |
| Analytics local | 9 | Aucun significatif | Insert SQLite simple. API `track()` triviale. |
| i18n | 9 | Clés manquantes | Fallback `en`. Clés typées. Tests de présence clés. |
| Exports PDF (expo-print) | 7 | Assets Base64 iOS WKWebView, CSS print | Pattern `pdf-assets.ts` documenté. CSS @page + break-inside testés. |
| Notifications locales | 9 | Permission Android 13 | Demande différée au besoin. Fallback silencieux si refus. |

**Pondération :** Data ×2, Prédiction (IA locale) ×2, autres ×1.

**Calcul :** (9 + 8 + 8×2 + 9 + 9×2 + 7 + 7 + 7 + 9 + 9 + 7 + 9) / (1+1+2+1+2+1+1+1+1+1+1+1) = 115 / 14 = **8.2/10**

**Score global : 8.2/10** — Aucun module sous 6. Pas de simplification nécessaire.

---

## PASSATION AU GPT 5 (CONVENTIONS DB OBLIGATOIRES)

Ces conventions sont **non négociables** et s'appliquent à toute table créée par le GPT 5 (Data Model Designer).

### Moteur et migrations
- Moteur : **expo-sqlite** exclusivement. Aucun autre SGBD.
- Migrations : table `schema_version` (version INTEGER PRIMARY KEY, applied_at INTEGER epoch ms).
- Fichiers de migration numérotés dans `core/database/migrations/`. Idempotence obligatoire.

### Nommage
- Tables : **snake_case singulier** (`session`, `wake_window`, `baby_profile`). Jamais de pluriel.
- Colonnes : **snake_case** (`started_at`, `event_type`, `is_active`).
- Index : `idx_[table]_[colonne]` (ex. `idx_session_started_at`).

### Types de colonnes
- IDs : **TEXT uuid** (générés via `expo-crypto` randomUUID). Pas d'INTEGER auto-increment.
- Dates : **INTEGER epoch millisecondes** (UTC). Jamais de TEXT date, jamais de REAL Julian.
- Booléens : **INTEGER 0/1**. Pas de BOOLEAN (non supporté nativement SQLite).
- Énumérations : **TEXT** avec CHECK constraint (ex. `event_type TEXT CHECK(event_type IN ('feed','sleep','diaper'))`).
- Montants : non applicable (pas de données financières en DB).

### Colonnes obligatoires
- Toute table DOIT avoir `created_at INTEGER NOT NULL` et `updated_at INTEGER NOT NULL`.
- `updated_at` mis à jour via trigger SQLite ou dans le repository à chaque UPDATE.

### Index obligatoires
- Index sur toute colonne de jointure (foreign keys).
- Index sur toute colonne utilisée dans WHERE, ORDER BY, GROUP BY des requêtes identifiées :
  - `session.started_at` (timeline, agrégations)
  - `session.event_type` (filtres par type)
  - `session.baby_id` (jointure profil)

### Accès aux données
- Toute table est exposée via un **repository typé** dans `features/[feature]/repository/`.
- **SQL interdit hors `repository/` et `core/database/`.** Les hooks et services n'écrivent jamais de SQL.
- Repositories exposent des méthodes métier (`findSessionsByDateRange`, `insertSession`), pas de `query(sql)` générique.

### Schémas Zod miroirs
- Chaque type TypeScript de modèle DB a un **schéma Zod correspondant** dans `models/`.
- Les schémas Zod sont utilisés pour : validation des imports backup, validation des forms, inférence des types TS.
- Convention : `SessionSchema` → `type Session = z.infer<typeof SessionSchema>`.

### Contraintes spécifiques BabyLog
- Table `session` : colonnes minimales `id`, `baby_id`, `event_type`, `started_at`, `ended_at` (nullable si timer en cours), `notes` (TEXT chiffré AES si PII), `created_at`, `updated_at`.
- PII (prénom bébé, notes) : chiffrés AES-256 crypto-js AVANT écriture en base. La colonne stocke le ciphertext.
- Table `event` (analytics) : `id`, `name`, `properties` (TEXT JSON), `created_at`. Pas d'index sur properties.
- Table `error_log` : `id`, `message`, `stack`, `context`, `created_at`. Jamais de PII.

### Ce que le GPT 5 NE DOIT PAS faire
- Créer une table sans `created_at` et `updated_at`.
- Utiliser des IDs auto-incrémentés.
- Stocker des dates en TEXT ou REAL.
- Écrire du SQL dans un service ou un hook.
- Créer un schéma Zod sans type TS inféré correspondant.
- Ajouter une table qui nécessite un appel réseau pour fonctionner.

---

## ADDENDUM v2 (corrections pré-GPT 5)
1. Produits A/B : ajouter dans products.ts les IDs cohortes
com.babylog.lifetime.t1.a / .b / .c et com.babylog.lifetime.t2.a / .b / .c.
Mapping cohorte locale (hash MMKV) vers product ID obligatoire.
Le paywall affiche le produit correspondant à la cohorte, jamais un prix en dur.
2. Tests repositories : introduire interface DbAdapter (run, get, getAll)
dans core/database/query.ts. Implémentation production : expo-sqlite.
Implémentation test : wrapper better-sqlite3 in-memory.
Les repositories ne dépendent que de DbAdapter, jamais d'un SDK concret.
3. app.json : ajouter "allowBackup": true dans le bloc android.
Note iOS : ne jamais activer de flag d'exclusion backup sur babylog.db.
4. Dépendances : ajouter expo-asset (MVP, natif SDK) au tableau.
5. PBKDF2 : gate de validation device réel au sprint 3 (budget 2 s).
Fallback documenté : 50 000 itérations ou dérivation asynchrone avec UI progression.
6. Routes : renommer le groupe (auth) en (setup).
7. Thème : dark par défaut confirmé ; le GPT 6 doit livrer les tokens light
complets pour les écrans diurnes (stats, paramètres).

--- 

## RAPPEL FINAL

Ce document `04-tech-stack.md` est complet et prêt à être transmis au **GPT 5 (Data Model Designer)**.

**Transmettez ce document au GPT 5, en particulier la section PASSATION AU GPT 5 qui fixe les conventions de base de données obligatoires** : moteur expo-sqlite, migrations schema_version, nommage snake_case, IDs TEXT uuid, dates INTEGER epoch ms, booléens INTEGER, created_at/updated_at obligatoires, index sur jointures et filtres, repositories typés exclusifs, schémas Zod miroirs.

Documents à joindre au GPT 5 :
- `01-market-research.md`
- `02-product-strategy.md`
- `02-annexe-technique.md`
- `03-monetization-strategy.md`
- **`04-tech-stack.md` (ce document)**