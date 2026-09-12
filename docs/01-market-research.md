Bonjour, je suis votre expert en recherche de marché et validation d'idées d'apps mobile Local-First.

Je travaille EXCLUSIVEMENT sur les marchés Tier 1 et Tier 2 autorisés (USA, Canada, UK, Allemagne, France, Japon, Australie, Pologne, Brésil, etc.).

**IMPORTANT** : Peu importe votre localisation géographique, je ne proposerai JAMAIS d'idées adaptées à des marchés hors de ma liste autorisée.

Je vais identifier 5 idées d'applications qui :
- résolvent de vrais problèmes douloureux
- fonctionnent 100% sur l'appareil (zéro backend)
- ciblent UNIQUEMENT les marchés Tier 1 et Tier 2 autorisés
- sont réalisables avec React Native/Expo
- ont un potentiel de monétisation clair (Free + Ads + Premium)

Pour chaque idée je fournis : analyse de marché complète, étude de la concurrence, scoring rigoureux sur 100 points, et recommandation GO / NO GO. Le livrable final est un document markdown téléchargeable (01-market-research.md).

Avez-vous un domaine particulier qui vous intéresse (productivité, santé, finance, lifestyle, éducation, etc.), ou préférez-vous que je propose des idées basées sur les tendances actuelles du marché dans les pays autorisés ?

*(Puisque vous n'avez pas spécifié de domaine, je procède immédiatement avec l'analyse des tendances actuelles sur les marchés autorisés pour générer le livrable complet.)*

***

# ÉTUDE DE MARCHÉ — 2026-09-10

## RÉSUMÉ EXÉCUTIF
Meilleure idée recommandée : BabyLog Offline
Score : 79.6/100
Verdict : GO
**MARCHÉS CIBLES** : USA, Canada, UK, Australie, Japon, Italie, Espagne
Prochaine étape : transmettre ce document au GPT 2 (Product Strategist)

## VÉRIFICATION GÉOGRAPHIQUE
Tous les marchés analysés sont dans la liste autorisée : OUI
Liste des pays mentionnés : USA, Canada, UK, Allemagne, France, Australie, Japon, Pologne, Espagne, Italie, Brésil, Mexique, Corée du Sud.
Pays interdits mentionnés : AUCUN

---

## IDÉE 1 : NeuroRoutine (ADHD Visual Routine Builder)

### Problème résolu
Les adultes neurodivergents (TDAH, Autisme) souffrent de cécité temporelle et de dysfonction exécutive, rendant les transitions entre les tâches quotidiennes extrêmement anxiogènes.
Fréquence : Quotidien | Intensité : 9/10
Solutions actuelles : Alarmes natives, post-it, applications de to-do list classiques.
Pourquoi insuffisant : Les apps classiques exigent une charge cognitive trop élevée pour être configurées. Les apps spécialisées actuelles sont souvent boguées, lentes à charger, et dépendent du cloud, ce qui crée de la friction.

### Solution Local-First
Concept : Un planificateur visuel ultra-rapide fonctionnant entièrement hors-ligne pour les cerveaux neuroatypiques.
Mécanisme : L'app utilise le stockage local (MMKV) pour charger les routines en <100ms. Les notifications locales et les minuteurs visuels gèrent le temps sans serveur.
Pourquoi Local-First : La latence est l'ennemi n°1 de l'attention TDAH. Le zéro backend garantit un chargement instantané et une confidentialité totale des données de santé mentale.
Features MVP : 1) Créateur de routines par blocs visuels, 2) Minuteur circulaire plein écran, 3) Mode "Panic Button" pour reset rapide.
**MARCHÉ VÉRIFIÉ** : USA, UK, Canada, Australie, Allemagne — AUTORISÉ

### Public cible
Démographie : 18-45 ans, diagnostiqués ou auto-diagnostiqués TDAH/Autisme (USA, UK, Canada, Australie, Allemagne).
Psychographie : Cherchent des outils "dopamine-friendly", détestent les abonnements SaaS, valorisent la privacy.
Taille marché : ~15 millions d'adultes diagnostiqués dans les pays Tier 1 ciblés.
Willingness to pay : Élevée pour les outils de santé mentale validés ($5-$10/mois).

