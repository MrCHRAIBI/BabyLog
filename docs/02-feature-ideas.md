Voici le livrable final expurgé : conformément à votre demande, **aucune feature rejetée n'apparaît dans ce document** (la liste détaillée des rejets reste archivée dans mon audit de travail et n'entre pas dans le périmètre de développement). Le document intègre également les corrections issues de l'audit du mockup (F06 reformulé, F15 réécrit avec le sélecteur 1j→365j).

---

# FEATURES FINALES — BabyLog Offline

## 1. VERDICT GLOBAL
- **Qualité du document source :** moyenne
- **Nombre d'idées reçues :** 68 (idées brutes, doublons massifs entre les 4 tableaux)
- **Nombre d'idées retenues :** 34 (dont 2 principes transversaux intégrés au MVP)
- **Nombre d'idées rejetées :** 34 (comptabilisées mais non listées dans ce livrable, sur demande explicite)
- **Conformité Local-First :** bonne
- **Décision :** correction directe
- **Résumé des erreurs principales :**
  - Redondance massive entre les 4 tableaux du document source ;
  - Features non conformes mélangées aux features actives ;
  - Features gadget et features à risque médical non verrouillées ;
  - Features nativement complexes (widgets OS, wearables) non identifiées comme bloquantes ;
  - Sélecteur de période des statistiques trop court (24 h / 7 j / 30 j) : corrigé via la réécriture de F15 (1j / 7j / 30j / 90j / 180j / 365j) ;
  - Score marché GPT 1 : 82.8/100 — conforme, aucun risque signalé.

## 2. ERREURS DÉTECTÉES
| Erreur | Impact | Correction appliquée |
|---|---|---|
| Redondance massive entre 4 tableaux | Confusion, doublons en production | Déduplication systématique, fusion en 34 idées uniques |
| Features non conformes mélangées aux features actives | Risque de réintroduction accidentelle | Séparation stricte ; périmètre développé = MVP + Releases + Backlog uniquement |
| « Analyse » des selles / diagnostic médical formulés comme features | Risque réglementaire médical | Exclus du périmètre ; seule la photo simple attachée à l'événement couche est conservée (F32 réécrit) |
| Widgets OS / wearables non flaggés comme natifs complexes | Développement Swift/Kotlin hors périmètre agent IA RN | Exclus du périmètre |
| Détection audio automatique du sommeil | Micro permanent, batterie, privacy | Exclus du périmètre |
| Mentions d'espaces publicitaires | Contradiction avec le rejet total des publicités | Exclus du périmètre |
| Libellé mockup « Détection automatique des signes de fatigue » | Suggère capteurs / caméra / micro | Reformulé : estimation fondée uniquement sur l'historique local des logs (F06) |
| Sélecteur stats limité à 24 h / 7 j / 30 j | Lecture long terme insuffisante sur un cycle de vie produit de 18-24 mois | F15 réécrit : 6 périodes (1j/7j/30j/90j/180j/365j) avec granularité adaptative |

## 3. AUDIT DES IDÉES RETENUES

