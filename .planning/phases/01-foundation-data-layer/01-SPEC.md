# Phase 1: Foundation & Data Layer — Specification

**Created:** 2026-09-18
**Ambiguity score:** 0.08 (gate: ≤ 0.20)
**Requirements:** 10 locked

## Goal

La fondation local-first production-grade existe : stack corrigée (D-024) installée et chargée en dev build EAS sur devices physiques Android et iOS, client SQLite (WAL, foreign_keys) avec migration runner + m001, les 6 repositories (SQL exclusif, Zod, keyset), MMKV standard + chiffrée (clé SecureStore) avec adaptateur Zustand, error logger + ErrorBoundary, boot i18n EN/FR, tokens design en source unique, scaffold purgé — et ni la DB ni MMKV ne quittent l'appareil via un canal de backup OS (Android auto-backup exclu, iCloud exclu) — zéro code réseau.

## Background

Le codebase est un scaffold `create-expo-app` pur (Expo 57 + expo-router) : aucune dépendance métier (pas d'expo-sqlite, react-native-mmkv, react-native-quick-crypto, NativeWind, zod, i18next, zustand), pas de `eas.json`, aucun test. Les écrans du template (explore.tsx, index.tsx placeholder, composants démo hint-row/web-badge/animated-icon) sont présents. Le DDL m001 complet (7 tables, 10 index, 6 triggers), le SQL exact des 6 repositories, le format backup v1 et l'allowlist analytics sont spécifiés dans `docs/05-data-model.md` amendé par `docs/05-addendum-01.md` (note_text assoupli, enums verrouillés). Les déviations stack sont approuvées : D-024 (quick-crypto, expo-iap), D-025 (exclusions iCloud), D-026 (minSdk 33), D-027 (compte Play perso), D-028 (PBKDF2 600k). Livrable principal inexistant aujourd'hui : tout — la couche données, le wiring MMKV/Zustand, le boot i18n, la config EAS et les exclusions backup OS.

## Requirements

1. **Dev build natif** : `eas.json` avec profil development ; l'app compile et se lance sur device physique Android ET iOS avec tous les modules natifs (expo-sqlite, react-native-mmkv, react-native-quick-crypto, expo-iap) chargés — pas Expo Go.
   - Current: aucun `eas.json`, aucun module natif métier installé
   - Target: dev build EAS fonctionnel sur les deux plateformes, modules natifs initialisés au boot
   - Acceptance: `eas build --profile development` produit un build installable par plateforme ; l'app se lance sur un device physique Android et un iPhone sans erreur de module natif

2. **Client SQLite + migrations** : PRAGMAs à l'ouverture (journal_mode=WAL, foreign_keys=ON, busy_timeout=5000, recursive_triggers=OFF), migration runner basé `schema_version`, m001 (DDL docs/05 + addendum 05 : CHECK note_text assoupli à tout type ≤2000 chars, enums `diaper_type` wet/dirty/mixed/dry et `side` left/right/both verrouillés) exécutée idempotemment.
   - Current: aucune base, aucun runner, aucune migration
   - Target: `babylog.db` créée via m001 au premier lancement ; re-exécution = no-op vérifiable
   - Acceptance: le runner exécuté sur une DB déjà migrée n'applique aucun changement et laisse `schema_version=1` ; le DDL appliqué correspond au docs/05 amendé (CHECK note_text n'exclut plus les types non-note)

