# Choix de la stack technique — HadithVerify AI (plateforme multilingue)

Auteur : architecte — 2026-10-28
Sources lues : docs/exigences/02-plateforme-multilingue.md (§4, §11, §12), docs/exigences/03-couverture-linguistique-mondiale.md (§6, §7, §8).
État : proposition. Rien n'est installé. Aucun numéro de version n'est donné : il sera fixé à l'installation (dernière version stable vérifiée ce jour-là).

---

## 1. Ce que la stack doit permettre (résumé des exigences)

- Arabe par défaut ; changer de langue à tout moment (02 §12.1-2).
- Ajouter une langue sans réécrire le frontend ni le backend (02 §11, 03 §6).
- Codes de langue BCP 47 / ISO 639 ; noms et formats via CLDR (03 §8).
- RTL et LTR gérés au niveau de chaque composant et de chaque texte, pas seulement de la page (02 §4).
- Ne jamais inverser à la main une chaîne arabe ; Unicode partout (02 §4).
- Catalogue de langues et dictionnaire terminologique dans des fichiers de données, séparés du code (03 §8).
- 8 niveaux de prise en charge enregistrés séparément par langue (03 §7).
- Traductions manquantes détectées et signalées honnêtement ; traductions IA marquées (02 §12.9-11).
- Tests automatisés : changement de langue, textes mixtes, cohérence des fichiers (02 §11-12).

## 2. Socle commun aux 3 options (indépendant du choix)

Ces éléments ne changent pas selon l'option. Ils rendent le choix réversible : les données restent valables si on change de framework.

### 2.1 Fichiers de données (séparés du code)
```
data/
  langues/catalogue.json     -> une entrée par langue ou variante
  termes/termes.json         -> dictionnaire terminologique (terme arabe de référence + équivalents)
messages/
  ar.json  en.json  fr.json ...  -> libellés de l'interface, un fichier par langue
```
- Format des libellés : ICU MessageFormat (pluriels, genres). Format standard, lisible par plusieurs bibliothèques.
- Une entrée du catalogue contient au minimum : `tag` (BCP 47), `codeOfficiel` (vrai/faux), `nomNatif`, `ecriture` (ex. Arab, Latn), `direction` (rtl/ltr), `region`, `police`, `remplacements` (liste ordonnée de langues de secours), `statut` (active / experimentale / desactivee), et `niveaux` avec les 8 niveaux de 03 §7 (identifiee, affichable, interface, recherche, traductionAuto, contenuDocumentaire, contenuVerifie, validationHumaine).
- Dialecte sans code officiel (03 §8) : identifiant BCP 47 à usage privé (partie `-x-`, ex. `ar-x-<nom>`), avec `codeOfficiel: false`. Il reste lié à sa langue et se distingue clairement d'un code officiel.
- Une entrée du dictionnaire contient : `id`, `ar` (terme arabe de référence, toujours conservé — 02 §12.8), puis par langue : `terme`, `explication`, `origine` (humaine / ia), `valide` (oui/non).

### 2.2 Ce que fait le navigateur (API `Intl`, sans bibliothèque)
- `Intl.DisplayNames` : nom d'une langue dans la langue de l'interface (données CLDR du navigateur).
- `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.PluralRules` : dates, nombres, pluriels.
- `Intl.Locale` : lire et vérifier un code BCP 47.
- Limite connue : les données CLDR des navigateurs ne couvrent pas toutes les langues rares. Donc le catalogue stocke toujours le `nomNatif` et la `direction` lui-même ; `Intl` sert d'appoint, jamais de seule source.

