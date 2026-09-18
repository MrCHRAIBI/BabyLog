# Phase 1: Foundation & Data Layer - Context

**Gathered:** 2026-09-18
**Status:** Ready for planning

<domain>
## Phase Boundary

La fondation technique local-first de BabyLog : stack corrigée (D-024) installée et vérifiée en dev build sur devices physiques, client SQLite (WAL, foreign_keys) avec migration runner + m001 (docs/05 amendé), 6 repositories (SQL exclusif, Zod, keyset), MMKV standard + chiffrée (clé SecureStore) + adaptateur Zustand, exclusions backup OS Android et iOS, error logger + ErrorBoundary racine, boot i18n EN/FR minimal, tokens design source unique, purge du scaffold — zéro code réseau.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**10 requirements are locked.** See `01-SPEC.md` for full requirements, boundaries, and acceptance criteria.

Downstream agents MUST read `01-SPEC.md` before planning or implementing. Requirements are not duplicated here.

**In scope (from SPEC.md):** eas.json (profil development) + dev builds installables Android/iOS · client SQLite + migration runner + m001 amendée · 6 repositories + schémas Zod miroirs · harness Vitest in-memory SQLite + tests d'audit · MMKV standard + chiffrée + adaptateur Zustand persist · config plugins Android (allowBackup/dataExtractionRules) et iOS (isExcludedFromBackup) · logger central + ErrorBoundary racine → error_log · boot i18next EN/FR (clés minimales) · tokens design constante unique + NativeWind + pin tailwindcss 3.4.x · purge scaffold · installation expo-iap et quick-crypto (chargement vérifié, sans configuration produit)

**Out of scope (from SPEC.md):** UI métier (Phase 2) · mode nuit et réglages UI (Phase 3) · trial/entitlements métier/gates (Phase 4 — instances de stockage seulement ici) · IAP configurés/paywall (Phase 5) · exports PDF/Emergency/backup fichier (Phase 6) · analytics instrumentés (Phase 7 — table + repo event inertes) · cible web · configuration produits IAP/comptes stores (Phase 5)

</spec_lock>

<decisions>
## Implementation Decisions

### Workflow dev build
- **D-001-ctx :** Build hybride — iOS via EAS cloud (obligatoire : pas de Xcode sous Windows), Android en local `expo run:android` (itération rapide, sans file d'attente EAS) — **Reversibility:** reversible — choix de workflow, un `eas.json` + scripts ne verrouillent rien
- **D-002-ctx :** Matériel de vérification — Android 14 physique en permanence ; iPhone 12 emprunté à un proche à la demande pour chaque session d'UAT — reversible
- **D-003-ctx :** Conditions d'UAT iOS journalisées — **(1)** D-036 : enrollment Apple Developer Program (PR-2) approuvé AVANT l'UAT de la Phase 1 ; **(2)** D-035 : UDID de l'iPhone 12 enregistré via `eas device` pour le dev build ad-hoc — reversible
- **D-004-ctx :** Contingence — si l'iPhone est indisponible le jour de l'UAT, la vérification de l'AC iOS est replanifiée dans la fenêtre de la phase avec un todo explicite ; **jamais waivée, jamais remplacée par un simulateur** (inexistant sous Windows)

### Écran de crash (ErrorBoundary racine)
- **D-005-ctx :** Fallback brandé rassurant — palette lavande, dark OLED-ready, message « Rien n'est perdu — tes données sont sur cet appareil » — cohérent avec la promesse privacy — reversible
- **D-006-ctx :** Actions = bouton **Relancer** + bouton **« Exporter le rapport »** écrivant un fichier local partageable dès la Phase 1 (debug terrain ; cohérent avec la philosophie export manuel OPS-01) — reversible

### Contrat settings store
- **D-007-ctx :** Le store settings seed le **contrat complet** des clés `settings:*` du doc 05 dès la Phase 1 (`settings:night_mode` off/on/auto, `settings:night_mode_start_minutes`=1200, `settings:night_mode_end_minutes`=420) — le schéma MMKV est figé, la Phase 3 branche l'UI dessus sans migration — **Reversibility:** costly — ajouter/renommer des clés après coup impose une migration de données MMKV et re-touches les stores consommateurs

### Structure src/ + conventions
- **D-008-ctx :** Arborescence en couches ARCHITECTURE.md : `src/core` (db client, PRAGMAs, migrations, mmkv, secure-store, logger), `src/db/schemas`, `src/db/repositories`, `src/services`, `src/stores`, `src/i18n`, `src/theme` — chaque phase 1-7 mappe une couche physique — **Reversibility:** costly — déplacer des dossiers après coup rewrites tous les imports des phases suivantes
- **D-042 :** Schémas Zod **centralisés en module feuille** `src/db/schemas/` — n'importe que `zod`, aucun import db/SQL ; un fichier par table + schémas backup/analytics/settings conformément au doc 05 ; les repositories importent leurs schémas depuis `src/db/schemas`, et les hooks/UI/backup importent les schémas sans jamais importer un repository (**direction d'import D-041 préservée** : l'arbre D-041 avec dossier schemas est confirmé tel quel, la tension avec l'option co-locée est résolue) — **Reversibility:** costly — inverser la direction d'import rétrodaterait tout le graphe d'imports des couches hautes
- **D-030 (confirmé) :** i18n **namespaces par domaine** (`common`, `tracking`, `settings`, `exports`, `crash`) en `en/` et `fr/` ; `en/common.json` minimal dès la Phase 1 ; chaque phase ajoute ses propres clés EN+FR — reversible
- **D-009-ctx :** Alias `@/` → `src/` pour tous les imports internes — **Reversibility:** costly — renommer les alias touche chaque fichier importeur

