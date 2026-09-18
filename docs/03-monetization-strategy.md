# STRATÉGIE DE MONÉTISATION CORRIGÉE — BabyLog Offline — 2026-06-15

Document destinataire : **GPT 4 — Tech Stack Architect**  
Objet : stratégie de monétisation finale corrigée, exploitable techniquement, sans backend obligatoire, Local-First, sans publicité, avec trial local strict, pricing unifié et projections prudentes.

---

## 1. VERDICT D’AUDIT

Verdict : **VALIDÉ SOUS RÉSERVES — CORRECTIONS OBLIGATOIRES APPLIQUÉES**

Score global : **84/100**

Résumé critique :

La stratégie initiale était solide sur la conformité, le Local-First et le rejet des publicités, mais elle n’était pas alignée avec les exigences finales : free trop généreux, absence de trial, pricing segmenté entre Groupe A et Groupe B, projections trop optimistes après correction du pricing. La version corrigée impose un free strict de type trial : essai Premium local de 72 heures, puis free minimal limité à 1 profil actif et aux dernières 24 heures. Le pricing est unifié sur le Groupe B, soit $39.99 annuel et $99.99 lifetime. Les publicités sont définitivement exclues. La conversion réaliste est abaissée à 2.5 % pour tenir compte du prix plus élevé et du free strict. Le RPI 30 jours réaliste est de $1.32. Le modèle reste viable, mais la conversion, le paywall et la clarté du trial devront être exécutés avec rigueur.

---

## 2. SCORE PAR AXE

| Axe | Score | Commentaire |
|---|---:|---|
| Conformité App Store / Play Store | 16/20 | IAP, restore, transparence, absence de dark pattern. Vigilance sur trial local, mentions claires et absence de confusion avec un abonnement payant. |
| Local-First | 13/15 | Entitlements locaux, paywall local, aucun serveur obligatoire. Ajout imposé : gestion robuste du trial local, flag persistant best-effort et offline grace. |
| Segmentation Free / Premium | 7/15 | Free initial trop généreux. Correction : trial 72h puis free strict, timeline 24h, pas d’export, pas de backup chiffré, pas de co-parenting. |
| Quota et BYOK | 8/10 | BYOK optionnel futur seulement. Quota local imposé si IA activée. Transparence obligatoire sur limites API externes. |
| Stratégie publicitaire | 15/15 | Aucune publicité. Décision conforme au positionnement privacy, données nourrisson, UX nocturne et documents sources. |
| Paywall | 6/10 | Paywall initial insuffisamment articulé autour du trial. Correction : paywall de fin de trial, paywall contextuel sur action premium, fermeture visible. |
| Pricing | 2/10 | Pricing initial segmenté et trop bas pour Groupe A. Correction imposée : tarif unifié aligné sur Groupe B. |
| Projections financières | 5/10 | Projections initiales basées sur pricing segmenté et conversion 3 %. Correction : conversion réaliste 2.5 %, ARPPU recalculé. |
| KPIs et instrumentation | 4/5 | Base locale solide. Ajout des événements trial, trial_start, trial_end, trial_conversion, history_limit_reached, premium_feature_attempted. |
| Géographie et marchés | 8/10 | Whitelist respectée. Disponibilité store doit être strictement limitée aux marchés autorisés. |
| TOTAL | 84/100 | Document corrigé exploitable par le GPT 4. |

---

## 3. PROBLÈMES DÉTECTÉS ET CORRECTIONS IMPOSÉES

| Problème | Gravité | Section | Correction imposée | Impact attendu |
|---|---|---|---|---|
| Free tier trop généreux : historique 7 jours, tracking illimité perçu comme produit gratuit complet. | Majeure | Segmentation Free / Premium | Free transformé en trial local 72h puis free minimal : timeline limitée aux dernières 24h, 1 profil actif, aucun export, aucun backup chiffré, aucun co-parenting. | Augmente la conversion vers premium sans bloquer l’action cœur. |
| Absence de trial alors que le free doit servir de trial. | Majeure | Free / Paywall | Essai Premium local de 72h, sans paiement, sans carte, sans renouvellement automatique, activation manuelle. | Démontre la valeur premium puis crée le besoin. |
| Pricing non unifié entre Groupe A et Groupe B. | Critique | Pricing | Tarif unique aligné sur Groupe B : $39.99 annuel / $99.99 lifetime. | Augmente ARPPU et respecte la contrainte d’unification. |
| Conversion réaliste de 3 % trop optimiste après hausse tarifaire. | Majeure | Projections | Conversion réaliste abaissée à 2.5 %. | Projections plus prudentes. |
| Risque de réinstallation pour obtenir un nouveau trial. | Majeure | Trial / Local-First | Activation manuelle + flag local + flag sécurisé best-effort Keychain/Keystore + restauration du statut si backup. | Réduit l’abus sans tracking ni backend. |
| Publicités incompatibles avec données nourrisson et positionnement privacy. | Critique | Publicité | Aucune publicité, aucun SDK ad, aucun tracking publicitaire. | Conformité, confiance, UX. |
| Paywall trop faible ou mal déclenché. | Majeure | Paywall | Paywall de fin de trial, paywall sur tentative premium, maximum 1 paywall spontané par 7 jours. | Conversion sans harcèlement. |
| Risque de perception “données prises en otage”. | Majeure | UX / Conformité | Données stockées localement, dernières 24h consultables gratuitement, Emergency Doctor Mode 24h gratuit, suppression gratuite. | Réduit frustration et avis négatifs. |
| Absence de limite géographique stricte dans l’exécution store. | Majeure | Géographie | Disponibilité App Store / Play Store limitée aux pays whitelist. | Évite trafic non qualifié, refunds, fraude, eCPM faible. |
| Trial réinitialisable en cas de désinstallation/réinstallation naïve. | Majeure | Technique | Flag `trial_claimed` local + flag sécurisé OS, best-effort. Pas de fingerprinting. | Protection raisonnable sans violer la privacy. |