| ID | Nom | Catégorie source | Conformité | Valeur utilisateur | Faisabilité | Décision | Version cible | Note |
|---|---|---|---|---|---|---|---|---|
| F01 | Tracking 1-tap avec Timer et reprise locale | Core tracking | Conforme | Critique | Élevée | KEEP | MVP | Fusion 1-tap / timer / reprise via timestamp |
| F02 | Mode Nuit OLED configurable | Core UX | Conforme | Critique | Élevée | KEEP | MVP | Fusion Quiet Night Tracking / OLED / Auto-Manuel-Toujours |
| F03 | Timeline du jour + Résumé quotidien | Core visualisation | Conforme | Critique | Élevée | KEEP | MVP | Fusion Elegant Timeline & Daily Summary |
| F04 | Édition, suppression et annulation | Core édition | Conforme | Critique | Élevée | KEEP | MVP | Confirmation claire + Undo |
| F05 | Profil bébé minimal + Stockage local sécurisé | Infrastructure | Conforme | Critique | Élevée | KEEP | MVP | Fusion Zero-Cloud Privacy Vault / 100 % offline / zéro compte |
| F06 | Cry Predictor / Estimation locale de fenêtre de sommeil | Analyse locale | Conforme | Élevée | Moyenne | KEEP (reformulé) | Release 3 | Moyennes mobiles sur logs uniquement ; aucun capteur, aucun ML embarqué |
| F07 | Export PDF pédiatre (7/14 jours) | Export | Conforme | Élevée | Moyenne | KEEP | Release 1 | Génération locale, partage natif |
| F08 | Emergency Doctor Mode (rapport 24-48 h) | Export urgence | Conforme | Élevée | Élevée | KEEP | Release 1 | Compilation rapide pour professionnel de santé |
| F09 | Backup / Restore manuel chiffré | Sécurité données | Conforme | Élevée | Moyenne | KEEP | Release 1 | Chiffrement JS simple ; pas de SQLCipher global |
| F10 | Co-Parent Local Transfer | Partage local | Conforme | Élevée | Moyenne | KEEP | Release 2 | Fichier chiffré ou QR code, sans serveur |
| F11 | Notifications locales optionnelles | Rappels | Conforme | Moyenne | Élevée | KEEP | Release 3 | Fusionnée avec F12 |
| F12 | Alarme « Dream Feed » | Rappel spécifique | Conforme | Moyenne | Élevée | KEEP | Release 3 | Fusionnée avec F11 |
| F13 | Suivi Allaitement (côté, durée, pompage) | Tracking avancé | Conforme | Élevée | Élevée | KEEP | Release 2 | Fusion « Boob Brain » Side Tracker |
| F14 | Écran « Passation de Relais » | Co-parenting | Conforme | Élevée | Élevée | KEEP | Release 2 | Résumé de transition entre parents |
| F15 | Statistiques & tendances multi-périodes (1j/7j/30j/90j/180j/365j) | Analyse locale | Conforme | Moyenne-Élevée | Moyenne | REWRITE | Release 3 | Demande utilisateur intégrée ; granularité adaptative ; agrégats SQLite |
| F16 | Protocole Allergènes / Suivi Diversification | Suivi alimentaire | Conforme | Moyenne | Élevée | KEEP | Release 4 | Règle des 3 jours + alertes locales |
| F17 | Médicaments & Vitamines | Suivi médical | Conforme | Moyenne | Élevée | KEEP | Release 4 | Checklist locale + rappels locaux |
| F18 | Multi-baby / Jumeaux | Multi-profils | Conforme | Moyenne | Moyenne | KEEP | Release 4 | Profils séparés, vue individuelle et combinée |
| F19 | Sound Machine Offline (bruits blancs) | Confort | Conforme | Faible-Moyenne | Élevée | KEEP | BACKLOG | Sons naturels + minuteur ; distinct des berceuses exclues |
| F20 | Mode Zen / Veilleuse | UX secondaire | Conforme | Faible | Élevée | KEEP | BACKLOG | Écran allumé, animation douce |
| F21 | Mode Nounou / Invité | Sécurité | Conforme | Moyenne | Élevée | KEEP | BACKLOG | PIN local, mode « Log Only » |
| F22 | Carnet de Santé & Courbes OMS | Suivi croissance | Conforme | Moyenne | Moyenne | KEEP | BACKLOG | Saisie manuelle poids/taille/PC + courbes |
| F23 | « Liquid Gold » Inventory | Stock lait maternel | Conforme | Faible-Moyenne | Élevée | KEEP | BACKLOG | CRUD local |
| F24 | Moteur Sauts de Développement | Info parentale | Conforme | Faible | Élevée | KEEP | BACKLOG | Données statiques selon l'âge |
| F25 | Carnet Santé Photo Local | Stockage photos | Conforme | Faible-Moyenne | Élevée | KEEP | BACKLOG | File system simple, sans OCR |
| F26 | Cartes Sociales Safe | Partage | Conforme | Faible | Moyenne | KEEP | BACKLOG | Image de stats sans métadonnées sensibles |
| F27 | Débrief Audio Nocturne TTS | Confort | Conforme | Faible | Moyenne | KEEP | BACKLOG | Synthèse vocale locale |
| F28 | Bilan Annuel & Backup Google Drive manuel | Export | Conforme | Moyenne | Élevée | KEEP | BACKLOG | Google Drive uniquement en action manuelle explicite |
| F29 | Import/Export CSV Avancé | Export avancé | Conforme | Faible-Moyenne | Élevée | KEEP | BACKLOG | Power users |
| F30 | Magic Voice Log | IA optionnelle BYOK | Conforme si BYOK | Moyenne | Moyenne | REWRITE | BACKLOG | Dictée clavier OS + structuration BYOK optionnelle ; jamais indispensable |
| F31 | BYOK AI Sleep Coach / AI Parent Assistant | IA optionnelle BYOK | Conforme si BYOK | Moyenne | Moyenne | REWRITE | BACKLOG | Optionnel, clé stockée localement, core fonctionne sans |
| F32 | Smart Diaper Scan (photo + BYOK optionnel) | Photo / IA optionnelle | Conforme si reformulé | Moyenne | Moyenne | REWRITE | BACKLOG | Photo attachée à l'événement + description BYOK optionnelle ; aucune analyse locale, aucun diagnostic |
| F33 | Design premium calme | Direction visuelle | Conforme | Moyenne | Élevée | KEEP (principe) | MVP | Principe transversal, pas une feature standalone |
| F34 | Aucune permission obligatoire au premier lancement | Principe | Conforme | N/A | Élevée | KEEP (principe) | MVP | Principe transversal intégré à F05 |

