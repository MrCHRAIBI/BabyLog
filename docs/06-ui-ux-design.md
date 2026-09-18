Voici le fichier `06-ui-ux-design.md` final, **strictement identique à la version livrée** (même périmètre MVP + Release 1, mêmes écrans, modales, états, routes, monétisation, complexité), avec **uniquement la palette de couleurs remplacée** par la palette lavande `#8893FE`. Rien d’autre n’a été ajouté ni modifié.

# 06-ui-ux-design.md

## 1. DESIGN UI/UX — BabyLog Offline — version finale corrigée

Document final corrigé, stable, exploitable sans interprétation majeure.  
Destinataire : GPT 7 — Development Guide.

Périmètre :
- MVP BabyLog Offline.
- Release 1 : export PDF, Emergency Doctor Mode, backup / restore manuel chiffré.
- Local-first.
- Aucun backend obligatoire.
- Aucune publicité.
- Trial local 72 h.
- Premium annuel et lifetime.
- Light et dark OLED obligatoires.
- UX douce, premium, nocturne, accessible, simple pour agent IA.

---

## 2. RÉSUMÉ EXÉCUTIF

| Item | Valeur |
|---|---|
| Écrans principaux | 7 |
| Modales secondaires | 9 |
| Composants design system | 17 |
| Tabs | 3 |
| Thèmes | light, dark OLED, auto horaire |
| Publicité | Aucune |
| Paywall | Contextuel, non bloquant, fermeture visible |
| Score de complexité UI agent IA | 4,5 / 10 |
| Prochaine étape | Transmission au GPT 7 |

Écrans principaux retenus :
1. SetupProfileScreen
2. TrackingHomeScreen
3. TimelineScreen
4. EventEditScreen
5. SettingsScreen
6. ExportScreen
7. BackupScreen

Modales secondaires retenues :
1. TrialOfferSheet
2. PaywallSheet
3. RestorePurchasesSheet
4. ConfirmDeleteEventSheet
5. ConfirmDeleteProfileSheet
6. DiscardChangesSheet
7. BackupExportSheet
8. RestoreBackupConfirmSheet
9. ProfileSwitcherSheet

Principes non négociables :
- Tracking core jamais limité.
- Aucune permission au premier lancement.
- Aucun paywall au premier lancement.
- Aucune donnée prise en otage.
- Dernière fenêtre de 24 h consultable gratuitement.
- Suppression des données gratuite.
- Mode nuit utilisable immédiatement.
- Aucune couleur en dur dans les écrans.
- Aucune animation custom.
- Aucune dépendance UI lourde.

---

## 3. INPUTS REÇUS

Documents utilisés :
- 02-feature-ideas-final.md
- 03-monetization-strategy-final.md
- 04-tech-stack-final.md
- 05-data-model-final.md
- 06-ui-ux-design.md initial

Contraintes produit retenues :
- MVP : F01 tracking 1-tap, F02 mode Nuit OLED, F03 timeline + résumé quotidien, F04 édition / suppression / undo, F05 profil bébé local.
- Release 1 : F07 export PDF, F08 Emergency Doctor Mode, F09 backup / restore manuel chiffré.
- Release 2 : co-parent transfer, allaitement avancé, passation de relais.
- Release 3 : stats, prédictions, notifications.
- Release 4 : allergènes, médicaments, multi-baby avancé.
- Aucun diagnostic médical.
- Aucune publicité.
- Aucun cloud obligatoire.
- Localisations : en, de, fr, ja, ko, ar.
- RTL obligatoire pour ar.

Personas dominants :
- Parent de nouveau-né, usage nocturne, fatigué, une main.
- Parent soucieux de privacy, offline, données locales.
- Co-parent en relais.

Core loop :
1. Ouvrir l’app.
2. Logger tétée, sommeil ou couche en un geste.
3. Timer persistant si besoin.
4. Consulter timeline et résumé.
5. Corriger avec édition ou undo.

---

## 4. DIRECTION ARTISTIQUE ET PALETTE DOUCE

### 4.1 Intention visuelle

Style : utility premium, carnet numérique calme, médical doux.  
Sensation : rassurant, silencieux, rapide, utilisable à une main à 3 h du matin.

Direction : **Lavande nocturne**.  
Couleur maîtresse : `#8893FE`.  
Ambiance : premium calme, nocturne, douce, bleu-violet discret, surfaces reposantes.

Promesse visuelle :
- Suivi local.
- Privacy visible.
- Zéro bruit visuel.
- Confort nocturne.
- Premium sobre.

### 4.2 Principes visuels

- 1 action primaire par zone.
- 1 information principale par carte.
- Pas de densité inutile.
- Pas de décor gratuit.
- Pas de glow.
- Pas de néon.
- Pas de dégradé flashy.
- Pas de blanc pur.
- Pas de noir pur.
- Icônes Ionicons uniquement.
- Textes toujours accompagnés de labels explicites.
- Couleurs douces, peu saturées, confortables pour usage prolongé.

### 4.3 Tokens couleurs light et dark OLED

Les couleurs ci-dessous sont des tokens sémantiques.  
Aucune fiche écran ne doit utiliser de couleur en dur.

| Token | Light | Dark OLED | Usage |
|---|---|---|---|
| primary | #4E58C8 | #8893FE | Actions principales, timer actif |
| on-primary | #F8F9FF | #0E1230 | Texte et icônes sur primary |
| primary-muted | #EAECFE | #1B2248 | Fonds doux liés à l’action primaire |
| accent | #7A5A44 | #D2A78C | Accent chaleureux, équilibre visuel |
| on-accent | #FBF6F2 | #241712 | Texte sur accent |
| surface | #F8F8FC | #050711 | Fond principal |
| surface-raised | #FDFDFF | #10142A | Cartes, sheets |
| surface-muted | #EEF0F9 | #161B36 | Fonds secondaires, skeletons |
| text-primary | #24263A | #EAECFB | Titres, contenu principal |
| text-secondary | #5A5D75 | #B9BEDF | Libellés secondaires |
| text-disabled | #8B8EA6 | #767BA3 | Éléments désactivés |
| border | #DFE2F0 | #262D52 | Bordures fines |
| success | #2F6B55 | #9BC8B5 | Succès |
| warning | #8A6A2F | #D7B47A | Alertes douces |
| danger | #9C4448 | #D99AA0 | Erreurs, suppressions |
| info | #4360A6 | #9FB4E6 | Information neutre |
| premium-accent | #7C5C33 | #D9BC85 | Badge premium, locks |
| quota-free | #4360A6 | #9FB4E6 | Futur quota free |
| quota-premium | #7C5C33 | #D9BC85 | Futur quota premium |
| overlay | #24263A66 | #050711CC | Overlay contrôles |
| backdrop | #24263A40 | #05071180 | Fond derrière modales |

Règles d’usage de la couleur maîtresse `#8893FE` :
- En light, `#8893FE` est réservé aux icônes actives, bordures sélectionnées, fonds très doux et éléments non textuels.
- En light, les boutons principaux utilisent le dérivé profond `#4E58C8` avec `on-primary` `#F8F9FF`.
- En light, interdiction absolue d’utiliser `#8893FE` comme fond avec du texte blanc.
- En dark OLED, `#8893FE` est la couleur interactive principale : boutons, liens, icônes actives, timer.
- Le premium conserve une teinte bronze douce pour rester distinct du primaire lavande.

### 4.4 Contrastes critiques estimés

| Pair | Light | Dark OLED |
|---|---|---|
| text-primary sur surface | environ 14,5:1 | environ 16,8:1 |
| text-secondary sur surface | environ 6,6:1 | environ 9,4:1 |
| on-primary sur primary | environ 5,6:1 | environ 6,2:1 |
| danger sur surface | environ 5,9:1 | environ 8,4:1 |
| premium-accent sur surface | environ 5,9:1 | environ 10,4:1 |
| text-primary sur surface-muted | environ 12,6:1 | environ 13,2:1 |

Tous les textes critiques visent WCAG AA.  
Les éléments désactivés ne portent jamais une information essentielle.

### 4.5 Mode Nuit OLED

Le dark theme est le mode Nuit OLED.

Règles :
- Fond très profond bleuté, jamais noir pur.
- Élévation par surfaces et bordures, pas par ombres dures.
- Boutons larges.
- Contraste confortable mais non agressif.
- Tokens dark complets, pas une simple inversion du light.
- La lavande `#8893FE` y reste douce : pas de néon, pas de glow.

Modes d’apparence :
- Clair : light.
- Sombre : dark OLED permanent.
- Auto : bascule horaire entre light et dark OLED.

Mapping technique :
- night_mode = off : light.
- night_mode = on : dark OLED.
- night_mode = auto : planification horaire.

### 4.6 Couleurs interdites

- Blanc pur #FFFFFF comme fond principal.
- Noir pur #000000 comme fond principal.
- `#8893FE` avec texte blanc en light.
- Rouges vifs.
- Oranges néon.
- Jaunes saturés.
- Bleus électriques hors échelle lavande tokenisée.
- Dégradés flashy.
- Effets verre brillants.
- Glow décoratif.
- Toute couleur fatigante pour usage nocturne prolongé.

