# Écran — Rapport mixte (arabe, français, références, URL)

> Spécification UX, indépendante de toute technologie. Sources : `docs/exigences/01-terminologie-arabe-fr-en.md` (§1, §2, §5, §8), `docs/exigences/02-plateforme-multilingue.md` (§4, §5, §7, §8, §12) et `docs/exigences/03-couverture-linguistique-mondiale.md` (§8, §9).
> Aucun hadith, aucune référence et aucune conclusion réels : tout est en **espace réservé** entre crochets. Les termes arabes et définitions recopiés viennent de l'exigence 01.

## 1. Objectif

Afficher un rapport qui mélange de l'arabe (RTL), du français (LTR), des références numériques et des URL, **sans que l'ordre des mots, des chiffres ou de la ponctuation soit cassé**, et sans jamais inverser ni modifier le texte arabe.

## 2. Hypothèses (décisions prises seul, réversibles)

| # | Hypothèse | Raison |
|---|---|---|
| H1 | Direction décidée à deux niveaux : **bloc** (paragraphe, citation, cellule, élément de liste) et **fragment** (mot ou groupe de mots dans une phrase). | 02 §4 : direction gérée au niveau des composants et des textes. |
| H2 | La direction d'un bloc vient de la **langue déclarée** de son contenu (donnée), pas d'une devinette sur les caractères. Devinette seulement pour le texte saisi par l'utilisateur. | Plus fiable ; la langue de chaque preuve est connue (02 §8). |
| H3 | Références conservées **telles qu'elles sont dans la source** (langue et chiffres d'origine). Les nombres propres au rapport (dates, compteurs) suivent le format de la langue du rapport. | 02 §8 : conserver les références dans leur langue d'origine. |
| H4 | Une URL est toujours un fragment isolé, LTR, jamais traduit, jamais coupé au milieu d'un mot. | Une URL inversée devient fausse. |
| H5 | Le rapport n'a pas de bouton pour masquer les citations arabes. | 02 §7 : conservation du texte original. |

## 3. Maquette A — Rapport en français (base LTR) avec blocs arabes

Les colonnes `|<` et `>|` à droite indiquent l'alignement de chaque bloc : `<` = début à gauche (LTR), `>` = début à droite (RTL).

