Bonjour, je suis votre expert en monétisation mobile Free + Ads + Premium pour les marchés Tier 1 et Tier 2.

Ma mission : transformer votre stratégie produit en revenus optimisés, sans détruire l'expérience utilisateur ni violer le Local-First.

Documents reçus : 01-market-research.md, 02-product-strategy.md, 02-annexe-technique.md.  
Seuil de viabilité non fourni : je retiens **1 000 $ / mois** comme hypothèse conservatrice. Merci de confirmer ou corriger ce seuil pour figer les projections.

---

# STRATÉGIE DE MONÉTISATION — BabyLog Offline — 2026-09-10

## RÉSUMÉ EXÉCUTIF

Modèle : **Free + Ads + Premium**

Prix recommandés :  
- Tier 1 : **4,99 $ / mois**, **29,99 $ / an**, Lifetime lancement **29,99 $**  
- Tier 2 : **2,99 $ / mois**, **17,99 $ / an**, Lifetime lancement **14,99 $**

North star monétisation : **RPI 30 jours**  
Cible : **0,65 $ par install sur 30 jours**  
Scénario réaliste estimé : **0,62 $**

Revenu annuel scénario réaliste : **37 346 $**  
Hypothèse : 5 000 installs / mois, mix 60 % Tier 1 / 40 % Tier 2, commission store 15 %.

Prochaine étape : transmettre ce document au **GPT 4 — Tech Stack Architect**, en particulier la section **PASSATION AU GPT 4**.

---

## INPUTS REÇUS

1. Idée retenue : **BabyLog Offline**, tracker nouveau-né Local-First, score GPT 1 : **79,6 / 100**, verdict GO.  
2. Périmètre MVP GPT 2 : 5 features, 8 semaines : Tracking 1-Tap, UI Nuit OLED, Export PDF local, Prédiction SweetSpot gatée premium, Backup chiffré gratuit.  
3. Features candidates premium : historique illimité, exports PDF illimités, prédiction SweetSpot locale, Mode Nounou V2.  
4. Features candidates ads : statistiques diurnes uniquement ; zéro ad sur écrans nocturnes, tracking, timeline, saisie.  
5. Features gratuites obligatoires : tracking illimité, UI Nuit, timeline 7 jours, backup local chiffré, export de données jamais paywallé.

---

## POTENTIEL DE MONÉTISATION PAR FEATURE

Formule : Score = Valeur × 0,3 + Fréquence × 0,3 + Difficulté × 0,2 + Rétention × 0,2.

| Feature | Valeur | Fréquence | Difficulté | Rétention | Score | Classification |
|---|---:|---:|---:|---:|---:|---|
| Tracking 1-Tap et Timeline | 9 | 10 | 6 | 10 | 8,9 | FREE CORE |
| UI Nuit OLED et Haptique | 8 | 10 | 5 | 9 | 8,2 | FREE CORE |
| Prédiction SweetSpot locale | 9 | 9 | 7 | 8 | 8,4 | PREMIUM |
| Historique illimité et exports PDF illimités | 8 | 6 | 7 | 8 | 7,2 | PREMIUM |
| Sync Partenaire QR Delta V1.1 | 8 | 8 | 8 | 8 | 8,0 | PREMIUM V1.1 |
| Export PDF médical limité | 8 | 6 | 7 | 7 | 7,0 | FREE LIMITÉ |
| Timeline 7 jours | 7 | 9 | 4 | 8 | 7,2 | FREE CORE |
| Backup local chiffré | 9 | 3 | 6 | 9 | 6,6 | FREE CORE non paywallable |
| Widgets iOS / Android V2 | 6 | 9 | 6 | 7 | 7,1 | PREMIUM ADD-ON V2 |
| Mode Nounou V2 | 7 | 7 | 7 | 7 | 7,0 | PREMIUM ADD-ON V2 |
| Stats diurnes | 6 | 7 | 4 | 6 | 5,9 | AD-SUPPORTED |
| Rewarded unlocks | 5 | 4 | 3 | 4 | 4,1 | REWARDED UNLOCK |

Décisions clés :