---

## 5. ARCHITECTURE D’INFORMATION ET NAVIGATION

### 5.1 Arborescence principale

Racine :
- SetupProfileScreen : premier profil, onboarding inline.

Tabs :
- Tab 1 : TrackingHomeScreen, action cœur.
- Tab 2 : TimelineScreen, journal, résumé, correction.
- Tab 3 : SettingsScreen, profil, apparence, premium, données.

Stack secondaire :
- EventEditScreen
- ExportScreen
- BackupScreen
- ProfileNewScreen
- ProfileEditScreen

Modales routées :
- PaywallSheet
- TrialOfferSheet
- RestorePurchasesSheet

Modales locales :
- ConfirmDeleteEventSheet
- ConfirmDeleteProfileSheet
- DiscardChangesSheet
- BackupExportSheet
- RestoreBackupConfirmSheet
- ProfileSwitcherSheet

### 5.2 Justification des tabs

| Tab | Rôle | Fréquence |
|---|---|---|
| Accueil | Log 1-tap, timer, dernier événement | Très élevée, surtout la nuit |
| Journal | Timeline, résumé quotidien, correction | Élevée |
| Réglages | Profil, thème, premium, backup | Faible à moyenne |

Pas de tab Statistiques au MVP.  
Pas de tab Prédiction au MVP.  
Pas de tab IA au MVP.

### 5.3 Règle des 3 taps

| Action | Taps |
|---|---|
| Logger tétée, sommeil ou couche | 1 |
| Consulter timeline | 1 |
| Corriger un événement | 2 avant édition |
| Ouvrir paywall depuis action premium | 2 maximum avant décision |
| Créer une sauvegarde | 3 |
| Changer de profil actif premium | 2 |

Profondeur maximale hors modales : 2.

### 5.4 Inventaire des modales retenues

| Modale | Type | Déclencheur | Justification |
|---|---|---|---|
| TrialOfferSheet | Sheet | Premier profil créé | Proposer trial 72 h sans paiement |
| PaywallSheet | Sheet ou modal | Action premium ou fin de trial | Conversion non agressive |
| RestorePurchasesSheet | Sheet | Restore depuis paywall ou settings | Obligation store, clarté |
| ConfirmDeleteEventSheet | Dialog ou sheet | Suppression événement | Prévention erreur |
| ConfirmDeleteProfileSheet | Sheet | Suppression profil | Destruction cascade |
| DiscardChangesSheet | Dialog | Formulaire non enregistré | Prévention perte |
| BackupExportSheet | Sheet formulaire | Export backup | Secret et validation |
| RestoreBackupConfirmSheet | Sheet formulaire | Import backup | Confirmation écrasement |
| ProfileSwitcherSheet | Sheet | Tap profil actif | Multi-profil premium |

### 5.5 Modales exclues

| Modale | Statut | Raison |
|---|---|---|
| FilterSheet | Exclue | Timeline MVP chronologique simple |
| SortSheet | Exclue | Tri fixed started_at descendant |
| DetailSheet | Exclue | Tap événement ouvre édition |
| SelectionSheet | Exclue | Pas de sélection multiple |
| PermissionSheet | Exclue | Aucune permission premier lancement |
| QuotaSheet | Exclue | Pas de quota MVP |
| RewardedSheet | Exclue | Aucune publicité |
| HelpSheet | Exclue | Aide courte inline, V1.1 |
| LegalSheet | Exclue | Mentions inline dans paywall et settings |
| RatingSheet | Exclue | Report V1.1 |
| ConfirmReplaceTimerSheet | Exclue | Remplacement de timer interdit silencieusement, toast explicite |

### 5.6 Routes Expo Router retenues

| Route | Écran ou modale | Type |
|---|---|---|
| src/app/_layout.tsx | Racine, thème, providers, redirection | root |
| src/app/setup.tsx | SetupProfileScreen | stack |
| src/app/(tabs)/_layout.tsx | Layout tabs | tabs |
| src/app/(tabs)/index.tsx | TrackingHomeScreen | tab |
| src/app/(tabs)/timeline.tsx | TimelineScreen | tab |
| src/app/(tabs)/settings.tsx | SettingsScreen | tab |
| src/app/profile/new.tsx | Création profil supplémentaire | stack |
| src/app/profile/[id]/edit.tsx | Édition profil | stack |
| src/app/event/[id]/edit.tsx | Édition ou création événement | stack |
| src/app/settings/export.tsx | ExportScreen | stack |
| src/app/settings/backup.tsx | BackupScreen | stack |
| src/app/paywall.tsx | PaywallSheet | modal |
| src/app/trial-offer.tsx | TrialOfferSheet | modal |
| src/app/restore-purchases.tsx | RestorePurchasesSheet | modal |

Modales locales non routées :
- components/modals/ConfirmDeleteEventSheet.tsx
- components/modals/ConfirmDeleteProfileSheet.tsx
- components/modals/DiscardChangesSheet.tsx
- components/modals/BackupExportSheet.tsx
- components/modals/RestoreBackupConfirmSheet.tsx
- components/modals/ProfileSwitcherSheet.tsx

Note :
- src/app/settings/billing.tsx n’est pas requis. La gestion premium passe par PaywallSheet et RestorePurchasesSheet.
- src/app/settings/ai.tsx est exclu du MVP.

---

## 6. USER FLOWS

### Flow 1 — Premier lancement

1. L’utilisateur ouvre l’app.
2. Aucun compte, aucune permission, aucun paywall.
3. SetupProfileScreen affiche la valeur locale et privée.
4. L’utilisateur saisit prénom et date de naissance.
5. Validation locale.
6. Création du profil.
7. Toast succès.
8. TrialOfferSheet s’ouvre si trial non démarré.
9. L’utilisateur démarre l’essai ou continue gratuitement.
10. Navigation vers TrackingHomeScreen.
11. Le premier log peut être fait immédiatement.

### Flow 2 — Core loop quotidien

1. L’utilisateur ouvre TrackingHomeScreen.
2. Si timer actif, carte timer visible avec temps écoulé.
3. Tap Tétée ou Sommeil : démarre ou arrête le timer.
4. Tap Couche : log rapide avec dernier type connu ou wet.
5. Long press Couche : création précise avec choix du type.
6. Tap Note : ouvre EventEditScreen en création note.
7. Après enregistrement, toast succès.
8. Après suppression, toast Undo.
9. Timeline et résumé sont mis à jour localement.

### Flow 3 — Timer actif et action concurrente

1. Un timer feeding ou sleep est actif.
2. L’utilisateur tape sur l’autre action timer.
3. L’app ne remplace pas silencieusement le timer.
4. Toast : Un timer est déjà en cours. Terminez-le d’abord.
5. L’utilisateur termine le timer actuel puis démarre l’autre.
6. Les actions instantanées Couche et Note restent autorisées.

### Flow 4 — Fin de trial

1. Le trial local expire.
2. L’app reste utilisable en free minimal.
3. Si le paywall de fin de trial n’a pas encore été vu, PaywallSheet s’ouvre une fois.
4. Le paywall est fermable.
5. Tracking core reste gratuit et illimité.
6. Timeline limitée aux dernières 24 h.
7. Aucune donnée n’est supprimée.

### Flow 5 — Upgrade premium

1. L’utilisateur tente une action premium : historique > 24 h, export PDF, backup, deuxième profil.
2. PaywallSheet s’ouvre avec contexte.
3. L’utilisateur choisit annuel ou lifetime.
4. Prix localisés fournis par le store.
5. Achat confirmé : état succès.
6. Entitlements locaux mis à jour.
7. Fermeture courte puis reprise de l’action.
8. Restore possible via RestorePurchasesSheet.

### Flow 6 — Emergency Doctor Mode

1. L’utilisateur ouvre ExportScreen.
2. Il choisit mode Urgence.
3. Il choisit 24 h.
4. La consultation écran est gratuite.
5. Le résumé et la liste des dernières 24 h s’affichent.
6. PDF, partage et période 48 h sont premium.
7. Aucun paywall ne bloque la consultation 24 h.

### Flow 7 — Backup et restore

1. L’utilisateur ouvre Settings puis BackupScreen.
2. Export : BackupExportSheet demande PIN ou mot de passe.
3. Le fichier chiffré est généré puis partagé via share sheet natif.
4. Import : l’utilisateur choisit un fichier .babylog.
5. RestoreBackupConfirmSheet demande le secret.
6. Validation Zod, déchiffrement, restauration transactionnelle.
7. Succès : toast et rechargement.
8. Erreur : message clair, aucune donnée écrasée.

### Flow 8 — Erreur et récupération

1. Une erreur locale SQLite, fichier ou store survient.
2. L’écran affiche StatePanel error avec action Réessayer.
3. Les données ne sont jamais supprimées silencieusement.
4. Erreur paiement : fermer, réessayer ou restaurer.
5. Erreur backup : rollback complet.
6. Événement supprimé par erreur : Undo via toast.

---

## 7. DESIGN SYSTEM

### 7.1 Principes composants

