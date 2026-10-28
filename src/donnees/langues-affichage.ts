import { catalogue } from "@/donnees/catalogue";
import type { EntreeLangue } from "@/donnees/schemas/langue";

export function languesDuSelecteur(): EntreeLangue[] {
  return catalogue.entrees
    .filter((langue) => langue.statut !== "desactivee")
    .sort((a, b) => Number(b.tag === catalogue.langueParDefaut) - Number(a.tag === catalogue.langueParDefaut));
}

export function nomLangueTraduit(langue: EntreeLangue, tagCourant: string): string {
  const traduit = langue.nomsTraduits?.[tagCourant];
  if (traduit) return traduit;
  try {
    return new Intl.DisplayNames([tagCourant], { type: "language", fallback: "none" }).of(langue.tag) ?? langue.nomNatif;
  } catch {
    return langue.nomNatif;
  }
}
