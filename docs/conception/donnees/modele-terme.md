# Modèle de données — Terme (dictionnaire terminologique centralisé)

Auteur : architecte — 2026-10-28
Sources : exigence 01 §2, §3, §9, §10 ; exigence 02 §6 ; docs/conception/choix-stack.md §2.1.
État : proposition, indépendante de la stack. Fichier cible : `data/termes/termes.json`.
Les exemples ci-dessous recopient uniquement des termes et explications écrits dans l'exigence 01. Aucune définition n'est ajoutée.

---

## 1. Enveloppe du fichier

```json
{
  "version": "0.1.0",
  "miseAJour": "2026-10-28",
  "normeTranslitteration": "provisoire-v0 (voir regles-translitteration.md)",
  "domaines": ["authenticite", "chaine", "transmetteurs", "texte-defauts", "critique-sources"],
  "termes": [ ... ]
}
```

| Champ | Type | Obligatoire | Règle |
|---|---|---|---|
| `version` | chaîne | oui | **Version du dictionnaire** (01 §9, champ 13). Forme `X.Y.Z`, augmente à chaque modification. |
| `miseAJour` | date | oui | `AAAA-MM-JJ`. |
| `normeTranslitteration` | chaîne | oui | Nom de la norme appliquée à `translitteration`. |
| `domaines` | liste de chaînes | oui | Liste fermée des domaines autorisés. Valeurs initiales = titres des §3 à §7 de l'exigence 01. Modifiable dans le fichier, sans code. |
| `termes` | liste d'objets | oui | `id` unique. |

## 2. Un terme — correspondance avec les 13 champs de l'exigence 01 §9

| # | Champ 01 §9 | Champ JSON | Type | Obligatoire | Exemple | Règle de validation |
|---|---|---|---|---|---|---|
| 1 | Identifiant du terme | `id` | chaîne | oui | `"ittisal-al-sanad"` | `^[a-z0-9]+(-[a-z0-9]+)*$`. Unique. Stable : jamais modifié ni réutilisé après suppression. |
| 2 | Terme français | `langues.fr.terme` | chaîne | oui | `"Continuité de la chaîne de transmission"` | Non vide. |
| 3 | Terme anglais | `langues.en.terme` | chaîne | oui | `"Narrator criticism and accreditation"` | Non vide. |
| 4 | Terme arabe original | `ar` | chaîne | oui | `"اتصال السند"` | Non vide, Unicode NFC, contient des lettres arabes. Toujours conservé, jamais remplacé par la translittération (01 §2, 02 §6). |
| 5 | Translittération normalisée | `translitteration` | chaîne | oui | `"ittiṣāl al-sanad"` | Non vide, NFC, conforme à `normeTranslitteration`. |
| 6 | Variantes de translittération | `variantesTranslitteration` | liste de chaînes | oui (peut être vide) | `["‘illa"]` | Sans doublon ; aucune égale à `translitteration`. Servent seulement à la recherche (01 §2). |
| 7 | Définition française | `langues.fr.explication` | chaîne | oui | voir §4 | Non vide. Explication accessible (01 §2). |
| 8 | Définition anglaise | `langues.en.explication` | chaîne | oui | voir §4 | Non vide. |
| 9 | Domaine scientifique | `domaine` | chaîne | oui | `"chaine"` | Valeur présente dans `domaines` de l'enveloppe. |
| 10 | Références bibliographiques | `references` | liste d'objets | oui (peut être vide) | `[]` | Chaque objet : `titre` (obligatoire), `auteur`, `edition`, `volume`, `page`, `url` (facultatifs). Jamais de référence inventée. |
| 11 | Termes proches / à ne pas confondre | `termesLies` | liste d'objets | oui (peut être vide) | `[{"id": "daif-transmetteur", "relation": "ne-pas-confondre"}]` | `id` existe dans le dictionnaire ; `relation` ∈ `proche`, `ne-pas-confondre` ; relation déclarée des deux côtés. |
| 12 | Notes de validation par un spécialiste | `notesValidation` | liste d'objets | oui (peut être vide) | `[]` | Chaque objet : `date` (AAAA-MM-JJ), `specialiste` (nom réel), `note`. Jamais de nom ou de validation inventés (03 §9). |
| 13 | Version du dictionnaire | `version` (enveloppe) + `versionTerme` | chaîne | oui | `"0.1.0"` | `versionTerme` = version du dictionnaire lors de la dernière modification de ce terme. ≤ `version` de l'enveloppe. |

## 3. Champs ajoutés (hors liste 01 §9)