### 2.3 Gestion RTL / LTR
- Attributs `lang` et `dir` sur `<html>` selon la langue de l'interface (lue dans le catalogue).
- Dans les contenus mixtes (rapport arabe + français + chiffres + URL) : chaque bloc porte son propre `lang`/`dir` ; `dir="auto"` et la balise `<bdi>` pour isoler les morceaux de sens inconnu.
- CSS en propriétés logiques (`margin-inline-start`, `padding-inline-end`, `text-align: start`) au lieu de left/right : une seule feuille de style pour RTL et LTR.
- Polices : famille Noto (couvre arabe, ourdou en Nastaliq, etc.), fichiers de police servis par le site. Ce sont des fichiers à télécharger (pas une bibliothèque de code) : à signaler au patron au moment de l'ajout.

### 2.4 Contrôles de cohérence
- Un petit script maison (sans bibliothèque) compare les clés de `messages/ar.json` (référence) avec chaque autre langue et liste les manques. Lancé dans les tests.
- Le catalogue et le dictionnaire sont vérifiés par un schéma (voir les options).

---

## 3. Option A — Next.js + next-intl (un seul projet, front et back ensemble)

**Composants**
- Frontend : Next.js (React) en TypeScript.
- Backend : routes API de Next.js dans le même projet (pas de serveur séparé au départ).
- i18n : next-intl (ICU MessageFormat, routes par langue `/ar/...`, `/fr/...`, langue par défaut `ar`).
- RTL/LTR : socle commun §2.3.
- Données : socle commun §2.1, validées par zod.
- Tests : Vitest (unitaires : catalogue, dictionnaire, clés manquantes, langues de secours) + Playwright (navigateur : changement de langue, `dir="rtl"`, textes mixtes).

**Avantages**
- Un seul projet, une seule commande pour lancer : le plus simple à suivre pour un débutant.
- next-intl gère nativement la langue dans l'adresse, la langue par défaut et le format ICU.
- Ajouter une langue = ajouter une ligne au catalogue + un fichier `messages/xx.json`. Aucun code à modifier.
- Très répandu : beaucoup de documentation et d'exemples.

**Limites**
- Next.js a ses propres concepts (composants serveur / client) à apprendre.
- Si plus tard l'analyse IA des hadiths exige Python, il faudra ajouter un service Python à côté (ce qui reste possible sans tout casser).

**Bibliothèques à installer (à valider par le patron)**
- `next`, `react`, `react-dom`, `next-intl`, `zod`
- Outils de développement : `typescript`, `@types/react`, `@types/node`, `vitest`, `@playwright/test` (Playwright télécharge aussi des navigateurs de test)

**Difficulté pour le patron** : faible à moyenne. Un projet, un dossier, une commande.

---

## 4. Option B — Vite + React + react-i18next (front) et Fastify (back), séparés

**Composants**
- Frontend : application React en TypeScript, construite avec Vite.
- Backend : serveur Node.js Fastify séparé (API : catalogue, dictionnaire, rapports).
- i18n : i18next + react-i18next, avec le module ICU pour garder le même format de messages que l'option A.
- RTL/LTR : socle commun §2.3.
- Données : socle commun §2.1, validées par zod (partagé entre front et back).
- Tests : Vitest + Playwright.

**Avantages**
- Front et back bien séparés : on peut remplacer l'un sans toucher l'autre.
- i18next est très utilisé et très souple (chargement des traductions à la demande, détection des clés manquantes intégrée).
- Vite est rapide et simple pour le front seul.

**Limites**
- Deux projets à lancer et à maintenir : plus de choses à comprendre pour un débutant.
- Pas de langue dans l'adresse ni de rendu serveur sans travail en plus (moins bon pour le référencement par langue).
- Plus de bibliothèques à installer.

**Bibliothèques à installer (à valider par le patron)**
- Front : `react`, `react-dom`, `i18next`, `react-i18next`, `i18next-icu`, `intl-messageformat`, `zod`
- Back : `fastify`, `zod`
- Outils de développement : `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/node`, `vitest`, `@playwright/test`

**Difficulté pour le patron** : moyenne. Deux parties qui doivent se parler.

---

## 5. Option C — Vite + React + react-i18next (front) et FastAPI en Python (back)

