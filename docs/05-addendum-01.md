# 05-addendum-01.md — Évolutions m001 pré-publication

Date : 2026-09-18
Statut : approuvé (décisions D-019/D-020 pour note_text ; confirmations d'enum journalisées avec D-024 à D-028 dans `.planning/PROJECT.md`)
Portée : compléter `05-data-model.md`. m001 n'étant pas encore publiée, ces évolutions sont intégrées **directement dans m001** (aucune migration supplémentaire). En cas de divergence, le présent addendum prime sur le doc 05.

## 1. CHECK note_text assoupli — note attachable à tout type d'événement

- **Évolution** : le CHECK `note_text IS NULL OR type = 'note'` (et son miroir `superRefine` Zod) est assoupli : `note_text` est désormais autorisé sur **tout type** d'événement (`feeding`, `sleep`, `diaper`, `note`), dans la limite de 2000 caractères.
- **Motif** : attente marché vérifiée (tous les concurrents majeurs permettent une note par entrée) ; une note standalone reste un type d'événement à part entière.
- **Conséquences** :
  - DDL m001 : suppression du CHECK de exclusion `note_text`/`type = 'note'` ; conservation de `CHECK (note_text IS NULL OR length(note_text) <= 2000)`.
  - Les schémas Zod miroirs (`logEventRowSchema`, `logEventUpdateSchema`) évoluent **en lockstep** : suppression de l'issue « note_text only allowed for note ».
  - Références : décisions D-019/D-020.

## 2. Enum `diaper_type` verrouillé

- **Valeur arrêtée** : `diaper_type` = `wet` / `dirty` / `mixed` / `dry`.
- Le `mixed` couvre la saisie pipi+caca en une seule action (requirement TRACK-05). Le CHECK existant de m001 est confirmé tel quel.

## 3. Enum `side` verrouillé

- **Valeur arrêtée** : `side` = `left` / `right` / `both`.
- Le CHECK existant de m001 est confirmé tel quel ; la saisie MVP expose Sein G / Sein D (TRACK-01/TRACK-02), `both` reste disponible en édition.
