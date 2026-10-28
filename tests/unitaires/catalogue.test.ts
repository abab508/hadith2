import { describe, expect, it } from "vitest";
import brut from "../../data/langues/catalogue.json";
import { catalogue, chaineDeRepli, entree, languesRoutables } from "@/donnees/catalogue";
import { catalogueLangues } from "@/donnees/schemas/langue";
import { languesDuSelecteur, nomLangueTraduit } from "@/donnees/langues-affichage";

describe("catalogue des langues", () => {
  it("est valide et a l'arabe par défaut", () => {
    expect(catalogue.langueParDefaut).toBe("ar");
    expect(entree("ar")?.direction).toBe("rtl");
  });

  it("ne rend routables que les langues actives avec interface", () => {
    expect(languesRoutables()).toEqual(["ar", "fr", "en", "ur", "es", "id", "ms", "tr"]);
  });

  it("déclare honnêtement les langues de lancement expérimentales", () => {
    for (const tag of ["es", "id", "ms", "tr"]) {
      expect(entree(tag)).toMatchObject({
        direction: "ltr", ecriture: "Latn", statut: "experimentale",
        police: { famille: "Noto Sans" },
        niveaux: { interface: true, contenuDocumentaire: false, contenuVerifie: false, validationHumaine: false },
      });
      expect(Object.keys(entree(tag)?.nomsTraduits ?? {}).sort()).toEqual(["ar", "en", "fr"]);
    }
  });

  it("épingle la langue par défaut avant les autres langues visibles", () => {
    expect(languesDuSelecteur()[0]?.tag).toBe(catalogue.langueParDefaut);
    expect(languesDuSelecteur().every((langue) => langue.statut !== "desactivee")).toBe(true);
  });

  it("préfère le nom traduit du catalogue et utilise ensuite Intl.DisplayNames", () => {
    const espagnol = entree("es")!;
    expect(nomLangueTraduit(espagnol, "fr")).toBe("espagnol");
    expect(nomLangueTraduit(espagnol, "es")).toBe("español");
    expect(nomLangueTraduit({ ...espagnol, tag: "identifiant_invalide", nomsTraduits: undefined }, "fr")).toBe(espagnol.nomNatif);
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
