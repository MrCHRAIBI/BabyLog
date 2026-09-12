STRATÉGIE PRODUIT — BabyLog Offline — 2026-09-10 — Version corrigée v2

RÉSUMÉ EXÉCUTIF
Idée source : BabyLog Offline (Score GPT 1 : 79.6/100)
Proposition de valeur : Pour les nouveaux parents épuisés qui doivent tracker les soins de leur bébé la nuit sans friction, BabyLog Offline est un journal de suivi 100% local qui permet un enregistrement 1-tap ultra-rapide et privé, contrairement aux apps cloud qui imposent des abonnements prédateurs et exposent les données biométriques de l'enfant.
North Star Metric : Daily Active Taps (Nombre d'enregistrements quotidiens par utilisateur actif).
Périmètre MVP : 5 features cœur, 8.0 semaines estimées avec agent IA.
Prochaine étape : Transmettre ce document au GPT 3 (Monetization Strategist).

PROBLÈME ET CIBLE (RESTITUTION GPT 1)
Les nouveaux parents (25-40 ans, USA, UK, Canada, AUS, JAP, ITA, ESP) souffrent de privation de sommeil sévère et doivent tracker tétées, couches et sommeil pour les pédiatres, souvent à 3h du matin avec un cerveau embrumé. Les apps cloud (Huckleberry) sont lentes, buguent sans Wi-Fi, et monétisent agressivement des parents anxieux. Le gap d'opportunité est une app "Anti-SaaS" : zéro cloud, zéro latence, privacy absolue, et modèle Lifetime.

PROPOSITION DE VALEUR
Pour [nouveaux parents épuisés] qui [doivent tracker les soins de leur bébé la nuit sans friction ni anxiété], [BabyLog Offline] est un [journal de suivi nouveau-né] qui [permet un enregistrement 1-tap ultra-rapide et 100% privé], contrairement à [Huckleberry et autres apps cloud] qui [imposent des abonnements chers, des latences de chargement et exposent les données biométriques de l'enfant sur des serveurs tiers].

JOBS TO BE DONE
Quand [je donne le sein/biberon à 3h du matin dans le noir], je veux [enregistrer le début et la fin de la tétée en un seul tap sans être ébloui], afin de [me rendormir vite et avoir des données précises pour le pédiatre].
Quand [le pédiatre me demande l'historique des selles et du sommeil de la semaine], je veux [générer et exporter un rapport PDF clair en 1 clic], afin de [prouver que mon bébé grandit bien sans ressaisir mes notes papier].
Quand [je suis anxieux à l'idée que mes données parentales soient vendues ou piratées], je veux [savoir que l'app ne se connecte jamais à internet], afin de [protéger la vie privée numérique de mon enfant dès sa naissance].
Quand [je change de téléphone ou que je crains de perdre tout l'historique de mon bébé], je veux [exporter et réimporter mes données chiffrées en 1 geste], afin de [garder la propriété totale de mes données sans dépendre d'un cloud].

PERSONAS
Persona 1 : Sarah, 32 ans, UX Designer, USA (Tier 1)
Objectifs : Avoir un suivi médical précis, protéger la privacy de son bébé, optimiser son propre sommeil.
Frustrations : Huckleberry coûte 10 dollars/mois et bugue lors de la sync avec son mari ; les pubs ciblées sur la grossesse la suivent partout sur le web.
Technophilie : Élevée.
Willingness to pay : Élevée (29.99 dollars Lifetime). Elle déteste les abonnements SaaS et préfère "acheter une fois".
Contexte d'usage : La nuit, dans le noir, une main tenant le bébé, l'autre sur le téléphone. Sessions de 10 secondes.

Persona 2 : Thomas, 35 ans, Ingénieur, France (Tier 1)
Objectifs : Comprendre les cycles de sommeil de son bébé, aider sa femme la nuit, avoir des stats visuelles claires.
Frustrations : Les apps gratuites (ex : Nighp) affichent des pubs de jeux d'argent à 3h du matin ; les interfaces sont datées et peu ergonomiques.
Technophilie : Élevée.
Willingness to pay : Moyenne à Élevée (prêt à payer pour une app "propre", sans pubs intrusives).
Contexte d'usage : Le week-end et en soirée, en relais de sa femme. Sessions de 1 à 2 minutes.

CORE LOOP D'ENGAGEMENT
Trigger : Le bébé pleure ou se réveille (besoin physiologique immédiat).
Action : Ouvrir l'app, tap sur le bouton géant "Feed" ou "Diaper", tap pour arrêter.
Reward : Soulagement immédiat (tâche accomplie sans friction cognitive), retour haptique, timeline visuelle qui se remplit.
Investment : L'historique local s'enrichit, rendant les prédictions de sommeil (moyennes mobiles) et les exports PDF de plus en plus précis et utiles.

MÉTRIQUES
North Star : Daily Active Taps (Nombre moyen d'enregistrements quotidiens par DAU). Justification : Si l'utilisateur ne tap pas 8 à 12 fois par jour, l'app a échoué son test de friction zéro.
Secondaires :
Taux de génération de PDF pédiatre (J7 et J30).
Rétention J30 (Indicateur de survie avant que le bébé ne fasse ses nuits).
Taux de conversion Free vers Premium (Achat Lifetime).
Taux d'utilisateurs ayant réalisé au moins 1 backup chiffré (J30).

MATRICE COMPARATIVE DE FEATURES
| Feature | Huckleberry (Conc. 1) | Baby Tracker Nighp (Conc. 2) | Glow Baby (Conc. 3) | Nous (BabyLog Offline) |
| --- | --- | --- | --- | --- |
| Tracking 1-Tap Rapide | Partiel (UI chargée) | Présent (UI moche) | Absent (Trop de clics) | MVP |
| Mode Nuit OLED Vrai | Absent | Absent | Absent | MVP |
| Export PDF Médical | Payant (10 dollars/mois) | Absent | Absent | MVP |
| Prédiction Sommeil | ML Cloud (Lent) | Absent | Absent | MVP (Local, gaté premium) |
| Backup Local Chiffré | Absent (cloud forcé) | Absent | Absent | MVP |
| Sync Partenaire | Cloud (Bugs fréquents) | Absent | Cloud (Lourd) | V1.1 (QR Delta) |
| Zero Cloud / Privacy | Absent | Absent | Absent | MVP |
| Pas d'Ads nocturnes | N/A (Abonnement) | Absent (Pubs chocs) | Absent | MVP |
| Modèle Lifetime | Absent (Abo forcé) | Présent (mais UI 2010) | Absent | MVP |
| Widgets Natifs | Présent | Absent | Présent | V2.0 |
| Communauté Sociale | Présent | Absent | Présent | REJET |

FONCTIONNALITÉS DIFFÉRENCIANTES
Différenciant 1 : UI "Nuit" (OLED & Haptique)
Description : Interface noir profond (#000000) avec boutons géants et retour haptique natif pour confirmer les actions sans regarder l'écran.
Gap adressé : Huckleberry et Nighp éblouissent les parents à 3h du matin et nécessitent une validation visuelle.
Valeur utilisateur : Préserve la mélatonine du parent et permet le tracking les yeux fermés.
Faisabilité Local-First : OUI. UI React Native pure, API Haptics native.
RICE : 13.3

Différenciant 2 : Tracking 1-Tap & Timeline
Description : Démarrage/arrêt des chronomètres par simple pression, avec sauvegarde immédiate en base locale et visualisation en timeline verticale.
Gap adressé : La friction cognitive des apps classiques qui demandent de remplir des formulaires (ml, sein gauche/droit) à chaque fois.
Valeur utilisateur : Gain de temps massif, réduction de la charge mentale nocturne.
Faisabilité Local-First : OUI. SQLite pour la persistance, MMKV pour l'état du timer en cours.
RICE : 12.0

Différenciant 3 : Export PDF Médical Local
Description : Génération d'un rapport PDF structuré des 7 derniers jours directement sur le device, partageable via le Share Sheet natif.
Gap adressé : Les apps cloud bloquent l'export PDF derrière un paywall mensuel ou nécessitent une connexion pour le générer.
Valeur utilisateur : Preuve médicale instantanée pour le pédiatre, sans dépendre d'internet.
Faisabilité Local-First : OUI. Utilisation stricte de expo-print (HTML to PDF local).
RICE : 10.6

Différenciant 4 : Prédiction "SweetSpot" Locale
Description : Algorithme de moyennes mobiles calculant la prochaine fenêtre de sommeil/faim basé uniquement sur les 3 derniers jours de données locales.
Gap adressé : Huckleberry facture cher son algorithme ML cloud.
Valeur utilisateur : Anticipation des besoins du bébé sans abonnement ni envoi de données sur un serveur.
Faisabilité Local-First : OUI. Requêtes SQL agrégées et logique JS pure. Aucun modèle ML lourd au MVP.
RICE : 7.2

PRIORISATION RICE
| Feature | Reach (0-10) | Impact (0.5-3) | Confidence (%) | Effort (sem.) | RICE | Classification |
| --- | --- | --- | --- | --- | --- | --- |
| UI "Nuit" (OLED & Haptique) | 10 | 2 | 100% | 1.5 | 13.3 | MVP |
| Tracking 1-Tap & Timeline | 10 | 3 | 100% | 2.5 | 12.0 | MVP |
| Export PDF Médical Local | 8 | 2 | 100% | 1.5 | 10.6 | MVP |
| Prédiction Locale (Moy. Mobiles) | 9 | 2 | 80% | 2.0 | 7.2 | MVP |
| Backup Local Chiffré (Export + Share Sheet) | 8 | 1 | 100% | 0.5 | 16.0 | MVP (risk-driven) |
| Sync Partenaire (QR Delta) | 7 | 3 | 80% | 3.0 | 5.6 | V1.1 |
| Widgets iOS/Android | 8 | 1 | 80% | 2.0 | 3.2 | V2.0 |
| Import/Export CSV Avancé | 4 | 1 | 100% | 1.0 | 4.0 | V1.1 |
| Mode "Nounou" (Profil Invité) | 5 | 1 | 50% | 2.0 | 1.25 | BACKLOG |
Note : Le Backup Local Chiffré est inclus au MVP par décision risk-driven (mitigation du risque "Perte de données", impact Élevé), indépendamment de son classement RICE.

PÉRIMÈTRE MVP (V1.0)
1. Tracking 1-Tap & Timeline (Cœur du réacteur, zéro friction).
2. UI "Nuit" (Différenciation sensorielle et ergonomique majeure).
3. Export PDF Médical Local (Argument de conversion et utilité médicale).
4. Prédiction Locale (Valeur ajoutée "Smart" sans backend) — construite au MVP, gatée premium au lancement : le tier free affiche un teaser "SweetSpot disponible en Premium" après 3 jours de données.
5. Backup Local Chiffré (Export fichier .babylog AES-256 + Share Sheet natif, import transactionnel) — feature gratuite, jamais paywallée (règle éthique : données jamais prises en otage).
Effort total : 8.0 semaines.
Vérification contrainte 10 semaines : OUI.

FEATURES REJETÉES ET RAISONS
| Feature | Raison du rejet |
| --- | --- |
| Sync Cloud Temps Réel | INTERDIT. Nécessite un backend, viole la promesse "Zero-Knowledge" et "Privacy-First". |
| Sync Wi-Fi Direct Natif | REJETÉ (Annexe). Trop complexe et instable cross-platform pour un MVP de 10 semaines. |
| Modèle ML embarqué lourd | REJETÉ. Augmente la taille de l'app et la consommation batterie. Les moyennes mobiles suffisent au MVP. |
| Communauté / Forum Social | REJETÉ. Hors cible, nécessite modération et backend, dilue la proposition de valeur "Privacy". |
| Ads sur écrans nocturnes | REJETÉ. Détruirait l'UX et la confiance. (Le GPT 3 définira les slots non-intrusifs diurnes). |

USER STORIES MVP
Feature 1 : Tracking 1-Tap & UI Nuit
User story : En tant que parent épuisé, je veux démarrer/arrêter le tracking d'une tétée avec un seul bouton géant sans être ébloui, afin de me rendormir rapidement.
Critères d'acceptation :
Étant donné l'app ouverte en mode nuit, quand je tap le bouton "Feed", alors le timer démarre et le retour haptique confirme l'action.
Étant donné un timer en cours, quand je tap à nouveau, alors la session est sauvegardée en base locale avec l'heure de début et de fin.
Étant donné l'app en arrière-plan, quand je la rouvre, alors le timer affiche le temps écoulé correctement.
Edge cases : L'app est tuée par l'OS pendant le timer (reprise via timestamp de démarrage stocké dans MMKV).
Note technique Local-First : SQLite (table sessions), MMKV (état du timer actif pour survie au crash), permissions système : aucune.

Feature 2 : Export PDF Médical Local
User story : En tant que parent, je veux générer un PDF récapitulatif des 7 derniers jours en 1 clic, afin de le montrer au pédiatre.
Critères d'acceptation :
Étant donné sur l'écran Timeline, quand je tap "Export PDF", alors l'app génère un document via expo-print.
Quand le PDF est généré, alors le Share Sheet natif de l'OS s'ouvre pour permettre l'envoi ou la sauvegarde locale.
Le PDF contient un disclaimer clair : "Journal de suivi non médical".
Edge cases : Aucune donnée sur les 7 derniers jours (bouton désactivé + tooltip).
Note technique Local-First : expo-print (HTML to PDF), File System pour le cache temporaire du PDF avant partage. Assets injectés en Base64 (contrainte WKWebView iOS, voir annexe technique section 3).

Feature 3 : Prédiction Locale (Moyennes Mobiles)
User story : En tant que parent anxieux, je veux savoir quand mon bébé aura faim ou sommeil ensuite, afin d'anticiper ses besoins.
Critères d'acceptation :
Étant donné au moins 3 jours de données de sommeil, quand j'ouvre le dashboard, alors l'app affiche la moyenne des 3 derniers cycles.
Quand je termine une session de sommeil, alors la prédiction de la prochaine fenêtre se met à jour instantanément.
Étant donné un utilisateur du tier free, quand la prédiction est disponible, alors l'app affiche un teaser de gating premium conformément au périmètre MVP.
Edge cases : Moins de 3 jours de données (affiche "Collecte en cours... Données insuffisantes").
Note technique Local-First : Requêtes SQL agrégées (AVG, GROUP BY), logique JS pure, zéro appel réseau. Spec mathématique complète en annexe technique section 4.
Note monétisation : Feature construite au MVP, gatée premium au lancement.

Feature 4 : UI "Nuit" OLED & Haptique
User story : En tant que parent qui allaite dans le noir, je veux une interface noir profond sans lumière parasite, afin de ne pas me réveiller davantage.
Critères d'acceptation :
Étant donné le mode nuit actif, quand l'app s'affiche, alors le fond est noir profond (#000000) et aucun élément blanc pur n'est visible.
Quand je tap une action, alors un retour haptique natif confirme sans nécessiter de validation visuelle.
Edge cases : Appareil sans écran OLED (rendu dark standard acceptable, sans régression fonctionnelle).
Note technique Local-First : Tokens NativeWind light/dark, expo-haptics, aucune permission.

Feature 5 : Backup Local Chiffré (Export + Share Sheet)
User story : En tant que parent, je veux exporter tout l'historique de mon bébé dans un fichier chiffré, afin de ne rien perdre si je change de téléphone.
Critères d'acceptation :
Étant donné l'écran Paramètres, quand je tap "Exporter un backup", alors l'app génère un fichier .babylog chiffré AES-256 (crypto-js) protégé par un code backup choisi par l'utilisateur (PIN 6 chiffres ou mot de passe), puis ouvre le Share Sheet natif.
Étant donné un fichier .babylog valide, quand je lance l'import depuis les Paramètres et saisis le code backup, alors l'app valide le fichier (schéma Zod + version), demande confirmation explicite, et restaure les données de façon transactionnelle avec rollback en cas d'échec.
Étant donné aucun export depuis 30 jours, quand l'app démarre, alors une notification locale de rappel backup est affichée (gratuite, désactivable).
Edge cases : Fichier invalide ou version incompatible (erreur claire, aucune donnée partielle écrite) ; code backup erroné (message sans fuite d'information) ; fichier vide.
Note technique Local-First : Export complet SQLite + settings MMKV hors secrets, chiffrement AES-256 crypto-js, clé dérivée du code backup utilisateur, Share Sheet natif, zéro réseau. Feature gratuite, jamais paywallée.

ROADMAP
V1.0 — MVP (Semaines 1 à 8)
Tracking 1-Tap & Timeline (2.5 sem.)
UI "Nuit" OLED & Haptique (1.5 sem.)
Export PDF Médical via expo-print (1.5 sem.)
Prédiction Locale par Moyennes Mobiles, gatée premium (2.0 sem.)
Backup Local Chiffré via export + Share Sheet (0.5 sem.)
V1.1 (Mois 2-3)
Sync Partenaire Asynchrone : Export/Import de base de données chiffrée via QR Code Delta (Scan pour récupérer les modifications de la journée). Objectif business : Rétention des couples et viralité naturelle.
Import/Export CSV : Pour les parents "data nerds". Objectif : Avis positifs sur les stores.
Intégration Google Drive optionnelle : upload 1-tap du fichier .babylog chiffré (commodité premium, jamais obligatoire).
V2.0 (Mois 4-6)
Widgets iOS/Android : Voir le timer en cours sans ouvrir l'app. Objectif : Engagement quotidien et visibilité sur l'écran d'accueil.
Mode "Nounou" : Profil invité avec accès restreint (pas d'export, pas d'historique complet). Objectif : Expansion de l'usage.

HORS PÉRIMÈTRE DÉFINITIF
Sync Cloud Temps Réel : Viole l'architecture Local-First et la promesse de privacy.
ML Lourd sur Device : Inutile pour des moyennes de sommeil de nouveau-né, alourdit le binaire.
Réseau Social Interne : Nécessite modération et backend, hors de notre positionnement "Outil utilitaire privé".
Paywall sur le backup ou l'export de données : Interdit par règle éthique (données jamais prises en otage).

HYPOTHÈSES À VALIDER
| Hypothèse | Méthode de validation | Seuil de succès |
| --- | --- | --- |
| Les parents préfèrent un achat Lifetime (29.99 dollars) à un abo mensuel (10 dollars/mois). | Landing page A/B test avec fausse checkout avant le lancement. | Taux de clic sur "Lifetime" > 70%. |
| Le tracking 1-tap (début/fin) suffit, les parents ne veulent pas saisir les "ml" ou "sein G/D" à chaque fois. | Prototype Figma cliquable testé avec 10 parents de nouveau-nés. | 8/10 parents complètent le tracking en < 5 secondes. |
| L'argument "Zéro Cloud / Data Biométrique Protégée" est le déclencheur d'achat principal. | Sondage dans les groupes Facebook/Reddit de parents (r/NewParents). | "Privacy" classé dans le Top 2 des critères d'achat. |
| Le PDF local est suffisant pour le pédiatre (pas besoin de format HL7/FHIR). | Interviews de 5 pédiatres avec un échantillon de PDF généré. | 5/5 pédiatres confirment que le format est lisible et utile. |
| Le mode Nuit OLED réduit réellement la fatigue visuelle nocturne. | Test utilisateur en environnement sombre (simulé). | 90% des testeurs préfèrent l'UI OLED à l'UI "Dark Mode" classique (gris foncé). |

RISQUES PRODUIT
| Risque | Probabilité | Impact | Mitigation |
| --- | --- | --- | --- |
| Churn Naturel : Les utilisateurs désinstallent l'app après 12-18 mois quand le bébé fait ses nuits. | Élevée | Moyen | Le modèle Lifetime (Achat unique) maximise la LTV dès le jour 1. Pas de dépendance à la rétention long-terme pour la rentabilité. |
| Perte de données : L'utilisateur change de téléphone et perd tout l'historique local. | Moyenne | Élevé | COUVERT AU MVP par la Feature 5 (Backup Local Chiffré export + import), complété par les couches OS (iCloud Backup, Android Auto Backup) et le rappel notification J30. Voir annexe technique section 8. |
| Rejet Store (Apple/Google) : L'app est perçue comme un dispositif médical non certifié. | Moyenne | Élevé | Disclaimer strict dans les stores et au premier lancement : "Journal de suivi, non médical. Ne remplace pas un avis pédiatrique." |
| Complexité Sync Partenaire : Le QR Code Delta est trop complexe à utiliser pour des parents fatigués. | Moyenne | Moyen | Repoussé en V1.1. Au MVP, l'app est strictement mono-device pour garantir la stabilité. |
| Concurrence Déloyale : Huckleberry baisse ses prix ou lance un mode "Privacy". | Faible | Moyen | Miser sur la rapidité d'exécution (Time-to-Market < 6 semaines) et le positionnement "Anti-Abonnement" radical. |

PASSATION AU GPT 3
Features à forte valeur monétisable (candidates premium / Lifetime) :
Export PDF Médical Illimité et Historique > 7 jours.
Algorithme de Prédiction de Sommeil "SweetSpot" Local : CONSTRUIT AU MVP, GATÉ PREMIUM AU LANCEMENT (teaser free après 3 jours de données).
Mode "Nounou" (V2.0).
Note : Le modèle Lifetime (29.99 dollars) est fortement recommandé pour s'aligner sur le cycle de vie court du besoin.

Features à fort volume d'usage (candidates ads non intrusifs) :
Écran de statistiques diurnes (cost-per-wear des couches, heures totales de sommeil).
Attention stricte : ZÉRO publicité sur les écrans de tracking nocturne ou les timelines. Les ads doivent être contextuels (ex : marques de couches écologiques, assurance vie) et affichés uniquement lors des exports ou sur le dashboard de jour. Arbitrage soumis au GPT 3 : option zéro ad absolu ou rewarded-only à trancher pour cohérence éthique.

Features gratuites obligatoires pour la rétention (Free Tier) :
Tracking 1-Tap illimité (Feed, Sleep, Diaper).
UI "Nuit" OLED et Haptique.
Timeline visuelle des 7 derniers jours.
Sauvegarde locale et Export fichier de backup chiffré : JAMAIS paywallé (règle éthique, données jamais prises en otage).

CHANGELOG v2 (corrections appliquées)
Périmètre MVP : 4 features / 7.5 sem. → 5 features / 8.0 sem. (ajout Feature 5 Backup Local Chiffré).
RICE : ligne Backup ajoutée (16.0, classification MVP risk-driven, note explicative).
Matrice comparative : ligne Backup Local Chiffré ajoutée.
Prédiction SweetSpot : mention explicite "construite au MVP, gatée premium au lancement" (résumé, périmètre, Feature 3, passation).
JTBD et métriques : ajout du JTBD backup et de la métrique "taux de backup réalisé J30".
Risque "Perte de données" : mitigation désormais couverte par une feature livrée au MVP (cohérence périmètre/risques).
Roadmap V1.1 : intégration Google Drive optionnelle ajoutée (commodité premium, jamais obligatoire).
Hors périmètre définitif : paywall sur backup/export explicitement interdit.

Rappel à l'utilisateur : Ce document 02-product-strategy.md (v2) est complet et prêt. Veuillez le transmettre au GPT 3 (Monetization Strategist) comme input, accompagné de 01-market-research.md et de 02-annexe-technique.md, en portant une attention particulière à la section PASSATION AU GPT 3 pour qu'il définisse la stratégie de pricing Lifetime, les paliers Freemium, le gating de la prédiction SweetSpot, et les emplacements d'ads éthiques.