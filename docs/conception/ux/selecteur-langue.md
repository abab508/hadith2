# Écran — Sélecteur de langue

> Spécification UX, indépendante de toute technologie. Sources : `docs/exigences/02-plateforme-multilingue.md` (§1, §2, §3, §4, §10) et `docs/exigences/03-couverture-linguistique-mondiale.md` (§6, §7).
> Les libellés sont écrits en français pour la lecture. Ce sont des **clés de traduction** : à l'écran, ils s'affichent dans la langue de l'interface (arabe par défaut).
> Les badges et niveaux montrés dans les maquettes sont **fictifs**. Les vrais niveaux viennent du catalogue linguistique.

## 1. Objectif

Permettre à tout moment de choisir la **langue de l'interface**, en voyant honnêtement ce qui est réellement disponible dans chaque langue, sans perdre son travail en cours.

Ce sélecteur ne règle **que** la langue de l'interface. La langue du rapport et les langues de recherche documentaire sont des réglages séparés (voir `trois-preferences.md`).

## 2. Hypothèses (décisions prises seul, réversibles)

| # | Hypothèse | Raison |
|---|---|---|
| H1 | Pas de détection automatique de la langue du navigateur : première visite = arabe. | Exigence 02 §3 : arabe par défaut tant qu'aucune règle de détection n'est adoptée. Option la plus simple. |
| H2 | « العربية — Arabe » est toujours épinglée en tête de liste, quelle que soit la recherche ou le filtre actif. | Exigence 02 §3 : l'arabe doit rester immédiatement accessible. |
| H3 | Seules les langues avec le niveau « Interface disponible » peuvent être choisies comme langue d'interface. Les autres sont visibles, grisées, avec la raison. | Ne jamais faire croire qu'une langue est prise en charge (03 §7). |
| H4 | Langues expérimentales masquées par défaut ; une case permet de les afficher. Langues désactivées jamais affichées dans le sélecteur. | Option la plus simple ; évite les choix trompeurs. |
| H5 | Visiteur non connecté : choix gardé sur l'appareil si le stockage est autorisé ; sinon, gardé seulement pour la session en cours. | Exigence 02 §2 : « selon les mécanismes de stockage autorisés ». |
| H6 | La recherche de langue ignore majuscules et accents (ex. « turc » trouve « Türkçe » via le nom traduit, « turkce » trouve « Türkçe »). | Confort de saisie ; ne concerne que les noms de langues, pas la recherche de hadiths. |
| H7 | Le changement est appliqué tout de suite au clic (pas de bouton « Enregistrer »). | Geste le plus court ; réversible en un clic. |

## 3. Points d'entrée

1. **En-tête du site** : bouton toujours visible, sur toutes les pages, y compris sur mobile (jamais caché dans un menu « Plus »).
   - Contenu du bouton : icône globe + nom natif de la langue courante + code (ex. `العربية · ar`).
   - Nom accessible : « Langue de l'interface : [NOM NATIF] ».
2. **Paramètres du compte → Langues** : même liste, intégrée à la page des trois préférences (voir `trois-preferences.md`, bloc 1).

## 4. Maquettes

### 4.1 En-tête (interface en français, LTR)

```
+--------------------------------------------------------------------------+
| [Logo] HadithVerify AI     Rechercher   Mes rapports        (globe) Français · fr v |
+--------------------------------------------------------------------------+
```

### 4.2 En-tête à la première visite (interface en arabe, RTL, mise en page en miroir)

```
+--------------------------------------------------------------------------+
| v ar · العربية (globe)        [MENU EN ARABE]  [MENU EN ARABE]   HadithVerify AI [Logo] |
+--------------------------------------------------------------------------+
```
Le bouton passe à gauche (côté « fin » en RTL). Le code `ar` et le nom natif restent lisibles, sans inversion manuelle.

### 4.3 Panneau ouvert (ordinateur)

