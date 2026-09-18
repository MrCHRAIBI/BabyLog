# Phase 1: Foundation & Data Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-18
**Phase:** 01-foundation-data-layer
**Areas discussed:** Workflow dev build, Écran de crash, Contrat settings store, Structure src/ + conventions

---

## Workflow dev build

| Option | Description | Selected |
|--------|-------------|----------|
| Hybride EAS+iOS, local+Android | iOS via EAS cloud (obligatoire sous Windows) + Android en local expo run:android si Android Studio installé | ✓ |
| EAS pour tout | Les deux plateformes via EAS cloud — uniforme mais file d'attente à chaque itération | |
| Autre | Décrire sa config machine | |

| Option | Description | Selected |
|--------|-------------|----------|
| Android + iOS physiques | Les deux devices à portée | |
| Android seul | AC iOS via simulateur ou différée | |
| Émulateurs seulement | Aucun device fiable | |
| Other (réponse détaillée) | Android 14 physique permanent + iPhone 12 emprunté sur demande, conditions D-035/D-036, contingence replanification | ✓ |

**User's choice:** Hybride (iOS EAS, Android local) + réponse détaillée sur les devices
**Notes:** Android 14 physique « machine propre, toujours disponible ». iPhone 12 emprunté à un proche, obtainable à la demande pour chaque session d'UAT. Deux conditions journalisées : D-036 — enrollment Apple Developer Program (PR-2) approuvé avant l'UAT Phase 1 ; D-035 — UDID de l'iPhone 12 enregistré via `eas device` pour le dev build ad-hoc. Contingence : si l'iPhone est indisponible le jour de l'UAT, l'AC iOS est replanifiée dans la fenêtre de la phase avec un todo explicite — jamais waivée, jamais remplacée par un simulateur (inexistant sous Windows).

---

## Écran de crash

| Option | Description | Selected |
|--------|-------------|----------|
| Brandé rassurant | Palette lavande, dark OLED-ready, « Rien n'est perdu — tes données sont sur cet appareil » + Relancer | ✓ |
| Minimal technique | Message d'erreur + bouton Relancer, habillage plus tard | |

| Option | Description | Selected |
|--------|-------------|----------|
| Relancer seul | Crash déjà journalisé, export avec l'analytics Phase 7 | |
| Relancer + export | Second bouton « Exporter le rapport » → fichier local partageable dès la Phase 1 | ✓ |

**User's choice:** Brandé rassurant + Relancer + export
**Notes:** L'export est un choix délibéré de debug terrain offline — cohérent avec la philosophie export manuel (OPS-01).

---

## Contrat settings store

| Option | Description | Selected |
|--------|-------------|----------|
| Contrat complet | Clés settings:* doc/05 (night_mode off/on/auto, 1200, 420) déclarées et persistées dès Phase 1 | ✓ |
| Minimal | Une clé de test pour l'AC kill/relaunch, contrat complet en Phase 3 | |

**User's choice:** Contrat complet
**Notes:** Le schéma MMKV settings est figé dès la Phase 1 ; la Phase 3 branche l'UI dessus sans migration. Les clés trial:* restent hors seed (Phase 4).

---

## Structure src/ + conventions

| Option | Description | Selected |
|--------|-------------|----------|
| Couches ARCHITECTURE | src/core, src/db/schemas, src/db/repositories, src/services, src/stores, src/i18n, src/theme — 1 phase = 1 couche physique | ✓ |
| Feature-based | src/features/tracking… avec infra partagée | |

| Option | Description | Selected |
|--------|-------------|----------|
| Co-locé + namespaces | Zod co-locé avec chaque repository ; i18n namespaces par domaine | |
| Centralisé + plat | Zod centralisé src/db/schemas/ ; i18n un seul common.json | |
| Other (réponse détaillée D-042) | Hybridation raisonnée confirmant l'arbre D-041 | ✓ |

**User's choice:** Couches ARCHITECTURE + décision détaillée D-042
**Notes:** D-042 — Zod centralisé en module feuille `src/db/schemas/` (n'importe que zod, aucun import db/SQL) ; un fichier par table + schémas backup/analytics/settings conformément au doc 05 ; repositories importent depuis schemas ; hooks/UI/backup importent les schémas sans jamais importer un repository (direction d'import D-041 préservée, arbre confirmé tel quel). i18n : namespaces par domaine (common, tracking, settings, exports, crash) en en/ et fr/, en/common.json minimal Phase 1, chaque phase ajoute ses clés (D-030 confirmé). Alias @/ → src/. Résout la tension apparente entre l'arbre D-041 (dossier schemas présent) et l'option co-locée : l'arbre D-041 est confirmé tel quel.

---

## Claude's Discretion

- Driver SQLite in-memory du harness Vitest (better-sqlite3 / sql.js / adaptateur expo-sqlite)
- Mécanique des config plugins Android/iOS (le résultat est verrouillé par les AC, pas l'implémentation)
- Naming fin des fichiers dans chaque couche

## Deferred Ideas

None — discussion stayed within phase scope
