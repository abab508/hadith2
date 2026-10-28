import { describe, expect, it } from "vitest";
import brut from "../../data/termes/termes.json";
import { chargerDictionnaire, terme, termes } from "@/donnees/termes";
import { dictionnaire } from "@/donnees/schemas/terme";

const tags = ["ar", "fr", "en", "ur"];
const copie = () => structuredClone(brut) as typeof brut;

describe("dictionnaire terminologique", () => {
  it("est valide et garde l'arabe original", () => {
    expect(termes.termes.length).toBeGreaterThan(0);
    expect(terme("hasan", "fr")?.ar).toBe("حسن");
  });

  it("aucun terme n'est présenté comme validé sans preuve", () => {
    for (const t of termes.termes) {
      if (t.statutValidation === "valide-specialiste") {
        expect(t.notesValidation.length, t.id).toBeGreaterThan(0);
      }
    }
  });

  it("suit la chaîne de repli pour la langue affichée", () => {
    expect(terme("hasan", "ur")?.langueAffichee).toBe("en");
    expect(terme("hasan", "fr")?.traduction?.terme).toBe("Bon");
    expect(terme("inconnu", "fr")).toBeUndefined();
  });

  it("refuse un id en double", () => {
    const d = copie();
    d.termes[1]!.id = d.termes[0]!.id;
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse un terme sans lettre arabe", () => {
    const d = copie();
    d.termes[0]!.ar = "illa";
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse une validation sans note ni référence", () => {
    const d = copie();
    d.termes[0]!.statutValidation = "valide-specialiste";
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse un lien non réciproque", () => {
    const d = copie();
    (d.termes[0]!.termesLies as { id: string; relation: string }[]).push({ id: "hasan", relation: "proche" });
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse une langue hors catalogue", () => {
    const d = copie();
    (d.termes[0]!.langues as Record<string, unknown>)["zz"] = d.termes[0]!.langues.fr;
    expect(() => chargerDictionnaire(d, tags)).toThrow(/hors catalogue/);
  });
});
