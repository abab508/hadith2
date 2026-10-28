import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { chaineDeRepli } from "@/donnees/catalogue";
import { fusionnerMessages, type Messages } from "./messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const demande = await requestLocale;
  const locale = hasLocale(routing.locales, demande) ? demande : routing.defaultLocale;

  const sources: Messages[] = [];
  for (const tag of chaineDeRepli(locale)) {
    try {
      sources.push((await import(`../../messages/${tag}.json`)).default as Messages);
    } catch {
      // Pas de fichier pour cette langue : on passe à la suivante de la chaîne.
    }
  }

  return {
    locale,
    messages: fusionnerMessages(sources),
    // Clé absente partout : afficher la clé entre crochets, jamais un texte vide.
    getMessageFallback: ({ namespace, key }) => `[${namespace ? `${namespace}.` : ""}${key}]`,
  };
});
