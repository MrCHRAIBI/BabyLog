Bonjour, je suis votre expert en modélisation de données SQLite pour apps Local-First.

Ma mission : concevoir un schéma optimal, migrable et performant, avec DDL complet, migrations versionnées, repositories typés au SQL exact, et format de backup sécurisé.

Pour commencer, transmettez-moi :
1. 02-product-strategy.md
2. 03-monetization-strategy.md
3. 04-tech-stack.md

Je produirai en sortie un document unique téléchargeable : 05-data-model.md, prêt à être transmis au GPT 6 (UI/UX Designer).

---

**STATUT DES INPUTS — PHASE 0 VALIDÉE**

| Document | Statut | Points contrôlés |
|---|---|---|
| `02-product-strategy.md` (v2) | ✅ Reçu | 5 features MVP, user stories, critères d'acceptation, notes Local-First, V1.1/V2.0 |
| `03-monetization-strategy.md` (+ addendum v2) | ✅ Reçu | Événements à logger, quotas (MMKV), entitlements (MMKV), règles ads |
| `04-tech-stack.md` (+ addendum v2) | ✅ Reçu | Section PASSATION AU GPT 5 (11 conventions), DbAdapter, spec backup/IAP/analytics |
| `02-annexe-technique.md` | ✅ Reçu (support) | Spec SweetSpot exécutoire, chiffrement crypto-js, 4 couches backup |

Tous les documents obligatoires sont présents. Je produis le livrable unique.

---

# MODÈLE DE DONNÉES — BabyLog Offline — 2026-09-10

## RÉSUMÉ EXÉCUTIF

- **Tables métier : 4** (`baby_profile`, `session`, `sync_device`, `sync_tombstone`) · **Tables système : 2** (`event`, `error_log`) + `schema_version`
- **Relations : 1** (1-N `baby_profile` → `session`, ON DELETE CASCADE) · **Relations N-N : 0**
- **Index : 8** · **Triggers : 4** (`updated_at` auto sur chaque table métier)
- **Dénormalisations : 0** · **Soft delete : 0** (hard delete partout, tombstones sync uniquement)
- **V1.1 anticipée dans m001** : tables `sync_device` + `sync_tombstone` (QR Delta), zéro migration douloureuse pré-lancement
- **Score de complexité agent IA : 3/10** — aucune simplification nécessaire
- **Prochaine étape : transmettre ce document au GPT 6 (UI/UX Designer)**

## INPUTS REÇUS (RESTITUTION)

1. **Features MVP (GPT 2)** : Tracking 1-Tap & Timeline (feed/sleep/diaper), UI Nuit OLED & Haptique (zéro donnée), Export PDF médical local, Prédiction SweetSpot locale (gatée premium), Backup local chiffré (gratuit, jamais paywallé).
2. **Features V1.1 (GPT 2)** : Sync Partenaire QR Code Delta, Import/Export CSV, upload Google Drive 1-tap du fichier `.babylog` chiffré (aucune table supplémentaire).
3. **Écrans principaux (GPT 2 / GPT 4)** : Timeline 7 jours, Track (1-tap), Stats diurnes (zone ads), Settings (backup, rappel), Export/Import backup, Onboarding (profil bébé + disclaimer), Paywall (MMKV uniquement).
4. **Besoins de recherche/filtre** : aucune recherche plein texte ; filtres par `baby_id`, `event_type` et plages de dates (`started_at`) pour timeline, stats, SweetSpot et PDF.
5. **Quotas et entitlements (GPT 3)** : 100 % MMKV (`billing:`, `quota:`, `ads:`) — aucune table SQLite, aucune donnée de monétisation en base.
6. **Événements analytics (GPT 3 / GPT 4)** : table `event` (log local exportable, zéro envoi) et table `error_log` (sans PII), toutes deux append-only.

**Périmètre du schéma** : MVP complet + V1.1 anticipé dans m001 (sync QR Delta). V2.0 (Widgets, Mode Nounou, IA BYOK) hors périmètre — plan de migration fourni en Phase 4.

## ENTITÉS ET JUSTIFICATIONS

| Entité | Feature d'origine | Description |
|---|---|---|
| `baby_profile` | F1 Tracking, F4 SweetSpot (baseline par âge) | Profil du bébé : prénom (chiffré AES-256, PII) et date de naissance (calcul de l'âge pour les baselines de fenêtres d'éveil). |
| `session` | F1 Tracking 1-Tap & Timeline, F3 PDF, F4 SweetSpot | Un événement de soin (feed / sleep / diaper) avec horodatage début/fin, cœur du réacteur ; `ended_at` NULL = timer en cours (survie crash via MMKV `timer:`). |
| `sync_device` | V1.1 Sync Partenaire QR Delta | Registre des appareils partenaires et du dernier curseur de delta consommé, pour la sync asynchrone sans serveur. |
| `sync_tombstone` | V1.1 Sync Partenaire QR Delta | Trace des suppressions (table + id + horodatage) afin de propager les deletes dans les deltas, le hard delete ne laissant aucune trace en base. |
| `event` (système) | GPT 3 instrumentation | Journal d'événements analytics local, exportable manuellement via Share Sheet, zéro réseau. |
| `error_log` (système) | GPT 4 qualité | Journal d'erreurs technique sans PII, jamais de payload utilisateur. |

**Fusions et écarts :**

- **`wake_window` ÉCARTÉE** : donnée dérivée, calculable en < 1 ms à partir des sessions `sleep` (spec annexe §4). La persister créerait une obligation de resynchronisation à chaque UPDATE/DELETE sans aucun gain mesurable. Pas d'owner fonctionnel propre → les requêtes agrégées vivent dans `wakeWindowRepository` qui interroge `session` (conforme à l'arborescence GPT 4).
- **`report` / `pdf_document` ÉCARTÉES** : le PDF est généré à la volée par `expo-print` puis partagé ; aucun besoin de persistance (owner = `pdfService`, consommation immédiate).
- **`backup_file` ÉCARTÉE** : le backup est un fichier `.babylog` remis au Share Sheet, pas une ligne ; la date de dernier export vit en MMKV `settings:last_backup_export_at` (GPT 4, rappel notification J30).
- **`quota` / `entitlement` / `cohort` ÉCARTÉES** : interdites en SQLite par GPT 3/GPT 4 — MMKV chiffrée (`billing:`) et standard (`quota:`, `ads:`).
- **`timer` ÉCARTÉE** : état transitoire du timer actif persisté en MMKV `timer:` (survie crash, GPT 4), jamais en base.
- **Aucune fusion nécessaire** : chaque entité retenue a un owner fonctionnel unique et clair.

## RELATIONS