- Composants limités et réutilisables.
- Pas de composant magique.
- Pas de dépendance UI lourde.
- NativeWind v4 uniquement.
- Toutes les couleurs passent par tokens.
- Toutes les cibles tactiles font au moins 44 pt.
- Toutes les actions ont un feedback.
- Toutes les modales ont une fermeture claire.

### 7.2 Typographie

Police système uniquement :
- iOS : SF Pro
- Android : Roboto

| Niveau | Taille | Graisse | Hauteur | Usage |
|---|---:|---:|---:|---|
| display | 32 | semibold | 40 | Titres premium, paywall |
| title-lg | 24 | semibold | 32 | Titres d’écran |
| title-md | 20 | semibold | 28 | Sections, cartes importantes |
| body | 16 | regular | 24 | Contenu principal, inputs |
| body-sm | 14 | regular ou medium | 20 | Listes, labels secondaires |
| caption | 12 | regular | 16 | Horodatages, mentions courtes |

Règles :
- Dynamic Type respecté.
- Pas de lineHeight figé empêchant l’agrandissement.
- Textes longs multi-lignes autorisés.
- RTL : alignement start logique.

### 7.3 Spacing

Grille 4 pt obligatoire.

| Token | Valeur |
|---|---:|
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-6 | 24 |
| space-8 | 32 |
| space-12 | 48 |

### 7.4 Radius

| Token | Valeur |
|---|---:|
| radius-sm | 8 |
| radius-md | 12 |
| radius-lg | 16 |
| radius-full | 9999 |

### 7.5 Élévation

| Niveau | Usage |
|---|---|
| elevation-1 | Cartes simples en light |
| elevation-2 | Sheets, modales, toast |

Dark OLED :
- Pas d’ombre dure.
- Élévation par surface-raised et border.
- Ombre quasi invisible.

### 7.6 Iconographie

- Ionicons uniquement.
- Icônes outline simples.
- Toujours accompagnées d’un label accessible si action.
- Icônes de date miroir en RTL.

### 7.7 Inventaire des composants retenus

| Composant | Rôle | Props clés | États |
|---|---|---|---|
| ScreenContainer | Conteneur d’écran | children, safeAreaEdges, scroll, keyboardAvoiding, backgroundToken | contenu, loading via enfant |
| Text | Texte | children, variant, colorToken, align, numberOfLines | normal, disabled, error |
| Pressable | Zone tactile générique | onPress, onLongPress, disabled, minHitSize, feedback, accessibilityLabel | default, pressed, disabled |
| Button | Action principale ou secondaire | label, onPress, variant, size, iconLeft, iconRight, loading, disabled, fullWidth | default, pressed, disabled, loading |
| IconButton | Action icône | icon, accessibilityLabel, onPress, variant, disabled, loading | default, pressed, disabled, loading |
| Input | Saisie texte | label, value, onChangeText, placeholder, helperText, errorText, secureTextEntry, multiline, maxLength, keyboardType, disabled | default, focus, error, disabled |
| Card | Surface | children, variant, paddingToken, onPress, selected, disabled | default, pressed, selected, disabled |
| ListItem | Ligne de liste ou settings | title, subtitle, leftIcon, rightElement, onPress, disabled, destructive, lockedPremium | default, pressed, disabled |
| Badge | Petit libellé | label, tone, icon | statique |
| Chip | Choix période ou option | label, selected, onPress, onClose, disabled | default, selected, disabled |
| Switch | Réglage binaire | value, onValueChange, label, disabled | on, off, disabled |
| SegmentedControl | Choix limités | options, selectedValue, onChange, fullWidth | selected, disabled |
| Modal | Modale centrée ou dialog | visible, onRequestClose, title, children, footer, showClose | loading, contenu, erreur |
| BottomSheet | Sheet iOS et Android | visible, onClose, title, children, footer, dismissOnBackdrop, swipeEnabled | loading, contenu, erreur |
| Toast | Feedback léger | visible, message, tone, actionLabel, onAction, duration | visible, hidden |
| StatePanel | Empty state et error state | variant, icon, title, description, actionLabel, onAction | statique |
| SkeletonLoader | Chargement | variant, lines, animate | active, reduced motion |

### 7.8 Patterns sans composant dédié

ConfirmDialog pattern :
- Utiliser Modal ou BottomSheet.
- Titre clair.
- Message court.
- Bouton annuler par défaut.
- Bouton destructif danger.
- Focus initial sur annuler.

Paywall pattern :
- Composé avec ScreenContainer, Text, Card, Button, Badge, Chip.
- Pas de composant Paywall dédié.

Premium lock pattern :
- Badge tone premium.
- Icône cadenas.
- Label accessible Fonction Premium.
- Tap ouvre PaywallSheet si free.

### 7.9 États globaux

- Toast : feedback non bloquant.
- SkeletonLoader : chargements principaux.
- StatePanel empty : ton bénéfice, jamais culpabilisant.
- StatePanel error : message clair + retry.
- Undo : toast avec action pendant 6 à 10 secondes.
- Aucune erreur ne doit laisser croire que les données sont perdues.

### 7.10 Règles light et dark

- Light : surfaces lavande très claires, ombres subtiles.
- Dark OLED : surfaces profondes bleutées, contraste doux, boutons larges.
- Les tokens sémantiques changent selon le thème.
- Aucun écran ne définit de couleur brute.
- Les états loading, empty, error, success sont compatibles light/dark.

---

## 8. FICHES ÉCRANS PRINCIPAUX

### 8.1 SetupProfileScreen — src/app/setup.tsx

Objectif :
Créer le premier profil bébé sans compte, sans permission, puis donner accès immédiatement au tracking.

Équivalent data model :
ProfilCreationScreen.

Persona :
Parent pressé, fatigué, qui veut une app utilisable en moins d’une minute.

Données :
- baby_profile
- babyProfileRepository.create
- babyProfileRepository.countProfiles
- eventRepository.create

Champs :
- name : 1 à 80 caractères
- birth_date : epoch ms valide

Wireframe :
HEADER
- Logo sobre
- Titre : Bienvenue dans BabyLog
- Sous-titre : Suivez votre bébé, sans compte, sans cloud

CONTENT
- Carte valeur :
  - 1 tap pour logger tétée, sommeil ou couche
  - Mode nuit confortable
  - Données locales
- Carte formulaire :
  - Input Prénom de bébé
  - Input Date de naissance
  - Helper stockage local
- Bouton Créer le profil

FOOTER
- Caption : Aucune permission requise. Données stockées localement.

Thème :
surface, surface-raised, text-primary, text-secondary, primary, on-primary, border

États :
LOADING
- SkeletonLoader carte valeur et formulaire
- Bouton loading pendant création

EMPTY
- Formulaire vierge
- Message : Créez le profil de votre bébé en moins d’une minute.
- CTA : bouton principal

ERROR
- Validation inline sous champ
- Erreur SQLite : StatePanel error avec retry
- Message : Une erreur locale est survenue. Réessayez, vos données restent sur l’appareil.

SUCCESS
- Toast Profil créé
- Navigation vers TrackingHomeScreen
- Ouverture TrialOfferSheet si trialState = not_started

Actions :
- Tap input prénom : focus clavier
- Tap input date : picker natif ou clavier adapté
- Tap Créer le profil : validation Zod, création, analytics first_profile_created
- onboarding_started au montage de l’écran
- onboarding_completed à la création réussie

Clavier et safe areas :
- KeyboardAvoiding
- Scroll vers champ actif
- Safe area bas respectée
- Bouton visible au-dessus du clavier

Accessibilité :
- Labels : Prénom de bébé, Date de naissance, Créer le profil
- Ordre : titre, prénom, date, bouton
- Cible 44 pt minimum
- Helper lisible

Monétisation :
- Aucun paywall
- Aucune publicité
- TrialOfferSheet après succès seulement

Animations :
- Aucune animation custom
- Transitions natives uniquement

---

### 8.2 TrackingHomeScreen — src/app/(tabs)/index.tsx

Objectif :
Enregistrer tétée, sommeil, couche ou note en un geste, avec timer persistant.

Persona :
Parent épuisé, usage nocturne, une main.

Données :
- baby_profile actif
- timer_state actif
- log_event récents
- timerRepository.getActiveByProfile
- timerRepository.startTimer
- timerRepository.stopTimer
- logEventRepository.create
- logEventRepository.completeTimerAndCreateEvent
- ui:last_diaper_type en MMKV

Wireframe :
HEADER
- Bouton profil actif : prénom + âge raccourci
- IconButton mode nuit
- Tap profil ouvre ProfileSwitcherSheet

CONTENT
- Carte timer si actif :
  - Icône type
  - Libellé Tétée en cours ou Sommeil en cours
  - Temps écoulé
  - Bouton Terminer
- Grille 4 actions larges :
  - Tétée
  - Sommeil
  - Couche
  - Note
- Carte dernier événement :
  - Type
  - Heure
  - Durée ou détail court
  - Tap pour modifier

FOOTER
- Tab bar native

Thème :
surface, surface-raised, primary, on-primary, text-primary, text-secondary, border

États :
LOADING
- SkeletonLoader sur carte timer et dernier événement
- Boutons d’action visibles rapidement

