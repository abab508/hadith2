# MODULE OBLIGATOIRE — PLATEFORME MULTILINGUE INTERNATIONALE

> Exigence donnée par le patron le 2026-10-28. Texte conservé tel quel.

## 1. Objectif

HadithVerify AI doit être une plateforme internationale consacrée à la recherche, à l’étude et à la vérification documentaire des hadiths.

L’application doit prendre en charge plusieurs langues, avec :

- L’arabe comme langue par défaut et langue prioritaire.
- Un sélecteur de langue accessible à tout moment.
- Une interface adaptée aux langues de droite à gauche et de gauche à droite.
- Des traductions fiables des interfaces, des explications et des rapports.
- La conservation du texte arabe original.
- L’affichage des termes techniques arabes à côté de leurs équivalents dans la langue sélectionnée.
- Une architecture permettant d’ajouter de nouvelles langues sans reconstruire l’application.

Ne jamais supposer qu’un utilisateur maîtrise l’arabe simplement parce qu’il souhaite consulter des sources islamiques.

## 2. Sélecteur de langues

Au premier lancement, l’application doit s’ouvrir en arabe.

Afficher un sélecteur de langue visible dans l’en-tête du site et dans les paramètres du compte.

Le sélecteur doit afficher le nom de chaque langue dans sa propre écriture, avec son nom éventuellement traduit dans la langue courante.

Exemple :

- العربية — Arabe
- English — Anglais
- Français — Français
- Español — Espagnol
- اردو — Ourdou
- Bahasa Indonesia — Indonésien
- Bahasa Melayu — Malais
- বাংলা — Bengali
- Türkçe — Turc
- فارسی — Persan

Le choix de langue doit mettre à jour l’interface sans effacer la recherche en cours, les filtres, les résultats ou le rapport ouvert.

Mémoriser la préférence linguistique du compte lorsque l’utilisateur est connecté. Pour les visiteurs, conserver le choix selon les mécanismes de stockage autorisés par l’application.

L’utilisateur doit pouvoir changer de langue à tout moment.

## 3. Langues à intégrer

### Priorité 1 — Langues de lancement

Ces langues doivent être prises en charge dès la première version, au minimum pour les fonctions essentielles de l’interface :

1. Arabe — العربية (`ar`).
2. Anglais — English (`en`).
3. Français — Français (`fr`).
4. Espagnol — Español (`es`).
5. Ourdou — اردو (`ur`).
6. Indonésien — Bahasa Indonesia (`id`).
7. Malais — Bahasa Melayu (`ms`).
8. Turc — Türkçe (`tr`).

L’arabe doit être sélectionné par défaut lors de la première visite, sauf si le produit adopte ultérieurement une règle explicite de détection de la langue du navigateur. Dans ce cas, la préférence de l’utilisateur doit toujours prévaloir et l’arabe doit rester immédiatement accessible.

### Priorité 2 — Langues importantes pour les communautés musulmanes

Prévoir l’architecture et les traductions pour :

- Bengali — বাংলা (`bn`).
- Persan — فارسی (`fa`).
- Pachto — پښتو (`ps`).
- Hindi — हिन्दी (`hi`).
- Tamoul — தமிழ் (`ta`).
- Malayalam — മലയാളം (`ml`).
- Telugu — తెలుగు (`te`).
- Kannada — ಕನ್ನಡ (`kn`).
- Marathi — मराठी (`mr`).
- Sindhi — سنڌي (`sd`).
- Pendjabi — ਪੰਜਾਬੀ (`pa`).
- Chinois simplifié — 简体中文 (`zh-CN`).
- Chinois traditionnel — 繁體中文 (`zh-TW`).
- Russe — Русский (`ru`).
- Allemand — Deutsch (`de`).
- Portugais — Português (`pt`).
- Swahili — Kiswahili (`sw`).
- Kazakh — Қазақша (`kk`).
- Ouzbek — Oʻzbekcha (`uz`).
- Azerbaïdjanais — Azərbaycanca (`az`).
- Tadjik — Тоҷикӣ (`tg`).
- Kurde — Kurdî / کوردی (`ku`).
- Somali — Soomaali (`so`).
- Hausa — Hausa (`ha`).
- Albanais — Shqip (`sq`).
- Bosnien — Bosanski (`bs`).
- Tchétchène — Нохчийн (`ce`).
- Japonais — 日本語 (`ja`).
- Coréen — 한국어 (`ko`).