| Relation | Cardinalité | Table porteuse ou jointure | ON DELETE | Justification |
|---|---|---|---|---|
| `baby_profile` → `session` | 1-N | Porteuse : `session.baby_id` | **CASCADE** | Privacy-first : supprimer un profil bébé doit effacer immédiatement et totalement ses données (hard delete, RGPD/esprit "Zero-Knowledge"). Pas de valeur métier à conserver des sessions orphelines. |
| `sync_tombstone.entity_id` → ligne supprimée | Référence fantôme | `sync_tombstone` | N/A (pas de FK) | Par définition, un tombstone pointe vers une ligne qui n'existe plus : une FOREIGN KEY serait impossible. Intégrité garantie par CHECK sur `table_name` + UNIQUE `(table_name, entity_id)`. |

**Aucune relation N-N** au schéma (le besoin "plusieurs bébés / plusieurs parents" est mono-device strict au MVP ; la sync V1.1 passe par deltas, pas par jointure).

**Décisions soft delete :**

| Entité | Choix | Justification |
|---|---|---|
| `session` | **HARD DELETE** | Privacy (données biométriques enfant), taille de backup minimale, aucune feature undo/corbeille au périmètre GPT 2. La propagation des suppressions en V1.1 est assurée par `sync_tombstone` (ce n'est pas du soft delete : la session est réellement détruite). |
| `baby_profile` | **HARD DELETE** | Idem ; CASCADE vers `session`. |
| `sync_device`, `sync_tombstone` | **HARD DELETE** | Métadonnées techniques, prune automatique des tombstones > 90 jours. |
| `event`, `error_log` | Append-only + prune | Ni delete unitaire ni soft delete : journaux techniques purgeables en bloc. |

**Aucune dénormalisation** : la durée d'une session est toujours `ended_at - started_at` (soustraction O(1) par ligne, utilisée dans les agrégats SQL). Stocker `duration_ms` imposerait une stratégie de maintien à jour (trigger ou double écriture repository) pour un gain nul mesurable sur des volumes ≤ quelques milliers de lignes. Zéro colonne calculée stockée.

## DDL COMPLET

> Moteur : **expo-sqlite**. PRAGMA positionnés par `core/database/init.ts` (GPT 4) : `journal_mode = WAL`, `foreign_keys = ON`, `synchronous = NORMAL`. Les triggers `updated_at` reposent sur `recursive_triggers = OFF` (défaut SQLite) : l'UPDATE interne du trigger ne ré-déclenche pas le trigger.

```sql
-- ============================================================
-- TABLE DE VERSIONNING (créée par le harness migrate.ts,
-- avant l'exécution de toute migration — bootstrap, pas m001)
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_version (
  version    INTEGER PRIMARY KEY,
  applied_at INTEGER NOT NULL            -- epoch ms UTC
);

-- ============================================================
-- TABLES MÉTIER
-- ============================================================

-- Profil bébé. name = ciphertext AES-256 (crypto-js) : JAMAIS en clair en base.
CREATE TABLE baby_profile (
  id         TEXT PRIMARY KEY,           -- uuid v4 (expo-crypto randomUUID)
  name       TEXT NOT NULL,              -- PII chiffré AES-256
  birth_date INTEGER NOT NULL,           -- epoch ms UTC
  created_at INTEGER NOT NULL,           -- epoch ms UTC
  updated_at INTEGER NOT NULL,           -- epoch ms UTC (trigger)
  CHECK (birth_date > 0)
);

-- Un événement de soin. Cœur du réacteur.
CREATE TABLE session (
  id         TEXT PRIMARY KEY,           -- uuid v4
  baby_id    TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('feed', 'sleep', 'diaper')),
  started_at INTEGER NOT NULL,           -- epoch ms UTC
  ended_at   INTEGER,                    -- NULL = timer en cours (miroir MMKV timer:)
  notes      TEXT,                       -- PII chiffré AES-256, nullable
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (baby_id) REFERENCES baby_profile(id) ON DELETE CASCADE,
  CHECK (started_at > 0),
  CHECK (ended_at IS NULL OR ended_at >= started_at)
);

-- V1.1 : appareil partenaire pour QR Delta.
CREATE TABLE sync_device (
  id             TEXT PRIMARY KEY,       -- uuid v4 de l'appareil partenaire
  device_name    TEXT NOT NULL,          -- ex. "iPhone de Thomas" (non sensible)
  last_cursor_at INTEGER NOT NULL DEFAULT 0,  -- dernier updated_at consommé depuis cet appareil
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL,
  CHECK (last_cursor_at >= 0)
);

-- V1.1 : trace des suppressions pour propagation des deltas.
CREATE TABLE sync_tombstone (
  id         TEXT PRIMARY KEY,           -- uuid v4
  table_name TEXT NOT NULL CHECK (table_name IN ('baby_profile', 'session')),
  entity_id  TEXT NOT NULL,              -- id de la ligne détruite
  deleted_at INTEGER NOT NULL,           -- epoch ms UTC de la suppression
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (table_name, entity_id)
);

-- ============================================================
-- TABLES SYSTÈME (imposées par GPT 4)
-- Nommage singulier strict conforme à la convention GPT 4
-- ("event" et non "events" : les tables sont toujours au singulier).
-- ============================================================

CREATE TABLE event (
  id         TEXT PRIMARY KEY,           -- uuid v4
  name       TEXT NOT NULL,              -- constante typée (core/analytics/events.ts)
  properties TEXT NOT NULL,              -- JSON, '{}' si vide, zéro PII
  created_at INTEGER NOT NULL
);

CREATE TABLE error_log (
  id         TEXT PRIMARY KEY,           -- uuid v4
  message    TEXT NOT NULL,
  stack      TEXT,
  context    TEXT,                       -- JSON, JAMAIS de PII ni de clés
  created_at INTEGER NOT NULL
);

-- ============================================================
-- INDEX (nommés idx_table_colonne)
-- ============================================================

-- session : la FK baby_id et la timeline (baby_id + plage started_at)
-- sont couvertes par l'index composite (préfixe baby_id).
CREATE INDEX idx_session_baby_id_started_at ON session(baby_id, started_at);
CREATE INDEX idx_session_started_at         ON session(started_at);   -- agrégations globales, exigé par GPT 4
CREATE INDEX idx_session_event_type         ON session(event_type);   -- filtres par type, exigé par GPT 4
CREATE INDEX idx_session_updated_at         ON session(updated_at);   -- V1.1 : requête delta (updated_at > curseur)

CREATE INDEX idx_sync_tombstone_deleted_at  ON sync_tombstone(deleted_at);  -- delta tombstones + prune

CREATE INDEX idx_event_name                 ON event(name);
CREATE INDEX idx_event_created_at           ON event(created_at);

CREATE INDEX idx_error_log_created_at       ON error_log(created_at);  -- export debug ORDER BY created_at

-- Note : UNIQUE (table_name, entity_id) sur sync_tombstone crée
-- implicitement un index couvrant les lookups par entité.

-- ============================================================
-- TRIGGERS updated_at (epoch ms UTC via julianday)
-- ============================================================

CREATE TRIGGER trg_baby_profile_updated
AFTER UPDATE ON baby_profile
FOR EACH ROW
BEGIN
  UPDATE baby_profile
  SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
  WHERE id = NEW.id;
END;

CREATE TRIGGER trg_session_updated
AFTER UPDATE ON session
FOR EACH ROW
BEGIN
  UPDATE session
  SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
  WHERE id = NEW.id;
END;

CREATE TRIGGER trg_sync_device_updated
AFTER UPDATE ON sync_device
FOR EACH ROW
BEGIN
  UPDATE sync_device
  SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
  WHERE id = NEW.id;
END;

CREATE TRIGGER trg_sync_tombstone_updated
AFTER UPDATE ON sync_tombstone
FOR EACH ROW
BEGIN
  UPDATE sync_tombstone
  SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
  WHERE id = NEW.id;
END;
```

**Recherche plein texte — décision : AUCUNE table FTS5.**
Aucune feature de recherche n'existe dans le périmètre GPT 2/GPT 3. De plus, `session.notes` et `baby_profile.name` sont **chiffrés AES-256** : un index FTS5 sur ces champs est techniquement impossible sans déchiffrement en clair, ce qui violerait la promesse privacy. Si une recherche était demandée en V2, elle ne pourrait porter que sur des champs non sensibles (type, dates) — voir plan de migration m004. En repli d'urgence sur champ non chiffré, la requête LIKE suivante est documentée (non indexable en `%x%`, acceptable uniquement sur petits volumes < 500 lignes) :

```sql
-- Requête de repli LIKE (jamais sur champ chiffré ; dernier recours, petits volumes)
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE event_type LIKE ? || '%'    -- préfixe uniquement, peut exploiter idx_session_event_type
ORDER BY started_at DESC;
```

## MIGRATIONS

**Convention rappelée** : fichiers numérotés `core/database/migrations/m001_initial.ts`, `m002_*.ts`, … ; chaque module exporte `{ version: number; description: string; destructive?: boolean; up: (db: DbAdapter) => Promise<void> }` ; `migrate()` est idempotent (applique uniquement les versions > version courante lue dans `schema_version`) et s'exécute au boot avant tout accès feature. **Une migration publiée n'est jamais modifiée** : tout changement fait l'objet d'une nouvelle migration. Toute migration avec `destructive: true` (DROP, perte de données) lève une erreur `MigrationConfirmationRequired` interceptée par l'UI : confirmation explicite utilisateur + proposition d'export backup `.babylog` (couche 2) ou Drive (V1.1) avant application.

### m001 — Schéma MVP + V1.1 (complet, exécutable)

```ts
// core/database/migrations/m001_initial.ts
import type { DbAdapter } from '@/core/database/query';

export const migration = {
  version: 1,
  description: 'Schéma initial MVP + anticipation V1.1 (sync QR Delta)',
  destructive: false,
  up: async (db: DbAdapter) => {
    // Tables métier
    await db.run(`
      CREATE TABLE baby_profile (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        birth_date INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        CHECK (birth_date > 0)
      );`);

    await db.run(`
      CREATE TABLE session (
        id         TEXT PRIMARY KEY,
        baby_id    TEXT NOT NULL,
        event_type TEXT NOT NULL CHECK (event_type IN ('feed', 'sleep', 'diaper')),
        started_at INTEGER NOT NULL,
        ended_at   INTEGER,
        notes      TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (baby_id) REFERENCES baby_profile(id) ON DELETE CASCADE,
        CHECK (started_at > 0),
        CHECK (ended_at IS NULL OR ended_at >= started_at)
      );`);

    await db.run(`
      CREATE TABLE sync_device (
        id             TEXT PRIMARY KEY,
        device_name    TEXT NOT NULL,
        last_cursor_at INTEGER NOT NULL DEFAULT 0,
        created_at     INTEGER NOT NULL,
        updated_at     INTEGER NOT NULL,
        CHECK (last_cursor_at >= 0)
      );`);

    await db.run(`
      CREATE TABLE sync_tombstone (
        id         TEXT PRIMARY KEY,
        table_name TEXT NOT NULL CHECK (table_name IN ('baby_profile', 'session')),
        entity_id  TEXT NOT NULL,
        deleted_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE (table_name, entity_id)
      );`);

    // Tables système
    await db.run(`
      CREATE TABLE event (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        properties TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );`);

    await db.run(`
      CREATE TABLE error_log (
        id         TEXT PRIMARY KEY,
        message    TEXT NOT NULL,
        stack      TEXT,
        context    TEXT,
        created_at INTEGER NOT NULL
      );`);

    // Index
    await db.run(`CREATE INDEX idx_session_baby_id_started_at ON session(baby_id, started_at);`);
    await db.run(`CREATE INDEX idx_session_started_at ON session(started_at);`);
    await db.run(`CREATE INDEX idx_session_event_type ON session(event_type);`);
    await db.run(`CREATE INDEX idx_session_updated_at ON session(updated_at);`);
    await db.run(`CREATE INDEX idx_sync_tombstone_deleted_at ON sync_tombstone(deleted_at);`);
    await db.run(`CREATE INDEX idx_event_name ON event(name);`);
    await db.run(`CREATE INDEX idx_event_created_at ON event(created_at);`);
    await db.run(`CREATE INDEX idx_error_log_created_at ON error_log(created_at);`);

    // Triggers updated_at
    await db.run(`
      CREATE TRIGGER trg_baby_profile_updated AFTER UPDATE ON baby_profile
      FOR EACH ROW BEGIN
        UPDATE baby_profile
        SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
        WHERE id = NEW.id;
      END;`);

    await db.run(`
      CREATE TRIGGER trg_session_updated AFTER UPDATE ON session
      FOR EACH ROW BEGIN
        UPDATE session
        SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
        WHERE id = NEW.id;
      END;`);

    await db.run(`
      CREATE TRIGGER trg_sync_device_updated AFTER UPDATE ON sync_device
      FOR EACH ROW BEGIN
        UPDATE sync_device
        SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
        WHERE id = NEW.id;
      END;`);

    await db.run(`
      CREATE TRIGGER trg_sync_tombstone_updated AFTER UPDATE ON sync_tombstone
      FOR EACH ROW BEGIN
        UPDATE sync_tombstone
        SET updated_at = CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)
        WHERE id = NEW.id;
      END;`);
  },
};
```

