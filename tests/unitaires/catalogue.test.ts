import { describe, expect, it } from "vitest";
import brut from "../../data/langues/catalogue.json";
import { catalogue, chaineDeRepli, entree, languesRoutables } from "@/donnees/catalogue";
import { catalogueLangues } from "@/donnees/schemas/langue";

describe("catalogue des langues", () => {
  it("est valide et a l'arabe par défaut", () => {
    expect(catalogue.langueParDefaut).toBe("ar");
    expect(entree("ar")?.direction).toBe("rtl");
  });

  it("ne rend routables que les langues actives avec interface", () => {
    expect(languesRoutables()).toEqual(["ar", "fr", "en", "ur"]);
  });

  it("construit la chaîne de repli [tag, ...remplacements, ar]", () => {
    expect(chaineDeRepli("fr")).toEqual(["fr", "en", "ar"]);
    expect(chaineDeRepli("ar")).toEqual(["ar"]);
  });

  it("refuse un identifiant -x- déclaré officiel", () => {
    const faux = structuredClone(brut);
    const premiere = faux.entrees[0]!;
    premiere.tag = "ar-x-test";
    expect(catalogueLangues.safeParse(faux).success).toBe(false);
  });

  it("refuse un remplacement inconnu", () => {
    const faux = structuredClone(brut);
    faux.entrees[1]!.remplacements = ["zz"];
    expect(catalogueLangues.safeParse(faux).success).toBe(false);
  });
});