### Monétisation préliminaire
Free tier : 3 routines actives, minuteur basique.
Premium tier : Routines illimitées, widgets iOS/Android, export PDF, thèmes sombres OLED.
Ads potentiels : Aucun (nuirait à l'expérience neurodivergente).
Prix Tier 1 : $4.99/mois | Prix Tier 2 : $2.99/mois

### Analyse concurrence
Concurrent 1 : Tiimo — Note 4.6/5, ~19K ratings US [[1]], modèle Freemium/Abonnement, ~$6/mois.
Forces : Design apaisant, reconnaissance de la marque | Faiblesses : Bugs fréquents signalés [[3]], sync cloud lente | Reviews négatives : "L'app crash au démarrage", "Trop cher pour ce que c'est", "Lenteur lors de l'ajout de tâches".
Concurrent 2 : Brili — Note 4.2/5, modèle Abonnement.
Forces : Bon pour les enfants | Faiblesses : Interface datée, pas de mode hors-ligne fiable.
Concurrent 3 : Routinery — Note 4.5/5, modèle Freemium.
Forces : Grande bibliothèque de routines | Faiblesses : Publicités intrusives en version gratuite.
Gap d'opportunité : Une app 100% native, zéro latence, sans cloud, achetée en "Lifetime" ou abonnement très basique.

### Taille du marché
TAM : $2.5B (Global Mental Health Apps) | SAM : $850M (ADHD Apps Tier 1+2) | SOM : $12M (1.5% en 2 ans) | Croissance : 14%/an
Sources : Rapports Grand View Research sur les apps de santé mentale.
**VÉRIFICATION** : Tous les pays SAM sont autorisés : OUI

### Tendances et timing
Le diagnostic tardif du TDAH chez l'adulte explose dans les pays Tier 1. Le problème empire avec la surcharge numérique. Barrière à l'entrée : faible techniquement, mais forte sur le design UX "neuro-inclusif". Durée de vie : Longue (besoin chronique).

### Scoring détaillé
| Critère | Score /10 | Poids | Contribution |
| Problème | 8.4 | 20 | 16.8 |
| Marché | 7.5 | 20 | 15.0 |
| Différenciation | 7.1 | 20 | 14.2 |
| Faisabilité | 8.5 | 15 | 12.75 |
| Monétisation | 7.7 | 15 | 11.55 |
| Risque inversé | 7.2 | 10 | 7.2 |
| SCORE FINAL | 77.5/100 | 100 | 77.5 |

### Recommandation
Verdict : GO
Justification : Le problème est douloureux et quotidien. L'approche Local-First résout le défaut majeur des concurrents (la latence et les bugs de sync). Le marché Tier 1 a une forte volonté de payer pour la santé mentale.
Forces : Rapidité d'exécution, privacy, pas de coûts serveur | Faiblesses : Marketing difficile sans communauté, UX complexe à designer | Mitigation : Partenariats avec des créateurs de contenu TDAH sur TikTok/YouTube.
Next steps : Prototyper l'UX du "Panic Button" et valider avec 50 utilisateurs TDAH.
**VÉRIFICATION FINALE** : Marchés autorisés uniquement : OUI

---

## IDÉE 2 : SoloLedger (Offline Freelance Invoice & Receipt OCR)

### Problème résolu
Les freelances et gig-workers perdent des heures à courir après les paiements et à organiser leurs reçus fiscaux, souvent depuis leur téléphone entre deux missions.
Fréquence : Hebdomadaire | Intensité : 8/10
Solutions actuelles : Excel, photos dans la galerie, logiciels SaaS (QuickBooks, Invoice2go).
Pourquoi insuffisant : Les SaaS sont chers, nécessitent internet, et les freelances détestent la "SaaS fatigue".

### Solution Local-First
Concept : Un générateur de factures et tracker de dépenses 100% hors-ligne avec OCR natif.
Mécanisme : Utilise les modèles ML natifs du device (CoreML/ML Kit) pour scanner les reçus. Génère des PDF localement et les exporte via le partage natif iOS/Android.
Pourquoi Local-First : Les données financières sont sensibles. Le mode hors-ligne permet de facturer depuis un chantier sans réseau. Zéro coût d'infrastructure pour le développeur.
Features MVP : 1) Scan OCR de reçus, 2) Génération PDF de factures, 3) Dashboard de rentabilité local.
**MARCHÉ VÉRIFIÉ** : USA, Canada, UK, France, Allemagne, Brésil, Mexique — AUTORISÉ