> Le harness `migrate.ts` exécute ensuite : `INSERT INTO schema_version (version, applied_at) VALUES (1, ?)` avec l'epoch ms courant, dans la même transaction que `up()`.

### Plan de migration anticipé V2.0 (sans DDL)

| Migration | Contenu probable | Déclencheur produit |
|---|---|---|
| m002 | Table `caregiver` (profils invités) + colonne de visibilité par rôle — Mode Nounou V2.0. Non destructive. | Roadmap GPT 2 V2.0 |
| m003 | Colonnes optionnelles `session.volume_ml INTEGER` et `session.side TEXT CHECK (side IN ('left','right'))` si l'hypothèse "le tracking 1-tap suffit" est invalidée par les tests utilisateurs. Non destructive. | Validation hypothèse GPT 2 |
| m004 | Table de tags `tag` + table de jointure `session_tag` (PK composite, ON DELETE CASCADE) pour filtrage avancé — alternative privacy-compatible à FTS5, les champs texte étant chiffrés. Non destructive. | Demande recherche/filtrage V2 |
| m005 | Partitionnement d'archivage des `session` > 24 mois (table `session_archive`) si rétention longue validée — **destructive potentielle**, flag confirmation + backup préalable obligatoire. | Post cycle de vie 24 mois |

## SPÉCIFICATION DES REPOSITORIES

