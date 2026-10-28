# Modèle de données — Langue (catalogue linguistique)

Auteur : architecte — 2026-10-28
Sources : docs/conception/choix-stack.md §2.1 (base commune) ; exigences 02 §4, 03 §3, §7, §8.
État : proposition, indépendante de la stack. Fichier cible : `data/langues/catalogue.json`.

---

## 1. Enveloppe du fichier

```json
{
  "version": "0.1.0",
  "miseAJour": "2026-10-28",
  "langueParDefaut": "ar",
  "entrees": [ ... ]
}
```

| Champ | Type | Obligatoire | Exemple | Règle de validation |
|---|---|---|---|---|
| `version` | chaîne | oui | `"0.1.0"` | Forme `X.Y.Z`. Augmente à chaque modification du catalogue. |
| `miseAJour` | chaîne (date) | oui | `"2026-10-28"` | Format `AAAA-MM-JJ`. |
| `langueParDefaut` | chaîne | oui | `"ar"` | Doit être le `tag` d'une entrée du catalogue. Valeur fixée : `ar` (03 §6). |
| `entrees` | liste d'objets | oui | voir §2 | Au moins une entrée. `tag` unique dans la liste. |

## 2. Une entrée (langue ou variante)

Principe : **une entrée = un tag BCP 47 = une seule écriture**. Une langue écrite dans plusieurs systèmes (03 §8) a plusieurs entrées, reliées par `langueDeBase`.

| Champ | Type | Obligatoire | Exemple | Règle de validation |
|---|---|---|---|---|
| `tag` | chaîne | oui | `"ur"`, `"fr-CA"`, `"ar-x-maghreb"` | Tag BCP 47 bien formé. Unique dans le catalogue. Voir §3 pour la partie `-x-`. |
| `codeOfficiel` | booléen | oui | `true` | `false` si et seulement si le tag contient `-x-`. |
| `type` | énumération | oui | `"langue"` | `langue` ou `variante`. Un dialecte est une `variante`, jamais une `langue` distincte (03 §3). |
| `langueDeBase` | chaîne | oui | `"ar"` | Sous-étiquette de langue principale (1re partie du tag). Doit égaler le début du `tag`. |
| `varianteDe` | chaîne | si `type` = `variante` | `"ar"` | `tag` d'une autre entrée du catalogue. Interdit si `type` = `langue`. |
| `nomNatif` | chaîne | oui | `"اردو"` | Non vide, dans l'écriture de la langue (Unicode, forme NFC). Jamais déduit uniquement de `Intl` (choix-stack §2.2). |
| `nomsTraduits` | objet `{tag: nom}` | voir règle | `{"fr": "ourdou", "en": "Urdu"}` | Facultatif si `codeOfficiel` = `true` (appoint : `Intl.DisplayNames`). **Obligatoire avec au moins `ar`, `fr`, `en`** si `codeOfficiel` = `false` (aucune base CLDR ne connaît un identifiant `-x-`). Chaque clé = `tag` du catalogue. |
| `direction` | énumération | oui | `"rtl"` | `rtl` ou `ltr`. Doit être cohérente avec `ecriture` (ex. `Arab` → `rtl`). |
| `ecriture` | chaîne | oui | `"Arab"` | Code ISO 15924 : 4 lettres, 1re majuscule (`Arab`, `Latn`…). Une seule valeur par entrée. |
| `regions` | liste de chaînes | oui (peut être vide) | `["PK", "IN"]` | Codes ISO 3166-1 alpha-2 ou codes régionaux ONU M.49 (3 chiffres). Sert au filtrage par région (03 §6). |
| `niveaux` | objet | oui | voir §4 | Les 8 clés présentes, chacune booléenne. |
| `statut` | énumération | oui | `"experimentale"` | `active`, `experimentale` ou `desactivee` (03 §6). |
| `remplacements` | liste ordonnée de chaînes | oui (peut être vide) | `["fr"]` | Chaque valeur = `tag` du catalogue ; ne contient pas le `tag` lui-même ; aucune boucle (A → B → A). Après la liste, repli final implicite sur `langueParDefaut`. |
| `police` | objet | oui | `{"famille": "Noto Nastaliq Urdu", "secours": ["Noto Naskh Arabic"]}` | `famille` non vide ; `secours` liste facultative. Les fichiers de police sont à valider par le patron avant ajout (choix-stack §2.3). |
| `localeFormats` | chaîne | si `codeOfficiel` = `false` | `"ar"` | Tag officiel utilisé pour les dates et nombres (`Intl.DateTimeFormat`, `Intl.NumberFormat`). Facultatif sinon (le `tag` lui-même est utilisé). |
| `notes` | chaîne | non | `"Identifiant interne, voir §3"` | Texte libre. |

Champ **non stocké** : la complétude des traductions de l'interface (02 §4). Elle est **calculée** par le script de contrôle (choix-stack §2.4) en comparant `messages/<tag>.json` à `messages/ar.json`. La stocker à la main créerait des chiffres faux.

## 3. Identifiant interne `-x-` (dialecte sans code officiel)

