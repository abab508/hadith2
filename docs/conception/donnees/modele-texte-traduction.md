# Modèle de données — Texte original et traductions

Auteur : architecte — 2026-10-28
Sources : exigence 02 §5, §7 ; exigence 03 §9 ; exigence 01 §6, §8.
État : proposition, indépendante de la stack. Fichier cible proposé : `data/textes/<id>.json` (un fichier par hadith).
Aucun texte de hadith n'est donné en exemple : les valeurs entre `< >` sont des emplacements à remplir depuis une source réelle.

---

## 1. Principes
- Le texte arabe original est obligatoire et stocké à part. Une traduction ne peut pas exister sans lui (03 §9).
- Original, variantes et traductions sont des blocs séparés ; une traduction n'est jamais présentée comme l'original (01 §8, 02 §7).
- Tous les textes en Unicode NFC, dans l'ordre logique. Jamais d'inversion manuelle d'une chaîne arabe (02 §4).
- Changer la langue de l'interface ne modifie ni ne remplace jamais un texte stocké (02 §5).

## 2. Hadith (enveloppe)

| Champ | Type | Obligatoire | Exemple | Règle de validation |
|---|---|---|---|---|
| `id` | chaîne | oui | `"h-000001"` | Unique, stable, jamais réutilisé. |
| `original` | objet | oui | voir §3 | Exactement un. |
| `variantes` | liste d'objets | oui (peut être vide) | voir §4 | `id` unique dans le hadith. |
| `traductions` | liste d'objets | oui (peut être vide) | voir §5 | `id` unique dans le hadith. |
| `miseAJour` | date | oui | `"2026-10-28"` | `AAAA-MM-JJ`. |

## 3. Texte arabe original

| Champ | Type | Obligatoire | Exemple | Règle |
|---|---|---|---|---|
| `langue` | chaîne | oui | `"ar"` | Tag du catalogue dont `langueDeBase` = `ar`. |
| `texte` | chaîne | oui | `"<texte arabe tel que dans la source>"` | Non vide, NFC, contient des lettres arabes. Recopié de la source, jamais reformulé. |
| `source` | objet | oui | `{"ouvrage": "<titre>", "edition": "<éditeur, année>", "volume": "<n>", "page": "<n>", "numero": "<n>"}` | `ouvrage` obligatoire ; le reste facultatif mais recommandé. Jamais de référence inventée. |
| `saisie` | objet | oui | `{"par": "<nom>", "date": "2026-10-28"}` | Qui a saisi ou importé le texte. |
| `etatVerification` | énumération | oui | `"non-verifiee"` | Voir §6. |

## 4. Variante arabe (اختلاف الروايات — ikhtilāf al-riwāyāt, 01 §6)

| Champ | Type | Obligatoire | Exemple | Règle |
|---|---|---|---|---|
| `id` | chaîne | oui | `"v1"` | Unique dans le hadith. |
| `texte` | chaîne | oui | `"<texte arabe de la variante>"` | Mêmes règles que l'original. |
| `source` | objet | oui | même forme que §3 | `ouvrage` obligatoire. |
| `note` | chaîne | non | `"<différence observée>"` | Texte libre. Ne jamais affirmer qu'une variante renforce le hadith (01 §6). |
| `etatVerification` | énumération | oui | `"non-verifiee"` | Voir §6. |

## 5. Traduction

| Champ | Type | Obligatoire | Exemple | Règle de validation |
|---|---|---|---|---|
| `id` | chaîne | oui | `"t-fr-1"` | Unique dans le hadith. |
| `traduitDe` | chaîne | oui | `"original"` | `original` ou `id` d'une variante : ce qui a été traduit. |
| `langue` | chaîne | oui | `"fr"` | `tag` présent dans le catalogue des langues. |
| `texte` | chaîne | oui | `"<texte de la traduction>"` | Non vide, NFC. |
| `provenance` | énumération | oui | `"humaine-publiee"` | Voir §5.1. |
| `traducteur` | objet | oui | `{"nom": "<nom>", "type": "personne"}` | `type` ∈ `personne`, `organisme`, `systeme-ia`. Pour `systeme-ia` : `nom` = nom et version du système, plus `date` de génération. |
| `source` | objet | si provenance humaine | `{"titre": "<ouvrage publié>", "editeur": "<éditeur>", "url": "<url>"}` | Obligatoire (`titre` au minimum) pour `humaine-publiee`. Interdit de citer une publication pour une traduction automatique. |
| `edition` | chaîne | si `humaine-publiee` | `"<édition ou version>"` | Non vide si exigé. |
| `droits` | objet | oui | `{"statut": "inconnu"}` | `statut` ∈ `domaine-public`, `licence`, `autorisation`, `inconnu` ; `licence` (nom) obligatoire si `licence` ; `details` facultatif. **`inconnu` ⇒ traduction non affichée publiquement** tant que les droits ne sont pas vérifiés. |
| `etatVerification` | énumération | oui | `"non-verifiee"` | Voir §6. |
| `verification` | objet | si `verifiee` | `{"par": "<nom réel>", "date": "AAAA-MM-JJ", "note": "..."}` | Obligatoire si `etatVerification` = `verifiee`. Jamais de nom inventé. |

### 5.1 Provenance (03 §9)

Valeurs **stockées** dans `provenance` :

| Valeur | Sens | Conditions |
|---|---|---|
| `humaine-publiee` | Traduction humaine publiée | `source.titre` et `edition` obligatoires. |
| `humaine-validee` | Traduction humaine validée | `etatVerification` = `verifiee` + `verification` rempli. |
| `automatique` | Traduction automatique | `traducteur.type` = `systeme-ia`. Toujours affichée avec un avertissement explicite (02 §7). |
| `automatique-relue` | Traduction automatique relue par un spécialiste | `traducteur.type` = `systeme-ia` + `etatVerification` = `verifiee` + `verification.par` rempli. |

5e cas de 03 §9, **calculé à l'affichage, jamais stocké** :

| État affiché | Quand |
|---|---|
| `original-non-traduit` | Aucune traduction affichable dans la langue demandée (ni dans ses `remplacements`). On affiche l'original arabe et on signale l'absence de traduction vérifiée (02 §7). |

Interdits : une traduction `automatique` ou `automatique-relue` n'est jamais étiquetée « officielle » ou « publiée » ; aucune provenance « officielle » n'existe dans le modèle.

## 6. État de vérification (commun aux §3, §4, §5)

| Valeur | Sens |
|---|---|
| `non-verifiee` | Défaut. Rien n'a été contrôlé. |
| `en-cours` | Contrôle commencé. |
| `verifiee` | Contrôlé par une personne nommée (`verification` obligatoire pour une traduction). |
| `rejetee` | Contrôle négatif : non affichée, conservée pour l'historique. |

## 7. Ordre d'affichage d'une traduction (règle pour le tech-lead)
1. Toujours afficher l'original arabe, dans son propre bloc `lang="ar" dir="rtl"`.
2. Chercher une traduction dans la langue du rapport, puis dans ses `remplacements` : préférer `humaine-publiee` / `humaine-validee`, puis `automatique-relue`, puis `automatique` (avec avertissement, dans un bloc séparé).
3. Exclure `rejetee` et `droits.statut` = `inconnu`.
4. Rien trouvé → état `original-non-traduit`.

## 8. Contrôles automatiques à écrire
1. Schéma (types, obligatoires, énumérations).
2. Conditions de §5.1 selon la provenance.
3. `langue` présente dans le catalogue ; `traduitDe` existe.
4. `verifiee` ⇒ `verification.par` non vide.
