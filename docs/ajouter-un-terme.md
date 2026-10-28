# Ajouter ou corriger un terme du dictionnaire

Ce guide décrit le code présent dans le projet. Il concerne les entrées de la liste `termes` dans [data/termes/termes.json](../data/termes/termes.json). Les libellés techniques ne vont pas dans `messages/`.

Le contrôle de référence est [src/donnees/schemas/terme.ts](../src/donnees/schemas/terme.ts). Le modèle de conception explique les intentions dans [modele-terme.md](conception/donnees/modele-terme.md). En cas d'écart, les règles décrites ci-dessous indiquent ce que le code accepte aujourd'hui.

## 1. Préparer une modification justifiée

Cherchez d'abord le terme dans le fichier. Vérifiez son arabe, sa translittération, son domaine et ses variantes. Une autre graphie du même concept ne justifie pas une nouvelle entrée.

Pour une correction, gardez le même `id`. Il sert à retrouver le terme dans le site. Ne supprimez aucune donnée. Ne modifiez jamais un texte original arabe. Si l'original paraît erroné, faites examiner la source par un humain avant toute autre démarche.

Pour un ajout, utilisez seulement un original et des formulations fournis par une source identifiée. Ne créez aucune définition, référence, identité de spécialiste ou validation. Une traduction produite par une IA reste à faire relire. Ne présentez pas une réserve de définition comme une définition scientifique.

## 2. Mettre à jour la version du fichier

En tête du dictionnaire, les champs sont les suivants.

| Champ | Contenu et règle actuelle |
|---|---|
| `version` | Version du dictionnaire, sous la forme `X.Y.Z`. Augmentez-la à chaque modification. La valeur actuelle est `0.2.0`. Par exemple, une prochaine correction peut passer à `0.2.1`. |
| `miseAJour` | Date de la modification, sous la forme `AAAA-MM-JJ`. |
| `normeTranslitteration` | Nom de la convention suivie. La valeur actuelle est `provisoire-v0 (voir regles-translitteration.md)`. Ne la remplacez pas par le nom d'une norme supposée validée. |
| `domaines` | Liste des domaines autorisés. Elle doit contenir au moins une valeur. |
| `termes` | Liste des termes qui ont un original arabe. |
| `notionsDocumentaires` | Liste distincte de notions sans original arabe fourni. Ne leur inventez pas d'arabe. Elle a son propre schéma et ne suit pas le modèle complet de terme ci-dessous. |

Les cinq domaines actuels sont `authenticite`, `chaine`, `transmetteurs`, `texte-defauts` et `critique-sources`. Choisissez celui qui convient au sens attesté.

**Limite actuelle :** ajouter un domaine au JSON ne suffit pas à le faire apparaître dans le glossaire. La page [glossaire/page.tsx](../src/app/[locale]/glossaire/page.tsx) énumère ces cinq domaines dans `clesDomaines`. Un domaine supplémentaire demande aujourd'hui une modification de ce fichier `.tsx`, des libellés dans les huit fichiers `messages/`, et une révision du test navigateur qui attend cinq titres de domaine. Faites traiter ce cas comme une évolution du code.

## 3. Remplir les champs du terme

Tous les champs de ce tableau sont obligatoires. Les listes peuvent être vides. N'ajoutez pas de champ libre : le schéma refuse les champs inconnus.

| Champ | Comment le remplir |
|---|---|
| `id` | Identifiant unique. Utilisez des minuscules latines sans accent, des chiffres et des tirets entre les mots. Exemple existant : `al-illa`. Aucun espace ni tiret au début ou à la fin. |
| `ar` | Original arabe fourni par la source, conservé exactement. Le contrôle exige un texte non vide et un caractère dans la plage arabe. |
| `translitteration` | Graphie principale en lettres latines. Suivez la convention provisoire décrite à l'étape 4. |
| `variantesTranslitteration` | Autres graphies attestées. Pas de doublon ni de copie de la graphie principale. Utilisez `[]` s'il n'y en a pas. |
| `domaine` | Une valeur présente dans `domaines`, en tête du fichier. |
| `typeTerme` | `terme-technique` pour une notion technique ; `etat-application` pour un état de l'application. L'entrée existante `ghayr-muhaddad` utilise le second choix. |
| `langues` | Objet contenant les traductions disponibles. `fr` est obligatoire dans le code actuel. Chaque clé de langue doit exister dans `data/langues/catalogue.json`. |
| `references` | Sources réelles. Chaque référence contient `titre`, non vide. Les champs `auteur`, `edition`, `volume`, `page` et `url` sont facultatifs. N'ajoutez aucun autre champ. |
| `termesLies` | Liens vers des termes existants. Voir l'étape 5. |
| `notesValidation` | Notes réelles de spécialiste. Chaque note contient `date` au format `AAAA-MM-JJ`, `specialiste` non vide et `note` non vide. |
| `statutValidation` | État de validation du terme. Voir l'étape 6. |
| `versionTerme` | Version du dictionnaire lors de la dernière modification de cette entrée. Pour le terme ajouté ou corrigé, mettez la nouvelle `version` du fichier. Ne changez pas celle des termes inchangés. Elle ne doit jamais dépasser la version du dictionnaire. |