---

## 4. CHOIX OPTIMISÉS PAR LE CORRECTEUR

Liste des décisions tranchées :

1. Modèle final : **Free trial local + Premium**, sans publicité.
2. Aucun SDK publicitaire, aucun AdMob, aucune rewarded ad, aucun interstitial.
3. Free strict : **essai Premium local de 72h**, puis free minimal.
4. Après trial : timeline limitée aux **dernières 24h**, 1 profil actif, pas d’export, pas de backup chiffré, pas de co-parenting, pas de stats longues, pas de prédictions.
5. Le tracking core ne doit jamais être limité en nombre d’événements par jour.
6. Pricing unifié : **$39.99 annuel** et **$99.99 lifetime** pour tous les marchés whitelist.
7. Aucun plan mensuel.
8. Lifetime conservé car cycle d’usage bébé 18-24 mois et positionnement anti-abonnement.
9. Conversion réaliste : **2.5 %**.
10. RPI 30 jours réaliste : **$1.32**.
11. Trial local protégé par flag local + flag sécurisé best-effort, sans device fingerprinting.
12. Si l’utilisateur a acheté Premium/Lifetime, restore purchases prioritaire sur le trial.
13. Disponibilité stores strictement limitée aux marchés whitelist.
14. Localisations prioritaires : EN-US/UK, FR, DE, JA, KO, AR-RTL.
15. Aucun backend obligatoire pour paywall, entitlements, trial, quota ou instrumentation.

---

## 5. DOCUMENT FINAL CORRIGÉ

### 5.1 Résumé exécutif

- Modèle demandé initialement : Free + Ads + Premium.
- Modèle corrigé imposé : **Free trial local + Premium**, sans Ads.
- Raison : données sensibles de nourrisson, usage nocturne, promesse privacy/offline, rejet des publicités dans les documents GPT 1 et GPT 2.
- Marchés autorisés : USA, Canada, UK, Australie, Nouvelle-Zélande, Suisse, Luxembourg, Norvège, Danemark, Islande, Irlande, Pays-Bas, Allemagne, France, Belgique, Autriche, Finlande, Suède, Liechtenstein, Monaco, Andorre si pertinent, Japon, Corée du Sud, Émirats Arabes Unis, Arabie Saoudite, Qatar, Koweït, Bahreïn, Oman.
- Prix recommandés unifiés :
  - Annuel : **$39.99 / an**
  - Lifetime : **$99.99**
- Aucun plan mensuel.
- North star : **RPI 30 jours**.
- Cible RPI 30 jours : **$1.30 – $1.60**.
- RPI 30 jours réaliste estimé : **$1.32**.
- Revenu annuel scénario réaliste : **~$42,500 net** avec 2,700 installs/mois.
- Seuil de viabilité utilisateur : **$2,500 à $3,500 / mois**.
- Installs requis pour atteindre le seuil : **1,895 à 2,653 installs/mois** au scénario réaliste.
- Prochaine étape : transmettre ce document au GPT 4.

---

### 5.2 Inputs reçus et limites de l’audit

Documents analysés :

1. `01-market-research.md` : BabyLog Offline validé comme meilleure idée, score 82.8/100, marchés whitelist, douleur 10/10, positionnement privacy/offline fort.
2. `02-feature-ideas-final.md` : MVP 5 features core, releases structurées, rejet des publicités, rejet des features cloud, rejet des diagnostics médicaux, BYOK optionnel futur.
3. `03-monetization-strategy.md` : stratégie Free + Premium sans ads, pricing segmenté Groupe A / Groupe B, free avec historique 7 jours, projections basées sur conversion 3 %.

Limites :

- Pas de données réelles de conversion store.
- Pas de données réelles de rétention.
- Pas de données réelles de refunds.
- Éligibilité au Small Business Program à confirmer.
- Prix localisés exacts à valider selon les paliers App Store Connect et Google Play Console.

Benchmarks utilisés :

- Conversion utility marchés haut revenu : 2 à 5 %.
- Commission store : 15 % si éligible Small Business Program, sinon 30 %.
- Refunds estimés : 3 %.
- Rétention utility solide : D1 35 %, D7 15 %, D30 7 %.
- Revenu publicitaire : $0.

---

### 5.3 Conformité App Store / Google Play

Règles imposées :

#### Achats in-app

- iOS : StoreKit / StoreKit 2.
- Android : Google Play Billing.
- Tous les biens numériques doivent passer par les achats in-app.
- Aucun lien externe pour débloquer une fonctionnalité numérique.
- Aucun contournement de paiement.

#### Abonnements

- Prix exact affiché avant achat.
- Durée annuelle affichée.
- Renouvellement automatique clairement indiqué.
- Annulation via App Store / Google Play clairement indiquée.
- Aucun prélèvement sans confirmation explicite.
- Pas de case pré-cochée.
- Pas de countdown artificiel.
- Pas de fausse urgence.
- Pas de preuve sociale inventée.

#### Lifetime

- iOS : non-consumable IAP.
- Android : one-time product.
- Mention “achat unique” claire.
- Restore purchases obligatoire.

#### Restore purchases

- Visible sur le paywall.
- Fonctionnel pour abonnement annuel.
- Fonctionnel pour lifetime.
- Fonctionnel hors ligne après restauration locale des entitlements.

#### Trial local 72h

- Essai gratuit local, sans paiement, sans carte, sans renouvellement automatique.
- Activation manuelle uniquement.
- Mention claire : “Essai Premium de 72h sans paiement”.
- Aucun achat automatique à la fin du trial.
- À la fin du trial, bascule vers free minimal.
- Paywall de fin de trial non bloquant.

#### Publicité

- Aucune publicité.
- Aucun SDK publicitaire.
- Aucun tracking publicitaire.
- Aucun identifiant publicitaire.
- Aucune ATT demandée pour usage publicitaire.

#### Privacy / données bébé