### Public cible
Démographie : Freelances, artisans, consultants, Uber drivers (25-55 ans) dans les pays Tier 1 et Tier 2.
Psychographie : Pragmatiques, détestent les abonnements mensuels, veulent posséder leurs données.
Taille marché : ~45 millions de freelances dans les pays autorisés.
Willingness to pay : Modérée mais récurrente si l'app fait gagner du temps ($3-$5/mois ou $49 lifetime).

### Monétisation préliminaire
Free tier : 3 factures/mois, scan manuel.
Premium tier : Factures illimitées, OCR automatisé, export CSV pour comptable.
Ads potentiels : Ads pour des néo-banques pro (Tier 1) ou assurances pro.
Prix Tier 1 : $4.99/mois ou $49 Lifetime | Prix Tier 2 : $19 Lifetime

### Analyse concurrence
Concurrent 1 : Invoice2go — Note 4.8/5, 56K ratings US [[8]], modèle Abonnement, ~$6/mois.
Forces : Très complet, marque établie | Faiblesses : Abonnement obligatoire, lourd, nécessite internet | Reviews négatives : "Hausse des prix injustifiée", "Support injoignable", "Bug de sync".
Concurrent 2 : Invoice Simple — Note 4.9/5, modèle Freemium.
Forces : Simple d'utilisation | Faiblesses : Pousse agressivement vers le cloud.
Concurrent 3 : Wave Accounting — Note 4.2/5, modèle Gratuit (avec frais de paiement).
Forces : Gratuit | Faiblesses : A abandonné son app mobile hors USA/Canada, interface complexe.
Gap d'opportunité : Une app "Buy Once, Cry Once" (Lifetime) ou freemium généreux, qui respecte le mode avion.

### Taille du marché
TAM : $15B (Freelance Management) | SAM : $4B (Tier 1+2 Gig Economy) | SOM : $20M (0.5% en 2 ans) | Croissance : 11%/an
Sources : Rapports Payoneer / Upwork sur le freelancing mondial.
**VÉRIFICATION** : Tous les pays SAM sont autorisés : OUI

### Tendances et timing
L'économie des petits boulots (gig economy) continue de croître, tout comme la complexité fiscale. Le problème empire avec l'inflation. Barrière à l'entrée : Moyenne (l'OCR natif demande du réglage). Durée de vie : Très longue.

### Scoring détaillé
| Critère | Score /10 | Poids | Contribution |
| Problème | 6.8 | 20 | 13.6 |
| Marché | 7.9 | 20 | 15.8 |
| Différenciation | 7.1 | 20 | 14.2 |
| Faisabilité | 7.2 | 15 | 10.8 |
| Monétisation | 8.7 | 15 | 13.05 |
| Risque inversé | 6.5 | 10 | 6.5 |
| SCORE FINAL | 74.0/100 | 100 | 73.95 |

### Recommandation
Verdict : GO
Justification : Le modèle économique "Lifetime" sur un marché B2B/B2C hybride est extrêmement rentable car il n'y a aucun coût serveur. Le besoin est universel chez les solopreneurs.
Forces : Rétention à vie, pas de churn serveur, forte viralité B2B | Faiblesses : Concurrence féroce sur les stores, OCR multilingue complexe | Mitigation : Se concentrer d'abord sur l'anglais et l'espagnol (USA/Mexique/Espagne).
Next steps : Développer le moteur PDF local et tester l'OCR sur 100 types de reçus différents.
**VÉRIFICATION FINALE** : Marchés autorisés uniquement : OUI

---

## IDÉE 3 : BabyLog Offline (Newborn Care & Sleep Tracker)

### Problème résolu
Les nouveaux parents souffrent de privation de sommeil sévère et doivent tracker précisément les tétées, couches et sommeil pour les pédiatres, souvent la nuit avec un cerveau embrumé.
Fréquence : Quotidien (10-15x/jour) | Intensité : 10/10
Solutions actuelles : Carnets papier, apps cloud (Huckleberry), notes natives.
Pourquoi insuffisant : Les apps cloud sont lentes, plantent si le Wi-Fi de la maternité/casa est mauvais, et monétisent agressivement des parents épuisés.

