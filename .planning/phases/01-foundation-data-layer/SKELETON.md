# Walking Skeleton — BabyLog

**Phase:** 1
**Generated:** 2026-09-18

## Capability Proven End-to-End

> Sur un Android 14 physique (dev build local, pas Expo Go), un parent crée un profil bébé (prénom + date de naissance) depuis l'écran d'accueil et le voit s'afficher — la donnée traverse Zod → `babyProfileRepository` → SQLite (m001 via le migration runner) et revient — pendant qu'un réglage seedé (`settings:night_mode`) survit à un kill/relaunch via la chaîne MMKV + Zustand. Aucun appel réseau au boot.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Expo SDK 57 (~57.0.24, RN 0.86.3) + expo-router | Imposé (docs/04) ; New Architecture seule option RN 0.8x ; routing file-based déjà scaffoldé |
| Data layer | expo-sqlite ~57.0.3 — `babylog.db`, WAL + foreign_keys, migration runner `schema_version` + m001 (docs/05 §6 amendé 05-addendum-01), 6 repositories SQL-exclusifs Zod-validés, pagination keyset `(created_at, id)` | docs/05 fait autorité ; SQL uniquement dans `src/db/repositories` ; tests via harness better-sqlite3 `:memory:` rejouant les PRAGMAs |
| KV / état | react-native-mmkv v4 (`createMMKV`) — instance standard `settings` + instance chiffrée `entitlements` (clé AES-256 dans expo-secure-store, fail-hard jamais régénérée) + adaptateur `StateStorage` Zustand persist | D-007 : contrat `settings:*` seedé complet dès la Phase 1 ; entitlements jamais hors instance chiffrée |
| Auth | Aucune — local-first, zéro compte, zéro réseau | Core value : les données du bébé ne quittent jamais l'appareil ; audit zero-cloud automatisé |
| Backup OS | Android `allowBackup=false` + `dataExtractionRules` (config plugin) ; iOS module local `modules/backup-guard` posant `isExcludedFromBackup` au runtime | Un plugin build-time ne peut pas flagger des fichiers créés au runtime (RESEARCH Pattern 3) |
| Deployment target | Hybride D-001-ctx : Android local `expo run:android` (itération rapide), iOS dev build ad-hoc via EAS cloud (pas de Xcode sous Windows) | Matériel : Android 14 physique permanent ; iPhone 12 emprunté (D-002-ctx) |
| Directory layout | D-008-ctx : `src/core` (database, storage, errors, backupGuard), `src/db/schemas` (feuilles Zod, D-042), `src/db/repositories`, `src/services`, `src/stores`, `src/i18n`, `src/theme` ; alias `@/` → `src/` | Une couche physique par phase 1-7 ; direction d'import schemas ← repositories ← stores/hooks |

## Stack Touched in Phase 1

- [x] Project scaffold (Expo 57 + expo-router, TypeScript strict, ESLint expo, vitest + better-sqlite3 harness, NativeWind 4.2 + tailwindcss 3.4.x)
- [x] Routing — `src/app/_layout.tsx` (boot chain + ErrorBoundary) + `src/app/index.tsx` (un seul écran)
- [x] Database — écriture réelle (`babyProfileRepository.create`) ET lecture réelle (`listProfiles`) via la chaîne complète
- [x] UI — un formulaire de création de profil + un contrôle réel écrivant `settings:night_mode` via le settings store (véhicule AC kill/relaunch)
- [x] Deployment — dev build Android local sur Android 14 physique + dev build iOS EAS ad-hoc sur iPhone 12 (préconditions D-035/D-036)

## Out of Scope (Deferred to Later Slices)

- UI métier de tracking (timeline, boutons 1-tap, timer) — Phase 2
- Mode nuit automatique et écran réglages complet — Phase 3 (le contrôle `night_mode` du skeleton est un véhicule de preuve AC, remplacé par l'écran Phase 3 sans changement architectural)
- Logique trial/entitlements/gates — Phase 4 (instances de stockage seulement ici)
- Produits/paywall IAP — Phase 5 (expo-iap installé, non configuré)
- Exports PDF/backup chiffré — Phase 6 (quick-crypto installé, non utilisé)
- Analytics instrumentés — Phase 7 (table + repository `event` inertes)

## Subsequent Slice Plan

- Phase 2: Core Tracking Slice — 1-tap tracking, timer kill-safe, timeline, totaux, edit/delete/undo (consomme les 6 repositories tels quels)
- Phase 3: 3am Experience — OLED auto 20:00–07:00 branché sur `settings:night_mode*` (aucune migration MMKV), EN/FR complet
- Phase 4: Trial/entitlements — logique pure par-dessus l'instance MMKV chiffrée existante
- Phase 5: Billing IAP — expo-iap déjà chargé ; entitlements écrits dans l'instance chiffrée existante
- Phase 6: Exports & backup — quick-crypto + pipeline file_export repository déjà en place
- Phase 7: Compliance & submission — audit dépendances + déclarations alignées sur le zéro-cloud déjà testé
