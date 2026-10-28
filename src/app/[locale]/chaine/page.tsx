"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { corpus, bibliothequeParId } from "@/donnees/corpus";
import { Link } from "@/i18n/navigation";
import ui from "@/composants/Interface.module.css";
import styles from "./Chaine.module.css";

export default function Chaine() {
  const t = useTranslations("chaine");
  const [hadithId, setHadithId] = useState(corpus.hadiths[0]?.id ?? "");
  const [afficherFaibles, setAfficherFaibles] = useState(false);
  const [bibliothequesVisibles, setBibliothequesVisibles] = useState<Set<string>>(
    new Set(corpus.bibliotheques.map((b) => b.id))
  );
  const [ouvragesVisibles, setOuvragesVisibles] = useState<Set<string>>(
    new Set(corpus.bibliotheques.flatMap((b) => b.ouvrages.map((o) => o.id)))
  );

  const hadith = corpus.hadiths.find((h) => h.id === hadithId);
  if (!hadith) {
    return (
      <div className={ui.page}>
        <p>{t("hadithManquant")}</p>
      </div>
    );
  }

  const toggleBibliotheque = (id: string) => {
    const nouvelle = new Set(bibliothequesVisibles);
    if (nouvelle.has(id)) {
      nouvelle.delete(id);
    } else {
      nouvelle.add(id);
    }
    setBibliothequesVisibles(nouvelle);
  };

  const toggleOuvrage = (id: string) => {
    const nouvelle = new Set(ouvragesVisibles);
    if (nouvelle.has(id)) {
      nouvelle.delete(id);
    } else {
      nouvelle.add(id);
    }
    setOuvragesVisibles(nouvelle);
  };

  const ouvragesAffichees = new Set(
    corpus.bibliotheques
      .filter((b) => bibliothequesVisibles.has(b.id))
      .flatMap((b) =>
        b.ouvrages
          .filter((o) => ouvragesVisibles.has(o.id))
          .map((o) => o.id)
      )
  );

  const occurrencesAffichees = hadith.occurrences.filter((o) => ouvragesAffichees.has(o.ouvrage));
  const bibliothequesCitees = [...new Set(occurrencesAffichees.map((o) => o.bibliotheque))];

  return (
    <main className={ui.page}>
      <h1>{t("titre")}</h1>

      <section className={styles.selecteur} aria-labelledby="label-hadith">
        <label id="label-hadith" className={ui.champ}>
          <span>{t("hadith")}</span>
          <select
            value={hadithId}
            onChange={(e) => setHadithId(e.currentTarget.value)}
            className={styles.select}
          >
            {corpus.hadiths.map((h) => (
              <option key={h.id} value={h.id}>
                {h.id}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className={styles.disposition}>
        <section className={styles.voies} aria-labelledby="label-voies">
          <h2 id="label-voies">{t("chaineTitle")}</h2>
          <div className={styles.tronc}>
            <p className={ui.surtitre}>{t("tronc")}</p>
            <ul className={styles.transmetteurs}>
              {hadith.chaine.tronc.map((id) => {
                const t = corpus.transmetteurs.find((x) => x.id === id);
                return (
                  <li key={id} data-id={id} className={styles.transmetteur}>
                    <bdi lang="ar" dir="rtl" className={`${ui.arabeGrand} texte-arabe`}>
                      {t?.nomAr}
                    </bdi>
                    <div className={styles.details}>
                      <bdi lang="ar-Latn" dir="ltr">{t?.nomTranslittere}</bdi>
                      {t?.deces && <span className={ui.discret}>({t.deces})</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.voiesSection}>
            <p className={ui.surtitre}>{t("voies")}</p>
            {hadith.chaine.voies.map((voie) => {
              const ouvrage = corpus.bibliotheques
                .flatMap((b) => b.ouvrages)
                .find((o) => o.id === voie.ouvrage);
              return (
                <details key={voie.id} className={styles.voie}>
                  <summary>
                    <bdi>{ouvrage?.nom}</bdi>
                    <span className={ui.discret}>
                      · {voie.transmetteurs.length} {t("transmetteurs")}
                    </span>
                  </summary>
                  <ul className={styles.transmetteurs}>
                    {voie.transmetteurs.map((id) => {
                      const transmetteur = corpus.transmetteurs.find((x) => x.id === id);
                      const faible = transmetteur?.categorie === "daif";
                      if (faible && !afficherFaibles) return null;
                      return (
                        <li
                          key={id}
                          data-id={id}
                          className={styles.transmetteur}
                          data-faible={faible ? "true" : undefined}
                        >
                          <bdi lang="ar" dir="rtl" className={`${ui.arabeGrand} texte-arabe`}>
                            {transmetteur?.nomAr}
                          </bdi>
                          <div className={styles.details}>
                            <bdi lang="ar-Latn" dir="ltr">{transmetteur?.nomTranslittere}</bdi>
                            {transmetteur?.deces && <span className={ui.discret}>({transmetteur.deces})</span>}
                            {faible && (
                              <span className={ui.badge} data-ton="alerte">
                                {t("faible")}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </section>

        <aside className={styles.filtres}>
          <label className={ui.champ}>
            <input
              type="checkbox"
              checked={afficherFaibles}
              onChange={(e) => setAfficherFaibles(e.currentTarget.checked)}
            />
            {t("afficherFaibles")}
          </label>

          <fieldset className={styles.filtreBibliotheques}>
            <legend>{t("bibliotheques")}</legend>
            {corpus.bibliotheques.map((b) => (
              <label key={b.id} className={`${ui.champ} ${styles.checkbox}`}>
                <input
                  type="checkbox"
                  checked={bibliothequesVisibles.has(b.id)}
                  onChange={() => toggleBibliotheque(b.id)}
                />
                <bdi lang="ar" dir="rtl" className="texte-arabe">
                  {b.nomAr}
                </bdi>
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.filtreOuvrages}>
            <legend>{t("ouvrages")}</legend>
            {corpus.bibliotheques.map((b) => {
              const visibles = b.ouvrages.filter((o) => bibliothequesVisibles.has(b.id));
              if (visibles.length === 0) return null;
              return (
                <div key={b.id}>
                  <p className={ui.surtitre}>{b.nomAr}</p>
                  {visibles.map((o) => (
                    <label key={o.id} className={`${ui.champ} ${styles.checkbox}`}>
                      <input
                        type="checkbox"
                        checked={ouvragesVisibles.has(o.id)}
                        onChange={() => toggleOuvrage(o.id)}
                      />
                      {o.nom}
                    </label>
                  ))}
                </div>
              );
            })}
          </fieldset>

          <div className={styles.resume}>
            <p className={ui.surtitre}>{t("resume")}</p>
            <p>
              {t("resumeOuvrages", { count: ouvragesAffichees.size })}
            </p>
            <p>
              {t("resumeBibliotheques", { count: bibliothequesCitees.length })}
            </p>
            <Link
              href={`/rapport/${hadith.id}`}
              className={ui.bouton}
            >
              {t("voirRapport")}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