EMPTY
- Message : Aucun événement pour l’instant. Enregistrez la première tétée, sieste ou couche en un geste.
- Pas de CTA séparé car actions déjà visibles

ERROR
- StatePanel retry si lecture initiale échoue
- Toast danger si écriture échoue

SUCCESS
- Boutons actifs
- Timer affiché si actif
- Toast succès après log
- Timer annoncé comme région live

Actions :
- Tap Tétée :
  - Si aucun timer feeding : startTimer
  - Si timer feeding actif : completeTimerAndCreateEvent
  - Si timer sleep actif : toast Un timer est déjà en cours. Terminez-le d’abord.
- Tap Sommeil :
  - Si aucun timer sleep : startTimer
  - Si timer sleep actif : completeTimerAndCreateEvent
  - Si timer feeding actif : toast Un timer est déjà en cours. Terminez-le d’abord.
- Tap Couche :
  - Crée événement diaper avec ui:last_diaper_type ou wet
  - Met à jour ui:last_diaper_type
- Long press Couche :
  - Ouvre EventEditScreen id=new type=diaper
- Tap Note :
  - Ouvre EventEditScreen id=new type=note
- Tap Terminer timer :
  - Arrête timer et crée événement
- Tap dernier événement :
  - Ouvre EventEditScreen
- Tap profil :
  - Ouvre ProfileSwitcherSheet
- Tap mode nuit :
  - Bascule settings:night_mode entre off et on
  - Si auto était actif, le passage en manuel est assumé

Clavier et safe areas :
- Pas de clavier direct
- Safe areas haut et bas gérées
- Tab bar visible

Accessibilité :
- Boutons avec labels complets
- Timer annoncé comme région live
- Icônes accompagnées de texte
- Cibles larges 44 pt minimum
- Mode nuit accessible : Activer ou désactiver le mode nuit

Monétisation :
- Aucun ad slot
- Aucun paywall sur actions core
- Aucun badge premium sur boutons core

Animations :
- Aucune animation custom
- Feedback pressé et toast uniquement

---

### 8.3 TimelineScreen — src/app/(tabs)/timeline.tsx

Objectif :
Visualiser la journée, consulter les dernières 24 h, lire le résumé quotidien, accéder à l’édition.

Persona :
Parent ou co-parent qui veut comprendre la journée d’un coup d’œil.

Données :
- log_event
- logEventRepository.getTimelineDay
- logEventRepository.getRecentWindow
- logEventRepository.listByProfilePage si premium
- logEventRepository.getStatsByRange
- logEventRepository.softDelete
- logEventRepository.restore

Tri :
started_at descendant.

Filtres :
- Profil actif
- deleted_at null
- Free : dernières 24 h uniquement

Wireframe :
HEADER
- Titre Journal
- Navigation date :
  - IconButton Jour précédent
  - Libellé date
  - IconButton Jour suivant désactivé si aujourd’hui

CONTENT
- Carte Résumé :
  - Free : Résumé des dernières 24 h
  - Premium : Résumé du jour sélectionné
  - Tétées : nombre
  - Sommeil : durée totale
  - Couches : nombre
  - Notes : nombre
- Liste chronologique :
  - ListItem par événement
  - Icône type
  - Libellé type
  - Heure
  - Durée, quantité future ou type de couche
  - Extrait de note
- Si free :
  - Carte Historique complet avec Badge premium
  - Texte : Voir au-delà des dernières 24 h

FOOTER
- Tab bar native

Thème :
surface, surface-raised, text-primary, text-secondary, border, premium-accent

États :
LOADING
- SkeletonLoader liste et résumé

EMPTY
- Message : Rien sur cette période pour l’instant. Dès qu’un événement est enregistré, il apparaît ici.
- CTA secondaire : Ajouter un événement vers TrackingHome

ERROR
- StatePanel : Impossible de charger la timeline.
- Action retry

SUCCESS
- Résumé affiché
- Liste affichée
- Indicateur premium si historique verrouillé

Actions :
- Tap Jour précédent :
  - Si premium : charge jour
  - Si free et au-delà de 24 h : PaywallSheet trigger history_limit_reached
- Tap Jour suivant :
  - Retour vers aujourd’hui
  - Jamais vers futur
- Tap ListItem :
  - Ouvre EventEditScreen
- Tap carte historique verrouillé :
  - PaywallSheet
- Long press ListItem :
  - ConfirmDeleteEventSheet

Clavier et safe areas :
- Pas de clavier
- Safe areas haut et bas gérées

Accessibilité :
- Jour précédent : Afficher le jour précédent
- Jour suivant : Afficher le jour suivant
- Résumé lu comme groupe
- ListItem label combine type, heure, détail
- Badge premium lit Fonction Premium

Monétisation :
- Pas d’ad slot
- Paywall uniquement sur historique > 24 h
- Pas de blocage du tracking

Animations :
- Aucune animation custom

---

### 8.4 EventEditScreen — src/app/event/[id]/edit.tsx

Objectif :
Corriger, compléter ou supprimer un événement.

Persona :
Parent qui corrige une erreur de saisie nocturne.

Données :
- log_event
- logEventRepository.getById
- logEventRepository.update
- logEventRepository.create si id=new
- logEventRepository.softDelete
- logEventRepository.restore

Champs MVP :
- type : feeding, sleep, diaper, note
- started_at
- ended_at si feeding ou sleep
- duration_ms calculée
- diaper_type si diaper
- note_text si note

Feature flag Release 2 :
- features.advancedFeeding = false
- feeding_method, side, amount_ml non exposés au MVP

Validation :
- logEventUpdateSchema ou logEventInsertSchema
- ended_at >= started_at
- duration max 24 h
- note max 2000 caractères
- sleep exige ended_at et duration_ms calculée
- diaper exige diaper_type
- note exige note_text

Wireframe :
HEADER
- Bouton retour
- Titre Modifier l’événement, Nouvelle note ou Nouvelle couche
- Bouton Enregistrer

CONTENT
- SegmentedControl type : Tétée, Sommeil, Couche, Note
- Champs temporels :
  - Début
  - Fin si feeding ou sleep
  - Durée calculée affichée
- Si diaper :
  - SegmentedControl diaper_type : mouillé, selles, mixte, sec
- Si note :
  - Input multiline

FOOTER
- Bouton Supprimer l’événement si événement existant

Thème :
surface, surface-raised, text-primary, text-secondary, border, danger

États :
LOADING
- SkeletonLoader formulaire

EMPTY
- Si événement introuvable : StatePanel empty
- Message : Cet événement n’est plus disponible.
- CTA : Revenir au journal

ERROR
- Validation inline par champ
- Erreur enregistrement : StatePanel error retry

SUCCESS
- Toast Événement enregistré
- Retour Timeline ou Tracking selon origine
- Undo disponible uniquement après suppression

Actions :
- Modifier champ : mise à jour locale
- Tap Début ou Fin : picker natif date et heure
- Tap Enregistrer : validation Zod, create ou update, durée calculée
- Tap retour avec modifications : DiscardChangesSheet
- Tap Supprimer : ConfirmDeleteEventSheet

Clavier et safe areas :
- KeyboardAvoiding
- Scroll vers champ actif
- Safe area bas respectée

Accessibilité :
- Labels explicites
- Erreurs liées aux champs
- Bouton supprimer annoncé comme destructif
- Focus initial sur premier champ ou retour selon contexte

Monétisation :
- Aucun paywall dans l’édition MVP
- Suppression et undo gratuits
- Allaitement avancé hors MVP

Animations :
- Aucune animation custom

---

### 8.5 SettingsScreen — src/app/(tabs)/settings.tsx

Objectif :
Gérer profil actif, apparence, premium, export, backup, privacy.

Persona :
Parent soucieux de privacy, parent premium, co-parent.

Données :
- baby_profile listAll
- préférences MMKV night_mode, night_mode_start_minutes, night_mode_end_minutes
- entitlements locaux
- trialState
- fileExportRepository.listRecent
- settings:active_profile_id

Wireframe :
HEADER
- Titre Réglages

CONTENT
Section Profil
- Carte profil actif : prénom, âge
- Boutons Modifier et Supprimer
- Si premium : liste profils et bouton Ajouter un profil
- Si free : bouton Ajouter un profil avec Badge premium
- Si free avec plusieurs profils hérités : banner Un seul profil actif en version gratuite

Section Apparence
- SegmentedControl : Clair, Sombre, Auto
- Si Auto :
  - Input heure début
  - Input heure fin
- Helper : Le mode sombre est optimisé pour la nuit.

Section Premium
- Statut : Essai actif, Free, Premium annuel, Lifetime
- Bouton Gérer Premium
- Bouton Restaurer

Section Données
- ListItem Export PDF et urgence
- ListItem Sauvegarde et restauration
- ListItem Dernier export avec date ou état vide

Section Confidentialité
- Texte : Les données restent sur cet appareil.
- Caption : Aucune publicité, aucun cloud obligatoire.

FOOTER
- Tab bar native

Thème :
surface, surface-raised, surface-muted, text-primary, text-secondary, border, premium-accent, danger

États :
LOADING
- SkeletonLoader sections profil et données

