# 04-addendum-01.md — Déviations approuvées au doc 04 (tech stack)

Date : 2026-09-18
Statut : approuvé (décisions D-024 et D-028, journalisées dans `.planning/PROJECT.md` Key Decisions)
Portée : compléter `04-tech-stack.md`. En cas de divergence, le présent addendum prime sur le doc 04.

## 1. Chiffrement : react-native-quick-crypto remplace crypto-js

- **Décision (D-024)** : la bibliothèque de chiffrement est `react-native-quick-crypto`.
- **Motif** : crypto-js est officiellement discontinu (plus maintenu) et son PBKDF2 en JS pur gèle le thread JavaScript pendant plusieurs secondes sur téléphone bas de gamme — incompatible avec le budget backup < 2 s.
- **Conséquences** :
  - AES-256-CBC, PBKDF2 et HMAC s'exécutent en natif.
  - Un dev build (EAS) est requis dès la Phase 1 (même contrainte que MMKV) — Expo Go ne charge pas le module.
  - crypto-js est interdit dans les dépendances.

## 2. Billing : expo-iap remplace react-native-iap

- **Décision (D-024)** : la bibliothèque IAP est `expo-iap`.
- **Motif** : react-native-iap est archivé (déplacé vers le monorepo OpenIAP) et épingle Nitro `^0.36.5` — risque de singleton de module natif en cohabitation avec MMKV.
- **Conséquences** :
  - expo-iap repose sur le même cœur OpenIAP (StoreKit 2 / Play Billing 8.x) mais s'intègre comme module Expo sans pin Nitro.
  - Le `iapService` reste un port étroit et remplaçable (cf. recherche ARCHITECTURE.md).
  - Les specifics du cycle de vie d'abonnement (grace period, renewals) se vérifient dans la docs OpenIAP au démarrage de la Phase 5.

## 3. KDF backup : PBKDF2-HMAC-SHA256 à 600 000 itérations

- **Décision (D-028)** : le paramétrage PBKDF2 du backup chiffré passe de 210 000 itérations (doc 04) à **600 000 itérations** — plancher OWASP courant.
- **Détails** :
  - Sel aléatoire par fichier de backup (jamais réutilisé).
  - Les paramètres KDF (itérations, sel, algorithme) sont stockés en en-tête du fichier backup pour permettre la montée de version sans casser la restauration.
  - Le coût natif rend les 600k négligeables ; le benchmark sur appareil bas de gamme (Phase 6) valide le budget < 2 s **sans jamais abaisser le nombre d'itérations**.
