import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { corpus, transmetteurParId, ouvrageParId, hadithParId, texteDans } from "@/donnees/corpus";
import Terme from "@/composants/Terme";
import ui from "@/composants/Interface.module.css";
import styles from "./Rapport.module.css";

export async function generateStaticParams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return corpus.hadiths.map((h) => ({ locale, id: h.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "rapport" });
  return { title: t("titre", { hadith: id }) };
}

export default async function Rapport({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rapport");
  const tTermes = await getTranslations("termes");

  const hadith = hadithParId(id);
  if (!hadith) {
    return (
      <main className={ui.page}>
        <h1>{t("titreNotFound")}</h1>
        <p>{t("hadithNotFound")}</p>
      </main>
    );
  }

  const traduction = hadith.traductions.find((x) => x.langue === locale);
  const { tag: tagParticularite, texte: texteParticularite } = hadith.particularite
    ? texteDans(hadith.particularite, locale)
    : { tag: "ar", texte: "" };

  const ouvragesAffichees = [...new Set(hadith.occurrences.map((o) => o.ouvrage))]
    .map((id) => ouvrageParId(id))
    .filter((o): o is Exclude<typeof o, undefined> => o !== undefined);

  const transmetteurIdsArrondis = new Set([
    ...hadith.chaine.tronc,
    ...hadith.chaine.voies.flatMap((v) => v.transmetteurs),
  ]);

  const transmetteurs = Array.from(transmetteurIdsArrondis)
    .map((id) => transmetteurParId(id))
    .filter((t): t is Exclude<typeof t, undefined> => t !== undefined);

  return (
    <main className={ui.page}>
      <div className={styles.entete}>
        <h1 className={ui.arabeTresGrand} lang="ar" dir="rtl">
          <bdi className="texte-arabe">{hadith.texteAr}</bdi>
        </h1>

        <div className={styles.statut}>
          <span className={ui.badge} data-ton="accent">
            <Terme id={hadith.statutTerme} />
          </span>
          {texteParticularite && (
            <span className={ui.badge} data-ton="ocre">
              {texteParticularite}
            </span>
          )}
        </div>

        {traduction && (
          <div className={`${ui.traduction} ${styles.traduction}`} data-origine={traduction.origine}>
            <p>{traduction.texte}</p>
            <p className={ui.mention}>
              {traduction.source ? `📖 ${traduction.source}` : `🤖 ${t("traductionIa")}`}
            </p>
          </div>
        )}
      </div>

      <section className={styles.chaine} aria-labelledby="titre-chaine">
        <h2 id="titre-chaine">{t("chaineTitle")}</h2>

        <div className={styles.arbre}>
          <div className={styles.tronc}>
            <p className={ui.surtitre}>{t("tronc")}</p>
            <ul className={styles.transmetteurs}>
              {hadith.chaine.tronc.map((id) => {
                const transmetteur = transmetteurParId(id);
                return (
                  <li key={id} className={styles.transmetteur}>
                    <div className={styles.noeud}>
                      <span className={ui.arabeGrand} lang="ar" dir="rtl">
                        <bdi className="texte-arabe">{transmetteur?.nomAr}</bdi>
                      </span>
                      <span className={ui.discret}>
                        <bdi lang="ar-Latn" dir="ltr">{transmetteur?.nomTranslittere}</bdi>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.voiesSection}>
            <p className={ui.surtitre}>{t("voies")}</p>
            {hadith.chaine.voies.map((voie) => {
              const ouvrage = ouvrageParId(voie.ouvrage);
              return (
                <details key={voie.id} className={styles.voie}>
                  <summary>
                    <span className={ui.arabeGrand}>{ouvrage?.nom}</span>
                  </summary>
                  <ul className={styles.transmetteurs}>
                    {voie.transmetteurs.map((id) => {
                      const transmetteur = transmetteurParId(id);
                      return (
                        <li key={id} className={styles.transmetteur}>
                          <div className={styles.noeud}>
                            <span className={ui.arabeGrand} lang="ar" dir="rtl">
                              <bdi className="texte-arabe">{transmetteur?.nomAr}</bdi>
                            </span>
                            <span className={ui.discret}>
                              <bdi lang="ar-Latn" dir="ltr">{transmetteur?.nomTranslittere}</bdi>
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.transmetteurs} aria-labelledby="titre-transmetteurs">
        <h2 id="titre-transmetteurs">{t("transmetteurs")}</h2>
        <div className={styles.grille}>
          {transmetteurs.map((transmetteur) => {
            const { tag: tagBio, texte: biographie } = texteDans(
              transmetteur.biographie,
              locale
            );
            const jugement = transmetteur.jugements[0];
            return (
              <article key={transmetteur.id} className={`${ui.carte} ${styles.fiche}`}>
                <div className={styles.enteteTransmetteur}>
                  <h3 lang="ar" dir="rtl">
                    <bdi className={ui.arabeGrand}>{transmetteur.nomAr}</bdi>
                  </h3>
                  <p className={ui.discret}>
                    <bdi lang="ar-Latn" dir="ltr">{transmetteur.nomTranslittere}</bdi>
                  </p>
                </div>

                {transmetteur.deces && (
                  <p className={styles.deces}>
                    {t("deces", { deces: transmetteur.deces })}
                  </p>
                )}

                {jugement && (
                  <div className={styles.jugement}>
                    <p className={ui.surtitre}>{t("jugement")}</p>
                    <p lang="ar" dir="rtl" className="texte-arabe">
                      <bdi>{jugement.critiqueAr}</bdi>
                    </p>
                    {jugement.reserve && (
                      <p className={`${ui.badge} ${styles.reserve}`} data-ton="alerte">
                        {jugement.reserve}
                      </p>
                    )}
                    {jugement.explication && (
                      <div className={styles.explication}>
                        <p className={ui.discret}>
                          {jugement.explication[locale as keyof typeof jugement.explication]}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {biographie && (
                  <div className={styles.biographie}>
                    <p className={ui.surtitre}>{t("biographie")}</p>
                    <p>{biographie}</p>
                  </div>
                )}

                <button className={ui.boutonSecondaire} disabled>
                  {t("verrouille")}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.sources} aria-labelledby="titre-sources">
        <h2 id="titre-sources">{t("sources")}</h2>
        <div className={styles.tableau}>
          <table>
            <thead>
              <tr>
                <th>{t("ouvrage")}</th>
                <th>{t("reference")}</th>
                <th>{t("bibliotheque")}</th>
                <th>{t("acces")}</th>
              </tr>
            </thead>
            <tbody>
              {hadith.occurrences.map((occurrence) => {
                const ouvrage = ouvrageParId(occurrence.ouvrage);
                const bibliotheque = corpus.bibliotheques.find((b) => b.id === occurrence.bibliotheque);
                return (
                  <tr key={occurrence.id}>
                    <td>{ouvrage?.nom}</td>
                    <td>{occurrence.numero}</td>
                    <td lang="ar" dir="rtl">
                      <bdi className="texte-arabe">{bibliotheque?.nomAr}</bdi>
                    </td>
                    <td>{t(`acces.${occurrence.bibliotheque}`)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className={ui.avertissement}>
        <p>{t("avertissementData")}</p>
      </div>
    </main>
  );
}