```
+--------------------------------------------------------------------------+
| Rapport n° [IDENTIFIANT]        Langue du rapport : Français   Modifier  |  LTR
| Créé le [DATE] · Langues de recherche : arabe, anglais, français, ourdou |  LTR
+--------------------------------------------------------------------------+
|                                                                          |
| 1. QUESTION                                                              |  LTR
|    Question posée (texte d'origine, non modifié) :                       |  LTR
|                                      [QUESTION DE L'UTILISATEUR]          |  dir. de la question
|                                                                          |
| 2. CONCLUSION                                                            |  LTR
|    Conclusion de l'application : [CATÉGORIE OU « Non déterminé »]        |  LTR
|    [RÉSUMÉ EN FRANÇAIS]                                                  |  LTR
|                                                                          |
| 3. TEXTE DU HADITH                                                       |  LTR
|    Texte du hadith (المتن — al-matn) : [DÉFINITION DU DICTIONNAIRE].      |  LTR + fragment RTL
|                                                                          |
|    +--------------------------------------------------------------+      |
|    | Texte arabe original                                         |      |  LTR (étiquette)
|    |                                    [TEXTE ARABE ORIGINAL]     |      |  RTL (bloc)
|    |                              [SUITE DU TEXTE ARABE ORIGINAL]  |      |  RTL (bloc)
|    | Source : [RÉFÉRENCE EN ARABE, TELLE QUE DANS LA SOURCE]       |      |  étiquette LTR + fragment RTL
|    +--------------------------------------------------------------+      |
|    +--------------------------------------------------------------+      |
|    | /!\ Traduction automatique, à relire                          |      |  LTR
|    | [TRADUCTION AUTOMATIQUE EN FRANÇAIS]                          |      |  LTR
|    +--------------------------------------------------------------+      |
|                                                                          |
| 4. CHAÎNE DE TRANSMISSION                                                |  LTR
|    Continuité de la chaîne de transmission (اتصال السند — ittiṣāl         |  LTR + fragment RTL
|    al-sanad) : continuité documentée entre les transmetteurs d'une       |
|    chaîne.                                                               |
|                                                                          |
|    Chaîne telle que citée :                                              |  LTR
|                                        [CHAÎNE EN ARABE, TELLE QUE CITÉE] |  RTL (bloc)
|                                                                          |
|    Transmetteurs, dans l'ordre de la source :                            |  LTR
|    1. [NOM DU TRANSMETTEUR EN ARABE] — [TRANSLITTÉRATION]                |  LTR (liste) + fragment RTL
|    2. [NOM DU TRANSMETTEUR EN ARABE] — [TRANSLITTÉRATION]                |
|                                                                          |
| 5. TRANSMETTEURS                                                         |  LTR
|    Critique des transmetteurs (الجرح والتعديل — al-jarḥ wa-l-taʿdīl) :   |  LTR + fragment RTL
|    discipline qui examine et qualifie la fiabilité des transmetteurs.    |
|                                                                          |
|    | Transmetteur            | Appréciation citée        | Référence        |  tableau LTR
|    |-------------------------+---------------------------+------------------|
|    |  [NOM EN ARABE]         | [TERME FR] (ثقة — thiqa)  | [RÉFÉRENCE]      |  cellule RTL / LTR+frag / isolée
|    |                         | selon [ÉVALUATEUR]        | t. [N], p. [N]   |
|                                                                          |
| 6. DÉFAUTS ÉVENTUELS                                                     |  LTR
|    Défaut caché du hadith (العلة — al-ʿilla) : défaut subtil susceptible  |  LTR + fragment RTL
|    d'affecter l'évaluation d'une transmission.                           |
|    Irrégularité de transmission (الشذوذ — al-shudhūdh) : notion technique |  LTR + fragment RTL
|    dont l'application dépend de l'analyse comparative des transmissions  |
|    et de l'appréciation des spécialistes.                                |
|    [ANALYSE EN FRANÇAIS, AVEC CITATIONS ARABES COURTES EN FRAGMENTS]     |
|                                                                          |
| 7. RÉFÉRENCES                                                            |  LTR
|    [1] [COLLECTION EN ARABE], [TOME]/[PAGE], n° [N° DE HADITH]           |  fragments isolés
|        Langue : arabe · Trouvé dans le texte arabe original             |  LTR
|        https://[DOMAINE-SOURCE]/[CHEMIN]                                 |  URL isolée LTR
|    [2] [RÉFÉRENCE EN FRANÇAIS]                                           |  LTR
|        Langue : français · Trouvé dans une traduction publiée           |
|        Traducteur : [TRADUCTEUR] · Édition : [ÉDITION]                   |
|        https://[DOMAINE-SOURCE]/[CHEMIN]                                 |
|    [3] [RÉFÉRENCE EN OURDOU]                                             |  bloc RTL
|        Langue : ourdou · Trouvé dans une traduction publiée             |
|                                                                          |
| 8. LIMITES ET AVERTISSEMENTS                                             |  LTR
|    [AVERTISSEMENTS : traductions manquantes, termes à vérifier, etc.]    |
+--------------------------------------------------------------------------+
```

Notes :
- Chaque section commence par le format complet des termes à leur **première apparition dans la section** (voir `affichage-termes-et-traductions.md`).
- Chaque preuve indique sa langue et sa provenance (02 §8).
- Une référence en arabe reste en arabe, même dans un rapport français (H3).

## 4. Maquette B — Rapport en arabe (base RTL) avec fragments latins

Le rapport arabe n'est pas rédigé ici (aucun texte arabe inventé) : seule la disposition est montrée.

