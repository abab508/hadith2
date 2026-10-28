---
name: revue-de-code
description: Relire un changement de code avant de le présenter au patron.
---
# Fiche : revue de code
1. `git status` puis `git diff --stat`, puis seulement les fichiers modifiés.
2. Build et tests : un échec = bloquant.
3. Vérifie : fait ce qui était demandé, ni plus ni moins ; rien cassé ailleurs ; respecte conventions.md ;
   pas de clé API, mot de passe ou donnée personnelle ; pas de code mort ni de console.log oublié.
4. Classe : bloquant / à améliorer. Verdict : « OK pour livrer » ou « À corriger ».
