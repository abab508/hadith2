# Conventions de code du projet
Référence détaillée : docs/conception/structure-dossiers.md (2026-10-28).

## Organisation
- Code dans `src/` ; données dans `data/` ; libellés d'interface dans `messages/<tag>.json` ; contrôles dans `scripts/` ; tests dans `tests/unitaires/` (Vitest) et `tests/navigateur/` (Playwright).
- Jamais de liste de langues, de direction ou de nom de langue codés en dur : tout vient de `data/langues/catalogue.json`.
- Ajouter une langue ne modifie aucun fichier `.ts`/`.tsx`.

## TypeScript
- `strict: true` et `noUncheckedIndexedAccess: true`. Pas de `any` (utiliser `unknown` puis zod). Pas de `@ts-ignore`.
- Toute donnée lue dans `data/` est validée par son schéma zod (`src/donnees/schemas/`) avant usage.
- Imports internes via l'alias `@/` (= `src/`).

## Nommage
- Composants : `PascalCase.tsx` dans `src/composants/` ; autres fichiers : `kebab-case` ou `camelCase.ts`.
- Noms de domaine en français sans accent (`catalogue`, `chaineDeRepli`, `nomNatif`), comme dans les modèles de données. Les noms imposés par Next.js restent tels quels (`page.tsx`, `layout.tsx`).
- Clés de traduction : `<espace>.<element>` ou `<espace>.<zone>.<element>`, camelCase ASCII, nommées d'après le sens. Clé réservée `_meta` (`origine`, `relu`). Jamais de clé construite par concaténation.

## Textes de l'interface
- Aucun libellé en dur dans les composants : tout passe par `messages/` (next-intl, format ICU). Seules exceptions : données lues dans `data/`.
- Nouvelle clé créée d'abord dans `messages/ar.json` (référence).
- Traduction manquante : repli `[tag, ...remplacements, ar]` signalé à l'écran, jamais un texte vide.
- Traduction écrite par une IA : `_meta.origine: "ia"`.

## Langue et direction
- `lang` et `dir` sur `<html>` d'après le catalogue ; chaque bloc d'une autre langue porte son propre `lang`/`dir` (`BlocLangue`).
- Morceaux de direction inconnue (saisie, URL, noms) isolés par `<bdi>` ou `dir="auto"` (`TexteIsole`). URL toujours en LTR, jamais traduite ni coupée.
- Ne jamais inverser une chaîne à la main ; texte stocké en Unicode NFC, jamais modifié.

## CSS
- Propriétés logiques uniquement : `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start/end`, `border-inline-*`. Interdit : `left`, `right`, `margin-left/right`, `padding-left/right`, `text-align: left/right`, `float: left/right` (vérifié par `scripts/verifier-css.ts`).
- CSS Modules (`<Nom>.module.css`) ; pas de bibliothèque de style.
- Polices Noto servies par le site (`public/polices/`), déclarées dans `src/styles/polices.css`.

## Termes techniques
- Format affiché : « Terme (arabe — translittération) », ex. « Bon (حسن — ḥasan) » (décision du patron, 2026-10-28).
- La définition n'apparaît jamais dans le texte : seulement en infobulle (survol, focus, toucher) ou dans la fiche du terme.
- Les termes viennent de `data/termes/termes.json` via le composant `Terme` ; jamais dans `messages/`. L'arabe original est toujours affiché ou accessible.

## Vérification avant de rendre
- `npm run build`, `npm test`, `npm run controle` et `npm run test:navigateur` passent.
