import { afterEach, describe, expect, it, vi } from "vitest";
import * as catalogue from "@/donnees/catalogue";
import {
  lirePreferences,
  preferencesParDefaut,
  serialiserPreferences,
  validerPreferences,
} from "@/donnees/preferences";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("préférences de langue", () => {
  it("propose l'arabe pour chacun des trois réglages", () => {
    expect(preferencesParDefaut()).toEqual({ interface: "ar", rapport: "ar", recherche: ["ar"] });
    const modifiees = preferencesParDefaut();
    modifiees.recherche.push("fr");
    expect(preferencesParDefaut().recherche).toEqual(["ar"]);
  });

  it("valide séparément les tags et ignore les langues inconnues ou non routables", () => {
    vi.spyOn(catalogue, "languesRoutables").mockReturnValue(["ar", "fr", "en", "ur"]);
    expect(validerPreferences({ interface: "inconnu", rapport: "en", recherche: ["ur", "inconnu", "es"] }))
      .toEqual({ interface: "ar", rapport: "en", recherche: ["ar", "ur"] });
    expect(validerPreferences({ interface: "fr", rapport: "es", recherche: [] }))
      .toEqual({ interface: "fr", rapport: "ar", recherche: ["ar"] });
  });

  it("impose l'arabe dans la recherche et retire les doublons et valeurs invalides", () => {
    expect(validerPreferences({ interface: "fr", rapport: "en", recherche: ["ur", "ur", "ar", 1, null, "fr"] }))
      .toEqual({ interface: "fr", rapport: "en", recherche: ["ar", "ur", "fr"] });
    expect(validerPreferences({ recherche: "fr" }).recherche).toEqual(["ar"]);
  });

  it("se replie sans erreur pour un JSON invalide ou une forme inattendue", () => {
    for (const texte of [undefined, null, "", "{", "null", "42", '"fr"', "[]"]) {
      expect(lirePreferences(texte)).toEqual(preferencesParDefaut());
    }
    expect(lirePreferences('{"interface":"fr"}')).toEqual({ interface: "fr", rapport: "ar", recherche: ["ar"] });
  });

  it("sérialise des préférences validées sans lier leurs valeurs", () => {
    const preferences = { interface: "fr", rapport: "en", recherche: ["ar", "ur"] };
    expect(lirePreferences(serialiserPreferences(preferences))).toEqual(preferences);
    expect(validerPreferences({ ...preferences, interface: "ur" }))
      .toEqual({ interface: "ur", rapport: "en", recherche: ["ar", "ur"] });
    expect(validerPreferences({ ...preferences, rapport: "ar" }))
      .toEqual({ interface: "fr", rapport: "ar", recherche: ["ar", "ur"] });
    expect(validerPreferences({ ...preferences, recherche: ["en"] }))
      .toEqual({ interface: "fr", rapport: "en", recherche: ["ar", "en"] });
  });
});

describe("mémorisation visiteur", () => {
  async function moduleNeuf() {
    vi.resetModules();
    return import("@/donnees/preferences-visiteur");
  }

  it("lit et écrit uniquement le stockage local et préserve rapport et recherche au changement d'interface", async () => {
    const donnees = new Map<string, string>();
    const getItem = vi.fn((cle: string) => donnees.get(cle) ?? null);
    const setItem = vi.fn((cle: string, valeur: string) => { donnees.set(cle, valeur); });
    vi.stubGlobal("window", { localStorage: { getItem, setItem } });
    const module = await moduleNeuf();
    expect(module.chargerPreferences()).toEqual(preferencesParDefaut());
    module.enregistrerPreferences({ interface: "fr", rapport: "en", recherche: ["ar", "ur"] });
    expect(module.chargerPreferences()).toEqual({ interface: "fr", rapport: "en", recherche: ["ar", "ur"] });
    expect(module.memoriserInterface("en")).toEqual({ interface: "en", rapport: "en", recherche: ["ar", "ur"] });
    expect(setItem).toHaveBeenCalledWith(module.cleStockagePreferences, serialiserPreferences({ interface: "en", rapport: "en", recherche: ["ar", "ur"] }));
  });

  it("garde les choix en mémoire si l'accès au stockage est interdit", async () => {
    vi.stubGlobal("window", {
      get localStorage(): never { throw new Error("Stockage interdit"); },
    });
    const module = await moduleNeuf();
    expect(module.chargerPreferences()).toEqual(preferencesParDefaut());
    const preferences = { interface: "fr", rapport: "en", recherche: ["ar", "ur"] };
    expect(module.enregistrerPreferences(preferences)).toEqual(preferences);
    expect(module.chargerPreferences()).toEqual(preferences);
    const copie = module.chargerPreferences();
    copie.recherche.push("fr");
    expect(module.chargerPreferences()).toEqual(preferences);
  });

  it("ne remplace pas le repli mémoire par d'anciennes valeurs si une écriture échoue", async () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => serialiserPreferences({ interface: "ar", rapport: "ar", recherche: ["ar"] }),
        setItem: () => { throw new Error("Quota atteint"); },
      },
    });
    const module = await moduleNeuf();
    const preferences = { interface: "fr", rapport: "en", recherche: ["ar", "ur"] };
    module.enregistrerPreferences(preferences);
    expect(module.chargerPreferences()).toEqual(preferences);
  });

  it("se replie sur les valeurs par défaut pour un JSON corrompu dans le stockage", async () => {
    vi.stubGlobal("window", { localStorage: { getItem: () => "{", setItem: vi.fn() } });
    const module = await moduleNeuf();
    expect(module.chargerPreferences()).toEqual(preferencesParDefaut());
  });

  it("n'entretient aucun état visiteur partagé côté serveur", async () => {
    vi.stubGlobal("window", undefined);
    const module = await moduleNeuf();
    module.enregistrerPreferences({ interface: "fr", rapport: "en", recherche: ["ar", "ur"] });
    expect(module.chargerPreferences()).toEqual(preferencesParDefaut());
  });
});
