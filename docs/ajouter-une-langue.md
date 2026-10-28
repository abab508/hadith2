# Ajouter une langue

Ce guide suit le code du projet au 28 octobre 2026. Il s'adresse à une personne qui débute. Une langue ajoutée au menu n'est pas forcément une langue dont les contenus sont vérifiés.

Les règles de référence sont dans [les conventions](memoire/conventions.md), [la structure des dossiers](conception/structure-dossiers.md) et [le modèle de langue](conception/donnees/modele-langue.md). Les contrôles réellement présents sont décrits ci-dessous.

## 1. Préparer les informations

Réunissez le nom de la langue dans son écriture, son code, sa direction de lecture et sa police. Faites confirmer ces informations par une personne compétente. N'inventez pas de code officiel.

Une entrée correspond à une langue ou une variante, dans une seule écriture. Pour deux écritures, préparez deux entrées.

Le code de langue est appelé `tag` dans les fichiers. Il sert aussi dans l'adresse du site et le nom du fichier de traduction. Par exemple, `fr` correspond à `messages/fr.json` et à `/fr`.

Pour une variante sans code officiel, le projet prévoit un identifiant privé comme `ar-x-nom`. Chaque segment après `-x-` contient de 1 à 8 lettres minuscules ou chiffres. Faites d'abord confirmer qu'aucun code officiel ne convient. N'ajoutez pas une variante réelle à partir de cet exemple.

## 2. Ajouter l'entrée dans le catalogue

Ouvrez `data/langues/catalogue.json`. Ajoutez un objet dans la liste `entrees`. Gardez les entrées existantes et les textes arabes originaux.

Le schéma utilisé est `src/donnees/schemas/langue.ts`. Il refuse les champs inconnus. Respectez les noms et la casse des champs.

| Champ | Que renseigner |
|---|---|
| `tag` | Un code unique. Le schéma accepte 2 ou 3 lettres minuscules, puis des segments de 1 à 8 lettres ou chiffres séparés par `-`. Cette vérification de forme ne prouve pas que le code existe officiellement. |
| `codeOfficiel` | `true` pour un code officiel ; `false` si le tag contient exactement `-x-`. Le schéma vérifie cette correspondance. |
| `type` | `"langue"` ou `"variante"`. |
| `langueDeBase` | Les 2 ou 3 lettres minuscules placées avant le premier `-` du tag. Le schéma vérifie leur égalité. |
| `varianteDe` | Obligatoire pour `"variante"`. Mettez le tag d'une entrée déjà présente. Omettez ce champ pour `"langue"`. |
| `nomNatif` | Le nom non vide dans l'écriture de la langue. Faites-le confirmer par un locuteur et conservez la forme Unicode NFC, c'est-à-dire des caractères composés de façon uniforme. |
| `nomsTraduits` | Objet facultatif : une clé de langue et un nom traduit, par exemple `{"fr": "anglais"}`. Les valeurs doivent être non vides. Utilisez des tags du catalogue. Pour un identifiant privé, le modèle exige au moins les noms en `ar`, `fr` et `en` ; le schéma ne l'impose pas encore. |
| `direction` | `"rtl"` pour une lecture de droite à gauche ; `"ltr"` pour une lecture de gauche à droite. |
| `ecriture` | Le code de l'écriture : quatre lettres, la première en majuscule, par exemple `"Arab"` ou `"Latn"`. Vérifiez vous-même que la direction lui correspond. |
| `regions` | Une liste, éventuellement vide. Chaque région comporte deux lettres majuscules, ou trois chiffres, par exemple `["CA"]`. |
| `niveaux` | Les huit valeurs décrites à l'étape suivante. Aucune ne peut manquer. |
| `statut` | `"active"`, `"experimentale"` ou `"desactivee"`. Une nouvelle traduction non relue doit être présentée honnêtement. |
| `remplacements` | Liste ordonnée des tags à utiliser si une traduction manque. Ces tags doivent déjà exister. Ne mettez pas le tag de l'entrée elle-même. |
| `police.famille` | Nom non vide de la police, identique au nom déclaré dans le CSS. |
| `police.secours` | Liste facultative de noms de polices de secours, tous non vides. |
| `localeFormats` | Champ facultatif dans le schéma. Le modèle le demande pour un identifiant privé : renseignez alors un code officiel pour les dates et nombres. Attention : le code actuel ne lit pas encore ce champ. Faites vérifier le résultat à l'écran. |
| `notes` | Texte facultatif pour expliquer une particularité ou une limite. |

Le catalogue vérifie aussi l'absence de tags en double et l'existence de `langueParDefaut`, des remplacements et des parents de variantes.

