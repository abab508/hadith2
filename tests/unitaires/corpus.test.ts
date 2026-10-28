import { describe, expect, it } from "vitest";
import bibliotheques from "../../data/bibliotheques/bibliotheques.json";
import hadiths from "../../data/hadiths/exemples.json";
import transmetteurs from "../../data/transmetteurs/transmetteurs.json";
import { chargerCorpus, corpus, texteDans, verifierReferences } from "@/donnees/corpus";

describe("corpus d'exemple", () => {
  it("se charge sans erreur", () => {
    expect(() => chargerCorpus(bibliotheques, transmetteurs, hadiths)).not.toThrow();
    expect(verifierReferences(corpus)).toEqual([]);
  });

  it("contient al-Maktaba al-Shāmila avec des recueils de hadith et des ouvrages sur les transmetteurs", () => {
    const shamila = corpus.bibliotheques.find((b) => b.id === "shamila");
    expect(shamila?.nomAr).toBe("المكتبة الشاملة");
    expect(shamila?.ouvrages.some((o) => o.categorie === "hadith")).toBe(true);
    expect(shamila?.ouvrages.some((o) => o.categorie === "rijal")).toBe(true);
  });

  it("donne une fiche à chaque transmetteur de chaque chaîne", () => {
    for (const h of corpus.hadiths) {
      const ids = [...h.chaine.tronc, ...h.chaine.voies.flatMap((v) => v.transmetteurs)];
      for (const id of ids) {
        expect(corpus.transmetteurs.some((t) => t.id === id), id).toBe(true);
      }
    }
  });

  it("signale une traduction IA comme telle, jamais comme publiée sans source", () => {
    for (const h of corpus.hadiths) {
      for (const t of h.traductions) {
        if (t.origine === "publiee") expect(t.source, `${h.id}/${t.langue}`).not.toBeNull();
      }
    }
  });

  it("refuse un transmetteur inconnu dans une chaîne", () => {
    const copie = structuredClone(hadiths);
    copie.hadiths[0]!.chaine.tronc.push("inconnu");
    expect(() => chargerCorpus(bibliotheques, transmetteurs, copie)).toThrow(/transmetteur inconnu/);
  });

  it("refuse un texte arabe non NFC sans le modifier", () => {
    const copie = structuredClone(transmetteurs);
    copie.transmetteurs[1]!.nomAr = "عمر".normalize("NFD") + "َّ";
    const avant = structuredClone(copie);
    expect(() => chargerCorpus(bibliotheques, copie, hadiths)).toThrow();
    expect(copie).toEqual(avant);
  });

  it("suit la chaîne de repli pour les textes rédigés", () => {
    expect(texteDans({ ar: "عربي", fr: "français" }, "fr")).toEqual({ tag: "fr", texte: "français" });
    expect(texteDans({ ar: "عربي", en: "english" }, "es")).toEqual({ tag: "en", texte: "english" });
    expect(texteDans({ ar: "عربي" }, "tr")).toEqual({ tag: "ar", texte: "عربي" });
  });
});