EMPTY
- Dernier export : Aucun export ni sauvegarde pour l’instant.

ERROR
- Toast si écriture préférence échoue
- StatePanel retry si chargement profils échoue

SUCCESS
- Préférences affichées
- Toast Réglage enregistré

Actions :
- Tap Modifier profil : route profile/[id]/edit
- Tap Supprimer profil : ConfirmDeleteProfileSheet
- Tap Ajouter profil :
  - Si free : PaywallSheet trigger second_profile_attempted
  - Si premium : route profile/new
- Tap profil dans liste premium : définir comme actif
- Tap profil verrouillé en free : PaywallSheet
- Tap thème : enregistre night_mode off/on/auto
- Tap heures Auto : picker temps natif
- Tap Gérer Premium : PaywallSheet
- Tap Restaurer : RestorePurchasesSheet
- Tap Export : ExportScreen
- Tap Sauvegarde : BackupScreen

Clavier et safe areas :
- Pickers temps pour Auto
- Safe areas respectées

Accessibilité :
- Sections labellisées
- Switch et SegmentedControl avec rôles natifs
- Badge premium accessible
- Actions destructives annoncées

Monétisation :
- Pas d’ad slot
- Paywall sur deuxième profil
- Premium visible mais non agressif
- Restore visible

Animations :
- Aucune animation custom

---

### 8.6 ExportScreen — src/app/settings/export.tsx

Objectif :
Générer un rapport PDF pédiatre ou consulter un rapport urgence.

Persona :
Parent préparant une consultation ou situation stressante.

Données :
- logEventRepository.getRangeForExport
- logEventRepository.getStatsByRange
- fileExportRepository.create
- fileExportRepository.markCompleted
- fileExportRepository.markFailed

Modes :
- Pédiatre : 7 ou 14 jours, PDF premium
- Urgence : 24 h consultation écran gratuite, 48 h premium, PDF et partage premium

Tri export :
started_at croissant.

Wireframe :
HEADER
- Bouton retour
- Titre Exporter

CONTENT
- SegmentedControl mode : Pédiatre, Urgence
- Chips période :
  - Pédiatre : 7 jours, 14 jours
  - Urgence : 24 heures, 48 heures
- Carte résumé :
  - Nombre de tétées
  - Sommeil total
  - Nombre de couches
- Note accessibilité données :
  - Urgence 24 h consultation gratuite
  - PDF, partage et 48 h premium

FOOTER
- Bouton principal selon contexte :
  - Consulter gratuitement 24 h
  - Préparer le PDF
  - Débloquer l’export

Thème :
surface, surface-raised, text-primary, text-secondary, primary, on-primary, premium-accent

États :
LOADING
- SkeletonLoader résumé
- Spinner pendant génération PDF

EMPTY
- Message : Aucun événement sur la période choisie. Choisissez une autre période.

ERROR
- StatePanel : La génération a échoué.
- Action retry

SUCCESS
- Toast Rapport prêt
- Share sheet natif si PDF premium généré
- Si urgence 24 h gratuite : affichage résumé écran et liste courte sans partage forcé

Actions :
- Tap mode : adapte périodes
- Tap période : met à jour résumé
- Tap consulter 24 h gratuite : affiche rapport écran
- Tap PDF ou partage :
  - Si premium : génération
  - Si free : PaywallSheet trigger pdf_export_attempted
- Tap partage : share sheet natif

Clavier et safe areas :
- Pas de clavier
- Safe area bas respectée

Accessibilité :
- Chips sélection annoncée
- Résumé lisible par lecteur d’écran
- CTA avec label complet
- Gratuité 24 h clairement vocalisée

Monétisation :
- Aucun ad slot
- PDF pédiatre premium
- PDF urgence premium
- Partage premium
- Période 48 h premium
- Consultation écran 24 h gratuite
- Aucun paywall sur consultation 24 h

Animations :
- Aucune animation custom

---

### 8.7 BackupScreen — src/app/settings/backup.tsx

Objectif :
Exporter ou restaurer manuellement une sauvegarde chiffrée.

Persona :
Parent privacy, changement de téléphone, peur de perdre les données.

Données :
- file_export
- backup service
- baby_profile, log_event, timer_state, file_export repositories
- backupFileSchema

Wireframe :
HEADER
- Bouton retour
- Titre Sauvegarde

CONTENT
- Carte Dernière sauvegarde :
  - Date
  - Statut
  - État vide si aucun backup
- Carte Exporter une sauvegarde :
  - Texte bénéfice
  - Bouton Créer une sauvegarde chiffrée
- Carte Restaurer :
  - Texte : Importer un fichier .babylog
  - Bouton Choisir un fichier
- Note sécurité :
  - Chiffrement local
  - Aucun cloud automatique

FOOTER
- Aucun

Thème :
surface, surface-raised, text-primary, text-secondary, primary, on-primary, danger, premium-accent

États :
LOADING
- SkeletonLoader cartes
- Loading dans sheets pendant chiffrement ou déchiffrement

EMPTY
- Message : Aucune sauvegarde précédente. Créez une première sauvegarde pour protéger vos données.

ERROR
- Fichier invalide
- HMAC invalide
- Secret invalide
- Schéma invalide
- StatePanel error avec retry si pertinent

SUCCESS
- Toast Sauvegarde exportée ou Restauration terminée
- Share sheet après export

Actions :
- Tap Créer une sauvegarde :
  - Si premium ou trial actif : BackupExportSheet
  - Si free : PaywallSheet trigger backup_export_attempted
- Tap Choisir un fichier :
  - Si premium ou trial actif : sélecteur système puis RestoreBackupConfirmSheet
  - Si free : PaywallSheet trigger backup_export_attempted
- Tap partage fichier : share sheet natif

Clavier et safe areas :
- Clavier dans sheets pour secret
- Safe areas gérées

Accessibilité :
- Boutons labels complets
- Erreurs explicites
- Secret masqué mais label accessible

Monétisation :
- Pas d’ad slot
- Backup chiffré premium
- Suppression des données gratuite
- Pas de paywall sur consultation locale simple

Animations :
- Aucune animation custom

---

## 9. FICHES MODALES SECONDAIRES

### 9.1 TrialOfferSheet

Route :
src/app/trial-offer.tsx

Déclencheur :
SetupProfileScreen après création du premier profil si trialState = not_started et pas de premium actif.

Objectif :
Proposer l’essai 72 h sans paiement, sans bloquer la valeur cœur.

Données :
- trialState
- entitlements locaux

Type :
iOS sheet, Android bottom sheet.

Wireframe :
HEADER
- Icône sobre
- Titre : Essayer Premium gratuitement pendant 72 h
- Bouton fermer

CONTENT
- Texte : Aucun paiement, aucune carte, aucun renouvellement automatique.
- Bullets :
  - Historique complet
  - Export PDF
  - Sauvegarde chiffrée
  - Profils illimités

ACTIONS
- Bouton primaire : Démarrer l’essai
- Bouton secondaire : Continuer en version gratuite

Thème :
surface-raised, text-primary, text-secondary, primary, on-primary, border

États :
DEFAULT
- Boutons actifs

LOADING
- Bouton essai loading pendant activation

EMPTY
- Si trial déjà utilisé : message Essai déjà utilisé
- Si premium actif : sheet ne s’ouvre pas

ERROR
- Toast : Impossible d’activer l’essai
- Retour gratuit possible

SUCCESS
- Trial activé
- Toast Essai démarré
- Fermeture

Fermeture :
- Bouton fermer visible
- Backdrop ferme et équivaut à continuer gratuitement
- Swipe down iOS ferme
- Back Android ferme

Accessibilité :
- Focus initial sur bouton secondaire ou fermer
- Labels complets
- Mention sans paiement lisible

Monétisation :
- Trial uniquement
- Pas de prix
- Pas de billing à ce stade

Animations :
- Ouverture 200 ms
- Fermeture 150 ms
- Reduced motion respecté

---

### 9.2 PaywallSheet

Route :
src/app/paywall.tsx

Déclencheurs autorisés :
- Fin de trial
- Historique > 24 h
- Export PDF
- Backup chiffré
- Deuxième profil
- Future stats longues
- Future prédictions
- Future allaitement avancé si activé

Déclencheurs interdits :
- Premier lancement
- Onboarding
- Création du premier profil
- Pendant saisie d’événement
- Pendant timer
- Pendant action critique
- Pendant consultation emergency 24 h
- Après erreur produit
- Avant premier log
- Paywall spontané au MVP

Objectif :
Convertir sans agressivité, expliquer la valeur, permettre fermeture facile.

Données :
- Produits store
- Entitlements locaux
- trialState

Type :
iOS sheet grande hauteur, Android bottom sheet large.

Wireframe :
HEADER
- Bouton fermer visible
- Badge premium
- Titre contextuel : Débloquer BabyLog Premium

CONTENT
- Titre bénéfice : Suivez votre bébé en entier, sans limite.
- Bullets :
  - Historique complet et statistiques futures
  - Export PDF pour le pédiatre
  - Sauvegarde chiffrée
  - Profils bébé illimités
  - Aucune publicité