- Le tracking et l’UI Nuit doivent rester gratuits et illimités : ils créent l’habitude quotidienne.
- Le backup ne doit jamais être monétisé : règle éthique, rétention, confiance, conformité à la promesse Local-First.
- La prédiction SweetSpot est le meilleur levier premium : usage quotidien, valeur émotionnelle forte, différenciation anti-Huckleberry.
- L’export PDF doit être free limité pour créer la preuve de valeur, puis premium en illimité.

---

## SEGMENTATION FREE VS PREMIUM

### Tier Free

Contenu du tier Free :

- Tracking illimité : Feed, Sleep, Diaper.
- Timer 1-Tap avec retour haptique.
- Timeline visuelle des 7 derniers jours.
- UI Nuit OLED noir profond.
- 1 export PDF par période de 7 jours, basé sur les 7 derniers jours.
- Teaser SweetSpot après 3 jours de données : affichage de la disponibilité, mais calcul verrouillé.
- Backup local chiffré export / import, gratuit, jamais paywallé.
- Notification locale de rappel backup après 30 jours sans export.
- Statistiques diurnes basiques.
- Publicités discrètes uniquement sur écrans diurnes secondaires.

Validation par les 5 tests :

| Test | Résultat | Preuve |
|---|---|---|
| Test 1 : utile sans jamais payer | OUI | Le parent peut tracker indéfiniment Feed, Sleep, Diaper, voir 7 jours d’historique et exporter un PDF par semaine. |
| Test 2 : crée une habitude quotidienne | OUI | Le besoin est de 8 à 15 actions par jour. Le tracking 1-Tap devient le réflexe nocturne. |
| Test 3 : démontre la valeur du premium | OUI | Après 3 jours, le teaser SweetSpot montre la prédiction disponible. Après 7 jours, la limite d’historique et d’export crée le besoin. |
| Test 4 : ne frustre pas avant le jour 3 | OUI | Aucune limite bloquante avant J3, aucune ad au premier lancement, tracking illimité, UI Nuit gratuite. |
| Test 5 : suffisant pour un usage occasionnel long terme | OUI | Un utilisateur occasionnel peut suivre les 7 derniers jours et exporter un PDF hebdomadaire sans payer. |

Aucun test n’échoue. La segmentation est validée.

### Tier Premium

| Feature premium | Douleur résolue | Gain concret | Phrase de vente |
|---|---|---|---|
| Prédiction SweetSpot locale | Parents épuisés, perte de repères sur les fenêtres d’éveil | Anticiper la prochaine sieste ou tétée sans cloud ni abonnement cher | “Sachez quand bébé va dormir, sans envoyer ses données sur internet.” |
| Historique illimité | Peur de perdre les données médicales et sommeil au-delà de 7 jours | Consulter tout l’historique depuis la naissance | “Tout l’historique de votre bébé, à vie, sur votre téléphone.” |
| Exports PDF illimités | Demandes du pédiatre, besoin de preuves claires | Générer un rapport PDF à chaque visite sans ressaisie | “Un rapport pédiatre prêt en 1 tap, même hors ligne.” |
| Sync Partenaire QR Delta V1.1 | Un seul téléphone actif, friction entre parents | Transférer les événements du jour sans serveur ni compte | “Synchronisez l’autre parent en scannant un QR code.” |
| Mode Nounou V2 | Confier bébé sans donner tout l’historique | Profil invité limité, sans export ni données sensibles | “Un mode simple pour la nounou, sans exposer vos données.” |
| Widgets V2 | Vérifier le timer sans ouvrir l’app | Lecture rapide depuis l’écran d’accueil | “Le timer de bébé visible en un coup d’œil.” |

Hair-on-fire need identifié :

- La prédiction SweetSpot locale répond à une douleur aiguë : privation de sommeil, besoin immédiat d’anticipation.
- L’export PDF illimité répond à un moment critique : rendez-vous pédiatre, besoin de preuve rapide.

Ces deux features justifient le passage premium.

### Politique de quota IA

Au MVP BabyLog Offline, il n’y a pas d’IA API externe : la prédiction est un algorithme local de moyennes mobiles. Le quota IA ne s’applique donc pas au moteur SweetSpot MVP.

Pour toute future feature IA optionnelle ou BYOK, la politique suivante est fixée :