| Champ | Type | Obligatoire | Exemple | Règle |
|---|---|---|---|---|
| `statutValidation` | énumération | oui | `"a-valider-specialiste"` | Valeurs : `a-valider-specialiste` (**défaut**), `valide-specialiste`, `a-corriger`. Porte sur `ar`, `translitteration`, `domaine`. `valide-specialiste` exige au moins une entrée dans `notesValidation` et au moins une `references`. Libellé affiché : « à valider par un spécialiste ». |
| `langues.<tag>.statutValidation` | énumération | oui | `"a-valider-specialiste"` | Mêmes valeurs et même défaut, pour la traduction dans cette langue (02 §6 : traductions techniques validées par des personnes compétentes). |
| `langues.<tag>.origine` | énumération | oui | `"humaine"` | `humaine` ou `ia` (choix-stack §2.1). Une explication `ia` ne peut pas être `valide-specialiste` sans note de validation. |
| `typeTerme` | énumération | oui | `"terme-technique"` | `terme-technique` ou `etat-application`. Ex. « Non déterminé » (غير محدد) est un état de l'application, pas une catégorie classique (01 §3). |

Structure `langues` : objet dont les clés sont des `tag` du catalogue des langues. `fr` et `en` obligatoires ; toute autre langue (ex. `es`, 02 §6) s'ajoute sans changer la structure.

## 4. Exemples (recopiés de l'exigence 01, rien d'ajouté)

```json
{
  "id": "ittisal-al-sanad",
  "ar": "اتصال السند",
  "translitteration": "ittiṣāl al-sanad",
  "variantesTranslitteration": [],
  "domaine": "chaine",
  "typeTerme": "terme-technique",
  "langues": {
    "fr": {
      "terme": "Continuité de la chaîne de transmission",
      "explication": "continuité documentée entre les transmetteurs d’une chaîne.",
      "origine": "humaine",
      "statutValidation": "a-valider-specialiste"
    },
    "en": {
      "terme": "<à fournir : absent de l'exigence 01>",
      "explication": "<à fournir>",
      "origine": "humaine",
      "statutValidation": "a-valider-specialiste"
    }
  },
  "references": [],
  "termesLies": [],
  "notesValidation": [],
  "statutValidation": "a-valider-specialiste",
  "versionTerme": "0.1.0"
}
```

```json
{
  "id": "al-illa",
  "ar": "العلة",
  "translitteration": "al-ʿilla",
  "variantesTranslitteration": ["‘illa"],
  "domaine": "texte-defauts",
  "typeTerme": "terme-technique",
  "langues": {
    "fr": { "terme": "Défaut caché du hadith",
            "explication": "défaut subtil susceptible d’affecter l’évaluation d’une transmission.",
            "origine": "humaine", "statutValidation": "a-valider-specialiste" },
    "en": { "terme": "Hidden defect",
            "explication": "a subtle defect that may affect the evaluation of a hadith transmission.",
            "origine": "humaine", "statutValidation": "a-valider-specialiste" }
  },
  "references": [],
  "termesLies": [],
  "notesValidation": [],
  "statutValidation": "a-valider-specialiste",
  "versionTerme": "0.1.0"
}
```
Note : la variante `‘illa` est recopiée de l'exemple anglais de l'exigence 01 §2, qui utilise un autre caractère que `ʿ` pour la même lettre. C'est le cas typique à rattacher au même terme pour éviter les doublons (01 §10).

## 5. Même mot arabe, deux termes (cas réel de l'exigence 01)

ضعيف — ḍaʿīf apparaît deux fois : « Faible » pour un hadith (01 §3) et « Transmetteur faible » (01 §5). Règle :
- deux entrées distinctes (`daif-hadith`, domaine `authenticite` ; `daif-transmetteur`, domaine `transmetteurs`) ;
- reliées par `termesLies` avec `relation: "ne-pas-confondre"` des deux côtés ;
- le couple (`ar`, `domaine`) doit être unique. Deux entrées avec le même `ar` sans lien `ne-pas-confondre` = erreur de contrôle.

Idem pour الشذوذ — al-shudhūdh, présenté en 01 §2 et §6 : une seule entrée (même domaine), à décider par le spécialiste.

## 6. Contrôles automatiques à écrire (consigne tech-lead)
1. Schéma (types, obligatoires, énumérations, formats).
2. `id` unique ; `termesLies` existants et réciproques ; (`ar`, `domaine`) unique.
3. `fr` et `en` présents ; clés de `langues` = tags du catalogue.
4. `valide-specialiste` ⇒ `notesValidation` et `references` non vides.
5. Aucune variante de translittération partagée par deux termes différents (sinon doublon en recherche, 01 §10) — sauf termes liés `ne-pas-confondre`, signalés en avertissement.
