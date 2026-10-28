import { catalogue } from "@/donnees/catalogue";
import { cles, type Messages } from "./messages";

export async function messagesDe(tag: string): Promise<Messages | undefined> {
  try {
    return (await import(`../../messages/${tag}.json`)).default as Messages;
  } catch {
    return undefined;
  }
}

// Clés de la référence absentes du fichier de cette langue (remplacées par le repli).
export async function clesManquantes(tag: string): Promise<string[]> {
  const reference = await messagesDe(catalogue.langueParDefaut);
  const propres = new Set(cles((await messagesDe(tag)) ?? {}));
  return reference ? cles(reference).filter((c) => !propres.has(c)) : [];
}
