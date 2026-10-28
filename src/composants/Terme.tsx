import { useLocale, useTranslations } from "next-intl";
import { entree } from "@/donnees/catalogue";
import { terme } from "@/donnees/termes";
import InfobulleTerme from "@/composants/InfobulleTerme";
import styles from "@/composants/Terme.module.css";

// Affiche « Terme (arabe — translittération) » ; la définition n'apparaît qu'en infobulle.
export default function Terme({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("terme");
  const tCommun = useTranslations("commun");
  const donnees = terme(id, locale);
  if (!donnees) return <span>[{id}]</span>;

  const enArabe = locale === "ar";
  const enAttente = donnees.statutValidation !== "valide-specialiste"
    || donnees.traduction?.statutValidation !== "valide-specialiste";
  const langueExplication = donnees.traduction?.langueExplication ?? donnees.langueAffichee;
  const repli = donnees.langueAffichee !== locale || langueExplication !== locale;

  return (
    <InfobulleTerme id={id} definition={<>
      <span lang={langueExplication} dir={entree(langueExplication ?? locale)?.direction}>
        {donnees.traduction?.explication}
      </span>
      {enAttente && <> — {t("aValider")}</>}
    </>}>
      {enArabe ? (
        <>
          <bdi lang="ar" dir="rtl">{donnees.ar}</bdi> (<bdi lang="ar-Latn" dir="ltr">{donnees.translitteration}</bdi>)
        </>
      ) : (
        <>
          <bdi lang={donnees.langueAffichee} dir={entree(donnees.langueAffichee ?? locale)?.direction}>{donnees.traduction?.terme}</bdi> (
          <bdi lang="ar" dir="rtl">
            {donnees.ar}
          </bdi>{" "}
          — <bdi lang="ar-Latn" dir="ltr">{donnees.translitteration}</bdi>)
        </>
      )}
      {repli && <span className={styles.repli}> {tCommun("repliSignale")}</span>}
    </InfobulleTerme>
  );
}
