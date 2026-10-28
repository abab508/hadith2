# Écran — Les trois préférences de langue

> Spécification UX, indépendante de toute technologie. Sources : `docs/exigences/02-plateforme-multilingue.md` (§2, §5, §8, §10) et `docs/exigences/03-couverture-linguistique-mondiale.md` (§7, §9).
> Libellés en français = clés de traduction. Niveaux de prise en charge montrés = **fictifs**.

## 1. Objectif

Laisser l'utilisateur régler **séparément** :

1. **Langue de l'interface** : menus, boutons, paramètres.
2. **Langue du rapport** : langue de l'explication et de la synthèse.
3. **Langues de recherche documentaire** : langues dans lesquelles les sources et les traductions sont cherchées.

Ces trois réglages sont indépendants : changer l'un ne modifie jamais les deux autres (02 §5).
Exemple de l'exigence : Interface = français ; Rapport = français ; Recherche documentaire = arabe, anglais, français et ourdou.

## 2. Hypothèses (décisions prises seul, réversibles)

| # | Hypothèse | Raison |
|---|---|---|
| H1 | Valeurs initiales : Interface = arabe ; Rapport = arabe ; Recherche documentaire = arabe. | Arabe = langue par défaut (02 §1). Option la plus simple. |
| H2 | L'arabe est toujours inclus dans la recherche documentaire et ne peut pas être décoché. Une phrase explique pourquoi. | 02 §8 : rechercher dans les sources arabes et dans la langue d'origine de la source. |
| H3 | Pas de lien automatique « le rapport suit l'interface ». Quand l'utilisateur change l'interface pour la première fois, une **suggestion** (jamais automatique) propose d'aligner aussi le rapport. | Respecte strictement l'indépendance, tout en évitant un rapport dans une langue inattendue. |
| H4 | Dans la page Paramètres, les changements s'appliquent avec un bouton « Enregistrer ». Dans le sélecteur d'en-tête et les raccourcis (page de recherche, rapport), ils s'appliquent tout de suite. | Page de réglages = plusieurs champs, besoin d'annuler ; raccourcis = geste court. |
| H5 | Un changement de langue du rapport s'applique aux **prochains** rapports. Le rapport ouvert ne change pas ; une action « Créer une version en … » est proposée. | 02 §2 : ne pas effacer le rapport ouvert. |
| H6 | Visiteur : mêmes réglages, gardés sur l'appareil si le stockage est autorisé, sinon pour la session. | 02 §2. |

## 3. Où trouver ces réglages

| Endroit | Ce qu'on peut y régler |
|---|---|
| Paramètres du compte → **Langues** (page complète, maquette 4.1) | Les trois. |
| En-tête → sélecteur de langue | Interface seulement (voir `selecteur-langue.md`) + lien vers la page Langues. |
| Page de recherche → ligne « Rechercher dans : … » | Langues de recherche documentaire, pour cette recherche et les suivantes. |
| En-tête d'un rapport → « Langue du rapport : … » | Langue du rapport (prochains rapports + action « Créer une version en … »). |
| Visiteur non connecté | Lien « Réglages de langue » dans le sélecteur d'en-tête → même page, sans compte. |

## 4. Maquettes

### 4.1 Paramètres du compte → Langues (ordinateur, interface en français)

