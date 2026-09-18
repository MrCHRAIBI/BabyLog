# Requirements: BabyLog

**Defined:** 2026-09-18
**Core Value:** Un parent peut enregistrer un événement (tétée, sommeil, couche, note) en 1 geste, offline, et aucune donnée du bébé ne quitte jamais l'appareil.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Tracking 1-tap & Timer

- [ ] **TRACK-01**: Un parent peut enregistrer une tétée sein gauche ou droit en 1 tap sur un gros bouton — le tap démarre le timer
- [ ] **TRACK-02**: Un parent arrête le timer en 1 tap : l'événement est loggé avec durée, côté (left/right/both) et méthode (breast)
- [ ] **TRACK-03**: Un parent peut enregistrer un biberon en 1 tap avec quantité optionnelle (mL ou oz selon la locale)
- [ ] **TRACK-04**: Un parent peut démarrer et arrêter un timer de sommeil : l'événement est loggé avec début, fin et durée
- [ ] **TRACK-05**: Un parent peut enregistrer une couche en 1 tap avec type wet / dirty / mixed / dry (pipi+caca en une seule saisie)
- [ ] **TRACK-06**: Un parent peut créer une note standalone (max 2000 caractères) et joindre une note à n'importe quel événement de tracking
- [ ] **TRACK-07**: Un timer actif survit au passage en arrière-plan, au kill de l'app et au redémarrage du téléphone (timestamp persisté en SQLite, jamais un chrono JS)
- [ ] **TRACK-08**: Un seul timer actif par profil : en démarrer un nouveau remplace proprement l'ancien (transaction atomique)
- [ ] **TRACK-09**: Un timer oublié au-delà de 24 h est clampé à 24 h : l'événement est préservé, aucune erreur, aucune perte de la tétée

### Timeline & Résumé

- [ ] **VIEW-01**: En ouvrant l'app, un parent voit la timeline chronologique du jour (type, heure, durée, détails, note)
- [ ] **VIEW-02**: Un parent voit les totaux automatiques du jour : nombre de tétées, couches, durée de sommeil
- [ ] **VIEW-03**: La timeline du jour répond en moins de 16 ms jusqu'à 200 événements (index timeline, aucun SCAN)

### Édition & Correction

- [ ] **EDIT-01**: Un parent peut éditer tout événement : heure de début à la seconde près, type, champs de détail
- [ ] **EDIT-02**: Un parent peut backdater un événement à une heure passée
- [ ] **EDIT-03**: Un parent peut supprimer un événement après confirmation (soft delete, restaurable)
- [ ] **EDIT-04**: Un parent peut annuler une suppression récente (undo)

### Profil Bébé

- [ ] **PROF-01**: Un parent crée un profil bébé (prénom, date de naissance) en moins de 30 s après installation, sans compte ni connexion
- [ ] **PROF-02**: Aucune permission n'est requise au premier lancement ; l'app est 100 % fonctionnelle en mode avion
- [ ] **PROF-03**: Un compte Free est limité à 1 profil actif ; la tentative d'ajout déclenche le gate premium

### Mode Nuit

- [ ] **NIGHT-01**: Le thème sombre OLED s'active automatiquement sur la fenêtre par défaut 20:00–07:00 (1200/420 minutes), configurable dans les réglages
- [ ] **NIGHT-02**: Trois modes de thème : off / on / auto, persistés et restaurés au lancement
- [ ] **NIGHT-03**: La fenêtre de nuit traverse minuit et gère les changements d'heure (DST) sans rester bloquée

### Exports

- [ ] **EXPT-01**: Tout utilisateur (y compris Free post-trial) peut générer en urgence un rapport des dernières 24 h ou 48 h — Emergency Doctor Mode gratuit
- [ ] **EXPT-02**: Un utilisateur Premium peut exporter un PDF pédiatre de 7 ou 14 jours (génération locale expo-print, partage natif)
- [ ] **EXPT-03**: Chaque PDF exporté porte un bloc éditable « notes pour le docteur » / identifiant patient
- [ ] **EXPT-04**: Tout export est journalisé localement (table file_export : kind, statut, période) sans jamais stocker le fichier ni de secret

### Backup & Restore

- [ ] **BKUP-01**: Tout utilisateur peut exporter un backup chiffré (AES-256 + PBKDF2) en fichier partagé localement — gratuit, aucune synchronisation
- [ ] **BKUP-02**: Tout utilisateur peut restaurer un backup après confirmation explicite : purge inverse puis insertion dans une transaction unique, rollback complet au moindre échec
- [ ] **BKUP-03**: Un fichier de version future inconnue de l'app produit une erreur claire avec guidance (contrat de version), jamais un échec Zod cryptique
- [ ] **BKUP-04**: Les entitlements premium et l'état de trial ne sont jamais restaurés depuis un backup ; le flag OS sécurisé prime

