# 04-tech-stack.md

## STACK TECHNIQUE FINALE — BabyLog Offline — 2026-09-15

Document destinataire : GPT 5 — Data Model Designer.

Ce document est la stack technique finale, corrigée, stable, sécurisée, minimale et directement exploitable par un agent de codage IA.

---

## RÉSUMÉ EXÉCUTIF

Stack finale : Expo SDK 57 ou supérieur, managed workflow, New Architecture si stable, TypeScript strict, Expo Router, NativeWind v4, design system maison minimal.

State global Zustand persisté via MMKV. Base locale expo-sqlite avec SQL brut encapsulé dans repositories typés, migrations idempotentes, WAL, foreign keys.

Validation Zod à toutes les frontières : formulaires, imports, exports, réponses IA, événements analytics.

i18next avec langues en, de, fr, ja, ko, ar, fallback en, RTL obligatoire pour ar.

Billing technique local via react-native-iap, entitlements en MMKV chiffrée, trial local manuel, restore offline-first.

Backup local chiffré manuel, Google Drive manuel optionnel, co-parent transfer local manuel, IA BYOK strictement optionnelle via fetch natif.

Analytics local SQLite, export manuel uniquement, aucun envoi automatique, aucune publicité.

Aucun backend, aucune sync serveur, aucune dépendance SaaS obligatoire, aucune configuration store, aucun pricing.

Score de faisabilité agent IA global : 8.0 sur 10.

Prochaine étape : transmettre ce document au GPT 5, Data Model Designer.

---

## INPUTS REÇUS

- `01-market-research.md` : BabyLog Offline, langues whitelist, positionnement privacy et offline.
- `02-feature-ideas-final.md` : MVP 5 features core, releases locales, aucune publicité, aucun cloud obligatoire.
- `03-monetization-strategy-final.md` : besoin technique d’IAP, trial local, entitlements locaux, restore, aucun backend.
- `04-tech-stack.md` : document technique corrigé et finalisé.
- Contraintes dominantes : Local-First, Expo managed, zéro backend, zéro code natif complexe, compatible agent IA.
- Sujets hors périmètre : pricing, ASO, publicité, configuration stores, disponibilité géographique, tests A/B.

---

## LANGUES ET LOCALISATION

Langues applicatives :

- en
- de
- fr
- ja
- ko
- ar

Langue fallback :

- en

Support RTL :

- ar obligatoire

Fichiers de traduction :

```text
src/lib/i18n/locales/en.json
src/lib/i18n/locales/de.json
src/lib/i18n/locales/fr.json
src/lib/i18n/locales/ja.json
src/lib/i18n/locales/ko.json
src/lib/i18n/locales/ar.json
```

Règles :

- Aucune chaîne dure dans l’interface.
- Fallback permanent sur `en`.
- Détection de langue via `expo-localization`.
- Toute langue non supportée est remplacée par `en`.
- dayjs locales : `en`, `de`, `fr`, `ja`, `ko`, `ar`.
- Formats de nombres localisés via `Intl.NumberFormat` si disponible, avec fallback simple.
- Si des prix sont affichés techniquement par l’IAP, utiliser uniquement la chaîne localisée fournie par le store, jamais de prix codés en dur.
- Aucune langue hors whitelist sans demande explicite.
- Support RTL obligatoire pour `ar`.
- Direction RTL/LTR appliquée au démarrage via helper dédié.
- Tests obligatoires pour fallback i18n et RTL arabe.

---

## MODULES À COUVRIR

- Navigation.
- UI.
- Data locale SQLite.
- Storage clé-valeur MMKV.
- State global Zustand.
- Validation Zod.
- Forms.
- i18n et RTL.
- Billing technique local.
- Trial local technique.
- Analytics local.
- Exports PDF et partage.
- Backup chiffré local.
- Co-Parent Local Transfer manuel.
- Backup Google Drive manuel optionnel.
- IA BYOK optionnelle.
- Notifications locales optionnelles.
- Tests unitaires.
- Build EAS.
- Qualité.

Modules explicitement non couverts :

- Publicité.
- ASO.
- Pricing.
- Configuration App Store.
- Configuration Google Play.
- Tests A/B.
- Disponibilité géographique.
- Stratégie commerciale.
- Acquisition.
- Backend cloud.
- Sync serveur.
- Widgets OS natifs.
- Wearables.
- ML embarqué obligatoire.
- OCR obligatoire.
- Détection audio automatique.
- Diagnostic médical.

---

## DÉCISIONS PAR COUCHE

### Couche : Runtime

Décision : Expo SDK 57 ou supérieur, managed workflow, New Architecture activée si stable, TypeScript strict, `noUncheckedIndexedAccess` activé.

Alternatives rejetées : Expo SDK inférieur à 57, bare React Native non justifié, Expo Go seul pour modules natifs.

Justification : stabilité, compatibilité Expo managed, config plugins, maintenance simple, compatibilité agent IA.

Risque résiduel : modules natifs comme MMKV ou IAP nécessitent un development build.

Mitigation : EAS Build development, preview et production ; plugins testés avant MVP.

---

### Couche : Navigation

Décision : Expo Router avec routing par fichiers.

Alternatives rejetées : React Navigation configuré manuellement sans justification, navigation native custom.

Justification : routes prévisibles, écrans fins, faible logique dans les écrans, meilleure lisibilité pour agent IA.

Risque résiduel : routes dynamiques mal organisées.

Mitigation : conventions strictes dans `src/app`, écrans de feature importés depuis `src/features`.

---

### Couche : Styling

Décision : NativeWind v4 uniquement.

Alternatives rejetées : StyleSheet dispersé, styled-components, Tamagui non demandé, Tailwind CSS web runtime.

Justification : un seul paradigme de style, productivité agent IA, pas de mélange web/mobile.

Risque résiduel : edge cases de classes ou tokens mal maîtrisés.

Mitigation : design system minimal, tokens contrôlés, composants UI validés.