**Composants**
- Frontend : identique à l'option B.
- Backend : Python avec FastAPI ; validation des données avec Pydantic.
- i18n côté serveur (rapports générés) : Babel (Python), qui s'appuie sur les données CLDR.
- RTL/LTR et données : socle commun.
- Tests : Vitest + Playwright (front), pytest (back).

**Avantages**
- Python est le langage le plus courant pour l'IA et le traitement de l'arabe : utile si l'analyse des hadiths se fait côté serveur.
- Babel donne au serveur les mêmes formats CLDR que le navigateur.

**Limites**
- Deux langages (TypeScript et Python), deux outils d'installation, deux suites de tests : le plus lourd pour un débutant.
- Schémas de données à écrire deux fois (zod côté front, Pydantic côté back) ou à générer.

**Bibliothèques à installer (à valider par le patron)**
- Front : comme l'option B (sans Fastify).
- Back (Python) : `fastapi`, `uvicorn`, `pydantic`, `babel`, `pytest`

**Difficulté pour le patron** : élevée. À garder pour plus tard si l'IA l'impose.

---

## 6. Tableau comparatif

| Critère | A — Next.js + next-intl | B — Vite/React + Fastify | C — Vite/React + FastAPI |
|---|---|---|---|
| Nombre de projets | 1 | 2 | 2 (2 langages) |
| Langue dans l'adresse (`/ar/`) | Oui, intégré | À construire | À construire |
| Ajout d'une langue sans code | Oui | Oui | Oui |
| Format des messages | ICU | ICU (via module) | ICU (via module) |
| Proximité avec l'IA en Python | Service à ajouter plus tard | Service à ajouter plus tard | Directe |
| Bibliothèques à installer | La liste la plus courte | Plus longue | La plus longue |
| Difficulté patron | Faible à moyenne | Moyenne | Élevée |

---

## 7. Recommandation — à valider par le patron

**Option A : Next.js + next-intl, TypeScript, données en JSON validées par zod, tests Vitest + Playwright.**

Raisons :
- La plus simple : un seul projet, une seule commande, la liste de bibliothèques la plus courte.
- La plus réversible : le catalogue, le dictionnaire et les messages sont des fichiers JSON au format ICU, indépendants du framework. Passer plus tard à l'option B ou C ne demande pas de refaire les données.
- Couvre toutes les exigences listées au §1, avec `Intl` du navigateur pour CLDR et le catalogue comme source de vérité (nom natif, direction, niveaux).
- Si l'analyse IA demande Python, on ajoute un service Python à côté (vers l'option C) sans réécrire l'interface.

Points à valider par le patron avant toute installation :
1. Le choix de l'option A.
2. L'installation des bibliothèques listées au §3 (aucune n'est installée à ce jour).
3. Le téléchargement des polices Noto (fichiers servis par le site).

## 8. Consigne pour le tech-lead (une fois l'option validée)

1. Créer le projet Next.js en TypeScript ; configurer next-intl avec `ar` par défaut et la liste des langues lue dans `data/langues/catalogue.json` (jamais codée en dur).
2. Créer `data/langues/catalogue.json` avec au minimum : ar, en, fr, es, ur, id, ms, tr (02 §12.3), avec direction, nom natif, langues de secours et les 8 niveaux, renseignés honnêtement (pas de niveau « disponible » sans contenu réel).
3. Créer `data/termes/termes.json` (structure §2.1) et les schémas zod du catalogue et du dictionnaire.
4. Poser `lang`/`dir` sur `<html>`, CSS en propriétés logiques uniquement, `<bdi>`/`dir="auto"` dans les blocs mixtes.
5. Écrire le script de détection des clés manquantes et l'affichage d'un repli signalé (« traduction manquante ») plutôt qu'un texte vide.
6. Tests : Vitest (schémas, clés manquantes, langues de secours, identifiants `-x-`) ; Playwright (passage ar → fr → ur, vérification de `dir`, page avec texte arabe + français + chiffres + URL).
