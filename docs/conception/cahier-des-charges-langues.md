# Cahier des charges — Multilingue et terminologie (HadithVerify AI)

> Rédigé par l'analyste le 2026-10-28, en mode autopilote.
> Sources : docs/exigences/01-terminologie-arabe-fr-en.md (« Ex.01 »), docs/exigences/02-plateforme-multilingue.md (« Ex.02 »), docs/exigences/03-couverture-linguistique-mondiale.md (« Ex.03 »).
> Aucune définition savante n'est ajoutée ici : les définitions et les termes arabes font foi dans les fichiers d'exigences.

## 1. Le besoin en 5 lignes

1. HadithVerify AI doit servir des personnes du monde entier, y compris celles qui ne lisent pas l'arabe.
2. L'arabe est la langue par défaut. L'utilisateur peut changer de langue à tout moment, sans perdre son travail.
3. Les textes arabes originaux ne sont jamais remplacés. Les traductions sont séparées et leur provenance est indiquée (humaine, IA, vérifiée ou non).
4. Les termes techniques des sciences du hadith passent par un dictionnaire unique : terme dans la langue choisie + arabe + translittération + explication.
5. On ajoute des langues sans reconstruire l'application, et on affiche honnêtement ce qui est vraiment disponible dans chaque langue.

## 2. Utilisateurs

- Grand public non arabophone (francophone, anglophone, etc.) : doit comprendre les conclusions sans savoir l'arabe (Ex.01 §10).
- Spécialistes arabophones : doivent pouvoir contrôler termes, références et conclusions (Ex.01, règle finale).
- Validateurs humains compétents : valident les traductions techniques et lèvent les doutes terminologiques (Ex.01 §10, Ex.02 §6).
- Gestionnaires du contenu (hypothèse H-09) : enrichissent le catalogue de langues, les fichiers de traduction et le dictionnaire.
- Les agents IA du projet : consomment le dictionnaire et produisent les rapports dans la langue demandée.

## 3. Périmètre

### 3.1 Dans la V1

- Les 8 langues de lancement, activées au minimum pour les fonctions essentielles de l'interface (Ex.02 §3) :
  `ar` العربية (par défaut), `en` English, `fr` Français, `es` Español, `ur` اردو, `id` Bahasa Indonesia, `ms` Bahasa Melayu, `tr` Türkçe.
