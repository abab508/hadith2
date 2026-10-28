import { useLocale, useTranslations } from "next-intl";
import { terme } from "@/donnees/termes";
import styles from "./Terme.module.css";

// Affiche « Terme (arabe — translittération) » ; la définition n'apparaît qu'en infobulle.
export default function Terme({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("terme");
  const donnees = terme(id, locale);
  if (!donnees) return <span>[{id}]</span>;

  const enArabe = locale === "ar";
  const enAttente = donnees.statutValidation !== "valide-specialiste";
  const infobulle = [donnees.traduction?.explication, enAttente ? t("aValider") : undefined]
    .filter(Boolean)
    .join(" — ");

  return (
    <span className={styles.terme} tabIndex={0} aria-describedby={`infobulle-${id}`} data-terme={id}>
      {enArabe ? (
        <>
          <span lang="ar">{donnees.ar}</span> (<bdi lang="ar-Latn" dir="ltr">{donnees.translitteration}</bdi>)
        </>
      ) : (
        <>
          <span lang={donnees.langueAffichee}>{donnees.traduction?.terme}</span> (
          <bdi lang="ar" dir="rtl">
            {donnees.ar}
          </bdi>{" "}
          — <bdi lang="ar-Latn" dir="ltr">{donnees.translitteration}</bdi>)
        </>
      )}
      <span id={`infobulle-${id}`} className={styles.infobulle} role="tooltip">
        {infobulle}
      </span>
    </span>
  );
}