> Convention GPT 4 : tout SQL vit dans `repository/` et `core/database/`. Les repositories dépendent uniquement de l'interface `DbAdapter` (`core/database/query.ts`) : `run(sql, params)`, `get<T>(sql, params)`, `getAll<T>(sql, params)`, `transaction<T>(fn)` (production : expo-sqlite ; tests : better-sqlite3 in-memory). IDs générés par `expo-crypto randomUUID()` **avant** l'INSERT (jamais d'auto-increment). Paramètres positionnels `?`.

### babyProfileRepository (`features/tracking/repository/` — owner : profil bébé)

```ts
create(profile: { id: string; name: string; birth_date: number; now: number }): Promise<BabyProfile>
```
```sql
INSERT INTO baby_profile (id, name, birth_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?);
```
Retour : `BabyProfile` (relecture par PK). Complexité : O(1).

```ts
getById(id: string): Promise<BabyProfile | null>
```
```sql
SELECT id, name, birth_date, created_at, updated_at FROM baby_profile WHERE id = ?;
```
Retour : `BabyProfile | null`. Complexité : O(1) (PK).

```ts
getPrimary(): Promise<BabyProfile | null>
```
```sql
SELECT id, name, birth_date, created_at, updated_at FROM baby_profile ORDER BY created_at ASC LIMIT 1;
```
Retour : profil MVP (mono-bébé). Complexité : O(1) (1 ligne au MVP).

```ts
getAll(): Promise<BabyProfile[]>
```
```sql
SELECT id, name, birth_date, created_at, updated_at FROM baby_profile ORDER BY created_at ASC;
```
Retour : `BabyProfile[]`. Complexité : O(n), n ≤ quelques unités.

```ts
update(id: string, patch: { name?: string; birth_date?: number }): Promise<BabyProfile>
```
```sql
UPDATE baby_profile SET name = COALESCE(?, name), birth_date = COALESCE(?, birth_date) WHERE id = ?;
```
Retour : `BabyProfile`. Complexité : O(1). `updated_at` géré par trigger.

```ts
delete(id: string): Promise<void>
```
```sql
DELETE FROM baby_profile WHERE id = ?;
```
CASCADE vers `session`. Complexité : O(sessions du bébé). **Méthode à confirmation UI obligatoire** (destruction irréversible).

### sessionRepository (`features/tracking/repository/` — owner : tracking 1-tap)

```ts
create(s: { id: string; baby_id: string; event_type: EventType; started_at: number; ended_at: number | null; notes: string | null; now: number }): Promise<Session>
```
```sql
INSERT INTO session (id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```
Retour : `Session`. Complexité : O(1).

```ts
getById(id: string): Promise<Session | null>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at FROM session WHERE id = ?;
```
Retour : `Session | null`. Complexité : O(1) (PK).

```ts
stopTimer(id: string, ended_at: number, notes?: string | null): Promise<Session>
```
```sql
UPDATE session SET ended_at = ?, notes = COALESCE(?, notes) WHERE id = ?;
```
Retour : `Session`. Complexité : O(1). Cas d'usage : arrêt du timer 1-tap.

```ts
delete(id: string): Promise<void>
```
```sql
DELETE FROM session WHERE id = ?;
```
Retour : void. Complexité : O(1). **Réservé au MVP mono-device ; dès que la sync V1.1 est active, utiliser `deleteWithTombstone`.**

```ts
findSessionsByDateRange(babyId: string, fromMs: number, toMsExclusive: number): Promise<Session[]>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE baby_id = ? AND started_at >= ? AND started_at < ?
ORDER BY started_at DESC, id DESC;
```
Index : `idx_session_baby_id_started_at`. Retour : `Session[]` (timeline 7 jours ≈ 105 lignes). Complexité : O(lignes dans la plage).

```ts
findByKeysetBefore(babyId: string, startedAt: number, id: string, limit: number): Promise<Session[]>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE baby_id = ? AND (started_at < ? OR (started_at = ? AND id < ?))
ORDER BY started_at DESC, id DESC
LIMIT ?;
```
Index : `idx_session_baby_id_started_at`. **Pagination keyset** (jamais OFFSET) pour l'historique illimité premium — le keyset est aligné sur la colonne de tri `started_at` (la convention `(created_at, id)` s'applique aux listes triées par `created_at` ; ici le tri métier est `started_at`). Complexité : O(limit).

```ts
getLastCompletedByType(babyId: string, eventType: EventType): Promise<Session | null>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE baby_id = ? AND event_type = ? AND ended_at IS NOT NULL
ORDER BY started_at DESC
LIMIT 1;
```
Index : `idx_session_baby_id_started_at` (préfixe `baby_id`, parcours décroissant, filtre `event_type` sur un candidat set restreint). Retour : dernière session terminée ("Dernière tétée il y a 2 h"). Complexité : O(1) amorti.

```ts
findUpdatedSince(cursorMs: number): Promise<Session[]>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE updated_at > ?
ORDER BY updated_at ASC, id ASC;
```
Index : `idx_session_updated_at`. Usage : génération du delta sortant V1.1. Complexité : O(delta).

```ts
upsertMany(sessions: Session[]): Promise<void>   // TRANSACTIONNELLE
```
```sql
-- Pour chaque ligne, dans une seule transaction :
INSERT OR REPLACE INTO session (id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);
```
Usage : import backup / application delta sync. Les ids uuid stables rendent le REPLACE sûr. Complexité : O(n).

