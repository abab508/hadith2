"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { languesDuSelecteur, nomLangueTraduit } from "@/donnees/langues-affichage";
import { memoriserInterface } from "@/donnees/preferences-visiteur";
import { Link, usePathname } from "@/i18n/navigation";
import styles from "@/composants/SelecteurLangue.module.css";

export default function SelecteurLangue() {
  const locale = useLocale();
  const t = useTranslations("selecteurLangue");
  const navigation = useTranslations("navigation");
  const chemin = usePathname();
  const requete = useSearchParams().toString();
  const destination = requete ? `${chemin}?${requete}` : chemin;

  return (
    <nav className={styles.selecteur} aria-label={t("titre")}>
      <p className={styles.titre}>{t("titre")}</p>
      <ul className={styles.langues}>
        {languesDuSelecteur().map((langue) => {
          const nom = (
            <>
              <bdi lang={langue.tag} dir={langue.direction} style={{ fontFamily: `"${langue.police.famille}"` }}>
                {langue.nomNatif}
              </bdi>
              {" — "}
              <bdi>{nomLangueTraduit(langue, locale)}</bdi>
            </>
          );
          return (
            <li key={langue.tag}>
              {langue.niveaux.interface ? (
                <Link href={destination} locale={langue.tag} hrefLang={langue.tag}
                  onClick={() => memoriserInterface(langue.tag)}
                  aria-current={langue.tag === locale ? "page" : undefined}>
                  {nom}
                </Link>
              ) : (
                <span className={styles.indisponible} aria-disabled="true">
                  {nom} <span>({t("indisponible")})</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <ul className={styles.liens} aria-label={navigation("titre")}>
        <li><Link href="/recherche">{navigation("recherche")}</Link></li>
        <li><Link href="/chaine">{navigation("chaine")}</Link></li>
        <li><Link href="/glossaire">{navigation("glossaire")}</Link></li>
        <li><Link href="/parametres">{navigation("parametres")}</Link></li>
        <li><Link href="/langues">{navigation("langues")}</Link></li>
      </ul>
    </nav>
  );
}