```
+---------------------------------------------------------------+
| Choisir la langue de l'interface                        [ X ] |
|                                                               |
| [ Rechercher : nom, nom natif ou code (ex. ur)          ]     |
|                                                               |
| Région : [ Toutes          v ]   Écriture : [ Toutes      v ] |
| [ ] Afficher les langues expérimentales                        |
|                                                               |
| LANGUE ACTUELLE                                               |
| (o) Français — Français            fr                         |
|     [Interface] [Recherche] [Contenu]           Détails >     |
|                                                               |
| TOUJOURS DISPONIBLE                                           |
| ( ) العربية — Arabe                 ar     (par défaut)        |
|     [Interface] [Recherche] [Contenu vérifié]   Détails >     |
|                                                               |
| INTERFACE DISPONIBLE                                          |
| ( ) English — Anglais               en                        |
|     [Interface] [Recherche] [Traduction auto]   Détails >     |
| ( ) Español — Espagnol              es                        |
|     [Interface] [Traduction partielle]          Détails >     |
| ( ) اردو — Ourdou                   ur                        |
|     [Interface] [Recherche]                     Détails >     |
| ( ) Bahasa Indonesia — Indonésien   id                        |
| ( ) Bahasa Melayu — Malais          ms                        |
| ( ) Türkçe — Turc                   tr                        |
|                                                               |
| > AUTRES LANGUES — interface pas encore traduite (replié)     |
|                                                               |
| Les langues de vos rapports et de vos recherches se règlent   |
| à part.  Régler les langues du rapport et de la recherche >   |
+---------------------------------------------------------------+
```

Section « Autres langues » dépliée :
```
| v AUTRES LANGUES — interface pas encore traduite               |
|   বাংলা — Bengali                  bn                          |
|     [Affichable] [Contenu]   Interface non disponible          |
|   فارسی — Persan                   fa                          |
|     [Affichable]             Interface non disponible          |
|   Kurdî / کوردی — Kurde            ku   2 écritures            |
|     [Identifiée]             Interface non disponible          |
```
Ces lignes ne sont pas sélectionnables comme langue d'interface (H3). Elles restent utiles pour savoir ce qui existe et peuvent être choisies comme langue de recherche documentaire (voir `trois-preferences.md`).

### 4.4 Ligne d'une langue — anatomie

```
( ) [NOM NATIF] — [NOM TRADUIT] ([VARIANTE RÉGIONALE])   [CODE BCP 47]
    [badge] [badge] [badge]  (3 badges maximum)            Détails >
```
- **Nom natif** : écrit dans sa propre écriture et sa propre direction (ex. `اردو` en RTL dans une liste LTR).
- **Nom traduit** : dans la langue courante de l'interface. S'il manque, afficher le nom natif seul + le code (jamais un nom inventé).
- **Variante régionale** : affichée si le catalogue en a une (ex. « Français — Français (Canada) »). Une variante est une ligne distincte, rattachée à sa langue.
- **Code** : identifiant BCP 47. Un identifiant interne (dialecte sans code officiel) est marqué « code interne » pour ne pas le confondre avec un code officiel (03 §8).
- **Écriture non affichable** (niveau « Affichable » absent) : ne pas afficher le nom natif (risque de carrés vides) ; afficher le nom traduit + le code + la mention « Écriture non prise en charge pour l'instant ».

### 4.5 Détails de prise en charge (« Détails > »)

Petit panneau listant les **8 niveaux** de l'exigence 03 §7, chacun avec « Oui » / « Non » / « Partiel » en texte (pas seulement une couleur) :

```
+-----------------------------------------------------------+
| Español — Espagnol  (es)                                  |
| Ce qui est disponible dans cette langue :                 |
|  Oui      Identifiée dans le catalogue                    |
|  Oui      Affichage de l'écriture                         |
|  Partiel  Interface traduite                              |
|  Non      Recherche adaptée                               |
|  Oui      Traduction automatique (signalée comme telle)   |
|  Non      Contenu documentaire                            |
|  Non      Contenu spécialisé vérifié                      |
|  Non      Relecture humaine possible                      |
|                                                           |
| Textes non traduits affichés en : [LANGUE DE REMPLACEMENT]|
| Une interface traduite ne veut pas dire que toutes les    |
| sources ou tous les jugements existent dans cette langue. |
|                                       [ Choisir ]  [Fermer]|
+-----------------------------------------------------------+
```
(Valeurs fictives.)

### 4.6 Mobile

Le bouton d'en-tête montre seulement l'icône globe + le code (`fr`). Au toucher, le panneau s'ouvre **en plein écran**, avec le champ de recherche en haut, les filtres repliés derrière un bouton « Filtres (0) », et un bouton « Fermer » en haut.