| Tier | Quota IA local | Justification |
|---|---|---|
| Free | 5 actions IA / jour | Suffisant pour tester une aide contextuelle sans remplacer le premium. Cohérent avec 3 à 5 moments d’interrogation parentale par jour. |
| Premium | Illimité côté BabyLog, limité uniquement par la clé API de l’utilisateur | Le paiement supprime la friction. Le coût API éventuel appartient à l’utilisateur via BYOK. |

Affichage du quota futur :

- Jauge visible dans l’écran concerné.
- Alerte à 80 % du quota quotidien consommé.
- CTA Premium non bloquant.
- Reset local quotidien via timestamp MMKV.
- Aucun comptage serveur.

Justification du quota Free : 5 actions / jour permettent de vivre la valeur, mais créent une limite naturelle pour un utilisateur intensif. Le quota est un levier de conversion, pas une protection de coût serveur.

---

## STRATÉGIE PUBLICITAIRE

### Placements

Formats retenus : Native, Banner, Rewarded.  
Format rejeté : Interstitial.

| Format | Écrans autorisés | Écrans interdits | Fréquence max | eCPM T1 | eCPM T2 | Impact UX |
|---|---|---|---:|---:|---:|---|
| Native | Dashboard stats diurnes, écran Paramètres, écran Historique premium non débloqué si contexte non nocturne | Tracking, timer, mode Nuit, saisie, sommeil, écran PDF en cours, onboarding, paywall | 2 cartes / jour | 3 $ | 1 $ | Faible |
| Banner | Dashboard stats diurnes, Paramètres | Tracking, timer, mode Nuit, sommeil, backup, export, paywall, écrans premium actifs | 2 impressions / jour, refresh 60 s | 1 $ | 0,3 $ | Faible à moyen |
| Rewarded | Opt-in après limite free, teaser SweetSpot, modal stats avancées | Aucun déclenchement automatique, interdit sur tracking, mode Nuit, premier lancement | 3 / jour max, 1 récompense SweetSpot / 7 jours | 20 $ | 6 $ | Faible |
| Interstitial | Non retenu | Tous écrans | 0 | Non utilisé | Non utilisé | Aucun |

Choix stratégique : BabyLog est une app de confiance, utilisée la nuit, sur un sujet intime. L’interstitial détruirait la rétention et la promesse anti-prédation. Les formats retenus doivent rester discrets, diurnes et opt-in.

### Économie rewarded

| Récompense | Condition | Plafond | Rôle |
|---|---|---|---|
| Preview SweetSpot 24 h | Après 3 jours de données, utilisateur free | 1 / 7 jours | Faire goûter la feature premium la plus désirable |
| Export PDF supplémentaire | Free atteint 1 export / 7 jours | 1 / 7 jours | Dépanner sans remplacer l’illimité premium |
| Statistiques avancées 24 h | Dashboard diurne | 1 / jour | Montrer la valeur analytics sans bloquer le tracking |

Règle anti-cannibalisation :

- La récompense ne doit jamais représenter plus de 5 % de la valeur perçue du premium.
- La preview SweetSpot est temporaire et limitée.
- L’export PDF récompensé est unitaire ; l’utilisateur régulier atteindra vite la limite.
- Maximum 3 rewarded / jour, tous emplacements confondus.
- Si un utilisateur regarde plus de 5 rewarded sur 7 jours sans convertir, réduire la fréquence des offres rewarded pour éviter la substitution.

### Vérification des règles strictes

| Règle | Statut | Preuve |
|---|---|---|
| Aucune ad au premier lancement | OUI | Le SDK ads n’initialise aucun emplacement avant `onboarding_completed` et aucune impression n’est servie pendant la première session. |
| Aucune ad sur les écrans de valeur cœur | OUI | Tracking, timer, mode Nuit, sommeil, saisie, timeline active, backup et export sont exclus des placements. |
| Toute interstitial a une alternative | OUI, sans objet | Aucun interstitial n’est retenu. Si ajouté plus tard, alternative rewarded ou premium obligatoire. |
| Maximum 1 interstitial par 5-10 minutes | OUI, sans objet | Aucun interstitial. La règle est appliquée par absence totale. |
| Banners absents des écrans premium et du paywall | OUI | Banners uniquement stats diurnes et paramètres ; désactivés si entitlement premium actif. |
| Ads désactivées définitivement pour les abonnés premium | OUI | Entitlement local MMKV `is_premium` coupe tous les appels AdMob. |

