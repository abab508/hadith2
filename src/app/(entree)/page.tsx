import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { catalogue } from "@/donnees/catalogue";
import OuvertureLangue from "@/composants/OuvertureLangue";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: catalogue.langueParDefaut, namespace: "ouverture" });
  return { title: t("titre") };
}

export default async function Entree() {
  const t = await getTranslations({ locale: catalogue.langueParDefaut, namespace: "ouverture" });
  return (
    <main className="accueil">
      <h1>{t("titre")}</h1>
      <OuvertureLangue chargement={t("chargement")} />
      <noscript>
        <p>{t("sansScript")}</p>
        <p><a href={`/${catalogue.langueParDefaut}`}>{t("arabe")}</a></p>
      </noscript>
    </main>
  );
}