Gardez `langueParDefaut: "ar"`. Augmentez `version` à chaque modification. Sa forme est `X.Y.Z`, avec trois nombres. La version lue pour ce guide est `0.3.0` ; un ajout pourrait par exemple passer à `0.4.0`. Mettez aussi `miseAJour` à la date du changement, au format `AAAA-MM-JJ`. Ne stockez aucun pourcentage de traduction dans ce fichier.

Les remplacements ne sont pas suivis de proche en proche. Le code lit seulement `[tag, ...remplacements, langueParDefaut]`, puis retire les doublons. Si vous voulez deux langues de secours, indiquez les deux dans l'ordre voulu. Le modèle demande d'éviter les boucles entre entrées ; le schéma actuel ne les recherche pas.

## 3. Déclarer les niveaux avec honnêteté

Tous les niveaux sont des booléens : `true` signifie oui, `false` signifie non.

| Niveau | Quand mettre `true` |
|---|---|
| `identifiee` | La langue est bien identifiée dans le catalogue. |
| `affichable` | Ses caractères sont lisibles avec la police prévue, après vérification à l'écran. |
| `interface` | Les libellés de l'interface sont traduits dans `messages/<tag>.json`. `affichable` doit aussi être `true`. |
| `recherche` | Une recherche adaptée à cette langue existe et fonctionne. La présence dans une liste de paramètres ne suffit pas. |
| `traductionAuto` | Un service de traduction automatique existe réellement pour cette langue. Une interface traduite par IA ne suffit pas. |
| `contenuDocumentaire` | De vraies sources ou traductions documentaires existent dans les données. |
| `contenuVerifie` | Ces ressources documentaires ont été contrôlées par des personnes compétentes. Il faut aussi `contenuDocumentaire: true`. |
| `validationHumaine` | Un réviseur réel est disponible pour cette langue. |

Sans preuve, gardez `false`. Le schéma vérifie actuellement la dépendance `interface` → `affichable`. Les autres preuves et dépendances restent à vérifier par une personne.

Le site crée une adresse pour une langue si `statut` n'est pas `"desactivee"` et si `niveaux.interface` vaut `true`. Cela inclut les langues expérimentales. Une entrée désactivée est cachée dans le sélecteur et dans la page des langues. Une entrée visible sans interface apparaît comme indisponible dans le sélecteur.

## 4. Créer les libellés de l'interface

Copiez la structure de `messages/ar.json` dans `messages/<tag>.json`. Remplacez `<tag>` par le code exact du catalogue. Le fichier arabe est la référence des clés : ne modifiez pas ses textes originaux pour ajouter une langue.

Traduisez toutes ses clés, y compris les messages de navigation, les paramètres et les avertissements. Gardez les mêmes objets et noms de clés. N'ajoutez pas une clé propre à cette langue. Gardez les paramètres entre accolades, comme `{langue}`. Conservez aussi le sens des formes de pluriel. Ne remplacez pas une traduction manquante par une chaîne vide.

En tête du fichier, renseignez les informations de provenance :

```json
"_meta": {
  "origine": "ia",
  "relu": false
}
```

Ce bloc seul est un extrait : le fichier complet doit aussi contenir toutes les clés de l'interface. Une traduction écrite par IA reste indiquée comme telle. Ne déclarez pas une relecture humaine qui n'a pas eu lieu. Les conventions prévoient aussi `"origine": "humaine"`, mais le test actuel de `tests/unitaires/messages.test.ts` impose encore exactement `{"origine":"ia","relu":false}` à chaque fichier. Une vraie relecture ou une traduction entièrement humaine demandera donc une adaptation de ce test par le développeur.

À l'affichage, une clé absente peut être remplacée par une langue de secours. Un avertissement apparaît alors. Une clé absente de toutes les langues apparaît entre crochets. Cela permet de repérer un manque ; cela ne remplace pas le travail de traduction. Les tests actuels exigent toutes les clés de `ar.json` dans chaque fichier, sans clé supplémentaire. `_meta` est exclu de cette comparaison.

Les termes techniques du glossaire ne vont pas dans ce fichier. Pour les traduire, suivez [le guide des termes](ajouter-un-terme.md). Cela ne permet pas de déclarer automatiquement les contenus documentaires comme vérifiés.

## 5. Vérifier la police

Les familles déjà présentes sont `Noto Naskh Arabic`, `Noto Nastaliq Urdu` et `Noto Sans`. Leurs fichiers se trouvent dans `public/polices/`. Leurs déclarations se trouvent dans `src/styles/polices.css`.