- Comparatif Free vs Premium
- Sélecteur offre :
  - Carte annuel, prix store, renouvellement annuel
  - Carte lifetime, prix store, achat unique
- Mentions :
  - Prix fournis par le store
  - Annulation via App Store ou Google Play
  - Aucun prélèvement sans confirmation
  - Restore purchases
  - Privacy et conditions

ACTIONS
- CTA principal : Débloquer Premium
- Lien Restaurer un achat
- Lien privacy et conditions

Thème :
surface, surface-raised, text-primary, text-secondary, premium-accent, primary, on-primary, border

États :
LOADING
- Skeleton offres et prix

EMPTY
- Aucun produit store disponible
- Message : Offre indisponible pour le moment
- Action retry
- Action restore

ERROR
- Message store ou réseau
- Actions retry et restore

SUCCESS
- Confirmation Premium activé
- Fermeture courte
- Reprise de l’action

DEFAULT
- Offres sélectionnables
- Offre annuel sélectionnée par défaut

DISABLED
- CTA désactivé pendant achat

Fermeture :
- Bouton fermer toujours visible
- Backdrop ferme
- Swipe down iOS ferme
- Back Android ferme
- Pas de relance immédiate

Accessibilité :
- Focus initial sur titre ou fermer
- Comparatif accessible comme liste
- Prix lus comme texte store localisé
- CTA label inclut l’offre

Monétisation :
- Unique moment de conversion
- Pas de countdown
- Pas de preuve sociale inventée
- Pas de dark pattern

Animations :
- Ouverture 200 ms
- Fermeture 150 ms
- Reduced motion respecté

---

### 9.3 RestorePurchasesSheet

Route :
src/app/restore-purchases.tsx

Déclencheur :
Bouton restaurer dans PaywallSheet ou SettingsScreen.

Objectif :
Restaurer les achats de manière claire et rassurante.

Données :
- Entitlements locaux
- Résultat restore

Type :
iOS sheet, Android bottom sheet.

Wireframe :
HEADER
- Titre Restaurer un achat
- Bouton fermer

CONTENT
- Texte : Si vous avez déjà acheté BabyLog Premium, restaurez-le ici.

ACTIONS
- Bouton Restaurer
- Bouton Annuler

Thème :
surface-raised, text-primary, text-secondary, primary, on-primary

États :
DEFAULT
- Boutons actifs

LOADING
- Restauration en cours

EMPTY
- Aucun achat trouvé
- Message dédié

ERROR
- Erreur store
- Retry

SUCCESS
- Achat restauré
- Entitlements mis à jour
- Fermeture

Fermeture :
- Bouton fermer
- Backdrop ferme
- Back Android ferme

Accessibilité :
- Focus sur Annuler par défaut
- Résultat annoncé

Monétisation :
- Restauration obligatoire

Animations :
- Sobre, courte

---

### 9.4 ConfirmDeleteEventSheet

Composant :
components/modals/ConfirmDeleteEventSheet.tsx

Déclencheur :
Suppression d’un événement depuis Timeline ou EventEdit.

Objectif :
Prévenir la suppression accidentelle tout en permettant undo.

Données :
- log_event.id
- type
- heure

Type :
iOS dialog ou sheet, Android Material dialog ou bottom sheet.

Wireframe :
HEADER
- Titre : Supprimer cet événement ?

CONTENT
- Texte : Vous pourrez annuler cette suppression pendant quelques secondes.

ACTIONS
- Bouton Annuler
- Bouton Supprimer destructif

Thème :
surface-raised, text-primary, danger, border

États :
DEFAULT
- Boutons actifs

PRESSED
- Feedback visuel

DISABLED
- Pendant suppression

LOADING
- Suppression en cours

SUCCESS
- Fermeture
- Toast Undo

Fermeture :
- Annuler
- Backdrop ferme
- Back Android ferme

Accessibilité :
- Focus initial sur Annuler
- Action destructive annoncée

Monétisation :
Non

Animations :
Apparition courte

---

### 9.5 ConfirmDeleteProfileSheet

Composant :
components/modals/ConfirmDeleteProfileSheet.tsx

Déclencheur :
SettingsScreen, bouton supprimer profil.

Objectif :
Confirmer une suppression définitive en cascade.

Données :
- baby_profile.name
- baby_profile.id

Type :
Sheet avec confirmation renforcée.

Wireframe :
HEADER
- Titre : Supprimer le profil ?

CONTENT
- Texte : Tous les événements de ce bébé seront supprimés définitivement.
- Input de confirmation : saisir le prénom du bébé

ACTIONS
- Bouton Annuler
- Bouton Supprimer définitivement désactivé tant que confirmation invalide

Thème :
surface-raised, text-primary, danger, border, text-disabled

États :
DEFAULT
- Input vide
- Bouton désactivé

VALIDATION
- Erreur si texte incorrect

LOADING
- Suppression en cours

SUCCESS
- Profil supprimé
- Si autres profils : activer le plus ancien
- Si aucun profil : navigation setup

ERROR
- Erreur SQLite
- Retry

Fermeture :
- Annuler
- Backdrop ferme
- Back Android ferme

Clavier :
- Input confirmation
- Sheet évite le champ

Accessibilité :
- Message destructif clair
- Focus sur Annuler
- Erreur liée à l’input

Monétisation :
Non

Animations :
Sobre

---

### 9.6 DiscardChangesSheet

Composant :
components/modals/DiscardChangesSheet.tsx

Déclencheur :
EventEditScreen, retour ou annuler avec modifications non enregistrées.

Objectif :
Éviter la perte accidentelle de modifications.

Données :
- État dirty du formulaire

Type :
Dialog simple.

Wireframe :
HEADER
- Titre : Abandonner les modifications ?

CONTENT
- Texte : Les changements non enregistrés seront perdus.

ACTIONS
- Bouton Continuer l’édition
- Bouton Abandonner

Thème :
surface-raised, text-primary, border

États :
DEFAULT
- Boutons actifs

PRESSED
- Feedback

Fermeture :
- Backdrop ferme et conserve l’édition
- Back Android ferme et conserve l’édition

Accessibilité :
- Focus sur Continuer l’édition

Monétisation :
Non

Animations :
Apparition courte

---

### 9.7 BackupExportSheet

Composant :
components/modals/BackupExportSheet.tsx

Déclencheur :
BackupScreen, export si entitlement premium ou trial actif.

Objectif :
Définir le secret de chiffrement et lancer l’export.

Données :
- Secret utilisateur
- Format backup
- file_export

Type :
Sheet formulaire.

Wireframe :
HEADER
- Titre : Créer une sauvegarde chiffrée

CONTENT
- SegmentedControl secret : PIN, Mot de passe
- Input secret
- Input confirmation
- Texte sécurité : Ce mot de passe sera nécessaire pour restaurer.

ACTIONS
- Bouton Annuler
- Bouton Exporter

Validation :
- PIN : exactement 6 chiffres
- Mot de passe : 8 caractères minimum
- Confirmation identique

Thème :
surface-raised, text-primary, text-secondary, primary, on-primary, danger, border

États :
DEFAULT
- Champs vides

VALIDATION
- Secret trop court
- Confirmation différente

LOADING
- Chiffrement et écriture

SUCCESS
- Toast Sauvegarde exportée
- Share sheet

ERROR
- Erreur fichier
- Retry

DISABLED
- Export désactivé pendant loading

Fermeture :
- Annuler
- Backdrop ne ferme pas pendant loading
- Back Android annule si non loading

Accessibilité :
- Labels champs
- Erreurs inline
- Secret annoncé comme champ masqué

Monétisation :
- Premium requis en amont

Animations :
Sobre

---

### 9.8 RestoreBackupConfirmSheet

Composant :
components/modals/RestoreBackupConfirmSheet.tsx

Déclencheur :
BackupScreen après sélection d’un fichier.

Objectif :
Confirmer l’écrasement et saisir le secret.

Données :
- Nom fichier
- backupFileSchema
- Entitlements

Type :
Sheet formulaire destructif.

Wireframe :
HEADER
- Titre : Restaurer cette sauvegarde ?

CONTENT
- Nom du fichier
- Texte : Les données actuelles seront remplacées.
- Input secret

ACTIONS
- Bouton Annuler
- Bouton Restaurer destructif

Validation :
- Secret requis
- Vérification HMAC
- Vérification Zod après déchiffrement

Thème :
surface-raised, text-primary, danger, border

États :
DEFAULT
- Secret vide
- Bouton désactivé

VALIDATION
- Secret requis

LOADING
- Déchiffrement et restauration

SUCCESS
- Toast Restauration terminée
- Rechargement

ERROR
- HMAC invalide
- Mot de passe invalide
- Schéma invalide
- Rollback complet

DISABLED
- Restauration désactivée pendant loading

Fermeture :
- Annuler
- Backdrop ne ferme pas pendant loading
- Back Android annule si non loading

Accessibilité :
- Avertissement destructif clair
- Focus sur Annuler

Monétisation :
- Backup premium requis en amont

Animations :
Sobre

---

### 9.9 ProfileSwitcherSheet

Composant :
components/modals/ProfileSwitcherSheet.tsx