Note : si NativeWind exige un outil de compilation Tailwind en devDependency, cet outil est uniquement build-time. Aucune UI web Tailwind n’est utilisée.

---

### Couche : Composants UI

Décision : design system maison minimal dans `components/ui`.

Alternatives rejetées : Gluestack ou Tamagui sauf exigence explicite compatible, non présente ici.

Justification : wrappers fins des primitives React Native, API simple, zéro magie externe.

Composants minimaux :

- Button
- Input
- Card
- Modal
- Toast
- Text
- Pressable
- ScreenContainer

Risque résiduel : cohérence UI à maintenir.

Mitigation : composants limités, testés, documentés, utilisés partout.

---

### Couche : State global

Décision : Zustand avec persistance sélective via adaptateur MMKV.

Alternatives rejetées : Redux Toolkit, MobX, Context API global pour état persistant.

Justification : simple, testable, persist maîtrisé, compatible agent IA.

Risque résiduel : persistance accidentelle d’état transitoire.

Mitigation : whitelist explicite des clés persistées, stores par domaine.

---

### Couche : Base de données

Décision : expo-sqlite avec SQL brut dans repositories typés.

Alternatives rejetées : WatermelonDB, Realm, base cloud, ORM lourd non justifié, SQLCipher global imposé.

Justification : local-first, performance, contrôle du schéma, compatibilité Expo.

Risque résiduel : SQL mal optimisé ou requêtes non sécurisées.

Mitigation : repositories typés, migrations, index, WAL, foreign keys, tests.

Note : la base SQLite n’est pas chiffrée globalement afin de rester dans Expo managed sans dépendance native complexe. Les exports, backups et secrets sont chiffrés. La protection repose aussi sur le sandboxing OS.

---

### Couche : Storage clé-valeur

Décision : react-native-mmkv avec instance standard et instance chiffrée.

Alternatives rejetées : AsyncStorage pour données critiques, SecureStore seul pour toutes données.

Justification : rapide, persistant, adapté aux préférences et aux secrets avec instance chiffrée.

Risque résiduel : mauvaise clé de chiffrement ou stockage de secret dans instance standard.

Mitigation : clé MMKV chiffrée stockée dans `expo-secure-store`, namespaces stricts.

---

### Couche : Validation

Décision : Zod obligatoire à toutes les frontières.

Alternatives rejetées : Yup, Joi, validation manuelle dispersée.

Justification : TypeScript-first, schémas partagés, validation runtime robuste.

Risque résiduel : schémas à maintenir.

Mitigation : schémas colocés avec models ou services, tests unitaires.

---

### Couche : Forms

Décision : react-hook-form avec resolver Zod.

Alternatives rejetées : Formik, formulaires entièrement contrôlés manuels.

Justification : performance, validation centralisée, faible complexité.

Risque résiduel : formulaires imbriqués complexes.

Mitigation : composants de formulaire isolés, hooks simples.

---

### Couche : IDs

Décision : `expo-crypto` randomUUID.

Alternatives rejetées : Math.random, Date.now, UUID JS non natif non justifié.

Justification : UUIDv4 fiable, API Expo, pas de collision acceptable.

Risque résiduel : aucun majeur.

Mitigation : utilisation systématique dans repositories.

---

### Couche : Dates

Décision : dayjs avec seulement les locales nécessaires.

Alternatives rejetées : moment, date-fns sans justification majeure.

Justification : léger, localisation suffisante, stockage epoch ms.

Risque résiduel : conversions timezone incorrectes.

Mitigation : stockage en epoch ms UTC, affichage localisé seulement via dayjs.

---

### Couche : i18n

Décision : expo-localization plus i18next.

Alternatives rejetées : expo-localization seul, react-intl non optimal pour RN.

Justification : fallback, RTL, ressources JSON, compatibilité Expo.

Risque résiduel : changement RTL nécessitant re-render complet.

Mitigation : helper au boot, tests RTL, fallback en.

---

### Couche : Notifications

Décision : expo-notifications, notifications locales uniquement.

Alternatives rejetées : OneSignal, push serveur, token push obligatoire.

Justification : compatible Expo, pas de backend, usage optionnel.

Risque résiduel : permission demandée trop tôt.

Mitigation : demande seulement si l’utilisateur active un rappel.

---

### Couche : Fichiers

Décision : expo-file-system, expo-sharing, expo-print si export PDF requis, expo-document-picker pour import backup manuel.

Alternatives rejetées : react-native-fs, accès storage complet non justifié, import automatique.

Justification : APIs Expo stables, flux manuels, local-first.

Risque résiduel : différences OS sur partage de fichiers.

Mitigation : share sheet natif, sandbox, messages d’erreur clairs.

---

### Couche : Média

Décision : aucun module média obligatoire au MVP.

Alternatives rejetées : expo-camera, expo-image-picker sans feature MVP active.

Justification : permissions minimales, pas de feature photo requise dans le MVP.

Risque résiduel : besoin futur de photo simple.

Mitigation : si requis plus tard, expo-image-picker uniquement, action explicite, stockage local, aucun diagnostic.

---

### Couche : Géolocalisation

Décision : non requis.

Alternatives rejetées : expo-location sans feature MVP.

Justification : aucune feature MVP ne nécessite la position.

Risque résiduel : aucun.

Mitigation : ne pas ajouter sans feature explicite.

---

### Couche : Capteurs

Décision : non requis.

Alternatives rejetées : expo-sensors sans feature MVP.

Justification : aucune feature MVP ne nécessite capteurs.

Risque résiduel : aucun.

Mitigation : ne pas ajouter sans feature explicite.

---

### Couche : Listes

Décision : FlatList par défaut.

Alternatives rejetées : FlashList par défaut, ScrollView pour listes.

Justification : MVP listes courtes, simplicité, stabilité.

Risque résiduel : listes longues futures.

Mitigation : pagination ; ajout de FlashList seulement si plus de 200 items ou benchmark démontré.

---

### Couche : IA BYOK

