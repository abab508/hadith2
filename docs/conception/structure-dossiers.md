# Structure des dossiers — HadithVerify AI

Auteur : architecte — 2026-10-28
Sources : docs/conception/choix-stack.md (option A validée par le patron), docs/conception/donnees/modele-langue.md, modele-terme.md, modele-texte-traduction.md, docs/memoire/decisions.md.
État : décision (mode autopilote). Rien n'est encore créé. Aucun numéro de version n'est donné : npm les fixera à l'installation.

---

## 1. Principe

Trois familles, trois endroits :
- **Code** : `src/` (application Next.js, App Router).
- **Données et textes** (modifiables sans toucher au code) : `data/` (langues, termes, textes de hadiths) et `messages/` (libellés de l'interface, un fichier par langue).
- **Contrôles et tests** : `scripts/` (contrôles de cohérence des données) et `tests/` (tests du code).

Le projet Next.js est à la racine du dépôt (un seul `package.json`). `docs/` et `.claude/` restent où ils sont.

## 2. Arborescence commentée

```
hadith/
├─ package.json            scripts npm (dev, build, start, test, test:navigateur, controle)
├─ package-lock.json       versions exactes installées (versionné)
├─ tsconfig.json           TypeScript strict (voir conventions.md)
├─ next.config.ts          branche le plugin next-intl sur src/i18n/request.ts
├─ vitest.config.ts        tests unitaires + contrôles
├─ playwright.config.ts    tests navigateur (testDir: tests/navigateur)
├─ .gitignore              node_modules, .next, test-results, playwright-report
│
├─ data/                   DONNÉES — jamais de code ici
│  ├─ langues/catalogue.json   catalogue des langues (modele-langue.md) : source de vérité
│  ├─ termes/termes.json       dictionnaire terminologique (modele-terme.md)
│  └─ textes/<id>.json         un fichier par hadith (modele-texte-traduction.md)
│
├─ messages/               LIBELLÉS DE L'INTERFACE — format ICU, un fichier par tag BCP 47
│  ├─ ar.json              fichier de référence (toutes les clés)
│  ├─ fr.json  en.json  ur.json ...
│
├─ public/
│  └─ polices/<Famille>/   fichiers .woff2 Noto + licence OFL (ex. public/polices/NotoNaskhArabic/)
│
├─ scripts/                CONTRÔLES DE COHÉRENCE — séparés du code de l'application
│  ├─ verifier-messages.ts     clés manquantes / en trop par langue vs ar.json ; calcule la complétude
│  ├─ verifier-donnees.ts      valide catalogue, termes, textes avec les schémas zod + règles croisées
│  ├─ verifier-css.ts          refuse left/right physiques dans les .css (propriétés logiques seulement)
│  └─ controles.test.ts        lance les 3 vérifications via Vitest (npm run controle)
│
├─ src/                    CODE
│  ├─ app/
│  │  └─ [locale]/
│  │     ├─ layout.tsx     <html lang dir> lus dans le catalogue ; police de la langue
│  │     ├─ page.tsx       accueil
│  │     └─ not-found.tsx
│  ├─ i18n/
│  │  ├─ routing.ts        langues routables lues dans le catalogue, ar par défaut
│  │  ├─ navigation.ts     Link / redirect / useRouter conscients de la langue (next-intl)
│  │  └─ request.ts        charge messages/<tag>.json + chaîne de repli
│  ├─ middleware.ts        redirige / vers /ar (voir §5 : nom du fichier selon la version de Next.js)
│  ├─ donnees/
│  │  ├─ schemas/langue.ts   schéma zod du catalogue
│  │  ├─ schemas/terme.ts    schéma zod du dictionnaire
│  │  ├─ schemas/texte.ts    schéma zod d'un texte/traduction
│  │  ├─ catalogue.ts        lecture + validation du catalogue, fonctions (entree(tag), languesRoutables(), chaineDeRepli(tag))
│  │  └─ termes.ts           lecture + validation du dictionnaire, terme(id, tag)
│  ├─ composants/
│  │  ├─ Terme.tsx           affiche « Terme (arabe — translittération) », définition en infobulle
│  │  ├─ TexteIsole.tsx      <bdi> / dir="auto" pour les morceaux de sens inconnu (URL, saisie)
│  │  ├─ BlocLangue.tsx      bloc avec son propre lang/dir (contenus mixtes)
│  │  └─ SelecteurLangue.tsx
│  │     (chaque composant peut avoir son <Nom>.module.css à côté)
│  └─ styles/
│     ├─ global.css          styles de base, propriétés logiques uniquement
│     └─ polices.css         @font-face des polices de public/polices/
│
└─ tests/
   ├─ unitaires/<sujet>.test.ts     Vitest : catalogue, repli, identifiants -x-, Terme…
   └─ navigateur/<parcours>.spec.ts Playwright : ar → fr → ur, dir, texte mixte
```

## 3. Où va chaque type de fichier

| Type de fichier | Endroit | Règle |
|---|---|---|
| Page / route | `src/app/[locale]/…/page.tsx` | Toujours sous `[locale]`. |
| Composant React | `src/composants/<NomEnPascalCase>.tsx` | Aucun libellé en dur. |
| Style d'un composant | `src/composants/<Nom>.module.css` | Propriétés logiques seulement. |
| Libellé d'interface | `messages/<tag>.json` | Clé d'abord ajoutée dans `ar.json`. |
| Langue ou variante | `data/langues/catalogue.json` | Une entrée = un tag = une écriture. |
| Terme technique | `data/termes/termes.json` | Jamais dans `messages/`. |
| Hadith / traduction | `data/textes/<id>.json` | Original jamais modifié. |
| Schéma de données | `src/donnees/schemas/` | Un schéma zod par modèle. |
| Script de contrôle | `scripts/verifier-<sujet>.ts` | Fonction pure + appel dans `controles.test.ts`. |
| Test unitaire | `tests/unitaires/<sujet>.test.ts` | Vitest. |
| Test navigateur | `tests/navigateur/<parcours>.spec.ts` | Playwright. |
| Police | `public/polices/<Famille>/` + `src/styles/polices.css` | Fichier de licence à côté. |

Les contrôles passent par Vitest (déjà autorisé) : pas besoin d'un outil en plus pour exécuter du TypeScript.

## 4. Ajouter une langue (aucun fichier .ts/.tsx à modifier)

1. `data/langues/catalogue.json` : ajouter l'entrée (modele-langue.md §2), augmenter `version`, mettre `miseAJour`. Niveaux honnêtes : `interface: true` seulement si l'étape 2 est faite.
2. `messages/<tag>.json` : copier les clés de `ar.json` et traduire ; renseigner `_meta` (§6.4). Les clés non traduites peuvent manquer : le repli les remplace et les signale.
3. Si la langue a besoin d'une police absente : fichiers dans `public/polices/<Famille>/` + bloc `@font-face` dans `src/styles/polices.css` (fichier CSS, pas de code). Toute nouvelle police = validation du patron.
4. `data/termes/termes.json` (facultatif) : ajouter `langues.<tag>` aux termes traduits, avec `origine` et `statutValidation`.
5. Lancer `npm run controle` puis `npm test`. La complétude de l'interface est affichée par le contrôle (jamais stockée).
6. Rebuild : la liste des langues routables est lue au build. La mise en ligne reste une décision du patron.

Une langue apparaît dans les adresses seulement si `statut` ≠ `desactivee` et `niveaux.interface` = `true`. Les autres restent visibles (grisées) dans le sélecteur selon les règles du designer.

## 5. Routage des langues

- Adresse toujours préfixée par le tag : `/ar/...`, `/fr/...`, `/ur/...`, `/ar-x-<nom>/...` (tag tel qu'écrit dans le catalogue).
- `/` (et toute adresse sans langue) → redirection vers `/ar/...` (arabe par défaut, 03 §6).
- Pas de détection de la langue du navigateur (H-01) ; pas de cookie de langue (H-02 : la préférence ira dans le stockage local, tâche ultérieure).
- Configuration next-intl dans `src/i18n/routing.ts` : `locales` = `languesRoutables()` lues dans le catalogue, `defaultLocale: 'ar'`, `localePrefix: 'always'`, détection de langue désactivée, cookie de langue désactivé. Les noms exacts des options (`localeDetection`, `localeCookie`) sont à vérifier dans la documentation de la version installée de next-intl.
- Fichier du middleware : `src/middleware.ts` ; si la version installée de Next.js l'a renommé (`proxy.ts`), suivre la documentation de cette version.
- Tag inconnu dans l'adresse → `notFound()` (page 404), jamais d'affichage dans une langue non prévue.
- Chaîne de repli des libellés : `[tag, ...remplacements, ar]` (decisions.md : repli final implicite sur `ar`). Construite par `chaineDeRepli(tag)` à partir du catalogue, jamais codée en dur.

## 6. Clés de traduction (messages/*.json)

1. Structure imbriquée, 2 à 3 niveaux : `<espace>.<element>` ou `<espace>.<zone>.<element>`. L'espace = l'écran ou le composant (`accueil`, `selecteurLangue`, `rapport`, `commun`).
2. Clés en camelCase, ASCII, français sans accent : `selecteurLangue.titre`, `rapport.statut.aValider`, `commun.boutons.annuler`.
3. Clé = le sens, pas le texte : `rapport.aucunResultat`, pas `rapport.pasDeResultatTrouve`.
4. Clé réservée `_meta` en tête de chaque fichier : `{"origine": "humaine" | "ia", "relu": false}`. Ignorée par le contrôle des clés. Toute traduction écrite par une IA porte `"origine": "ia"` (02 §12.9-11).
5. Variables ICU nommées en français : `{nombre}`, `{langue}`, `{date}`. Pluriels avec `{nombre, plural, ...}` (catégories propres à chaque langue, ex. l'arabe en a 6).
6. Jamais de clé construite par concaténation (`t('statut.' + x)`) : le contrôle ne pourrait pas la voir. Utiliser un objet de correspondance explicite.
7. `ar.json` est la référence : toute nouvelle clé y est créée d'abord.
8. Les termes techniques ne vont jamais dans `messages/` : ils viennent de `data/termes/termes.json` via le composant `Terme`.

## 7. Consigne pour le tech-lead — squelette

Pré-requis : `git status` propre ; Node.js et npm présents (`node -v`, `npm -v` ; noter les versions lues dans le journal, ne pas les supposer).

**Installation (exactement ces commandes, rien d'autre)** :
```
npm init -y
npm install next react react-dom next-intl zod
npm install --save-dev typescript @types/react @types/node vitest @playwright/test
npx playwright install chromium
```
- Ne pas utiliser `create-next-app` (il ajoute des paquets non validés et refuse un dossier déjà rempli).
- Si un outil demande un autre paquet (ex. Next.js qui propose d'installer un paquet de types manquant) : ne pas l'installer, marquer la tâche [!] avec le nom du paquet.
- Les versions installées sont celles écrites par npm dans `package.json` ; les recopier dans le rapport.

**Fichiers à créer** (arborescence §2) :
1. `package.json` → scripts : `dev` = `next dev`, `build` = `next build`, `start` = `next start`, `test` = `vitest run`, `test:navigateur` = `playwright test`, `controle` = `vitest run scripts`.
2. `tsconfig.json` : `strict: true`, `noUncheckedIndexedAccess: true`, `resolveJsonModule: true`, alias `@/*` → `./src/*`.
3. `next.config.ts` avec le plugin next-intl pointant sur `./src/i18n/request.ts`.
4. `src/donnees/schemas/*.ts` d'après les 3 modèles de `docs/conception/donnees/` ; `catalogue.ts` et `termes.ts` valident au chargement (erreur claire si invalide).
5. `data/langues/catalogue.json` : ar, en, fr, es, ur, id, ms, tr (02 §12.3), niveaux honnêtes. `interface: true` seulement pour ar, fr, en, ur (les 4 fichiers de messages du squelette).
6. `data/termes/termes.json` : 1 ou 2 termes d'exemple tirés de l'exigence 01, `statutValidation: "a-valider-specialiste"`, `references: []`, aucun nom de spécialiste.
7. `messages/ar.json`, `fr.json`, `en.json`, `ur.json` : quelques clés (`accueil.titre`, `selecteurLangue.*`, `commun.repliSignale`), `_meta.origine: "ia"`, `relu: false`.
8. `src/i18n/routing.ts`, `navigation.ts`, `request.ts`, `src/middleware.ts` (§5). `request.ts` fusionne les messages selon `chaineDeRepli(tag)` et garde la liste des clés venues d'une autre langue ; si la page en contient, afficher le libellé `commun.repliSignale` (« certaines parties ne sont pas encore traduites »). Clé absente partout → afficher la clé entre crochets, jamais un texte vide.
9. `src/app/[locale]/layout.tsx` : `<html lang={tag} dir={direction}>` depuis le catalogue ; variable CSS de police depuis `police.famille`.
10. Composants `Terme`, `TexteIsole`, `BlocLangue`, `SelecteurLangue` (version minimale : liste des langues routables, nom natif lu dans le catalogue).
11. Polices : télécharger depuis le projet officiel Noto (notofonts.github.io) ou Google Fonts les `.woff2` de Noto Naskh Arabic, Noto Nastaliq Urdu et Noto Sans, avec leur licence OFL, dans `public/polices/` ; `@font-face` dans `src/styles/polices.css`.
12. `scripts/verifier-messages.ts`, `verifier-donnees.ts`, `verifier-css.ts`, `controles.test.ts`.
13. Tests : Vitest (schémas, clés manquantes, chaîne de repli, identifiants `-x-`, format du composant `Terme`) ; Playwright (`/` → `/ar`, `dir="rtl"` sur ar et ur, `dir="ltr"` sur fr, passage ar → fr → ur, page arabe + français + chiffres + URL).
14. `.gitignore` : `node_modules/`, `.next/`, `test-results/`, `playwright-report/`.

**Fini quand** : `npm run build`, `npm test`, `npm run controle` et `npm run test:navigateur` passent. Aucun commit poussé.