Déclencheur :
Tap sur profil actif dans TrackingHomeScreen ou SettingsScreen.

Objectif :
Changer de profil actif si entitlement premium le permet.

Données :
- babyProfileRepository.listAll
- entitlements
- profil actif

Type :
iOS sheet, Android bottom sheet.

Wireframe :
HEADER
- Titre : Choisir un profil
- Bouton fermer

CONTENT
- Liste profils :
  - Prénom
  - Âge
  - Badge Actif
- Bouton Ajouter un profil
  - Badge premium si free

ACTIONS
- Tap profil : définir comme actif si premium
- Tap profil verrouillé : Paywall si free
- Tap ajouter : Paywall si free, sinon profile/new

Thème :
surface-raised, text-primary, text-secondary, border, premium-accent

États :
LOADING
- SkeletonLoader liste

EMPTY
- Ne devrait pas arriver si setup requis
- Sinon message : Créez d’abord un profil.

ERROR
- StatePanel retry si chargement échoue

SUCCESS
- Profil actif changé
- Fermeture
- TrackingHome mis à jour

Fermeture :
- Bouton fermer
- Backdrop ferme
- Back Android ferme

Accessibilité :
- Liste lisible
- Profil actif annoncé
- Bouton ajouter avec label premium

Monétisation :
- Ajout de profil premium
- Switch permis si premium
- Free : 1 profil actif uniquement

Animations :
Sobre

---

## 10. UX DE MONÉTISATION

### 10.1 Modèle

- Trial local 72 h.
- Premium annuel.
- Premium lifetime.
- Aucune publicité.
- Aucun rewarded.
- Aucun banner.
- Aucun interstitial.

### 10.2 Free minimal après trial

Free inclut :
- Tracking core illimité.
- Timer.
- Mode nuit.
- Timeline dernières 24 h.
- Résumé du jour ou des dernières 24 h.
- Édition, suppression, undo.
- Emergency Doctor Mode consultation écran 24 h.
- Suppression des données.
- 1 profil actif.

Free n’inclut pas :
- Historique > 24 h.
- Export PDF.
- Backup chiffré.
- Co-parent transfer.
- Stats longues.
- Prédictions.
- Notifications premium.
- Multi-profil actif.

### 10.3 Premium

Premium inclut :
- Historique complet.
- Export PDF.
- Backup chiffré.
- Profils illimités.
- Futures stats longues.
- Futures prédictions locales.
- Futures features premium selon releases.

### 10.4 Paywall

Titre par défaut :
Débloquer BabyLog Premium.

Titres contextuels :
- Fin de trial : Votre essai est terminé
- Historique : Débloquer l’historique complet
- Export : Débloquer les exports PDF
- Backup : Débloquer la sauvegarde chiffrée
- Profil : Débloquer les profils illimités

Bullets :
- Historique complet et statistiques futures.
- Export PDF clair pour le pédiatre.
- Sauvegarde chiffrée.
- Profils bébé illimités.
- Aucune publicité.

Comparatif :
- Tracking quotidien : Free oui, Premium oui
- Mode nuit : Free oui, Premium oui
- Timeline 24 h : Free oui, Premium oui
- Historique illimité : Free non, Premium oui
- Export PDF : Free non, Premium oui
- Backup chiffré : Free non, Premium oui
- Profils illimités : Free non, Premium oui
- Publicité : aucune dans les deux

CTA :
- Débloquer Premium
- Offre annuel sélectionnée par défaut
- Prix localisés store
- Restore visible
- Fermeture visible

Interdits :
- Countdown artificiel
- Fausse urgence
- Preuve sociale inventée
- Bouton fermer caché
- Prix caché
- Case pré-cochée trompeuse
- Blocage sans issue

### 10.5 Fréquence

- Paywall de fin de trial : 1 fois.
- Paywall sur action premium : à chaque nouvelle tentative.
- Paywall spontané : désactivé au MVP.
- Pas de relance immédiate après fermeture.

Décision d’optimisation :
Le déclencheur win moment autorisé par la stratégie est désactivé au MVP pour préserver une UX nocturne non agressive.

### 10.6 Trial

- Activation manuelle.
- Aucun paiement.
- Aucune carte.
- Aucun renouvellement.
- Durée 72 h.
- Statut local.
- Flag anti-réinitialisation best-effort.
- Premium ou lifetime prime toujours sur trial.

### 10.7 Restore

- Visible dans paywall.
- Visible dans settings.
- Fonctionnel pour annuel et lifetime.
- Offline-first après restauration des entitlements locaux.

### 10.8 Erreurs paiement

- Store indisponible : message clair, retry, restore.
- Achat annulé : retour état default.
- Échec paiement : message non culpabilisant.
- Pas de blocage de l’app.

### 10.9 Quota

- Aucun quota MVP.
- Aucun quota IA MVP.
- Si BYOK futur :
  - Jauge douce
  - Seuil 80 %
  - Texte explicite
  - CTA premium non bloquant

### 10.10 Publicité

- Aucune publicité.
- Aucun SDK ad.
- Aucun identifiant publicitaire.
- Aucune ATT pour publicité.

### 10.11 Règle d’or

- Aucun élément monétisation sur TrackingHomeScreen.
- Aucun paywall au premier lancement.
- Aucun paywall avant premier log.
- Aucune donnée prise en otage.
- Dernières 24 h consultables.
- Suppression gratuite.
- Tracking core jamais limité en nombre d’événements.

---

## 11. ACCESSIBILITÉ

| Item | Statut | Preuve ou règle |
|---|---|---|
| Contrastes WCAG AA | Conforme | Tokens light/dark avec ratios AA sur textes critiques |
| Contrastes light et dark | Conforme | Table tokens complète |
| Cibles tactiles | Conforme | 44 pt minimum sur Button, IconButton, Input, ListItem, Chip |
| Dynamic Type | Conforme | Tailles relatives, multi-lignes, lineHeight non bloquant |
| Labels lecteur d’écran | Conforme | accessibilityLabel obligatoire sur actions et contrôles |
| Ordre de focus | Conforme | Formulaires et modales avec focus initial défini |
| Reduced motion | Conforme | Aucune animation custom, skeleton sans shimmer |
| Couleur seule | Conforme | Texte, icône, badge, état annoncé |
| Fermeture modales | Conforme | Bouton fermer, swipe iOS, back Android |
| Erreurs actionnables | Conforme | Retry, validation inline, messages non culpabilisants |
| RTL | Conforme | start/end logiques, icônes date miroir |
| Timer | Conforme | Région live annoncée |
| Toast | Conforme | Live region, action Undo accessible |

---

## 12. CONVENTIONS PLATEFORME

| Sujet | iOS | Android |
|---|---|---|
| Modales | Sheets natifs | Bottom sheets ou Material dialogs |
| Retour | Swipe back natif | Back matériel ferme modales |
| Bouton retour | Natif quand suffisant | Natif quand suffisant |
| Touch feedback | Opacité douce | Ripple Material |
| Safe areas | Haut et bas gérées | Insets gérées |
| Clavier | KeyboardAvoiding | KeyboardAvoiding |
| Pickers date/heure | Natif | Natif |
| Orientation | Portrait verrouillé | Portrait verrouillé |
| Haptiques | Option légère succès | Option légère succès |
| Sheets | Grab handle | Drag handle discret |
| Paywall back | Ferme paywall | Ferme paywall sans quitter l’app |
| RTL | Support logique | Support logique |
| Permission fichier | Seulement import backup | Seulement import backup |
| Partage | Share sheet natif | Share sheet natif |

---

## 13. ÉVALUATION HEURISTIQUE

| Heuristique | Statut | Preuve |
|---|---|---|
| Visibilité du statut | Conforme | Skeletons, timer, toasts, statut premium |
| Système et monde réel | Conforme | Tétée, sommeil, couche, note |
| Contrôle utilisateur | Conforme | Undo, annuler, fermer, discard |
| Cohérence | Conforme | Tokens, composants, tabs |
| Prévention des erreurs | Conforme | Confirmations destructives, validation backup |
| Reconnaissance plutôt que rappel | Conforme | Dernier événement, boutons larges, période visible |
| Flexibilité | Conforme | 1-tap, dernier type couche, timer persistant |
| Minimalisme | Conforme | 7 écrans, pas de stats MVP, pas de décor |
| Récupération erreurs | Conforme | Retry, rollback, undo |
| Aide | Conforme | Helper inline, aide complète V1.1 |

---

## 14. COMPLEXITÉ ET SIMPLIFICATIONS

### 14.1 Comptage

| Item | Valeur | Impact |
|---|---:|---:|
| Base | 3 | 3 |
| Écrans principaux | 7 | 0 |
| Modales secondaires | 9 | +0,5 |
| Composants | 17 | +0,5 |
| Animations custom | 0 | 0 |
| Tabs | 3 | 0 |
| Thèmes | light, dark, auto | +0,5 |
| Score final |  | 4,5 / 10 |

Score inférieur à 7.

### 14.2 Simplifications appliquées