### Revenu ads par DAU par jour

Hypothèses d’impressions par DAU / jour :

- Native : 2
- Banner : 2
- Rewarded : 0,5 en moyenne

Formule :  
Revenu ads / DAU / jour = somme des impressions × eCPM / 1000.

Tier 1 :

- Native : 2 × 3 $ / 1000 = 0,006 $
- Banner : 2 × 1 $ / 1000 = 0,002 $
- Rewarded : 0,5 × 20 $ / 1000 = 0,010 $
- Total Tier 1 : **0,018 $ / DAU / jour**

Tier 2 :

- Native : 2 × 1 $ / 1000 = 0,002 $
- Banner : 2 × 0,3 $ / 1000 = 0,0006 $
- Rewarded : 0,5 × 6 $ / 1000 = 0,003 $
- Total Tier 2 : **0,0056 $ / DAU / jour**

Mix géographique 60 % Tier 1 / 40 % Tier 2 :

- Blended : 0,6 × 0,018 + 0,4 × 0,0056 = **0,01304 $ / DAU / jour**

---

## PRICING

### Grille Tier 1

| Offre | Prix | Justification |
|---|---:|---|
| Mensuel | 4,99 $ | Ancrage bas face à Huckleberry 10 $ / mois. Dans la WTP GPT 1 : 5 à 10 $ / mois. Prix psychologique sous 5 $. |
| Annuel | 29,99 $ | Remise de 50 % versus 12 × 4,99 = 59,88 $. Équivalent 2,50 $ / mois. Ancrage mensuel fort. |
| Lifetime lancement | 29,99 $ | Aligné avec GPT 2. Cycle de vie réel du besoin : 18 à 24 mois. L’achat unique maximise la conversion anti-SaaS. |
| Lifetime standard futur | 39,99 $ | Une fois la preuve sociale acquise, le lifetime lancement pourra passer à 39,99 $ tout en gardant un test A/B. |

Commission store : 15 % sous 1 M$ annuel.  
Net estimé Lifetime Tier 1 lancement : 29,99 × 0,85 = **25,49 $**.

Décision : le Lifetime est l’offre principale. L’abonnement annuel existe pour compatibilité store et ancrage, mais le paywall doit pousser le lifetime car il capture la LTV immédiatement.

### Grille Tier 2

| Offre | Prix | Justification |
|---|---:|---|
| Mensuel | 2,99 $ | Environ 60 % du prix Tier 1. Cohérent avec pouvoir d’achat Tier 2 et WTP plus faible. |
| Annuel | 17,99 $ | Remise d’environ 50 % versus 12 × 2,99 = 35,88 $. Équivalent 1,50 $ / mois. |
| Lifetime lancement | 14,99 $ | Aligné avec GPT 1. Prix psychologique fort pour conversion upfront. |
| Lifetime standard futur | 17,99 $ | Hausse possible après validation d’élasticité. |

Net estimé Lifetime Tier 2 lancement : 14,99 × 0,85 = **12,74 $**.

### Plan de test A/B

Objectif : maximiser le RPI 30 jours sans dégrader la rétention.

Assignation locale :

- Hash de l’install ID stocké en MMKV.
- Cohorte attribuée de façon déterministe.
- Aucun serveur requis.
- La cohorte doit survivre à la réinstallation locale uniquement si l’install ID est conservé ; sinon nouvelle assignation acceptable.

Cohortes :

| Cohorte | Tier 1 Lifetime | Tier 2 Lifetime | Objectif |
|---|---:|---:|---|
| A — Prix bas | 24,99 $ | 12,99 $ | Tester l’élasticité volume |
| B — Prix recommandé | 29,99 $ | 14,99 $ | Contrôle aligné avec GPT 1 / GPT 2 |
| C — Prix haut | 39,99 $ | 17,99 $ | Tester l’upside ARPPU |

Taille minimale :

- 1 000 installs par cohorte ou 30 jours, au premier atteint.
- Si trafic insuffisant, prolonger jusqu’à 1 000 installs par cohorte.