Le couple `ar` + `domaine` doit être unique. Le même original dans deux domaines reste possible pour deux sens distincts, avec les liens explicites décrits plus bas.

Chaque objet dans `langues` contient les champs suivants.

| Champ | Comment le remplir |
|---|---|
| `terme` | Libellé principal non vide dans cette langue. |
| `explication` | Explication non vide, tirée d'une source ou fournie par une personne compétente. N'inventez pas une définition pour remplir le champ. |
| `origine` | `humaine` ou `ia`, selon l'origine réelle du texte. Un texte créé par une IA porte `ia`. |
| `statutValidation` | Statut propre à cette traduction. Il ne remplace pas celui du terme. |
| `variantesLibelles` | Facultatif. Autres libellés attestés dans cette langue. Sans doublon et différents de `terme`. |
| `langueExplication` | Facultatif. Tag réel de la langue de l'explication si elle diffère de celle du libellé. Ce tag doit être dans le catalogue. Sans ce champ, le site considère que le libellé et l'explication ont la même langue. |

Le schéma actuel impose le français, **pas l'anglais**. Le modèle de conception mentionne encore les deux langues comme obligatoires. Des entrées réelles, comme `al-sanad`, n'ont pas d'anglais. Omettez une traduction anglaise absente plutôt que de l'inventer. Le site cherche ensuite une traduction de repli et signale ce changement de langue.

Les textes principaux et les variantes doivent être enregistrés en Unicode NFC. Cela signifie que les lettres accentuées utilisent une forme de stockage cohérente. Le contrôle détecte un écart. Ne transformez jamais l'original arabe pour faire disparaître une erreur.

## 4. Garder une translittération cohérente

Lisez [regles-translitteration.md](conception/donnees/regles-translitteration.md). La convention `provisoire-v0` reste à soumettre à un spécialiste. Elle ne constitue pas une validation savante.

Les graphies existantes utilisent notamment `ā`, `ī`, `ū`, `ṣ`, `ḍ`, `ṭ`, `ḥ`, les groupes `th`, `dh`, `sh`, `kh`, `gh`, puis `ʿ` pour le ʿayn et `ʾ` pour la hamza. L'article est écrit `al-`, et `wa-l-` après « wa ». Reprenez une graphie attestée ; ne tranchez pas seul une nouvelle difficulté.

Placez les autres graphies connues dans `variantesTranslitteration`. Elles ne remplacent pas la forme principale. Par exemple, `al-illa` garde `al-ʿilla` comme forme principale et `‘illa` comme variante.

Le contrôle calcule des formes simplifiées pour repérer les collisions. Il retire certains signes, rapproche des lettres et ignore l'article initial dans une seconde comparaison. Il ne réécrit pas le texte stocké. Le glossaire actuel n'a pas de champ de recherche : ne supposez pas qu'une variante s'y affiche ou y soit directement recherchable.

## 5. Déclarer les liens dans les deux sens

Chaque lien a exactement deux champs : `id`, qui désigne un autre terme existant, et `relation`. Les relations possibles sont `proche` et `ne-pas-confondre`.

Le terme cible doit déclarer le lien inverse avec **la même relation**. Par exemple, les données actuelles contiennent :

```json
{"id": "daif-transmetteur", "relation": "ne-pas-confondre"}
```

dans `daif-hadith`, et :

```json
{"id": "daif-hadith", "relation": "ne-pas-confondre"}
```

dans `daif-transmetteur`.

Ces deux entrées ont le même arabe et deux domaines différents. Le contrôle exige alors des liens réciproques `ne-pas-confondre`. Il exige aussi ces liens pour accepter une collision de translittération entre deux termes ; la collision reste signalée en avertissement. Un lien `proche` ne suffit pas dans ces cas. N'ajoutez pas un lien sans justification scientifique pour contourner un contrôle.

