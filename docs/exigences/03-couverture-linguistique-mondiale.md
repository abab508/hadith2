# EXIGENCE PRIORITAIRE — COUVERTURE LINGUISTIQUE MONDIALE

> Exigence donnée par le patron le 2026-10-28. Texte conservé tel quel.

## 1. Principe universel

L'application doit être conçue pour accueillir toutes les langues, tous les dialectes, toutes les variantes régionales et tous les systèmes d'écriture identifiables, sans limite fixe de langues.

Ne pas limiter la plateforme à une liste prédéfinie de langues.

Utiliser des catalogues linguistiques normalisés, actualisables et extensibles, notamment les normes ISO 639 et les identifiants de langue BCP 47, ainsi que les données d'internationalisation Unicode CLDR. Ces ressources fournissent des bases pour identifier les langues, les variantes régionales, les écritures et les règles d'affichage. Références : https://www.iso.org/fr/iso-639-language-code.html et https://cldr.unicode.org/.

## 2. Couverture géographique et linguistique

Prévoir la prise en charge de toutes les régions du monde :

- Afrique du Nord, Afrique de l'Ouest, Afrique centrale, Afrique de l'Est et Afrique australe.
- Moyen-Orient et péninsule Arabique.
- Asie du Sud : Pakistan, Inde, Bangladesh, Afghanistan, Sri Lanka, Maldives et régions voisines.
- Asie du Sud-Est : Indonésie, Malaisie, Brunei, Singapour, Philippines, Thaïlande, Myanmar, Cambodge, Vietnam et autres régions.
- Asie centrale et Asie orientale.
- Europe occidentale, centrale, orientale et septentrionale.
- Balkans, Caucase et régions turcophones.
- Amériques du Nord, centrale et du Sud.
- Caraïbes.
- Océanie et îles du Pacifique.
- Communautés linguistiques diasporiques du monde entier.

Inclure les langues majoritaires, minoritaires, régionales, autochtones, créoles, construites et historiques lorsqu'elles peuvent être identifiées et prises en charge de façon pertinente.

Ne pas supposer qu'une langue est disponible uniquement parce qu'elle est parlée dans un pays donné.

## 3. Dialectes et variantes

Le système doit pouvoir différencier une langue de ses variantes régionales et dialectales.

Exemples de variantes à prendre en compte :

- Arabe standard moderne.
- Arabe classique utilisé dans les textes religieux.
- Variétés arabes du Maghreb.
- Variétés arabes égyptiennes.
- Variétés arabes du Levant.
- Variétés arabes du Golfe.
- Variétés arabes irakiennes.
- Variétés arabes soudanaises.
- Variétés arabes yéménites.
- Français de France, du Canada, de Belgique, de Suisse et d'autres régions.
- Anglais britannique, américain, indien et autres variantes.
- Espagnol européen et latino-américain.
- Portugais européen et brésilien.
- Variétés régionales de l'ourdou, du pendjabi, du kurde, du chinois et d'autres langues.

Cette liste est illustrative et ne doit pas constituer une limite.

Ne pas traiter automatiquement un dialecte comme une langue distincte ni fusionner des langues distinctes sous une même étiquette. Utiliser les identifiants normalisés disponibles et conserver les variantes reconnues.

## 4. Langues africaines et minoritaires

Accorder une attention particulière aux langues africaines et aux langues peu représentées dans les logiciels.

Inclure notamment, sans s'y limiter :

- Swahili, haoussa, yoruba, igbo, amharique, oromo, somali, zoulou, xhosa, afrikaans, wolof, bambara, lingala, kikongo, kinyarwanda, kirundi, shona, peul, tamasheq, akan, ewe, ga, kanouri, sérère, ndebele et autres langues documentées.
- Langues berbères, dont le tamazight, le tachelhit et le tarifit.
- Langues créoles et langues régionales.
- Langues autochtones des Amériques et d'Océanie.

Ces noms sont des exemples de départ, pas un catalogue exhaustif.