Métrique de décision :

- RPI 30 jours = conversion × ARPPU net + revenu ads par install.
- Critère principal : RPI 30 jours.
- Garde-fous : rétention D7, taux de fermeture paywall, taux de refunds.

Règle de stop :

- Si à mi-test une cohorte dépasse les deux autres de plus de 20 % sur le RPI 30 jours, décision anticipée permise.
- Si la cohorte haute augmente le RPI mais dégrade la rétention D7 de plus de 10 %, elle est rejetée.

### Offres promotionnelles

| Levier | Décision | Justification |
|---|---|---|
| Trial payant | NON | Le tier free joue déjà le rôle de trial. Un trial ajouterait de la friction, un remboursement potentiel et une complexité store inutile. |
| Remise de lancement | OUI | Lifetime lancement 29,99 $ Tier 1 et 14,99 $ Tier 2 pendant les 30 premiers jours ou les 5 000 premiers installs. |
| Ancrage annuel | OUI | Afficher le mensuel barré et l’équivalent mensuel annuel. Mais le CTA principal doit rester Lifetime si le lifetime lancement est actif. |
| Offre urgente | OUI, douce | Mention “Prix de lancement” sans faux countdown agressif. Pas de dark pattern. |

---

## PAYWALL

### Moments d’affichage

Ordre de priorité :

1. Limite free atteinte : historique au-delà de 7 jours, export PDF hebdomadaire consommé, SweetSpot verrouillé après teaser.
2. Tentative explicite d’une feature premium : SweetSpot, historique illimité, export illimité, sync partenaire, mode nounou.
3. Win moment : premier PDF généré, première semaine complète trackée, premier backup réussi.
4. Après 3 jours d’utilisation active si aucun trigger précédent n’est survenu.

Interdictions :

- Premier lancement.
- Pendant l’onboarding.
- Pendant le tracking nocturne.
- Pendant un timer actif.
- Pendant une saisie Feed, Sleep ou Diaper.
- Pendant un export ou backup.
- Sur le paywall lui-même avec ads.
- Avant la première valeur mesurable : au moins 3 événements trackés.

### Fréquence et respect

- Maximum 1 paywall spontané par 7 jours.
- Paywall déclenché par action premium illimité, mais jamais bloquant : bouton fermer visible immédiatement.
- Bouton fermer en haut à droite, taille minimale 44 pt.
- Aucun countdown, aucun bouton déguisé, aucune fausse rareté.
- Restore purchases visible en bas du paywall et dans Paramètres.
- Après fermeture, refroidissement minimal 24 h sauf nouvelle tentative premium explicite.

### Contenu du paywall

Structure recommandée :

Titre :

> Dormez plus sereinement avec BabyLog Premium

Sous-titre :

> Gardez tout l’historique de votre bébé, anticipez ses siestes et générez des rapports pédiatre illimités, 100 % hors ligne.

Bullets :

- Historique illimité depuis la naissance.
- Prédiction SweetSpot locale des fenêtres d’éveil.
- Exports PDF illimités pour le pédiatre.
- Aucune donnée envoyée sur internet.
- Achat unique, pas d’abonnement forcé.

Preuve sociale :

- Dès disponibilité : note App Store / Play Store, nombre de parents, avis courts.
- Avant disponibilité : mention sobre “Conçu pour les nouveaux parents”.

Tableau comparatif Free vs Premium :

| Fonction | Free | Premium |
|---|---|---|
| Tracking illimité | Oui | Oui |
| UI Nuit OLED | Oui | Oui |
| Timeline 7 jours | Oui | Oui |
| Historique illimité | Non | Oui |
| Exports PDF illimités | 1 / 7 jours | Illimités |
| SweetSpot local | Teaser | Complet |
| Backup chiffré | Oui | Oui |

CTA principal :

> Débloquer BabyLog Lifetime — 29,99 $

Mentions secondaires :

- Ou 4,99 $ / mois.
- Garantie de remboursement via App Store ou Google Play.
- Restore purchases.
- Aucun abonnement caché si lifetime.

---

## KPIs ET INSTRUMENTATION

### Tableau KPIs