## 5. Badges des niveaux de prise en charge

Libellé court sur la ligne ; libellé long dans « Détails ». Toujours texte + icône, jamais couleur seule.

| Niveau (03 §7) | Badge court | Libellé long |
|---|---|---|
| 1. Identifiée | Identifiée | Identifiée dans le catalogue |
| 2. Affichable | Affichable | Affichage de l'écriture |
| 3. Interface disponible | Interface | Interface traduite |
| 4. Recherche disponible | Recherche | Recherche adaptée |
| 5. Traduction automatique disponible | Traduction auto | Traduction automatique (signalée comme telle) |
| 6. Contenu documentaire disponible | Contenu | Contenu documentaire |
| 7. Contenu spécialisé vérifié | Contenu vérifié | Contenu spécialisé vérifié |
| 8. Validation humaine disponible | Relecture humaine | Relecture humaine possible |

États supplémentaires :

| État | Badge | Effet |
|---|---|---|
| Traduction de l'interface incomplète | Traduction partielle | Les textes manquants s'affichent dans la langue de remplacement, indiquée dans « Détails ». |
| Expérimentale | Expérimentale | Masquée par défaut (H4). Au choix : message de confirmation (voir §8). |
| Désactivée | — | Jamais affichée dans le sélecteur. |

Règles d'affichage :
- Sur la ligne, montrer au plus 3 badges : les 3 niveaux les plus élevés atteints, plus « Traduction partielle » ou « Expérimentale » s'il y a lieu.
- **Interdit** : un badge global du type « Complète » ou « Entièrement prise en charge ». On affiche les niveaux, un par un.
- Correspondance avec les 3 niveaux de 02 §10 (pour les textes d'aide) : « Interface disponible » = niveau 3 ; « Documentation partiellement disponible » = niveau 6 ; « Documentation spécialisée vérifiée » = niveau 7.

## 6. Éléments dans l'ordre (panneau)

1. Titre « Choisir la langue de l'interface » + bouton Fermer.
2. Champ de recherche (focus automatique à l'ouverture sur ordinateur).
3. Filtres : Région, Écriture, case « Afficher les langues expérimentales ».
4. Section « Langue actuelle » (1 ligne).
5. Section « Toujours disponible » : العربية — Arabe (masquée si l'arabe est déjà la langue actuelle).
6. Section « Interface disponible » : tri alphabétique sur le nom traduit dans la langue courante.
7. Section « Autres langues — interface pas encore traduite » : repliée par défaut.
8. Lien « Régler les langues du rapport et de la recherche ».

**Filtre Région** : valeurs lues dans le catalogue (ex. regroupements de 03 §2 : Afrique du Nord, Afrique de l'Ouest, Moyen-Orient et péninsule Arabique, Asie du Sud, Asie du Sud-Est, etc.). Une langue peut appartenir à plusieurs régions. Jamais de liste codée en dur.
**Filtre Écriture** : valeurs lues dans le catalogue (ex. arabe, latine, cyrillique, devanagari…). Une langue à plusieurs écritures (ex. kurde : Kurdî / کوردی) apparaît sous chacune ; la ligne indique « 2 écritures ».

**Recherche** : trouve une langue par
- nom traduit dans la langue courante (« ourdou ») ;
- nom natif (« اردو ») ;
- code (« ur », « zh-TW ») ;
- variante (« Canada »).
Les filtres et la recherche se combinent. L'arabe épinglé reste visible (H2).

## 7. Actions possibles

| Action | Résultat |
|---|---|
| Ouvrir le sélecteur (clic, Entrée, Espace, toucher) | Panneau ouvert, focus dans la recherche. |
| Taper dans la recherche | Liste filtrée à chaque frappe ; nombre de résultats annoncé. |
| Choisir une langue avec interface disponible | Changement immédiat (voir §8), panneau fermé. |
| Choisir une langue expérimentale | Confirmation, puis changement. |
| Ouvrir « Détails > » | Les 8 niveaux de la langue. |
| Toucher une langue sans interface | Rien ne change ; message « L'interface n'est pas encore traduite dans cette langue. » + lien « Utiliser cette langue pour la recherche documentaire ». |
| Fermer (X, Échap, clic hors du panneau) | Aucun changement, focus rendu au bouton d'en-tête. |

## 8. Changement de langue : ce qui change, ce qui ne change pas

**Change** :
- Les menus, boutons, messages et paramètres passent dans la nouvelle langue.
- La direction de la page (RTL ou LTR) et la disposition en miroir.
- Les formats de dates et de nombres de l'interface.

**Ne change pas (obligatoire, 02 §2 et §5)** :
- Le texte saisi dans la recherche en cours.
- Les filtres actifs.
- Les résultats affichés et la position dans la liste.
- Le rapport ouvert : il **reste dans sa langue**. Il n'est ni retraduit ni régénéré automatiquement.
- Les textes originaux des sources (arabe ou autre) : jamais traduits ni remplacés.
- La langue du rapport et les langues de recherche documentaire (réglages indépendants).

Après le changement :
- Message court, annoncé aux lecteurs d'écran : « Interface en Français. Votre recherche et votre rapport ouvert sont conservés. »
- Si un rapport est ouvert dans une autre langue : petit bandeau non bloquant dans le rapport : « Ce rapport est en [LANGUE DU RAPPORT]. » + action « Créer une version en [NOUVELLE LANGUE] » (action volontaire, jamais automatique).
- Le focus revient sur le bouton de langue de l'en-tête.

Confirmation pour une langue expérimentale :
> « [NOM NATIF] est une langue expérimentale. Une partie de l'interface peut rester en [LANGUE DE REMPLACEMENT]. » — [ Utiliser quand même ] [ Annuler ]

Mémorisation :
- Connecté : enregistré dans le compte, retrouvé sur tous les appareils.
- Visiteur : voir H5.

## 9. États

| État | Affichage |
|---|---|
| Première visite | Interface en arabe, RTL. Bouton d'en-tête : `العربية · ar`. |
| Chargement du catalogue | Le bouton reste actif. Dans le panneau : la langue actuelle et l'arabe s'affichent tout de suite, le reste en lignes grises animées + texte « Chargement des langues… ». |
| Erreur de chargement du catalogue | « Impossible de charger la liste des langues. » + bouton « Réessayer ». La langue actuelle et l'arabe restent choisissables. |
| Recherche sans résultat | « Aucune langue ne correspond à « [SAISIE] ». Essayez le nom dans une autre langue ou le code (ex. ur). » + bouton « Effacer la recherche ». L'arabe épinglé reste visible. |
| Filtres sans résultat | « Aucune langue pour ces filtres. » + bouton « Effacer les filtres ». |
| Chargement de la nouvelle langue | L'interface actuelle reste en place ; indicateur dans le bouton d'en-tête ; texte annoncé « Changement de langue en cours… ». |
| Échec du changement | L'interface reste dans l'ancienne langue. « La langue [NOM NATIF] n'a pas pu être chargée. Réessayez. » + « Réessayer ». Rien n'est perdu. |
| Échec de l'enregistrement dans le compte | Le changement reste appliqué sur l'appareil. « Votre choix n'a pas été enregistré dans votre compte. » + « Réessayer ». |
| Hors ligne | Seules les langues déjà chargées sur l'appareil sont choisissables ; les autres : « Indisponible hors ligne ». |

## 10. Textes d'interface

| Clé | Texte (fr) |
|---|---|
| langue.bouton.nomAccessible | Langue de l'interface : {nomNatif} |
| langue.panneau.titre | Choisir la langue de l'interface |
| langue.recherche.placeholder | Rechercher : nom, nom natif ou code (ex. ur) |
| langue.filtre.region | Région |
| langue.filtre.ecriture | Écriture |
| langue.filtre.toutes | Toutes |
| langue.filtre.experimentales | Afficher les langues expérimentales |
| langue.section.actuelle | Langue actuelle |
| langue.section.toujours | Toujours disponible |
| langue.section.interface | Interface disponible |
| langue.section.autres | Autres langues — interface pas encore traduite |
| langue.ligne.parDefaut | par défaut |
| langue.ligne.details | Détails |
| langue.ligne.codeInterne | code interne |
| langue.ligne.ecritures | {n} écritures |
| langue.ligne.ecritureNonPrise | Écriture non prise en charge pour l'instant |
| langue.ligne.interfaceIndispo | Interface non disponible |
| langue.indispo.message | L'interface n'est pas encore traduite dans cette langue. |
| langue.indispo.lienRecherche | Utiliser cette langue pour la recherche documentaire |
| langue.details.titre | Ce qui est disponible dans cette langue : |
| langue.details.remplacement | Textes non traduits affichés en : {langue} |
| langue.details.avertissement | Une interface traduite ne veut pas dire que toutes les sources ou tous les jugements existent dans cette langue. |
| langue.experimentale.confirmation | {nomNatif} est une langue expérimentale. Une partie de l'interface peut rester en {langueRemplacement}. |
| langue.experimentale.ok | Utiliser quand même |
| commun.annuler | Annuler |
| commun.fermer | Fermer |
| commun.choisir | Choisir |
| commun.reessayer | Réessayer |
| langue.change.ok | Interface en {langue}. Votre recherche et votre rapport ouvert sont conservés. |
| langue.change.encours | Changement de langue en cours… |
| langue.change.erreur | La langue {nomNatif} n'a pas pu être chargée. Réessayez. |
| langue.rapport.autreLangue | Ce rapport est en {langueRapport}. |
| langue.rapport.creerVersion | Créer une version en {langue} |
| langue.catalogue.chargement | Chargement des langues… |
| langue.catalogue.erreur | Impossible de charger la liste des langues. |
| langue.recherche.vide | Aucune langue ne correspond à « {saisie} ». Essayez le nom dans une autre langue ou le code (ex. ur). |
| langue.recherche.effacer | Effacer la recherche |
| langue.filtres.vide | Aucune langue pour ces filtres. |
| langue.filtres.effacer | Effacer les filtres |
| langue.compte.erreur | Votre choix n'a pas été enregistré dans votre compte. |
| langue.horsLigne | Indisponible hors ligne |
| langue.lienPreferences | Régler les langues du rapport et de la recherche |
| langue.badge.* | voir tableau §5 |

Traduction : prévoir +40 % de longueur (allemand, malais…) ; aucun texte dans une image ; variables `{…}` déplaçables dans la phrase selon la grammaire de chaque langue.

## 11. Accessibilité

- **Clavier** : Tab atteint le bouton d'en-tête ; Entrée/Espace ouvre ; focus dans la recherche ; flèches haut/bas dans la liste ; Entrée choisit ; Échap ferme et rend le focus au bouton. Focus piégé dans le panneau tant qu'il est ouvert.
- **Lecteurs d'écran** : chaque nom natif porte sa propre langue et sa direction (pour être prononcé correctement : « اردو » lu en ourdou). Le nombre de résultats est annoncé après chaque frappe. Les badges ont un texte lisible (« Interface traduite : oui »).
- **Contraste** : texte ≥ 4,5:1 ; badges et lignes grisées ≥ 4,5:1 aussi (une ligne grisée reste lisible, sa raison est écrite).
- **Taille** : texte ≥ 16 px ; noms en écriture arabe et autres écritures complexes un peu plus grands (environ +2 px) avec interligne plus haut, pour que les signes diacritiques ne soient pas coupés.
- **Toucher** : zones cliquables ≥ 44 × 44 px ; panneau plein écran sur mobile.
- **Pas d'information par la couleur seule**.
- **RTL** : panneau en miroir quand l'interface est RTL ; codes de langue et noms latins restent LTR à l'intérieur.

## 12. Critères de vérification (pour le testeur)

1. Première visite sans préférence : interface en arabe, RTL.
2. Le sélecteur est visible dans l'en-tête sur toutes les pages, ordinateur et mobile, et dans Paramètres du compte.
3. Recherche « ourdou », « اردو » et « ur » : les trois trouvent la même ligne.
4. Filtres Région et Écriture combinables avec la recherche ; l'arabe reste visible.
5. Aucune ligne n'affiche un badge global « complète ».
6. Une langue sans niveau « Interface » ne peut pas devenir langue d'interface.
7. Changement de langue avec recherche + filtres + rapport ouvert : tout est conservé, le rapport n'est pas retraduit.
8. Un texte source arabe affiché reste identique avant et après le changement.
9. Connecté : la langue est retrouvée après reconnexion sur un autre appareil.
10. Tout le parcours est faisable au clavier seul.
