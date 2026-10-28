# Règles de translittération de l'arabe

Auteur : architecte — 2026-10-28
Sources : exigence 01 §2 (norme reconnue, cohérence, graphies alternatives en métadonnées), §10.

> **À SOUMETTRE À UN SPÉCIALISTE.** Tout ce document est provisoire. Rien ici ne vaut validation savante.
> Les descriptions des normes viennent de connaissances générales, pas d'une lecture des textes officiels : chaque point marqué « à vérifier » doit être contrôlé sur le texte de la norme.

---

## 1. Ce que les exigences montrent déjà (constaté, pas supposé)

Les exemples de l'exigence 01 suivent une convention régulière :

| Point | Forme observée | Exemples recopiés de 01 |
|---|---|---|
| Voyelles longues | macron : ā, ī, ū | al-riwāya, al-rāwī, al-shudhūdh |
| Consonnes emphatiques | point souscrit : ṣ, ḍ, ṭ, ḥ | ṣaḥīḥ, ḍaʿīf, munqaṭiʿ, ḥasan |
| ث ذ ش خ غ | digrammes : th, dh, sh, kh, gh | thiqa, al-shudhūdh, ikhtilāf, ghayr muḥaddad |
| ج | j | al-jarḥ, majhūl, ʿilm al-rijāl |
| ʿayn / hamza | ʿ / ʾ | al-ʿilla, ikhtilāf al-ʿulamāʾ |
| Tāʾ marbūṭa en fin de mot | a | al-riwāya, thiqa, al-ʿadāla |
| Article | « al- », sans assimilation devant les lettres solaires | al-sanad, al-shudhūdh, al-taʿdīl |
| Article après « wa » | « wa-l- » | al-jarḥ wa-l-taʿdīl |
| Majuscules | minuscules | toutes |

Écart déjà présent : l'exemple anglais de 01 §2 écrit « ‘illa » avec un autre caractère que « ʿ » de « al-ʿilla ». Il faut donc fixer un seul caractère pour l'affichage et accepter les autres en recherche (§4).

## 2. Deux normes candidates

### Candidate A — ALA-LC (American Library Association – Library of Congress), table de romanisation de l'arabe
- Ce dont je suis sûr : norme des bibliothèques (catalogues), voyelles longues à macron, emphatiques à point souscrit, digrammes th / dh / sh / kh / gh, article « al- » écrit sans assimilation.
- À vérifier : tāʾ marbūṭa rendue par « h » (ex. « riwāyah ») ; article après « wa » écrit « wa-al- » ; ʿayn et hamza notés par d'autres caractères (ʻ et ʼ) que ceux des exigences. Si c'est confirmé, ALA-LC stricte diffère des exemples de 01 sur ces trois points.
- Intérêt : proche des exemples des exigences ; facilite le rapprochement avec les notices de bibliothèques (champ `references` du dictionnaire).

### Candidate B — DIN 31635 (norme allemande)
- Ce dont je suis sûr : une lettre latine (avec signe diacritique) par lettre arabe, au lieu des digrammes ; voyelles longues à macron.
- À vérifier : les lettres exactes (ce seraient ṯ, ǧ, ḫ, ḏ, š, ġ pour ث ج خ ذ ش غ), le traitement de l'article et de la tāʾ marbūṭa.
- Intérêt : plus compacte, sans ambiguïté entre digramme et suite de deux lettres. Limite : moins familière aux lecteurs francophones et anglophones visés (01 §1).

ISO 233 : translittération stricte caractère par caractère, pensée pour être réversible ; détails à vérifier. Non retenue comme candidate : la moins lisible pour le grand public.

## 3. Recommandation provisoire (à soumettre à un spécialiste)

**Candidate A (famille ALA-LC), appliquée dans la forme exacte des exemples de l'exigence 01 (§1 ci-dessus).** Nom dans les données : `provisoire-v0`.

Raisons : c'est la convention déjà utilisée par le patron dans plus de trente termes ; elle est lisible en français et en anglais ; la changer plus tard ne casse rien, car la recherche accepte toutes les graphies (§4) et l'ancienne forme passe dans `variantesTranslitteration`.

Caractères retenus provisoirement pour l'affichage :
- ʿayn : `ʿ` (U+02BF) ; hamza : `ʾ` (U+02BE).
- Macron et point souscrit en caractères précomposés (forme NFC).

Questions pour le spécialiste :
1. Garder la forme des exigences (tāʾ marbūṭa « a », « wa-l- ») ou passer à ALA-LC stricte, ou à une autre norme ?
2. Hamza en début de mot : notée ou non ?
3. Tāʾ marbūṭa en état construit (« -at ») : à confirmer.
4. Choix des caractères ʿ / ʾ.

## 4. Graphies alternatives pour la recherche

Deux niveaux, pour trouver un terme quelle que soit la graphie, sans jamais modifier le texte stocké :

### 4.1 Clé de recherche calculée (automatique, opérations sûres)
Appliquée à la fois à la requête et à `translitteration` + `variantesTranslitteration` :
1. Remplacer les lettres DIN par les digrammes : š→sh, ṯ→th, ḏ→dh, ḫ→kh, ġ→gh, ǧ→j (liste à vérifier avec la norme DIN).
2. Décomposer (NFD) puis retirer les signes diacritiques (macron, point souscrit).
3. Retirer les signes d'ʿayn / hamza et apparentés : ʿ ʾ ʻ ʼ ‘ ’ ' `.
4. Minuscules ; « wa-al- » → « wa-l- » ; tirets et espaces multiples → une espace.
5. Clé secondaire : la même sans l'article initial « al » (pour qu'une recherche « jarh » trouve « al-jarḥ »).

Exemple : « al-ʿilla » et « ‘illa » donnent tous deux la clé secondaire « illa » → même terme, un seul résultat.

### 4.2 Variantes explicites (saisies à la main dans `variantesTranslitteration`)
Pour ce qui n'est pas sûr à automatiser : formes populaires françaises (ex. « ch » pour ش, « ou » pour ū), tāʾ marbūṭa en « ah », autres normes. Saisies une par une, pour éviter de faux rapprochements.

### 4.3 Côté arabe (recherche en écriture arabe)
Clé calculée, jamais appliquée au texte stocké : retirer les voyelles brèves (harakat) et le tatweel, unifier أ إ آ → ا. Autres unifications (ة/ه, ى/ي) : à décider avec le spécialiste.

### 4.4 Anti-doublons (01 §10)
Toutes les clés pointent vers l'`id` du terme : un terme = un résultat, quelle que soit la graphie. Une clé commune à deux termes différents est signalée par le contrôle automatique.