Décision : fetch natif unifié, aucun SDK fournisseur.

Providers possibles :

- openai
- gemini
- deepseek
- openrouter

Alternatives rejetées : SDK OpenAI, SDK Gemini, llama.cpp natif, binding C++.

Justification : optionnel, local-first, aucune dépendance obligatoire, compatibilité Expo.

Risque résiduel : variabilité des providers et erreurs réseau.

Mitigation : fallback gracieux, Zod sur réponses, quota local, rate limiting client.

Mode offline LLM : hors MVP ; V2 seulement via transformers.js pur JS, jamais llama.cpp natif.

---

### Couche : Backup

Décision : backup local chiffré manuel ; Google Drive manuel optionnel.

Alternatives rejetées : backup automatique, sync automatique, backup clair, scope Drive large.

Justification : privacy, action utilisateur explicite, compatibilité Local-First.

Risque résiduel : complexité import/chiffrement.

Mitigation : format versionné, Zod, HMAC, restauration transactionnelle, rollback.

---

### Couche : Co-Parent Local Transfer

Décision : transfert local manuel via fichier chiffré exporté/importé. QR code éventuel uniquement pour affichage ou instruction, sans scan caméra obligatoire.

Alternatives rejetées : sync P2P Wi-Fi automatique, Bluetooth, serveur intermédiaire, scan caméra obligatoire.

Justification : pas de backend, pas de permission caméra obligatoire, action explicite.

Risque résiduel : UX de transfert entre appareils.

Mitigation : flow guidé, fichier chiffré, validation Zod, confirmation avant restauration.

---

### Couche : Billing technique

Décision : react-native-iap uniquement parce que premium et entitlements sont requis techniquement.

Alternatives rejetées : RevenueCat, serveur de paywall, vérification serveur obligatoire.

Justification : achat intégré local, entitlements locaux, restore offline, pas de backend.

Risque résiduel : sandbox stores et restore.

Mitigation : couche billing isolée, tests preview build, état local prioritaire.

---

### Couche : Analytics local

Décision : table SQLite locale, événements allowlist, export manuel uniquement.

Alternatives rejetées : Firebase Analytics, Mixpanel, Amplitude, tout SaaS analytics.

Justification : offline, privacy, pas de tracking, pas d’envoi automatique.

Risque résiduel : ajout accidentel de données sensibles.

Mitigation : Zod, événements techniques autorisés, pas de payload libre.

---

### Couche : Tests

Décision : Vitest avec tests unitaires ciblés.

Alternatives rejetées : E2E au MVP, snapshots non justifiés, Jest seul si moins optimal pour l’environnement choisi.

Justification : services, repositories, hooks critiques, migrations, entitlements, i18n.

Risque résiduel : environnement RN à configurer.

Mitigation : faux DB injectés, mocks simples, pas de magie.

---

### Couche : Build

Décision : EAS Build uniquement avec profils development, preview, production.

Alternatives rejetées : builds locaux non reproductibles, Fastlane complexe, EAS Submit.

Justification : reproductibilité, compatibilité Expo managed, pas de configuration store.

Risque résiduel : temps de build.

Mitigation : cache dépendances, lockfile, profils standardisés.

---

### Couche : Qualité

Décision : ESLint config Expo, Prettier, zéro warning toléré en CI.

Alternatives rejetées : absence de lint, règles custom non maintenables.

Justification : lisibilité agent IA, dette réduite, cohérence.

Risque résiduel : règles strictes à respecter.

Mitigation : CI bloquante, formatage automatique.

---

## DÉPENDANCES

### Dépendances runtime et build

Package : expo / react-native  
Rôle : runtime applicatif.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : expo-router  
Rôle : navigation par fichiers.  
Config plugin Expo : oui.  
Criticité : MVP.

Package : expo-build-properties  
Rôle : forcer minSdk Android, deployment target iOS, New Architecture.  
Config plugin Expo : oui.  
Criticité : MVP.

### Dépendances UI

Package : nativewind  
Rôle : styling unique React Native.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : tailwindcss  
Rôle : outil de compilation build-time uniquement si requis par NativeWind.  
Config plugin Expo : non requis.  
Criticité : dev MVP.  
Restriction : aucune utilisation web runtime, aucune UI web.

### Dépendances state, storage et data

Package : zustand  
Rôle : state global.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : react-native-mmkv  
Rôle : stockage clé-valeur rapide, instance standard et chiffrée.  
Config plugin Expo : oui.  
Criticité : MVP.

Package : expo-sqlite  
Rôle : base de données locale.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : expo-secure-store  
Rôle : stockage sécurisé de la clé de chiffrement MMKV et flags trial best-effort.  
Config plugin Expo : non requis.  
Criticité : MVP.

### Dépendances validation, forms, IDs, dates, i18n

Package : zod  
Rôle : validation des données à toutes les frontières.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : react-hook-form  
Rôle : formulaires.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : @hookform/resolvers  
Rôle : resolver Zod pour react-hook-form.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : expo-crypto  
Rôle : UUIDv4, random bytes, PKCE, sel de backup, IV.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : dayjs  
Rôle : dates localisées.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : expo-localization  
Rôle : détection langue appareil.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : i18next  
Rôle : runtime de traduction.  
Config plugin Expo : non requis.  
Criticité : MVP.

Package : react-i18next  
Rôle : intégration React pour i18next.  
Config plugin Expo : non requis.  
Criticité : MVP.

### Dépendances billing

Package : react-native-iap  
Rôle : achat intégré technique.  
Config plugin Expo : oui.  
Criticité : MVP requis techniquement si premium activé.

### Dépendances fichiers, exports, imports

Package : expo-file-system  
Rôle : lecture et écriture fichiers locaux.  
Config plugin Expo : non requis.  
Criticité : option Release 1.

Package : expo-sharing  
Rôle : partage natif de fichiers.  
Config plugin Expo : non requis.  
Criticité : option Release 1.

