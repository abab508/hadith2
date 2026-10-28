import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { chaineDeRepli } from "@/donnees/catalogue";
import { messagesDe } from "./charger";
import { fusionnerMessages, type Messages } from "./messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const demande = await requestLocale;
  const locale = hasLocale(routing.locales, demande) ? demande : routing.defaultLocale;

  // Pas de fichier pour une langue de la chaîne : on passe à la suivante.
  const sources = (await Promise.all(chaineDeRepli(locale).map(messagesDe))).filter(
    (m): m is Messages => m !== undefined,
  );

  return {
    locale,
    messages: fusionnerMessages(sources),
    // Clé absente partout : afficher la clé entre crochets, jamais un texte vide.
    getMessageFallback: ({ namespace, key }) => `[${namespace ? `${namespace}.` : ""}${key}]`,
  };
});
