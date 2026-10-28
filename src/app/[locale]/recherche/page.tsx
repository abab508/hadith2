import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { corpus, bibliothequeParId, ouvrageParId, transmetteurParId } from "@/donnees/corpus";
import type { Occurrence } from "@/donnees/schemas/corpus";
import { Link } from "@/i18n/navigation";
import ui from "@/composants/Interface.module.css";
import styles from "@/app/[locale]/recherche/Recherche.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recherche" });
  return { title: t("titre") };
}

const correspondances = {
  original: { libelle: "correspondance.original", ton: "accent" },
  variante: { libelle: "correspondance.variante", ton: "accent" },
  reference: { libelle: "correspondance.reference", ton: undefined },
  similarite: { libelle: "correspondance.similarite", ton: "pointilles" },
} as const;

export default async function Recherche({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("recherche");
  const tAccueil = await getTranslations("accueil");
  const brut = (await searchParams).q;
  const requete = (Array.isArray(brut) ? brut[0] : brut)?.trim() || tAccueil("recherche.exemple");

  // Version de démonstration : le corpus d'exemple contient un seul hadith.
  const hadith = corpus.hadiths[0]!;
  const traduction = hadith.traductions.find((x) => x.langue === locale);
  const premier = transmetteurParId(hadith.chaine.tronc[1] ?? hadith.chaine.tronc[0]!);
  const collections = [...new Set(hadith.occurrences.map((o) => o.ouvrage))].flatMap((id) => {
    const o = ouvrageParId(id);
    return o ? [o] : [];
  });

  function carte(occurrence: Occurrence) {
    const ouvrage = ouvrageParId(occurrence.ouvrage);
    const bibliotheque = bibliothequeParId(occurrence.bibliotheque);
    const correspondance = correspondances[occurrence.correspondance];
    const reference = t("numero", { ouvrage: ouvrage?.nom ?? occurrence.ouvrage, numero: occurrence.numero });
    return (
      <article key={occurrence.id} className={ui.carte} aria-labelledby={`resultat-${occurrence.id}`}>
        <div className={styles.entete}>
          <h2 id={`resultat-${occurrence.id}`} className={styles.titreResultat}>
            <bdi>{reference}</bdi>{" "}
            <span className={ui.discret}>
              · <bdi lang="ar" dir="rtl" className="texte-arabe">{occurrence.livreAr}</bdi> (<bdi lang="ar-Latn" dir="ltr">{occurrence.livre}</bdi>)
            </span>
          </h2>
          <span className={ui.badge} data-ton={correspondance.ton}>{t(correspondance.libelle)}</span>
        </div>
        {occurrence.texteAr ? (
          <p lang="ar" dir="rtl" className={`texte-arabe ${ui.arabeGrand}`}>{occurrence.texteAr}</p>
        ) : (
          <p className={ui.discret}>{t("referenceSeulement")}</p>
        )}
        {occurrence.texteAr && locale !== "ar" && (
          occurrence.correspondance === "original" && traduction ? (
            <div className={ui.traduction} data-origine={traduction.origine}>
              <p lang={traduction.langue}>{traduction.texte}</p>
              <span className={ui.mention}>
                {traduction.origine === "publiee" || traduction.origine === "validee"
                  ? t("traduction.publiee", { source: traduction.source ?? "" })
                  : t("traduction.ia")}
              </span>
            </div>
          ) : (
            <p className={`${ui.traduction} ${ui.discret}`}>{t("aucuneTraduction")}</p>
          )
        )}
        <p className={styles.meta}>
          {premier && occurrence.voie && (
            <span>
              {t("premierTransmetteur", { nom: premier.nomTranslittere })}{" "}
              <bdi lang="ar" dir="rtl" className="texte-arabe">({premier.nomAr})</bdi>
            </span>
          )}
          {bibliotheque && <span>{t("bibliotheque", { nom: bibliotheque.nom })}</span>}
        </p>
        {occurrence.voie && (
          <div className={ui.actions}>
            <Link href={`/rapport/${hadith.id}`} className={ui.bouton}>{t("voirRapport")}</Link>
            <Link href={{ pathname: "/chaine", query: { hadith: hadith.id } }} className={ui.boutonSecondaire}>{t("parChaine")}</Link>
          </div>
        )}
      </article>
    );
  }

  return (
    <main id="contenu" tabIndex={-1} className={ui.page}>
      <div className={styles.requete}>
        <h1 id="titre-resultats" className={styles.titre}>{t("titre")}</h1>
        <p><bdi dir="auto">{t("requete", { requete })}</bdi></p>
        <p className={styles.rapprochee}>
          {t("rapprochee")}{" "}
          <bdi lang="ar" dir="rtl" className={`texte-arabe ${styles.requeteArabe}`}>{hadith.requeteAr}</bdi>
        </p>
        <p className={`${ui.badge} ${styles.exemple}`} data-ton="ocre">{t("exemple")}</p>
      </div>

      <div className={styles.colonnes}>
        <aside className={`${ui.carte} ${styles.filtres}`} aria-labelledby="titre-filtres">
          <h2 id="titre-filtres" className={styles.titreFiltres}>{t("filtres.titre")}</h2>
          <fieldset disabled className={styles.groupe}>
            <legend>{t("filtres.correspondance")}</legend>
            {(["original", "variante", "reference", "similarite"] as const).map((cle) => (
              <label key={cle}><input type="checkbox" defaultChecked /> {t(correspondances[cle].libelle)}</label>
            ))}
          </fieldset>
          <fieldset disabled className={styles.groupe}>
            <legend>{t("filtres.collections")}</legend>
            {collections.map((o) => (
              <label key={o.id}>
                <input type="checkbox" defaultChecked /> <bdi lang="ar-Latn">{o.nom}</bdi>{" "}
                <bdi lang="ar" dir="rtl" className={`texte-arabe ${ui.discret}`}>{o.nomAr}</bdi>
              </label>
            ))}
            <label><input type="checkbox" defaultChecked /> {t("filtres.peuConnus")}</label>
          </fieldset>
          <fieldset disabled className={styles.groupe}>
            <legend>{t("filtres.bibliotheques")}</legend>
            {corpus.bibliotheques.map((b) => (
              <label key={b.id}>
                <input type="checkbox" defaultChecked={b.parDefaut} /> <bdi>{b.nom}</bdi>{" "}
                <bdi lang="ar" dir="rtl" className={`texte-arabe ${ui.discret}`}>{b.nomAr}</bdi>
              </label>
            ))}
          </fieldset>
        </aside>

        <section className={styles.resultats} aria-labelledby="titre-resultats">
          {hadith.occurrences.map(carte)}
          <article className={`${ui.carte} ${styles.incertain}`} aria-labelledby="resultat-incertain">
            <div className={styles.entete}>
              <h2 id="resultat-incertain" className={styles.titreResultat}>{t("incertain.titre")}</h2>
              <span className={ui.badge} data-ton="pointilles">{t("correspondance.similarite")}</span>
            </div>
            <p>{t("incertain.texte")}</p>
            {locale !== "ar" && (
              <div className={ui.traduction} data-origine="ia">
                <span className={ui.mention}>{t("traduction.ia")}</span>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
