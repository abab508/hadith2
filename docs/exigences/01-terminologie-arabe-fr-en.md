# MODULE OBLIGATOIRE — TERMINOLOGIE ARABE, FRANÇAISE ET ANGLAISE

> Exigence donnée par le patron le 2026-10-28. Texte conservé tel quel.

## 1. Rôle et objectif

Tous les agents du projet HadithVerify AI doivent produire des analyses compréhensibles par les personnes francophones et anglophones, y compris celles qui ne lisent pas l’arabe.

La terminologie des sciences du hadith doit rester scientifiquement précise. Aucun terme technique important ne doit être traduit au point de perdre son sens spécialisé.

**Règle absolue : lors de sa première apparition dans chaque section, tout terme technique spécialisé doit être accompagné de son équivalent arabe en écriture arabe, de sa translittération et d’une explication claire dans la langue de l’utilisateur.**

Cette règle s’applique à l’interface, aux rapports, aux réponses des agents, aux tableaux, aux notifications, aux exports PDF et aux documents de validation humaine.

## 2. Format terminologique obligatoire

> **Modifié par le patron le 2026-10-28** : dans le texte, afficher seulement « Terme français (arabe — translittération) », ex. « Bon (حسن — ḥasan) ». La définition passe en infobulle ou fiche terme. Voir docs/memoire/decisions.md.

En français, utiliser le format suivant :

**Terme français (terme arabe — translittération) : définition accessible.**

Exemple :

- Continuité de la chaîne de transmission (اتصال السند — ittiṣāl al-sanad) : continuité documentée entre les transmetteurs d’une chaîne.
- Critique des transmetteurs (الجرح والتعديل — al-jarḥ wa-l-taʿdīl) : discipline qui examine et qualifie la fiabilité des transmetteurs.
- Défaut caché du hadith (العلة — al-ʿilla) : défaut subtil susceptible d’affecter l’évaluation d’une transmission.
- Irrégularité de transmission (الشذوذ — al-shudhūdh) : notion technique dont l’application dépend de l’analyse comparative des transmissions et de l’appréciation des spécialistes.

En anglais, utiliser :

**English term (Arabic term — transliteration): accessible definition.**

Exemple :

- Narrator criticism and accreditation (الجرح والتعديل — al-jarḥ wa-l-taʿdīl): the discipline concerned with assessing narrators’ reliability and precision.
- Hidden defect (‘illa) (العلة — al-ʿilla): a subtle defect that may affect the evaluation of a hadith transmission.

L’arabe doit être affiché dans son écriture originale, de droite à gauche lorsque nécessaire, sans le remplacer par une translittération latine.

La translittération doit être cohérente dans toute l’application. Utiliser une norme reconnue et conserver les graphies alternatives dans les métadonnées de recherche.

## 3. Catégories d’authenticité

Toujours afficher le terme français ou anglais, le terme arabe et la translittération.

| Français | English | Arabe et translittération |
|---|---|---|
| Authentique | Authentic | صحيح — ṣaḥīḥ |
| Bon / fiable selon la catégorie technique | Good / fair, according to the technical category | حسن — ḥasan |
| Faible | Weak | ضعيف — ḍaʿīf |
| Forgé | Fabricated | موضوع — mawḍūʿ |
| Non déterminé | Undetermined | غير محدد — ghayr muḥaddad |

Les équivalents anglais doivent être accompagnés d’une explication lorsque des termes courants comme “good” ou “fair” risquent d’être interprétés comme une simple appréciation générale plutôt que comme une catégorie technique.

Ne pas présenter « non déterminé » comme une catégorie classique d’authenticité équivalente à ṣaḥīḥ ou ḍaʿīf. Il s’agit d’un état de conclusion de l’application.

## 4. Terminologie des chaînes de transmission

Tous les agents qui analysent les chaînes doivent employer la terminologie bilingue suivante :

| Français | Arabe et translittération |
|---|---|
| Chaîne de transmission | السند — al-sanad |
| Transmission / narration | الرواية — al-riwāya |
| Transmetteur | الراوي — al-rāwī |
| Continuité de la chaîne | اتصال السند — ittiṣāl al-sanad |
| Chaîne interrompue par omission d’un ou plusieurs transmetteurs | منقطع — munqaṭiʿ |
| Transmission attribuée à un Successeur sans mention du Compagnon | مرسل — mursal |
| Omission de deux transmetteurs consécutifs, selon la définition technique concernée | معضل — muʿḍal |
| Transmission dont le début de chaîne est omis | معلق — muʿallaq |
| Transmission dissimulant une modalité de réception ou de transmission problématique | مدلس — mudallas |
| Chaîne reliée, selon les conditions de la catégorie | متصل — muttaṣil |
| Hadith attribué au Prophète | مرفوع — marfūʿ |
| Rapport attribué à un Compagnon | موقوف — mawqūf |
| Rapport attribué à un Successeur ou à une génération postérieure concernée | مقطوع — maqṭūʿ |

Ces définitions sont des résumés. Les agents doivent consulter les ouvrages spécialisés avant de classer une chaîne, car certains termes possèdent des définitions et des usages techniques plus précis.

## 5. Terminologie relative aux transmetteurs

Employer les équivalents suivants dans les rapports :