Package : expo-print  
Rôle : export PDF local.  
Config plugin Expo : non requis.  
Criticité : option Release 1.

Package : expo-document-picker  
Rôle : import manuel backup.  
Config plugin Expo : non requis.  
Criticité : option Release 1.

Package : crypto-js  
Rôle : AES-256, PBKDF2, HMAC pour backup chiffré.  
Config plugin Expo : non requis.  
Criticité : option Release 1.

### Dépendances notifications et backup Drive optionnel

Package : expo-notifications  
Rôle : notifications locales.  
Config plugin Expo : oui.  
Criticité : option Release 3.

Package : expo-auth-session  
Rôle : OAuth Google Drive manuel avec PKCE.  
Config plugin Expo : non requis.  
Criticité : option backlog.

Package : expo-web-browser  
Rôle : flow OAuth navigateur sécurisé.  
Config plugin Expo : non requis.  
Criticité : option backlog.

### Dépendances dev et qualité

Package : vitest  
Rôle : tests unitaires.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

Package : @vitest/coverage-v8  
Rôle : couverture de tests.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

Package : @testing-library/react-native  
Rôle : tests composants et hooks.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

Package : typescript  
Rôle : typage strict.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

Package : eslint-config-expo  
Rôle : lint.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

Package : prettier  
Rôle : formatage.  
Config plugin Expo : non requis.  
Criticité : dev MVP.

### Dépendances supprimées ou refusées

- Firebase.
- Supabase.
- RevenueCat.
- SDK publicitaire.
- SDK IA fournisseur.
- moment.
- AsyncStorage pour données critiques.
- lodash global.
- bibliothèque native complexe non justifiée.
- module caméra ou galerie obligatoire au MVP.
- module géolocalisation.
- module capteurs.
- module widgets OS.
- module wearables.
- module OCR obligatoire.
- module ML embarqué obligatoire.

---

## INTERDITS EXPLICITES

- Backend cloud : interdit.
- Base de données cloud : interdite.
- Auth tiers obligatoire : interdite.
- Sync temps réel serveur : interdit.
- API externe nécessaire au fonctionnement de base : interdite.
- Bibliothèque native complexe : interdite.
- Bare workflow non justifié : interdit.
- Firebase : interdit.
- Supabase : interdit.
- RevenueCat : interdit.
- SDK publicitaire : interdit.
- Configuration App Store : interdite.
- Configuration Google Play : interdite.
- Pricing : interdit.
- ASO : interdit.
- Tests A/B : interdits.
- llama.cpp natif : interdit.
- Binding C++ : interdit.
- SDK IA fournisseur : interdit.
- Sync automatique : interdit.
- Backup automatique : interdit.
- Publicité : hors périmètre.
- Disponibilité géographique : hors périmètre.
- Produits store définis dans la stack : interdit.
- EAS Submit : hors périmètre.
- Widgets OS natifs : interdit.
- Wearables : interdit.
- ML embarqué obligatoire : interdit.
- OCR obligatoire : interdit.
- Détection audio automatique : interdit.
- Caméra obligatoire au MVP : interdit.
- Géolocalisation : interdit sauf feature future explicite.
- Capteurs : interdit sauf feature future explicite.
- Sync P2P automatique : interdit.
- Diagnostic médical : interdit.
- Push serveur : interdit.
- Token push obligatoire : interdit.
- Crash reporting obligatoire sans opt-in : interdit.
- Analytics tiers obligatoire : interdit.
- Dark pattern : interdit.
- Paywall au premier lancement : interdit.
- Paywall bloquant sans fermeture visible : interdit.

---

## CONFIGURATION APP TECHNIQUE

Nom technique : BabyLog Offline

Scheme : `babylog`

Slug technique : `babylog-offline`

### SDK

- Expo SDK 57 ou supérieur.
- Managed workflow.
- New Architecture activée si stable et compatible.
- TypeScript strict.
- `noUncheckedIndexedAccess` activé.
- Development build obligatoire pour les modules natifs MMKV et IAP.
- Expo Go non utilisé pour les builds contenant MMKV ou IAP.

### Android

- `minSdkVersion = 33`.
- Android 13 minimum.
- Permissions runtime minimales.
- Pas de permission demandée au premier lancement.

### iOS

- `deploymentTarget = 16.0`.
- Pas de permission demandée au premier lancement.
- Pas d’ATT requis car aucune publicité.

### Permissions et capacités

Permission : aucune permission obligatoire au premier lancement.  
Feature MVP justifiée : F01 tracking, F02 mode nuit, F03 timeline, F04 édition, F05 profil local.  
Moment de demande : jamais au premier lancement.

Permission : notifications locales.  
Feature justifiée : Release 3, rappels optionnels, dream feed.  
Moment de demande : seulement lorsque l’utilisateur active un rappel.

Capacité : accès réseau Internet.  
Feature justifiée : IA BYOK optionnelle, backup Drive manuel, vérification store IAP.  
Moment de demande : jamais au boot, uniquement action explicite.

Permission : import fichier local.  
Feature justifiée : backup, restore manuel, co-parent transfer.  
Moment de demande : seulement lorsque l’utilisateur importe un fichier.

Capacité : partage système.  
Feature justifiée : export PDF, export backup, co-parent transfer.  
Moment de demande : seulement lorsque l’utilisateur exporte.

Capacité : store billing.  
Feature justifiée : achat intégré technique.  
Moment de demande : seulement lorsque l’utilisateur ouvre l’achat ou la restauration.

### Plugins

Plugin : expo-router  
Rôle : routing par fichiers, layouts, navigation.

Plugin : expo-build-properties  
Rôle : forcer minSdk 33, iOS 16, New Architecture.

Plugin : react-native-mmkv  
Rôle : module natif de stockage clé-valeur.

Plugin : react-native-iap  
Rôle : module natif d’achat intégré.

Plugin : expo-notifications  
Rôle : icônes, couleurs et comportement de notifications locales si activé.

### Configuration store