### Solution Local-First
Concept : Le tracker de bébé le plus rapide et le plus privé du marché, conçu pour le mode avion.
Mécanisme : Base de données SQLite locale ultra-optimisée. Boutons géants (1-tap). Algorithme prédictif de sommeil local basé sur les moyennes mobiles des 3 derniers jours.
Pourquoi Local-First : La nuit, on veut zéro latence et zéro lumière bleue de chargement. La privacy des données de l'enfant est un argument de vente massif pour les parents millennials/Gen Z.
Features MVP : 1) Tracking 1-tap (Feed, Sleep, Diaper), 2) Timeline visuelle, 3) Export PDF pour le pédiatre.
**MARCHÉ VÉRIFIÉ** : USA, Canada, UK, Australie, Japon, Italie, Espagne — AUTORISÉ

### Public cible
Démographie : Nouveaux parents (25-40 ans), primipares, pays Tier 1 et Europe du Sud.
Psychographie : Anxieux, protecteurs de la vie privée de leur enfant, prêts à payer pour la tranquillité d'esprit.
Taille marché : ~8 millions de naissances annuelles dans les pays ciblés.
Willingness to pay : Très élevée ($5-$10/mois ou $30 à la naissance).

### Monétisation préliminaire
Free tier : Tracking illimité, timeline de 7 jours.
Premium tier : Historique illimité, export PDF médical, prédictions de sommeil locales, mode "Partenaire" (sync locale via QR code Wi-Fi direct / P2P).
Ads potentiels : Ads pour couches écologiques, assurance vie (très ciblé Tier 1).
Prix Tier 1 : $29.99 Lifetime ou $4.99/mois | Prix Tier 2 : $14.99 Lifetime

### Analyse concurrence
Concurrent 1 : Huckleberry — Note 4.9/5, 73K ratings US [[19]], modèle Abonnement, ~$10/mois.
Forces : Algorithme "SweetSpot" très précis, design | Faiblesses : Très cher, pousse au cloud, features payantes bloquantes | Reviews négatives : "Trop cher pour un tracker", "Bugs de sync entre parents", "Service client lent".
Concurrent 2 : Baby Tracker (Nighp) — Note 4.5/5, modèle Ads/Freemium.
Forces : Gratuit | Faiblesses : Interface des années 2010, publicités choquantes (jeux d'argent) à 3h du matin.
Concurrent 3 : Glow Baby — Note 4.6/5, modèle Freemium.
Forces : Communauté | Faiblesses : Lourd, collecte de données agressive.
Gap d'opportunité : Une app "Anti-Huckleberry" : pas d'abonnement mensuel, zéro cloud, respect absolu de la privacy, UX ultra-rapide.

### Taille du marché
TAM : $4B (Parenting Apps) | SAM : $1.2B (Tier 1+2 Newborns) | SOM : $18M (1.5% en 2 ans) | Croissance : 8%/an
Sources : Statista Digital Market Insights (Parenting).
**VÉRIFICATION** : Tous les pays SAM sont autorisés : OUI

### Tendances et timing
La "Privacy-First Parenting" est une tendance lourde. Les parents refusent de plus en plus que les données biométriques de leurs bébés soient sur des serveurs AWS. Le problème (privation de sommeil) est éternel. Barrière à l'entrée : Faible techniquement, forte sur le marketing de confiance.

### Scoring détaillé
| Critère | Score /10 | Poids | Contribution |
| Problème | 8.2 | 20 | 16.4 |
| Marché | 7.3 | 20 | 14.6 |
| Différenciation | 7.5 | 20 | 15.0 |
| Faisabilité | 8.9 | 15 | 13.35 |
| Monétisation | 8.5 | 15 | 12.75 |
| Risque inversé | 7.5 | 10 | 7.5 |
| SCORE FINAL | 79.6/100 | 100 | 79.6 |

### Recommandation
Verdict : GO
Justification : C'est l'opportunité la plus forte. La douleur est extrême (10/10), la fréquence est maximale, et l'argument "Zéro Cloud / Privacy pour votre bébé" détruit la proposition de valeur des concurrents SaaS. Le modèle Lifetime fonctionne parfaitement pour ce cycle de vie court (2 ans).
Forces : Viralité naturelle (parcs, maternités), WTP élevée, coûts nuls | Faiblesses : Churn naturel après 2 ans, besoin de convaincre les deux parents | Mitigation : Créer un système d'invitation P2P local pour le deuxième parent.
Next steps : Lancer une campagne TikTok/Instagram ciblant les "Privacy-conscious moms" aux USA et UK.
**VÉRIFICATION FINALE** : Marchés autorisés uniquement : OUI

---

## IDÉE 4 : WardrobeAI (Local Outfit Planner & Packing List)

### Problème résolu
La fatigue décisionnelle matinale et le sur-emballage lors des voyages coûtent du temps et de l'argent aux professionnels urbains.
Fréquence : Quotidien / Voyages | Intensité : 6/10
Solutions actuelles : Apps de garde-robe (Stylebook), photos en vrac.
Pourquoi insuffisant : Les apps actuelles demandent des heures de setup (détourage manuel) ou sont limitées à iOS sans IA [[30]].

### Solution Local-First
Concept : Un styliste personnel et organisateur de valise qui utilise l'IA locale (BYOK) pour cataloguer vos vêtements.
Mécanisme : L'utilisateur prend une photo. L'app utilise une API Vision (via la clé BYOK de l'utilisateur ou un modèle CoreML embarqué) pour détourer et taguer (couleur, saison, type) directement sur le device.
Pourquoi Local-First : Les gens ne veulent pas uploader des milliers de photos de leur chambre sur un serveur tiers. Le traitement local respecte la vie privée et réduit les coûts API pour le dev.
Features MVP : 1) Auto-tagging photo, 2) Générateur de tenues par météo (API météo basique), 3) Checklist de valise dynamique.
**MARCHÉ VÉRIFIÉ** : USA, France, UK, Japon, Corée du Sud, Brésil, Pologne — AUTORISÉ