```
+--------------------------------------------------------------------+
| Paramètres  >  Langues                                             |
|                                                                    |
| Trois réglages séparés. Changer l'un ne change pas les autres.     |
|                                                                    |
| 1. LANGUE DE L'INTERFACE                                           |
|    Menus, boutons et paramètres.                                   |
|    [ Français — Français  (fr)                         v ]         |
|    [Interface] [Recherche] [Contenu]           Détails >           |
|                                                                    |
| ------------------------------------------------------------------ |
| 2. LANGUE DU RAPPORT                                               |
|    Langue des explications et de la synthèse.                      |
|    Les textes originaux restent toujours dans leur langue.         |
|    [ Français — Français  (fr)                         v ]         |
|    (i) Les termes techniques s'affichent toujours avec l'arabe     |
|        et la translittération.                                     |
|                                                                    |
| ------------------------------------------------------------------ |
| 3. LANGUES DE RECHERCHE DOCUMENTAIRE                               |
|    Langues dans lesquelles chercher les sources et les traductions.|
|                                                                    |
|    [العربية — Arabe  (verrou)] [English — Anglais  x]              |
|    [Français — Français  x]    [اردو — Ourdou  x]                  |
|    [ + Ajouter une langue ]                                        |
|                                                                    |
|    L'arabe est toujours inclus : c'est la langue des textes        |
|    originaux.                                                      |
|                                                                    |
| ------------------------------------------------------------------ |
| Résumé : Interface en français · Rapport en français ·             |
|          Recherche en arabe, anglais, français, ourdou             |
|                                                                    |
|                         [ Annuler ]   [ Enregistrer les préférences ] |
+--------------------------------------------------------------------+
```

### 4.2 « + Ajouter une langue » (recherche documentaire)

Même liste que le sélecteur d'en-tête (recherche par nom / nom natif / code, filtres Région et Écriture), mais avec **cases à cocher** et un autre badge mis en avant : le niveau « Contenu documentaire ».

```
+-------------------------------------------------------------+
| Ajouter des langues de recherche                      [ X ] |
| [ Rechercher : nom, nom natif ou code              ]        |
| Région : [Toutes v]   Écriture : [Toutes v]                  |
|                                                             |
| [x] English — Anglais          en   [Recherche] [Contenu]   |
| [ ] Español — Espagnol         es   [Traduction auto]       |
|       ! Peu ou pas de sources dans cette langue.            |
| [ ] বাংলা — Bengali            bn   [Contenu]               |
| [ ] فارسی — Persan             fa   [Affichable]            |
|       ! Recherche non adaptée à cette langue pour l'instant.|
|                                                             |
|                                [ Annuler ]  [ Ajouter (1) ] |
+-------------------------------------------------------------+
```
Une langue sans interface traduite **peut** être choisie ici (ce n'est pas la langue de l'interface). Les avertissements disent honnêtement ce qui manque, sans bloquer.

### 4.3 Raccourci sur la page de recherche

```
[ Rechercher un hadith, un fragment, un transmetteur, une référence...  ] [Rechercher]
Rechercher dans : arabe, anglais, français, ourdou   Modifier
```
« Modifier » ouvre la fenêtre 4.2. Le changement garde la saisie en cours et les filtres.

### 4.4 Raccourci dans l'en-tête d'un rapport

```
+------------------------------------------------------------------+
| Rapport n° [IDENTIFIANT]       Langue du rapport : Français  Modifier |
+------------------------------------------------------------------+
```
« Modifier » ouvre une liste simple de langues. Choix → message : « Les prochains rapports seront en [LANGUE]. » + action « Créer une version de ce rapport en [LANGUE] ».

### 4.5 Suggestion après changement de l'interface (H3)

Affichée une seule fois, non bloquante, sous l'en-tête :
```
+------------------------------------------------------------------+
| Interface en Français. Vos rapports restent en Arabe.            |
| [ Rédiger aussi mes rapports en Français ]   [ Garder l'Arabe ]  |
+------------------------------------------------------------------+
```
« Garder » ou fermeture = rien ne change, et la suggestion ne revient plus.

### 4.6 Mobile

Une seule colonne. Les trois blocs empilés, chacun replié par défaut avec sa valeur visible :
```
Langue de l'interface         Français  >
Langue du rapport             Français  >
Langues de recherche   arabe, anglais +2  >
[ Enregistrer les préférences ]   (bouton fixé en bas)
```

## 5. Règles de comportement

