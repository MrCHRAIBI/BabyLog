# Requirements: BabyLog Offline

**Defined:** 2026-09-12
**Core Value:** Un parent peut enregistrer une tétée/sieste/couche en ≤ 2 taps à 3h du matin sans regarder l'écran (haptique, zéro latence) — et les données ne quittent jamais l'appareil.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Onboarding & App Shell

- [ ] **SETUP-01**: User can complete onboarding express (< 45 s) : prénom bébé (focus auto), date de naissance (date picker natif), heure et poids optionnels — zéro compte, zéro permission
- [ ] **SETUP-02**: User must accept le disclaimer non-médical (checkbox bloquante) avant de terminer l'onboarding ; consultable à nouveau depuis Paramètres
- [ ] **SETUP-03**: Le prénom du bébé est chiffré (AEAD 256-bit) AVANT écriture SQLite, avec badge « Chiffré localement » visible dans l'UI
- [ ] **SETUP-04**: Le flag MMKV `onboarding:completed` protège les routes (groupe tabs inaccessible avant onboarding) et gate l'init différée AdMob/IAP
- [ ] **SETUP-05**: Navigation à 4 tabs (Journal, Tracker, Stats, Paramètres) via Expo Router typed routes + écran +not-found

### Tracking 1-Tap & Timeline

- [ ] **TRACK-01**: User can démarrer/arrêter un timer Feed ou Sleep en 1 tap (haptic impact à l'action, toast + durée à l'arrêt, session sauvegardée en base)
- [ ] **TRACK-02**: User can consigner une couche en 1 tap sans timer via chips (Mouillée/Sale/Mixte/Propre) — enregistrée immédiatement
- [ ] **TRACK-03**: Le timer en cours survit au crash/kill de l'app (état MMKV `timer:` avec startedAt, reprise du temps écoulé à la réouverture)
- [ ] **TRACK-04**: User can changer le côté d'allaitement (gauche/droite) pendant une tétée en cours
- [ ] **TRACK-05**: User can éditer, ajuster les horaires ou supprimer une session passée (EditSessionSheet : type, début, fin, détails, notes ≤ 500 caractères)
- [ ] **TRACK-06**: User sees la Timeline des 7 derniers jours groupée par jour (tri `started_at DESC`), avec cumuls quotidiens (nb tétées/couches, heures de sommeil) et filtres par type
- [ ] **TRACK-07**: Chaque bouton de tracking affiche « Dernière [tétée/sieste/couche] il y a X »
- [ ] **TRACK-08**: Le schéma m001 inclut l'enum modalité de tétée (nurse/bottle/pump) — UI de saisie pompage en V1.1
- [ ] **TRACK-09**: Les notes de session (0-500 caractères) sont chiffrées avant écriture SQLite

### UI « Nuit » Nocturne Glow

- [ ] **NIGHT-01**: L'app est dark-only : thème Nocturne Glow (`#14121e`, texte crème `#F9ECE5`, primary `#7665FA`) — aucun blanc pur `#FFFFFF` visible
- [ ] **NIGHT-02**: Chaque action de tracking produit un retour haptique natif (désactivable dans Paramètres)
- [ ] **NIGHT-03**: Le TimerButton (180px) affiche un ambient pulse + timer 48px pendant qu'une session est en cours (2 animations custom max)
- [ ] **NIGHT-04**: La police Plus Jakarta Sans est bundlée via expo-font et appliquée aux tokens typo du design system

### Prédiction SweetSpot

- [ ] **PRED-01**: La prédiction de fenêtre d'éveil est calculée 100% local (EMA moyennes mobiles sur 3 derniers jours de sommeil) en < 1 ms, zéro réseau
- [ ] **PRED-02**: En free, après 3 jours de données : teaser SweetSpot affiché (calcul verrouillé) ; en dessous de 3 jours : « Collecte en cours… Données insuffisantes »
- [ ] **PRED-03**: En premium : la prédiction complète (prochaine fenêtre + confiance) s'affiche et se met à jour après chaque session de sommeil terminée

### Export PDF Pédiatre

