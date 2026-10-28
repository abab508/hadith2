import brut from "../../data/termes/termes.json";
import { catalogue, chaineDeRepli } from "@/donnees/catalogue";
import { dictionnaire, type Dictionnaire, type Terme } from "@/donnees/schemas/terme";

export function chargerDictionnaire(donnees: unknown, tagsConnus: string[]): Dictionnaire {
  const resultat = dictionnaire.safeParse(donnees);
  if (!resultat.success) {
    throw new Error(`Dictionnaire terminologique invalide :\n${resultat.error.message}`);
  }
  for (const t of [...resultat.data.termes, ...resultat.data.notionsDocumentaires]) {
    const tags = [
      ...Object.keys(t.langues),
      ...Object.values(t.langues).flatMap((traduction) => traduction.langueExplication ? [traduction.langueExplication] : []),
    ];
    const inconnus = tags.filter((tag) => !tagsConnus.includes(tag));
    if (inconnus.length > 0) {
      throw new Error(`Dictionnaire terminologique invalide : ${t.id} utilise des langues hors catalogue (${inconnus.join(", ")})`);
    }
  }
  return resultat.data;
}

export const termes = chargerDictionnaire(
  brut,
  catalogue.entrees.map((e) => e.tag),
);

// Terme dans la langue demandée, en suivant la chaîne de repli puis fr et en.
// Pour l'arabe, le terme affiché est l'arabe original.
export function terme(id: string, tag: string) {
  const t: Terme | undefined = termes.termes.find((x) => x.id === id);
  if (!t) return undefined;
  const ordre = [...chaineDeRepli(tag), "fr", "en"];
  const langue = ordre.find((l) => l in t.langues);
  const traduction = langue ? t.langues[langue] : undefined;
  return { ...t, langueAffichee: langue, traduction };
}