```ts
deleteWithTombstone(id: string, tombstoneId: string, now: number): Promise<void>   // TRANSACTIONNELLE
```
```sql
BEGIN;
INSERT INTO sync_tombstone (id, table_name, entity_id, deleted_at, created_at, updated_at)
VALUES (?, 'session', ?, ?, ?, ?);
DELETE FROM session WHERE id = ?;
COMMIT;
```
Usage : suppression traçable pour la sync V1.1. Complexité : O(1).

### wakeWindowRepository (`features/prediction/repository/` — owner : SweetSpot, lecture seule sur `session`)

```ts
findCompletedSleepSince(babyId: string, sinceMs: number): Promise<Session[]>
```
```sql
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at
FROM session
WHERE baby_id = ? AND event_type = 'sleep' AND ended_at IS NOT NULL AND started_at >= ?
ORDER BY started_at ASC;
```
Index : `idx_session_baby_id_started_at`. Retour : sessions sleep des 3 derniers jours (n ≤ ~36) ; `predictionService` (JS pur, spec annexe §4 : EMA, baseline âge, poids `w`) calcule les fenêtres d'éveil et `WW_pred` en < 1 ms. Complexité : O(n).

```ts
getLastWakeEnd(babyId: string): Promise<number | null>
```
```sql
SELECT ended_at FROM session
WHERE baby_id = ? AND event_type = 'sleep' AND ended_at IS NOT NULL
ORDER BY started_at DESC
LIMIT 1;
```
Index : `idx_session_baby_id_started_at`. Retour : epoch ms de fin du dernier réveil consigné (ancre de `Prochaine sieste = heure de fin du dernier réveil + WW_pred`). Complexité : O(1) amorti.

### reportRepository (`features/pdf-export/repository/` — owner : PDF pédiatre)

Composition pure, **zéro SQL supplémentaire** : `getReportData(babyId, fromMs, toMs)` appelle `sessionRepository.findSessionsByDateRange` (détail horodaté) + `wakeWindowRepository.aggregateDaily` ci-dessous, puis passe le tout à `pdfService` (HTML → `expo-print` → Share Sheet).

```ts
aggregateDaily(babyId: string, fromMs: number, toMsExclusive: number): Promise<DailyAggregate[]>
```
```sql
SELECT
  date(started_at / 1000, 'unixepoch', 'localtime') AS day,
  event_type,
  COUNT(*) AS event_count,
  COALESCE(SUM(CASE WHEN ended_at IS NOT NULL THEN ended_at - started_at END), 0) AS total_duration_ms
FROM session
WHERE baby_id = ? AND started_at >= ? AND started_at < ?
GROUP BY day, event_type
ORDER BY day ASC;
```
Index : `idx_session_baby_id_started_at` pour le WHERE ; GROUP BY sur ≤ 105 lignes (7 jours). Retour : `{ day: string; event_type: EventType; event_count: number; total_duration_ms: number }[]`. Complexité : O(lignes dans la plage). Sert aussi à l'écran Stats diurnes.

### syncDeviceRepository (`features/` sync V1.1 — owner : QR Delta)

```ts
create(d: { id: string; device_name: string; now: number }): Promise<SyncDevice>
```
```sql
INSERT INTO sync_device (id, device_name, last_cursor_at, created_at, updated_at) VALUES (?, ?, 0, ?, ?);
```
O(1).

```ts
getById(id: string): Promise<SyncDevice | null>
```
```sql
SELECT id, device_name, last_cursor_at, created_at, updated_at FROM sync_device WHERE id = ?;
```
O(1).

```ts
getAll(): Promise<SyncDevice[]>
```
```sql
SELECT id, device_name, last_cursor_at, created_at, updated_at FROM sync_device ORDER BY created_at ASC;
```
O(n), n ≤ quelques appareils.

```ts
updateCursor(id: string, cursorMs: number): Promise<void>
```
```sql
UPDATE sync_device SET last_cursor_at = ? WHERE id = ?;
```
O(1). `updated_at` via trigger.

```ts
delete(id: string): Promise<void>
```
```sql
DELETE FROM sync_device WHERE id = ?;
```
O(1).

### syncTombstoneRepository (V1.1)

```ts
create(t: { id: string; table_name: 'baby_profile' | 'session'; entity_id: string; deleted_at: number; now: number }): Promise<void>
```
```sql
INSERT INTO sync_tombstone (id, table_name, entity_id, deleted_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);
```
O(1).

```ts
findSince(cursorMs: number): Promise<SyncTombstone[]>
```
```sql
SELECT id, table_name, entity_id, deleted_at, created_at, updated_at
FROM sync_tombstone
WHERE deleted_at > ?
ORDER BY deleted_at ASC, id ASC;
```
Index : `idx_sync_tombstone_deleted_at`. O(delta).

```ts
pruneBefore(cutoffMs: number): Promise<void>
```
```sql
DELETE FROM sync_tombstone WHERE deleted_at < ?;
```
Rétention : 90 jours glissants. O(tombstones expirées).

### eventRepository (`core/analytics/` — owner : instrumentation GPT 3)

```ts
insert(e: { id: string; name: EventName; properties: string; created_at: number }): Promise<void>
```
```sql
INSERT INTO event (id, name, properties, created_at) VALUES (?, ?, ?, ?);
```
O(1). Appelée par `track()` — try/catch interne, jamais de throw.

```ts
findBetween(fromMs: number, toMsExclusive: number): Promise<AnalyticsEvent[]>
```
```sql
SELECT id, name, properties, created_at FROM event
WHERE created_at >= ? AND created_at < ?
ORDER BY created_at ASC;
```
Index : `idx_event_created_at`. Usage : export manuel Share Sheet ("Exporter mes données d'usage"). O(lignes).

```ts
pruneBefore(cutoffMs: number): Promise<void>
```
```sql
DELETE FROM event WHERE created_at < ?;
```
Hygiène locale, sur action utilisateur uniquement.

### errorLogRepository (`core/`)

```ts
insert(e: { id: string; message: string; stack: string | null; context: string | null; created_at: number }): Promise<void>
```
```sql
INSERT INTO error_log (id, message, stack, context, created_at) VALUES (?, ?, ?, ?, ?);
```
O(1). Jamais de PII ni de clés dans `context`.

```ts
findRecent(limit: number): Promise<ErrorEntry[]>
```
```sql
SELECT id, message, stack, context, created_at FROM error_log ORDER BY created_at DESC LIMIT ?;
```
Index : `idx_error_log_created_at`. O(limit).

### backupRepository (`features/backup/repository/` — owner : Feature 5)

