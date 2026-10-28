import { describe, expect, it } from "vitest";
import ar from "../../messages/ar.json";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { languesRoutables } from "@/donnees/catalogue";
import { cles, fusionnerMessages, type Messages } from "@/i18n/messages";

const fichiers: Record<string, Messages> = { ar, fr, en };

describe("messages de l'interface", () => {
  it("existent pour chaque langue routable", () => {
    for (const tag of languesRoutables()) {
      expect(fichiers[tag], tag).toBeDefined();
    }
  });

  it("ont les mêmes clés que ar.json (référence)", () => {
    const reference = cles(ar).sort();
    for (const [tag, messages] of Object.entries(fichiers)) {
      expect(cles(messages).sort(), tag).toEqual(reference);
    }
  });

  it("complètent une traduction manquante par la langue suivante de la chaîne", () => {
    const partiel: Messages = { accueil: { titre: "Titre" } };
    const fusion = fusionnerMessages([partiel, ar]);
    expect(fusion).toMatchObject({ accueil: { titre: "Titre", etat: ar.accueil.etat } });
    expect(fusion).not.toHaveProperty("_meta");
  });
});