| KPI | Benchmark | Cible | Source |
|---|---|---:|---|
| Installs par pays | Store consoles | Suivre USA, UK, CA, AU, JP, IT, ES | App Store Connect, Play Console |
| Onboarding complété | 70 à 85 % | 85 % | Event log local |
| Time to first value | Utility app : moins de 5 min | Moins de 60 s | Event log local |
| Usage Jour 1 | 25 à 40 % | 40 % | Event log local, consoles |
| Rétention D1 | 25 à 40 % | 40 % | Consoles, event log |
| Rétention D7 | 10 à 20 % | 20 % | Consoles, event log |
| Rétention D30 | 5 à 10 % | 10 % | Consoles, event log |
| DAU / MAU | 15 à 30 % | 30 % | Event log local |
| Sessions par jour | 8 à 12 actions attendu | 8 sessions ou plus | Event log local |
| Durée session tracking | Utility courte | Moins de 20 s | Event log local |
| Conversion free vers premium | T1 : 2 à 5 %, T2 : 1 à 3 % | 2,4 % blended réaliste, 3 % après A/B | Store, event log |
| ARPPU net | Prix et mix produits | 22 $ | Store, event log |
| RPI 30 jours | North star | 0,65 $ | Store, AdMob, event log |
| eCPM réel | Benchmarks T1 / T2 | Dans ±20 % des hypothèses | AdMob |
| Taux backup J30 | Pas de benchmark imposé | 25 % | Event log local |
| Churn abonnement mensuel | Utility subscription | Moins de 8 % / mois si subscriptions actives | Store |

### Événements à logger

Stockage : local uniquement, SQLite ou MMKV. Aucun envoi automatique. Export manuel optionnel via Share Sheet.

| Événement | Déclencheur | Propriétés |
|---|---|---|
| onboarding_started | Ouverture onboarding | timestamp, pays store, langue |
| onboarding_completed | Fin onboarding | timestamp, durée |
| first_tracking_event | Premier Feed, Sleep ou Diaper | type, mode nuit actif |
| first_value_moment | 3 événements trackés ou premier PDF | timestamp, type |
| session_started | Ouverture app | heure locale, mode nuit, batterie faible |
| tracking_completed | Fin d’un événement | type, durée, origine |
| free_limit_reached | Historique 7 jours dépassé ou export limité | limite, écran |
| sweetSpot_teaser_shown | Teaser prédiction après 3 jours | jours de données, écran |
| pdf_export_started | Tap export PDF | période, premium actif |
| pdf_export_completed | PDF généré | durée, succès |
| paywall_shown | Affichage paywall | trigger, cohorte prix, offre affichée |
| paywall_closed | Fermeture paywall | temps affiché, CTA vu |
| paywall_converted | Achat réussi | product_id, prix, cohorte, store |
| restore_completed | Restore purchases | succès, erreur |
| rewarded_offered | Proposition rewarded | emplacement, récompense |
| rewarded_completed | Reward validée | récompense, durée |
| backup_export_completed | Backup chiffré généré | taille, méthode partage |
| quota_80_percent | Futur quota IA à 80 % | feature, quota restant |

---

## PROJECTIONS DE REVENUS

Tous les montants sont en USD. Commission store appliquée : 15 %, hypothèse sous 1 M$ annuel.

### Hypothèses

| Hypothèse | Pessimiste | Réaliste | Optimiste |
|---|---:|---:|---:|
| Installs mensuels | 1 000 | 5 000 | 10 000 |
| Mix géographique | 60 % T1 / 40 % T2 | 60 % T1 / 40 % T2 | 60 % T1 / 40 % T2 |
| Conversion T1 | 2,0 % | 3,0 % | 5,0 % |
| Conversion T2 | 1,0 % | 1,5 % | 3,0 % |
| Conversion blended | 1,6 % | 2,4 % | 4,2 % |
| ARPPU net blended | 21,86 $ | 21,86 $ | 21,39 $ |
| Jours actifs moyens / install sur 30 j | 4,5 | 7,5 | 10,5 |
| Revenu ads / DAU / jour blended | 0,01304 $ | 0,01304 $ | 0,01304 $ |

Hypothèse conservatrice : les revenus ads sont calculés sur les 30 premiers jours de chaque cohorte mensuelle. Les utilisateurs retenus au-delà de 30 jours constituent un upside non inclus.

