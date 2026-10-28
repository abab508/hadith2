import { describe, expect, it } from "vitest";
import ar from "../../messages/ar.json";
import { calculerCompletude } from "@/donnees/completude";
import { cles, type Messages } from "@/i18n/messages";

describe("complétude calculée de l'interface", () => {
  const reference: Messages = {
    _meta: { origine: "ia", relu: false },
    accueil: { titre: "Titre", aide: "Aide" },
    commun: { retour: "Retour" },
  };

  it("compte les clés imbriquées de référence présentes dans la langue", () => {
    expect(calculerCompletude(reference, { accueil: { titre: "Title" } })).toEqual({
      presentes: 1, total: 3, proportion: 1 / 3,
    });
  });

  it("ignore _meta et les clés supplémentaires sans gonfler le pourcentage", () => {
    expect(calculerCompletude(reference, {
      _meta: { origine: "humaine", relu: true },
      accueil: { titre: "Title", aide: "Help", supplement: "Extra" },
      commun: { retour: "Back" },
      autre: "Extra",
    })).toEqual({ presentes: 3, total: 3, proportion: 1 });
  });

  it("ne compte pas une branche remplaçant une clé ni une clé remplaçant une branche", () => {
    expect(calculerCompletude(reference, {
      accueil: "Home", commun: { retour: { imbrique: "Back" } },
    })).toEqual({ presentes: 0, total: 3, proportion: 0 });
  });

  it("affiche zéro si le fichier de langue manque", () => {
    expect(calculerCompletude(reference, undefined)).toEqual({ presentes: 0, total: 3, proportion: 0 });
  });

  it("reste défini pour une référence vide", () => {
    expect(calculerCompletude({}, { accueil: { titre: "Title" } })).toEqual({ presentes: 0, total: 0, proportion: 0 });
  });

  it("recalcule le résultat lorsqu'une nouvelle clé de référence est ajoutée", () => {
    const nouvelleReference = { ...reference, ajout: "Nouveau" };
    expect(calculerCompletude(reference, reference).proportion).toBe(1);
    expect(calculerCompletude(nouvelleReference, reference)).toEqual({ presentes: 3, total: 4, proportion: 0.75 });
    expect(reference).not.toHaveProperty("ajout");
  });

  it("prend réellement ar.json comme référence et exclut ses métadonnées", () => {
    const calcul = calculerCompletude(ar, ar);
    expect(calcul).toEqual({ presentes: cles(ar).length, total: cles(ar).length, proportion: 1 });
    expect(calcul.total).toBeGreaterThan(0);
    expect(cles(ar).some((cle) => cle.startsWith("_meta"))).toBe(false);
  });
});