- Fiabilité / probité du transmetteur (العدالة — al-ʿadāla).
- Précision de transmission (الضبط — al-ḍabṭ).
- Critique négative d’un transmetteur (الجرح — al-jarḥ).
- Évaluation favorable d’un transmetteur (التعديل — al-taʿdīl).
- Biographies des transmetteurs (علم الرجال — ʿilm al-rijāl).
- Transmetteur fiable (ثقة — thiqa).
- Transmetteur dont la précision est à examiner, selon l’appréciation citée (صدوق — ṣadūq).
- Transmetteur faible (ضعيف — ḍaʿīf).
- Inconnu / non suffisamment identifié, selon le contexte technique (مجهول — majhūl).

Ne pas transformer automatiquement une appréciation en verdict définitif. Citer l’évaluateur, la formulation originale et la référence lorsqu’elles sont disponibles.

## 6. Terminologie de la critique du texte et des défauts

Les agents spécialisés doivent présenter les termes techniques avec leur forme arabe :

- Texte du hadith (المتن — al-matn).
- Irrégularité ou anomalie technique (الشذوذ — al-shudhūdh).
- Défaut caché (العلة — al-ʿilla).
- Défauts cachés des hadiths (علل الحديث — ʿilal al-ḥadīth).
- Confrontation et comparaison des versions (المقارنة بين الروايات — al-muqārana bayna al-riwāyāt).
- Variante de transmission (اختلاف الروايات — ikhtilāf al-riwāyāt).
- Renforcement par d’autres voies, lorsque les conditions scientifiques le permettent (الاعتبار والمتابعات والشواهد — al-iʿtibār wa-l-mutābaʿāt wa-l-shawāhid).

Ne pas affirmer qu’une variante renforce nécessairement un hadith : sa valeur dépend notamment de son indépendance, de sa qualité et de l’analyse des spécialistes.

## 7. Critique des sources et des conclusions

Dans l’application, le mot « critique » peut désigner plusieurs choses. Toujours distinguer :

1. **Critique des transmetteurs** (الجرح والتعديل — al-jarḥ wa-l-taʿdīl) : évaluation des transmetteurs.
2. **Critique des défauts cachés** (علم العلل — ʿilm al-ʿilal) : étude des défauts subtils de transmission.
3. **Analyse critique des preuves** : examen méthodique des sources et des arguments, sans prétendre qu’il s’agit automatiquement d’une discipline classique portant ce nom.
4. **Contrôle documentaire** : vérification de l’existence, de l’exactitude et de la provenance des références.
5. **Désaccord scientifique** (اختلاف العلماء — ikhtilāf al-ʿulamāʾ) : divergence entre spécialistes, à documenter sans l’effacer.

Les agents ne doivent pas employer « critique du hadith » comme une expression vague lorsque la discipline précise peut être identifiée.

## 8. Exigences linguistiques pour les agents

Chaque agent doit :

- Détecter la langue de l’utilisateur ou respecter la langue sélectionnée.
- Fournir une réponse complète en français ou en anglais.
- Afficher les termes arabes dans leur écriture originale.
- Ajouter une translittération cohérente.
- Expliquer les termes techniques lors de leur première apparition dans chaque section.
- Préserver les citations arabes originales.
- Séparer clairement les traductions des textes originaux.
- Ne pas présenter une traduction comme une citation arabe littérale.
- Utiliser des termes simples dans les explications destinées au grand public.
- Conserver une terminologie technique précise dans les rapports destinés aux spécialistes.

Dans les tableaux et les interfaces compactes, l’explication peut être affichée dans une infobulle, une fiche terminologique ou un panneau d’aide. Le terme arabe et sa translittération doivent néanmoins rester accessibles.

## 9. Dictionnaire terminologique centralisé

Créer une table de terminologie commune à tous les agents, avec les champs suivants :

- Identifiant du terme.
- Terme français.
- Terme anglais.
- Terme arabe original.
- Translittération normalisée.
- Variantes de translittération.
- Définition française.
- Définition anglaise.
- Domaine scientifique.
- Références bibliographiques.
- Termes proches ou à ne pas confondre.
- Notes de validation par un spécialiste.
- Version du dictionnaire.

Les agents doivent consulter ce dictionnaire plutôt que créer indépendamment leurs propres traductions.

Le dictionnaire doit pouvoir être enrichi et corrigé sans modifier le code de tous les agents.

## 10. Contrôle qualité terminologique

Avant de publier un rapport, un agent de contrôle doit vérifier :

- Que les termes techniques importants sont accompagnés de l’arabe.
- Que la translittération correspond au terme arabe affiché.
- Que les définitions ne déforment pas le sens scientifique.
- Que les catégories d’authenticité ne sont pas confondues avec les catégories juridiques.
- Que les distinctions entre texte, chaîne et transmetteur sont respectées.
- Que les traductions ne sont pas inventées ou attribuées à tort.
- Que les variantes terminologiques ne créent pas de doublons dans les résultats de recherche.
- Que les utilisateurs non arabophones peuvent comprendre les conclusions sans devoir maîtriser la langue arabe.

En cas de doute terminologique, l’agent doit signaler l’incertitude et demander une validation humaine.

**Règle finale : chaque rapport doit être scientifiquement précis, compréhensible pour un lecteur francophone ou anglophone et suffisamment transparent pour qu’un spécialiste arabophone puisse contrôler les termes, les références et les conclusions.**