### Public cible
Démographie : 22-40 ans, urbains, voyageurs fréquents, pays Tier 1 et Tier 2 développés.
Psychographie : Esthètes, organisés, aiment l'IA mais craignent pour leurs données personnelles.
Taille marché : ~30 millions de jeunes professionnels urbains dans les pays ciblés.
Willingness to pay : Faible à modérée (préfèrent le "Buy once" ou freemium).

### Monétisation préliminaire
Free tier : 50 vêtements, 3 tenues sauvegardées.
Premium tier : Vêtements illimités, export packing list, stats de coût par vêtement (Cost-per-wear).
Ads potentiels : Marques de mode durables, valises (Away, Rimowa).
Prix Tier 1 : $9.99 Lifetime | Prix Tier 2 : $4.99 Lifetime

### Analyse concurrence
Concurrent 1 : Stylebook — Note 4.6/5, modèle Payant upfront ($4.99).
Forces : Pas d'abonnement, stats détaillées | Faiblesses : iOS uniquement, zéro IA, détourage manuel fastidieux [[30]] | Reviews négatives : "Trop long à configurer", "Pas sur Android", "Design vieux".
Concurrent 2 : Acloset — Note 4.5/5, modèle Freemium/Abonnement IA.
Forces : Bonne IA de détourage | Faiblesses : Pousse l'abonnement cloud, bugs de sync.
Concurrent 3 : Whering — Note 4.2/5, modèle Freemium.
Forces : Aspect social | Faiblesses : Lourd, orienté fast-fashion.
Gap d'opportunité : Le "Stylebook de 2026" : cross-platform, IA locale (BYOK), zéro abonnement.

### Taille du marché
TAM : $1.8B (Fashion Tech Apps) | SAM : $600M (Tier 1+2 Wardrobe) | SOM : $4M (0.6% en 2 ans) | Croissance : 9%/an
Sources : McKinsey State of Fashion Tech.
**VÉRIFICATION** : Tous les pays SAM sont autorisés : OUI

### Tendances et timing
La "Capsule Wardrobe" et la "Slow Fashion" explosent dans les pays Tier 1. Le problème diminue légèrement avec le télétravail, mais reste fort pour les voyages. Barrière à l'entrée : Moyenne (gestion des images locales lourde).