Si vous ajoutez ou corrigez un lien, mettez aussi à jour la `versionTerme` de l'entrée réciproque, puisqu'elle change.

## 6. Déclarer honnêtement la validation

Les trois valeurs possibles sont :

- `a-valider-specialiste` : une validation reste nécessaire. C'est la valeur à écrire explicitement pour une proposition non validée ; le code ne l'ajoute pas automatiquement.
- `a-corriger` : une correction est nécessaire.
- `valide-specialiste` : une validation réelle et documentée a eu lieu.

N'utilisez jamais `valide-specialiste`, pour le terme ou pour une traduction, sans **au moins une note de validation et une référence réelles**. La note doit identifier le spécialiste et ce qu'il a vérifié. Une référence seule ne prouve pas la validation. Une origine `humaine` ne la prouve pas non plus.

Le schéma impose note et référence pour un terme validé. Pour une traduction de terme produite par IA, il exige une note si elle est déclarée validée. Il ne couvre pas tous les cas de validation d'une traduction : appliquez toujours la règle plus complète ci-dessus. Ne profitez pas d'un contrôle incomplet.

## 7. Exemple complet déjà présent

Voici l'entrée `al-illa`, recopiée du dictionnaire actuel, version `0.2.0`. Ses explications viennent des exigences du projet. Ses listes de preuves sont vides et ses statuts restent donc `a-valider-specialiste`. Cet exemple n'est pas une validation du contenu. Ne le collez pas une seconde fois : son identifiant existe déjà.

```json
{
  "id": "al-illa",
  "ar": "العلة",
  "translitteration": "al-ʿilla",
  "variantesTranslitteration": ["‘illa"],
  "domaine": "texte-defauts",
  "typeTerme": "terme-technique",
  "langues": {
    "fr": {
      "terme": "Défaut caché du hadith",
      "variantesLibelles": ["Défaut caché"],
      "explication": "défaut subtil susceptible d’affecter l’évaluation d’une transmission.",
      "origine": "humaine",
      "statutValidation": "a-valider-specialiste"
    },
    "en": {
      "terme": "Hidden defect (‘illa)",
      "explication": "a subtle defect that may affect the evaluation of a hadith transmission.",
      "origine": "humaine",
      "statutValidation": "a-valider-specialiste"
    }
  },
  "references": [],
  "termesLies": [],
  "notesValidation": [],
  "statutValidation": "a-valider-specialiste",
  "versionTerme": "0.2.0"
}
```

## 8. Contrôler puis vérifier le glossaire

Depuis le dossier du projet, lancez :

```sh
npm run controle
npm test
```

`npm run controle` vérifie le schéma, les langues du catalogue, les textes NFC, les liens réciproques et les collisions. Lisez aussi les avertissements. Il ne juge pas l'exactitude scientifique d'une définition. Si une commande échoue, gardez son message et expliquez la cause. Ne déclarez pas le contrôle réussi.

**Tests à réviser aujourd'hui :** [tests/unitaires/termes.test.ts](../tests/unitaires/termes.test.ts) fixe la version à `0.2.0`, le nombre de termes à `38`, les sources admises aux exigences actuelles, les origines à `humaine`, les statuts à `a-valider-specialiste` et les listes de preuves à vide. Un ajout, une nouvelle source ou une validation réelle peut donc demander de modifier ce fichier `.ts`. Faites adapter ces attentes à la modification justifiée, sans retirer les contrôles qui protègent les originaux et les preuves. La modification du JSON ne suffit pas à garantir que tous les tests passent.

Pour voir le résultat local, lancez `npm run dev`, puis ouvrez `/fr/glossaire#<id>` et `/ar/glossaire#<id>`. Remplacez `<id>` par l'identifiant, par exemple `/fr/glossaire#al-illa`.

Vérifiez le bon domaine, le libellé, l'arabe conservé, la translittération et l'explication. Vérifiez le sens de lecture en arabe et le signalement d'une langue de repli. Le badge reste visible si le terme ou la traduction affichée n'est pas validé. Les variantes, liens, références et notes ne sont pas tous exposés par la page actuelle : vérifiez aussi le JSON et les contrôles.

Avant toute livraison, exécutez aussi `npm run build` et `npm run test:navigateur` dans un environnement qui les permet. Pour MIS-009, le superviseur les exécute : le bac à sable bloque SWC. La mise en ligne reste une décision du patron.