- Données stockées localement.
- Pas de backend obligatoire.
- Pas de collecte cloud automatique.
- Politique de confidentialité claire.
- Ne pas sélectionner la catégorie Kids si elle impose des contraintes non nécessaires.
- App destinée aux parents, pas directement aux enfants.
- Aucun diagnostic médical.
- Aucun claim médical non validé.

#### Free strict et non-dark pattern

- Les données locales ne sont pas supprimées si l’utilisateur ne paie pas.
- Le free permet de consulter les dernières 24h.
- Emergency Doctor Mode gratuit sur les dernières 24h.
- Suppression des données gratuite.
- Pas de blocage de l’action cœur : log tétée, sommeil, couche.
- Pas de limitation du nombre de logs par jour.

---

### 5.4 Potentiel de monétisation par feature

Formule conservée :

Score Monétisation =  
(Valeur × 0.3) +  
(Fréquence × 0.3) +  
(Difficulté × 0.2) +  
(Rétention × 0.2)

| Feature | Score indicatif | Classification corrigée | Justification |
|---|---:|---|---|
| F01 — Tracking 1-tap + timer | 9.2 | FREE CORE | Action cœur. Ne jamais limiter le nombre de logs. |
| F02 — Mode Nuit OLED | 8.2 | FREE CORE | Usage nocturne critique. Doit rester gratuit. |
| F03 — Timeline du jour | 8.5 | FREE LIMITÉ 24H | Gratuit pour les dernières 24h. Historique complet = premium. |
| F04 — Édition / suppression / undo | 8.0 | FREE CORE | Indispensable pour corriger les erreurs nocturnes. |
| F05 — Profil bébé + stockage local | 9.0 | FREE LIMITÉ | 1 profil actif en free. Profils illimités = premium. |
| F06 — Cry Predictor / fenêtre sommeil | 7.6 | PREMIUM | Valeur perçue forte. Basé sur historique local. |
| F07 — Export PDF pédiatre 7/14 jours | 7.1 | PREMIUM | ROI clair avant consultation pédiatre. |
| F08 — Emergency Doctor Mode | 6.8 | FREE 24H / PREMIUM AU-DELÀ | Consultation 24h gratuite. 48h, PDF, partage = premium. |
| F09 — Backup / restore chiffré | 7.0 | PREMIUM | Persistance locale gratuite. Export chiffré / migration = premium. |
| F10 — Co-Parent Local Transfer | 8.7 | PREMIUM | Très fort besoin. Levier premium prioritaire. |
| F11 — Notifications locales optionnelles | 6.2 | PREMIUM | Utile mais non essentiel. |
| F12 — Alarme Dream Feed | 6.9 | PREMIUM | Bon levier nocturne. |
| F13 — Suivi allaitement avancé | 8.3 | PREMIUM | Basic feeding reste core. Côté, durée fine, pompage = premium. |
| F14 — Passation de relais | 7.9 | PREMIUM | Bénéfice co-parental fort. |
| F15 — Stats multi-périodes | 7.8 | PREMIUM | Premium naturel. Free limité au jour en cours / 24h. |
| F16 — Allergènes / diversification | 6.5 | PREMIUM | Valeur réelle mais secondaire. |
| F17 — Médicaments & vitamines | 7.2 | PREMIUM | Récurrence élevée. |
| F18 — Multi-baby / jumeaux | 9.1 | PREMIUM | Déclencheur direct d’upgrade. |
| F19 — Sound Machine Offline | 5.7 | BACKLOG GRATUIT FUTUR | Confort secondaire. |
| F20 — Mode Zen / veilleuse | 5.0 | BACKLOG GRATUIT FUTUR | Faible monétisation. |
| F21 — Mode Nounou / Invité | 6.5 | PREMIUM FUTUR | Contrôle d’accès local. |
| F22 — Carnet santé & courbes OMS | 6.7 | PREMIUM FUTUR | Attention aux claims médicaux. |
| F23 — Liquid Gold Inventory | 5.1 | BACKLOG GRATUIT FUTUR | Niche lait maternel. |
| F24 — Moteur sauts de développement | 3.1 | REJET MONÉTISATION | Contenu statique. |
| F25 — Carnet santé photo local | 4.5 | BACKLOG GRATUIT FUTUR | Secondaire. |
| F26 — Cartes sociales safe | 2.7 | BACKLOG GRATUIT FUTUR | Potentiel viral, pas revenu direct. |
| F27 — Débrief audio nocturne TTS | 3.0 | REJET MONÉTISATION | Valeur limitée. |
| F28 — Bilan annuel + Drive manuel | 4.8 | PREMIUM FUTUR | Seulement action manuelle explicite. |
| F29 — Import/export CSV avancé | 4.2 | PREMIUM FUTUR | Power users. |
| F30 — Magic Voice Log BYOK | 6.0 | PREMIUM FUTUR | Optionnel, jamais indispensable. |
| F31 — BYOK AI Sleep Coach | 6.7 | PREMIUM FUTUR | Optionnel, clé locale, core sans IA. |
| F32 — Smart Diaper Scan | 5.3 | PREMIUM FUTUR | Photo simple + BYOK optionnel, aucun diagnostic. |
| F33 — Design premium calme | 7.6 | PRINCIPE NON MONÉTISABLE | UX transversale. |
| F34 — Aucune permission obligatoire | 7.9 | PRINCIPE NON MONÉTISABLE | Conformité et confiance. |

---

### 5.5 Segmentation Free vs Premium

#### Tier Free — version corrigée

Objectif :

Le free doit fonctionner comme un **essai** qui permet de tester la valeur premium, puis crée un besoin clair d’upgrade. Il ne doit pas devenir un produit gratuit complet.

Fonctionnement :

