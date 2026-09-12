# Rapport d'Architecture Technique et Stratégie Produit : BabyLog Offline et Infrastructure Local-First

Version corrigée v2 — 2026-09-10 — Annexe technique officielle de 02-product-strategy.md

## 1. Stratégie Produit et Positionnement de Marché (BabyLog Offline)

L'évaluation comparative des opportunités d'applications mobiles Local-First sur les marchés développés (Tier 1 et Tier 2) a établi l'application BabyLog Offline comme l'initiative prioritaire, obtenant un score global de validation de 79,6 sur 100. Ce projet répond à un problème d'une intensité critique rencontrée par les nouveaux parents : la gestion de la privation de sommeil et le suivi ultra-fréquent, allant de 10 à 15 actions quotidiennes, des cycles de l'enfant dans des conditions de fatigue cognitive extrême. La réponse technique à ce problème exige une interface à latence nulle et une fiabilité absolue, indépendante de toute connectivité réseau.

| Critère d'Évaluation | Score /10 | Poids (%) | Contribution | Analyse Stratégique |
| --- | --- | --- | --- | --- |
| Intensité du Problème | 8.2 | 20% | 16.4 | Charge mentale maximale des parents, besoin d'interaction à une main la nuit |
| Taille & Attractivité Marché | 7.3 | 20% | 14.6 | Environ 8 millions de naissances annuelles sur la zone cible (USA, UK, CA, AU, JP, IT, ES) |
| Différenciation Produit | 7.5 | 20% | 15.0 | Positionnement "Anti-Cloud" et respect absolu de la vie privée des données du nourrisson |
| Faisabilité Technique | 8.9 | 15% | 13.35 | Architecture 100% embarquée, absence de maintenance serveur et complexité maîtrisée |
| Monétisation & WTP | 8.5 | 15% | 12.75 | Forte disposition à payer (WTP) en achat unique (Lifetime) au moment de la naissance |
| Risque Inversé | 7.5 | 10% | 7.5 | Faible dépendance aux API tiers, aucun coût d'infrastructure récurrent |
| SCORE GLOBAL | 79.6 | 100% | 79.6 | Verdict : GO (Validation MVP) |

Les applications leaders du secteur, telles que Huckleberry, Glow Baby ou Baby Tracker, reposent de manière prédominante sur des architectures centralisées exigeant une connexion réseau constante. Cette dépendance au cloud introduit des points de friction majeurs, notamment des latences lors des saisies nocturnes, des échecs de synchronisation en zones d'ombre comme les maternités, des politiques d'abonnement SaaS agressives de l'ordre de 10 dollars par mois, et une monétisation opaque des données biométriques des enfants. BabyLog Offline exploite ce gap d'opportunité en proposant un modèle "Anti-Huckleberry" fondé sur trois piliers : une interface à latence inférieure à 100 millisecondes grâce à une persistance locale directe, une confidentialité absolue des données biométriques par stockage exclusif sur l'appareil, et une monétisation éthique en achat unique adaptée au cycle de vie réel du besoin, estimé entre 18 et 24 mois.

Deux autres concepts validés sont conservés dans le backlog stratégique pour un développement ultérieur. D'une part, SafeHaven (score de 78,8/100) vise le suivi de rétablissement des addictions et le journal TCC. Sa conception repose sur un chiffrement applicatif AES-256 ciblé pour éviter les surcoûts d'une couche SQLCipher globale, tout en effectuant l'analyse des déclencheurs via des algorithmes locaux. D'autre part, NeuroRoutine (score de 77,5/100) propose un planificateur visuel pour adultes neurodivergents (TDAH/Autisme). L'application exploite le stockage local sous MMKV pour offrir un chargement instantané et réduire la cécité temporelle sans dépendance réseau.

## 2. Architecture Technique Local-First et Règles de Conception MVP

Le modèle d'architecture retenu pour le Produit Minimum Viable (MVP) de BabyLog Offline repose sur une isolation stricte de l'appareil sous la contrainte mono-device strict. Aucune couche réseau distante, API REST, GraphQL ou infrastructure backend Firebase n'est sollicitée pour le fonctionnement nominal de l'application. L'ensemble des données d'événements (repas, sommeil, couches) est directement écrit et indexé dans une base SQLite locale gérée via expo-sqlite.

Pour garantir un délai de mise sur le marché (Time-to-Market) rapide et éliminer la complexité liée à la résolution de conflits de données distribuées (de type CRDT ou Operational Transformation), toute synchronisation entre deux partenaires ou parents est formellement reportée à la version 1.1.

