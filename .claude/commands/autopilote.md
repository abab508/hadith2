---
description: Lance l'autopilote sur les tâches de docs/memoire/taches.md
---
1. Allume l'autopilote : node -e "require('fs').writeFileSync('.claude/autopilote.on','')"
2. Lis seulement CLAUDE.md, docs/memoire/synthese.md et docs/memoire/taches.md.
3. Traite la première tâche « - [ ] » avec le bon circuit (section « Mode autopilote » de CLAUDE.md). Aucune question.
4. Tâche finie : coche-la, secretaire écrit 3 lignes au journal, tâche suivante.
5. Quand il n'en reste plus : secretaire met à jour synthese.md, puis rapport final au patron.