1. Après création du premier profil bébé, l’utilisateur voit une proposition claire : “Démarrer l’essai Premium de 72h”.
2. L’essai ne démarre que par action manuelle.
3. Pendant 72h : accès complet aux fonctionnalités premium.
4. Aucun paiement, aucune carte, aucun renouvellement automatique.
5. Après 72h : bascule vers Free Minimal.
6. Si l’utilisateur refuse l’essai, il reste en Free Minimal.

Free Minimal après trial :

- 1 seul profil bébé actif.
- Tracking core : tétée, sommeil, couche, note simple.
- Timer avec reprise locale.
- Mode Nuit OLED.
- Timeline limitée aux dernières **24h**.
- Résumé du jour en cours.
- Édition, suppression, undo.
- Emergency Doctor Mode : consultation écran des dernières **24h** uniquement.
- Stockage local persistant.
- Suppression des données gratuite.
- Aucune publicité.
- Aucun export PDF.
- Aucun export CSV.
- Aucun backup chiffré.
- Aucun transfert co-parent.
- Aucune statistique au-delà de 24h.
- Aucune prédiction.
- Aucune notification avancée.
- Pas de suivi allaitement avancé.
- Pas de multi-baby.
- Pas d’historique 7/30/90/180/365 jours.

Interdiction de limiter le nombre de logs :

Le free ne doit pas limiter le nombre d’événements par jour. Limiter les logs créerait une frustration excessive, des avis négatifs, et casserait la rétention. La monétisation doit venir de la profondeur d’historique, de l’export, du co-parenting, des stats et des profils multiples.

Test d’utilité :

- Un parent peut tracker la journée en cours.
- Un parent peut utiliser l’app pendant la nuit.
- Un parent peut corriger une erreur.
- Un parent peut consulter les dernières 24h.
- L’app reste utile sans paiement.

Test de création de besoin :

- Après 72h, l’utilisateur perd l’accès aux stats longues, exports, backup, co-parent, prédictions, historique complet.
- La limite est visible naturellement sans bloquer l’action cœur.
- Le besoin d’upgrade est créé par la perte de valeur avancée, pas par la punition du tracking.

#### Tier Premium

Positionnement :

“BabyLog Premium débloque le suivi complet de votre bébé : historique illimité, exports pédiatre, sauvegarde chiffrée, co-parenting local, prédictions locales et profils illimités.”

Features premium prioritaires :

| Feature premium | Douleur résolue | Priorité paywall |
|---|---|---|
| Historique illimité | Impossible de relire les jours précédents | P1 |
| Export PDF pédiatre | Stress avant consultation | P1 |
| Backup chiffré / restore | Peur de perdre les données | P1 |
| Co-Parent Local Transfer | Deux parents non synchronisés | P1 |
| Profils illimités / multi-baby | Jumeaux, deuxième enfant | P1 |
| Stats multi-périodes | Besoin de voir tendances | P1 |
| Prédictions locales | Anticiper prochaine sieste | P2 |
| Allaitement avancé | Côté, durée, pompage | P2 |
| Passation de relais | Transition entre parents | P2 |
| Notifications / Dream Feed | Rappels utiles | P3 |
| Allergènes / médicaments | Suivi avancé | P3 |

Vérification premium :

- Premium utile : OUI.
- Premium non cosmétique : OUI.
- Premium compréhensible en moins de 5 secondes : OUI.
- Premium compatible Local-First : OUI.
- Premium sans serveur obligatoire : OUI.
- Premium ne vend pas de fausse promesse médicale : OUI.

---

### 5.6 Politique de quota IA / BYOK

Statut au MVP : non applicable.

Aucune feature IA obligatoire n’est incluse dans le MVP ou les Releases 1 à 4.

Si BYOK activé plus tard :

- Free : 5 actions IA par jour maximum.
- Premium : pas de quota imposé par BabyLog.
- Compteur local via MMKV ou SQLite.
- Reset quotidien local.
- Jauge visible dans l’UI.
- Alerte locale à 80 % du quota.
- CTA premium contextuel, non bloquant.
- Clé API stockée localement dans SecureStore / Keystore.
- Aucune clé API envoyée vers un serveur BabyLog.
- Core tracking doit fonctionner sans clé API.

Transparence obligatoire :

- Ne jamais promettre “illimité” si le fournisseur API externe impose des limites.
- Indiquer que les limites externes viennent du fournisseur API, pas de BabyLog.
- Si l’IA échoue, l’utilisateur doit pouvoir continuer manuellement.
- Pas de feature IA indispensable au fonctionnement de base.

---

### 5.7 Stratégie publicitaire

Décision finale : **aucune publicité**.

Formats refusés :

- Banner.
- Native.
- Interstitial.
- Rewarded.
- Offerwall.
- Ads dans onboarding.
- Ads sur écrans de tracking.
- Ads sur écrans de nuit.
- Ads sur paywall.

Justification :

1. Données de nourrisson et positionnement privacy absolu.
2. UX nocturne : parent épuisé, besoin de rapidité, pas de distraction.
3. Cohérence avec les documents GPT 1 et GPT 2.
4. Risque élevé d’avis négatifs si publicité dans une app bébé.
5. Simplicité technique : aucun SDK ad, aucun consentement publicitaire, aucun tracking.

Revenu ads :

- Impressions : 0.
- eCPM : $0.
- Fill rate : N/A.
- Revenu ads par DAU : $0.

Conséquence :

La rentabilité repose entièrement sur la conversion Free → Premium. Le trial local, le paywall et la valeur premium doivent être optimisés.

---

### 5.8 Pricing

#### Principe imposé

Tarification unique sur tous les marchés whitelist.

La tarification du Groupe B, plus élevée, devient la tarification unique.

Prix unifiés :

| Offre | Prix unifié | Justification |
|---|---:|---|
| Mensuel | Refusé | Contrainte produit. Cycle 18-24 mois. Préférer annuel/lifetime. |
| Annuel | **$39.99 / an** | Prix premium mais inférieur à Huckleberry ~$10/mois. Équivalent ~$3.33/mois. |
| Lifetime | **$99.99** | Achat unique pour la durée d’usage bébé. Ratio lifetime/annuel = 2.5. |

