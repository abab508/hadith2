import { defineRouting } from "next-intl/routing";
import { catalogue, languesRoutables } from "@/donnees/catalogue";

export const routing = defineRouting({
  locales: languesRoutables(),
  defaultLocale: catalogue.langueParDefaut,
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});
