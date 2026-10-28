import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import ar from "../../messages/ar.json";
import { languesRoutables } from "@/donnees/catalogue";
import { cles, fusionnerMessages, type Messages } from "@/i18n/messages";

const repertoire = new URL("../../messages/", import.meta.url);
const fichiers: Record<string, Messages> = Object.fromEntries(
  readdirSync(repertoire).filter((nom) => nom.endsWith(".json")).map((nom) => [
    nom.slice(0, -5), JSON.parse(readFileSync(new URL(nom, repertoire), "utf8")) as Messages,
  ]),
);

describe("messages de l'interface", () => {
  it("existent pour chaque langue routable", () => {
    for (const tag of languesRoutables()) {
      expect(fichiers[tag], tag).toBeDefined();
    }
  });

  it("ont les mêmes clés que ar.json (référence)", () => {
    expect(Object.keys(fichiers)).toHaveLength(8);
    const reference = cles(ar).sort();
    for (const [tag, messages] of Object.entries(fichiers)) {
      expect(cles(messages).sort(), tag).toEqual(reference);
    }
  });

  it("identifient les traductions IA comme non relues", () => {
    for (const [tag, messages] of Object.entries(fichiers)) {
      expect(messages._meta, tag).toEqual({ origine: "ia", relu: false });
    }
  });

  it("complètent une traduction manquante par la langue suivante de la chaîne", () => {
    const partiel: Messages = { accueil: { titre: "Titre" } };
    const fusion = fusionnerMessages([partiel, ar]);
    expect(fusion).toMatchObject({ accueil: { titre: "Titre", etat: ar.accueil.etat } });
    expect(fusion).not.toHaveProperty("_meta");
  });
});