#### Prix localisés

Règle : utiliser les price tiers App Store / Google Play les plus proches de $39.99 annuel et $99.99 lifetime, sans sous-tarification Groupe A.

Exemples indicatifs :

| Marché | Annuel | Lifetime |
|---|---:|---:|
| USA | $39.99 | $99.99 |
| Canada | CA$54.99 | CA$139.99 |
| UK | £34.99 | £84.99 |
| Europe | €37.99 | €94.99 |
| Suisse | CHF 37.99 | CHF 94.99 |
| Australie | A$59.99 | A$149.99 |
| Nouvelle-Zélande | NZ$64.99 | NZ$159.99 |
| Japon | ¥6,000 | ¥15,000 |
| Corée du Sud | ₩49,000 | ₩129,000 |
| UAE | AED 149 | AED 379 |
| Arabie Saoudite | SAR 149 | SAR 379 |
| Qatar | QAR 149 | QAR 379 |

Les montants exacts doivent être ajustés selon les paliers disponibles dans App Store Connect et Google Play Console.

#### Revenu net après commission 15 %

| Offre | Prix brut | Net après 15 % |
|---|---:|---:|
| Annuel | $39.99 | $33.99 |
| Lifetime | $99.99 | $84.99 |

Hypothèse mix produit : 60 % annuel / 40 % lifetime.

ARPPU net avant refunds :

0.6 × $33.99 + 0.4 × $84.99 = **$54.39**

Refunds estimés : 3 %.

ARPPU net après refunds :

$54.39 × 0.97 = **$52.76**

#### Lifetime

Décision : OUI.

Justification :

- Cycle d’usage naturel : 18-24 mois.
- Les parents cibles détestent les abonnements prédateurs.
- Lifetime renforce le positionnement anti-Huckleberry.
- Zéro coût serveur, donc revenu upfront très rentable.
- Prix $99.99 cohérent avec 2.5 années d’abonnement annuel.

Risque :

- Moins de revenu récurrent futur.
- Un utilisateur lifetime ne paie plus ensuite.

Mitigation :

- Annual visible comme option plus légère.
- Lifetime présenté comme meilleure valeur pour la période bébé complète.
- Futures extensions optionnelles possibles, mais jamais nécessaires pour retrouver les fonctions promises.

#### Trial

Décision : **trial local de 72h**, pas de trial d’abonnement store par défaut.

Raisons :

- Permet de tester la valeur premium.
- Pas de carte requise.
- Pas de risque de churn post-trial d’abonnement.
- Pas de complexité de gestion de trial store.
- Compatible Local-First.

Règles :

- Trial activé manuellement après création du premier profil.
- Durée : 72h.
- Accès complet aux features premium.
- Aucun paiement.
- Paywall de fin de trial non bloquant.
- Mention claire dans l’app.

#### Test A/B pricing

Décision : ne pas tester de prix inférieur à $39.99 annuel.

Test recommandé après stabilisation :

- Cohorte A : $39.99 annuel / $99.99 lifetime.
- Cohorte B : $44.99 annuel / $109.99 lifetime.
- Cohorte C : $49.99 annuel / $119.99 lifetime.

Assignation :

- Hash local d’un install ID non personnel.
- Stockage MMKV/SQLite.
- Aucun tracking publicitaire.

Métrique principale :

- RPI 30 jours.

Métriques secondaires :

- Conversion paywall.
- Conversion trial → premium.
- Part annuel vs lifetime.
- Refunds.
- Rétention D7/D30.
- Avis utilisateurs.

Règle de stop :

- Ne pas décider sous 1,000 installs par cohorte sauf contrainte forte.
- Si une cohorte dépasse les autres de 20 % sur le RPI avec stabilité pendant 7 jours, arrêt anticipé possible.

---

### 5.9 Paywall

#### Déclencheurs autorisés

1. Fin du trial local de 72h.
2. Tentative d’accès à l’historique au-delà de 24h.
3. Tentative d’ajouter un deuxième profil.
4. Tentative d’export PDF.
5. Tentative de backup chiffré.
6. Tentative de co-parent transfer.
7. Tentative d’accès aux stats longues.
8. Tentative d’accès aux prédictions.
9. Tentative d’utiliser allaitement avancé.
10. Après un win moment : 15 événements enregistrés ou 3 jours d’utilisation, uniquement si aucun paywall n’a déjà été affiché.

#### Déclencheurs interdits

- Premier lancement.
- Onboarding.
- Création du premier profil.
- Pendant la saisie d’un événement.
- Pendant le timer.
- Pendant une action critique.
- Pendant Emergency Doctor Mode en consultation 24h.
- Après une erreur produit.
- Avant le premier log.
- De manière répétée sans nouvelle action premium.
- Sous forme de plein écran bloquant sans fermeture visible.

#### Fréquence

- Paywall de fin de trial : 1 fois.
- Paywall sur action premium : autorisé à chaque nouvelle tentative premium.
- Paywall spontané : maximum 1 par 7 jours.
- Pas de relance immédiate après fermeture.

#### Contenu du paywall

Titre recommandé :

“Débloquer BabyLog Premium”

Bullets :

- Historique complet et statistiques jusqu’à 365 jours.
- Export PDF clair pour le pédiatre.
- Sauvegarde chiffrée et transfert co-parent local.
- Profils bébé illimités.
- Prédictions locales de sommeil, sans cloud.
- Aucune publicité.

Comparatif Free vs Premium :

| Fonction | Free après trial | Premium |
|---|---|---|
| Tracking quotidien | Oui | Oui |
| Mode nuit | Oui | Oui |
| 1 profil actif | Oui | Oui |
| Profils illimités | Non | Oui |
| Timeline 24h | Oui | Oui |
| Historique illimité | Non | Oui |
| Stats longues | Non | Oui |
| Export PDF | Non | Oui |
| Backup chiffré | Non | Oui |
| Co-parent transfer | Non | Oui |
| Prédictions locales | Non | Oui |
| Publicité | Aucune | Aucune |

