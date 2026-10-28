// Les booléens n'apparaissent que dans _meta (origine, relu), ignoré à la fusion.
export type Messages = { [cle: string]: string | boolean | Messages };

// Fusionne les fichiers dans l'ordre de la chaîne de repli : le premier qui définit une clé gagne.
export function fusionnerMessages(sources: Messages[]): Messages {
  const resultat: Messages = {};
  for (const source of [...sources].reverse()) {
    fusionner(resultat, source);
  }
  return resultat;
}

function fusionner(cible: Messages, source: Messages): void {
  for (const [cle, valeur] of Object.entries(source)) {
    if (cle === "_meta") continue;
    const existante = cible[cle];
    if (typeof valeur === "object" && typeof existante === "object") {
      fusionner(existante, valeur);
    } else {
      cible[cle] = typeof valeur === "object" ? structuredClone(valeur) : valeur;
    }
  }
}

// Liste des clés « a.b.c » d'un fichier de messages, hors _meta.
export function cles(messages: Messages, prefixe = ""): string[] {
  return Object.entries(messages).flatMap(([cle, valeur]) => {
    if (cle === "_meta") return [];
    const chemin = prefixe ? `${prefixe}.${cle}` : cle;
    return typeof valeur === "object" ? cles(valeur, chemin) : [chemin];
  });
}