- Aucune configuration App Store dans ce document.
- Aucune configuration Google Play dans ce document.
- Aucune restriction géographique dans ce document.
- Aucun pricing dans ce document.
- Aucun metadata store dans ce document.
- Aucun produit store défini dans ce document.
- EAS Submit hors périmètre.

### Icônes, splash, couleurs

- Placeholder technique tant que le design system final n’est pas fourni.
- Fond sombre par défaut pour cohérence mode nuit OLED.
- Icône provisoire sans branding final.
- Splash minimal sans texte inutile.

---

## ARCHITECTURE DE DOSSIERS

```text
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      timeline.tsx
      settings.tsx
    paywall.tsx
    settings/
      ai.tsx
      backup.tsx
      billing.tsx
  features/
    tracking/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    timeline/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    profile/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    export/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    backup/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    transfer/
      screens/
      hooks/
      services/
      models/
      index.ts
    stats/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    billing/
      screens/
      hooks/
      services/
      repository/
      models/
      index.ts
    ai/
      screens/
      hooks/
      services/
      models/
      index.ts
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      Toast.tsx
      Text.tsx
      Pressable.tsx
      ScreenContainer.tsx
  core/
    database/
      client.ts
      migrations/
      helpers.ts
    storage/
      mmkv.ts
      secureStorage.ts
      zustandAdapter.ts
    billing/
      iapService.ts
      entitlementService.ts
      trialService.ts
    backup/
      backupService.ts
      encryptionService.ts
      driveService.ts
      transferService.ts
    ai/
      aiService.ts
      providers/
    analytics/
      analyticsService.ts
      eventRepository.ts
      eventSchema.ts
    errors/
      ErrorBoundary.tsx
      errorLogger.ts
      errorRepository.ts
  lib/
    i18n/
      index.ts
      rtl.ts
      locales/
        en.json
        de.json
        fr.json
        ja.json
        ko.json
        ar.json
    constants.ts
    config.ts
  utils/
    dates.ts
    numbers.ts
    async.ts
```

### Conventions de code imposées

- Alias d’import unique : `@/` pointe vers `src/`.
- Un écran dans `src/app` est fin et importe uniquement un écran de feature ou un hook.
- Un écran de feature lit un hook et rend du UI.
- Un hook est un viewmodel : état, effets, appels services.
- Un service contient la logique métier pure.
- Un service ne connaît ni React ni SQLite directement.
- Les dépendances des services sont injectées.
- Un écran n’appelle jamais directement un repository.
- Tout SQL vit uniquement dans `repository/` ou `core/database/`.
- Toute donnée entrante passe par Zod : formulaires, backup, IA, imports, événements analytics.
- Les hooks utilisent `try/catch` systématiquement.
- Une `ErrorBoundary` globale est présente à la racine.
- Une table locale `error_log` stocke les erreurs techniques.
- Aucun log de donnée sensible dans `error_log`.
- Les chaînes visibles passent par i18next.
- Les dates sont stockées en epoch ms et affichées via dayjs localisé.
- Les nombres sont formatés via la locale.
- Les features exposent uniquement leur API publique via `index.ts`.
- Pas d’import croisé direct entre features sans passer par l’index public.
- Aucun état global transitoire persisté.
- Aucun appel réseau au boot.
- Aucune permission demandée sans action utilisateur associée.

### Nommage obligatoire

- `useXxx` pour les hooks.
- `xxxService` pour les services.
- `xxxRepository` pour les repositories.
- `XxxScreen` pour les écrans.
- `xxx.schema.ts` pour les schémas Zod.

---

## COUCHE DONNÉES

### Initialisation expo-sqlite

- Base unique : `babylog.db`.
- Ouverture singleton dans `core/database/client.ts`.
- WAL activé si disponible.
- Foreign keys activées.
- Busy timeout prudent pour éviter les blocages courts.