CTA principal :

“Débloquer Premium”

Mentions obligatoires :

- Prix exact annuel.
- Prix exact lifetime.
- Durée annuelle.
- Renouvellement automatique.
- Annulation possible via App Store / Google Play.
- Aucun prélèvement sans confirmation.
- Restore purchases.
- Lifetime = achat unique.
- Politique de confidentialité.
- Conditions d’utilisation.

Interdits :

- Bouton fermer caché.
- Prix caché.
- Compte à rebours artificiel.
- Stock limité fictif.
- Preuve sociale inventée.
- Case pré-cochée.
- CTA ambigu.
- Harcèlement après fermeture.

---

### 5.10 KPIs et instrumentation

#### KPIs principaux

| KPI | Définition | Cible |
|---|---|---:|
| Installs whitelist | Nouveaux installs sur marchés autorisés | 1,895-2,653/mois pour seuil réaliste |
| Onboarding completion | % d’onboarding terminé | ≥ 70 % |
| Time to first log | Temps avant premier événement | < 2 min |
| First value moment | % ayant fait 1er log jour 1 | ≥ 60 % |
| Trial start rate | % de profils créés activant trial | ≥ 70 % |
| Trial completion rate | % de trials atteignant 72h | ≥ 50 % |
| Trial → Premium | Conversion après trial | ≥ 4 % |
| D1 | Rétention jour 1 | ≥ 35 % |
| D7 | Rétention jour 7 | ≥ 15 % |
| D30 | Rétention jour 30 | ≥ 7 % |
| Paywall shown | Nombre de paywalls affichés | suivre ratio |
| Conversion premium 30j | Free → Premium sur 30 jours | ≥ 2.5 % |
| ARPPU net | Revenu net moyen par payeur | $52.76 |
| RPI 30 jours | Revenu par install | $1.30-$1.60 |
| Refunds | Remboursements | ≤ 3 % |
| Restore rate | Restaurations réussies | suivre |
| Note moyenne | Rating stores | ≥ 4.5 |

#### Événements locaux à logger

Tous les événements doivent être locaux, sans donnée personnelle directe, sans IDFA/GAID, sans envoi automatique.

| Événement | Déclencheur | Objectif |
|---|---|---|
| app_installed | Premier lancement | Base cohortes |
| onboarding_started | Début onboarding | Mesurer friction |
| onboarding_completed | Fin onboarding | Activation |
| first_profile_created | Premier profil créé | Activation |
| trial_offer_shown | Offre trial affichée | Funnel trial |
| trial_started | Trial 72h activé manuellement | Funnel premium |
| trial_completed | Trial 72h terminé | Funnel premium |
| trial_expired_paywall_shown | Paywall fin de trial | Conversion |
| trial_already_claimed_detected | Flag trial déjà consommé détecté | Anti-abus |
| first_value_moment | Premier événement tracké | Activation |
| core_action_completed | Log tétée/sommeil/couche | Engagement |
| night_mode_used | Mode nuit actif | Usage clé |
| history_limit_reached | Tentative historique > 24h | Déclencheur premium |
| second_profile_attempted | Tentative 2e profil | Déclencheur premium |
| premium_feature_attempted | Tentative feature premium | Conversion |
| paywall_shown | Paywall affiché | Funnel |
| paywall_closed | Paywall fermé | Friction |
| paywall_converted | Achat confirmé | Conversion |
| subscription_started | Abonnement annuel actif | Revenu |
| lifetime_unlocked | Lifetime acheté/restauré | Revenu |
| premium_restored | Restore réussi | Support |
| subscription_cancelled | Annulation détectée localement | Churn |
| pdf_export_attempted | Tentative export PDF | Valeur premium |
| backup_export_attempted | Tentative backup | Valeur premium |
| co_parent_transfer_attempted | Tentative transfert | Valeur premium |
| prediction_viewed | Consultation prédiction | Valeur premium |

Règles privacy :

- Pas de tracking publicitaire.
- Pas d’analytics tiers obligatoire.
- Export manuel uniquement.
- Consentement explicite si crash reporting ajouté.
- Pas de collecte d’email, de nom, de localisation précise, ou de donnée bébé non nécessaire.

---

### 5.11 Projections de revenus

#### Hypothèses corrigées

| Hypothèse | Valeur | Justification |
|---|---:|---|
| Marchés | Whitelist uniquement | Contrainte géographique |
| Publicité | $0 | Aucune ad |
| Prix annuel | $39.99 | Tarif unifié Groupe B |
| Prix lifetime | $99.99 | Tarif unifié Groupe B |
| Mensuel | $0 | Refusé |
| Commission store | 15 % | Small Business Program supposé |
| Refunds | 3 % | Prudence |
| Mix produit | 60 % annuel / 40 % lifetime | Hypothèse conservative |
| Conversion pessimiste | 1.5 % | Sous benchmark |
| Conversion réaliste | 2.5 % | Prudent après hausse prix |
| Conversion optimiste | 3.5 % | Haut de benchmark mais non excessif |
| Rétention D1/D7/D30 | 35 % / 15 % / 7 % | Utility solide |

#### ARPPU net corrigé

Annuel net après commission 15 % :

$39.99 × 0.85 = $33.99

Lifetime net après commission 15 % :

$99.99 × 0.85 = $84.99

Mix 60/40 :

0.6 × $33.99 + 0.4 × $84.99 = $54.39

Après refunds 3 % :

$54.39 × 0.97 = **$52.76**

#### RPI 30 jours

Formule :

RPI 30 jours = Conversion premium 30 jours × ARPPU net

- Pessimiste : 1.5 % × $52.76 = **$0.79**
- Réaliste : 2.5 % × $52.76 = **$1.32**
- Optimiste : 3.5 % × $52.76 = **$1.85**