```ts
dumpAll(): Promise<BackupTables>
```
```sql
SELECT id, name, birth_date, created_at, updated_at FROM baby_profile ORDER BY created_at ASC;
SELECT id, baby_id, event_type, started_at, ended_at, notes, created_at, updated_at FROM session ORDER BY started_at ASC;
SELECT id, device_name, last_cursor_at, created_at, updated_at FROM sync_device ORDER BY created_at ASC;
SELECT id, table_name, entity_id, deleted_at, created_at, updated_at FROM sync_tombstone ORDER BY deleted_at ASC;
```
Retour : objet `tables` du format de backup (Phase 7). Complexité : O(total lignes) — action utilisateur non chaude.

```ts
restoreAll(tables: BackupTables): Promise<void>   // TRANSACTIONNELLE
```
Séquence exacte dans UNE transaction unique :
```sql
BEGIN;
DELETE FROM session;
DELETE FROM sync_tombstone;
DELETE FROM sync_device;
DELETE FROM baby_profile;
-- puis INSERT des lignes dans l'ordre parents → enfants :
-- 1) baby_profile  2) session  3) sync_device  4) sync_tombstone
COMMIT;  -- ROLLBACK intégral si une écriture ou la validation Zod échoue
```
Complexité : O(total lignes).

**Méthodes transactionnelles (récapitulatif)** : `sessionRepository.upsertMany`, `sessionRepository.deleteWithTombstone`, `backupRepository.restoreAll`, et en V1.1 `syncRepository.applyDelta` (upsertMany + tombstones + updateCursor dans une seule transaction). Jamais composées côté hook.

## REQUÊTES CHAUDES ET PERFORMANCE

| Écran / action | Méthode repository | Index utilisé | Budget < 16 ms |
|---|---|---|---|
| Track — sauvegarde 1-tap | `sessionRepository.create` | Aucun (INSERT O(1)) | ✅ < 1 ms |
| Track — "dernière tétée" | `sessionRepository.getLastCompletedByType` | `idx_session_baby_id_started_at` | ✅ |
| Timeline 7 jours | `sessionRepository.findSessionsByDateRange` | `idx_session_baby_id_started_at` | ✅ (~105 lignes) |
| Stats diurnes | `wakeWindowRepository.aggregateDaily` | `idx_session_baby_id_started_at` (WHERE) | ✅ (GROUP BY ≤ 105 lignes) |
| SweetSpot (calcul) | `wakeWindowRepository.findCompletedSleepSince` + `getLastWakeEnd` | `idx_session_baby_id_started_at` | ✅ (≤ 36 lignes + JS < 1 ms) |
| Export PDF (données) | `reportRepository.getReportData` (compose les 2 précédentes) | idem | ✅ |
| Historique illimité premium | `sessionRepository.findByKeysetBefore` | `idx_session_baby_id_started_at` | ✅ O(limit = 100) |
| Delta sortant V1.1 | `sessionRepository.findUpdatedSince` | `idx_session_updated_at` | ✅ |
| Export données d'usage | `eventRepository.findBetween` | `idx_event_created_at` | ✅ |
| Export backup | `backupRepository.dumpAll` | SCAN complet assumé | ⚠️ Non chaude : action utilisateur manuelle, volumes ≤ quelques Mo (budget chiffrement < 2 s, GPT 4) |

**Procédure de vérification (recette)** :
1. Pour chaque requête chaude : `EXPLAIN QUERY PLAN <requête>` avec paramètres représentatifs.
2. **Critère d'acceptation 1** : la sortie doit afficher `SEARCH ... USING INDEX idx_...` ou `USING INTEGER PRIMARY KEY` — **aucun `SCAN` non indexé sur une table métier de plus de 500 lignes**.
3. **Critère d'acceptation 2** : test Vitest de timing sur 500 sessions simulées (base in-memory better-sqlite3 via `DbAdapter`) : chaque requête chaude < 16 ms ; `boot` < 2 s vérifié séparément (GPT 4).
4. Si échec : index supplémentaire ou dénormalisation justifiée — **jamais de cache applicatif au MVP**.

## FORMAT DE BACKUP

**Structure JSON versionnée** (fichier `babylog_YYYYMMDD_HHmmss.babylog`, JSON chiffré AES-256 Base64 après sérialisation — chiffrement `crypto-js`, clé dérivée PBKDF2 100 000 itérations du code backup utilisateur, sel 16 bytes `expo-crypto`, conformément à GPT 4) :

```json
{
  "format": "babylog-backup",
  "version": 1,
  "exported_at": 1789084800000,
  "app_version": "1.0.0",
  "tables": {
    "baby_profile":   [{ "id": "uuid", "name": "<ciphertext>", "birth_date": 1789000000000, "created_at": 1789000000000, "updated_at": 1789000000000 }],
    "session":        [{ "id": "uuid", "baby_id": "uuid", "event_type": "feed", "started_at": 1789000000000, "ended_at": 1789001800000, "notes": "<ciphertext>|null", "side": null, "amount_ml": null, "diaper_type": null, "created_at": 1789000000000, "updated_at": 1789000000000 }],
    "sync_device":    [],
    "sync_tombstone": []
  },
  "settings": {
    "settings:language": "en",
    "settings:theme": "dark",
    "settings:haptics": true,
    "settings:backup_reminder": true
  }
}
```

**Schémas Zod** (miroirs des types TS, dans `features/backup/models/backupSchema.ts`) :

```ts
const EventTypeSchema = z.enum(['feed', 'sleep', 'diaper']);

const BabyProfileRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(2048),            // ciphertext
  birth_date: z.number().int().positive(),
  created_at: z.number().int().positive(),
  updated_at: z.number().int().positive(),
}).strict();

const SessionRowSchema = z.object({
  id: z.string().uuid(),
  baby_id: z.string().uuid(),
  event_type: EventTypeSchema,
  started_at: z.number().int().positive(),
  ended_at: z.number().int().positive().nullable(),
  notes: z.string().max(4096).nullable(),       // ciphertext
  side: z.enum(['left', 'right']).nullable(),                // détail optionnel (allaitement)
  amount_ml: z.number().int().positive().nullable(),         // détail optionnel (biberon)
  diaper_type: z.enum(['wet', 'dirty', 'mixed']).nullable(), // détail optionnel (couche)
  created_at: z.number().int().positive(),
  updated_at: z.number().int().positive(),
}).strict().refine(s => s.ended_at === null || s.ended_at >= s.started_at,
  { message: 'ended_at antérieur à started_at' });

const SyncDeviceRowSchema = z.object({
  id: z.string().uuid(),
  device_name: z.string().min(1).max(120),
  last_cursor_at: z.number().int().nonnegative(),
  created_at: z.number().int().positive(),
  updated_at: z.number().int().positive(),
}).strict();

const SyncTombstoneRowSchema = z.object({
  id: z.string().uuid(),
  table_name: z.enum(['baby_profile', 'session']),
  entity_id: z.string().uuid(),
  deleted_at: z.number().int().positive(),
  created_at: z.number().int().positive(),
  updated_at: z.number().int().positive(),
}).strict();

const BackupSettingsSchema = z.object({
  'settings:language': z.string().max(8).optional(),
  'settings:theme': z.enum(['dark', 'light']).optional(),
  'settings:haptics': z.boolean().optional(),
  'settings:backup_reminder': z.boolean().optional(),
}).strict();

export const BackupSchemaV1 = z.object({
  format: z.literal('babylog-backup'),
  version: z.literal(1),
  exported_at: z.number().int().positive(),
  app_version: z.string().min(1),
  tables: z.object({
    baby_profile: z.array(BabyProfileRowSchema),
    session: z.array(SessionRowSchema), // v1 inclut les colonnes détail nullables (side, amount_ml, diaper_type)
    sync_device: z.array(SyncDeviceRowSchema),
    sync_tombstone: z.array(SyncTombstoneRowSchema),
  }).strict(),
  settings: BackupSettingsSchema,
}).strict();
```