## 4. FEATURES CORE — MVP UNIQUE

| ID | Feature | Description | Bénéfice utilisateur | Pourquoi dans le MVP | Complexité | Permissions / capacités |
|---|---|---|---|---|---|---|
| F01 | **Tracking 1-tap avec Timer et reprise locale** | Boutons larges pour enregistrer tétée, sommeil ou couche en un geste. Timer conservé via timestamp après arrière-plan ou fermeture. Sauvegarde locale immédiate. | Le parent épuisé à 3 h du matin enregistre un événement en moins d'une seconde, sans perdre le timer. | Action centrale du produit : sans tracking, pas de valeur. | Faible | Aucune permission obligatoire |
| F02 | **Mode Nuit OLED configurable** | Interface noire OLED profonde, activable automatiquement (fenêtre horaire), manuellement ou en permanence. Boutons larges, contraste minimal. | Tracker dans le noir sans réveiller le bébé ni s'éblouir. | Le cas d'usage principal est nocturne : sans mode nuit, la promesse échoue. | Faible | Aucune permission |
| F03 | **Timeline du jour + Résumé quotidien** | Liste chronologique des événements (type, heure, durée, note) et totaux journaliers automatiques (tétées, couches, sommeil). | Visualiser la journée de bébé en un coup d'œil, y compris pour le pédiatre. | La visualisation donne son sens au tracking. | Faible | Aucune permission |
| F04 | **Édition, suppression et annulation** | Correction ou suppression d'un événement avec confirmation claire et annulation rapide (Undo). | Corriger une erreur de saisie nocturne sans stress. | Sans édition, les erreurs rendent les données inutilisables. | Faible | Aucune permission |
| F05 | **Profil bébé minimal + Stockage local sécurisé** | Prénom et date de naissance stockés en SQLite local. Zéro compte, zéro backend, zéro permission obligatoire au premier lancement, fonctionnement 100 % offline. | Utiliser l'app immédiatement, sans compte ni connexion, avec la garantie que les données du bébé ne quittent jamais le téléphone. | Fondation technique et promesse de valeur (privacy, rapidité, offline). | Faible | Aucune permission obligatoire |

**Nombre de Features Core :** 5
**Vérification : 3 à 5 features maximum :** OUI
**Effort MVP estimé :** faible
**MVP 100 % local :** OUI
**MVP sans compte obligatoire :** OUI
**MVP sans serveur obligatoire :** OUI

## 5. RELEASES OFFICIELLES

### Release 1 — Export & Sécurité des données
| ID | Feature | Description | Bénéfice utilisateur | Complexité | Permissions / capacités |
|---|---|---|---|---|---|
| F07 | Export PDF pédiatre (7/14 jours) | Rapport PDF local clair (tétées, sommeils, couches, notes) partageable via le partage natif. | Montrer un rapport propre au pédiatre sans copier-coller. | Moyenne | Aucune permission obligatoire |
| F08 | Emergency Doctor Mode (rapport 24-48 h) | Compilation rapide des dernières 24 à 48 heures pour consultation ou urgences. | Avoir les données clés immédiatement en situation de stress médical. | Faible | Aucune permission obligatoire |
| F09 | Backup / Restore manuel chiffré | Export local d'un fichier de sauvegarde chiffré (chiffrement JS simple) et import manuel pour restaurer. Aucune synchronisation automatique. | Sauvegarder ou migrer vers un nouveau téléphone sans cloud obligatoire. | Moyenne | File system |