#### Scénario pessimiste

Hypothèse : 1,800 installs/mois.

Conversion : 1.5 %.

Payeurs : 27.

Revenu brut : 27 × $63.99 = $1,728.

Commission 15 % : -$259.

Revenu après commission : $1,469.

Refunds 3 % : -$52.

Revenu mensuel net : **~$1,417**.

Revenu annuel net : **~$17,000**.

RPI 30 jours : **$0.79**.

Verdict : seuil non atteint.

#### Scénario réaliste

Hypothèse : 2,700 installs/mois.

Conversion : 2.5 %.

Payeurs : 67.5.

Revenu brut : 67.5 × $63.99 = $4,319.

Commission 15 % : -$648.

Revenu après commission : $3,671.

Refunds 3 % : -$130.

Revenu mensuel net : **~$3,542**.

Revenu annuel net : **~$42,500**.

RPI 30 jours : **$1.32**.

Verdict : seuil de viabilité atteint.

#### Scénario optimiste

Hypothèse : 4,200 installs/mois.

Conversion : 3.5 %.

Payeurs : 147.

Revenu brut : 147 × $63.99 = $9,407.

Commission 15 % : -$1,411.

Revenu après commission : $7,996.

Refunds 3 % : -$282.

Revenu mensuel net : **~$7,714**.

Revenu annuel net : **~$92,600**.

RPI 30 jours : **$1.85**.

Verdict : confortable mais dépend fortement de l’acquisition whitelist.

#### Seuil de viabilité

Seuil utilisateur : $2,500 à $3,500 / mois.

Avec RPI réaliste $1.32 :

- Pour $2,500/mois : 2,500 / 1.32 = **1,895 installs/mois**.
- Pour $3,500/mois : 3,500 / 1.32 = **2,653 installs/mois**.

#### Sensibilité commission store

Si commission 30 % :

- Annuel net : $27.99.
- Lifetime net : $69.99.
- ARPPU net avant refunds : $44.79.
- ARPPU net après refunds : $43.45.
- RPI réaliste 2.5 % : **$1.09**.
- Installs requis pour $2,500-$3,500/mois : **2,294 à 3,211 installs/mois**.

#### Sensibilité conversion

Si conversion 2.0 % :

- RPI = 2.0 % × $52.76 = **$1.06**.
- Installs requis pour seuil : **2,358 à 3,302 installs/mois**.

Si conversion 3.0 % :

- RPI = 3.0 % × $52.76 = **$1.58**.
- Installs requis pour seuil : **1,582 à 2,215 installs/mois**.

---

### 5.12 Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Free trop strict génère avis négatifs | Moyenne | Élevé | Trial 72h complet, core tracking non limité, timeline 24h gratuite, pas de suppression des données. |
| Trial local perçu comme trompeur | Faible | Élevé | Mention claire “essai gratuit 72h sans paiement”, aucun achat automatique. |
| Conversion inférieure à 2.5 % | Moyenne | Élevé | Améliorer paywall fin de trial, renforcer exports, co-parent, backup. |
| Prix unique $39.99 trop élevé pour Groupe A | Moyenne | Moyen | Mettre en avant économie vs Huckleberry $10/mois. Lifetime comme achat unique. |
| Absence de mensuel réduit l’impulsion | Moyenne | Moyen | Annuel accessible et lifetime clair. |
| Dépendance totale à la conversion premium | Élevée | Élevé | Optimiser trial, paywall, onboarding, rétention. |
| Données perçues comme prises en otage | Moyenne | Élevé | Dernière 24h consultable, Emergency 24h gratuit, suppression gratuite, données stockées localement. |
| Refunds supérieurs à 3 % | Faible | Moyen | Prix clair, pas de promesse trompeuse, restore visible. |
| Rejet store pour abonnement mal expliqué | Faible | Élevé | Prix, durée, renouvellement, annulation, restore affichés. |
| Disponibilité store trop large | Moyenne | Moyen | Restreindre aux pays whitelist uniquement. |
| Paywall trop agressif | Moyenne | Élevé | Max 1 spontané / 7 jours, fermeture visible, pas de harcèlement. |
| Trial réinitialisé par désinstallation/réinstallation | Moyenne | Moyen | Flag local + flag sécurisé best-effort, pas de fingerprinting. |
| Trial abusif par utilisateur déterminé | Faible | Faible-Moyen | Accepter risque résiduel. Ne pas violer privacy avec tracking. |

---

### 5.13 Passation au GPT 4

#### Achats in-app

Exigences techniques :

- iOS : StoreKit / StoreKit 2.
- Android : Google Play Billing.
- Aucun serveur de paywall obligatoire.
- Aucun serveur de vérification de receipts obligatoire.
- Les entitlements doivent fonctionner hors ligne après achat ou restauration.
- Restore purchases obligatoire.
- Abonnement annuel géré comme auto-renewable subscription.
- Lifetime géré comme non-consumable IAP sur iOS et one-time product sur Android.
- Aucun lien externe pour acheter une fonctionnalité numérique.
- Prix affichés depuis StoreKit / Play Billing, jamais en dur sans fallback store.

Produits IAP recommandés :

- `babylog_premium_annual_v1`
- `babylog_premium_lifetime_v1`

#### Trial local de 72h

Exigences :

- Trial activé manuellement uniquement.
- Aucun démarrage automatique au premier lancement.
- Aucun paiement requis.
- Aucune carte requise.
- Aucun renouvellement automatique.
- Timer local basé sur timestamp de démarrage du trial.
- Stockage local MMKV ou SQLite.
- Trial actif même si l’app est fermée.
- Pas de dépendance serveur.

Statut de trial recommandé :

```json
{
  "trial_state": "not_started | active | expired | already_used",
  "trial_started_at": null,
  "trial_ends_at": null,
  "trial_claimed_local": false,
  "trial_claimed_secure": false
}
```

Anti-abus trial :

