# BabyLog Offline

## What This Is

BabyLog est un journal de suivi de nouveau-né (tétées, sommeil, couches) **100 % local-first** pour les nouveaux parents épuisés, conçu pour l'enregistrement 1-tap la nuit à 3h du matin : zéro backend, zéro compte, zéro appel réseau au boot, chiffrement AES-256 des données sensibles. L'app se distingue des trackers cloud (Huckleberry) par la latence nulle, la privacy absolue et un modèle Lifetime anti-abonnement.

## Core Value

Un parent doit pouvoir enregistrer une tétée/sieste/couche en ≤ 2 taps à 3h du matin sans regarder l'écran (retour haptique, zéro latence, zéro éblouissement) — et les données ne quittent jamais l'appareil.

## Business Context

- **Customer** : Nouveaux parents (25-40 ans, primipares) des marchés Tier 1/2 autorisés (USA, Canada, UK, Australie, Japon, Italie, Espagne...).
- **Revenue model** : Free + Ads (diurnes uniquement, formats Native/Banner/Rewarded, interstitials interdits) + Premium via IAP native (Lifetime $29.99 T1 en offre principale, abonnements mensuel/annuel en secondaires). Entitlements 100 % MMKV local, jamais de serveur.
- **Success metric** : North Star = Daily Active Taps (8-12 enregistrements/jour/DAU). North star monétisation = RPI 30 jours cible $0.65/install.
- **Strategy notes** : Source de vérité complète dans `/docs` (01-market-research, 02-product-strategy v2, 03-monetization-strategy v2, 04-tech-stack v2, 05-data-model v2, 06-ui-ux-design + `docs/design/` maquettes).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Onboarding express < 45 s (profil bébé, disclaimer non-médical obligatoire, zéro permission, zéro compte)
- [ ] Tracking 1-Tap Feed/Sleep/Diaper avec timer survivable au crash (MMKV) + Timeline 7 jours
- [ ] UI « Nuit » OLED Nocturne Glow (dark-only, aucun blanc pur, haptique natif)
- [ ] Export PDF pédiatre local (expo-print, 1 export glissant / 7 j en free, disclaimer inclus)
- [ ] Prédiction SweetSpot locale (moyennes mobiles EMA, < 1 ms, gatée premium avec teaser free après 3 jours)
- [ ] Backup local chiffré `.babylog` AES-256 (crypto-js + PBKDF2, export/import transactionnel, gratuit — jamais paywallé)
- [ ] Monétisation : IAP react-native-iap (entitlements MMKV chiffrés, restore offline) + AdMob (init différée post-onboarding, consentement UMP EEA/UK)
- [ ] Analytics local (event log SQLite exportable, zéro envoi) + error log local sans PII
- [ ] Notifications locales uniquement (rappel backup J30, permission demandée à l'activation)
- [ ] i18n (en, fr, es, it, ja) via i18next + expo-localization

### Out of Scope

- Sync cloud temps réel — INTERDIT, viole la promesse Zero-Knowledge et l'architecture local-first
- Backend / serveur propre — INTERDIT, zéro coût d'infrastructure, privacy totale
- RevenueCat, Sentry, Mixpanel ou tout SaaS — envoi de données vers tiers ; remplacés par entitlements MMKV et logs SQLite locaux
- Sync partenaire QR Delta — V1.1 (tables sync_device/sync_tombstone anticipées dans m001)
- Google Drive upload — V1.1, manuel uniquement, jamais de sync auto
- Widgets iOS/Android, Mode Nounou — V2.0
- IA BYOK / LLM externe — V2 ; le SweetSpot MVP est un algorithme local JS pur
- Interstitial ads — interdites définitivement (rétention + confiance)
- Paywall sur backup/export de données — INTERDIT par règle éthique (données jamais prises en otage)
- ML lourd embarqué, communauté sociale, FTS5 — rejetés (complexité, hors cible, incompatible chiffrement)

## Context

- **Repo actuel** : template Expo SDK 57 vierge (react-native 0.86.3, expo-router ~57.0.21, TypeScript ~6.0.3, expo-env.d.ts, assets par défaut). Aucun code métier. L'arborescence sera restructurée selon `docs/04` : `src/app` (routes fines) + `src/features` (screens/hooks/services/repository/models par feature) + `src/core` (database, storage, billing, ads, analytics, notifications, ui, utils) + `src/lib` (constants, config, i18n).
- **Specs complètes** : `/docs/01` → `/docs/06` + maquettes HTML/PNG dans `/docs/design`. Le DDL SQLite complet, les repositories au SQL exact et le format de backup Zod versionné sont spécifiés dans `docs/05-data-model.md`.
- **AGENTS.md** : Expo évolue vite — lire la doc versionnée https://docs.expo.dev/versions/v57.0.0/ avant d'écrire du code. Le repo est déjà en SDK 57 (≥ 53+ requis par les specs).
- **Marché** : idée scorée 79.6/100 (GO) sur 5 idées évaluées ; positionnement « Anti-Huckleberry » : pas d'abonnement forcé, zéro cloud, UX ultra-rapide.
- **Personas** : Sarah (32, USA, WTP $29.99 Lifetime, tracking nocturne 1 main) ; Thomas (35, FR, déteste les pubs nocturnes, veut des stats claires).

## Constraints

- **Tech stack (stricte)** : Expo SDK 57 managed workflow + New Architecture, TypeScript strict (noUncheckedIndexedAccess), Expo Router (typed routes), NativeWind v4.2.x (unique paradigme styling, Tailwind ~3.4 — v4 Tailwind incompatible), Zustand + MMKV 4.x Nitro (persist avec `partialize` obligatoire, instance chiffrée AES-256 explicite), expo-sqlite (SQL brut isolé dans `repository/` + `core/database/` — SQL INTERDIT ailleurs), Zod à toutes les frontières, react-hook-form + resolvers Zod, expo-crypto (randomUUID), dayjs, i18next, expo-notifications, expo-haptics, expo-print/file-system (nouvelle API File/Directory)/sharing, expo-secure-store (master key), chiffrement AEAD 256-bit pur JS via l'écosystème @noble (remplace crypto-js discontinué — react-native-quick-crypto INTERDIT), expo-iap 5.x (StoreKit/Play Billing, plugin config officiel — remplace react-native-iap dont la v16 abandonne le support Expo Dev Client), react-native-google-mobile-ads 16.x (delayAppMeasurementInit), Vitest (80 % services/repos), ESLint eslint-config-expo + Prettier (zéro warning). Stack native = incompatible Expo Go : dev builds EAS obligatoires.
- **Architecture** : 100 % offline au boot — ZÉRO appel réseau avant `onboarding_completed` ; AdMob et IAP initialisés après onboarding et uniquement si free tier. Mono-device strict au MVP.
- **Sécurité** : PII (prénom bébé, notes) chiffrés AES-256 AVANT écriture SQLite ; master key en Keychain/Keystore (expo-secure-store, WHEN_UNLOCKED_THIS_DEVICE_ONLY) ; instance MMKV chiffrée pour `billing:`/`secrets:` ; aucun secret ni PII dans les logs.
- **Données** : tables singulières snake_case, IDs TEXT uuid (expo-crypto), dates INTEGER epoch ms UTC, booléens INTEGER 0/1, `created_at`/`updated_at` obligatoires (+ triggers), index obligatoires sur jointures et colonnes chaudes, migrations idempotentes `schema_version`. Entitlements/quotas 100 % MMKV — jamais SQLite.
- **Design** : système « Nocturne Glow » dark-only (`#14121e`, texte crème `#F9ECE5`, primary indigo `#7665FA`) — `#FFFFFF` interdit en mode nuit ; Plus Jakarta Sans ; composants `core/ui` maison (26 composants spécifiés dans `docs/06`) ; 2 animations custom max.
- **Performance** : cold start < 2 s, requêtes listes < 16 ms (EXPLAIN QUERY PLAN), taille app < 60 MB, chiffrement backup < 2 s/10 Mo, SweetSpot < 1 ms.
- **Conformité** : disclaimer non-médical (onboarding + PDF + stores, guideline Apple 1.4.1) ; consentement UMP EEA/UK avec repli annonces non personnalisées ; pas d'IDFA/user tracking ; `childDirectedTreatment=false`, `maxAdContentRating="G"` ; permission POST_NOTIFICATIONS demandée uniquement à l'activation du rappel backup.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Expo SDK 57 (repo) au lieu du « SDK 53+ » du doc 04 | Le repo est scaffoldé en SDK 57 (57 ≥ 53) ; AGENTS.md impose la doc v57. Compatibilités exactes validées par la recherche (.planning/research/STACK.md) | ✓ Good |
| expo-iap remplace react-native-iap (décision utilisateur 2026-09-12) | La v16 de react-native-iap (Nitro) déclare le Expo Dev Client non supporté et renvoie vers expo-iap ; plugin config Expo officiel, entitlements toujours 100 % MMKV | — Pending |
| Chiffrement @noble remplace crypto-js (décision utilisateur 2026-09-12) | crypto-js est officiellement discontinué et son PBKDF2 synchrone menace le budget <2 s sur Hermes ; @noble/hashes (+ @noble/ciphers pour l'AEAD) est pur JS maintenu, respecte l'interdit zéro-natif ; primitive exacte tranchée au spike crypto de la phase data-layer | — Pending |
| Enum pompage (nurse/bottle/pump) dans m001, UI V1.1 (décision utilisateur 2026-09-12) | Table stake bon marché (tous les concurrents l'ont) ; créer l'enum dans la migration initiale évite une migration douloureuse ; le périmètre MVP reste 5 features | — Pending |
| Dark-only au MVP (Nocturne Glow) | Cœur du positionnement « nuit » ; tokens light diurnes documentés mais non prioritaires | — Pending |
| SweetSpot construit au MVP, gaté premium au lancement | Différenciateur n°1 (anti-Huckleberry) ; teaser free après 3 jours de données | — Pending |
| Backup gratuit, jamais paywallé | Règle éthique : données jamais prises en otage ; argument de confiance | — Pending |
| Entitlements/quotas en MMKV chiffrée, jamais SQLite | Zéro backend, offline-first ; instance MMKV chiffrée dérivée de la master key secure-store | — Pending |
| react-native-quick-crypto INTERDIT | Binding C++ JSI = natif complexe ; crypto pur JS uniquement | — Pending |
| Template Expo par défaut remplacé (pas cartographié) | Code boilerplate sans valeur métier ; l'arborescence specs est imposée par docs/04 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-12 after initialization*