### Claude's Discretion
- Choix du driver SQLite in-memory pour le harness Vitest (better-sqlite3 vs sql.js vs adaptateur expo-sqlite) — contrainte : même SQL, mêmes PRAGMAs testables
- Détails de la config plugin iOS (implémentation isExcludedFromBackup) et du manifest Android — le résultat est verrouillé par l'AC, la mécanique est libre
- Naming fin des fichiers dans chaque couche (convention interne cohérente)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Modèle de données (autorité maximale pour cette phase)
- `docs/05-data-model.md` — DDL m001 complet (§6), migrations (§7), repositories + SQL exact (§8), requêtes chaudes + budgets perf (§9), format backup (§10), allowlist analytics + règles entitlements (§11)
- `docs/05-addendum-01.md` — évolutions m001 pré-publication : CHECK note_text assoupli (attachable à tout type ≤2000 chars), enums diaper_type/side verrouillés

### Stack technique
- `docs/04-tech-stack.md` — stack finale : Expo 57, Zustand+MMKV, Zod aux frontières, i18next, WAL, migrations idempotentes
- `docs/04-addendum-01.md` — déviations approuvées D-024/D-028 : react-native-quick-crypto (remplace crypto-js), expo-iap (remplace react-native-iap), PBKDF2 600k + sel par fichier + params en en-tête

### Research (versions exactes et patterns)
- `.planning/research/STACK.md` — versions validées (expo-sqlite ~57.0.3, react-native-mmkv ^4.3.2 API v4, quick-crypto ^1.1.7, NativeWind ^4.2.7 + tailwindcss ~3.4.17, zod ^4.6.5, i18next ^26.4.2, zustand ^5.0.15, expo-file-system ~57.0.7 nouvelle API), pins et interdits
- `.planning/research/ARCHITECTURE.md` — 5 couches, direction d'import, pattern timer/trial par ancre temporelle, build order
- `.planning/research/PITFALLS.md` — allowBackup/dataExtractionRules, MMKV v4, pièges Android auto-backup, expo-file-system legacy

### Requirements et design
- `.planning/phases/01-foundation-data-layer/01-SPEC.md` — **locked requirements** : 10 requirements, boundaries, 15 AC, Edge Coverage, Prohibitions (isolation SQL/OFFSET, zéro SDK cloud, migrations non destructives, entitlements chiffrés)
- `docs/06-ui-ux-design.md` — source des tokens design (palette lavande `#8893FE`, dark OLED, 17 composants à venir)
- `.planning/PROJECT.md` — contexte projet, Key Decisions D-001..D-028
- `.planning/REQUIREMENTS.md` — 45 requirements v1 + traçabilité (OPS-02 = cette phase)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Aucun actif métier réutilisable — le codebase est un scaffold `create-expo-app` vierge (vérifié : zéro dépendance sqlite/mmkv/nativewind/zod/i18next/zustand, zéro test, pas d'eas.json)
- `src/app/_layout.tsx` + `expo-router` : point d'entrée existant où se brancheront ErrorBoundary et providers
- `tsconfig.json` + ESLint expo : base à étendre (alias `@/`, strict)
- `scripts/reset-project.js` : à ne PAS utiliser (il recréerait le template)

### Established Patterns
- expo-router file-based routing (`src/app/`) — les futurs écrans y vivront ; Phase 1 n'y laisse que `_layout.tsx` + `index.tsx` minimaux
- Convention de commits conventional-commits déjà en place sur le repo

### Integration Points
- `app.json` → plugins (config plugins Android/iOS à ajouter ici), `userInterfaceStyle: automatic` (le thème off/on/auto s'y branchera en Phase 3)
- `package.json` → toutes les dépendances de la stack corrigée + pin tailwindcss 3.4.x + scripts (`android` local, EAS pour iOS)
- `.claude/CLAUDE.md` généré — rappels workflow GSD pour les sessions suivantes

</code_context>

<specifics>
## Specific Ideas

- Le message de crash « Rien n'est perdu — tes données sont sur cet appareil » est un wording voulu — première matérialisation UI de la promesse privacy
- L'export du rapport de crash dès la Phase 1 est un choix délibéré de debug terrain offline (pas un upload)
- Les clés `trial:*` restent hors du seed Phase 1 (contrat complet = `settings:*` uniquement) ; le flag sécurisé best-effort trial est posé en Phase 4
- Les décisions D-035/D-036/PR-2 (enrollment Apple, UDID, timing) sont journalisées côté utilisateur — conditions d'UAT iOS, pas des tâches de code de cette phase sauf l'enregistrement `eas device`

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-data-layer*
*Context gathered: 2026-09-18*