1. **Indépendance** : enregistrer un bloc ne modifie jamais un autre bloc.
2. **Langue de l'interface** : seules les langues avec le niveau « Interface disponible » (voir `selecteur-langue.md`, H3).
3. **Langue du rapport** : langues proposées = celles où la plateforme peut rédiger un rapport (donnée du catalogue). Si la terminologie de cette langue n'est pas encore validée par des spécialistes : avertissement « Certains termes techniques ne sont pas encore validés dans cette langue. Ils s'afficheront en arabe avec leur translittération. » (02 §6 : pas de traduction automatique de termes spécialisés sans contrôle).
4. **Langues de recherche documentaire** : au moins l'arabe (verrouillé). Pas de maximum. L'ordre n'a pas d'importance.
5. **Les textes originaux ne changent jamais** : aucun des trois réglages ne traduit ni ne remplace le texte d'une source (02 §5).
6. Changer la langue du rapport ne régénère pas le rapport ouvert (H5).
7. Changer les langues de recherche ne relance pas la recherche en cours tout seul : message « Nouvelles langues prises en compte à la prochaine recherche. » + bouton « Relancer maintenant ».

## 6. Éléments dans l'ordre (page Langues)

1. Fil d'Ariane « Paramètres > Langues ».
2. Phrase d'explication : « Trois réglages séparés. Changer l'un ne change pas les autres. »
3. Bloc 1 — Langue de l'interface : titre, aide, liste déroulante, badges, « Détails ».
4. Bloc 2 — Langue du rapport : titre, aide, liste déroulante, note sur les termes techniques.
5. Bloc 3 — Langues de recherche documentaire : titre, aide, puces (arabe verrouillée), « + Ajouter une langue », phrase sur l'arabe.
6. Résumé en une ligne des trois réglages.
7. Boutons « Annuler » et « Enregistrer les préférences ».
8. (Visiteur) Encadré : « Vos réglages sont gardés sur cet appareil. Connectez-vous pour les retrouver partout. » + « Se connecter ».

## 7. Actions possibles

| Action | Résultat |
|---|---|
| Changer la langue de l'interface (page Langues) | Prévisualisée après « Enregistrer ». Les autres blocs ne bougent pas. |
| Changer la langue du rapport | Valable pour les prochains rapports. |
| Ajouter une langue de recherche | Nouvelle puce. |
| Retirer une langue de recherche (x sur la puce) | Puce retirée. La puce « arabe » n'a pas de x. |
| Enregistrer | Message « Préférences enregistrées. » ; focus sur ce message. |
| Annuler | Retour aux valeurs enregistrées. |
| Quitter la page avec des changements non enregistrés | « Vous avez des changements non enregistrés. » [ Enregistrer ] [ Quitter sans enregistrer ] |

## 8. États

| État | Affichage |
|---|---|
| Chargement | Les trois blocs en lignes grises ; texte « Chargement de vos préférences… ». |
| Valeurs par défaut (jamais modifiées) | Arabe partout ; mention discrète « Réglages par défaut ». |
| Enregistrement en cours | Bouton « Enregistrement… », désactivé. |
| Succès | « Préférences enregistrées. » |
| Erreur d'enregistrement | « Vos préférences n'ont pas été enregistrées. Vérifiez votre connexion et réessayez. » + « Réessayer ». Les choix restent affichés, rien n'est perdu. |
| Catalogue indisponible | Les valeurs actuelles restent affichées et modifiables parmi les langues déjà connues ; « La liste complète des langues n'a pas pu être chargée. » + « Réessayer ». |
| Langue enregistrée devenue désactivée | « [NOM NATIF] n'est plus disponible pour [l'interface / le rapport]. Remplacée par [LANGUE DE REMPLACEMENT]. » + « Choisir une autre langue ». |
| Recherche : aucune langue ajoutée en plus de l'arabe | Pas d'erreur : l'arabe suffit. Aide : « Ajoutez d'autres langues pour trouver aussi des traductions. » |

## 9. Textes d'interface

