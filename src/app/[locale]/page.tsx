import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { entree } from "@/donnees/catalogue";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <main className="accueil">
      <h1>{t("accueil.titre")}</h1>
      <p>{t("accueil.sousTitre")}</p>
      <p className="etat">{t("accueil.etat")}</p>
      <nav aria-label={t("selecteurLangue.titre")}>
        <ul className="langues">
          {routing.locales.map((tag) => {
            const langue = entree(tag);
            return (
              <li key={tag} lang={tag} dir={langue?.direction}>
                <Link href="/" locale={tag} aria-current={tag === locale ? "page" : undefined}>
                  {langue?.nomNatif ?? tag}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
