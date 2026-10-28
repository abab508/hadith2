import {
  lirePreferences,
  preferencesParDefaut,
  serialiserPreferences,
  validerPreferences,
  type Preferences,
} from "@/donnees/preferences";

export const cleStockagePreferences = "milaghaiba.preferences.langues";

// Ce repli ne contient que les choix du runtime du navigateur courant.
// Le serveur n'y lit et n'y écrit jamais de préférences de visiteur.
let memoire = preferencesParDefaut();
let stockageIndisponible = false;

export function chargerPreferences(): Preferences {
  if (typeof window === "undefined") return preferencesParDefaut();
  if (!stockageIndisponible) {
    try {
      memoire = lirePreferences(window.localStorage.getItem(cleStockagePreferences));
    } catch {
      stockageIndisponible = true;
    }
  }
  return validerPreferences(memoire);
}

export function enregistrerPreferences(valeur: unknown): Preferences {
  const preferences = validerPreferences(valeur);
  if (typeof window === "undefined") return preferences;
  memoire = preferences;
  try {
    window.localStorage.setItem(cleStockagePreferences, serialiserPreferences(preferences));
    stockageIndisponible = false;
  } catch {
    stockageIndisponible = true;
  }
  return validerPreferences(preferences);
}

export function memoriserInterface(tag: string): Preferences {
  return enregistrerPreferences({ ...chargerPreferences(), interface: tag });
}