- [ ] **PDF-01**: User can générer un rapport PDF A4 des 7 derniers jours 100% local (expo-print) contenant le disclaimer non-médical
- [ ] **PDF-02**: Le PDF généré s'ouvre via le Share Sheet natif (AirDrop, Fichiers, email)
- [ ] **PDF-03**: En free : 1 export glissant / 7 jours (quota MMKV) ; quota atteint → bouton désactivé + option rewarded opt-in « +1 export » (max 1/7 j)
- [ ] **PDF-04**: Le bouton d'export est désactivé avec tooltip si aucune donnée sur les 7 derniers jours

### Backup Chiffré

- [ ] **BACKUP-01**: User can exporter toutes ses données dans un fichier `.babylog` chiffré (code : PIN 6 chiffres ou mot de passe 8-128, dérivation PBKDF2, sel aléatoire), partagé via Share Sheet
- [ ] **BACKUP-02**: User can importer un `.babylog` : validation Zod stricte AVANT toute écriture, restauration transactionnelle avec ROLLBACK complet en cas d'échec
- [ ] **BACKUP-03**: Un code erroné ou un fichier invalide produit le message générique unique « Code incorrect ou fichier invalide » (zéro fuite d'information)
- [ ] **BACKUP-04**: L'import demande une confirmation explicite d'écrasement des données locales avant restauration
- [ ] **BACKUP-05**: Si aucun export depuis 30 jours ET rappel activé : notification locale de rappel backup (gratuite, désactivable, permission POST_NOTIFICATIONS demandée uniquement à l'activation)
- [ ] **BACKUP-06**: Le backup et l'export de données ne sont JAMAIS paywallés (règle éthique)

### Monétisation (IAP & Paywall)

- [ ] **MONET-01**: User sees un paywall local (modal) : comparatif Free/Premium, 3 formules (Lifetime = CTA principal, Annuel, Mensuel) avec prix issus des produits stores (jamais de prix en dur)
- [ ] **MONET-02**: User can acheter via expo-iap (StoreKit/Play Billing) : confirmation store → entitlement écrit en MMKV chiffrée, utilisable offline immédiatement
- [ ] **MONET-03**: User can restaurer ses achats depuis le paywall et Paramètres ; fonctionne en mode avion si l'entitlement est présent localement
- [ ] **MONET-04**: Le gating premium (hook `useEntitlements`) contrôle : SweetSpot complet, historique illimité, exports PDF illimités — tracking/UI Nuit/timeline 7j/backup jamais gatés
- [ ] **MONET-05**: Le paywall respecte les règles : jamais au premier lancement, pendant l'onboarding, un timer actif, une saisie ou un export ; max 1 spontané / 7 jours ; cooldown 24 h après fermeture ; bouton fermer ≥ 44 pt
- [ ] **MONET-06**: Les cohortes de prix A/B sont assignées localement (hash de l'install ID stocké en MMKV) et sélectionnent le produit store affiché

### Ads (Free Tier)

- [ ] **ADS-01**: Le SDK AdMob n'est initialisé qu'après `onboarding_completed` ET pour le tier free uniquement (jamais si premium), avec `delayAppMeasurementInit` garantissant zéro réseau au boot
- [ ] **ADS-02**: Formats autorisés : Native et Banner (Stats diurnes + Paramètres, max 2/jour chacun) et Rewarded opt-in (max 3/jour) — interstitial INTERDIT
- [ ] **ADS-03**: Zéro ad sur : tracking, timer actif, mode Nuit, timeline active, export PDF, backup, paywall, onboarding
- [ ] **ADS-04**: Consentement Google UMP (EEA/UK) stocké localement ; refus → annonces non personnalisées ; `maxAdContentRating="G"`, pas de ciblage santé, pas d'IDFA
- [ ] **ADS-05**: Les règles de fréquence sont codées en dur dans `core/ads/rules.ts` (compteurs MMKV `ads:`)

### Analytics & Fiabilité

- [ ] **LOGS-01**: Les événements produit (spec docs/03) sont journalisés dans une table SQLite locale `event`, exportables manuellement via Share Sheet — ZÉRO envoi automatique
- [ ] **LOGS-02**: Les erreurs sont journalisées dans `error_log` local sans PII ni secrets
- [ ] **LOGS-03**: Le boot est 100% offline (zéro appel réseau avant `onboarding_completed`, vérifié en mode avion) avec cold start < 2 s mesuré

### Paramètres & i18n

- [ ] **SET-01**: Paramètres regroupe : profil bébé (lecture), thème (OLED), langue, toggle haptique, toggle rappel backup, accès backup export/import, export données brutes, restore achats, disclaimer, licences
- [ ] **SET-02**: L'app supporte en/fr/es/it/ja via i18next + expo-localization (détection auto, fallback `en`, clés typées)
- [ ] **SET-03**: User can exporter ses données d'usage (event log JSON) via Share Sheet — jamais paywallé

### Fondations Techniques

- [ ] **INFRA-01**: La migration m001 crée le schéma complet (tables singulières snake_case, IDs TEXT uuid, dates epoch ms, index obligatoires, triggers `updated_at`, enum pompage)
- [ ] **INFRA-02**: L'accès SQL passe exclusivement par des repositories typés derrière l'interface `DbAdapter` (expo-sqlite en prod, better-sqlite3 in-memory en test)
- [ ] **INFRA-03**: MMKV expose instances standard + chiffrée (AES-256 explicite, clé dérivée de la master key expo-secure-store) ; stores Zustand persistés avec `partialize` strict
- [ ] **INFRA-04**: Des dev builds EAS (profils development/preview/production) remplacent Expo Go ; boot pipeline centralisé (`core/boot/bootstrap.ts`) : migrations → MMKV → stores → routes
- [ ] **INFRA-05**: TypeScript strict complet (noUncheckedIndexedAccess), ESLint+Prettier zéro warning, Vitest ≥ 80% sur services et repositories
- [ ] **INFRA-06**: Le wrapper crypto (`core/utils/crypto`) utilise l'écosystème @noble pur JS (hashes pour PBKDF2/SHA, ciphers pour l'AEAD 256-bit) — benchmark device réel dans la phase data-layer

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### V1.1 (Mois 2-3)

- **SYNC-01**: Sync partenaire asynchrone via QR Code Delta (export/import chiffré des modifications du jour, tombstones propagés)
- **CSV-01**: Import/export CSV complet pour les parents « data nerds »
- **PUMP-01**: UI de saisie pompage (chips nurse/bottle/pump) exploitant l'enum m001
- **GROW-01**: Journal de croissance (poids/taille) avec saisie simple ; courbes OMS en V2
- **DRIVE-01**: Upload 1-tap du fichier .babylog chiffré vers Google Drive (OAuth PKCE, manuel uniquement, premium)

### V2.0 (Mois 4-6)

- **WIDGET-01**: Widgets iOS/Android affichant le timer en cours
- **NOUNOU-01**: Mode « Nounou » : profil invité à accès restreint (pas d'export, pas d'historique complet)
- **HIST-01**: Historique illimité premium avec pagination keyset UI (repos déjà spécifié)
- **LIGHT-01**: Thème light diurne (tokens Nocturne Glow light) pour Stats/Paramètres
- **IA-01**: IA BYOK optionnelle (fetch multi-providers, clés en MMKV chiffrée `secrets:`)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Sync cloud temps réel | INTERDIT : viole l'architecture local-first et la promesse Zero-Knowledge |
| Backend / serveur propre | Zéro coût d'infrastructure, privacy absolue — cœur du positionnement |
| RevenueCat | SaaS d'entitlements ; entitlements 100% MMKV local obligatoire |
| Sentry / Mixpack / analytics SaaS | Envoi de données vers tiers ; remplacés par event/error logs SQLite locaux |
| react-native-quick-crypto | Binding C++ JSI interdit (règle zéro natif complexe) ; @noble pur JS |
| AsyncStorage | Lent, non chiffré ; MMKV obligatoire |
| Redux / MobX / Jotai ; styled-components / Tamagui / Gluestack | Double paradigme interdit : un seul outil de state (Zustand) et de styling (NativeWind) |
| Interstitial ads | Interdites définitivement : détruisent rétention et confiance (usage nocturne intime) |
| Paywall sur backup / export de données | INTERDIT par règle éthique : données jamais prises en otage |
| Communauté / réseau social | Nécessite backend + modération, dilue le positionnement privacy |
| FTS5 / recherche plein texte | Incompatible avec champs chiffrés ; aucune feature de recherche au périmètre |
| ML lourd embarqué / IA API externe | Alourdit le binaire et viole le boot offline ; SweetSpot = moyennes mobiles JS pur |
| IDFA / user tracking | Pas de tracking publicitaire ; UMP avec ATT désactivé |
| WatermelonDB / Realm | Sync-oriented et natif lourd, inutile en mono-device strict |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-02 | Phase 1 | Pending |
| INFRA-04 | Phase 1 | Pending |
| INFRA-05 | Phase 1 | Pending |
| NIGHT-01 | Phase 1 | Pending |
| NIGHT-04 | Phase 1 | Pending |
| INFRA-01 | Phase 2 | Pending |
| INFRA-03 | Phase 2 | Pending |
| INFRA-06 | Phase 2 | Pending |
| TRACK-08 | Phase 2 | Pending |
| SETUP-01 | Phase 3 | Pending |
| SETUP-02 | Phase 3 | Pending |
| SETUP-03 | Phase 3 | Pending |
| SETUP-04 | Phase 3 | Pending |
| SETUP-05 | Phase 3 | Pending |
| TRACK-01 | Phase 4 | Pending |
| TRACK-02 | Phase 4 | Pending |
| TRACK-03 | Phase 4 | Pending |
| TRACK-04 | Phase 4 | Pending |
| TRACK-05 | Phase 4 | Pending |
| TRACK-06 | Phase 4 | Pending |
| TRACK-07 | Phase 4 | Pending |
| TRACK-09 | Phase 4 | Pending |
| NIGHT-02 | Phase 4 | Pending |
| NIGHT-03 | Phase 4 | Pending |
| PRED-01 | Phase 5 | Pending |
| PRED-02 | Phase 5 | Pending |
| PRED-03 | Phase 5 | Pending |
| PDF-01 | Phase 5 | Pending |
| PDF-02 | Phase 5 | Pending |
| PDF-03 | Phase 5 | Pending |
| PDF-04 | Phase 5 | Pending |
| BACKUP-01 | Phase 6 | Pending |
| BACKUP-02 | Phase 6 | Pending |
| BACKUP-03 | Phase 6 | Pending |
| BACKUP-04 | Phase 6 | Pending |
| BACKUP-05 | Phase 6 | Pending |
| BACKUP-06 | Phase 6 | Pending |
| MONET-01 | Phase 7 | Pending |
| MONET-02 | Phase 7 | Pending |
| MONET-03 | Phase 7 | Pending |
| MONET-04 | Phase 7 | Pending |
| MONET-05 | Phase 7 | Pending |
| MONET-06 | Phase 7 | Pending |
| ADS-01 | Phase 7 | Pending |
| ADS-02 | Phase 7 | Pending |
| ADS-03 | Phase 7 | Pending |
| ADS-04 | Phase 7 | Pending |
| ADS-05 | Phase 7 | Pending |
| LOGS-01 | Phase 7 | Pending |
| LOGS-02 | Phase 7 | Pending |
| LOGS-03 | Phase 7 | Pending |
| SET-01 | Phase 7 | Pending |
| SET-02 | Phase 7 | Pending |
| SET-03 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0 ✓

*Note: an earlier revision stated 45 v1 requirements; the actual count is 54 (5 SETUP + 9 TRACK + 4 NIGHT + 3 PRED + 4 PDF + 6 BACKUP + 6 MONET + 5 ADS + 3 LOGS + 3 SET + 6 INFRA).*

---
*Requirements defined: 2026-09-12*
*Last updated: 2026-09-12 after roadmap creation (traceability filled, 54/54 mapped)*