3. **Six repositories** : babyProfile, logEvent, timer, fileExport, event, errorLog — SQL exclusivement dans les repositories, écritures validées Zod (schémas miroirs docs/05 en lockstep avec l'addendum), pagination keyset `(created_at, id)` sans OFFSET, transactions pour toute opération multi-écritures ; passent le harness Vitest SQLite in-memory.
   - Current: aucun repository, aucune infra de test
   - Target: 6 repositories typés complets selon docs/05 §8 + harness Vitest
   - Acceptance: tous les tests repository passent sur SQLite in-memory ; les requêtes de liste sur DB vide retournent `[]` sans erreur ; deux lignes au même `created_at` ne produisent ni doublon ni saut de page (tie-break par id)

4. **MMKV + SecureStore + Zustand** : instance MMKV standard (settings/trial) + instance chiffrée avec clé dans SecureStore (entitlements) ; adaptateur Zustand persist sur MMKV ; les entitlements ne vivent QUE dans l'instance chiffrée.
   - Current: aucun state manager, aucun stockage clé-valeur
   - Target: wiring Zustand+MMKV complet, deux instances distinctes, clé chiffrée générée et stockée SecureStore
   - Acceptance: un réglage modifié survit kill + relaunch ; écrire 2× le même réglage laisse la dernière valeur au relaunch ; un test unitaire prouve que le store entitlements est construit sur l'instance chiffrée (jamais la standard, jamais SQLite)

5. **Exclusions backup OS** : Android `allowBackup=false` + `dataExtractionRules` (DB et MMKV exclus de l'auto-backup cloud) ; iOS `isExcludedFromBackup=true` pour `babylog.db`, ses fichiers `-wal`/`-shm` et les fichiers MMKV, via config plugin.
   - Current: app.json sans allowBackup ; aucune exclusion iCloud
   - Target: les deux plateformes excluent tout fichier de données de tout canal de backup OS
   - Acceptance: manifest Android mergé porte `allowBackup=false` + dataExtractionRules ; inspection container sur device iOS réel confirme l'absence de ces fichiers de l'ensemble sauvegardé iCloud

6. **Error logger + ErrorBoundary** : logger central écrivant dans errorLogRepository ; ErrorBoundary racine capturant les crashes de rendu et les journalisant localement.
   - Current: rien — aucun logger, aucune boundary
   - Target: logger central + ErrorBoundary racine branchés sur errorLogRepository
   - Acceptance: une erreur de rendu provoquée en test atterrit dans `error_log` ; si l'insertion error_log échoue, le logger avale l'erreur au lieu de crasher l'app

7. **i18n boot** : i18next initialisé depuis JSON statiques EN/FR, fallback EN, zéro fetch réseau ; jeu de clés minimal seulement.
   - Current: aucune i18n
   - Target: infra i18next bootée avec clés minimales (ex. titre app) en EN+FR
   - Acceptance: au boot, `i18n.t()` résout depuis les JSON statiques sans fetch ; une clé absente du JSON FR rend la string EN (jamais la clé brute, jamais un crash)

8. **Design tokens** : constante source unique (palette lavande `#8893FE`, dark OLED, espacements) posée ; NativeWind configuré avec tailwindcss épinglé 3.4.x.
   - Current: thème template par défaut ; pas de NativeWind ; pas de tokens
   - Target: fichier tokens unique référencé par la config NativeWind ; tailwindcss `~3.4.17` épinglé
   - Acceptance: `#8893FE` n'apparaît que dans le fichier tokens ; `package-lock.json` épinglé tailwindcss 3.4.x (pas de 4.x) ; l'app compile avec NativeWind actif

9. **Purge scaffold** : écrans et composants démo du template supprimés ; `_layout` + `index` minimaux restent.
   - Current: explore.tsx, index.tsx placeholder, hint-row, web-badge, animated-icon, collapsible, etc. présents
   - Target: uniquement `_layout.tsx` + `index.tsx` minimaux (ErrorBoundary + boot wiring)
   - Acceptance: après purge, l'app se lance sans erreur ni warning d'import manquant ; `grep` ne trouve plus les fichiers démo

10. **Zéro réseau** : aucune dépendance cloud/SaaS, aucun appel réseau au boot, vérifiable par audit de dépendances.
    - Current: scaffold sans dépendance cloud mais sans garde-fou
    - Target: allowlist de dépendances auditée automatiquement — aucun SDK cloud/analytics/crash-reporting
    - Acceptance: le test d'audit des dépendances passe sur le package.json livré et échoue sur une fixture contenant un SDK cloud (fail-first prouvé)

## Boundaries

**In scope:**
- `eas.json` (profil development) + dev builds installables Android/iOS
- Client SQLite (PRAGMAs, WAL, foreign_keys) + migration runner `schema_version` + m001 amendée
- Les 6 repositories (docs/05 §8) avec schémas Zod miroirs (addendum 05 intégré)
- Harness Vitest in-memory SQLite pour les repositories + tests d'audit (exclusions, zero-cloud, migrations non destructives, entitlements chiffrés)
- MMKV standard + chiffrée (clé SecureStore) + adaptateur Zustand persist
- Config plugin Android (allowBackup/dataExtractionRules) et iOS (isExcludedFromBackup)
- Logger central + ErrorBoundary racine → error_log
- Boot i18next EN/FR statique (clés minimales)
- Tokens design en constante unique + config NativeWind + pin tailwindcss 3.4.x
- Purge des fichiers scaffold template
- Installation d'expo-iap et react-native-quick-crypto comme dépendances (chargement natif vérifié) — sans configuration produit

**Out of scope:**
- Toute UI métier (tracking, timeline, profil) — Phase 2
- Mode nuit et réglages UI complets — Phase 3 (Phase 1 livre seulement les tokens et l'instance MMKV settings)
- Trial, entitlements métier, gates — Phase 4 (Phase 1 livre seulement les instances de stockage)
- IAP configurés, produits, paywall — Phase 5 (lib installée, non configurée)
- Exports PDF, Emergency Mode, backup chiffré fichier — Phase 6 (quick-crypto installé, non utilisé)
- Analytics instrumentés (événements émis) — Phase 7 (table + repository event livrés inertes)
- Cible web — le MVP est iOS+Android ; le code `.web` du template est purgé avec le scaffold
- Configuration des produits IAP / comptes stores — Phase 5

## Constraints

- Versions exactes de STACK.md : expo-sqlite ~57.0.3, react-native-mmkv ^4.3.2 (API v4 `createMMKV()`), react-native-quick-crypto ^1.1.7, NativeWind ^4.2.7 + tailwindcss ~3.4.17, zod ^4.6.5, i18next ^26.4.2, zustand ^5.0.15, expo-file-system ~57.0.7 (nouvelle API File/Directory uniquement — les fonctions legacy throw)
- DDL m001 = docs/05 §6 amendé par 05-addendum-01 ; migrations idempotentes (IF NOT EXISTS / INSERT OR IGNORE) ; migration publiée jamais modifiée
- Interdits en dépendances : crypto-js (discontinué), react-native-iap (archivé), tout SDK cloud/SaaS/analytics/pub
- Pagination keyset uniquement — OFFSET interdit (docs/05 §8)
- Zéro code réseau dans toute la phase
- Dev build requis dès cette phase (MMKV + quick-crypto ne chargent pas sous Expo Go)

## Acceptance Criteria

- [ ] Dev build EAS se lance sur un device Android physique ET un iPhone physique, tous modules natifs chargés, zéro appel réseau au boot
- [ ] Migration runner ré-exécuté sur DB déjà migrée : zéro changement, `schema_version=1` ; DDL conforme docs/05 + addendum (note_text sur tout type, enums verrouillés)
- [ ] Les 6 repositories passent le harness Vitest in-memory-SQLite (écritures Zod-validées, keyset sans OFFSET)
- [ ] Requêtes de liste sur DB vide → `[]` sans erreur ; deux lignes au même `created_at` → ni doublon ni saut de page
- [ ] Un réglage survit kill/relaunch ; double-écriture → dernière valeur conservée
- [ ] Store entitlements construit sur l'instance MMKV chiffrée (test unitaire) — jamais la standard, jamais SQLite
- [ ] Manifest Android mergé : `allowBackup=false` + dataExclusionRules couvrant DB et MMKV
- [ ] Inspection container iOS (device réel) : `babylog.db`, `-wal`, `-shm` et fichiers MMKV absents de l'iCloud backup
- [ ] Kill pendant une écriture MMKV → ancienne valeur intacte, fichier jamais corrompu (backstop, held-out edge test)
- [ ] Crash de rendu capturé par l'ErrorBoundary et journalisé dans `error_log` ; échec d'insertion error_log avalé sans crash
- [ ] Clé manquante en FR → string EN rendue ; zéro fetch réseau i18n
- [ ] `#8893FE` uniquement dans le fichier tokens ; tailwindcss 3.4.x épinglé ; NativeWind actif à la compilation
- [ ] Après purge : lancement sans erreur, plus aucun fichier démo du template
- [ ] Audit dépendances : aucun SDK cloud/analytics/crash — le test échoue sur une fixture knowingly-bad (fail-first prouvé)
- [ ] Le harness Vitest inclut les cas boundary Zod (note_text 2000 accepté / 2001 rejeté ; amount_ml 5000 / 5001) et un round-trip UTF-8/emoji dans le JSON FR et dans note_text (AC #15)

## Edge Coverage

**Coverage:** 10/20 applicable edges resolved · 0 unresolved

| Category | Requirement | Status | Resolution / Reason |
|----------|-------------|--------|---------------------|
| adjacency | R1 | ⛔ dismissed | Artefact de build — pas de sémantique d'adjacence |
| empty | R1 | ⛔ dismissed | Idem — pas d'input à cardinalité variable dans un build |
| ordering | R1 | ⛔ dismissed | Idem |
| unclassified (→ idempotence) | R2 | ✅ covered | Re-exécution runner sur DB migrée = zéro changement, version=1 (AC #2) — verification: explicit |
| adjacency | R3 | ✅ covered | Ties `(created_at, id)` : ni doublon ni saut de page (AC #4) — verification: explicit |
| empty | R3 | ✅ covered | Listes sur DB vide → `[]` sans erreur (AC #4) — verification: explicit |
| ordering | R3 | ✅ covered | Ordre déterministe tie-break par id (même AC #4) — verification: explicit |
| idempotency | R4 | ✅ covered | Double-écriture réglage → dernière valeur au relaunch (AC #5) — verification: explicit |
| concurrency | R4 | 🧪 backstop | Kill pendant écriture MMKV → ancienne valeur intacte ; held-out edge test (AC #9) |
| concurrency | R5 | ⛔ dismissed | Config statique de manifest/plugin vérifiée au build — pas d'exécution parallèle |
| unclassified (→ résilience logger) | R6 | ✅ covered | Échec d'insertion error_log avalé sans crash (AC #10) — verification: explicit |
| adjacency | R7 | ⛔ dismissed | JSON de traduction statiques — pas de sémantique d'adjacence |
| empty (→ fallback) | R7 | ✅ covered | Clé absente FR → string EN rendue (AC #11) — verification: explicit |
| ordering | R7 | ⛔ dismissed | Aucune collection ordonnée dans le boot i18n |
| concurrency | R7 | ⛔ dismissed | Chargement synchrone de JSON bundlés — pas de concurrence |
| unclassified | R8 | ⛔ dismissed | Constante statique — tout token est défini par construction |
| unclassified | R9 | ⛔ dismissed | Couvert par l'AC lancement-sans-erreur après purge |
| concurrency | R10 | ⛔ dismissed | Audit statique de dépendances — pas d'exécution |
| boundary | R3 | ✅ covered | Caps Zod aux limites : note_text 2000 caractères acceptés / 2001 rejetés, amount_ml 5000 accepté / 5001 rejeté (AC #15) — verification: explicit |
| encoding | R7 | ✅ covered | Round-trip UTF-8/emoji dans le JSON FR rendu par i18n et dans note_text SQLite (AC #15) — verification: explicit |

## Prohibitions (must-NOT)

**Coverage:** 5/5 applicable prohibitions resolved · 0 unresolved

| Prohibition (must-NOT statement) | Requirement | Status | Verification / Reason |
|----------------------------------|-------------|--------|------------------------|
| MUST NOT inclure tout SDK cloud/analytics/crash-reporting/tierce-party (promesse zéro-cloud D-024/OPS) | R10 | resolved | verification: test — `tests/zero-cloud-dependencies.test.ts` scanne package.json contre allowlist ; violation fixture `__fixtures__/pkg-with-cloud-sdk.json`, clean fixture racine `package.json` |
| MUST NOT contenir de SQL destructif (DROP/DELETE de données, ALTER drop) dans toute migration publiée — m001+ additive/idempotente | R2 | resolved | verification: test — `tests/migrations-non-destructive.test.ts` scanne le dossier migrations ; violation fixture avec DROP TABLE, clean fixture m001 |
| MUST NOT stocker entitlements/état d'achat hors de l'instance MMKV chiffrée (jamais instance standard, jamais SQLite, jamais plaintext) | R4 | resolved | verification: test — `tests/entitlements-encrypted-instance.test.ts` prouve le wiring sur l'instance chiffrée ; violation fixture store branché instance standard, clean fixture wiring chiffré |
| MUST NOT journaliser de donnée personnelle (prénom bébé, contenu de note) dans error_log ou event | R6 | resolved | verification: judgment — revue sémantique requise (non mécaniquement checkable) ; docs/05 §11 l'interdit déjà |
| MUST NOT contenir de statement SQL (SELECT/INSERT/UPDATE/DELETE/CREATE) hors du module repositories, et MUST NOT utiliser OFFSET dans toute requête de pagination | R3 | resolved | verification: test — tests/sql-isolation.test.ts scanne src/ hors repositories pour mots-clés SQL + toute occurrence OFFSET ; violation fixture avec SQL dans un hook, clean fixture repositories-only |

Breadcrumbs canon : injection SQL → owned par /gsd:secure-phase + revue (pas minté ici) ; hardening build/debug → Phase 7.

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                                    |
|--------------------|-------|------|--------|------------------------------------------|
| Goal Clarity       | 0.95  | 0.75 | ✓      | Livrables énumérés, DDL + SQL déjà spécifiés docs/05 |
| Boundary Clarity   | 0.90  | 0.70 | ✓      | Purge scaffold, i18n minimal, tokens verrouillés round 1 |
| Constraint Clarity | 0.90  | 0.65 | ✓      | Versions exactes STACK.md, D-024..D-028, OFFSET interdit |
| Acceptance Criteria| 0.90  | 0.70 | ✓      | 14 critères pass/fail + edges + prohibitions |
| **Ambiguity**      | 0.08  | ≤0.20| ✓      |                                          |

## Interview Log

| Round | Perspective | Question summary | Decision locked |
|-------|-------------|------------------|-----------------|
| 1 | Researcher | Que faire des écrans du template create-expo-app ? | Purge en Phase 1 — `_layout` + `index` minimaux restent |
| 1 | Researcher | Contenu EN/FR du boot i18n ? | Clés minimales seulement — traduction complète en Phase 3 |
| 1 | Researcher | Les tokens design (palette doc 06) en Phase 1 ? | Oui — constante source unique (lavande #8893FE, dark OLED, espacements) en Phase 1 |
| Gate | — | Ambiguity 0.09 après round 1 → procéder ? | User : « Yes — write SPEC.md » |

Notes de résolution (edges & prohibitions) : question de résolution groupée passée sans réponse → résolutions appliquées au meilleur jugement, toutes tracées ci-dessus et révisables en éditant ce SPEC avant discuss-phase.

---

*Phase: 01-foundation-data-layer*
*Spec created: 2026-09-18*
*Next step: /gsd:discuss-phase 1 — implementation decisions (how to build what's specified above)*