Vérification d'intégrité référentielle (service, avant écriture) : tout `session.baby_id` doit exister dans `tables.baby_profile` ; tout `sync_tombstone.entity_id` de type `session`/`baby_profile` est accepté même orphelin (un tombstone peut survivre à sa cible).

**Ordre d'import et rollback** :
1. Lecture fichier → déchiffrement AES-256 (code saisi). Code erroné : message générique « Code incorrect ou fichier invalide » (zéro fuite d'information).
2. Validation `BackupSchemaV1` **stricte et complète AVANT toute écriture**, plus intégrité référentielle.
3. Confirmation explicite utilisateur (écrasement).
4. `backupRepository.restoreAll` : suppression enfants → parents puis insertion **parents → enfants** (`baby_profile` → `session` → `sync_device` → `sync_tombstone`) dans une transaction unique. Échec de validation ou d'écriture → **ROLLBACK complet**, base intacte.
5. Écriture des clés `settings` exportées en MMKV, puis rechargement des stores.

**Clés MMKV — règle privacy :**

| Clés exportées dans le backup | Clés exclues (jamais dans le fichier) |
|---|---|
| `settings:language`, `settings:theme`, `settings:haptics`, `settings:backup_reminder` | `billing:*` (entitlements premium, cohorte A/B) · `secrets:*` (futures clés BYOK) · `quota:*` (compteurs free tier) · `ads:*` (consentement UMP, impressions) · `timer:*` (état transitoire) · `onboarding:*` (le disclaimer non médical doit être ré-accepté sur un nouvel appareil) |

## VÉRIFICATION DES CONVENTIONS

| # | Convention | Statut | Preuve |
|---|---|---|---|
| 1 | Tables snake_case singulier | ✅ OUI | `baby_profile`, `session`, `sync_device`, `sync_tombstone`, `event`, `error_log` — aucun pluriel (`event`, et non `events`, conformément à la règle non négociable GPT 4) |
| 2 | Colonnes snake_case | ✅ OUI | `baby_id`, `event_type`, `started_at`, `ended_at`, `last_cursor_at`, `table_name`, `entity_id`, `deleted_at`… |
| 3 | IDs TEXT uuid | ✅ OUI | Toutes les PK sont `TEXT`, uuid v4 générés par `expo-crypto randomUUID()` avant INSERT ; zéro auto-increment |
| 4 | Dates INTEGER epoch ms | ✅ OUI | `started_at`, `ended_at`, `birth_date`, `deleted_at`, `*_at` tous `INTEGER` epoch ms UTC ; zéro TEXT/REAL |
| 5 | Booléens INTEGER CHECK (0,1) | ✅ OUI | N/A au schéma courant (aucune colonne booléenne nécessaire) ; la règle CHECK `(x IN (0,1))` est imposée à toute colonne future (ex. m002/m003) |
| 6 | `created_at` / `updated_at` sur toute table métier | ✅ OUI | 4/4 tables métier ; `event` et `error_log` sont append-only (`created_at` seul, spec GPT 4) |
| 7 | Triggers `updated_at` | ✅ OUI | `trg_baby_profile_updated`, `trg_session_updated`, `trg_sync_device_updated`, `trg_sync_tombstone_updated` (epoch ms via `julianday`) |
| 8 | Index sur jointures et colonnes chaudes | ✅ OUI | 8 index : FK/timeline (composite), `started_at`, `event_type`, `updated_at` (delta), `deleted_at`, `event.name`, `event.created_at`, `error_log.created_at` |
| 9 | SQL uniquement dans les repositories | ✅ OUI | Toutes les requêtes sont spécifiées dans ce document par repository ; hooks = ViewModels, services = JS pur (règle GPT 4 rappelée) |
| 10 | Schémas Zod miroirs | ✅ OUI | Schémas par ligne + `BackupSchemaV1` strict ; types TS inférés (`z.infer`) |
| 11 | Settings et secrets hors SQLite | ✅ OUI | Thème, langue, haptics, rappel, quotas, entitlements, consentement ads, clés BYOK : 100 % MMKV ; seules données sensibles en base = `name`/`notes` chiffrés AES-256 (spec GPT 4/annexe §5) |

## COMPLEXITÉ ET SIMPLIFICATIONS

**Comptage :**
- Tables métier : 4 (`baby_profile`, `session`, `sync_device`, `sync_tombstone`) + 2 système + 1 versionning = 7 tables au total
- Relations N-N : 0
- Dénormalisations : 0
- Triggers : 4
- Migrations V1.1 anticipées dans m001 : 2 tables (0 migration supplémentaire nécessaire avant V2.0)

**Barème** : base 3 + (tables au-delà de 8 : 0) + (N-N : 0 × 0,5) + (dénormalisations : 0 × 0,5) = **3/10**.

**Score final : 3/10** — très largement sous le seuil de 7. **Aucune simplification nécessaire.** Décisions qui maintiennent le score bas : pas de table `wake_window` (dérivée), pas de table `report`, pas de FTS5 (incompatible chiffrement + pas de feature recherche), pas de soft delete, pas de colonne calculée stockée, anticipation V1.1 dès m001 (évite une migration à risque avant le lancement).

## PASSATION AU GPT 6 (CONTRATS DE DONNÉES POUR L'UI)

### Entités visibles par écran

| Écran (route) | Entités | Champs affichés |
|---|---|---|
| Onboarding (`(setup)/onboarding`) | `baby_profile` | `name` (saisie clair → chiffrement avant écriture), `birth_date` (date picker), disclaimer non médical obligatoire |
| Track (`(tabs)/track`) | `session` + MMKV `timer:` | Boutons géants Feed / Sleep / Diaper ; timer en cours (`started_at` + écoulé calculé) ; `getLastCompletedByType` → "Dernière tétée il y a X" ; note optionnelle |
| Timeline (`(tabs)/index`) | `session` (7 jours) | Groupes par jour, ordre `started_at DESC` ; icône par `event_type` ; plage horaire `started_at` → `ended_at` ; durée |
| Stats (`(tabs)/stats`) | agrégats `aggregateDaily` | Totaux par type par jour (nb tétées, nb couches, heures de sommeil) ; **zone ads native autorisée ici uniquement** |
| SweetSpot (widget Stats) | prédiction `predictionService` | `WW_pred` + prochaine sieste estimée ; état gated premium (teaser) |
| Export PDF (`pdf-export`) | rapport 7 jours | Aperçu du rapport ; bouton "Générer le PDF" ; disclaimer dans le PDF |
| Settings (`(tabs)/settings`) | MMKV settings + `baby_profile` | Langue, haptics, rappel backup, "Exporter un backup", "Importer un backup", restore purchases, export données d'usage |
| Backup export/import (`backup/*`) | `BackupSchemaV1` | Saisie du code backup (PIN 6 chiffres ou mot de passe), Share Sheet à l'export, confirmation d'écrasement à l'import |
| Paywall (`paywall`) | **Aucune table** (MMKV `billing:` + produits store) | Comparatif Free/Premium, CTA Lifetime, restore purchases |

### États obligatoires par écran

| Écran | Loading | Empty (message proposé) | Error | Success |
|---|---|---|---|---|
| Timeline | Squelette léger (< 100 ms attendu, pas de spinner bloquant) | « Aucun événement cette semaine. Appuyez sur Feed, Sleep ou Diaper pour commencer le journal de bébé. » | « Impossible de lire le journal. » + lien export backup si erreur DB | Liste rendue |
| Track | N/A (instantané, MMKV) | N/A | Toast « L'enregistrement a échoué, réessayez » (erreur loggée `error_log`) | Feedback haptique + timeline mise à jour |
| Stats | Squelette | « Pas encore assez de données. Revenez après quelques jours de suivi. » | Toast générique | Cartes agrégées |
| SweetSpot | N/A (calcul < 1 ms) | « Collecte en cours… Données insuffisantes » (w = 0, spec annexe §4) | N/A | Prédiction affichée ou teaser premium (free, après 3 jours) |
| Export PDF | État "Génération…" (Base64 assets) | Bouton désactivé + tooltip « Aucune donnée sur les 7 derniers jours » | Toast « La génération du PDF a échoué » | Share Sheet natif |
| Backup import | Progression déchiffrement/validation | N/A | « Code incorrect ou fichier invalide » (message générique unique) | « Données restaurées avec succès » |

### Listes : tri, filtres, pagination

- **Timeline 7 jours** : tri `started_at DESC, id DESC` ; filtre fixe = 7 derniers jours + `baby_id` ; **pagination keyset : NON** (~105 lignes max).
- **Historique illimité (premium, post-lancement)** : même tri ; **pagination keyset OUI** via `findByKeysetBefore(started_at, id, limit = 100)` ; jamais d'OFFSET.
- **Export données d'usage** : tri `created_at ASC`, pas de filtre.
- Filtres par `event_type` (chips Feed/Sleep/Diaper) disponibles sur Timeline et Stats — servis par les mêmes requêtes (le filtre type est appliqué côté agrégat ; la colonne est indexée pour tout usage direct futur).

### Champs éditables et contraintes (formulaires → validation Zod côté UI)

| Champ | Écran | Contraintes |
|---|---|---|
| `baby_profile.name` | Onboarding / Settings | Requis, 1–30 caractères après trim ; **chiffré AES-256 avant écriture** ; Zod UI : `z.string().trim().min(1).max(30)` |
| `baby_profile.birth_date` | Onboarding | Date entre aujourd'hui − 24 mois et aujourd'hui (baselines SweetSpot 0–12 mois, cycle de vie 18–24 mois) ; Zod : `z.coerce.date()` + min/max |
| `session.notes` | Track (optionnel, après arrêt timer) | 0–500 caractères ; chiffré avant écriture ; Zod : `z.string().max(500).optional()` |
| Code backup (PIN ou mot de passe) | Backup export/import | PIN : exactement 6 chiffres **ou** mot de passe 8–128 caractères ; **jamais stocké** (dérivation PBKDF2 éphémère) ; Zod : union des deux formats |
| `sync_device.device_name` (V1.1) | Écran sync | 1–40 caractères ; Zod : `z.string().trim().min(1).max(40)` |
| Type d'événement | Track | Énumération stricte `feed | sleep | diaper` (pas de saisie libre) |

**Rappels UI critiques pour le GPT 6** : aucun blanc pur `#FFFFFF` en mode nuit (texte max `#E0E0E0`, fond `#000000`) ; le disclaimer non médical apparaît à l'onboarding, dans le PDF et dans les stores (annexe §6) ; le backup et l'export de données ne présentent **jamais** de paywall (règle éthique GPT 2/GPT 3) ; le paywall ne s'affiche jamais pendant un timer actif, une saisie ou un export.

---

## ADDENDUM v2 (micro-correctifs non bloquants)
1. error_log : ajouter pruneBefore(cutoffMs) ou cap dur (200 dernières lignes)
dans errorLogRepository, appliqué à l'hygiène locale sur action utilisateur.
2. V1.1 : compléter babyProfileRepository.deleteWithTombstone
(même pattern transactionnel que sessionRepository).
3. Écran Track : état de chargement instantané ou squelette < 100 ms obligatoire
(le GPT 6 ne doit pas interpréter "N/A" comme absence d'état).
4. aggregateDaily : décision documentée = jour civil local ('localtime'),
intention produit (rapport pédiatre) ; décalage timezone en voyage accepté au MVP.

---

**RAPPEL FINAL** — Ce document `05-data-model.md` est complet et conforme aux 11 conventions non négociables du GPT 4 (vérifiées une par une en Phase 8), avec DDL exécutable, m001 MVP + V1.1, repositories au SQL exact, format de backup versionné Zod et score de complexité agent IA de 3/10.

👉 **Transmettez ce document au GPT 6 (UI/UX Designer)**, en particulier la section **PASSATION AU GPT 6** qui fixe les contrats de données par écran (entités affichées, états loading/empty/error/success, tri et pagination des listes, champs éditables et contraintes Zod pour les formulaires). Documents à joindre au GPT 6 : `01-market-research.md`, `02-product-strategy.md` (v2), `02-annexe-technique.md` (v2), `03-monetization-strategy.md` (+ addendum), `04-tech-stack.md` (+ addendum) et `05-data-model.md` (ce document).