### Scénario pessimiste

- Payeurs : 1 000 × 1,6 % = 16 payeurs ; revenus premium = 16 × 21,86 $ = **350 $**
- DAU équivalent cohorte : 1 000 × 4,5 / 30 = 150 DAU ; ads = 150 × 30 × 0,01304 $ = **59 $**
- Total mensuel = 350 $ + 59 $ = **409 $**
- Total annuel = 409 $ × 12 = **4 908 $** ; RPI 30 jours = 0,350 $ + 0,059 $ = **0,409 $**

### Scénario réaliste

- Payeurs : 5 000 × 2,4 % = 120 payeurs ; revenus premium = 120 × 21,86 $ = **2 623 $**
- DAU équivalent cohorte : 5 000 × 7,5 / 30 = 1 250 DAU ; ads = 1 250 × 30 × 0,01304 $ = **489 $**
- Total mensuel = 2 623 $ + 489 $ = **3 112 $**
- Total annuel = 3 112 $ × 12 = **37 344 $** ; RPI 30 jours = 0,525 $ + 0,098 $ = **0,623 $**

### Scénario optimiste

- Payeurs : 10 000 × 4,2 % = 420 payeurs ; revenus premium = 420 × 21,39 $ = **8 984 $**
- DAU équivalent cohorte : 10 000 × 10,5 / 30 = 3 500 DAU ; ads = 3 500 × 30 × 0,01304 $ = **1 369 $**
- Total mensuel = 8 984 $ + 1 369 $ = **10 353 $**
- Total annuel = 10 353 $ × 12 = **124 236 $** ; RPI 30 jours = 0,898 $ + 0,137 $ = **1,035 $**

### Seuil de viabilité

Seuil utilisateur : non fourni. Hypothèse retenue : **1 000 $ / mois**.

Revenu mensuel par install selon scénario :

- Pessimiste : 0,409 $ / install mensuel
- Réaliste : 0,622 $ / install mensuel
- Optimiste : 1,035 $ / install mensuel

Installs mensuels requis pour 1 000 $ / mois :

- Pessimiste : 1 000 / 0,409 = **2 445 installs / mois**
- Réaliste : 1 000 / 0,622 = **1 607 installs / mois**
- Optimiste : 1 000 / 1,035 = **966 installs / mois**

Conclusion : avec l’hypothèse conservatrice de 1 000 $ / mois, le projet devient viable dès environ **1 607 installs / mois** au scénario réaliste. Merci de confirmer votre seuil réel pour ajuster cette lecture.

---

## RISQUES ET MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Fatigue publicitaire et churn induit | Moyenne | Élevé | Zéro ad nocturne, zéro ad tracking, max 2 banners et 2 natives / jour, rewarded opt-in, arrêt des ads pour premium. |
| Paywall trop agressif | Moyenne | Élevé | Maximum 1 paywall spontané / 7 jours, jamais pendant action critique, bouton fermer visible, refroidissement 24 h. |
| Conversion sous les benchmarks | Moyenne | Élevé | Test A/B prix, lifetime aligné sur attentes anti-SaaS, paywall après win moment, validation landing page avant lancement. |
| eCPM réels sous les benchmarks | Élevée | Moyen | Ne pas dépendre des ads pour la viabilité ; pousser premium ; privilégier rewarded et native ; couper banners si eCPM trop faible. |
| Cannibalisation premium par rewarded | Moyenne | Moyen | Plafond 3 rewarded / jour, preview temporaire, export unitaire, suivi du ratio rewarded complétées / conversion premium. |

---

## PASSATION AU GPT 4

Exigences techniques monétisation à implémenter en Local-First strict :

### IAP

- StoreKit iOS et Google Play Billing Android uniquement.
- Pas de serveur de paywall.
- Pas de vérification d’entitlement côté serveur.
- Entitlements premium stockés localement dans MMKV.
- Cache offline-first : si l’achat est confirmé par le store, l’entitlement doit fonctionner sans réseau.
- Restore purchases obligatoire, disponible dans paywall et Paramètres.
- Restore doit fonctionner offline si l’entitlement est déjà présent localement.
- Gestion des produits : mensuel Tier 1, annuel Tier 1, lifetime Tier 1, mensuel Tier 2, annuel Tier 2, lifetime Tier 2.
- Prévoir produits de lancement ou prix A/B via store configuration, sans remote config obligatoire.