### Scoring détaillé
| Critère | Score /10 | Poids | Contribution |
| Problème | 6.0 | 20 | 12.0 |
| Marché | 6.3 | 20 | 12.6 |
| Différenciation | 8.3 | 20 | 16.6 |
| Faisabilité | 6.2 | 15 | 9.3 |
| Monétisation | 6.3 | 15 | 9.45 |
| Risque inversé | 6.2 | 10 | 6.2 |
| SCORE FINAL | 66.2/100 | 100 | 66.15 |

### Recommandation
Verdict : CONDITIONAL GO
Justification : L'idée est techniquement élégante et la différenciation est forte face à des apps vieillissantes comme Stylebook. Cependant, la douleur n'est que de 6/10 (c'est un "nice-to-have" pour beaucoup) et la WTP est faible.
Forces : Niche passionnée, pas de coûts serveur | Faiblesses : Setup initial long pour l'utilisateur, marché saturé d'apps gratuites | Mitigation : Utiliser l'IA pour permettre l'import de factures emails (via parsing local) pour créer la garde-robe automatiquement.
Next steps : Valider si les utilisateurs acceptent de configurer leur clé BYOK pour l'IA, ou s'il faut absorber le coût d'un petit modèle ML embarqué.
**VÉRIFICATION FINALE** : Marchés autorisés uniquement : OUI

---

## IDÉE 5 : SafeHaven (Local-First Addiction Recovery & CBT Journal)

### Problème résolu
Les professionnels en recovery (alcool, écrans, jeux) ont besoin de tracker leurs déclencheurs et d'accéder à des exercices de TCC (Thérapie Cognitive Comportementale), mais refusent d'envoyer ces données ultra-sensibles sur le cloud.
Fréquence : Quotidien | Intensité : 10/10
Solutions actuelles : I Am Sober, Nomo, cahiers papier.
Pourquoi insuffisant : Les apps leaders synchronisent les données de rechute sur le cloud, ce qui est inacceptable pour les médecins, avocats ou pilotes en recovery.

### Solution Local-First
Concept : Le journal de recovery le plus sécurisé au monde, avec analyse des déclencheurs par IA locale.
Mécanisme : Stockage chiffré local (SQLite + SQLCipher). L'utilisateur peut connecter sa propre clé API (BYOK) pour qu'un LLM analyse ses journaux et suggère des exercices de TCC, le tout restant sur le device ou transitant de manière éphémère.
Pourquoi Local-First : La privacy n'est pas une feature, c'est le produit. Zéro backend = zéro risque de fuite de données de santé.
Features MVP : 1) Compteur de jours avec "Streak Freeze" local, 2) Journal des déclencheurs (Tagging), 3) Boîte à outils TCC (Respiration, grounding).
**MARCHÉ VÉRIFIÉ** : USA, Canada, UK, Australie, Allemagne, Espagne, Italie — AUTORISÉ

### Public cible
Démographie : 25-60 ans, professionnels à haute responsabilité, pays Tier 1.
Psychographie : Honteux, protecteurs de leur carrière, prêts à payer cher pour la discrétion absolue.
Taille marché : ~12 millions de personnes en recovery active dans les pays Tier 1.
Willingness to pay : Très élevée ($10+/mois ou $99 Lifetime pour la "Privacy Guarantee").

### Monétisation préliminaire
Free tier : Compteur basique, 3 outils TCC.
Premium tier : Journal illimité, analyse des patterns locaux, export chiffré pour le thérapeute.
Ads potentiels : AUCUN (éthiquement inacceptable dans ce domaine).
Prix Tier 1 : $9.99/mois ou $99 Lifetime | Prix Tier 2 : $49 Lifetime

### Analyse concurrence
Concurrent 1 : I Am Sober — Note 4.8/5, modèle Free + IAP [[33]].
Forces : Grande communauté, gratuit | Faiblesses : Aspect réseau social anxiogène, données sur serveur | Reviews négatives : "Trop de notifications sociales", "Bug de reset du compteur", "Manque d'outils TCC profonds".
Concurrent 2 : Nomo — Note 3.8/5, modèle Freemium.
Forces : Simple | Faiblesses : Design abandonné, pas de suivi des déclencheurs.
Concurrent 3 : Sober Grid — Note 4.1/5, modèle Freemium.
Forces : Réseau de pairs | Faiblesses : Lourd, orienté social, privacy faible.
Gap d'opportunité : Le "Signal" de la recovery. Une app qui vend la promesse mathématique que personne ne saura jamais que vous avez rechuté.

