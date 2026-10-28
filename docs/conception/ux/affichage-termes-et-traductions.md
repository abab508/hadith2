# Écran — Affichage des termes techniques et des traductions

> Spécification UX, indépendante de toute technologie. Sources : `docs/exigences/01-terminologie-arabe-fr-en.md` (§2, §3, §7, §8, §9, §10), `docs/exigences/02-plateforme-multilingue.md` (§5, §6, §7, §9) et `docs/exigences/03-couverture-linguistique-mondiale.md` (§9).
> Les termes arabes, translittérations et définitions cités ici sont **recopiés des exigences**. Tout le reste est un espace réservé entre crochets. Aucune définition savante n'est inventée.

---

## Partie A — Les termes techniques

### A1. Objectif

Un lecteur qui ne lit pas l'arabe comprend chaque terme ; un spécialiste arabophone peut contrôler le terme arabe exact. Le terme arabe et sa translittération sont **toujours accessibles**, partout (interface, rapports, tableaux, notifications, exports PDF, documents de validation).

### A2. Hypothèses (décisions prises seul, réversibles)

| # | Hypothèse | Raison |
|---|---|---|
| H1 | Trois formes d'affichage : **complète** (texte courant), **courte** (rappels dans la même section), **compacte** (tableaux, badges, notifications). | Couvre les cas de 01 §8 avec le moins de variantes. |
| H2 | En forme compacte, l'arabe reste **visible** à côté du terme quand la place le permet ; sinon il est dans l'infobulle. La définition est toujours dans l'infobulle. | 01 §8 : l'arabe et la translittération doivent rester accessibles. |
| H3 | L'infobulle s'ouvre au survol, au focus clavier **et** au toucher (pas seulement au survol). | Mobile et clavier. |
| H4 | Une « section » = un bloc avec son propre titre (ex. « Chaîne de transmission » dans un rapport, un écran entier dans l'interface). | 01 §1 : « première apparition dans chaque section ». |
| H5 | Si un terme n'a pas de traduction validée dans la langue choisie : afficher l'arabe + la translittération + « Traduction non validée dans cette langue » ; définition dans la langue de remplacement, signalée. | 02 §6 : pas de traduction automatique de termes spécialisés sans contrôle. |

### A3. Les trois formes

**1. Forme complète** — première apparition du terme dans chaque section :

Format français (01 §2) :
> **Terme français (terme arabe — translittération) : définition accessible.**

Format anglais (01 §2) :
> **English term (Arabic term — transliteration): accessible definition.**

Exemples recopiés des exigences :
```
Continuité de la chaîne de transmission (اتصال السند — ittiṣāl al-sanad) :
continuité documentée entre les transmetteurs d'une chaîne.

Critique des transmetteurs (الجرح والتعديل — al-jarḥ wa-l-taʿdīl) :
discipline qui examine et qualifie la fiabilité des transmetteurs.

Hidden defect (‘illa) (العلة — al-ʿilla): a subtle defect that may
affect the evaluation of a hadith transmission.
```

Pour un terme sans définition fournie par les exigences, la maquette utilise :
```
[TERME FR] ([TERME ARABE] — [TRANSLITTÉRATION]) : [DÉFINITION DU DICTIONNAIRE].
```

**2. Forme courte** — apparitions suivantes dans la même section :
```
... la [TERME FR] (i) de cette chaîne ...
```
Le terme est souligné en pointillé et porte une icône (i) : il ouvre l'infobulle. L'arabe n'est pas répété dans la phrase mais reste à un geste.

**3. Forme compacte** — tableaux, badges, notifications, en-têtes étroits :
```
+-----------------------------------------------------------+
| Transmetteur        | Appréciation citée                   |
|---------------------+--------------------------------------|
| [NOM DU TRANSMETTEUR] | Transmetteur fiable (ثقة — thiqa) (i) |
| [NOM DU TRANSMETTEUR] | Transmetteur faible (ضعيف — ḍaʿīf) (i) |
+-----------------------------------------------------------+
```
Si la colonne est trop étroite :
```
| Transmetteur fiable (i) |
```
→ l'arabe et la translittération passent dans l'infobulle (H2).

### A4. Infobulle (vue compacte)

```
        Transmetteur fiable (i)
        +------------------------------------------------+
        | Transmetteur fiable                            |
        |                                    ثقة          |
        | thiqa                                          |
        | [DÉFINITION DU DICTIONNAIRE]                   |
        | Évaluateur : [ÉVALUATEUR]  Source : [RÉFÉRENCE] |
        |                              Voir la fiche >   |
        +------------------------------------------------+
```
Ordre : terme dans la langue courante → terme arabe (ligne à part, RTL) → translittération → définition courte → (si c'est une appréciation de transmetteur) évaluateur, formulation originale et référence (01 §5) → lien « Voir la fiche ».

Comportement :
- S'ouvre au survol (après un court délai), au focus clavier, au toucher.
- Reste ouverte quand la souris passe dessus (pour cliquer sur le lien).
- Se ferme avec Échap, en sortant, ou au toucher ailleurs.
- Ne cache jamais le terme lui-même.

### A5. Fiche terme

Ouverte depuis « Voir la fiche » (panneau latéral sur ordinateur, plein écran sur mobile). Champs = ceux du dictionnaire terminologique (01 §9) :

```
+------------------------------------------------------------------+
| < Retour                                       Fiche terme        |
|                                                                  |
|                                          العلة                    |
| al-ʿilla                                                         |
| Français : Défaut caché du hadith                                |
| English  : Hidden defect (‘illa)                                 |
|                                                                  |
| Définition (français)                                            |
|   défaut subtil susceptible d'affecter l'évaluation d'une        |
|   transmission.                                                  |
| Definition (English)                                             |
|   a subtle defect that may affect the evaluation of a hadith     |
|   transmission.                                                  |
|                                                                  |
| Domaine : [DOMAINE SCIENTIFIQUE]                                 |
| Autres graphies : [VARIANTES DE TRANSLITTÉRATION]                |
| À ne pas confondre avec : [TERMES PROCHES]                       |
| Références : [RÉFÉRENCE]                                         |
| Validation : [ÉTAT ET NOTE DE VALIDATION PAR UN SPÉCIALISTE]     |
| Identifiant : [ID]   Version du dictionnaire : [VERSION]         |
|                                                                  |
| [ Copier le terme ]   [ Signaler un problème ]                   |
+------------------------------------------------------------------+
```
- Le terme arabe est le titre principal, en grand, aligné à droite (RTL) même dans une interface LTR.
- Les définitions affichées : celle de la langue de l'interface en premier ; les autres langues disponibles en dessous.
- Si la validation est absente : bandeau « Définition pas encore validée par un spécialiste. » (jamais de validation inventée, 03 §9).
- « Signaler un problème » ouvre un formulaire court (champ texte + envoi vers la validation humaine). Rien n'est publié automatiquement.

### A6. Cas particuliers

**Catégories d'authenticité** (01 §3) — toujours terme + arabe + translittération :

| Affichage français | Affichage anglais |
|---|---|
| Authentique (صحيح — ṣaḥīḥ) | Authentic (صحيح — ṣaḥīḥ) |
| Bon / fiable selon la catégorie technique (حسن — ḥasan) | Good / fair, according to the technical category (حسن — ḥasan) |
| Faible (ضعيف — ḍaʿīf) | Weak (ضعيف — ḍaʿīf) |
| Forgé (موضوع — mawḍūʿ) | Fabricated (موضوع — mawḍūʿ) |

- En anglais, « Good / fair » porte toujours une note visible (pas seulement en infobulle) : « [NOTE DU DICTIONNAIRE : catégorie technique, pas une appréciation générale] » (01 §3).
- **Non déterminé (غير محدد — ghayr muḥaddad)** n'est **pas** affiché comme une catégorie : autre forme (contour, pas de pastille de couleur de la même série), précédé de « Conclusion de l'application : », avec la phrase « Ce n'est pas une catégorie classique d'authenticité. » (01 §3).

```
Catégorie :                 [ Faible (ضعيف — ḍaʿīf) ]           <- pastille
Conclusion de l'application : ( Non déterminé (غير محدد — ghayr muḥaddad) )  <- contour
  Ce n'est pas une catégorie classique d'authenticité.
```
- Ne jamais compter uniquement sur la couleur pour distinguer les catégories.

**Les différents sens de « critique »** (01 §7) : jamais « critique » seul dans un titre ou un filtre. Libellés distincts :
- Critique des transmetteurs (الجرح والتعديل — al-jarḥ wa-l-taʿdīl)
- Critique des défauts cachés (علم العلل — ʿilm al-ʿilal)
- Analyse critique des preuves
- Contrôle documentaire
- Désaccord scientifique (اختلاف العلماء — ikhtilāf al-ʿulamāʾ)

**Appréciation d'un transmetteur** (01 §5) : afficher l'appréciation comme une **citation attribuée**, pas comme un verdict :
```
Transmetteur fiable (ثقة — thiqa) — selon [ÉVALUATEUR], formulation : [FORMULATION ORIGINALE ARABE], [RÉFÉRENCE]
```

**Doute terminologique** (01 §10) : badge texte « Terme à vérifier » + infobulle « Un spécialiste doit confirmer ce terme. ».

**Terme sans traduction validée dans la langue choisie** (H5) :
```
العلة — al-ʿilla (i)   Traduction non validée dans cette langue
```
Infobulle : définition dans la langue de remplacement, précédée de « Définition en [LANGUE DE REMPLACEMENT] : ».

### A7. États (termes)

| État | Affichage |
|---|---|
| Dictionnaire en chargement | Le terme s'affiche tel que fourni ; l'infobulle montre « Chargement de la définition… ». |
| Terme absent du dictionnaire | Le terme reste affiché ; badge « Terme à vérifier » ; infobulle « Ce terme n'est pas encore dans le dictionnaire. » |
| Erreur de chargement | Infobulle : « Définition indisponible pour le moment. » + « Réessayer ». L'arabe et la translittération restent visibles s'ils sont déjà dans le texte. |

---

## Partie B — Les traductions (et la traduction par IA)

### B1. Objectif

Ne jamais confondre un texte original, une traduction humaine et une traduction automatique. Le texte arabe original est **toujours visible** à côté de toute traduction.

### B2. Hypothèses (décisions prises seul, réversibles)

| # | Hypothèse | Raison |
|---|---|---|
| H6 | Ordre fixe : original arabe d'abord, traduction ensuite (empilés). Sur grand écran, option « Côte à côte » ; l'original reste du côté du début de lecture de l'interface. | Simple, lisible sur mobile ; l'original n'est jamais caché. |
| H7 | Quand aucune traduction vérifiée n'existe, la traduction automatique provisoire n'est **pas affichée d'office** : un bouton la demande. | 02 §7 : « peut être proposée séparément, avec un avertissement explicite ». Option la plus prudente. |
| H8 | Le bloc original ne peut pas être replié ni masqué. | 02 §7 et 03 §9 : conserver systématiquement l'original. |

### B3. Les 5 types de texte (03 §9) et leur étiquette

| Type | Étiquette affichée | Style |
|---|---|---|
| Contenu original non traduit | Texte original — [LANGUE] | Bloc neutre, pas de bandeau. |
| Traduction humaine publiée | Traduction publiée | Bloc avec provenance complète. |
| Traduction humaine validée | Traduction validée par un relecteur | Bloc avec provenance + relecteur. |
| Traduction automatique relue par un spécialiste | Traduction automatique, relue par un spécialiste | Bandeau d'information. |
| Traduction automatique | Traduction automatique, à relire | **Bandeau d'avertissement** (voir B4). |

L'étiquette est du texte + une icône différente pour chaque type, jamais une couleur seule.

### B4. Maquette — traduction par IA

```
+--------------------------------------------------------------------+
| TEXTE ARABE ORIGINAL                                               |
|                                                                    |
|                                     [TEXTE ARABE ORIGINAL]          |
|                                  (aligné à droite, RTL, voyelles   |
|                                   et signes conservés)             |
|                                                                    |
| Source : [RÉFÉRENCE]                         [ Copier l'original ] |
+--------------------------------------------------------------------+
+--------------------------------------------------------------------+
| /!\ Traduction automatique, à relire                               |
|     Générée par IA. Ce n'est ni une traduction officielle,         |
|     ni une traduction publiée, ni le texte original.               |
|--------------------------------------------------------------------|
| [TRADUCTION AUTOMATIQUE EN FRANÇAIS]                               |
|                                                                    |
| Langue : français · Générée le [DATE] · État : non relue           |
| [ Copier la traduction ]  [ Demander une relecture humaine ]       |
+--------------------------------------------------------------------+
```
Règles :
- La traduction n'est **jamais** mise entre guillemets ni présentée comme une citation (01 §8).
- Le bandeau reste visible : il n'est pas refermable.
- « Copier la traduction » ajoute automatiquement la mention : « Traduction automatique, à relire — non officielle. » + la référence de l'original.
- L'export PDF garde le bandeau et le bloc original.
- « Demander une relecture humaine » n'apparaît que si le niveau « Validation humaine disponible » existe pour cette langue.

### B5. Maquette — traduction humaine publiée

```
+--------------------------------------------------------------------+
| TEXTE ARABE ORIGINAL                                               |
|                                     [TEXTE ARABE ORIGINAL]          |
| Source : [RÉFÉRENCE]                                               |
+--------------------------------------------------------------------+
+--------------------------------------------------------------------+
| Traduction publiée — français                                      |
| [TRADUCTION PUBLIÉE]                                               |
|                                                                    |
| Traducteur : [TRADUCTEUR OU ORGANISME] · Source : [RÉFÉRENCE]      |
| Édition : [ÉDITION] · Droits : [DROITS DE RÉUTILISATION]           |
| Vérification : [ÉTAT DE VÉRIFICATION]                              |
+--------------------------------------------------------------------+
```
Si un champ de provenance manque : afficher « Non renseigné » (jamais un champ inventé ni caché).

### B6. Maquette — aucune traduction vérifiée

```
+--------------------------------------------------------------------+
| TEXTE ARABE ORIGINAL                                               |
|                                     [TEXTE ARABE ORIGINAL]          |
| Source : [RÉFÉRENCE]                                               |
+--------------------------------------------------------------------+
+--------------------------------------------------------------------+
| (i) Aucune traduction vérifiée n'est disponible en français.       |
|                                                                    |
|     Traduction vérifiée disponible en : [AUTRES LANGUES] >          |
|     [ Afficher une traduction automatique provisoire ]            |
+--------------------------------------------------------------------+
```
- La ligne « disponible en : » n'apparaît que si de telles traductions existent.
- Le bouton ouvre la maquette B4 (avec son bandeau).

### B7. Origine d'une correspondance de recherche (02 §9)

Chaque résultat de recherche porte une étiquette indiquant d'où vient la correspondance :

| Origine | Étiquette |
|---|---|
| Texte arabe original | Trouvé dans le texte arabe original |
| Traduction publiée | Trouvé dans une traduction publiée |
| Traduction générée | Trouvé dans une traduction automatique |
| Simple similarité | Texte similaire — correspondance non établie |

Pour la dernière : phrase obligatoire « Une ressemblance ou une traduction proche ne prouve pas qu'il s'agit du même hadith. » (02 §8).

### B8. États (traductions)

| État | Affichage |
|---|---|
| Chargement de la traduction | Original affiché tout de suite ; bloc traduction en lignes grises + « Chargement de la traduction… ». |
| Génération IA en cours | « Traduction automatique en cours… » ; le bandeau d'avertissement est déjà visible. |
| Erreur de génération | « La traduction automatique a échoué. » + « Réessayer ». L'original reste affiché. |
| Langue de traduction RTL (ex. ourdou) | Bloc traduction en RTL, même si l'interface est LTR (voir `rapport-mixte.md`). |

---

## C. Textes d'interface

| Clé | Texte (fr) |
|---|---|
| terme.voirFiche | Voir la fiche |
| terme.fiche.titre | Fiche terme |
| terme.fiche.retour | Retour |
| terme.fiche.domaine | Domaine |
| terme.fiche.graphies | Autres graphies |
| terme.fiche.confondre | À ne pas confondre avec |
| terme.fiche.references | Références |
| terme.fiche.validation | Validation |
| terme.fiche.version | Version du dictionnaire |
| terme.fiche.copier | Copier le terme |
| terme.fiche.signaler | Signaler un problème |
| terme.nonValide | Définition pas encore validée par un spécialiste. |
| terme.aVerifier | Terme à vérifier |
| terme.aVerifier.aide | Un spécialiste doit confirmer ce terme. |
| terme.absent | Ce terme n'est pas encore dans le dictionnaire. |
| terme.tradNonValidee | Traduction non validée dans cette langue |
| terme.defRemplacement | Définition en {langue} : |
| terme.chargement | Chargement de la définition… |
| terme.erreur | Définition indisponible pour le moment. |
| terme.selon | selon {evaluateur}, formulation : {formulation} |
| conclusion.prefixe | Conclusion de l'application : |
| conclusion.nonCategorie | Ce n'est pas une catégorie classique d'authenticité. |
| trad.original | Texte arabe original |
| trad.source | Source |
| trad.copierOriginal | Copier l'original |
| trad.ia.titre | Traduction automatique, à relire |
| trad.ia.texte | Générée par IA. Ce n'est ni une traduction officielle, ni une traduction publiée, ni le texte original. |
| trad.ia.relue | Traduction automatique, relue par un spécialiste |
| trad.publiee | Traduction publiée |
| trad.validee | Traduction validée par un relecteur |
| trad.copier | Copier la traduction |
| trad.copier.mention | Traduction automatique, à relire — non officielle. |
| trad.relecture | Demander une relecture humaine |
| trad.nonRenseigne | Non renseigné |
| trad.aucuneVerifiee | Aucune traduction vérifiée n'est disponible en {langue}. |
| trad.ailleurs | Traduction vérifiée disponible en : {langues} |
| trad.provisoire | Afficher une traduction automatique provisoire |
| trad.chargement | Chargement de la traduction… |
| trad.ia.encours | Traduction automatique en cours… |
| trad.ia.erreur | La traduction automatique a échoué. |
| correspondance.original | Trouvé dans le texte arabe original |
| correspondance.publiee | Trouvé dans une traduction publiée |
| correspondance.generee | Trouvé dans une traduction automatique |
| correspondance.similaire | Texte similaire — correspondance non établie |
| correspondance.avertissement | Une ressemblance ou une traduction proche ne prouve pas qu'il s'agit du même hadith. |

## D. Accessibilité

- Le terme arabe porte la langue arabe et la direction RTL pour être lu correctement ; la translittération porte la langue « arabe en écriture latine » (pour ne pas être lue comme du français).
- Le terme avec infobulle est un élément focalisable ; l'infobulle est reliée au terme (lue au focus).
- Bandeau IA : lu **avant** le texte traduit.
- Texte arabe : taille ≥ 18 px, interligne généreux (signes diacritiques non coupés) ; police couvrant l'arabe et la translittération (ʿ, ṣ, ḥ, ḍ, ṭ, ā, ī, ū…).
- Contraste ≥ 4,5:1, y compris pour le bandeau et les étiquettes.
- Rien ne repose sur la couleur seule (catégories, types de traduction).

## E. Critères de vérification

1. Dans chaque section d'un rapport, la première apparition d'un terme suit le format « Terme (arabe — translittération) : définition ».
2. Dans un tableau étroit, l'arabe et la translittération sont atteignables au clavier et au toucher.
3. « Non déterminé » n'a jamais le même style que les catégories d'authenticité.
4. Une traduction IA n'apparaît jamais sans son bandeau, ni sans le texte arabe original au-dessus.
5. Sans traduction vérifiée, le message d'absence s'affiche et aucune traduction IA n'apparaît sans action de l'utilisateur.
6. La copie et l'export PDF d'une traduction IA gardent la mention.