| Clé | Texte (fr) |
|---|---|
| pref.titre | Langues |
| pref.intro | Trois réglages séparés. Changer l'un ne change pas les autres. |
| pref.interface.titre | Langue de l'interface |
| pref.interface.aide | Menus, boutons et paramètres. |
| pref.rapport.titre | Langue du rapport |
| pref.rapport.aide | Langue des explications et de la synthèse. Les textes originaux restent toujours dans leur langue. |
| pref.rapport.termes | Les termes techniques s'affichent toujours avec l'arabe et la translittération. |
| pref.rapport.termesNonValides | Certains termes techniques ne sont pas encore validés dans cette langue. Ils s'afficheront en arabe avec leur translittération. |
| pref.recherche.titre | Langues de recherche documentaire |
| pref.recherche.aide | Langues dans lesquelles chercher les sources et les traductions. |
| pref.recherche.ajouter | Ajouter une langue |
| pref.recherche.arabeToujours | L'arabe est toujours inclus : c'est la langue des textes originaux. |
| pref.recherche.peuDeSources | Peu ou pas de sources dans cette langue. |
| pref.recherche.nonAdaptee | Recherche non adaptée à cette langue pour l'instant. |
| pref.recherche.arabeSeul | Ajoutez d'autres langues pour trouver aussi des traductions. |
| pref.recherche.raccourci | Rechercher dans : {langues} |
| pref.recherche.prochaine | Nouvelles langues prises en compte à la prochaine recherche. |
| pref.recherche.relancer | Relancer maintenant |
| pref.resume | Interface en {li} · Rapport en {lr} · Recherche en {lrd} |
| pref.defaut | Réglages par défaut |
| pref.enregistrer | Enregistrer les préférences |
| pref.enregistrement | Enregistrement… |
| pref.ok | Préférences enregistrées. |
| pref.erreur | Vos préférences n'ont pas été enregistrées. Vérifiez votre connexion et réessayez. |
| pref.nonEnregistre | Vous avez des changements non enregistrés. |
| pref.quitterSans | Quitter sans enregistrer |
| pref.visiteur | Vos réglages sont gardés sur cet appareil. Connectez-vous pour les retrouver partout. |
| pref.seConnecter | Se connecter |
| pref.suggestion.texte | Interface en {li}. Vos rapports restent en {lr}. |
| pref.suggestion.aligner | Rédiger aussi mes rapports en {li} |
| pref.suggestion.garder | Garder {lr} |
| pref.rapport.prochains | Les prochains rapports seront en {langue}. |
| pref.rapport.creerVersion | Créer une version de ce rapport en {langue} |
| pref.langueRetiree | {nomNatif} n'est plus disponible. Remplacée par {langue}. |
| commun.modifier | Modifier |

Traduction : les listes de langues dans `pref.resume` et `pref.recherche.raccourci` doivent utiliser le séparateur et la conjonction propres à chaque langue (ex. « et » en français), pas une virgule codée en dur.

## 10. Accessibilité

- Chaque bloc est un groupe titré (titre lu avant les champs).
- La puce « arabe » verrouillée annonce : « Arabe, toujours inclus, ne peut pas être retiré ».
- Le bouton x d'une puce annonce : « Retirer [langue] ». Après retrait, le focus passe à la puce suivante (ou au bouton « Ajouter »).
- Messages de succès et d'erreur annoncés aux lecteurs d'écran, sans voler le focus pendant la saisie.
- Contraste ≥ 4,5:1, texte ≥ 16 px, zones tactiles ≥ 44 × 44 px.
- En interface RTL, la page entière est en miroir ; les puces se lisent de droite à gauche.

## 11. Critères de vérification

1. Régler Interface = fr, Rapport = fr, Recherche = ar + en + fr + ur, enregistrer, recharger : les trois valeurs sont retrouvées.
2. Changer l'interface en anglais : rapport et langues de recherche inchangés.
3. Changer le rapport en ourdou : interface inchangée ; rapport ouvert inchangé ; « Créer une version » proposé.
4. La puce arabe ne peut pas être retirée (souris, clavier, toucher).
5. Aucun texte source n'est modifié par l'un des trois réglages.
6. Erreur réseau à l'enregistrement : choix conservés à l'écran, message clair.