Cette liste est une base de travail, pas une limite. Ajouter d’autres langues selon la demande des utilisateurs et la disponibilité de traductions de qualité.

Ne pas confondre les langues d’une région avec une langue unique. L’Inde, le Pakistan, l’Asie centrale, l’Asie du Sud-Est et l’Afrique comptent plusieurs langues et traditions documentaires.

## 4. Gestion des langues et des écritures

Chaque langue doit posséder des paramètres explicites :

- Code de langue normalisé.
- Nom natif.
- Nom traduit.
- Direction du texte : RTL ou LTR.
- Police compatible.
- Format des dates et nombres.
- Traductions de l’interface.
- État de complétude des traductions.
- Disponibilité des traductions documentaires.
- Langues de remplacement en cas de traduction manquante.

L’arabe, l’ourdou, le persan, le pachto et certaines écritures du kurde nécessitent une gestion de droite à gauche.

La direction doit être gérée au niveau des composants et des textes, car un rapport peut mélanger de l’arabe, du français, des références numériques et des URL.

Utiliser Unicode et des polices compatibles avec les caractères nécessaires. Ne pas inverser manuellement les chaînes arabes.

## 5. Séparer la langue de l’interface et la langue des sources

Le système doit distinguer trois préférences différentes :

1. **Langue de l’interface** : langue des menus, boutons et paramètres.
2. **Langue du rapport** : langue dans laquelle l’explication et la synthèse sont rédigées.
3. **Langues de recherche documentaire** : langues dans lesquelles les sources et les traductions sont recherchées.

Par exemple, un utilisateur peut sélectionner :

- Interface : français.
- Rapport : français.
- Recherche documentaire : arabe, anglais, français et ourdou.

Ces paramètres doivent être indépendants.

Le changement de langue de l’interface ne doit jamais traduire automatiquement ou remplacer le texte original d’une source.

## 6. Affichage multilingue des termes scientifiques

Pour chaque langue, afficher les termes spécialisés dans la langue sélectionnée, accompagnés de l’arabe et d’une translittération lorsque celle-ci aide à la compréhension.

Exemple en français :

**Hadith authentique (حديث صحيح — ḥadīth ṣaḥīḥ)**

Exemple en anglais :

**Authentic hadith (حديث صحيح — ḥadīth ṣaḥīḥ)**

Exemple en espagnol :

**Hadiz auténtico (حديث صحيح — ḥadīth ṣaḥīḥ)**

Les termes arabes doivent rester stables dans le dictionnaire terminologique commun.

Les traductions techniques doivent être validées par des personnes compétentes. Ne pas traduire automatiquement des termes spécialisés sans contrôle.

## 7. Traductions des textes et des rapports

Pour chaque hadith, stocker séparément :

- Le texte arabe original.
- Les variantes arabes.
- Les traductions disponibles.
- La langue de chaque traduction.
- Le nom du traducteur ou de l’organisme responsable.
- La source de la traduction.
- L’édition ou la version.
- Les droits de réutilisation.
- L’état de vérification.

Une traduction générée par IA doit être clairement identifiée comme telle.

Elle ne doit jamais être présentée comme une traduction officielle, une traduction publiée ou un texte original.

Si aucune traduction fiable n’est disponible, afficher le texte arabe et signaler l’absence de traduction vérifiée. Une traduction provisoire peut être proposée séparément, avec un avertissement explicite.

## 8. Comportement des agents multilingues

Tous les agents doivent être indépendants de la langue d’affichage.

