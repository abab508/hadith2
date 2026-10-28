import { catalogue, languesRoutables } from "@/donnees/catalogue";

export type Preferences = {
  interface: string;
  rapport: string;
  recherche: string[];
};

export function preferencesParDefaut(): Preferences {
  const arabe = catalogue.langueParDefaut;
  return { interface: arabe, rapport: arabe, recherche: [arabe] };
}

// Chaque valeur est validée séparément : aucun réglage ne suit un autre.
export function validerPreferences(valeur: unknown): Preferences {
  const defaut = preferencesParDefaut();
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) return defaut;

  const candidate = valeur as Record<string, unknown>;
  const routables = new Set(languesRoutables());
  const langueValide = (tag: unknown): tag is string => typeof tag === "string" && routables.has(tag);
  const recherche = Array.isArray(candidate.recherche) ? candidate.recherche.filter(langueValide) : [];

  return {
    interface: langueValide(candidate.interface) ? candidate.interface : defaut.interface,
    rapport: langueValide(candidate.rapport) ? candidate.rapport : defaut.rapport,
    recherche: [...new Set([...defaut.recherche, ...recherche])],
  };
}

export function serialiserPreferences(valeur: unknown): string {
  return JSON.stringify(validerPreferences(valeur));
}

export function lirePreferences(texte: string | null | undefined): Preferences {
  if (typeof texte !== "string") return preferencesParDefaut();
  try {
    return validerPreferences(JSON.parse(texte) as unknown);
  } catch {
    return preferencesParDefaut();
  }
}

