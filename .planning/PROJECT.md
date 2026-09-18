# BabyLog

## What This Is

BabyLog est un tracker de nouveau-né **100 % offline** pour iOS et Android, conçu pour les parents épuisés qui refusent que les données biométriques de leur enfant partent dans le cloud. À 3h du matin, un parent enregistre une tétée en 1 geste : sans connexion, sans latence, sans réveiller personne. Positionné contre Huckleberry et Glow Baby (lentes, ~$10/mois, monétisation agressive de données sensibles) : BabyLog est rapide, sans abonnement cloud, sans publicité, et les données ne quittent jamais l'appareil.

## Core Value

Un parent peut enregistrer un événement (tétée, sommeil, couche, note) en 1 geste, offline, et aucune donnée du bébé ne quitte jamais l'appareil.

## Business Context

- **Customer** : parents de nouveau-nés soucieux de leur vie privée, sur 9 marchés cibles (USA, Canada, UK, Australie, Japon, Allemagne, France, Suisse, GCC)
- **Revenue model** : IAP natifs unifiés — $39.99/an ou $99.99 lifetime. Zéro publicité, zéro cloud, zéro compte
- **Success metric** : conversion trial → payé ~2,5 % (RPI 30 jours réaliste $1.32, cf. docs/03)
- **Strategy notes** : spécifications complètes dans `docs/01` (marché), `docs/02` (features), `docs/03` (monétisation)

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Tracking 1-tap : boutons larges Sein G / Sein D / Biberon (1 tap démarre le timer, 1 tap stoppe et logge avec durée) ; couche et note = log instantané (F01)
- [ ] Timer persistant : survit à la mise en arrière-plan et au kill de l'app, via `timer_state` en SQLite + timestamp `started_at` (F01)
- [ ] Timeline visuelle du jour + résumé quotidien automatique (totaux tétées / couches / sommeil) (F03)
- [ ] Édition, suppression avec confirmation et Undo (soft delete + restauration) (F04)
- [ ] Profil bébé minimal (prénom + date de naissance), zéro compte, zéro permission obligatoire au premier lancement (F05)
- [ ] Mode nuit automatique : fenêtre par défaut **20:00–07:00** (1200/420 minutes), modes off / on / auto, configurable dans les réglages, UI OLED assombrie (F02)
- [ ] Export PDF pédiatre Premium : périodes **7 ou 14 jours**, génération locale via expo-print, partage natif (F07)
- [ ] **Emergency Doctor Mode** : export des dernières 24 h ou 48 h **gratuit pour tous**, y compris Free post-trial (exigence éthique) (F08)
- [ ] Backup / Restore manuel chiffré — **gratuit** : fichier JSON versionné chiffré, import avec confirmation explicite (F09)
- [ ] Trial local 72 h (accès Premium complet), puis downgrade gracieux vers Free : historique >24 h **caché mais conservé** (jamais supprimé), 1 profil actif
- [ ] Paywall IAP natifs avec restore purchases : Premium = historique illimité + multi-profil + export PDF 7/14 j ; $39.99/an ou $99.99 lifetime
- [ ] Entitlements locaux (MMKV chiffrée / SecureStore), jamais dans SQLite ; trial dans MMKV + flag sécurisé best-effort
- [ ] Analytics locaux uniquement (table `event`), aucun envoi automatique, export manuel, aucune donnée personnelle
- [ ] Localisation EN + FR au lancement (archi i18n prête pour de / ja / ar ensuite)

### Out of Scope

- Mode Partenaire P2P / Co-Parent Local Transfer (F10) — Release 2, transfert local complexe (QR/fichier)
- Suivi allaitement avancé (côté/durée/pompage, F13) et Passation de relais (F14) — Release 2
- Prédictions IA / Cry Predictor (F06) et Stats multi-périodes (F15) — Release 3, hors MVP strict
- Multi-baby illimité / jumeaux avec vue combinée (F18) — Release 4 (le multi-profil Premium simple reste dans le MVP via le paywall)
- Notifications locales, Dream Feed (F11/F12) — Release 3
- Toute forme de cloud : backend, sync serveur, compte utilisateur, SDK analytics distant, publicités — viole la promesse core
- Diagnostic médical, analyse de selles, capteurs/micro/caméra — risque réglementaire médical