```
+--------------------------------------------------------------------------+
|  Modifier   [LIBELLÉ ARABE : LANGUE DU RAPPORT]      [N° DU RAPPORT EN ARABE] |  RTL
+--------------------------------------------------------------------------+
|                                                    [TITRE DE SECTION EN ARABE] .1 |  RTL
|                    [PHRASE EN ARABE] al-matn [SUITE DE LA PHRASE EN ARABE] |  RTL + fragment LTR
|                                                                          |
|                                             [TEXTE ARABE ORIGINAL]        |  RTL (bloc)
|                                                                          |
|  +------------------------------------------------------------+          |
|  | [ÉTIQUETTE ARABE : TRADUCTION PUBLIÉE — FRANÇAIS]           |          |  RTL (étiquette)
|  | [TRADUCTION PUBLIÉE EN FRANÇAIS]                            |          |  LTR (bloc)
|  +------------------------------------------------------------+          |
|                                                                          |
|                                                [TITRE DE SECTION EN ARABE] .7 |  RTL
|          [COLLECTION EN ARABE]، [TOME]/[PAGE]، [N° DE HADITH] [1]          |  RTL + nombres isolés
|                          https://[DOMAINE-SOURCE]/[CHEMIN]                 |  URL isolée LTR, alignée à droite
+--------------------------------------------------------------------------+
```
Points à vérifier sur cette maquette :
- La mise en page est en miroir (menus, numéros de section, puces à droite).
- Un bloc français à l'intérieur reste LTR, aligné à gauche dans son cadre.
- L'URL se lit de gauche à droite, mais le bloc qui la contient est aligné à droite.

## 5. Règles de direction

### 5.1 Niveau page et rapport

| Élément | Direction |
|---|---|
| Page (menus, en-tête, cadre) | Celle de la **langue de l'interface**. |
| Corps du rapport (titres, synthèse) | Celle de la **langue du rapport**. Interface et rapport peuvent avoir des directions différentes (ex. interface arabe RTL + rapport français LTR). |

### 5.2 Niveau bloc

Un bloc = paragraphe, citation, élément de liste, cellule de tableau, légende, ligne de référence.

