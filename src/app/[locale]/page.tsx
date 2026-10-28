import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Terme from "@/composants/Terme";
import { Link } from "@/i18n/navigation";

export default function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <main id="contenu" tabIndex={-1} className="accueil">
      <h1>{t("accueil.titre")}</h1>
      <p>{t("accueil.sousTitre")}</p>
      <p className="etat">{t("accueil.etat")}</p>
      <p>
        {t("accueil.exempleTerme")} <Terme id="hasan" />
      </p>
      <p><Link href="/glossaire">{t("accueil.glossaire")}</Link></p>
    </main>
  );
}