**Nombre de features :** 3 / 3 maximum
**Bénéfice global :** partager les données avec les professionnels de santé et sécuriser ses données sans aucun serveur.
**Complexité globale :** moyenne
**Dépendances principales :** file system, génération PDF locale, chiffrement JS simple

### Release 2 — Co-parenting & Allaitement
| ID | Feature | Description | Bénéfice utilisateur | Complexité | Permissions / capacités |
|---|---|---|---|---|---|
| F10 | Co-Parent Local Transfer | Transfert manuel entre deux téléphones via fichier chiffré exporté/importé ou QR code dynamique. Action explicitement déclenchée par l'utilisateur. | Partager les données à deux parents sans compte ni cloud. | Moyenne | File system, QR code |
| F13 | Suivi Allaitement (côté, durée, pompage) | Sein gauche/droit, durée par côté, tirage en ml, suggestion visuelle du prochain côté. | Suivi précis de l'allaitement sans notation manuelle du côté. | Faible | Aucune permission |
| F14 | Écran « Passation de Relais » | Résumé concis pour le parent qui prend le relais : dernier repas, dernier sommeil, prochaine estimation, note rapide. | Transition fluide entre parents, sans questions à 3 h du matin. | Faible | Aucune permission |

**Nombre de features :** 3 / 3 maximum
**Bénéfice global :** produit réellement utilisable à deux parents, avec suivi d'allaitement précis.
**Complexité globale :** faible à moyenne
**Dépendances principales :** file system, QR code

### Release 3 — Prédiction & Analyse locale
| ID | Feature | Description | Bénéfice utilisateur | Complexité | Permissions / capacités |
|---|---|---|---|---|---|
| F06 | Cry Predictor / Estimation locale de fenêtre de sommeil | Estimation de la prochaine fenêtre de sommeil par moyennes mobiles sur l'historique local des logs uniquement (aucun capteur, aucune caméra, aucun micro, aucun ML embarqué). Countdown temps réel, état « Collecte en cours » si données insuffisantes. | Anticiper la prochaine sieste et organiser son temps. | Moyenne | Aucune permission |
| F15 *(réécrit)* | Statistiques & tendances multi-périodes (1j/7j/30j/90j/180j/365j) | Graphe agrégé local (barres empilées tétée / sommeil / couche) avec sélecteur de 6 périodes et granularité adaptative : 1j = blocs horaires ; 7j et 30j = par jour ; 90j et 180j = par semaine ; 365j = par mois. Tendances et corrélations locales. État vide « Collecte en cours ». Calcul 100 % SQLite, aucune requête réseau. | Lire le rythme du bébé sur le court et le long terme, entièrement offline. | Moyenne | Aucune permission |
| F11+F12 | Notifications locales optionnelles + Alarme « Dream Feed » | Rappels locaux désactivables (backup ancien, événement manquant) et alarme locale programmable pour étirer la nuit. | Rappels utiles sans serveur de push. | Faible | Notifications locales |

**Nombre de features :** 3 / 3 maximum
**Bénéfice global :** l'application passe de tracker à assistant prédictif et analytique local, du jour au niveau annuel.
**Complexité globale :** moyenne
**Dépendances principales :** notifications locales, agrégats SQLite, calculs JS légers

### Release 4 — Suivi avancé de l'enfant
| ID | Feature | Description | Bénéfice utilisateur | Complexité | Permissions / capacités |
|---|---|---|---|---|---|
| F16 | Protocole Allergènes / Suivi Diversification | Journalisation de l'introduction des aliments solides avec règle des 3 jours et alertes locales. | Introduire les aliments en sécurité et repérer les réactions. | Faible | Notifications locales |
| F17 | Médicaments & Vitamines | Checklist locale et rappels pour médicaments ou vitamines récurrents (ex : vitamine D). | Ne pas oublier les prises quotidiennes. | Faible | Notifications locales |
| F18 | Multi-baby / Jumeaux | Profils séparés pour plusieurs enfants, vue individuelle et vue combinée simple. | Gérer jumeaux ou enfants rapprochés dans une seule app. | Moyenne | Aucune permission |

