Fichier final : 05-data-model.md

# MODÈLE DE DONNÉES — BabyLog Offline — 2026-06-22

## 1. Résumé exécutif

- Nombre de tables métier : 4
- Nombre de tables de jointure : 0
- Nombre de tables système : 3
- Nombre d’index : 10
- Nombre de triggers : 6
- Nombre de requêtes chaudes : 6
- Score de complexité agent IA : 3,5 sur 10
- Décision principale de simplification : une seule table log_event typée avec colonnes métier contrôlées par CHECK et Zod, plutôt que des tables de détails séparées, afin de réduire les jointures, les triggers et la complexité pour un agent IA
- Prochaine étape : transmettre au GPT 6

## 2. Inputs reçus

- 02-feature-ideas-final.md : MVP 5 features core, releases locales, pas de publicité, pas de cloud obligatoire, pas de diagnostic médical.
- 03-monetization-strategy-final.md : trial local 72 heures, free minimal après trial, premium annuel et lifetime, entitlements locaux, aucun backend.
- 04-tech-stack-final.md : Expo, expo-sqlite, MMKV, SecureStore, Zod, repositories typés, migrations, WAL, foreign keys, analytics local.
- 05-data-model.md : modèle initial à corriger.
- Périmètre fonctionnel : tracking 1-tap, timer, timeline, undo, profil bébé, export PDF, emergency mode, backup restore manuel, paywall, analytics local.
- Contraintes dominantes : Local-First, privacy, simplicité agent IA, performance des requêtes chaudes, absence de secrets dans SQLite.

## 3. Hypothèses et questions bloquantes

Hypothèses retenues

- Le périmètre Release 1 est traité comme priorité technique car il conditionne export, backup et monétisation premium.
- La recherche texte full-text n’est pas une feature MVP ou Release 1. Aucune table FTS5 n’est créée.
- Les photos, médias, capteurs, micro, caméra, ML embarqué et diagnostic médical sont exclus du modèle.
- Le timer MVP est un timer simple avec reprise locale basé sur started_at. La pause fine n’est pas modélisée.
- L’historique complet, les statistiques longues, les exports, le backup et le co-parenting sont contrôlés par entitlements dans la couche UI et services.
- SQLite ne stocke aucun entitlement sensible.
- Les entitlements premium, lifetime, subscription et restore sont stockés dans MMKV chiffrée ou SecureStore, jamais dans SQLite.
- Le trial local est stocké dans MMKV standard et dans SecureStore pour le flag best-effort. SQLite ne contient pas l’état de trial.
- La table analytics est nommée event, conformément à 04-tech-stack-final.md.
- Le modèle supporte plusieurs profils bébé, mais la règle free limitée à un profil actif est appliquée par la couche entitlement et UI, pas par contrainte SQLite.
- Les colonnes feeding_method, side, amount_ml et diaper_type sont incluses dès m001 pour anticiper Release 2 et statistiques sans migration destructive.
- m001 n’est pas encore publiée. Elle peut donc être corrigée directement.

Questions restées ouvertes

- Aucune question bloquante.

Points à confirmer avant implémentation

- Le nom exact des produits IAP sera fourni hors modèle de données. Il ne doit jamais être stocké en dur dans SQLite.
- La durée de conservation des événements soft deleted avant purge définitive est fixée à 30 jours par défaut, sauf demande produit différente.
- Le libellé exact des propriétés analytics peut être ajusté par le GPT 6, mais les noms d’événements doivent rester stables.

Cas limites traités

- Cas : log_event peut dépasser 10 000 lignes après plusieurs mois.
  Décision : conserver les agrégats directement sur log_event avec index au MVP. Table daily_aggregate uniquement en migration future si benchmark réel dépasse le budget.
- Cas : suppression d’un profil bébé.
  Décision : hard delete avec cascade après confirmation explicite.
- Cas : undo sur suppression d’événement.
  Décision : soft delete avec deleted_at uniquement sur log_event.
- Cas : backup volumineux.
  Décision : export paginé côté service via repository.
- Cas : quota IA futur.
  Décision : MMKV tant que le quota est journalier et non auditable.

## 4. Entités et justifications

baby_profile

- Nom : baby_profile
- Feature d’origine : F05 profil bébé minimal, F18 multi-baby anticipé
- Description : profil d’un bébé, racine des événements de tracking, exports et timers.
- Décision : conservée
- Justification : entité racine métier. Sans profil, pas de tracking multi-enfants, pas de timeline, pas de règle free limitée à un profil actif.

log_event

- Nom : log_event
- Feature d’origine : F01 tracking 1-tap, F03 timeline, F04 édition suppression undo, F06 prédiction locale, F15 statistiques
- Description : événement de tracking core de type feeding, sleep, diaper ou note.
- Décision : conservée avec colonnes typées par type d’événement
- Justification : une seule table événementielle permet timeline, statistiques, exports, prédictions et undo avec un nombre minimal de jointures. Les colonnes optionnelles sont strictement contrôlées par CHECK et Zod.

timer_state

- Nom : timer_state
- Feature d’origine : F01 tracking avec timer et reprise locale
- Description : état du timer actif pour un profil.
- Décision : conservée
- Justification : le timer doit survivre à la fermeture de l’app. Un timestamp de démarrage suffit.

file_export

- Nom : file_export
- Feature d’origine : F07 export PDF, F08 Emergency Doctor Mode, F09 backup restore, F10 co-parent transfer anticipé
- Description : journal local des exports, sauvegardes et transferts générés par l’utilisateur.
- Décision : conservée
- Justification : trace locale des actions premium et support, sans stocker de fichier ni de secret.

event

- Nom : event
- Feature d’origine : instrumentation locale, trial, paywall, conversion, exports, erreurs fonctionnelles
- Description : événement analytics local, sans envoi automatique et sans donnée personnelle directe.
- Décision : conservée
- Justification : exigé par 03 et 04 pour les KPIs locaux, le trial et le paywall.

error_log

- Nom : error_log
- Feature d’origine : qualité technique, diagnostic local
- Description : journal local des erreurs techniques.
- Décision : conservée
- Justification : exigé par 04-tech-stack-final.md. Permet diagnostic offline sans crash reporting obligatoire.

schema_version

- Nom : schema_version
- Feature d’origine : infrastructure de migration
- Description : version du schéma SQLite appliqué.
- Décision : conservée
- Justification : obligatoire pour migrations versionnées et idempotentes.

## 5. Relations

baby_profile vers log_event

- Entités concernées : baby_profile, log_event
- Cardinalité : 1-N
- Table porteuse ou jointure : log_event porte baby_profile_id
- ON DELETE : CASCADE
- Justification : si un profil bébé est supprimé, toutes ses données de tracking doivent être supprimées.

baby_profile vers timer_state

- Entités concernées : baby_profile, timer_state
- Cardinalité : 1-1 active, car un seul timer actif par profil
- Table porteuse ou jointure : timer_state porte baby_profile_id avec contrainte UNIQUE
- ON DELETE : CASCADE
- Justification : si le profil est supprimé, son timer actif n’a plus de raison d’exister.

baby_profile vers file_export

- Entités concernées : baby_profile, file_export
- Cardinalité : 1-N lorsque l’export est lié à un profil
- Table porteuse ou jointure : file_export porte baby_profile_id nullable
- ON DELETE : CASCADE
- Justification : les métadonnées d’export liées à un profil supprimé doivent disparaître avec le profil. NULL est autorisé pour un backup global non lié à un profil précis.

Relations N-N

- Aucune relation N-N n’est nécessaire au périmètre MVP et Release 1.
- Aucune table de jointure n’est créée.