## Context

- **Spécifications d'autorité dans `docs/`** (6 documents finalisés) :
  - `01-market-research.md` — audit marché (score 82.8/100), marchés whitelist, concurrence
  - `02-feature-ideas.md` — 34 features arbitrées : 5 core MVP + releases officielles 1→4 + backlog
  - `03-monetization-strategy.md` — trial 72h strict, free minimal, pricing unifié, paywalls, risques de perception « données prises en otage »
  - `04-tech-stack.md` — stack finale détaillée (Zustand+MMKV, expo-sqlite + repositories SQL brut, Zod aux frontières, i18next, migrations idempotentes, WAL)
  - `05-data-model.md` — modèle de données complet : DDL m001 (7 tables, 10 index, 6 triggers), repositories typés avec SQL exact, 6 requêtes chaudes avec budgets perf, format de backup chiffré v1, allowlist analytics
  - `06-ui-ux-design.md` — 7 écrans principaux, 9 modales, 3 tabs, 17 composants design system, palette lavande `#8893FE`, light + dark OLED
- Code existant : scaffold `create-expo-app` (Expo 57 + expo-router) vierge — aucun code métier
- Le périmètre MVP défini ici = features core F01–F05 **+** Release 1 (F07, F08, F09) **+** monétisation — fusion décidée en initialisation, qui étend le « MVP 5 features » de docs/02

## Constraints

- **Tech stack (imposée)** : Expo SDK 57, expo-sqlite, MMKV, NativeWind, expo-print, IAP natifs (StoreKit 2 / Play Billing) — toute dépendance cloud est interdite
- **Privacy** : aucune donnée du bébé hors appareil ; analytics locaux avec export manuel uniquement ; aucun SDK pub ; aucun IDFA/GAID
- **Stores** : conformité App Store + Play Store (IAP natifs, restore obligatoire, transparence trial, pas de dark pattern)
- **Performance** : budgets doc/05 — timeline et écritures < 16 ms, lecture timer < 1 ms, pas d'OFFSET (pagination keyset)
- **Langues** : EN + FR au lancement MVP ; RTL ar prévu plus tard (archi i18next)
- **Données Free** : historique >24 h caché par l'UI/entitlements mais **jamais supprimé** — suppression uniquement sur action utilisateur explicite

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 100 % offline, zéro backend/cloud/compte | Promesse core : les données biométriques d'un bébé ne quittent jamais l'appareil ; différenciateur vs Huckleberry/Glow Baby | — Pending |
| Free post-trial : données >24 h cachées, conservées localement | Rien n'est détruit — cohérent avec la promesse privacy ; tout revient si l'utilisateur paie | — Pending |
| Backup/Restore chiffré **gratuit** (met à jour docs/03 qui le positionnait Premium) | La peur de la perte de données ne doit jamais être un levier de paiement pour des données de bébé | — Pending |
| Emergency Doctor Mode 24 h/48 h gratuit pour tous | Exigence éthique : ne jamais faire payer l'accès aux données en situation d'urgence médicale | — Pending |
| Premium = historique illimité + multi-profil + PDF 7/14 j ($39.99/an ou $99.99 lifetime) | Pricing unifié doc/03, conversion cible 2,5 % | — Pending |
| Trial local 72 h → downgrade gracieux vers Free | Pas de verrouillage brutal ; paywall doux au geste naturel ; conforme stores | — Pending |
| Mode nuit auto 20:00–07:00 par défaut, configurable | Cas d'usage principal nocturne ; horaires 1200/420 minutes (docs/05, réglages) | — Pending |
| Tétée = boutons Sein G / Sein D / Biberon + timer ; couche/note = log instantané | Le geste 1-tap à 3h du matin doit être inférieur à 1 seconde | — Pending |
| iOS + Android dès le lancement | Marché plus large ; double surface de test IAP acceptée | — Pending |
| EN + FR au lancement | Couvre France/Suisse/Canada partiellement ; localisation complète plus tard | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-18 after initialization*