**Nombre de features :** 3 / 3 maximum
**Bénéfice global :** couverture des besoins au-delà du tracking de base : alimentation, médicaments, multi-enfants.
**Complexité globale :** faible à moyenne
**Dépendances principales :** notifications locales, SQLite multi-profils

## 6. FEATURES REJETÉES OU NON CONFORMES
**Section volontairement vide sur demande explicite du requérant.**
Aucune feature rejetée n'est listée ni incluse dans le périmètre de développement de ce livrable. Les rejets (cloud sync, compte obligatoire, P2P Wi-Fi/Bluetooth, publicités, diagnostic médical, IA cloud obligatoire, détection audio, widgets OS natifs, wearables, OCR, ML embarqué, sync Google Drive automatique, gadgets) restent archivés dans l'audit de travail du GPT 2.1 et demeurent définitivement exclus. Toute réintroduction future devra repasser par un audit complet de conformité Local-First.

## 7. BACKLOG / IDÉES NON PLANIFIÉES

| ID | Feature | Raison de la mise en attente | Potentiel |
|---|---|---|---|
| F19 | Sound Machine Offline (bruits blancs) | Confort secondaire, hors core tracking ; gestion de fichiers audio à prévoir. | Moyen |
| F20 | Mode Zen / Veilleuse | UX secondaire non prioritaire. | Faible |
| F21 | Mode Nounou / Invité | Utile mais non critique au lancement. | Moyen |
| F22 | Carnet de Santé & Courbes OMS | Rendu de graphiques = complexité moyenne ; hors tracking quotidien. | Moyen |
| F23 | « Liquid Gold » Inventory | Cible spécifique (mères tirant leur lait). | Faible-Moyen |
| F24 | Moteur Sauts de Développement | Valeur informative limitée, contenu statique. | Faible |
| F25 | Carnet Santé Photo Local | Utile mais secondaire au lancement. | Faible-Moyen |
| F26 | Cartes Sociales Safe | Partage social secondaire. | Faible |
| F27 | Débrief Audio Nocturne TTS | TTS = complexité moyenne, valeur limitée. | Faible |
| F28 | Bilan Annuel & Backup Google Drive manuel | Pertinent en fin de cycle d'utilisation ; Drive manuel uniquement. | Moyen |
| F29 | Import/Export CSV Avancé | Cible restreinte (power users). | Faible |
| F30 | Magic Voice Log (reformulé) | Dictée clavier OS + structuration BYOK optionnelle ; jamais indispensable. | Moyen |
| F31 | BYOK AI Sleep Coach (reformulé) | Strictement optionnel ; core fonctionne sans clé. | Moyen |
| F32 | Smart Diaper Scan (reformulé) | Photo simple + description BYOK optionnelle ; non essentiel. | Faible-Moyen |

## 8. CONTRÔLE FINAL
- MVP unique : OUI
- Features Core entre 3 et 5 : OUI (5)
- MVP 100 % local : OUI
- Aucun serveur obligatoire : OUI
- Aucune auth tierce obligatoire : OUI
- Aucun traitement natif lourd : OUI
- Aucune bibliothèque native complexe : OUI
- Aucune API externe indispensable : OUI
- Releases de 3 features maximum : OUI (R1 : 3, R2 : 3, R3 : 3, R4 : 3)
- Features rejetées absentes du livrable (demande requérant) : OUI
- Document prêt pour passation : OUI

## 9. PASSATION
Ce document contient uniquement des idées de fonctionnalités filtrées, corrigées et classées, **expurgées des features rejetées** conformément à la demande du requérant.

Il peut être transmis au **GPT 3 — Monetization Strategist** pour analyser la valeur monétisable des Features Core et des Releases, sans que ce document ne définisse lui-même le pricing ou la stratégie d'abonnement. Les éventuels verrous d'accès visibles sur les maquettes (périodes statistiques, prédiction) relèvent exclusivement de l'arbitrage du GPT 3, dans le respect des règles non négociables : core MVP et backup de base jamais paywallés.

**Structure finale :** MVP 5 Features Core · Release 1 (3) · Release 2 (3) · Release 3 (3) · Release 4 (3) · Backlog 14 features.