## 6. DDL complet

    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    PRAGMA recursive_triggers = OFF;

    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS baby_profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
      birth_date INTEGER NOT NULL CHECK (birth_date >= 0),
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0)
    );

    CREATE TABLE IF NOT EXISTS log_event (
      id TEXT PRIMARY KEY,
      baby_profile_id TEXT NOT NULL REFERENCES baby_profile(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('feeding', 'sleep', 'diaper', 'note')),
      started_at INTEGER NOT NULL CHECK (started_at >= 0),
      ended_at INTEGER,
      duration_ms INTEGER,
      amount_ml INTEGER,
      feeding_method TEXT,
      side TEXT,
      diaper_type TEXT,
      note_text TEXT,
      source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'timer', 'import', 'undo_restore')),
      deleted_at INTEGER,
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0),
      CHECK (ended_at IS NULL OR ended_at >= 0),
      CHECK (deleted_at IS NULL OR deleted_at >= 0),
      CHECK (duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 86400000)),
      CHECK (amount_ml IS NULL OR (amount_ml >= 0 AND amount_ml <= 5000)),
      CHECK (feeding_method IS NULL OR feeding_method IN ('breast', 'bottle', 'pump')),
      CHECK (side IS NULL OR side IN ('left', 'right', 'both')),
      CHECK (diaper_type IS NULL OR diaper_type IN ('wet', 'dirty', 'mixed', 'dry')),
      CHECK (note_text IS NULL OR length(note_text) <= 2000),
      CHECK (feeding_method IS NULL OR type = 'feeding'),
      CHECK (side IS NULL OR type = 'feeding'),
      CHECK (amount_ml IS NULL OR type = 'feeding'),
      CHECK (diaper_type IS NULL OR type = 'diaper'),
      CHECK (note_text IS NULL OR type = 'note'),
      CHECK (type IN ('feeding', 'sleep') OR ended_at IS NULL),
      CHECK (type IN ('feeding', 'sleep') OR duration_ms IS NULL),
      CHECK (type <> 'sleep' OR (ended_at IS NOT NULL AND duration_ms IS NOT NULL)),
      CHECK (type <> 'diaper' OR diaper_type IS NOT NULL),
      CHECK (type <> 'note' OR note_text IS NOT NULL),
      CHECK (ended_at IS NULL OR ended_at >= started_at)
    );

    CREATE TABLE IF NOT EXISTS timer_state (
      id TEXT PRIMARY KEY,
      baby_profile_id TEXT NOT NULL UNIQUE REFERENCES baby_profile(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL CHECK (event_type IN ('feeding', 'sleep', 'diaper')),
      started_at INTEGER NOT NULL CHECK (started_at >= 0),
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0)
    );

    CREATE TABLE IF NOT EXISTS file_export (
      id TEXT PRIMARY KEY,
      baby_profile_id TEXT REFERENCES baby_profile(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('pdf_pediatrician', 'emergency_doctor', 'backup', 'co_parent_transfer')),
      status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'failed')),
      period_start INTEGER,
      period_end INTEGER,
      file_name TEXT,
      format_version INTEGER NOT NULL DEFAULT 1 CHECK (format_version >= 1),
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0),
      CHECK (period_start IS NULL OR period_start >= 0),
      CHECK (period_end IS NULL OR period_end >= 0),
      CHECK (period_start IS NULL OR period_end IS NULL OR period_end >= period_start),
      CHECK (file_name IS NULL OR length(file_name) <= 255)
    );

    CREATE TABLE IF NOT EXISTS event (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
      properties TEXT NOT NULL DEFAULT '{}' CHECK (length(properties) <= 10000),
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0)
    );

    CREATE TABLE IF NOT EXISTS error_log (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 1000),
      code TEXT,
      stack TEXT,
      context TEXT,
      created_at INTEGER NOT NULL CHECK (created_at >= 0),
      updated_at INTEGER NOT NULL CHECK (updated_at >= 0),
      CHECK (code IS NULL OR length(code) <= 120),
      CHECK (stack IS NULL OR length(stack) <= 20000),
      CHECK (context IS NULL OR length(context) <= 10000)
    );

    CREATE INDEX IF NOT EXISTS idx_baby_profile_created_at_id
    ON baby_profile (created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_log_event_profile_created_at_id
    ON log_event (baby_profile_id, created_at DESC, id DESC)
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_log_event_timeline
    ON log_event (baby_profile_id, started_at DESC, id DESC)
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_log_event_stats
    ON log_event (baby_profile_id, type, started_at DESC)
    WHERE deleted_at IS NULL;

    CREATE INDEX IF NOT EXISTS idx_log_event_created_at_id
    ON log_event (created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_file_export_created_at_id
    ON file_export (created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_file_export_baby_profile_created_at_id
    ON file_export (baby_profile_id, created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_event_created_at_id
    ON event (created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_event_name_created_at_id
    ON event (name, created_at DESC, id DESC);

    CREATE INDEX IF NOT EXISTS idx_error_log_created_at_id
    ON error_log (created_at DESC, id DESC);

    CREATE TRIGGER IF NOT EXISTS trg_baby_profile_updated
    AFTER UPDATE ON baby_profile
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE baby_profile
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_log_event_updated
    AFTER UPDATE ON log_event
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE log_event
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_timer_state_updated
    AFTER UPDATE ON timer_state
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE timer_state
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_file_export_updated
    AFTER UPDATE ON file_export
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE file_export
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_event_updated
    AFTER UPDATE ON event
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE event
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS trg_error_log_updated
    AFTER UPDATE ON error_log
    WHEN NEW.updated_at = OLD.updated_at
    BEGIN
      UPDATE error_log
      SET updated_at = CAST(strftime('%s', 'now') AS INTEGER) * 1000
      WHERE id = NEW.id;
    END;

    INSERT OR IGNORE INTO schema_version (version, applied_at)
    VALUES (1, CAST(strftime('%s', 'now') AS INTEGER) * 1000);

Recherche texte : aucune feature de recherche texte n’est demandée dans le périmètre. Aucune table FTS5 n’est créée. Aucune requête de repli LIKE n’est nécessaire.

## 7. Migrations

Convention de migration

- Les migrations sont numérotées m001, m002, m003, etc.
- Une migration publiée n’est jamais modifiée.
- Toute modification de schéma ultérieure passe par une nouvelle migration.
- Les PRAGMA non transactionnels sont exécutés avant la transaction de migration.
- La table schema_version contient la version appliquée et la date epoch millisecondes.
- Le runner de migration vérifie la version actuelle avant d’exécuter une migration.
- Les migrations sont idempotentes grâce à IF NOT EXISTS et INSERT OR IGNORE pour m001.
- Les migrations destructives doivent être signalées explicitement et proposer un backup préalable.

m001

- Nom : m001_initial_schema
- Objectif : créer le schéma complet MVP, Release 1 et anticipations utiles Release 2.
- Contenu : exactement le DDL complet de la section 6.
- Statut : non publiée, corrigée directement.
- Exécution recommandée :
  - ouvrir la base babylog.db
  - exécuter PRAGMA journal_mode = WAL
  - exécuter PRAGMA foreign_keys = ON
  - exécuter PRAGMA busy_timeout = 5000
  - exécuter PRAGMA recursive_triggers = OFF
  - ouvrir une transaction
  - exécuter le DDL complet de la section 6
  - valider la transaction
- Caractère destructif : non
- Backup préalable : non requis pour base vide

Migrations futures probables

- m002_daily_aggregate
  Objectif : pré-agréger les statistiques journalières si les agrégats directs sur log_event dépassent le budget.
  Type : additive, non destructive, mais nécessitera backfill.

- m003_notification_schedule
  Objectif : stocker les rappels locaux optionnels et alarmes Dream Feed.
  Type : additive.

- m004_allergen_medication
  Objectif : introduire les tables pour allergènes, aliments et médicaments.
  Type : additive.

- m005_ai_quota
  Objectif : persister un quota IA local si BYOK est activé et que MMKV devient insuffisant.
  Type : additive.

- m006_media_attachment
  Objectif : permettre une photo locale optionnelle attachée à un événement, uniquement si feature explicitement validée.
  Type : additive.

Plan V2.0

- La V2 peut introduire prédictions avancées, notifications, allergènes, médicaments, IA BYOK et médias.
- Le modèle actuel évite les migrations destructives pour ces extensions.
- Aucune migration V2 ne doit modifier m001.
- Si une migration devient destructive, elle devra être précédée d’un backup local chiffré et documentée comme dangereuse.

## 8. Repositories

Règle commune

- Tout SQL est exclusivement dans les repositories.
- Les hooks, écrans et services n’écrivent jamais de SQL.
- Les écritures sont validées par Zod avant exécution.
- Les lectures critiques sont validées par Zod lors des imports ou restaurations.
- La pagination keyset utilise created_at et id.
- OFFSET est interdit.
- Une transaction est utilisée pour toute opération multi-écritures.

Schémas Zod miroirs

    import { z } from 'zod';

    const uuidSchema = z.string().uuid();
    const epochMsSchema = z.number().int().nonnegative();

    export type KeysetCursor = {
      created_at: number;
      id: string;
    } | null;

    const babyProfileRowSchema = z.object({
      id: uuidSchema,
      name: z.string().min(1).max(80),
      birth_date: epochMsSchema,
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type BabyProfileRow = z.infer<typeof babyProfileRowSchema>;

    const babyProfileInsertSchema = z.object({
      id: uuidSchema,
      name: z.string().min(1).max(80),
      birth_date: epochMsSchema,
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type BabyProfileInsert = z.infer<typeof babyProfileInsertSchema>;

    const timerStateRowSchema = z.object({
      id: uuidSchema,
      baby_profile_id: uuidSchema,
      event_type: z.enum(['feeding', 'sleep', 'diaper']),
      started_at: epochMsSchema,
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type TimerStateRow = z.infer<typeof timerStateRowSchema>;

    const timerStateInsertSchema = z.object({
      id: uuidSchema,
      baby_profile_id: uuidSchema,
      event_type: z.enum(['feeding', 'sleep', 'diaper']),
      started_at: epochMsSchema,
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type TimerStateInsert = z.infer<typeof timerStateInsertSchema>;

    const logEventTypeSchema = z.enum(['feeding', 'sleep', 'diaper', 'note']);
    const logEventSourceSchema = z.enum(['manual', 'timer', 'import', 'undo_restore']);
    const feedingMethodSchema = z.enum(['breast', 'bottle', 'pump']);
    const feedingSideSchema = z.enum(['left', 'right', 'both']);
    const diaperTypeSchema = z.enum(['wet', 'dirty', 'mixed', 'dry']);

    const logEventRowSchema = z.object({
      id: uuidSchema,
      baby_profile_id: uuidSchema,
      type: logEventTypeSchema,
      started_at: epochMsSchema,
      ended_at: epochMsSchema.nullable(),
      duration_ms: z.number().int().nonnegative().max(86400000).nullable(),
      amount_ml: z.number().int().nonnegative().max(5000).nullable(),
      feeding_method: feedingMethodSchema.nullable(),
      side: feedingSideSchema.nullable(),
      diaper_type: diaperTypeSchema.nullable(),
      note_text: z.string().max(2000).nullable(),
      source: logEventSourceSchema,
      deleted_at: epochMsSchema.nullable(),
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict().superRefine((value, ctx) => {
      if (value.type === 'sleep') {
        if (value.ended_at === null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'sleep requires ended_at' });
        }
        if (value.duration_ms === null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'sleep requires duration_ms' });
        }
      }

      if (value.type === 'diaper' && value.diaper_type === null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'diaper requires diaper_type' });
      }

      if (value.type === 'note' && value.note_text === null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'note requires note_text' });
      }

      if (value.type !== 'feeding') {
        if (value.feeding_method !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'feeding_method only allowed for feeding' });
        }
        if (value.side !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'side only allowed for feeding' });
        }
        if (value.amount_ml !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'amount_ml only allowed for feeding' });
        }
      }

      if (value.type !== 'diaper' && value.diaper_type !== null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'diaper_type only allowed for diaper' });
      }

      if (value.type !== 'note' && value.note_text !== null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'note_text only allowed for note' });
      }

      if (value.type !== 'feeding' && value.type !== 'sleep') {
        if (value.ended_at !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ended_at only allowed for feeding or sleep' });
        }
        if (value.duration_ms !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'duration_ms only allowed for feeding or sleep' });
        }
      }

      if (value.ended_at !== null && value.ended_at < value.started_at) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ended_at must be after started_at' });
      }
    });

    type LogEventRow = z.infer<typeof logEventRowSchema>;

    const logEventInsertSchema = logEventRowSchema;
    type LogEventInsert = z.infer<typeof logEventInsertSchema>;

    const logEventUpdateSchema = z.object({
      type: logEventTypeSchema,
      started_at: epochMsSchema,
      ended_at: epochMsSchema.nullable(),
      duration_ms: z.number().int().nonnegative().max(86400000).nullable(),
      amount_ml: z.number().int().nonnegative().max(5000).nullable(),
      feeding_method: feedingMethodSchema.nullable(),
      side: feedingSideSchema.nullable(),
      diaper_type: diaperTypeSchema.nullable(),
      note_text: z.string().max(2000).nullable()
    }).strict().superRefine((value, ctx) => {
      if (value.type === 'sleep') {
        if (value.ended_at === null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'sleep requires ended_at' });
        }
        if (value.duration_ms === null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'sleep requires duration_ms' });
        }
      }

      if (value.type === 'diaper' && value.diaper_type === null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'diaper requires diaper_type' });
      }

      if (value.type === 'note' && value.note_text === null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'note requires note_text' });
      }

      if (value.type !== 'feeding') {
        if (value.feeding_method !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'feeding_method only allowed for feeding' });
        }
        if (value.side !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'side only allowed for feeding' });
        }
        if (value.amount_ml !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'amount_ml only allowed for feeding' });
        }
      }

      if (value.type !== 'diaper' && value.diaper_type !== null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'diaper_type only allowed for diaper' });
      }

      if (value.type !== 'note' && value.note_text !== null) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'note_text only allowed for note' });
      }

      if (value.type !== 'feeding' && value.type !== 'sleep') {
        if (value.ended_at !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ended_at only allowed for feeding or sleep' });
        }
        if (value.duration_ms !== null) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'duration_ms only allowed for feeding or sleep' });
        }
      }

      if (value.ended_at !== null && value.ended_at < value.started_at) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ended_at must be after started_at' });
      }
    });

    type LogEventUpdate = z.infer<typeof logEventUpdateSchema>;

    const fileExportRowSchema = z.object({
      id: uuidSchema,
      baby_profile_id: uuidSchema.nullable(),
      kind: z.enum(['pdf_pediatrician', 'emergency_doctor', 'backup', 'co_parent_transfer']),
      status: z.enum(['started', 'completed', 'failed']),
      period_start: epochMsSchema.nullable(),
      period_end: epochMsSchema.nullable(),
      file_name: z.string().max(255).nullable(),
      format_version: z.number().int().min(1),
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type FileExportRow = z.infer<typeof fileExportRowSchema>;

    const fileExportInsertSchema = z.object({
      id: uuidSchema,
      baby_profile_id: uuidSchema.nullable(),
      kind: z.enum(['pdf_pediatrician', 'emergency_doctor', 'backup', 'co_parent_transfer']),
      status: z.enum(['started', 'completed', 'failed']),
      period_start: epochMsSchema.nullable(),
      period_end: epochMsSchema.nullable(),
      file_name: z.string().max(255).nullable(),
      format_version: z.number().int().min(1),
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type FileExportInsert = z.infer<typeof fileExportInsertSchema>;

    const analyticsEventNameSchema = z.enum([
      'app_installed',
      'onboarding_started',
      'onboarding_completed',
      'first_profile_created',
      'trial_offer_shown',
      'trial_started',
      'trial_completed',
      'trial_expired_paywall_shown',
      'trial_already_claimed_detected',
      'first_value_moment',
      'core_action_completed',
      'night_mode_used',
      'history_limit_reached',
      'second_profile_attempted',
      'premium_feature_attempted',
      'paywall_shown',
      'paywall_closed',
      'paywall_converted',
      'purchase_completed',
      'restore_completed',
      'subscription_started',
      'lifetime_unlocked',
      'premium_restored',
      'subscription_cancelled',
      'pdf_export_attempted',
      'backup_export_attempted',
      'backup_exported',
      'backup_imported',
      'co_parent_transfer_attempted',
      'prediction_viewed',
      'error_logged'
    ]);

    const analyticsPropertiesSchema = z.object({
      screen: z.string().max(80).optional(),
      feature: z.string().max(80).optional(),
      trigger: z.string().max(80).optional(),
      period_days: z.number().int().nonnegative().optional(),
      count: z.number().int().nonnegative().optional(),
      source: z.enum(['manual', 'timer', 'import', 'restore']).optional(),
      error_code: z.string().max(80).optional()
    }).strict();

    const eventInsertSchema = z.object({
      id: uuidSchema,
      name: analyticsEventNameSchema,
      properties: analyticsPropertiesSchema,
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict().superRefine((value, ctx) => {
      const json = JSON.stringify(value.properties);
      if (json.length > 10000) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'properties JSON exceeds 10000 characters' });
      }
    });

    type EventInsert = z.infer<typeof eventInsertSchema>;

    const eventRowSchema = z.object({
      id: uuidSchema,
      name: analyticsEventNameSchema,
      properties: z.string().max(10000),
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type EventRow = z.infer<typeof eventRowSchema>;

    const errorLogInsertSchema = z.object({
      id: uuidSchema,
      message: z.string().min(1).max(1000),
      code: z.string().max(120).nullable(),
      stack: z.string().max(20000).nullable(),
      context: z.string().max(10000).nullable(),
      created_at: epochMsSchema,
      updated_at: epochMsSchema
    }).strict();

    type ErrorLogInsert = z.infer<typeof errorLogInsertSchema>;

    const errorLogRowSchema = errorLogInsertSchema;
    type ErrorLogRow = z.infer<typeof errorLogRowSchema>;

babyProfileRepository

- Table concernée : baby_profile

listAll

    listAll(): Promise<BabyProfileRow[]>

SQL exact :

    SELECT id, name, birth_date, created_at, updated_at
    FROM baby_profile
    ORDER BY created_at DESC, id DESC;

Retour : BabyProfileRow[]

Index utilisé : idx_baby_profile_created_at_id

Complexité : faible, table petite

Transaction : non

getById

    getById(id: string): Promise<BabyProfileRow | null>

SQL exact :

    SELECT id, name, birth_date, created_at, updated_at
    FROM baby_profile
    WHERE id = ?;

Retour : BabyProfileRow ou null

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

create

    create(input: BabyProfileInsert): Promise<BabyProfileRow>

SQL exact :

    INSERT INTO baby_profile (id, name, birth_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?);

    SELECT id, name, birth_date, created_at, updated_at
    FROM baby_profile
    WHERE id = ?;

Retour : BabyProfileRow

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : non

update

    update(id: string, input: { name: string; birth_date: number }): Promise<void>

SQL exact :

    UPDATE baby_profile
    SET name = ?, birth_date = ?
    WHERE id = ?;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

Effet : trigger met updated_at à jour

delete

    delete(id: string): Promise<void>

SQL exact :

    DELETE FROM baby_profile
    WHERE id = ?;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1), cascade enfants

Transaction : non, une seule instruction atomique

countProfiles

    countProfiles(): Promise<number>

SQL exact :

    SELECT COUNT(*) AS count
    FROM baby_profile;

Retour : number

Index utilisé : aucun nécessaire, table petite

Complexité : O(n) sur petite table

Transaction : non

Usage : gate free limité à un profil actif

getOldestProfile

    getOldestProfile(): Promise<BabyProfileRow | null>

SQL exact :

    SELECT id, name, birth_date, created_at, updated_at
    FROM baby_profile
    ORDER BY created_at ASC, id ASC
    LIMIT 1;

Retour : BabyProfileRow ou null

Index utilisé : idx_baby_profile_created_at_id

Complexité : O(1)

Transaction : non

insertRestoredRow

    insertRestoredRow(input: BabyProfileRow): Promise<void>

SQL exact :

    INSERT INTO baby_profile (id, name, birth_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?);

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : oui via transaction d’import backup

logEventRepository

- Table concernée : log_event

Convention de pagination

- cursor est null pour la première page.
- cursor est fourni pour la page suivante.

getById

    getById(id: string): Promise<LogEventRow | null>

SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE id = ? AND deleted_at IS NULL;

Retour : LogEventRow ou null

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

create

    create(input: LogEventInsert): Promise<LogEventRow>

SQL exact :

    INSERT INTO log_event (
      id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
      feeding_method, side, diaper_type, note_text, source, deleted_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE id = ?;

Retour : LogEventRow

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : non

Validation : Zod avant SQL

update

    update(id: string, input: LogEventUpdate): Promise<void>

SQL exact :

    UPDATE log_event
    SET type = ?, started_at = ?, ended_at = ?, duration_ms = ?, amount_ml = ?,
        feeding_method = ?, side = ?, diaper_type = ?, note_text = ?
    WHERE id = ? AND deleted_at IS NULL;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

Validation : logEventUpdateSchema avant SQL

softDelete

    softDelete(id: string, deletedAt: number): Promise<void>

SQL exact :

    UPDATE log_event
    SET deleted_at = ?
    WHERE id = ? AND deleted_at IS NULL;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

Usage : suppression visible dans UI, restaurable via undo

restore

    restore(id: string): Promise<void>

SQL exact :

    UPDATE log_event
    SET deleted_at = NULL, source = 'undo_restore'
    WHERE id = ? AND deleted_at IS NOT NULL;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

Usage : undo

listByProfilePage

    listByProfilePage(
      babyProfileId: string,
      cursor: KeysetCursor,
      limit: number
    ): Promise<LogEventRow[]>

SQL première page :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : babyProfileId, limit

SQL page suivante :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : babyProfileId, cursor.created_at, cursor.created_at, cursor.id, limit

Retour : LogEventRow[]

Index utilisé : idx_log_event_profile_created_at_id

Complexité : O(limit)

Transaction : non

getTimelineDay

    getTimelineDay(
      babyProfileId: string,
      dayStartMs: number,
      dayEndMs: number
    ): Promise<LogEventRow[]>

SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
      AND started_at < ?
    ORDER BY started_at DESC, id DESC
    LIMIT 200;

Retour : LogEventRow[]

Index utilisé : idx_log_event_timeline

Complexité : O(événements du jour)

Transaction : non

getRecentWindow

    getRecentWindow(
      babyProfileId: string,
      sinceMs: number,
      limit: number
    ): Promise<LogEventRow[]>

SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
    ORDER BY started_at DESC, id DESC
    LIMIT ?;

Retour : LogEventRow[]

Index utilisé : idx_log_event_timeline

Complexité : O(limit)

Transaction : non

Usage : free 24 heures, Emergency Doctor Mode 24 heures, résumé récent

getRangeForExport

    getRangeForExport(
      babyProfileId: string,
      startMs: number,
      endMs: number
    ): Promise<LogEventRow[]>

SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
      AND started_at < ?
    ORDER BY started_at ASC, id ASC;

Retour : LogEventRow[]

Index utilisé : idx_log_event_timeline

Complexité : O(événements de la période)

Transaction : non

Usage : export PDF 7 ou 14 jours, Emergency Doctor Mode 24 ou 48 heures

getStatsByRange

    getStatsByRange(
      babyProfileId: string,
      startMs: number,
      endMs: number
    ): Promise<Array<{ type: string; count_total: number; duration_total_ms: number; amount_total_ml: number }>>

SQL exact :

    SELECT type,
           COUNT(*) AS count_total,
           COALESCE(SUM(duration_ms), 0) AS duration_total_ms,
           COALESCE(SUM(amount_ml), 0) AS amount_total_ml
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
      AND started_at < ?
    GROUP BY type;

Retour : agrégats par type

Index utilisé : idx_log_event_stats

Complexité : O(événements de la période)

Transaction : non

getDiaperBreakdownByRange

    getDiaperBreakdownByRange(
      babyProfileId: string,
      startMs: number,
      endMs: number
    ): Promise<Array<{ diaper_type: string | null; count_total: number }>>

SQL exact :

    SELECT diaper_type, COUNT(*) AS count_total
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND type = 'diaper'
      AND started_at >= ?
      AND started_at < ?
    GROUP BY diaper_type;

Retour : compteurs par type de couche

Index utilisé : idx_log_event_stats

Complexité : O(couches de la période)

Transaction : non

getSleepWindowsForPrediction

    getSleepWindowsForPrediction(
      babyProfileId: string,
      sinceMs: number,
      limit: number
    ): Promise<Array<{ started_at: number; ended_at: number; duration_ms: number }>>

SQL exact :

    SELECT started_at, ended_at, duration_ms
    FROM log_event
    WHERE baby_profile_id = ?
      AND type = 'sleep'
      AND deleted_at IS NULL
      AND ended_at IS NOT NULL
      AND started_at >= ?
    ORDER BY started_at DESC
    LIMIT ?;

Retour : fenêtres de sommeil récentes

Index utilisé : idx_log_event_stats

Complexité : O(limit)

Transaction : non

completeTimerAndCreateEvent

    completeTimerAndCreateEvent(input: LogEventInsert): Promise<LogEventRow>

SQL exact dans une transaction :

    INSERT INTO log_event (
      id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
      feeding_method, side, diaper_type, note_text, source, deleted_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

    DELETE FROM timer_state
    WHERE baby_profile_id = ?;

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE id = ?;

Retour : LogEventRow

Index utilisé : PRIMARY KEY pour INSERT, index UNIQUE timer_state pour DELETE

Complexité : O(1)

Transaction : oui

Rollback : complet si une écriture échoue

purgeSoftDeletedBefore

    purgeSoftDeletedBefore(cutoffMs: number): Promise<void>

SQL exact :

    DELETE FROM log_event
    WHERE deleted_at IS NOT NULL
      AND deleted_at < ?;

Retour : void

Index utilisé : maintenance hors écran chaud

Complexité : O(n) sur lignes supprimées logiquement

Transaction : oui

Avertissement : suppression définitive, backup recommandé si déclenchée manuellement

listForBackup

    listForBackup(
      cursor: KeysetCursor,
      limit: number
    ): Promise<LogEventRow[]>

SQL première page :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : limit

SQL page suivante :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : cursor.created_at, cursor.created_at, cursor.id, limit

Retour : LogEventRow[], incluant soft deleted

Index utilisé : idx_log_event_created_at_id

Complexité : O(limit)

Transaction : non

Usage : backup export complet

insertRestoredRow

    insertRestoredRow(input: LogEventRow): Promise<void>

SQL exact :

    INSERT INTO log_event (
      id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
      feeding_method, side, diaper_type, note_text, source, deleted_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : oui via transaction d’import backup

timerRepository

- Table concernée : timer_state

getAll

    getAll(): Promise<TimerStateRow[]>

SQL exact :

    SELECT id, baby_profile_id, event_type, started_at, created_at, updated_at
    FROM timer_state
    ORDER BY created_at DESC, id DESC;

Retour : TimerStateRow[]

Index utilisé : aucun nécessaire, très petite table

Complexité : O(1)

Transaction : non

getActiveByProfile

    getActiveByProfile(babyProfileId: string): Promise<TimerStateRow | null>

SQL exact :

    SELECT id, baby_profile_id, event_type, started_at, created_at, updated_at
    FROM timer_state
    WHERE baby_profile_id = ?;

Retour : TimerStateRow ou null

Index utilisé : index UNIQUE sur baby_profile_id

Complexité : O(1)

Transaction : non

startTimer

    startTimer(input: TimerStateInsert): Promise<TimerStateRow>

SQL exact dans une transaction :

    DELETE FROM timer_state
    WHERE baby_profile_id = ?;

    INSERT INTO timer_state (id, baby_profile_id, event_type, started_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?);

    SELECT id, baby_profile_id, event_type, started_at, created_at, updated_at
    FROM timer_state
    WHERE id = ?;

Retour : TimerStateRow

Index utilisé : index UNIQUE baby_profile_id

Complexité : O(1)

Transaction : oui

Usage : remplacer proprement le timer actif d’un profil

stopTimer

    stopTimer(babyProfileId: string): Promise<void>

SQL exact :

    DELETE FROM timer_state
    WHERE baby_profile_id = ?;

Retour : void

Index utilisé : index UNIQUE baby_profile_id

Complexité : O(1)

Transaction : non

insertRestoredRow

    insertRestoredRow(input: TimerStateRow): Promise<void>

SQL exact :

    INSERT INTO timer_state (id, baby_profile_id, event_type, started_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?);

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : oui via transaction d’import backup

fileExportRepository

- Table concernée : file_export

getById

    getById(id: string): Promise<FileExportRow | null>

SQL exact :

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    WHERE id = ?;

Retour : FileExportRow ou null

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

create

    create(input: FileExportInsert): Promise<FileExportRow>

SQL exact :

    INSERT INTO file_export (
      id, baby_profile_id, kind, status, period_start, period_end,
      file_name, format_version, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    WHERE id = ?;

Retour : FileExportRow

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : non

markCompleted

    markCompleted(id: string, fileName: string): Promise<void>

SQL exact :

    UPDATE file_export
    SET status = 'completed', file_name = ?
    WHERE id = ?;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

markFailed

    markFailed(id: string): Promise<void>

SQL exact :

    UPDATE file_export
    SET status = 'failed'
    WHERE id = ?;

Retour : void

Index utilisé : PRIMARY KEY

Complexité : O(1)

Transaction : non

listRecent

    listRecent(
      cursor: KeysetCursor,
      limit: number
    ): Promise<FileExportRow[]>

SQL première page :

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : limit

SQL page suivante :

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    WHERE (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : cursor.created_at, cursor.created_at, cursor.id, limit

Retour : FileExportRow[]

Index utilisé : idx_file_export_created_at_id

Complexité : O(limit)

Transaction : non

listByProfile

    listByProfile(
      babyProfileId: string,
      cursor: KeysetCursor,
      limit: number
    ): Promise<FileExportRow[]>

SQL première page :

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    WHERE baby_profile_id = ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : babyProfileId, limit

SQL page suivante :

    SELECT id, baby_profile_id, kind, status, period_start, period_end,
           file_name, format_version, created_at, updated_at
    FROM file_export
    WHERE baby_profile_id = ?
      AND (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : babyProfileId, cursor.created_at, cursor.created_at, cursor.id, limit

Retour : FileExportRow[]

Index utilisé : idx_file_export_baby_profile_created_at_id

Complexité : O(limit)

Transaction : non

insertRestoredRow

    insertRestoredRow(input: FileExportRow): Promise<void>

SQL exact :

    INSERT INTO file_export (
      id, baby_profile_id, kind, status, period_start, period_end,
      file_name, format_version, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : oui via transaction d’import backup

eventRepository

- Table concernée : event
- Règle : événement analytics immuable. Pas de mise à jour métier.

create

    create(input: EventInsert): Promise<void>

SQL exact :

    INSERT INTO event (id, name, properties, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?);

Paramètre properties : JSON.stringify(input.properties)

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : non

Validation : eventInsertSchema avant SQL

Privacy : aucune donnée personnelle directe, aucun secret

listRecent

    listRecent(
      cursor: KeysetCursor,
      limit: number
    ): Promise<EventRow[]>

SQL première page :

    SELECT id, name, properties, created_at, updated_at
    FROM event
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : limit

SQL page suivante :

    SELECT id, name, properties, created_at, updated_at
    FROM event
    WHERE (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : cursor.created_at, cursor.created_at, cursor.id, limit

Retour : EventRow[]

Index utilisé : idx_event_created_at_id

Complexité : O(limit)

Transaction : non

listByNameSince

    listByNameSince(
      name: string,
      sinceMs: number,
      limit: number
    ): Promise<EventRow[]>

SQL exact :

    SELECT id, name, properties, created_at, updated_at
    FROM event
    WHERE name = ?
      AND created_at >= ?
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Retour : EventRow[]

Index utilisé : idx_event_name_created_at_id

Complexité : O(limit)

Transaction : non

Usage : vérification de fréquence paywall ou trial

purgeBefore

    purgeBefore(cutoffMs: number): Promise<void>

SQL exact :

    DELETE FROM event
    WHERE created_at < ?;

Retour : void

Index utilisé : idx_event_created_at_id

Complexité : O(n)

Transaction : oui si volume important

Avertissement : suppression définitive

errorLogRepository

- Table concernée : error_log

create

    create(input: ErrorLogInsert): Promise<void>

SQL exact :

    INSERT INTO error_log (id, message, code, stack, context, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);

Retour : void

Index utilisé : aucun pour INSERT

Complexité : O(1)

Transaction : non

Privacy : aucune donnée sensible dans message, stack ou context

listRecent

    listRecent(
      cursor: KeysetCursor,
      limit: number
    ): Promise<ErrorLogRow[]>

SQL première page :

    SELECT id, message, code, stack, context, created_at, updated_at
    FROM error_log
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres première page : limit

SQL page suivante :

    SELECT id, message, code, stack, context, created_at, updated_at
    FROM error_log
    WHERE (created_at < ? OR (created_at = ? AND id < ?))
    ORDER BY created_at DESC, id DESC
    LIMIT ?;

Paramètres page suivante : cursor.created_at, cursor.created_at, cursor.id, limit

Retour : ErrorLogRow[]

Index utilisé : idx_error_log_created_at_id

Complexité : O(limit)

Transaction : non

purgeBefore

    purgeBefore(cutoffMs: number): Promise<void>

SQL exact :

    DELETE FROM error_log
    WHERE created_at < ?;

Retour : void

Index utilisé : idx_error_log_created_at_id

Complexité : O(n)

Transaction : oui si volume important

Avertissement : suppression définitive

## 9. Requêtes chaudes

Requête chaude 1 : timer actif sur accueil tracking

- Écran concerné : accueil tracking
- Méthode de repository : timerRepository.getActiveByProfile
- SQL exact :

    SELECT id, baby_profile_id, event_type, started_at, created_at, updated_at
    FROM timer_state
    WHERE baby_profile_id = ?;

- Index utilisé : index UNIQUE sur timer_state.baby_profile_id
- Budget de performance : moins de 1 ms
- EXPLAIN QUERY PLAN attendu : SEARCH timer_state USING INDEX sqlite_autoindex_timer_state_1
- Critère d’acceptation : aucune lecture applicative de timestamp sans passer par le repository

Requête chaude 2 : timeline du jour

- Écran concerné : timeline du jour
- Méthode de repository : logEventRepository.getTimelineDay
- SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
      AND started_at < ?
    ORDER BY started_at DESC, id DESC
    LIMIT 200;

- Index utilisé : idx_log_event_timeline
- Budget de performance : moins de 16 ms
- EXPLAIN QUERY PLAN attendu : SEARCH log_event USING INDEX idx_log_event_timeline
- Critère d’acceptation : aucun SCAN sur log_event pour un jour donné

Requête chaude 3 : fenêtre 24 heures gratuite

- Écran concerné : timeline gratuite après trial, Emergency Doctor Mode 24 heures
- Méthode de repository : logEventRepository.getRecentWindow
- SQL exact :

    SELECT id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
           feeding_method, side, diaper_type, note_text, source, deleted_at,
           created_at, updated_at
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
    ORDER BY started_at DESC, id DESC
    LIMIT ?;

- Index utilisé : idx_log_event_timeline
- Budget de performance : moins de 16 ms
- EXPLAIN QUERY PLAN attendu : SEARCH log_event USING INDEX idx_log_event_timeline
- Critère d’acceptation : la limite free 24 heures est appliquée par paramètre since, pas par filtrage applicatif massif

Requête chaude 4 : écriture d’un événement de tracking

- Écran concerné : accueil tracking, fin de timer
- Méthode de repository : logEventRepository.create ou logEventRepository.completeTimerAndCreateEvent
- SQL exact INSERT :

    INSERT INTO log_event (
      id, baby_profile_id, type, started_at, ended_at, duration_ms, amount_ml,
      feeding_method, side, diaper_type, note_text, source, deleted_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

- Index utilisé : aucun pour l’écriture, mais les index sont maintenus
- Budget de performance : moins de 16 ms
- EXPLAIN QUERY PLAN attendu : non requis pour INSERT simple
- Critère d’acceptation : l’écriture ne bloque pas l’UI et le timer est supprimé dans la même transaction si issu du timer

Requête chaude 5 : statistiques courtes

- Écran concerné : statistiques 1j ou 7j ou 30j
- Méthode de repository : logEventRepository.getStatsByRange
- SQL exact :

    SELECT type,
           COUNT(*) AS count_total,
           COALESCE(SUM(duration_ms), 0) AS duration_total_ms,
           COALESCE(SUM(amount_ml), 0) AS amount_total_ml
    FROM log_event
    WHERE baby_profile_id = ?
      AND deleted_at IS NULL
      AND started_at >= ?
      AND started_at < ?
    GROUP BY type;

- Index utilisé : idx_log_event_stats
- Budget de performance : moins de 16 ms pour périodes courtes sur appareil moyen
- EXPLAIN QUERY PLAN attendu : SEARCH log_event USING INDEX idx_log_event_stats
- Critère d’acceptation : aucun tri applicatif des événements avant agrégat

Requête chaude 6 : comptage de profils pour gate premium

- Écran concerné : création de profil, gate second profil
- Méthode de repository : babyProfileRepository.countProfiles
- SQL exact :

    SELECT COUNT(*) AS count
    FROM baby_profile;

- Index utilisé : aucun requis, table très petite
- Budget de performance : moins de 1 ms
- EXPLAIN QUERY PLAN attendu : SCAN baby_profile acceptable car table très petite
- Critère d’acceptation : le comptage est local, synchrone et utilisable par useEntitlements sans réseau

## 10. Format de backup

Structure JSON versionnée

Le backup est un fichier JSON chiffré avant export. La structure interne est la suivante :

    {
      "format_version": 1,
      "exported_at": 1750000000000,
      "app_version": "1.0.0",
      "schema_version": 1,
      "tables": {
        "baby_profile": [],
        "log_event": [],
        "timer_state": [],
        "file_export": []
      },
      "settings": {
        "trial": {
          "trialState": "not_started",
          "trialStartedAt": null,
          "trialEndsAt": null,
          "trialClaimedLocal": false
        },
        "preferences": {
          "night_mode": "auto",
          "night_mode_start_minutes": 1200,
          "night_mode_end_minutes": 420
        }
      }
    }

Règles

- Les dates restent en INTEGER epoch millisecondes.
- Les booléens restent représentés par true ou false dans JSON, mais sont stockés 0 ou 1 en SQLite si applicable.
- Les UUID restent TEXT.
- Les champs JSON stockés dans TEXT doivent être validés avant import.
- Les clés étrangères doivent être respectées à l’import.
- Une table absente peut être omise. Si elle est absente, elle est traitée comme vide.
- Les tables event et error_log sont exclues du backup.
- La table schema_version est exclue du backup.
- Les données soft deleted de log_event sont incluses afin de préserver l’état undo.
- Le snapshot de sauvegarde doit être pris avant l’insertion de la ligne file_export de type backup, afin d’éviter l’auto-inclusion.
- Les entitlements premium ne sont jamais restaurés depuis le backup.
- Si un flag trial sécurisé OS est déjà présent sur l’appareil cible, il force trial déjà consommé, même si le backup contient un état plus permissif.

Schéma Zod global de backup

    const backupSettingsTrialSchema = z.object({
      trialState: z.enum(['not_started', 'active', 'expired', 'already_used']),
      trialStartedAt: epochMsSchema.nullable(),
      trialEndsAt: epochMsSchema.nullable(),
      trialClaimedLocal: z.boolean()
    }).strict();

    const backupSettingsPreferencesSchema = z.object({
      night_mode: z.enum(['off', 'on', 'auto']).optional(),
      night_mode_start_minutes: z.number().int().min(0).max(1439).optional(),
      night_mode_end_minutes: z.number().int().min(0).max(1439).optional()
    }).strict();

    const backupSettingsSchema = z.object({
      trial: backupSettingsTrialSchema.optional(),
      preferences: backupSettingsPreferencesSchema.optional()
    }).strict();

    const backupTablesSchema = z.object({
      baby_profile: z.array(babyProfileRowSchema).optional(),
      log_event: z.array(logEventRowSchema).optional(),
      timer_state: z.array(timerStateRowSchema).optional(),
      file_export: z.array(fileExportRowSchema).optional()
    }).strict();

    const backupFileSchema = z.object({
      format_version: z.literal(1),
      exported_at: epochMsSchema,
      app_version: z.string().min(1).max(80),
      schema_version: z.literal(1),
      tables: backupTablesSchema,
      settings: backupSettingsSchema
    }).strict();

Ordre d’import

L’import doit respecter l’ordre suivant :

- baby_profile
- log_event
- timer_state
- file_export

Avant insertion, dans la même transaction, les tables sont purgées dans l’ordre inverse :

- file_export
- timer_state
- log_event
- baby_profile

Transaction et rollback

- L’import complet est exécuté dans une transaction unique.
- La validation Zod précède toute écriture.
- Si une ligne échoue à la validation Zod, rollback complet et aucune écriture.
- Si une écriture SQLite échoue, rollback complet.
- Aucun écrasement silencieux. Une confirmation explicite est exigée dans l’UI avant restauration.
- Après restauration réussie, les settings autorisés sont écrits dans MMKV.
- Les entitlements premium ne sont pas restaurés depuis le backup. Ils doivent être reconstruits par restore purchases ou par le stockage sécurisé local.

Clés MMKV exportées

Liste explicite des clés MMKV autorisées dans le backup :

- settings:night_mode
- settings:night_mode_start_minutes
- settings:night_mode_end_minutes
- trial:state
- trial:started_at
- trial:ends_at
- trial:claimed_local

Clés MMKV exclues

Liste explicite des clés exclues du backup :

- secrets: toutes clés
- billing: toutes clés
- ai: toutes clés
- analytics: toutes clés
- ui: toutes clés transitoires
- trial:claimed_secure, car géré dans SecureStore ou stockage sécurisé OS et non exporté

## 11. Analytics, quota et entitlements

Événements

Les événements sont stockés dans la table event. Le nom est stable et allowlisté. Les propriétés sont JSON, validées par Zod, et limitées à une liste de clés techniques.

Événements pris en charge :

- app_installed
- onboarding_started
- onboarding_completed
- first_profile_created
- trial_offer_shown
- trial_started
- trial_completed
- trial_expired_paywall_shown
- trial_already_claimed_detected
- first_value_moment
- core_action_completed
- night_mode_used
- history_limit_reached
- second_profile_attempted
- premium_feature_attempted
- paywall_shown
- paywall_closed
- paywall_converted
- purchase_completed
- restore_completed
- subscription_started
- lifetime_unlocked
- premium_restored
- subscription_cancelled
- pdf_export_attempted
- backup_export_attempted
- backup_exported
- backup_imported
- co_parent_transfer_attempted
- prediction_viewed
- error_logged

Propriétés attendues

Propriétés autorisées dans properties :

- screen : nom d’écran technique
- feature : identifiant feature, exemple F07
- trigger : déclencheur, exemple history_limit_reached
- period_days : période concernée
- count : compteur non personnel
- source : manual, timer, import ou restore
- error_code : code technique court

Interdictions :

- pas d’email
- pas de nom complet
- pas de date de naissance précise
- pas de contenu de note
- pas de token
- pas de clé API
- pas d’IDFA ou GAID
- pas d’identifiant publicitaire

Quota

- Aucun quota IA n’est requis au MVP.
- Aucune table de quota n’est créée dans m001.
- Si BYOK est activé dans une version future, le quota local recommandé est un compteur MMKV avec reset quotidien.
- Si un besoin d’audit de quota apparaît, une migration additive pourra créer une table dédiée.

Entitlements

- La source de vérité des entitlements sensibles est MMKV chiffrée ou SecureStore.
- SQLite ne contient aucun entitlement.
- Aucun secret d’achat, aucune signature, aucune clé de licence, aucun receipt complet ne doit être stocké dans SQLite.
- Un cache non sensible peut exister en mémoire dans le state global pour l’UI, mais il doit pouvoir être reconstruit depuis le stockage sécurisé.
- Le trial est stocké dans MMKV standard et flag sécurisé best-effort. Il n’est pas stocké dans SQLite.

Restrictions privacy

- La table event ne doit jamais contenir de secret.
- La table error_log ne doit jamais contenir de payload utilisateur sensible.
- Les exports analytics sont manuels uniquement.
- Aucun envoi automatique d’analytics n’est autorisé.
- Aucun SDK publicitaire n’est autorisé.
- Aucune donnée de tracking ne doit être limitée en nombre d’événements par jour.

## 12. Vérification des conventions

- Moteur expo-sqlite respecté : OUI. Le modèle cible une base locale babylog.db via expo-sqlite.
- PRAGMA foreign_keys = ON prévu : OUI. PRAGMA foreign_keys = ON est exécuté à l’ouverture.
- Table schema_version présente : OUI. schema_version est créée dans m001.
- Tables en snake_case singulier : OUI. baby_profile, log_event, timer_state, file_export, event, error_log.
- Colonnes en snake_case : OUI. Toutes les colonnes utilisent snake_case.
- IDs TEXT UUID : OUI. Toutes les tables métier utilisent TEXT PRIMARY KEY et UUIDv4 généré par expo-crypto.
- Dates INTEGER epoch millisecondes : OUI. Toutes les dates sont INTEGER avec CHECK >= 0.
- Booléens INTEGER avec CHECK : OUI par construction. Aucun booléen SQLite n’est présent au MVP. Si un booléen est ajouté, CHECK IN (0, 1) sera obligatoire.
- created_at présent sur toutes les tables métier : OUI. Présent sur baby_profile, log_event, timer_state, file_export.
- updated_at présent sur toutes les tables métier : OUI. Présent sur baby_profile, log_event, timer_state, file_export.
- Triggers updated_at présents : OUI. Six triggers couvrent les tables avec updated_at.
- Triggers sécurisés contre récursion : OUI. WHEN NEW.updated_at = OLD.updated_at est ajouté.
- Index sur jointures : OUI. Les index composites sur log_event et file_export couvrent les clés étrangères. timer_state est couvert par UNIQUE.
- Index sur filtres, tris et requêtes chaudes : OUI. Index sur started_at, created_at, type, baby_profile_id, name.
- SQL uniquement dans repositories : OUI. La spécification interdit le SQL hors repositories et fournit les méthodes typées.
- Schémas Zod miroirs définis : OUI. Les schémas row, insert, update, analytics et backup sont définis.
- Settings et secrets hors SQLite : OUI. Aucun secret, token ou entitlement dans SQLite. MMKV et SecureStore sont utilisés.
- Pagination keyset prévue : OUI. Les méthodes de liste utilisent created_at et id sans OFFSET.
- Backup sans secret : OUI. Le backup exclut billing, secrets, ai et clés sensibles.
- Backup transactionnel : OUI. Import avec transaction unique et rollback.
- Import validé par Zod : OUI. backupFileSchema est strict.
- Migrations non destructives ou signalées : OUI. m001 est non destructive. Les futures migrations destructives devront être signalées.
- Score de complexité calculé : OUI. Score final 3,5 sur 10.

## 13. Complexité et simplifications

Comptage détaillé

- Tables métier : 4
- Tables de jointure : 0
- Relations N-N : 0
- Dénormalisations : 1, la table log_event regroupe les détails typés au lieu de tables feeding_detail, sleep_detail, diaper_detail et note_event
- Triggers hors updated_at : 0
- Tables FTS5 : 0
- Migrations V1.1 anticipées au-delà de 3 : 0

Calcul du score

- Base : 3
- Plus 1 par table métier au-delà de 8 : 0
- Plus 0,5 par relation N-N : 0
- Plus 0,5 par dénormalisation : 0,5
- Plus 0,25 par trigger hors updated_at : 0
- Plus 0,5 si FTS5 présent : 0
- Plus 0,25 par migration V1.1 anticipée au-delà de 3 : 0

Score initial : 3,5

Simplifications appliquées

- Pas de tables de détails séparées pour feeding, sleep, diaper et note.
- Pas de table de jointure.
- Pas de FTS5, car pas de recherche texte demandée.
- Pas de table d’entitlements dans SQLite.
- Pas de table de quota IA au MVP.
- Timer simple sans modèle de pause complexe.
- Export, backup et transfert sont représentés par une seule table file_export typée.
- Suppression des index redondants ou inutiles.
- Remplacement des méthodes ambiguës par méthodes exactes.

Score final

- Score final : 3,5 sur 10.

Risque résiduel

- Le risque principal est la croissance de log_event sur plusieurs mois. Il est mitigé par index, pagination keyset et possibilité d’ajouter daily_aggregate dans une migration future.
- Le second risque est la gestion correcte du soft delete dans toutes les requêtes. Il est mitigé par repository centralisé et index partiels.
- Le troisième risque est la confusion entre settings MMKV et données SQLite. Il est mitigé par une liste explicite de clés exportées.

## 14. Passation au GPT 6

Écran : ProfilCreationScreen

- Nom de l’écran : création du premier profil bébé
- Entités affichées : baby_profile
- Champs affichés : name, birth_date
- Champs éditables : name, birth_date
- Contraintes de formulaire : name entre 1 et 80 caractères, birth_date epoch ms valide
- Validation Zod côté UI : babyProfileInsertSchema
- État loading : spinner discret pendant create
- État empty : non applicable, formulaire initial
- État error : message local si validation échoue ou erreur SQLite
- État success : navigation vers accueil tracking, événement first_profile_created
- Actions possibles : créer le profil, démarrer essai premium manuellement
- Méthodes associées : babyProfileRepository.create, babyProfileRepository.countProfiles, eventRepository.create

Écran : TrackingHomeScreen

- Nom de l’écran : accueil tracking 1-tap
- Entités affichées : log_event, timer_state, baby_profile
- Champs affichés : dernier événement, timer actif, boutons tétée sommeil couche note
- Champs éditables : aucun directement sur cet écran
- Validation Zod côté UI : logEventInsertSchema lorsque le timer est complété
- État loading : lecture getActiveByProfile
- État empty : aucun événement aujourd’hui, message court rassurant
- État error : toast local si échec écriture
- État success : événement créé, timer supprimé si complété
- Tri par défaut : dernier événement par started_at descendant
- Filtres disponibles : profil actif
- Pagination keyset : non pour bloc récent
- Actions possibles : créer événement, démarrer timer, arrêter timer, ouvrir timeline
- Méthodes associées : timerRepository.getActiveByProfile, timerRepository.startTimer, timerRepository.stopTimer, logEventRepository.create, logEventRepository.completeTimerAndCreateEvent

Écran : TimelineScreen

- Nom de l’écran : timeline du jour et historique limité
- Entités affichées : log_event
- Champs affichés : type, started_at, ended_at, duration_ms, amount_ml, side, diaper_type, note_text
- Champs éditables : aucun en lecture
- Validation Zod côté UI : logEventRowSchema pour données importées uniquement
- État loading : skeleton ou spinner
- État empty : aucun événement sur la période
- État error : message local rechargeable
- État success : liste affichée
- Tri par défaut : started_at descendant
- Filtres disponibles : profil, fenêtre 24 heures en free, période premium
- Pagination keyset : oui pour historique complet premium, non pour jour borné
- Actions possibles : ouvrir détail, éditer, supprimer avec undo
- Méthodes associées : logEventRepository.getTimelineDay, logEventRepository.getRecentWindow, logEventRepository.listByProfilePage, logEventRepository.softDelete, logEventRepository.restore

Écran : EventEditScreen

- Nom de l’écran : édition d’un événement
- Entités affichées : log_event
- Champs affichés : type, started_at, ended_at, duration_ms, amount_ml, feeding_method, side, diaper_type, note_text
- Champs éditables : started_at, ended_at, duration_ms, amount_ml, feeding_method, side, diaper_type, note_text selon type
- Contraintes de formulaire : cohérence type et champs, ended_at postérieur à started_at, durée max 24 heures, amount_ml max 5000, note max 2000
- Validation Zod côté UI : logEventUpdateSchema
- État loading : lecture getById
- État empty : non applicable
- État error : message si validation ou échec update
- État success : retour timeline avec toast
- Actions possibles : enregistrer, annuler, supprimer avec undo
- Méthodes associées : logEventRepository.getById, logEventRepository.update, logEventRepository.softDelete, logEventRepository.restore

Écran : SettingsScreen

- Nom de l’écran : paramètres
- Entités affichées : préférences MMKV, baby_profile, backup metadata
- Champs affichés : mode nuit, profil actif, dernier backup
- Champs éditables : mode nuit, profil actif, préférences locales
- Contraintes de formulaire : valeurs enum pour mode nuit, minutes entre 0 et 1439
- Validation Zod côté UI : backupSettingsPreferencesSchema ou schéma settings dédié
- État loading : lecture MMKV et file_export récent
- État empty : aucun backup précédent
- État error : toast si écriture MMKV échoue
- État success : préférence enregistrée
- Actions possibles : changer mode nuit, ouvrir backup, ouvrir billing, ouvrir IA future
- Méthodes associées : fileExportRepository.listRecent, babyProfileRepository.listAll

Écran : PaywallScreen

- Nom de l’écran : paywall premium
- Entités affichées : aucune entité SQLite directement, entitlements MMKV
- Champs affichés : bénéfices premium, prix store, état trial
- Champs éditables : aucun
- Validation Zod côté UI : eventInsertSchema pour analytics
- État loading : chargement des produits store et entitlement local
- État empty : non applicable
- État error : message si store indisponible, restore ou achat échoué
- État success : confirmation achat ou restauration
- Actions possibles : acheter annuel, acheter lifetime, restore, fermer
- Méthodes associées : eventRepository.create pour paywall_shown, paywall_closed, purchase_completed, restore_completed

Écran : ExportScreen

- Nom de l’écran : export PDF et Emergency Doctor Mode
- Entités affichées : log_event, file_export
- Champs affichés : période, profil, statut d’export
- Champs éditables : période 7 ou 14 jours, 24 ou 48 heures pour emergency
- Contraintes de formulaire : période valide, profil existant
- Validation Zod côté UI : fileExportInsertSchema
- État loading : génération PDF
- État empty : aucun événement sur la période
- État error : toast si génération échouée
- État success : partage natif proposé
- Tri par défaut : started_at croissant pour export
- Filtres disponibles : profil, période
- Pagination keyset : non pour période bornée
- Actions possibles : générer PDF, partager, tracer export
- Méthodes associées : logEventRepository.getRangeForExport, fileExportRepository.create, fileExportRepository.markCompleted, fileExportRepository.markFailed

Écran : BackupScreen

- Nom de l’écran : backup restore manuel
- Entités affichées : baby_profile, log_event, timer_state, file_export, settings autorisés
- Champs affichés : dernier backup, statut import, confirmation
- Champs éditables : choix fichier, PIN ou mot de passe
- Contraintes de formulaire : fichier valide, PIN 6 chiffres ou mot de passe, confirmation explicite
- Validation Zod côté UI : backupFileSchema après déchiffrement
- État loading : chiffrement ou déchiffrement
- État empty : aucun backup local
- État error : HMAC invalide, mot de passe invalide, schéma invalide
- État success : backup exporté ou restauration terminée
- Actions possibles : exporter backup, importer backup, partager fichier
- Méthodes associées à l’export : babyProfileRepository.listAll, logEventRepository.listForBackup, timerRepository.getAll, fileExportRepository.listRecent, fileExportRepository.create, fileExportRepository.markCompleted, fileExportRepository.markFailed
- Méthodes associées à l’import : validation backupFileSchema, puis insertion transactionnelle dans l’ordre baby_profile, log_event, timer_state, file_export via insertRestoredRow

Écran : StatsScreen futur Release 3

- Nom de l’écran : statistiques multi-périodes
- Entités affichées : log_event agrégé
- Champs affichés : compteurs par type, durée totale sommeil, quantités, détail couches
- Champs éditables : sélecteur de période 1j, 7j, 30j, 90j, 180j, 365j
- Contraintes de formulaire : période autorisée uniquement
- État loading : agrégats en cours
- État empty : collecte en cours si pas assez de données
- État error : message local
- État success : graphiques et totaux
- Actions possibles : changer période, consulter détail
- Méthodes associées : logEventRepository.getStatsByRange, logEventRepository.getDiaperBreakdownByRange

Écran : PredictionScreen futur Release 3

- Nom de l’écran : estimation de fenêtre de sommeil
- Entités affichées : log_event sommeil
- Champs affichés : prochaine fenêtre estimée, niveau de confiance simple, état collecte
- Champs éditables : aucun
- État loading : calcul local
- État empty : collecte en cours si historique insuffisant
- État error : fallback gracieux, pas de crash
- État success : estimation affichée
- Actions possibles : rafraîchir localement, consulter timeline
- Méthodes associées : logEventRepository.getSleepWindowsForPrediction

---

Le document corrigé peut être transmis au GPT 6, en particulier la section Passation au GPT 6, car elle définit les contrats de données par écran.