// Autopilote : empeche Claude de s'arreter tant qu'il reste des taches "- [ ]"
// dans docs/memoire/taches.md. Actif seulement si le fichier .claude/autopilote.on existe.
const fs = require("fs");
const path = require("path");

const MAX_RELANCES = 20; // securite anti-boucle

let entree = "";
process.stdin.on("data", (d) => (entree += d));
process.stdin.on("end", () => {
  let data = {};
  try { data = JSON.parse(entree || "{}"); } catch (e) {}
  const racine = process.env.CLAUDE_PROJECT_DIR || data.cwd || process.cwd();
  const drapeau = path.join(racine, ".claude", "autopilote.on");
  const compteur = path.join(racine, ".claude", "autopilote.compteur");
  const taches = path.join(racine, "docs", "memoire", "taches.md");

  if (!fs.existsSync(drapeau)) process.exit(0); // autopilote eteint : arret normal

  const contenu = fs.existsSync(taches) ? fs.readFileSync(taches, "utf8") : "";
  const restantes = contenu.split(/\r?\n/).filter((l) => /^\s*- \[ \]/.test(l));

  let n = 0;
  try { n = parseInt(fs.readFileSync(compteur, "utf8"), 10) || 0; } catch (e) {}

  const arreter = (raison) => {
    try { fs.unlinkSync(drapeau); } catch (e) {}
    try { fs.unlinkSync(compteur); } catch (e) {}
    process.stderr.write(raison + "\n");
    process.exit(0);
  };

  if (restantes.length === 0) arreter("Autopilote : toutes les taches sont faites.");
  if (n >= MAX_RELANCES) arreter("Autopilote : limite de " + MAX_RELANCES + " relances atteinte, arret de securite.");

  fs.writeFileSync(compteur, String(n + 1));
  console.log(JSON.stringify({
    decision: "block",
    reason:
      "Mode autopilote : il reste " + restantes.length + " tache(s) dans docs/memoire/taches.md. " +
      "Fais mettre a jour le journal par secretaire, puis passe a la prochaine tache '- [ ]' " +
      "avec le bon circuit (conception, ou stratégie si [strategie]). Coche-la '- [x]' quand elle est terminée, " +
      "ou marque-la '- [!]' avec la raison si elle a besoin du patron. Prochaine tache : " +
      restantes[0].replace(/^\s*- \[ \]\s*/, ""),
  }));
  process.exit(0);
});