Ordre de préférence (03 §8 : ne jamais créer un faux code officiel) :
1. Un code officiel existe pour la langue ou la variante (registre IANA des sous-étiquettes BCP 47, ISO 639) → l'utiliser, `codeOfficiel: true`.
2. La variante est seulement régionale → langue + région officielle (ex. `fr-CA`), `codeOfficiel: true`.
3. Sinon seulement → identifiant à usage privé BCP 47 : `<langueDeBase>-x-<nom>`.

Règles pour la forme `-x-` :
- `<nom>` : 1 à 8 caractères `a-z` / `0-9` par segment (limite de la norme BCP 47 pour chaque sous-étiquette privée), en minuscules.
- `langueDeBase` obligatoire et égale au début du tag : l'entrée reste liée à sa langue.
- `codeOfficiel: false`, `type: "variante"`, `varianteDe` renseigné, `nomsTraduits` (ar, fr, en) et `localeFormats` obligatoires.
- L'interface affiche une mention « identifiant interne » à côté de ce code (jamais présenté comme code officiel).
- Avant chaque création : vérifier dans le registre IANA qu'aucun code officiel n'existe. Si un code apparaît plus tard, remplacer l'entrée et garder l'ancien identifiant dans `notes`.

## 4. Les 8 niveaux de prise en charge (03 §7)

```json
"niveaux": {
  "identifiee": true,
  "affichable": false,
  "interface": false,
  "recherche": false,
  "traductionAuto": false,
  "contenuDocumentaire": false,
  "contenuVerifie": false,
  "validationHumaine": false
}
```

| Clé | Sens (03 §7) | Règle |
|---|---|---|
| `identifiee` | Répertoriée dans le catalogue | Toujours `true` pour une entrée présente. |
| `affichable` | Caractères et écriture pris en charge | `true` seulement après test d'affichage avec la `police`. |
| `interface` | Menus et fonctions traduits | Exige `affichable: true` et un fichier `messages/<tag>.json`. |
| `recherche` | Recherche adaptée à la langue | Exige `affichable: true`. |
| `traductionAuto` | Traduction générée, identifiée comme telle | Indépendant des autres. |
| `contenuDocumentaire` | Sources ou traductions existantes | Exige au moins une traduction réelle dans les données. |
| `contenuVerifie` | Ressources contrôlées par des personnes compétentes | Exige `contenuDocumentaire: true`. |
| `validationHumaine` | Révision humaine possible dans la langue | `true` seulement si un réviseur réel est disponible. |

Règles communes : valeur par défaut `false` ; jamais `true` sans preuve ; l'interface affiche les niveaux un par un, jamais « entièrement prise en charge » d'après la seule présence dans le menu (03 §7).

## 5. Exemples (illustratifs : les niveaux reflètent l'état actuel, rien n'est encore construit)

```json
{
  "tag": "ur",
  "codeOfficiel": true,
  "type": "langue",
  "langueDeBase": "ur",
  "nomNatif": "اردو",
  "nomsTraduits": { "fr": "ourdou", "en": "Urdu" },
  "direction": "rtl",
  "ecriture": "Arab",
  "regions": ["PK", "IN"],
  "niveaux": { "identifiee": true, "affichable": false, "interface": false, "recherche": false,
               "traductionAuto": false, "contenuDocumentaire": false, "contenuVerifie": false, "validationHumaine": false },
  "statut": "experimentale",
  "remplacements": ["en"],
  "police": { "famille": "Noto Nastaliq Urdu", "secours": ["Noto Naskh Arabic"] }
}
```

```json
{
  "tag": "ar-x-maghreb",
  "codeOfficiel": false,
  "type": "variante",
  "langueDeBase": "ar",
  "varianteDe": "ar",
  "nomNatif": "<nom natif à fournir par un locuteur>",
  "nomsTraduits": { "ar": "<à fournir>", "fr": "variétés arabes du Maghreb", "en": "<à fournir>" },
  "direction": "rtl",
  "ecriture": "Arab",
  "regions": [],
  "niveaux": { "identifiee": true, "affichable": false, "interface": false, "recherche": false,
               "traductionAuto": false, "contenuDocumentaire": false, "contenuVerifie": false, "validationHumaine": false },
  "statut": "desactivee",
  "remplacements": ["ar"],
  "police": { "famille": "Noto Naskh Arabic" },
  "localeFormats": "ar",
  "notes": "Exemple de forme uniquement. Vérifier d'abord le registre IANA : des codes officiels existent peut-être pour certaines variétés."
}
```

## 6. Contrôles automatiques à écrire (consigne tech-lead)
1. Schéma : types, champs obligatoires, énumérations ci-dessus.
2. Unicité de `tag` ; `tag` bien formé ; `-x-` ⇔ `codeOfficiel: false`.
3. `varianteDe`, `remplacements`, clés de `nomsTraduits` existent dans le catalogue ; pas de boucle dans `remplacements`.
4. Dépendances entre niveaux (§4).
5. `direction` cohérente avec `ecriture` (table `Arab` → `rtl`, à compléter).