- Catalogue de langues dynamique (données, pas code), avec les 29 langues de priorité 2 d'Ex.02 §3 enregistrées au niveau « Identifiée ».
- Sélecteur de langue, gestion RTL/LTR, trois préférences de langue indépendantes.
- Séparation texte original / traductions, avec provenance et étiquetage IA.
- Dictionnaire terminologique centralisé (arabe, translittération, français, anglais) et contrôle qualité terminologique avant publication.
- Recherche multilingue (les 9 modes d'Ex.02 §9).
- Enregistrement et affichage des 8 niveaux de prise en charge (Ex.03 §7).
- Tests automatisés des fonctions multilingues et documentation « ajouter une langue ».

### 3.2 Hors périmètre V1

- Traduction complète de l'interface dans les langues de priorité 2 (architecture prête, traductions plus tard).
- Variantes régionales d'interface (ex. français du Canada, anglais indien) : le catalogue sait les enregistrer, mais aucune n'est activée en V1 (H-05).
- Contenu en langues des signes : architecture non bloquante seulement, aucune langue des signes déclarée disponible (Ex.03 §5).
- Détection automatique de la langue du navigateur (H-01).
- Traduction validée des définitions du dictionnaire dans les langues autres que le français et l'anglais (H-06).
- Choix de la technologie d'internationalisation : relève de l'architecte (aucune stack choisie à ce jour).
- Recrutement ou désignation des validateurs humains (question pour le patron, voir risques).

## 4. Exigences

Chaque exigence se termine par « Réussi quand… » : un test ou une vérification qu'on peut faire.

### 4.1 Catalogue de langues

- **EX-01** — Le catalogue de langues est stocké comme données séparées du code (Ex.03 §6, §8).
  Réussi quand : on ajoute une langue de test au catalogue et elle apparaît dans le sélecteur sans modifier ni recompiler le code de l'application.
- **EX-02** — Chaque langue ou variante est identifiée par un identifiant BCP 47, avec un code ISO 639 (Ex.03 §1, §8).
  Réussi quand : toutes les entrées du catalogue ont un identifiant valide selon BCP 47, sauf celles marquées « interne » (EX-03).
- **EX-03** — Un dialecte sans identifiant normalisé reçoit un identifiant interne documenté, lié à sa langue parente et marqué comme non officiel (Ex.03 §8).
  Réussi quand : chaque identifiant interne a une langue parente, une note de documentation et un indicateur « non officiel » ; aucun n'imite un code officiel.
- **EX-04** — Chaque entrée porte les champs d'Ex.02 §4 : code normalisé, nom natif, nom traduit, direction (RTL/LTR), police compatible, format des dates et nombres, traductions de l'interface, état de complétude, disponibilité des traductions documentaires, langues de remplacement. S'y ajoutent : région(s), système(s) d'écriture, état (active / expérimentale / désactivée).
  Réussi quand : un contrôle automatique du catalogue ne trouve aucune entrée active avec un champ obligatoire vide.
- **EX-05** — Les noms de langues et les formats locaux proviennent de Unicode CLDR (Ex.03 §8).
  Réussi quand : pour les 8 langues V1, le nom natif et le format de date affichés correspondent aux données CLDR.
- **EX-06** — Les 8 langues de lancement sont actives en V1 : `ar`, `en`, `fr`, `es`, `ur`, `id`, `ms`, `tr` (Ex.02 §3).
  Réussi quand : ces 8 langues sont sélectionnables et l'interface essentielle est entièrement traduite dans chacune (0 clé manquante, voir EX-45).
- **EX-07** — Les 29 langues de priorité 2 d'Ex.02 §3 sont présentes au catalogue, au moins au niveau « Identifiée ».
  Réussi quand : le catalogue contient ces 29 codes, avec le niveau réel de chacune.
- **EX-08** — Une variante régionale ou dialectale est distincte de sa langue ; aucune fusion de langues distinctes, aucun dialecte traité d'office comme langue distincte (Ex.03 §3).
  Réussi quand : le catalogue peut contenir une langue et deux de ses variantes comme entrées liées mais séparées.
- **EX-09** — Une langue à plusieurs écritures a une entrée par couple langue + écriture (Ex.03 §8 ; exemple Ex.02 : kurde « Kurdî / کوردی »).
  Réussi quand : le kurde peut être enregistré en écriture latine (LTR) et en écriture arabe (RTL) avec des directions différentes.

### 4.2 Sélecteur de langue

- **EX-10** — Sans préférence enregistrée, l'application s'ouvre en arabe (Ex.02 §2, §3).
  Réussi quand : un navigateur neuf, sans stockage ni compte, affiche l'interface en arabe, quelle que soit la langue du navigateur.
- **EX-11** — Le sélecteur est visible dans l'en-tête de chaque page et dans les paramètres du compte (Ex.02 §2).
  Réussi quand : le sélecteur est présent sur chaque écran de la V1 et dans les paramètres.
- **EX-12** — Le sélecteur affiche le nom natif de chaque langue, avec son nom traduit dans la langue courante (Ex.02 §2).
  Réussi quand : interface en français, l'entrée ourdou s'affiche « اردو — Ourdou ».
- **EX-13** — Changer de langue met à jour l'interface sans effacer la recherche en cours, les filtres, les résultats ni le rapport ouvert (Ex.02 §2).
  Réussi quand : un test fait une recherche avec filtres, ouvre un rapport, change de langue, et retrouve les mêmes requête, filtres, résultats et rapport.
- **EX-14** — La préférence est mémorisée : dans le compte si l'utilisateur est connecté, dans le stockage local du navigateur pour un visiteur (Ex.02 §2 ; H-02).
  Réussi quand : après déconnexion/reconnexion ou rechargement de page, la langue choisie est conservée.
- **EX-15** — Le sélecteur permet de chercher une langue par nom, par nom natif et par code, et de filtrer par région et par écriture (Ex.03 §6).
  Réussi quand : taper « tr », « Türkçe » ou « Turc » trouve le turc ; le filtre « écriture arabe » affiche au moins `ar` et `ur`.
- **EX-16** — Le sélecteur indique pour chaque langue la disponibilité de l'interface et des contenus, et son état (expérimentale, incomplète). Une langue désactivée n'est pas sélectionnable (Ex.03 §6).
  Réussi quand : une langue marquée « expérimentale » porte une mention visible ; une langue « désactivée » n'apparaît pas comme choix possible.
- **EX-17** — L'arabe reste immédiatement accessible depuis le sélecteur, quelle que soit la langue courante (Ex.02 §3).
  Réussi quand : l'arabe est affiché en tête de liste, sans recherche ni défilement.

### 4.3 Direction du texte (RTL/LTR) et affichage

- **EX-18** — La direction générale de l'interface suit la langue de l'interface : RTL pour `ar` et `ur` en V1, LTR pour les 6 autres (Ex.02 §4).
  Réussi quand : un test vérifie la direction de la page pour chacune des 8 langues.
- **EX-19** — La direction est aussi gérée au niveau de chaque composant et de chaque fragment de texte : un rapport peut mélanger arabe, français, références numériques et URL (Ex.02 §4).
  Réussi quand : un rapport en français contenant une citation arabe, un numéro de référence et une URL s'affiche avec chaque partie dans le bon sens et dans le bon ordre (test de texte mixte).
- **EX-20** — Les textes sont stockés et affichés en Unicode ; aucune chaîne arabe n'est inversée à la main (Ex.02 §4, Ex.03 §8).
  Réussi quand : le texte arabe stocké est identique, caractère par caractère, au texte affiché.
- **EX-21** — Chaque langue a une police compatible ; les caractères combinés (dont les signes de translittération comme ʿ, ṣ, ḥ) s'affichent correctement (Ex.02 §4, Ex.03 §8).
  Réussi quand : un écran de test affichant un échantillon de chacune des 8 langues V1 et des translittérations ne montre aucun caractère manquant (carré vide).
- **EX-22** — Dates et nombres suivent le format de la langue choisie (Ex.02 §4).
  Réussi quand : une même date s'affiche selon le format CLDR de chaque langue V1.
- **EX-23** — Aucun libellé d'interface n'est écrit en dur dans les composants ; les traductions sont dans des fichiers séparés et versionnés (Ex.02 §11).
  Réussi quand : un contrôle automatique du code ne trouve aucun texte visible écrit en dur hors fichiers de traduction.

### 4.4 Trois préférences de langue indépendantes

- **EX-24** — Le système gère trois réglages distincts : langue de l'interface, langue du rapport, langues de recherche documentaire (choix multiple) (Ex.02 §5).
  Réussi quand : les trois réglages existent et sont enregistrés séparément.
- **EX-25** — Ces réglages sont indépendants : en changer un ne modifie pas les deux autres (Ex.02 §5).
  Réussi quand : le scénario d'Ex.02 §5 (interface français, rapport français, recherche arabe + anglais + français + ourdou) est enregistrable, puis changer l'interface en anglais laisse le rapport en français et la recherche inchangée.
- **EX-26** — Valeurs initiales : langue du rapport = langue de l'interface ; langues de recherche = arabe + langue de l'interface (H-03).
  Réussi quand : un nouvel utilisateur qui choisit l'interface en turc a le rapport en turc et la recherche en arabe + turc, modifiables ensuite.
- **EX-27** — Changer la langue de l'interface ne traduit ni ne remplace jamais le texte original d'une source (Ex.02 §5).
  Réussi quand : après changement de langue, le texte arabe original d'un hadith affiché est inchangé.

### 4.5 Texte original, traductions et provenance

- **EX-28** — Pour chaque hadith, sont stockés séparément : texte arabe original, variantes arabes, traductions, langue de chaque traduction, traducteur ou organisme, source, édition ou version, droits de réutilisation, état de vérification (Ex.02 §7).
  Réussi quand : le modèle de données a un champ distinct pour chacun de ces 9 éléments et une traduction ne peut pas être enregistrée dans le champ « texte original ».
- **EX-29** — Chaque traduction porte un type parmi : traduction humaine publiée, traduction humaine validée, traduction automatique, traduction automatique relue par un spécialiste ; un contenu non traduit est marqué « original non traduit » (Ex.03 §9).
  Réussi quand : aucune traduction enregistrée n'a un type vide.
- **EX-30** — Une traduction générée par IA est clairement étiquetée comme telle partout où elle apparaît (écran, rapport, export PDF) et n'est jamais présentée comme officielle, publiée ou originale (Ex.02 §7).
  Réussi quand : un test affiche une traduction IA dans chaque format de sortie et trouve l'étiquette « traduction générée par IA » à chaque fois.
- **EX-31** — Sans traduction fiable, l'application affiche le texte arabe et signale l'absence de traduction vérifiée ; une traduction provisoire éventuelle est affichée à part, avec un avertissement explicite (Ex.02 §7).
  Réussi quand : pour un hadith sans traduction vérifiée dans la langue choisie, le message d'absence et l'avertissement sont visibles.
- **EX-32** — Les citations originales sont affichées à côté des traductions ; une traduction n'est jamais présentée comme une citation arabe littérale (Ex.01 §8, Ex.02 §8).
  Réussi quand : dans un rapport, chaque traduction est visuellement distincte de l'original et accompagnée de celui-ci.
- **EX-33** — Chaque preuve indique sa langue et sa provenance ; les références restent dans leur langue d'origine et restent accessibles quelle que soit la langue de l'interface (Ex.02 §8).
  Réussi quand : une même référence est visible et identique dans les 8 langues d'interface.
- **EX-34** — Une traduction ou un texte similaire dans une autre langue ne suffit jamais à déclarer que deux textes sont le même hadith (Ex.02 §8).
  Réussi quand : le système ne fusionne aucun résultat sur la seule base d'une correspondance de traduction ; ces cas sont présentés comme « similarité ».

### 4.6 Dictionnaire terminologique

- **EX-35** — Un dictionnaire terminologique unique, commun à tous les agents et écrans, contient les 13 champs d'Ex.01 §9 (identifiant, terme français, terme anglais, terme arabe original, translittération normalisée, variantes de translittération, définition française, définition anglaise, domaine, références, termes à ne pas confondre, notes de validation, version).
  Réussi quand : le schéma du dictionnaire contient ces 13 champs.
- **EX-36** — Le dictionnaire est une donnée séparée et versionnée : on l'enrichit ou on le corrige sans modifier le code des agents (Ex.01 §9).
  Réussi quand : corriger une définition dans le dictionnaire change l'affichage sans aucune modification de code.
- **EX-37** — Les agents et l'interface tirent les termes techniques du dictionnaire, jamais de leurs propres traductions (Ex.01 §9).
  Réussi quand : un contrôle ne trouve aucun terme technique traduit en dur hors du dictionnaire.
- **EX-38** — Le dictionnaire accepte, pour toute langue du catalogue, un terme et une définition avec un état de validation (H-06).
  Réussi quand : on peut ajouter le terme espagnol de l'exemple d'Ex.02 §6 avec l'état « non validé » sans changer le schéma.
- **EX-39** — Format d'affichage obligatoire à la première apparition d'un terme technique dans chaque section : en français « Terme français (terme arabe — translittération) : définition accessible » ; en anglais « English term (Arabic term — transliteration): accessible definition » (Ex.01 §1, §2). Exemple d'Ex.02 §6 : « Hadith authentique (حديث صحيح — ḥadīth ṣaḥīḥ) ». S'applique à l'interface, aux rapports, aux réponses des agents, aux tableaux, aux notifications, aux exports PDF et aux documents de validation humaine.
  Réussi quand : dans un rapport de test, chaque terme du dictionnaire suit ce format à sa première apparition dans chaque section.
- **EX-40** — Dans les tableaux et interfaces compactes, l'explication peut passer dans une infobulle, une fiche ou un panneau d'aide, mais le terme arabe et sa translittération restent accessibles (Ex.01 §8).
  Réussi quand : dans un tableau, le survol ou le clic sur un terme affiche l'arabe, la translittération et la définition.
- **EX-41** — L'arabe est affiché dans son écriture originale, jamais remplacé par la translittération ; une seule norme de translittération est utilisée partout, les graphies alternatives étant gardées dans les métadonnées de recherche (Ex.01 §2 ; norme : H-04).
  Réussi quand : chaque terme du dictionnaire a exactement une translittération normalisée, et les variantes sont dans un champ distinct.
- **EX-42** — Contenu initial : les termes des sections 3 à 7 d'Ex.01 sont chargés tels quels (arabe et translittération recopiés), marqués « résumé, à valider par un spécialiste », car Ex.01 §4 précise que ces définitions sont des résumés.
  Réussi quand : chaque terme d'Ex.01 §3 à §7 est présent, identique caractère par caractère à la source, avec la marque « à valider ».
- **EX-43** — Catégories d'authenticité (Ex.01 §3) : toujours afficher terme local + arabe + translittération ; « Non déterminé » (غير محدد — ghayr muḥaddad) est présenté comme un état de conclusion de l'application, pas comme une catégorie classique ; les équivalents anglais ambigus (« good », « fair ») sont accompagnés d'une explication.
  Réussi quand : l'écran d'un résultat « non déterminé » porte la mention « état de conclusion de l'application » ; « Good / fair » est suivi d'une explication.
- **EX-44** — Les nuances de prudence d'Ex.01 sont respectées : les 5 sens du mot « critique » sont distingués (§7) ; une appréciation sur un transmetteur n'est pas transformée en verdict, l'évaluateur, la formulation originale et la référence étant cités s'ils sont disponibles (§5) ; une variante n'est pas présentée comme renforçant nécessairement un hadith (§6) ; un désaccord entre spécialistes est documenté, pas effacé (§7).
  Réussi quand : la relecture d'un échantillon de rapports par un validateur ne relève aucun manquement à ces 4 règles.

### 4.7 Contrôle qualité terminologique et des traductions

- **EX-45** — Les traductions d'interface manquantes sont détectées automatiquement, et la cohérence des fichiers de traduction est contrôlée (Ex.02 §11).
  Réussi quand : un test échoue si une clé existe dans une langue active et manque dans une autre, et la liste des clés manquantes est produite.
- **EX-46** — Avant publication d'un rapport, un contrôle vérifie les 8 points d'Ex.01 §10. Contrôles automatiques au minimum : présence de l'arabe pour les termes du dictionnaire ; translittération identique à celle du dictionnaire pour le terme arabe affiché ; provenance présente pour chaque traduction ; absence de doublons dus aux variantes. Les autres points (sens scientifique, confusion avec les catégories juridiques, distinction texte / chaîne / transmetteur, compréhension par un non-arabophone) sont vérifiés par l'agent de contrôle et signalés en cas de doute (H-07).
  Réussi quand : un rapport de test volontairement fautif (arabe absent, mauvaise translittération, traduction sans provenance) est bloqué avec la liste des fautes.
- **EX-47** — En cas de doute terminologique, l'agent signale l'incertitude dans le rapport et crée une demande de validation humaine (Ex.01 §10).
  Réussi quand : un terme absent du dictionnaire dans un rapport déclenche une mention d'incertitude et une demande de validation enregistrée.
- **EX-48** — Une traduction technique d'un terme dans une langue ne passe à l'état « validé » qu'après validation par une personne compétente ; aucune traduction automatique de terme spécialisé n'est utilisée sans contrôle (Ex.02 §6).
  Réussi quand : l'état « validé » ne peut être posé que par un compte ayant le rôle de validateur, avec nom et date enregistrés.
- **EX-49** — Aucune traduction officielle ni validation inexistante n'est inventée (Ex.03 §9).
  Réussi quand : toute traduction affichée « publiée » ou « validée » a une source ou un validateur enregistré ; sinon le statut est refusé.

### 4.8 Recherche multilingue

- **EX-50** — Le moteur propose les 9 modes d'Ex.02 §9 : exacte, approximative, par fragment, à partir d'une traduction, par translittération, par référence bibliographique, par transmetteur, par collection, comparaison des variantes entre langues.
  Réussi quand : un test par mode renvoie le résultat attendu sur un jeu d'essai.
- **EX-51** — Une question peut être posée dans toute langue active ; elle est normalisée sans perdre le texte d'origine (Ex.02 §8).
  Réussi quand : la requête originale est conservée et visible à côté de sa forme normalisée.
- **EX-52** — La normalisation est propre à chaque écriture et ne supprime pas les distinctions linguistiques utiles (Ex.02 §9). Les règles précises par écriture sont à valider par un spécialiste (H-08).
  Réussi quand : les règles de normalisation sont documentées par écriture et validées avant activation.
- **EX-53** — Les translittérations et variantes orthographiques sont reconnues, via les variantes du dictionnaire (Ex.02 §8, Ex.01 §2).
  Réussi quand : une recherche avec une variante de translittération enregistrée trouve le même terme que la translittération normalisée, sans doublon.
- **EX-54** — La recherche porte sur l'arabe et sur les langues de recherche documentaire choisies, en priorité dans la langue d'origine de la source (Ex.02 §8 ; H-03).
  Réussi quand : avec recherche « arabe + français », aucun résultat ne vient d'une autre langue, et une source arabe est trouvée via son texte arabe.
- **EX-55** — Chaque correspondance indique son origine : texte arabe original, traduction publiée, traduction générée ou simple similarité textuelle (Ex.02 §9).
  Réussi quand : chaque résultat affiche l'une de ces 4 étiquettes.
- **EX-56** — Le rapport est produit dans la langue du rapport choisie, quelle que soit la langue de la question (Ex.02 §8).
  Réussi quand : une question en ourdou avec rapport en français produit un rapport en français.

### 4.9 Niveaux de prise en charge

- **EX-57** — Pour chaque langue ou variante, les 8 niveaux d'Ex.03 §7 sont enregistrés séparément : identifiée, affichable, interface disponible, recherche disponible, traduction automatique disponible, contenu documentaire disponible, contenu spécialisé vérifié, validation humaine disponible.
  Réussi quand : chaque entrée du catalogue a ces 8 indicateurs, chacun modifiable seul.
- **EX-58** — L'application affiche clairement, pour chaque langue, si l'interface est disponible et si les ressources documentaires sont réellement suffisantes, en reprenant les 3 niveaux publics d'Ex.02 §10 (interface disponible, documentation partiellement disponible, documentation spécialisée vérifiée).
  Réussi quand : une page ou le sélecteur montre ce niveau pour chacune des 8 langues V1.
- **EX-59** — Une langue n'est jamais présentée comme entièrement prise en charge si seule son étiquette existe (Ex.03 §7) ; une interface traduite n'implique pas que les sources existent dans cette langue (Ex.02 §10).
  Réussi quand : une langue au seul niveau « identifiée » n'affiche aucune mention de prise en charge.
- **EX-60** — Traduction manquante : la langue de remplacement prévue est utilisée et l'utilisateur en est averti (Ex.02 §4 ; chaîne de remplacement : H-10).
  Réussi quand : en supprimant une clé de test en malais, le libellé s'affiche dans la langue de remplacement avec une marque visible.
- **EX-61** — Aucune langue des signes ni représentation particulière n'est annoncée disponible sans ressource adaptée ; le catalogue peut toutefois enregistrer ce type de langue (Ex.03 §5).
  Réussi quand : le catalogue accepte une entrée de type « langue des signes » avec tous ses niveaux à « non » sauf « identifiée ».

### 4.10 Tests et documentation

- **EX-62** — Des tests automatisés couvrent : changement de langue, conservation de l'état (EX-13), RTL/LTR, textes mixtes, traductions manquantes, caractères combinés, une langue peu représentée, ajout d'une langue au catalogue sans rebuild (Ex.02 §11, Ex.03 §8).
  Réussi quand : ces tests existent, tournent automatiquement et passent.
- **EX-63** — Une documentation explique comment ajouter une nouvelle langue ou variante sans reconstruire l'application (Ex.03 §10).
  Réussi quand : une personne qui suit la documentation ajoute une langue de test du début à la fin sans aide.

## 5. Les 12 critères d'acceptation d'Ex.02 (repris tels quels)

| # | Critère (texte d'Ex.02 §12) | Couvert par |
|---|---|---|
| 1 | L'arabe est disponible et défini comme langue initiale. | EX-06, EX-10, EX-17 |
| 2 | L'utilisateur peut changer de langue à tout moment. | EX-11, EX-13, EX-14 |
| 3 | L'anglais, le français, l'espagnol, l'ourdou, l'indonésien, le malais et le turc sont prévus pour le lancement. | EX-06 |
| 4 | Les autres langues peuvent être ajoutées sans refonte de l'application. | EX-01, EX-02, EX-03, EX-07, EX-23, EX-63 |
| 5 | L'interface RTL/LTR fonctionne correctement. | EX-09, EX-18, EX-19, EX-20, EX-21 |
| 6 | Les textes originaux et leurs traductions sont séparés. | EX-28, EX-29, EX-32 |
| 7 | La langue de l'interface est indépendante de la langue du rapport et de celle de la recherche. | EX-24, EX-25, EX-26, EX-27 |
| 8 | Les termes techniques conservent leur équivalent arabe. | EX-35, EX-39, EX-40, EX-41, EX-46 |
| 9 | Les traductions IA sont identifiées comme telles. | EX-29, EX-30, EX-55 |
| 10 | Les références restent accessibles quelle que soit la langue de l'interface. | EX-33 |
| 11 | Les traductions manquantes sont signalées honnêtement. | EX-31, EX-45, EX-58, EX-59, EX-60 |
| 12 | Des tests automatisés vérifient les fonctions multilingues. | EX-45, EX-62 |

## 6. Hypothèses (prises en autopilote, réversibles)

- **H-01** — Pas de détection de la langue du navigateur en V1 : l'arabe s'ouvre toujours en premier. Ex.02 §3 l'autorise plus tard si la préférence de l'utilisateur prévaut.
- **H-02** — Visiteur non connecté : préférence gardée dans le stockage local du navigateur (pas de cookie de suivi). À confirmer selon les « mécanismes de stockage autorisés », non définis à ce jour.
- **H-03** — Valeurs initiales : rapport = langue d'interface ; recherche documentaire = arabe + langue d'interface. L'arabe reste toujours inclus dans la recherche, car Ex.02 §8 demande de chercher « dans les sources arabes et dans les langues autorisées ».
- **H-04** — La norme de translittération n'est pas nommée dans les exigences (Ex.01 §2 dit « une norme reconnue »). Le choix revient à l'architecte, avec un spécialiste ; il doit être compatible avec les translittérations déjà écrites dans Ex.01 (ʿ, ḥ, ṣ, ḍ, ā, ī, ū…).
- **H-05** — Aucune variante régionale d'interface activée en V1 ; une seule version par langue de lancement.
- **H-06** — Ex.01 ne prévoit que le français et l'anglais, Ex.02 demande plusieurs langues. Hypothèse : Ex.02 élargit Ex.01. En V1, définitions validables en français et anglais ; pour les 6 autres langues, le terme est affiché avec l'arabe et la translittération, et la définition passe par la langue de remplacement avec une mention « traduction du terme non validée ».
- **H-07** — Parmi les 8 points du contrôle qualité d'Ex.01 §10, ceux qui touchent au sens scientifique ne sont pas entièrement automatisables : l'agent de contrôle signale, un humain tranche.
- **H-08** — Aucune règle de normalisation par écriture n'est écrite ici (pour ne rien inventer) : elles seront proposées par l'architecte et validées par un spécialiste.
- **H-09** — Il existe un rôle « gestionnaire de contenu » et un rôle « validateur » ; leurs titulaires ne sont pas connus.
- **H-10** — Chaîne de remplacement en cas de traduction manquante : variante régionale → langue parente → anglais → arabe, toujours avec une marque visible. L'anglais passe avant l'arabe parce qu'Ex.02 §1 interdit de supposer que l'utilisateur lit l'arabe. Modifiable par langue dans le catalogue.
- **H-11** — Quand Ex.01 (« translittération à chaque première apparition ») et Ex.02 §6 (« lorsque celle-ci aide à la compréhension ») divergent, on applique la règle la plus stricte, celle d'Ex.01.
- **H-12** — Ce document est placé dans docs/conception/ comme demandé par Jarvis, et non dans docs/projet/cahier-des-charges.md (emplacement par défaut de la fiche).

## 7. Risques

- **R-01 — Pas de validateurs humains identifiés.** Beaucoup d'exigences (EX-42, EX-44, EX-47, EX-48, EX-52) dépendent de personnes compétentes. Sans elles, le dictionnaire reste « à valider » et les langues restent au niveau bas. Risque majeur.
- **R-02 — Droits des traductions.** Les traductions publiées ont des droits de réutilisation (Ex.02 §7) ; aucune source ni licence n'est encore identifiée. Risque de ne pas pouvoir afficher de traduction vérifiée au lancement.
- **R-03 — Traductions IA présentées à tort.** Une étiquette oubliée dans un format (PDF, notification) crée une fausse attribution. Parade : EX-30 testé dans chaque format.
- **R-04 — Affichage mixte RTL/LTR.** Les textes mêlant arabe, latin, chiffres et URL sont une source fréquente de défauts d'affichage. Parade : EX-19 et EX-62.
- **R-05 — Ambition « toutes les langues du monde » (Ex.03).** Risque de dispersion. Parade : architecture universelle, mais seulement 8 langues actives en V1, et niveaux affichés honnêtement (Ex.03 §10).
- **R-06 — Contradictions entre exigences** (H-06, H-11 ; liste d'Ex.02 contre catalogue dynamique d'Ex.03). Les choix faits ici doivent être confirmés par le patron.
- **R-07 — Doublons de recherche** dus aux variantes de translittération et aux termes identiques dans deux catégories (ex. ضعيف — ḍaʿīf apparaît à la fois comme catégorie d'authenticité, Ex.01 §3, et comme qualification de transmetteur, Ex.01 §5). Parade : champ « termes à ne pas confondre » et EX-46.
- **R-08 — Polices et écritures.** Les 8 langues V1 couvrent l'écriture arabe (arabe, ourdou) et latine ; le choix des polices n'est pas fait et peut alourdir les pages. À traiter par l'architecte.
- **R-09 — Stack non choisie.** La technologie d'internationalisation doit être compatible avec une architecture qui n'existe pas encore (Ex.02 §11).

## 8. Questions ouvertes pour le patron

1. Qui sont les validateurs humains (spécialistes hadith, traducteurs par langue) ?
2. Quelles traductions publiées peut-on utiliser, avec quels droits ?
3. Faut-il confirmer les hypothèses H-02, H-03, H-06 et H-10 ?