- Stats et prédictions reportées Release 3.
- Allaitement avancé reporté Release 2.
- Pas de filtre ni tri complexe.
- Pas de sélection multiple.
- Pas de module IA MVP.
- Pas de photo, caméra, micro, capteurs.
- Pas de publicité.
- Paywall composé avec primitives existantes.
- Composants réduits à 17.
- Pas d’animation custom.
- Pas de remplacement silencieux de timer.

### 14.3 Éléments reportés

- StatsScreen Release 3.
- PredictionScreen Release 3.
- Notifications Release 3.
- Co-parent transfer Release 2.
- Allaitement avancé Release 2.
- IA BYOK backlog.
- Rating et aide détaillée V1.1.

---

## 15. PASSATION AU GPT 7

### 15.1 Carte des routes

| Route | Écran | Type |
|---|---|---|
| src/app/_layout.tsx | Racine | root |
| src/app/setup.tsx | SetupProfileScreen | stack |
| src/app/(tabs)/_layout.tsx | Tabs layout | tabs |
| src/app/(tabs)/index.tsx | TrackingHomeScreen | tab |
| src/app/(tabs)/timeline.tsx | TimelineScreen | tab |
| src/app/(tabs)/settings.tsx | SettingsScreen | tab |
| src/app/profile/new.tsx | Création profil supplémentaire | stack |
| src/app/profile/[id]/edit.tsx | Édition profil | stack |
| src/app/event/[id]/edit.tsx | Édition événement | stack |
| src/app/settings/export.tsx | ExportScreen | stack |
| src/app/settings/backup.tsx | BackupScreen | stack |
| src/app/paywall.tsx | PaywallSheet | modal |
| src/app/trial-offer.tsx | TrialOfferSheet | modal |
| src/app/restore-purchases.tsx | RestorePurchasesSheet | modal |

### 15.2 Matrice états par écran

| Écran | Loading | Empty | Error | Success |
|---|---|---|---|---|
| SetupProfileScreen | Skeleton formulaire | Formulaire bénéfice | Validation ou retry | Profil créé, trial offer |
| TrackingHomeScreen | Skeleton timer et dernier événement | Message premier log | Retry lecture ou toast écriture | Boutons actifs, timer, toast |
| TimelineScreen | Skeleton liste et résumé | Message période vide | Retry chargement | Liste et résumé |
| EventEditScreen | Skeleton formulaire | Événement introuvable | Validation ou retry | Toast enregistré |
| SettingsScreen | Skeleton sections | Aucun export | Toast ou retry | Préférences enregistrées |
| ExportScreen | Génération en cours | Aucun événement période | Retry génération | Rapport ou partage |
| BackupScreen | Skeleton cartes | Aucune sauvegarde | Fichier ou secret invalide | Export ou restauration |

### 15.3 Matrice light/dark

| Écran ou modale | Light | Dark OLED | Tokens critiques |
|---|---|---|---|
| SetupProfileScreen | Oui | Oui | surface, primary |
| TrackingHomeScreen | Oui | Oui | surface, primary |
| TimelineScreen | Oui | Oui | surface, premium-accent |
| EventEditScreen | Oui | Oui | surface, danger |
| SettingsScreen | Oui | Oui | surface, premium-accent |
| ExportScreen | Oui | Oui | surface, primary |
| BackupScreen | Oui | Oui | surface, danger |
| TrialOfferSheet | Oui | Oui | surface-raised, primary |
| PaywallSheet | Oui | Oui | surface-raised, premium-accent |
| RestorePurchasesSheet | Oui | Oui | surface-raised, primary |
| ConfirmDeleteEventSheet | Oui | Oui | surface-raised, danger |
| ConfirmDeleteProfileSheet | Oui | Oui | surface-raised, danger |
| DiscardChangesSheet | Oui | Oui | surface-raised |
| BackupExportSheet | Oui | Oui | surface-raised, primary |
| RestoreBackupConfirmSheet | Oui | Oui | surface-raised, danger |
| ProfileSwitcherSheet | Oui | Oui | surface-raised, premium-accent |

### 15.4 Repositories et méthodes par écran

| Écran | Repositories principaux |
|---|---|
| SetupProfileScreen | babyProfileRepository.create, countProfiles, eventRepository.create |
| TrackingHomeScreen | timerRepository.getActiveByProfile, startTimer, stopTimer, logEventRepository.create, completeTimerAndCreateEvent |
| TimelineScreen | logEventRepository.getTimelineDay, getRecentWindow, listByProfilePage, getStatsByRange, softDelete, restore |
| EventEditScreen | logEventRepository.getById, create, update, softDelete, restore |
| SettingsScreen | babyProfileRepository.listAll, fileExportRepository.listRecent, entitlement service, trial service |
| ExportScreen | logEventRepository.getRangeForExport, getStatsByRange, fileExportRepository.create, markCompleted, markFailed |
| BackupScreen | backup service, babyProfileRepository.listAll, logEventRepository.listForBackup, timerRepository.getAll, fileExportRepository |

### 15.5 Feature flags

| Flag | Valeur MVP | Release cible |
|---|---|---|
| features.advancedFeeding | false | Release 2 |
| features.coParentTransfer | false | Release 2 |
| features.stats | false | Release 3 |
| features.predictions | false | Release 3 |
| features.notifications | false | Release 3 |
| features.aiByok | false | Backlog |

### 15.6 Clés MMKV UI utilisées

| Clé | Usage |
|---|---|
| settings:night_mode | off, on, auto |
| settings:night_mode_start_minutes | Début auto |
| settings:night_mode_end_minutes | Fin auto |
| settings:active_profile_id | Profil actif local |
| ui:last_diaper_type | Dernier type couche |
| trial:state | Statut trial |
| trial:started_at | Début trial |
| trial:ends_at | Fin trial |
| trial:claimed_local | Flag local trial consommé |

Règles :
- Les entitlements sensibles ne sont jamais stockés en clair dans SQLite.
- Les secrets ne sont jamais exposés dans l’UI.
- settings:active_profile_id est une préférence locale. En cas d’absence ou de profil introuvable, activer le profil le plus ancien.
- Après restauration backup, si active_profile_id est absent, actif = profil le plus ancien.

### 15.7 Analytics UI

| Événement | Déclencheur UI |
|---|---|
| onboarding_started | SetupProfileScreen affiché |
| onboarding_completed | Premier profil créé |
| first_profile_created | Premier profil créé |
| trial_offer_shown | TrialOfferSheet ouverte |
| trial_started | Bouton Démarrer l’essai |
| trial_expired_paywall_shown | Paywall fin de trial affiché |
| first_value_moment | Premier événement créé |
| core_action_completed | Tétée, sommeil ou couche créé |
| night_mode_used | Mode nuit activé |
| history_limit_reached | Tap historique > 24 h en free |
| second_profile_attempted | Tap ajouter profil en free |
| premium_feature_attempted | Action premium bloquée |
| paywall_shown | PaywallSheet ouverte |
| paywall_closed | Paywall fermé |
| paywall_converted | Achat confirmé |
| purchase_completed | Achat store confirmé |
| restore_completed | Restauration réussie |
| premium_restored | Restore premium réussi |
| pdf_export_attempted | Tap export PDF |
| backup_export_attempted | Tap export backup |
| backup_exported | Backup exporté |
| backup_imported | Backup restauré |
| error_logged | Erreur locale technique |

### 15.8 Tokens NativeWind recommandés

Structure recommandée :

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          muted: "var(--color-primary-muted)",
          on: "var(--color-on-primary)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          on: "var(--color-on-accent)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          muted: "var(--color-surface-muted)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          disabled: "var(--color-text-disabled)",
        },
        border: "var(--color-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        premium: "var(--color-premium-accent)",
        quota: {
          free: "var(--color-quota-free)",
          premium: "var(--color-quota-premium)",
        },
        overlay: "var(--color-overlay)",
        backdrop: "var(--color-backdrop)",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        full: "9999px",
      },
      fontSize: {
        display: "32px",
        "title-lg": "24px",
        "title-md": "20px",
        body: "16px",
        "body-sm": "14px",
        caption: "12px",
      },
      lineHeight: {
        display: "40px",
        "title-lg": "32px",
        "title-md": "28px",
        body: "24px",
        "body-sm": "20px",
        caption: "16px",
      },
    },
  },
};
```

Règles :
- Les valeurs hex des variables CSS sont exactement celles de la section 4.3.
- Thème light définit toutes les variables light.
- Thème dark OLED définit toutes les variables dark.
- Mode auto bascule selon horaire.
- Aucune couleur dure dans les composants.

### 15.9 Assets requis

- Logo app
- Icône app variantes stores
- Splash minimal
- Aucune image custom au MVP
- Icônes Ionicons uniquement
- Pas de SVG custom hors logo

### 15.10 Animations autorisées

- Aucune animation custom au MVP.
- Transitions natives de sheets, modales et navigation uniquement.
- Skeleton sans shimmer si reduced motion.
- Si animation sheet ajoutée : 150 à 200 ms maximum.
- Aucune animation décorative.

### 15.11 Rappel final

Ce document doit être utilisé tel quel par le GPT 7.  
Aucune interprétation majeure ne doit être nécessaire.  
Toute couleur, tout état, toute route, toute modale et tout comportement de monétisation sont spécifiés.