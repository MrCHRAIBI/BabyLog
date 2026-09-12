# Features (docs/04)

Chaque feature : `screens/` (fins), `hooks/` (ViewModels — SEUL point d'entrée consommé par les écrans), `services/` (logique métier pure, injection de dépendances, zéro React/SQLite/MMKV), `repository/` (SEUL accès SQL, méthodes typées), `models/` (types TS + schémas Zod miroirs), `index.ts` (API publique = hooks uniquement).

Règles non négociables : SQL interdit hors `repository/` et `core/database/` ; Zod à toutes les frontières ; TypeScript strict, pas de `any` ; fichiers < 200 lignes.
