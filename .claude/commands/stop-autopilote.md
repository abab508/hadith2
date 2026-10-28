---
description: Arrête l'autopilote immédiatement
---
Éteins l'autopilote : node -e "const f=require('fs');['.claude/autopilote.on','.claude/autopilote.compteur'].forEach(p=>{try{f.unlinkSync(p)}catch(e){}})"
Puis fais condenser par secretaire et donne-moi le rapport : fait / reste / à valider.