Essayez les lettres propres à la langue. Vérifiez aussi les accents, les signes et le texte en gras. Les fichiers actuels couvrent les graisses 400 et 700. La présence d'un nom de police dans le catalogue ne prouve pas qu'elle contient tous les caractères.

Si la police convient, utilisez son nom exact dans `police.famille`. Le site lit cette valeur dans le catalogue. Aucune liste de langues du code de l'application n'est à compléter.

Si une nouvelle police est nécessaire, faites valider son choix par le patron avant son ajout. Placez les fichiers `.woff2` et leur licence dans `public/polices/<Famille>/`. Ajoutez les blocs `@font-face` correspondants dans `src/styles/polices.css`. Vérifiez le nom de famille, les chemins, les graisses et les caractères couverts par `unicode-range`. Une plage mal déclarée peut empêcher l'utilisation d'une lettre pourtant présente dans le fichier. Cette opération change des fichiers de police et du CSS, pas un fichier `.ts` ou `.tsx`.

## 6. Faire adapter les tests qui figent les langues

L'application lit le catalogue pour le routage, les noms, la direction et la police. Il n'y a pas de langue à ajouter à la main dans `src/proxy.ts`, `src/i18n/routing.ts` ou un composant.

Il existe toutefois une limite actuelle à la règle « ajouter une langue ne modifie aucun `.ts`/`.tsx` » :

- `tests/unitaires/catalogue.test.ts` attend exactement les huit tags `ar`, `fr`, `en`, `ur`, `es`, `id`, `ms`, `tr`, dans cet ordre. Ajouter une neuvième langue avec interface rendra cette attente fausse.
- `tests/unitaires/messages.test.ts` attend exactement huit fichiers de messages. Créer un neuvième fichier rendra cette attente fausse, même si l'interface n'est pas encore activée.

Ces fichiers sont des `.ts`. Faites adapter ces attentes par le développeur ; ne retirez pas les contrôles d'égalité des clés ou de validité du catalogue. Les autres listes de ce test de catalogue décrivent des exemples de lancement. Elles ne sont pas toutes à étendre à chaque ajout. Une nouvelle entrée dans `nomsTraduits` de ces exemples peut aussi demander une adaptation de leur attente sur les clés `ar`, `en`, `fr`.

Le test navigateur `tests/navigateur/langues.spec.ts` parcourt déjà les langues avec interface depuis le catalogue. Sa vérification des polices contient toutefois des exemples fixes. Si vous ajoutez une écriture ou une police, demandez au développeur d'y ajouter un échantillon utile de la nouvelle langue.

## 7. Lancer les contrôles

À la racine du projet, lancez les commandes séparément :

```text
npm test
npm run controle
npm run typecheck
npm run build
npm run test:navigateur
```

`npm test` lance les tests unitaires et les contrôles du dossier `scripts/`. Il vérifie notamment le catalogue et les clés des fichiers de messages. `npm run controle` ne lance actuellement que les contrôles du dictionnaire : à lui seul, il ne vérifie pas la traduction de l'interface. `npm run typecheck` vérifie les types du code. `npm run build` prépare le site et les adresses des langues. `npm run test:navigateur` vérifie des parcours dans un navigateur.

Ne remplacez pas un résultat en échec par « réussi ». Copiez le message utile et demandez une correction. N'installez aucun paquet pour contourner un blocage. Dans le bac à sable MIS-009, le build et Playwright sont laissés au superviseur à cause du blocage SWC signalé ; cela ne vaut pas validation de ces deux étapes.

## 8. Vérifier le résultat à l'écran

Après un redémarrage du serveur de développement, ouvrez `/<tag>`, puis `/<tag>/langues`. Vous pouvez démarrer le site local avec `npm run dev`.

La page « Langues et disponibilités » affiche le nombre de clés présentes et le pourcentage calculé pour chaque langue visible. Le calcul compare les clés propres au fichier avec `ar.json`, avant le recours aux langues de secours. Il ignore `_meta` et les clés supplémentaires. Il ne juge ni la qualité des phrases ni l'absence de chaînes vides. Un résultat de 100 % demande donc toujours une lecture humaine.

Vérifiez le nom natif, le nom traduit, le sens de lecture, la police et les niveaux affichés. Ouvrez le détail des huit niveaux. Vérifiez le sélecteur, le passage vers une autre langue, les paramètres et le glossaire. Les noms traduits viennent d'abord du catalogue ; à défaut, le site essaie le nom fourni par le navigateur, puis le nom natif.

Faites relire les textes par un locuteur. Faites confirmer les termes spécialisés par une personne compétente. Notez ce qui reste expérimental ou non relu. La mise en ligne reste une décision du patron. Ce guide n'autorise aucun déploiement.
