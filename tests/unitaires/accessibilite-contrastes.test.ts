import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../src/styles/global.css", import.meta.url), "utf8");
const palettes = Array.from(css.matchAll(/:root\s*\{([^}]+)\}/gu), (bloc) => {
  const couleurs = new Map<string, string>();
  for (const declaration of (bloc[1] ?? "").matchAll(/--(fond|texte|discret|accent):\s*(#[\da-f]{6});/giu)) {
    if (declaration[1] && declaration[2]) couleurs.set(declaration[1], declaration[2]);
  }
  return couleurs;
});

function couleur(palette: Map<string, string>, nom: string): string {
  const valeur = palette.get(nom);
  if (!valeur) throw new Error(`Couleur CSS absente : ${nom}`);
  return valeur;
}

// WCAG : conversion sRGB linéaire, puis luminance relative et rapport de contraste.
function luminance(hexadecimal: string): number {
  const canal = (debut: number): number => {
    const valeur = Number.parseInt(hexadecimal.slice(debut, debut + 2), 16) / 255;
    return valeur <= 0.04045 ? valeur / 12.92 : ((valeur + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5);
}

function contraste(premiere: string, seconde: string): number {
  const l1 = luminance(premiere);
  const l2 = luminance(seconde);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

describe("contrastes des couleurs réellement déclarées dans global.css", () => {
  it("calcule les cas de référence sans arrondir avant la comparaison", () => {
    expect(contraste("#000000", "#ffffff")).toBe(21);
    expect(contraste("#ffffff", "#ffffff")).toBe(1);
  });

  it("contrôle les deux palettes, claire et sombre", () => {
    expect(palettes).toHaveLength(2);
    for (const palette of palettes) {
      expect(palette.size).toBe(4);
    }
  });

  for (const [index, mode] of ["clair", "sombre"].entries()) {
    for (const premierPlan of ["texte", "discret", "accent"]) {
      it(`${mode} : ${premierPlan} sur fond satisfait les 4,5:1 du texte courant`, () => {
        const palette = palettes[index];
        expect(palette).toBeDefined();
        if (!palette) throw new Error(`Palette absente : ${mode}`);
        expect(contraste(couleur(palette, premierPlan), couleur(palette, "fond"))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