Lorsque la synchronisation partenaire sera introduite en V1.1, elle s'effectuera exclusivement selon des mécanismes déconnectés, proscrivant l'usage d'un serveur central. Deux modalités techniques sont retenues : l'export et l'import manuel d'un fichier d'archive chiffré, ou le transfert visuel de deltas de données via des QR codes dynamiques balayés d'un écran à l'autre. L'implémentation de liaisons Wi-Fi Direct natives ou de sockets P2P Bluetooth est définitivement exclue de la feuille de route technique en raison des autorisations système intrusives qu'elles imposent aux utilisateurs et de leurs taux d'échec d'appairage élevés sur mobile.

## 3. Engine de Génération et d'Exportation de Rapports PDF (expo-print)

L'exportation de données de suivi sous forme de rapports synthétiques destinés au pédiatre constitue une fonctionnalité clé du niveau Premium de l'application. L'implémentation technique repose exclusivement sur le module expo-print, combiné à expo-sharing dans le cadre de l'écosystème Expo managed workflow.

Sur les appareils iOS, le composant d'impression s'appuie sur le moteur WKWebView. En raison des règles de bac à sable (sandbox) imposées par le système d'exploitation, WKWebView interdit le chargement d'assets locaux référencés via des URLs de fichiers standards (telles que file:// ou des chemins relatifs du bundle) lors du rendu d'une chaîne HTML vers un document PDF. Pour résoudre cette contrainte sans recourir à un serveur distant, l'ensemble des assets visuels (logos, icônes de suivi et éléments d'en-tête) doit être préchargé au démarrage de la génération via expo-asset, converti en chaînes de caractères encodées en Base64 au moyen de expo-file-system, puis injecté directement en ligne (inlined) dans les balises HTML5.

Exemple de structure d'injection d'asset Base64 pour expo-print :
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Logo" />

Afin de garantir un rendu visuel homogène lors de l'impression ou de la consultation du rapport PDF, le modèle HTML généré doit appliquer des règles strictes de mise en page CSS :

- Format de Page et Marges : définition explicite des marges d'impression au moyen de la directive CSS @page { margin: 15mm; size: A4 portrait; } pour neutraliser les marges par défaut des moteurs de rendu.
- Gestion des Sauts de Page : application de la propriété break-inside: avoid; (associée à page-break-inside: avoid;) sur tous les conteneurs de tableaux, résumés graphiques et blocs de notes pour empêcher la scission d'un même tableau sur deux pages différentes.
- Unités de Mesure Absolues : dimensionnement des typographies et des conteneurs en pixels (px) ou en millimètres (mm), les valeurs relatives en pourcentage (%) provoquant des décalages d'alignement imprévisibles entre Android et iOS.

## 4. Algorithme de Prédiction du Sommeil (Spec Textuelle Exécutoire)

Conformément aux contraintes du MVP, qui excluent tout modèle de Machine Learning embarqué afin de préserver la batterie de l'appareil et de limiter la taille du livrable, le moteur de prédiction des fenêtres d'éveil (Wake Windows) repose sur un algorithme local de moyennes mobiles adaptatives.

SPEC EXÉCUTOIRE :
- Inputs : historique local des fenêtres d'éveil observées (table sessions, type wake)
- Baseline par âge (minutes) : 0-4 sem = 45 | 1-3 mois = 75 | 3-6 mois = 120 | 6-12 mois = 180
- EMA : ema = alpha × x_dernier + (1 − alpha) × ema_précédent, avec alpha = 2 / (n + 1), n = nombre de fenêtres observées sur les 3 derniers jours (plafonné à 12)
- Poids des données w : 0 si moins de 3 jours complets ; linéaire de 0 à 0.75 entre le jour 3 et le jour 7 ; 0.75 au-delà de 7 jours
- Prédiction : WW_pred = (1 − w) × baseline_age + w × ema
- Prochaine sieste estimée = heure de fin du dernier réveil + WW_pred
- Recalcul : à chaque fin de session sleep, en SQL agrégé + JS pur, sous 1 ms, zéro réseau
- Affichage si w = 0 : "Collecte en cours... Données insuffisantes"

| Tranche d'Âge | Fenêtre d'Éveil de Référence (WW_baseline) | Intervalle Mesuré Typique | Source & Logique Médicale |
| --- | --- | --- | --- |
| 0 – 4 Semaines | 45 minutes | 30 – 60 minutes | Temps limité à la tétée/biberon, au change et à l'endormissement |
| 1 – 3 Mois | 75 minutes | 60 – 90 minutes | Émergence progressive des premiers rythmes circadiens |
| 3 – 6 Mois | 120 minutes | 90 – 150 minutes | Consolidation des cycles autour de 3 à 4 siestes quotidiennes |
| 6 – 12 Mois | 180 minutes | 150 – 210 minutes | Transition vers un rythme stabilisé à 2 siestes par jour |

L'horaire estimé de la prochaine phase d'endormissement est obtenu par addition directe de la durée prédictive à l'horaire de fin du dernier réveil consigné, conformément à la formule WW_pred ci-dessus. Ce calcul mathématique s'exécute en moins de 1 milliseconde sur le thread principal de l'appareil, garantissant une mise à jour instantanée de l'interface sans solliciter de ressources processeur critiques.

## 5. Architecture de Sécurité et Chiffrement

Bien que le MVP de BabyLog Offline utilise une base SQLite locale standard pour maximiser la vitesse de lecture et d'écriture des événements fréquents, la politique globale d'architecture définit un modèle de stockage sécurisé en trois tiers, directement applicable au backlog SafeHaven et aux fonctionnalités avancées du produit.

| Critère de Comparaison | Chiffrement Applicatif (AES-256) | Chiffrement Base Intégrale (SQLCipher) |
| --- | --- | --- |
| Empreinte Binaire & SGBD | Faible. Utilise le moteur SQLite natif du système et une bibliothèque AES pur JS (crypto-js) | Élevée. Exige le packaging d'une version personnalisée de SQLite compilée avec OpenSSL |
| Impact sur les Performances | Nul sur les index et champs non sensibles. Déchiffrement ciblé des données PII | Latence sur chaque requête SELECT ou INSERT, entraînant une surconsommation CPU |
| Flexibilité des Requêtes | Permet les filtres SQL rapides sur les horodatages et types d'événements anonymisés | Impossible de lire la moindre métadonnée sans déverrouiller la base entière |
| Gestion des Clés | Clé dérivée stockée dans la zone matérielle sécurisée (expo-secure-store) | Mot de passe complet de la base stocké dans expo-secure-store |

CHIFFREMENT AU MVP (DÉCISION CORRIGÉE) :
- Clé maîtresse : expo-secure-store (Keychain/Keystore, WHEN_UNLOCKED_THIS_DEVICE_ONLY)
- Chiffrement champs PII (prénom, notes) et fichier backup : AES-256 via crypto-js (pur JS)
- SQLite standard non chiffré pour timestamps et types (performance)
- react-native-quick-crypto : INTERDIT au MVP (Règle d'Or zéro natif complexe), réservé au backlog SafeHaven

Le choix du chiffrement applicatif ciblé via AES-256 s'appuie sur la bibliothèque crypto-js, purement JavaScript, conformément à la Règle d'Or zéro natif complexe. Pour le volume de données concerné au MVP (champs PII de quelques octets et fichier de backup de quelques Mo), le chiffrement AES pur JS s'exécute en millisecondes sans blocage perceptible de l'interface utilisateur. La bibliothèque react-native-quick-crypto (Nitro Modules, liaisons C++ JSI), bien que plus rapide sur de très gros volumes, est explicitement INTERDITE au MVP et réservée au backlog SafeHaven.

Le stockage s'organise selon trois tiers distincts :

- Tier 1 (Zone Matérielle Sécurisée) : utilisation de expo-secure-store pour conserver la clé maîtresse AES-256 dans l'iOS Keychain ou l'Android Keystore. Ces clés sont configurées avec les options d'accès les plus strictes (WHEN_UNLOCKED_THIS_DEVICE_ONLY), garantissant qu'elles ne sont jamais transmises lors des sauvegardes cloud du système.
- Tier 2 (Champs Applicatifs Chiffrés) : traitement des données identifiantes ou sensibles (telles que le prénom de l'enfant ou les observations médicales) au moyen de crypto-js en mode AES-256 avant leur écriture en base.
- Tier 3 (Base de Données Locale) : persistance des structures de données, des horodatages et des types d'événements non chiffrés au sein de expo-sqlite, permettant un indexage rapide et des requêtes analytiques instantanées pour l'affichage des graphiques.

## 6. Conformité Réglementaire et Stratégie de Validation Store

La commercialisation d'une application de suivi de puériculture sur l'App Store d'Apple et le Google Play Store impose un respect strict des directives de validation afin d'éviter tout rejet lié aux réglementations sur les dispositifs médicaux.

L'App Store Review Guideline 1.4.1 (Physical Harm - Medical Apps) stipule que les applications fournissant des données de santé ou des conseils pouvant être interprétés comme un diagnostic médical font l'objet d'un examen approfondi. Pour se conformer à cette règle sans devoir fournir d'homologation réglementaire complexe (de type FDA 510(k) ou marquage CE médical), BabyLog Offline doit être explicitement positionnée dans ses métadonnées et son interface comme un simple journal de suivi à caractère informatif. Un disclaimer clair doit figurer sur l'écran d'accueil et dans les réglages : "Cette application est un journal de suivi personnel. Elle n'est pas une application médicale et ne remplace pas l'avis d'un professionnel de santé." En outre, les prédictions de sommeil calculées par l'algorithme doivent obligatoirement intégrer des références et des citations d'organismes de pédiatrie reconnus accessibles en un tap par l'utilisateur.

En vertu de la Guideline 5.1.3 (Health and Health Research), Apple interdit formellement l'utilisation de données relatives à la santé à des fins publicitaires ou leur partage avec des tiers. L'architecture Local-First de BabyLog Offline, qui conserve 100% des données sur le périphérique sans aucune transmission réseau, garantit une conformité absolue avec cette règle.

Sur le Google Play Store, l'éditeur doit remplir la Déclaration relative aux applications de santé (Health Apps Declaration) sur la console Google Play. L'application sera enregistrée sous la catégorie "Non-Medical / Health Journal", affirmant qu'elle ne collecte ni ne partage aucune donnée médicale sur des serveurs distants.

S'agissant de la monétisation par affichage publicitaire (sur le segment gratuit), des règles d'intégration strictes sont définies afin de ne pas dégrader l'expérience utilisateur :

- Interdiction Absolue sur les Écrans Nocturnes : aucun composant publicitaire (bannière ou format interstitiel) ne doit être chargé ou affiché sur les interfaces de tracking nocturne à sombre contraste.
- Emplacements Autorisés : l'affichage publicitaire est exclusivement cantonné aux écrans secondaires de consultation des statistiques hebdomadaires et aux menus de configuration.

## 7. Synthèse et Recommandations de Déploiement

L'analyse intégrée de la stratégie produit, de l'architecture technique et du cadre réglementaire confirme la viabilité et la pertinence du lancement de BabyLog Offline. La combinaison du modèle Local-First, de la persistance SQLite locale et du chiffrement applicatif offre une proposition de valeur alignée sur les attentes des parents en matière de rapidité et de protection de la vie privée.

| Composant Technique | Solution Sélectionnée | Raison d'Être & Bénéfice Opérationnel |
| --- | --- | --- |
| Architecture Système | Mono-Device Strict (Local-First) | Latence de saisie sous 100ms, zéro coût d'infrastructure serveur |
| Moteur de Persistance | expo-sqlite | SGBD embarqué performant pour l'indexation des événements |
| Génération de PDF | expo-print + Assets Base64 | Rendu conforme sous WKWebView iOS sans dépendance réseau |
| Prédiction du Sommeil | Moyennes Mobiles Adaptatives | Algorithme léger, exécution sous 1ms sans surconsommation CPU |
| Synchronisation V1.1 | Export Chiffré / Dynamic QR Delta | Évite la complexité CRDT et rejette les sockets Wi-Fi Direct instables |
| Moteur Cryptographique | crypto-js (pur JS) + expo-secure-store | Conforme à la Règle d'Or zéro natif complexe, performance suffisante au volume MVP |
| Positionnement Store | Journal de suivi non médical | Conformité Apple Guideline 1.4.1 et Google Health Policy |

## 8. Architecture de Sauvegarde (4 Couches, Zéro Backend)

- Couche 1 OS automatique : iOS iCloud Backup inclus par défaut (ne jamais exclure la DB) ; Android allowBackup true dans app.json (Auto Backup 25 Mo)
- Couche 2 export manuel gratuit : fichier .babylog chiffré AES-256 via crypto-js, partage via Share Sheet natif (AirDrop, Files, email, tout cloud choisi par l'utilisateur)
- Couche 3 migration guidée : écran onboarding "Vous aviez BabyLog ailleurs ?" avec import du fichier
- Couche 4 Google Drive optionnel V1.1 : upload 1-tap du fichier chiffré, commodité premium, jamais obligatoire, export manuel toujours gratuit
- Restore premium : Restore Purchases StoreKit/Play Billing, indépendant des données
- Règle éthique : jamais de données prises en otage du paywall
- Notification locale de rappel backup si dernier export supérieur à 30 jours (gratuit)

L'exécution du MVP selon ces spécifications techniques permet d'assurer un développement rapide, un haut niveau de fiabilité pour l'utilisateur final et une conformité rigoureuse avec les exigences des magasins d'applications. Cette application est destinée à un usage informatif uniquement. Pour tout conseil médical ou diagnostic, consultez un professionnel de santé.