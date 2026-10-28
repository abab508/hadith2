import brut from "../../data/langues/catalogue.json" with { type: "json" };
import { catalogueLangues, type CatalogueLangues, type EntreeLangue } from "./schemas/langue";

function charger(donnees: unknown): CatalogueLangues {
  const resultat = catalogueLangues.safeParse(donnees);
  if (!resultat.success) {
    throw new Error(`Catalogue des langues invalide :\n${resultat.error.message}`);
  }
  return resultat.data;
}

export const catalogue = charger(brut);

export function entree(tag: string): EntreeLangue | undefined {
  return catalogue.entrees.find((e) => e.tag === tag);
}

// Langue présente dans les adresses : statut ≠ desactivee et interface traduite.
export function languesRoutables(): string[] {
  return catalogue.entrees
    .filter((e) => e.statut !== "desactivee" && e.niveaux.interface)
    .map((e) => e.tag);
}

// [tag, ...remplacements, langueParDefaut], sans doublon.
export function chaineDeRepli(tag: string): string[] {
  const chaine = [tag, ...(entree(tag)?.remplacements ?? []), catalogue.langueParDefaut];
  return [...new Set(chaine)];
}