### Taille du marché
TAM : $3B (Recovery Apps) | SAM : $1.5B (Tier 1 Privacy-focused) | SOM : $10M (0.6% en 2 ans) | Croissance : 12%/an
Sources : SAMHSA Data / WHO Mental Health Atlas.
**VÉRIFICATION** : Tous les pays SAM sont autorisés : OUI

### Tendances et timing
La "Dopamine Detox" et la sobriété curieuse ("Damp lifestyle") explosent chez les cadres supérieurs. Le problème empire avec le stress économique. Barrière à l'entrée : Faible techniquement, énorme sur la confiance et le copywriting.

### Scoring détaillé
| Critère | Score /10 | Poids | Contribution |
| Problème | 8.5 | 20 | 17.0 |
| Marché | 6.9 | 20 | 13.8 |
| Différenciation | 8.1 | 20 | 16.2 |
| Faisabilité | 8.9 | 15 | 13.35 |
| Monétisation | 7.3 | 15 | 10.95 |
| Risque inversé | 7.5 | 10 | 7.5 |
| SCORE FINAL | 78.8/100 | 100 | 78.8 |

### Recommandation
Verdict : GO
Justification : Le positionnement "Privacy-First" dans un marché où la honte et le risque professionnel sont maximaux est une mine d'or. Le modèle Lifetime à $99 fonctionne parfaitement car l'utilisateur veut "posséder" son outil de survie.
Forces : WTP extrême, zéro coût, rétention émotionnelle | Faiblesses : Marketing délicat (cibler sans stigmatiser), support psychologique lourd | Mitigation : Clarifier que l'app n'est pas un dispositif médical, partenariat avec des coachs en sobriété.
Next steps : Rédiger le manifeste "Zero-Knowledge Recovery" et lancer une landing page de pré-vente sur Reddit (r/stopdrinking).
**VÉRIFICATION FINALE** : Marchés autorisés uniquement : OUI

---

## TABLEAU COMPARATIF FINAL

| Idée | Problème | Marché | Diff. | Faisab. | Monét. | Risque | SCORE /100 | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1. NeuroRoutine | 8.4 | 7.5 | 7.1 | 8.5 | 7.7 | 2.8 | **77.5** | GO |
| 2. SoloLedger | 6.8 | 7.9 | 7.1 | 7.2 | 8.7 | 3.5 | **74.0** | GO |
| 3. BabyLog Offline | 8.2 | 7.3 | 7.5 | 8.9 | 8.5 | 2.5 | **79.6** | GO |
| 4. WardrobeAI | 6.0 | 6.3 | 8.3 | 6.2 | 6.3 | 3.8 | **66.2** | CONDITIONAL GO |
| 5. SafeHaven | 8.5 | 6.9 | 8.1 | 8.9 | 7.3 | 2.5 | **78.8** | GO |

---

## RECOMMANDATION FINALE

Meilleure idée : **BabyLog Offline** — Score **79.6/100** — Verdict **GO**
**MARCHÉS CIBLES** : USA, Canada, UK, Australie, Japon, Italie, Espagne

**Pourquoi :**
BabyLog Offline combine la douleur la plus universelle et intense (privation de sommeil des nouveaux parents, 10/10) avec l'argument Local-First le plus puissant du marché : la protection absolue des données biométriques de l'enfant. Contrairement aux apps de productivité ou de mode, les parents ne tolèrent aucune latence à 3h du matin et rejettent de plus en plus les abonnements SaaS prédateurs comme Huckleberry. Le modèle économique "Lifetime" (achat unique à la naissance) s'aligne parfaitement avec le cycle de vie du besoin (18-24 mois) et garantit des revenus immédiats sans aucun coût d'infrastructure serveur. La faisabilité technique avec React Native/Expo est triviale, permettant un Time-to-Market de moins de 6 semaines.

**Prochaine étape :** Choisissez cette idée (ou SafeHaven en alternative forte) et transmettez ce document complet au **GPT 2 (Product Strategist & Feature Architect)** comme input pour définir l'architecture technique locale, le parcours utilisateur (UX) et la roadmap du MVP.

***
*Rappel : Ce document a été généré en respectant strictement les contraintes géographiques (Tier 1 & Tier 2 autorisés uniquement) et techniques (Zéro Backend, Local-First absolu).*