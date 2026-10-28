import { dictionnaire, type Terme } from "@/donnees/schemas/terme";

export type SignalementDictionnaire = {
  niveau: "erreur" | "avertissement";
  code: "schema" | "langue-inconnue" | "arabe-partage" | "translitteration-partagee";
  termes: string[];
  message: string;
};

/** Clés calculées uniquement : les textes du dictionnaire restent intacts. */
function clesTranslitteration(texte: string): string[] {
  const digrammes: Record<string, string> = { š: "sh", ṯ: "th", ḏ: "dh", ḫ: "kh", ġ: "gh", ǧ: "j" };
  const cle = texte.toLowerCase()
    .replace(/[šṯḏḫġǧ]/gu, (lettre) => digrammes[lettre] ?? lettre)
    .normalize("NFD").replace(/\p{M}/gu, "")
    .replace(/[ʿʾʻʼ‘’'`]/gu, "")
    .replace(/wa-al-/gu, "wa-l-")
    .replace(/[-\s]+/gu, " ").trim();
  return [...new Set([cle, cle.replace(/^al /u, "")])];
}

function aNePasConfondre(a: Terme, b: Terme): boolean {
  return a.termesLies.some((lien) => lien.id === b.id && lien.relation === "ne-pas-confondre")
    && b.termesLies.some((lien) => lien.id === a.id && lien.relation === "ne-pas-confondre");
}

/** Schéma, NFC, liens réciproques et collisions de clés de recherche. */
export function verifierTermes(donnees: unknown, tagsConnus?: readonly string[]): SignalementDictionnaire[] {
  const resultat = dictionnaire.safeParse(donnees);
  if (!resultat.success) {
    return resultat.error.issues.map((issue) => ({ niveau: "erreur", code: "schema", termes: [], message: `${issue.path.join(".")} : ${issue.message}` }));
  }
  const signalements: SignalementDictionnaire[] = [];
  const termes = resultat.data.termes;
  for (const terme of [...termes, ...resultat.data.notionsDocumentaires]) {
    const tags = [...Object.keys(terme.langues), ...Object.values(terme.langues).flatMap((traduction) => traduction.langueExplication ? [traduction.langueExplication] : [])];
    for (const tag of new Set(tags)) {
      if (tagsConnus && !tagsConnus.includes(tag)) {
        signalements.push({ niveau: "erreur", code: "langue-inconnue", termes: [terme.id], message: `${terme.id} : langue hors catalogue (${tag}).` });
      }
    }
  }
  for (const [index, a] of termes.entries()) {
    const clesA = new Set([a.translitteration, ...a.variantesTranslitteration].flatMap(clesTranslitteration));
    for (const b of termes.slice(index + 1)) {
      const lies = aNePasConfondre(a, b);
      if (a.ar === b.ar && !lies) {
        signalements.push({ niveau: "erreur", code: "arabe-partage", termes: [a.id, b.id], message: `${a.id} / ${b.id} : même arabe sans lien réciproque ne-pas-confondre.` });
      }
      const partage = [b.translitteration, ...b.variantesTranslitteration].flatMap(clesTranslitteration).find((cle) => clesA.has(cle));
      if (partage) {
        signalements.push({ niveau: lies ? "avertissement" : "erreur", code: "translitteration-partagee", termes: [a.id, b.id], message: `${a.id} / ${b.id} : clé de translittération partagée (${partage})${lies ? ", termes explicitement à ne pas confondre" : ", sans lien réciproque ne-pas-confondre"}.` });
      }
    }
  }
  return signalements;
}