L’orchestrateur doit pouvoir :

- Recevoir une question dans n’importe quelle langue prise en charge.
- Normaliser la requête sans perdre le texte d’origine.
- Rechercher dans les sources arabes et dans les langues autorisées.
- Reconnaître les translittérations et les variantes orthographiques.
- Comparer les résultats de plusieurs langues.
- Conserver les références dans leur langue d’origine.
- Produire le rapport dans la langue demandée.
- Afficher les citations originales à côté des traductions.
- Indiquer la langue et la provenance de chaque preuve.

Les agents doivent effectuer la recherche dans la langue d’origine de la source lorsqu’elle est disponible, plutôt que de dépendre exclusivement d’une traduction.

Une traduction ou un résultat similaire dans une autre langue ne suffit pas à établir que deux textes correspondent au même hadith.

## 9. Recherche multilingue

Le moteur de recherche doit permettre :

- La recherche exacte.
- La recherche approximative.
- La recherche par fragment.
- La recherche à partir d’une traduction.
- La recherche par translittération.
- La recherche par référence bibliographique.
- La recherche par transmetteur.
- La recherche par collection.
- La comparaison des variantes entre langues.

Prévoir une normalisation propre à chaque écriture, sans supprimer les distinctions linguistiques utiles.

L’interface doit montrer si une correspondance provient du texte arabe original, d’une traduction publiée, d’une traduction générée ou d’une simple similarité textuelle.

## 10. Déploiement progressif

Ne pas attendre que toutes les langues soient intégralement traduites pour lancer le produit.

Prévoir trois niveaux de disponibilité :

- **Interface disponible** : menus et fonctions essentielles traduits.
- **Documentation partiellement disponible** : certaines sources ou certains rapports sont accessibles dans cette langue.
- **Documentation spécialisée vérifiée** : des traductions et ressources scientifiques adaptées sont disponibles et contrôlées.

L’application doit afficher clairement les langues dans lesquelles l’interface est disponible et celles dans lesquelles les ressources documentaires sont réellement suffisantes.

Une interface traduite ne signifie pas que toutes les sources ou tous les jugements existent dans cette langue.

## 11. Architecture technique

Mettre en place un système d’internationalisation centralisé, avec des fichiers de traduction séparés et versionnés.

Ne pas écrire les libellés de l’interface directement dans les composants.

Prévoir :

- La gestion des langues et des variantes régionales.
- Les formats RTL et LTR.
- Le chargement des traductions.
- La détection des traductions manquantes.
- Les contrôles de cohérence.
- Les tests de changement de langue.
- Les tests d’affichage de textes mixtes.
- La possibilité d’ajouter une langue sans réécrire le frontend ou le backend.

La technologie utilisée doit être compatible avec l’architecture existante du dépôt.

## 12. Critères d’acceptation

La fonctionnalité multilingue est considérée comme prête lorsque :

1. L’arabe est disponible et défini comme langue initiale.
2. L’utilisateur peut changer de langue à tout moment.
3. L’anglais, le français, l’espagnol, l’ourdou, l’indonésien, le malais et le turc sont prévus pour le lancement.
4. Les autres langues peuvent être ajoutées sans refonte de l’application.
5. L’interface RTL/LTR fonctionne correctement.
6. Les textes originaux et leurs traductions sont séparés.
7. La langue de l’interface est indépendante de la langue du rapport et de celle de la recherche.
8. Les termes techniques conservent leur équivalent arabe.
9. Les traductions IA sont identifiées comme telles.
10. Les références restent accessibles quelle que soit la langue de l’interface.
11. Les traductions manquantes sont signalées honnêtement.
12. Des tests automatisés vérifient les fonctions multilingues.

**Instruction finale : développer une véritable architecture multilingue, et non une simple traduction de l’interface. La priorité est de rendre les sciences du hadith accessibles au plus grand nombre sans altérer les textes originaux, les références ou la précision scientifique.**