Les dialectes, variétés locales et systèmes d'écriture doivent être enregistrés lorsqu'une identification fiable est disponible.

## 5. Langues des signes et langues à représentation particulière

Prévoir une architecture extensible pour les langues des signes, les systèmes d'écriture particuliers et les langues nécessitant des méthodes d'affichage ou de saisie spécifiques.

Ne pas prétendre qu'une traduction en langue des signes est disponible sans disposer d'une ressource adaptée, d'un contenu vidéo ou d'une représentation linguistique appropriée.

## 6. Sélecteur dynamique de langues

Le sélecteur doit être alimenté par un catalogue linguistique actualisable, et non par une liste codée en dur.

Fonctions obligatoires :

- Recherche par nom de langue.
- Recherche par nom dans sa propre écriture.
- Recherche par code de langue.
- Filtrage par région et système d'écriture.
- Affichage du nom natif.
- Affichage de la variante régionale.
- Indication de la disponibilité de l'interface et des contenus.
- Ajout de nouvelles langues sans modification majeure du code.
- Gestion des langues désactivées, expérimentales ou incomplètement traduites.

L'arabe est la langue par défaut du produit, mais l'utilisateur peut sélectionner n'importe quelle autre langue disponible.

## 7. Niveaux de prise en charge

Pour chaque langue ou variante, enregistrer séparément :

1. **Identifiée** : langue répertoriée dans le catalogue.
2. **Affichable** : caractères et écriture correctement pris en charge.
3. **Interface disponible** : menus et fonctions traduits.
4. **Recherche disponible** : recherche adaptée à cette langue.
5. **Traduction automatique disponible** : traduction générée, clairement identifiée.
6. **Contenu documentaire disponible** : sources ou traductions existantes.
7. **Contenu spécialisé vérifié** : ressources contrôlées par des personnes compétentes.
8. **Validation humaine disponible** : possibilité d'obtenir une révision dans cette langue.

Ne jamais afficher une langue comme entièrement prise en charge lorsque seule son étiquette apparaît dans le menu.

## 8. Architecture technique

- Utiliser Unicode pour le stockage et l'affichage des textes.
- Utiliser BCP 47 pour identifier les langues et variantes compatibles.
- Exploiter ISO 639 pour les codes de langue.
- Exploiter Unicode CLDR pour les noms de langues, les formats locaux et les conventions d'internationalisation.
- Prendre en charge les écritures de droite à gauche et de gauche à droite.
- Prévoir les langues utilisant plusieurs systèmes d'écriture.
- Séparer les données linguistiques du code de l'application.
- Permettre les mises à jour du catalogue.
- Tester les langues peu représentées, les caractères combinés et les textes multilingues.

Ne pas créer artificiellement un code de langue officiel lorsqu'il n'existe pas. Pour les dialectes sans identifiant normalisé approprié, utiliser un identifiant interne documenté, lié à la langue concernée et clairement distingué d'un code officiel.

## 9. Traduction responsable

La plateforme peut utiliser des systèmes de traduction automatique pour élargir l'accessibilité, mais elle doit toujours distinguer :

- Une traduction humaine publiée.
- Une traduction humaine validée.
- Une traduction automatique.
- Une traduction automatique relue par un spécialiste.
- Un contenu original non traduit.

Pour les textes religieux et les termes techniques des sciences du hadith, conserver systématiquement l'original arabe et la provenance de chaque traduction.

Ne jamais inventer une traduction prétendument officielle ou une validation inexistante.

## 10. Objectif de réalisation

L'objectif est une architecture linguistique universelle et extensible, et non la promesse irréaliste que toutes les langues du monde seront traduites parfaitement dès le premier lancement.

L'application doit permettre d'ajouter progressivement chaque langue ou variante identifiée, de tester sa qualité et de signaler honnêtement ses limites.

L'agent principal doit livrer un catalogue linguistique dynamique, les mécanismes d'internationalisation, les tests et une documentation expliquant comment ajouter une nouvelle langue sans reconstruire l'application.