Commandes d’initialisation :

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
```

### Système de migrations

Table de version :

```sql
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at INTEGER NOT NULL
);
```

Table d’erreurs techniques :

```sql
CREATE TABLE IF NOT EXISTS error_log (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  code TEXT,
  stack TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

Règles de migration :

- Fichiers de migration numérotés dans `core/database/migrations/`.
- Fonction `migrate()` idempotente au boot.
- Chaque migration s’exécute dans une transaction.
- Rollback manuel via nouvelle migration corrective.
- Jamais de mutation sauvage de schéma en production.
- Les migrations sont testées unitairement.

### Conventions de schéma transmises au GPT 5

- Tables en snake_case singulier.
- Colonnes en snake_case.
- IDs en `TEXT` UUIDv4.
- Dates en `INTEGER` epoch millisecondes.
- Booléens en `INTEGER` 0 ou 1.
- `created_at` obligatoire sur toute table.
- `updated_at` obligatoire sur toute table.
- Index sur toute colonne de jointure.
- Index sur toute colonne de tri ou filtre fréquent.
- Toute table exposée via repository typé.
- SQL interdit hors repository.
- Schémas Zod miroirs des types TypeScript pour imports et backup.
- Si suppression avec undo est nécessaire, prévoir `deleted_at INTEGER NULL` et filtrer les requêtes actives.

### MMKV

Instance standard :

- `settings:`
- `ui:`
- `trial:`
- `analytics:`
- `backup:`

Instance chiffrée :

- `secrets:`
- `billing:`
- `ai:`

Règles MMKV :

- La clé de chiffrement de l’instance chiffrée est générée aléatoirement via `expo-crypto`.
- La clé est conservée dans `expo-secure-store`.
- Aucune clé API ou entitlement en clair dans MMKV standard.
- Aucun secret loggé.
- Les namespaces sont préfixés par domaine.
- Les entitlements sont stockés dans l’instance chiffrée.
- Le trial est stocké dans l’instance standard avec flags anti-réinitialisation.
- Les flags trial sécurisés best-effort peuvent être stockés via SecureStore.

### Zustand

Stores prévus :

- `useSettingsStore` : langue, mode nuit, préférences locales.
- `useEntitlementsStore` : statut premium, lifetime, trial, offline grace.
- `usePaywallStore` : état UI non persisté.

Règles :

- Un store par domaine global.
- Persist sélectif via adaptateur MMKV.
- Jamais d’état transitoire persisté.
- Les entitlements sont relus depuis le stockage chiffré au démarrage.

---

## SERVICES TRANSVERSES

### IA unifié BYOK

Statut : optionnel, hors fonctionnement de base.

Providers possibles :

- openai
- gemini
- deepseek
- openrouter

Règles :

- Aucun provider configuré par défaut.
- Écran settings obligatoire pour saisir les clés.
- Clés stockées uniquement dans MMKV chiffrée.
- Clés jamais loggées.
- Clés jamais envoyées ailleurs qu’au provider choisi.
- Appels via fetch natif uniquement.
- Aucun SDK fournisseur.
- Réponses validées par Zod.
- Fallback gracieux si clé absente ou erreur :
  - message actionnable ;
  - pas de crash ;
  - continuation manuelle possible.
- Rate limiting client simple par provider.
- Quota local si mode free : 5 actions IA par jour par défaut.
- Pas de quota applicatif si entitlement premium, sous réserve des limites du provider externe.
- Aucune feature core ne dépend de l’IA.
- Les réponses IA ne sont pas persistées par défaut.
- Si une future feature persiste une réponse IA, le stockage doit être local, validé par Zod et sans donnée sensible inutile.
- Aucune sortie IA ne doit être présentée comme diagnostic médical.
- Mode offline LLM hors MVP.
- V2 uniquement via transformers.js pur JS.
- Jamais llama.cpp natif.
- Jamais binding C++.

Interface minimale :

```ts
type AiProvider = 'openai' | 'gemini' | 'deepseek' | 'openrouter';

interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AiChatOptions {
  provider: AiProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

### Backup chiffré local

Statut : backup local chiffré requis techniquement pour Release 1.

Export local :

- Export JSON complet des données SQLite nécessaires.
- Export des settings non sensibles.
- Schéma Zod de version de backup obligatoire.
- Format de backup versionné.
- Extension de fichier recommandée : `.babylog`.
- Chiffrement AES-256.
- Mode CBC avec IV aléatoire 16 octets.
- PBKDF2-SHA256.
- Sel aléatoire 16 octets généré via `expo-crypto`.
- Itérations PBKDF2 : 210000.
- Méthode utilisateur :
  - PIN 6 chiffres ;
  - mot de passe.
- HMAC-SHA256 pour intégrité.
- Aucun fichier clair partagé ou uploadé.
- Backup manuel uniquement.
- Aucune synchronisation automatique.

Import :

- Sélection manuelle du fichier via `expo-document-picker`.
- Validation Zod stricte avant écriture.
- Vérification du HMAC avant déchiffrement et utilisation.
- Demande du PIN ou mot de passe.
- Restauration transactionnelle SQLite.
- Rollback automatique en cas d’échec.
- Aucun écrasement silencieux sans confirmation.
- Si backup restauré, restaurer aussi le statut de trial et les entitlements locaux lorsque applicable.

### Backup Google Drive manuel optionnel

Statut : backlog.

Règles :

- OAuth via `expo-auth-session` avec PKCE.
- Utilisation de `expo-crypto` pour PKCE.
- Scope limité à `drive.file`.
- Appels REST Google Drive en fetch direct.
- Dossier applicatif uniquement.
- Upload manuel uniquement.
- Download manuel uniquement.
- Jamais de sync automatique.
- Le fichier est chiffré avant upload.

### Co-Parent Local Transfer

Statut : Release 2.

Règles :

- Transfert manuel uniquement.
- Aucun serveur.
- Aucun P2P automatique.
- Aucun Bluetooth obligatoire.
- Aucune permission caméra obligatoire.
- Utilisation du même format chiffré que le backup.
- Export manuel vers fichier chiffré.
- Import manuel sur l’appareil du second parent.
- QR code éventuel uniquement pour afficher une instruction ou un petit payload non sensible.
- Validation Zod avant import.
- Confirmation explicite avant fusion ou remplacement.

### Billing technique

Statut : requis techniquement car premium, entitlements et trial local sont requis par les inputs.

Règles générales :

- Utilisation de `react-native-iap`.
- Aucun serveur de paywall.
- Aucun serveur de vérification obligatoire.
- Aucun pricing défini dans ce document.
- Aucun produit store défini dans ce document.
- Les identifiants de produits seront fournis hors stack technique.
- Restore purchases obligatoire.
- Entitlements stockés localement en MMKV chiffrée.
- Offline-first : l’état premium est d’abord lu localement.
- Vérification store seulement sur action utilisateur : achat, restore, ouverture paywall.
- Aucun achat au premier lancement.
- Aucun paywall bloquant sans fermeture visible.
- Paywall local React Native.
- Fermeture facile.
- Restore visible.
- Prix affichés depuis les stores, jamais codés en dur.
- Conditions abonnement affichées lorsque applicable.
- Lifetime affiché comme achat unique.
- Pas de dark pattern.
- Pas de countdown artificiel.
- Pas de fausse urgence.
- Pas de preuve sociale inventée.

Entitlements locaux :

```ts
interface EntitlementState {
  isPremium: boolean;
  hasLifetime: boolean;
  subscriptionExpiresAt: number | null;
  lastStoreCheckAt: number | null;
  offlineGraceFlag: boolean;
  purchaseSource: 'app_store' | 'google_play' | null;
}
```

### Trial local technique

Statut : requis techniquement.

```ts
interface TrialState {
  trialState: 'not_started' | 'active' | 'expired' | 'already_used';
  trialStartedAt: number | null;
  trialEndsAt: number | null;
  trialClaimedLocal: boolean;
  trialClaimedSecure: boolean;
}
```

Règles trial :

- Trial activé manuellement uniquement.
- Aucun démarrage automatique.
- Aucun paiement requis.
- Aucune carte requise.
- Aucun renouvellement automatique.
- Timer local basé sur timestamps.
- Stockage local MMKV.
- Flag local anti-réinitialisation naïve.
- Flag sécurisé best-effort via stockage OS si disponible.
- Aucun fingerprinting.
- Aucun tracking serveur.
- Si entitlement premium ou lifetime actif, il prime toujours sur le trial.
- Si backup local restauré, restaurer aussi le statut du trial.
- À la fin du trial, bascule vers free minimal.
- Pas de blocage de l’action cœur.
- Tracking core jamais limité en nombre d’événements.

### Gate technique

Hooks :

- `useEntitlements`
- `usePremiumGate(action: PremiumAction)`

Règles :

- Les features premium sont contrôlées côté UI via hooks.
- La logique de gate est locale.
- Pas de dépendance réseau pour autoriser une feature déjà débloquée.
- Free minimal après trial :
  - 1 profil actif ;
  - timeline limitée aux dernières 24h ;
  - pas d’export PDF ;
  - pas de backup chiffré ;
  - pas de co-parent transfer ;
  - pas de stats longues ;
  - pas de prédictions ;
  - pas de notifications premium.
- Emergency Doctor Mode gratuit sur les dernières 24h.
- Suppression des données gratuite.
- Premium/lifetime prime toujours sur le trial.

### Analytics local

Statut : requis techniquement pour instrumentation locale.

Table SQLite :

```sql
CREATE TABLE event (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  properties TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

API :

```ts
track(name: AnalyticsEventName, properties?: AnalyticsEventProperties): void;
```

Règles :

- API non bloquante.
- Stockage local uniquement.
- Aucun envoi automatique.
- Export manuel JSON ou CSV optionnel.
- Pas de donnée personnelle directe.
- Pas d’IDFA ou GAID.
- Pas de tracking publicitaire.
- Pas de segmentation commerciale.
- Pas de tests A/B.
- Pas d’optimisation de conversion.
- Événements validés par Zod.
- Propriétés typées et allowlistées.
- Pas de payload libre.

Événements techniques et fonctionnels autorisés :

- `app_installed`
- `onboarding_completed`
- `first_profile_created`
- `trial_offer_shown`
- `trial_started`
- `trial_completed`
- `premium_feature_attempted`
- `history_limit_reached`
- `second_profile_attempted`
- `paywall_shown`
- `paywall_closed`
- `purchase_completed`
- `restore_completed`
- `pdf_export_attempted`
- `backup_export_attempted`
- `backup_exported`
- `backup_imported`
- `co_parent_transfer_attempted`
- `error_logged`

### Publicité

Publicité : hors périmètre.

- Aucun SDK publicitaire.
- Aucun wrapper ads.
- Aucune règle de fréquence.
- Aucun cap.
- Aucun identifiant publicitaire.
- Aucune configuration ATT pour publicité.
- Aucune recommandation publicitaire.

---

## SÉCURITÉ

Checklist :

- Clés API en MMKV chiffrée : OUI.
- Entitlements en MMKV chiffrée : OUI.
- Backup chiffré avant export ou upload : OUI.
- PBKDF2 documenté : sel 16 octets, PBKDF2-SHA256, 210000 itérations.
- AES documenté : AES-256 CBC avec IV aléatoire, HMAC-SHA256.
- Aucune donnée envoyée sans action explicite : OUI.
- Permissions demandées au besoin : OUI.
- Justification UI présente : OUI.
- Pas de logs sensibles : OUI.
- `error_log` sans payload utilisateur : OUI.
- Privacy policy technique : OUI.
- Aucun tracking publicitaire : OUI.
- Aucun analytics tiers obligatoire : OUI.
- Aucun crash reporting obligatoire sans opt-in : OUI.

Tiers contactés possibles :

- Provider IA choisi si activé par l’utilisateur.
- Google Drive si backup manuel activé par l’utilisateur.
- Store si achat intégré activé par l’utilisateur.

Jamais de tiers publicitaire.

---

## BUDGETS DE PERFORMANCE

Budget : cold start.  
Cible : inférieur à 2 secondes sur appareil milieu de gamme.  
Méthode de vérification : profilage EAS, logs de timing au boot, tests manuels.

Budget : requêtes DB écrans liste.  
Cible : inférieur à 16 ms.  
Méthode de vérification : benchmark repository, EXPLAIN QUERY PLAN, index.

Budget : listes.  
Cible : 60 fps.  
Méthode de vérification : React Native performance monitor, tests manuels et automatisés.

Budget : taille app.  
Cible : inférieur à 60 MB hors assets média.  
Méthode de vérification : analyse artifact EAS, audit dépendances.

Budget : réseau au boot.  
Cible : 0 appel réseau.  
Méthode de vérification : test avec réseau désactivé, proxy, revue des hooks de boot.

Budget : écriture tracking.  
Cible : inférieur à 16 ms.  
Méthode de vérification : tests SQLite sur repository.

Budget : chargement timeline jour.  
Cible : instantané perçu.  
Méthode de vérification : index sur dates, type d’événement et profil.

Budget : statistiques locales.  
Cible : agrégats SQLite inférieurs à 16 ms pour périodes courtes, requêtes long terme optimisées.  
Méthode de vérification : index, agrégats, pagination, EXPLAIN QUERY PLAN.

---

## QUALITÉ ET TESTS

### TypeScript

- strict activé.
- `noUncheckedIndexedAccess` activé.
- types partagés dans models.
- pas de `any` non justifié.

### Lint et formatage

- ESLint config Expo.
- Prettier.
- Zéro warning toléré en CI.
- Formatage automatique.

### Tests

- Vitest obligatoire.
- Tests unitaires pour :
  - services ;
  - repositories ;
  - hooks critiques ;
  - migrations ;
  - quota IA si activé ;
  - entitlements ;
  - trial local ;
  - i18n fallback ;
  - RTL si nécessaire ;
  - backup import validation ;
  - backup export validation ;
  - analytics event validation ;
  - error logger sans données sensibles.
- Faux DB injectés dans les tests repositories.
- Pas de E2E au MVP.
- Pas de snapshot au MVP sauf justification explicite.

### Couverture cible

- 80 pourcent sur services.
- 80 pourcent sur repositories.

### Conventions de test

- Un fichier par module testé.
- Noms explicites.
- Mocks minimaux.
- Pas de magie.
- Tests déterministes.

---

## FAISABILITÉ AGENT IA PAR MODULE

Module : Navigation.  
Score : 10 sur 10.  
Risque principal : aucun risque majeur.  
Mitigation : Expo Router avec routes simples et conventions strictes.

Module : UI.  
Score : 9 sur 10.  
Risque principal : cohérence des composants.  
Mitigation : design system minimal, wrappers React Native, composants testés.

Module : Data.  
Score : 9 sur 10.  
Risque principal : SQL brut mal optimisé.  
Mitigation : repositories typés, index, migrations, WAL, tests.

Module : IA BYOK.  
Score : 8 sur 10.  
Risque principal : variabilité des providers.  
Mitigation : service unifié, fetch natif, Zod, fallback gracieux.

Module : Backup.  
Score : 8 sur 10.  
Risque principal : chiffrement et import complexe.  
Mitigation : format versionné, Zod, HMAC, restauration transactionnelle.

Module : Billing technique.  
Score : 7 sur 10.  
Risque principal : sandbox stores et restore.  
Mitigation : couche isolée, entitlements locaux, preview builds.

Module : Analytics local.  
Score : 9 sur 10.  
Risque principal : ajout accidentel de données sensibles.  
Mitigation : allowlist événements, Zod, pas de payload libre.

Module : i18n.  
Score : 9 sur 10.  
Risque principal : RTL arabe.  
Mitigation : helper RTL au boot, fallback en, tests.

Module : Exports.  
Score : 8 sur 10.  
Risque principal : différences OS sur partage.  
Mitigation : expo-sharing, PDF local, sandbox.

Score global : 8.0 sur 10.

Pondération : Data et IA poids 2, autres modules poids 1.

Aucun module sous 6. Aucune simplification forcée nécessaire.

---

## PASSATION AU GPT 5 — CONVENTIONS DB OBLIGATOIRES

### Moteur

- `expo-sqlite`.

### Migrations

- Table `schema_version`.
- Colonnes `version INTEGER` et `applied_at INTEGER`.
- Fonction `migrate()` idempotente au boot.
- Migrations numérotées.
- Migrations transactionnelles.
- Rollback uniquement via migration corrective.

### Nommage

- Tables en snake_case singulier.
- Colonnes en snake_case.
- Exemples : `baby_profile`, `log_event`.

### IDs

- `TEXT` UUIDv4.
- Génération via `expo-crypto.randomUUID()`.
- Pas d’ID numérique auto-incrémenté sans justification majeure.
- Pas de Math.random.
- Pas de Date.now comme ID.

### Dates

- `INTEGER` epoch millisecondes.
- Stockage UTC.
- Affichage localisé uniquement via dayjs.

### Booléens

- `INTEGER` 0 ou 1.
- Pas de booléen en string.

### Colonnes obligatoires

- `created_at INTEGER NOT NULL`.
- `updated_at INTEGER NOT NULL`.

### Colonnes optionnelles recommandées

- `deleted_at INTEGER NULL` si soft delete ou undo est nécessaire.
- Toute requête active doit filtrer les enregistrements supprimés logiquement.

### Index obligatoires

- Index sur toute colonne de jointure.
- Index sur toute colonne de tri fréquent.
- Index sur toute colonne de filtre fréquent.
- Exemples : dates, profil, type d’événement.

### Accès données

- Toute table exposée via un repository typé.
- SQL interdit hors `repository/` et `core/database/`.
- Les repositories retournent des types TypeScript validés.
- Les écritures passent par Zod ou schéma équivalent.
- Les lectures critiques peuvent être validées par Zod si données importées ou restaurées.

### Backup

- Schémas Zod miroirs des types TypeScript pour imports backup.
- Toute donnée importée doit être validée avant insertion.
- La restauration doit être transactionnelle.
- Rollback automatique en cas d’échec.
- Aucun écrasement silencieux.

### Domaines de données attendus

Le GPT 5 doit concevoir le modèle de données local en respectant les conventions ci-dessus pour couvrir au minimum :

- Profil bébé.
- Événements de tracking.
- Détails d’événements : tétée, sommeil, couche, note.
- Timer actif et reprise locale.
- Export PDF et logs d’export.
- Backup metadata.
- Co-parent transfer metadata.
- Statistiques agrégées ou calcul local.
- Analytics local event.
- Error log local.

Entités possibles à modéliser :

- `baby_profile`
- `log_event`
- `feeding_detail`
- `sleep_detail`
- `diaper_detail`
- `note_event`
- `timer_state`
- `export_log`
- `backup_metadata`
- `event`
- `error_log`

Règles fonctionnelles importantes pour le modèle :

- Le tracking core ne doit jamais être limité en nombre d’enregistrements.
- La timeline doit pouvoir filtrer les dernières 24h gratuitement.
- L’historique complet est premium.
- Les statistiques doivent supporter 1j, 7j, 30j, 90j, 180j, 365j via agrégats locaux.
- Les prédictions locales doivent être calculées uniquement à partir des logs locaux.
- Aucun capteur, aucune caméra, aucun micro, aucun ML embarqué obligatoire.
- Le modèle doit supporter multi-profils, mais l’accès free est limité à 1 profil actif.
- Les données supprimées avec undo doivent pouvoir être récupérées temporairement si `deleted_at` est utilisé.

---

## FIN DU FICHIER

Ce fichier est la version finale corrigée de `04-tech-stack.md`.

Il doit être transmis au GPT 5, Data Model Designer.