| Bloc | Direction | Alignement |
|---|---|---|
| Paragraphe dans la langue du rapport | Celle du rapport | Début de ligne de cette direction |
| Citation arabe (texte original, chaîne, formulation d'un évaluateur) | RTL | À droite, même dans un rapport LTR |
| Traduction dans une langue LTR | LTR | À gauche, même dans un rapport RTL |
| Traduction en ourdou, persan, pachto, kurde en écriture arabe | RTL | À droite |
| Question de l'utilisateur | Devinée sur le texte saisi (H2) | Selon la direction trouvée |
| Cellule de tableau | Celle de son contenu ; l'ordre des colonnes suit la direction du rapport | — |
| Liste numérotée | Celle du rapport ; chaque élément garde ses fragments isolés | — |
| Bloc de code ou identifiant technique | LTR | À gauche |

Règle : **un bloc = une langue déclarée = une direction**. Ne jamais mélanger deux longues phrases de directions différentes dans un même bloc : les séparer en deux blocs.

### 5.3 Niveau fragment (dans une phrase)

Chaque fragment de direction différente est **isolé** : il est mis en forme comme une petite boîte qui n'influence pas l'ordre des mots autour (isolation bidirectionnelle).

| Fragment | Règle |
|---|---|
| Terme arabe dans une phrase française : « Défaut caché du hadith (العلة — al-ʿilla) : … » | Seul « العلة » est isolé en RTL. Les parenthèses, le tiret « — », la translittération et les « : » appartiennent à la phrase française (LTR). Résultat attendu : la parenthèse ouvrante reste avant le mot arabe, la fermante après la translittération. |
| Translittération dans une phrase arabe | Isolée en LTR. |
| Nom propre arabe dans une liste française | Isolé en RTL, suivi de « — [TRANSLITTÉRATION] » en LTR. |
| Nombre seul (page, numéro de hadith) dans du texte arabe | Laissé au texte (les chiffres se lisent toujours de gauche à droite à l'intérieur). |
| Groupe de nombres avec séparateurs : « [TOME]/[PAGE] », « [N]-[N] », « [N]:[N] » | Isolé **en entier** en LTR, pour que « 3/45 » ne devienne pas « 45/3 ». |
| Référence complète | Isolée selon la langue de la référence ; ses groupes de nombres isolés à l'intérieur. |
| URL, adresse e-mail, DOI, ISBN | Isolés en LTR, toujours. |
| Ponctuation finale d'une phrase | Appartient à la phrase, pas au fragment isolé (le point final reste au bout de la phrase française, pas collé au mot arabe). |
| Guillemets autour d'une citation arabe courte | Ceux de la langue du rapport (« … » en français), placés hors du fragment isolé. |

### 5.4 Chiffres et formats

- Nombres propres au rapport (date de création, compteurs, pourcentages) : format de la **langue du rapport** (chiffres, séparateurs, calendrier tels que définis pour cette langue dans le catalogue).
- Nombres d'une référence : **tels qu'ils sont dans la source** (H3). Ne pas convertir des chiffres arabes orientaux en chiffres latins, ni l'inverse, à l'intérieur d'une référence.
- Les deux formes peuvent donc coexister dans un même rapport : c'est voulu.

### 5.5 URL

- Toujours LTR, isolées, jamais traduites, jamais en miroir.
- Affichées en entier si elles tiennent ; sinon coupées **seulement** après « / », « . », « - » ou « ? », sans ajouter de tiret de césure.
- Lien cliquable sur toute l'URL ; l'URL complète est lue par les lecteurs d'écran et visible au survol et au focus.
- Dans un bloc RTL, l'URL s'aligne avec le bloc (à droite) mais se lit de gauche à droite.

### 5.6 Ce qui ne s'inverse jamais

- Le texte arabe : jamais inversé à la main, jamais remplacé par sa translittération, voyelles et signes conservés tels quels (02 §4, 01 §2).
- Les URL, codes de langue, identifiants, DOI, ISBN.
- Les logos, les chiffres, les icônes qui ne représentent pas une direction (ex. loupe, horloge).

### 5.7 Ce qui passe en miroir en RTL

- La mise en page (barres latérales, marges, retraits de liste, numéros).
- Les icônes de direction (flèches « suivant », « retour », chevrons de dépliage).
- L'ordre des colonnes d'un tableau.

## 6. Copier, imprimer, exporter

- Copier un passage mixte garde l'ordre logique et les isolations : collé ailleurs, l'arabe reste lisible et dans le bon ordre.
- « Copier l'original » copie uniquement le texte arabe, sans translittération ni traduction.
- L'export PDF applique exactement les mêmes règles de bloc et de fragment, avec des polices couvrant toutes les écritures présentes. Si une écriture ne peut pas être incluse : avertissement avant export « Ce rapport contient une écriture que l'export ne peut pas afficher : [ÉCRITURE]. » (jamais de carrés vides silencieux).

## 7. Éléments du rapport dans l'ordre

1. En-tête : identifiant, langue du rapport (+ Modifier), date, langues de recherche.
2. Question d'origine (texte non modifié).
3. Conclusion (catégorie ou « Non déterminé », voir `affichage-termes-et-traductions.md` A6) + résumé.
4. Texte du hadith : original arabe, puis traduction(s) étiquetée(s).
5. Chaîne de transmission.
6. Transmetteurs (tableau avec appréciations citées et attribuées).
7. Défauts éventuels.
8. Références (langue + provenance + URL pour chacune).
9. Limites et avertissements (traductions manquantes, termes à vérifier, désaccords).

Actions : Copier l'original · Copier la traduction · Exporter en PDF · Changer la langue du rapport · Voir la fiche d'un terme · Ouvrir une source (URL).

## 8. États

| État | Affichage |
|---|---|
| Rapport en cours de rédaction | En-tête et question visibles ; sections en lignes grises ; « Rédaction du rapport en cours… ». |
| Section sans contenu | « Aucune information trouvée pour cette section. » (jamais une section vide sans explication). |
| Traduction manquante | Message d'absence de traduction vérifiée (voir `affichage-termes-et-traductions.md` B6). |
| Police manquante pour une écriture | Le texte est affiché avec une police de secours si possible ; sinon : « Ce texte utilise une écriture que votre appareil n'affiche pas. » + « Copier le texte ». |
| URL injoignable | L'URL reste affichée en entier ; mention « Lien vérifié le [DATE] » ou « Lien non vérifié ». |
| Erreur de chargement du rapport | « Le rapport n'a pas pu être chargé. » + « Réessayer ». |

## 9. Textes d'interface

| Clé | Texte (fr) |
|---|---|
| rapport.numero | Rapport n° {id} |
| rapport.langue | Langue du rapport : {langue} |
| rapport.cree | Créé le {date} |
| rapport.languesRecherche | Langues de recherche : {langues} |
| rapport.question | Question posée (texte d'origine, non modifié) : |
| rapport.section.question | Question |
| rapport.section.conclusion | Conclusion |
| rapport.section.texte | Texte du hadith |
| rapport.section.chaine | Chaîne de transmission |
| rapport.section.transmetteurs | Transmetteurs |
| rapport.section.defauts | Défauts éventuels |
| rapport.section.references | Références |
| rapport.section.limites | Limites et avertissements |
| rapport.chaineCitee | Chaîne telle que citée : |
| rapport.ordreSource | Transmetteurs, dans l'ordre de la source : |
| rapport.tableau.transmetteur | Transmetteur |
| rapport.tableau.appreciation | Appréciation citée |
| rapport.tableau.reference | Référence |
| rapport.ref.langue | Langue : {langue} |
| rapport.sectionVide | Aucune information trouvée pour cette section. |
| rapport.redaction | Rédaction du rapport en cours… |
| rapport.erreur | Le rapport n'a pas pu être chargé. |
| rapport.exporterPdf | Exporter en PDF |
| rapport.export.ecriture | Ce rapport contient une écriture que l'export ne peut pas afficher : {ecriture}. |
| rapport.police.manquante | Ce texte utilise une écriture que votre appareil n'affiche pas. |
| rapport.copierTexte | Copier le texte |
| rapport.lien.verifie | Lien vérifié le {date} |
| rapport.lien.nonVerifie | Lien non vérifié |

(Les étiquettes de traduction et d'origine des correspondances sont dans `affichage-termes-et-traductions.md`.)

## 10. Accessibilité

- Chaque bloc et chaque fragment déclare sa langue : le lecteur d'écran change de voix au bon endroit.
- Les titres de section sont de vrais titres (navigation par titres possible).
- Ordre de lecture au clavier = ordre logique du rapport, quelle que soit la direction.
- Texte ≥ 16 px ; texte arabe ≥ 18 px avec interligne plus grand.
- Contraste ≥ 4,5:1 ; liens soulignés (pas seulement colorés).
- Sur mobile : une colonne, tableaux transformés en fiches empilées (une fiche par transmetteur), URL coupées selon 5.5.

## 11. Critères de vérification (tests de textes mixtes, 02 §11)

1. « Défaut caché du hadith (العلة — al-ʿilla) : … » s'affiche avec les parenthèses et le tiret à la bonne place, en LTR et dans un rapport RTL équivalent.
2. « [TOME]/[PAGE] » (ex. de test : 3/45) reste dans cet ordre dans un bloc arabe.
3. Une URL dans un bloc RTL est identique caractère par caractère à l'URL source et reste cliquable.
4. Le point final d'une phrase française se terminant par un mot arabe reste à la fin de la phrase.
5. Le texte arabe affiché est identique, octet par octet, au texte stocké (aucune inversion, aucun caractère retiré).
6. Interface arabe (RTL) + rapport français (LTR) : la page est en miroir, le rapport ne l'est pas.
7. Copier un paragraphe mixte puis le coller dans un éditeur simple : ordre conservé.
8. L'export PDF respecte les mêmes règles.