### Trial, Monétisation & IAP

- [ ] **PAY-01**: À la première ouverture, un trial local de 72 h démarre : accès Premium complet, sans compte ni connexion
- [ ] **PAY-02**: À la fin du trial, downgrade gracieux vers Free : historique > 24 h caché (jamais supprimé), 1 profil, export 7/14 j verrouillé
- [ ] **PAY-03**: L'historique caché redevient intégralement visible immédiatement après achat ou restore purchases — zéro migration
- [ ] **PAY-04**: Le paywall propose $39.99/an et $99.99 lifetime via IAP natifs (StoreKit 2 / Play Billing), avec restore purchases fonctionnel sur les deux stores
- [ ] **PAY-05**: La limite Free 24 h est appliquée par paramètre de requête (since) au niveau entitlements/hooks — pas de filtrage applicatif massif, aucun SQL de gate
- [ ] **PAY-06**: Entitlements et état de trial vivent en MMKV chiffrée / SecureStore — jamais en SQLite ; le flag OS sécurisé prime sur MMKV

### Localisation & Unités

- [ ] **LOC-01**: L'app est livrée en EN et FR (i18next, fallback EN), avec l'architecture prête pour de / ja / ar (RTL)
- [ ] **LOC-02**: Les quantités s'affichent en mL ou oz selon la locale du téléphone

### Conformité, Accessibilité & Non-Médical

- [ ] **COMP-01**: Disclaimer non médical affiché à l'onboarding, dans les deux fiches stores et en pied de chaque export PDF : « BabyLog n'est pas un dispositif médical et ne fournit pas de conseil médical » — aucune allégation de diagnostic ou prédiction médicale dans l'UI (D-022)
- [ ] **COMP-02**: Privacy policy publique (URL hébergée) listant : données bébé 100 % locales, zéro backend, zéro SDK tiers au MVP, zéro identifiant publicitaire — liée depuis les fiches stores et les réglages in-app
- [ ] **COMP-03**: Apple Privacy Labels et Google Play Data Safety remplis strictement alignés sur le comportement réel (zéro collecte)
- [ ] **COMP-04**: Cibles tactiles ≥ 44 pt et labels VoiceOver/TalkBack sur chaque bouton de tracking et de timer ; contrastes validés en mode nuit et en mode jour

### Ops & Analytics

- [ ] **OPS-01**: Analytics 100 % locaux (table event, allowlist de noms) : aucun envoi automatique, export manuel uniquement, aucune donnée personnelle
- [ ] **OPS-02**: allowBackup=false / dataExtractionRules Android configurés dès la couche données (DB et MMKV exclus de l'auto-backup cloud)
- [ ] **OPS-03**: Play closed testing (12 testeurs × 14 jours) démarré au premier build preview — workstream parallèle au développement

## v2 Requirements

Deferred to future release (pack v1.x de la recherche). Tracked but not in current roadmap.

### Partage & Suivi avancé

- **F10**: Co-Parent Local Transfer — transfert manuel entre deux téléphones (fichier chiffré ou QR), sémantique move/merge à décider avant design
- **F14**: Écran « Passation de Relais » — résumé dernier repas / dernier sommeil / prochaine estimation
- **F13**: Suivi allaitement avancé — côté, durée par côté, pompage mL
- **F22-lite**: Mesures de croissance manuelles (poids / taille) sans courbes
- **LOC-EXT**: Localisations DE / JA / AR (RTL) — déclencheur : tests ASO sur ces marchés

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Cloud sync, comptes, backend, tout SaaS | Viole la promesse core : les données d'un bébé ne quittent jamais l'appareil |
| Publicités, SDK tracking, IDFA/GAID | Positionnement privacy + conformité « zéro collecte » ; monétisation IAP uniquement |
| IA dans le core UX (diagnostic, prédiction forcée) | Backlash vérifié (Nighp sept. 2026) + risque réglementaire médical ; BYOK optionnel backlog uniquement |
| Interprétation médicale (analyse selles, scores santé) | Risque dispositif médical ; données brutes + exports seulement |
| Stats multi-périodes (F15) et Cry Predictor (F06) | Release 3 — hors MVP strict |
| Notifications locales, Dream Feed (F11/F12) | Release 3 — hors MVP strict |
| Widgets, Live Activities, Apple Watch | Nécessite du natif Swift/Kotlin hors contrainte Expo pur |
| Multi-baby illimité / jumeaux avec vue combinée (F18) | Release 4 ; multi-profil Premium simple reste au MVP via paywall |
| Contenu éditorial, communauté, réseaux sociaux | Scope explosion ; contredit le positionnement outil calme |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (to be filled by roadmap) | | |

**Coverage:**
- v1 requirements: 46 total
- Mapped to phases: 0
- Unmapped: 46 ⚠️

---
*Requirements defined: 2026-09-18*
*Last updated: 2026-09-18 after initial definition*