### Ads

- AdMob via config plugin Expo standard, sans code natif personnalisé hors plugin.
- Formats retenus : Native, Banner, Rewarded.
- Format interdit au MVP : Interstitial.
- Aucun appel AdMob avant onboarding terminé.
- Flag local `first_launch_completed` pour interdire ads au premier lancement.
- Flag local `night_mode_active` pour bloquer toute ad en mode Nuit.
- Flag local `is_premium` pour désactiver toutes les ads.
- Emplacements autorisés uniquement : stats diurnes, paramètres.
- Interdire ads sur tracking, timer, timeline active, export PDF, backup, paywall.
- Contenu publicitaire : maxAdContentRating adapté au contexte familial, pas de ciblage santé, pas de données sensibles, pas de personnalisation intrusive.

### Quota IA

- Au MVP : pas de quota IA externe nécessaire.
- Pour features futures : compteur local MMKV.
- Clé de quota : date locale, feature, tier.
- Reset quotidien basé sur timestamp local.
- Jauge UI visible.
- Alerte à 80 % avec CTA non bloquant.
- Aucun comptage serveur.

### Paywall

- Écran natif local, sans backend.
- Affichage contrôlé par événements locaux.
- Cohortes A/B assignées localement par hash de l’install ID.
- Stockage MMKV : cohorte, date d’assignation, prix affiché, dernier affichage paywall.
- Règles locales : max 1 paywall spontané / 7 jours, cooldown 24 h après fermeture.
- Paywall doit lire l’entitlement premium et ne pas s’afficher si premium actif.
- Restore purchases doit être accessible sans navigation complexe.

### Instrumentation

- Event log local dans SQLite ou MMKV.
- Événements listés dans la section KPIs.
- Aucun envoi automatique vers un serveur.
- Export optionnel du event log par l’utilisateur via Share Sheet.
- Les KPIs financiers et rétention sont lus via App Store Connect, Play Console et AdMob.
- Les KPIs produit et funnel sont lus via event log local exportable.

### Contraintes absolues

- Aucune dépendance backend pour la monétisation.
- Aucun paywall bloquant la valeur cœur.
- Aucune publicité sur écran critique.
- Aucune donnée de santé utilisée pour le ciblage publicitaire.
- Backup et export de données jamais paywallés.
- Le modèle doit rester utilisable en mode avion complet, y compris restore et entitlements.

## ADDENDUM DE CONFORMITÉ ET PRÉCISIONS (v2)
1. Consentement publicitaire EEA/UK : implémenter Google UMP (User Messaging Platform)
via config plugin Expo, consentement stocké localement sur device,
repli automatique en annonces non personnalisées si refus ou absence de consentement.
Config AdMob : child-directed = false (utilisateurs = parents adultes),
maxAdContentRating = G ou PG, aucune donnée de santé dans le ciblage.
2. Hypothèse de mix produits pour ARPPU net blended :
Tier 1 : 75% Lifetime, 20% Annuel, 5% Mensuel | Tier 2 : 80% Lifetime, 15% Annuel, 5% Mensuel.
Recalculer ARPPU net blended avec ce mix et documenter le résultat dans les projections.
3. Seuil de viabilité utilisateur : [À CONFIRMER PAR L'UTILISATEUR, défaut 1000 $/mois].
Installs mensuels requis au scénario réaliste : seuil / 0.622 $.
4. Clarification placements native : interdits sur tout écran affichant un teaser
ou un paywall (pas de pub sur une frustration). Uniquement : stats diurnes, Paramètres.
5. Harmonisation : revenu annuel scénario réaliste = 37 344 $ (corriger le résumé exécutif).

---

Rappel final : transmettez ce document **03-monetization-strategy.md** au **GPT 4 — Tech Stack Architect**, en particulier la section **PASSATION AU GPT 4**, qui liste les exigences techniques de monétisation Local-First : IAP natifs, entitlements MMKV, AdMob via config plugin Expo, formats retenus, quota IA local, paywall local, instrumentation locale et absence totale de backend de monétisation.