- Écrire `trial_claimed_local` dans MMKV/SQLite au démarrage du trial.
- Écrire `trial_claimed_secure` dans le stockage sécurisé de l’OS si possible :
  - iOS : Keychain.
  - Android : Keystore / EncryptedSharedPreferences.
- Au lancement, vérifier d’abord le statut local applicatif.
- Si statut local absent mais flag sécurisé présent, marquer le trial comme déjà consommé.
- Si backup local restauré, restaurer aussi le statut du trial.
- Si entitlement Premium/Lifetime présent, il prime sur le trial.
- Aucun device fingerprinting.
- Aucun IDFA/GAID.
- Aucun tracking serveur.
- Protection best-effort : accepter un risque résiduel faible plutôt que violer la privacy.

#### Stockage local

Exigences :

- MMKV, SecureStore, SQLite ou équivalent pour les entitlements.
- MMKV ou SQLite pour event log local.
- MMKV ou SQLite pour futur quota BYOK.
- Hash d’install ID local non personnel pour cohortes A/B.
- Aucune donnée personnelle inutile.

Structure d’entitlement recommandée :

```json
{
  "is_premium": false,
  "has_lifetime": false,
  "subscription_expires_at": null,
  "last_store_check_at": null,
  "offline_grace_flag": false,
  "purchase_source": null
}
```

#### Free minimal

Exigences :

- Après trial, timeline limitée aux dernières 24h.
- 1 seul profil actif.
- Tracking core non limité en nombre d’événements.
- Pas d’export PDF/CSV.
- Pas de backup chiffré.
- Pas de co-parent transfer.
- Pas de stats longues.
- Pas de prédictions.
- Pas de notifications premium.
- Emergency Doctor Mode gratuit sur 24h uniquement.
- Suppression des données gratuite.

#### Premium

Exigences :

- Profils illimités.
- Historique complet.
- Stats 1j / 7j / 30j / 90j / 180j / 365j.
- Export PDF local.
- Backup chiffré export/import.
- Co-Parent Local Transfer.
- Prédictions locales basées sur historique local.
- Allaitement avancé.
- Passation de relais.
- Notifications locales avancées.
- Offline grace en cas d’impossibilité temporaire de vérification store.

#### Publicité

Exigences :

- Aucun SDK publicitaire.
- Aucun AdMob.
- Aucun banner.
- Aucun interstitial.
- Aucun native ad.
- Aucun rewarded ad.
- Aucune configuration ATT pour publicité.
- Aucun identifiant publicitaire collecté.

#### Paywall

Exigences :

- Écran paywall local React Native.
- Déclenchement basé sur événements locaux.
- Fermeture facile.
- Restore visible.
- Prix affichés depuis les stores.
- Conditions abonnement affichées.
- Pas de fullscreen bloquant sans issue claire.
- Pas de logique serveur obligatoire.
- Cohortes A/B locales.
- Pas de dark pattern.

#### Instrumentation

Exigences :

- Event log local MMKV ou SQLite.
- Événements listés section 5.10.
- Export manuel utilisateur uniquement.
- Pas d’envoi automatique sans consentement.
- Pas de tracking publicitaire.
- Pas d’analytics tiers obligatoire.
- Si crash reporting ajouté : opt-in explicite et données minimales.

#### Store configuration

Exigences :

- Disponibilité App Store / Play Store strictement limitée aux pays whitelist.
- Localisations prioritaires : EN-US/UK, FR, DE, JA, KO, AR-RTL.
- Aucun pricing low-cost pour pays blacklistés.
- Price tiers localisés proches de $39.99 annuel / $99.99 lifetime.
- Subscription terms visibles dans la fiche store si requis.
- Privacy labels cohérents avec absence de collecte cloud et absence de tracking publicitaire.

#### Contraintes finales

- Aucune dépendance backend pour la monétisation.
- Aucune fonctionnalité critique bloquée par serveur.
- Aucun paywall au premier lancement.
- Aucun paywall avant premier profil ou premier log.
- Aucune publicité.
- Aucune donnée personnelle inutilement collectée.
- Disponibilité stores strictement limitée aux pays whitelist.
- Trial local protégé de manière raisonnable, sans tracking.
- Restore purchases obligatoire.
- Premium/Lifetime prime toujours sur le trial.

---

## 6. NOTE FINALE

Corrections majeures :

- Free transformé en trial local de 72h puis free minimal.
- Timeline free limitée aux dernières 24h après trial.
- Tracking core non limité en nombre de logs pour protéger rétention et UX.
- Pricing unifié sur le Groupe B : $39.99 annuel / $99.99 lifetime.
- Conversion réaliste abaissée à 2.5 %.
- RPI réaliste recalculé à $1.32.
- Publicités définitivement exclues.
- Trial local protégé par flag local et flag sécurisé best-effort, sans fingerprinting.
- Projections ajustées avec commission 15 %, refunds 3 %, mix 60/40.

Hypothèses clés :

- Éligibilité au Small Business Program à 15 %.
- Conversion premium 30 jours de 2.5 % au scénario réaliste.
- Mix produit 60 % annuel / 40 % lifetime.
- Refunds 3 %.
- Aucun revenu publicitaire.
- Marchés whitelist uniquement.

Risques restants :

- Free strict peut générer des avis négatifs s’il est mal présenté.
- Trial local doit être extrêmement clair pour éviter toute perception trompeuse.
- Prix unique peut réduire la conversion en Groupe A.
- Absence de mensuel peut ralentir l’achat impulsif.
- Disponibilité store doit être strictement contrôlée.
- Désinstallation/réinstallation peut contourner partiellement le trial ; protection best-effort acceptée pour préserver privacy et Local-First.

Transmettez ce document corrigé au GPT 4 — Tech Stack Architect.

La section PASSATION AU GPT 4 contient les exigences techniques finales : achats in-app, stockage local des entitlements, trial local, publicité absente, quota local, paywall local, instrumentation locale et absence de backend obligatoire.