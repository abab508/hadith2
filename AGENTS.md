# Règles pour les agents Codex — HadithVerify AI

## Interdits
- Ne lis, n'affiche et n'écris aucun secret (variables d'environnement, clés, jetons). Aucun fichier `.env*`.
- Ne modifie pas `.github/workflows/`, `AGENTS.md`, `.gitignore`.
- Aucun déploiement, aucune publication, aucune commande `vercel` ou `gh`.
- Ne supprime pas de données (`data/`, `messages/`, `docs/`) ; ne modifie jamais un texte original arabe.
- N'installe aucun paquet npm autre que ceux déjà dans `package.json`, sauf si la tâche le nomme explicitement.

## Références obligatoires
- Conventions : `docs/memoire/conventions.md` (TypeScript strict, propriétés CSS logiques, aucun libellé en dur, alias `@/`).
- Structure : `docs/conception/structure-dossiers.md`.
- Modèles de données : `docs/conception/donnees/`.
- Langues : tout vient de `data/langues/catalogue.json` ; ajouter une langue ne modifie aucun `.ts`/`.tsx`.
- Next.js 16 : le middleware s'appelle `src/proxy.ts`. Consulte `node_modules/next/dist/docs/` en cas de doute.

## Avant de rendre
Exécute et rapporte le résultat réel de :
- `npm test`
- `npm run build`
- `npm run test:navigateur` (si Playwright est en place)

Si une étape échoue ou si une ressource manque (réseau, fichier), explique le blocage au lieu d'inventer.
