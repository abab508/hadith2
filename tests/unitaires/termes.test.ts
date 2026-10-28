import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import brut from "../../data/termes/termes.json";
import { catalogue } from "@/donnees/catalogue";
import { chargerDictionnaire, terme, termes } from "@/donnees/termes";
import { dictionnaire } from "@/donnees/schemas/terme";

const tags = catalogue.entrees.map((entree) => entree.tag);
const copie = () => structuredClone(brut) as typeof brut;

describe("dictionnaire terminologique", () => {
  it("est valide et garde l'arabe original", () => {
    expect(termes.termes.length).toBeGreaterThan(0);
    expect(terme("hasan", "fr")?.ar).toBe("حسن");
  });

  it("aucun terme n'est présenté comme validé sans preuve", () => {
    for (const t of termes.termes) {
      if (t.statutValidation === "valide-specialiste") {
        expect(t.notesValidation.length, t.id).toBeGreaterThan(0);
      }
    }
  });

  it("suit la chaîne de repli pour la langue affichée", () => {
    expect(terme("hasan", "ur")?.langueAffichee).toBe("en");
    expect(terme("hasan", "fr")?.traduction?.terme).toBe("Bon / fiable selon la catégorie technique");
    expect(terme("al-sanad", "en")?.langueAffichee).toBe("fr");
    expect(terme("inconnu", "fr")).toBeUndefined();
  });

  it("omet les équivalents anglais absents plutôt que d'inventer une traduction", () => {
    const d = copie();
    delete (d.termes[0]!.langues as Record<string, unknown>).en;
    expect(dictionnaire.safeParse(d).success).toBe(true);
    expect(terme("al-sanad", "en")?.langues.en).toBeUndefined();
    delete (d.termes[0]!.langues as Record<string, unknown>).fr;
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("recopie les formes techniques et les descriptions des exigences sans traduction ajoutée", () => {
    const exigence01 = readFileSync(new URL("../../docs/exigences/01-terminologie-arabe-fr-en.md", import.meta.url), "utf8");
    const exigence02 = readFileSync(new URL("../../docs/exigences/02-plateforme-multilingue.md", import.meta.url), "utf8");
    const sources = `${exigence01}\n${exigence02}`;
    expect(termes.version).toBe("0.2.0");
    expect(termes.termes).toHaveLength(38);
    for (const t of termes.termes) {
      expect(sources.includes(`${t.ar} — ${t.translitteration}`), t.id).toBe(true);
      for (const traduction of Object.values(t.langues)) {
        expect(sources.includes(traduction.terme), `${t.id} : libellé`).toBe(true);
        for (const variante of traduction.variantesLibelles ?? []) {
          expect(sources.includes(variante), `${t.id} : variante du libellé`).toBe(true);
        }
        const estReserve = ["Définition à fournir par un spécialiste.", "Definition to be provided by a specialist."].includes(traduction.explication);
        expect(estReserve || sources.includes(traduction.explication), `${t.id} : explication`).toBe(true);
        expect(traduction.origine, t.id).toBe("humaine");
        expect(traduction.statutValidation, t.id).toBe("a-valider-specialiste");
      }
      expect(t.statutValidation, t.id).toBe("a-valider-specialiste");
      expect(t.references, t.id).toEqual([]);
      expect(t.notesValidation, t.id).toEqual([]);
    }
  });

  it("couvre chaque forme arabe et translittération des paragraphes 2 à 7", () => {
    const source = readFileSync(new URL("../../docs/exigences/01-terminologie-arabe-fr-en.md", import.meta.url), "utf8");
    const extrait = source.split("## 2.")[1]!.split("## 8.")[0]!;
    const formes = [...extrait.matchAll(/([\u0600-\u06ff]+(?: [\u0600-\u06ff]+)*) — ([^|)\r\n]+)/g)];
    for (const forme of formes) {
      expect(termes.termes.some((t) => t.ar === forme[1] && t.translitteration === forme[2]!.trim()), forme[0]).toBe(true);
    }
  });

  it("distingue l'état de l'application et les deux sens de faible", () => {
    expect(terme("ghayr-muhaddad", "fr")?.typeTerme).toBe("etat-application");
    for (const [id, autre] of [["daif-hadith", "daif-transmetteur"], ["daif-transmetteur", "daif-hadith"]]) {
      expect(terme(id!, "fr")?.termesLies).toContainEqual({ id: autre, relation: "ne-pas-confondre" });
    }
  });

  it("conserve les deux notions documentaires sans leur inventer d'arabe", () => {
    expect(termes.notionsDocumentaires.map((n) => n.id)).toEqual(["analyse-critique-preuves", "controle-documentaire"]);
    for (const notion of termes.notionsDocumentaires) {
      expect(notion.domaine).toBe("critique-sources");
      expect(notion).not.toHaveProperty("ar");
      expect(notion).not.toHaveProperty("translitteration");
      expect(notion.statutValidation).toBe("a-valider-specialiste");
    }
  });

  it("identifie la langue réelle de la réserve de définition espagnole", () => {
    const espagnol = terme("hadith-sahih", "es")?.traduction;
    expect(espagnol?.terme).toBe("Hadiz auténtico");
    expect(espagnol?.langueExplication).toBe("en");
    expect(espagnol?.origine).toBe("humaine");
  });

  it("conserve les formulations alternatives exactes dans une seule entrée par concept", () => {
    expect(terme("ittisal-al-sanad", "fr")?.traduction?.variantesLibelles).toEqual(["Continuité de la chaîne"]);
    expect(terme("al-illa", "fr")?.traduction?.variantesLibelles).toEqual(["Défaut caché"]);
    expect(terme("al-shudhudh", "fr")?.traduction?.variantesLibelles).toEqual(["Irrégularité de transmission"]);
    expect(terme("hasan", "fr")?.traduction?.variantesLibelles).toEqual(["Bon"]);
    expect(terme("hasan", "en")?.traduction?.variantesLibelles).toEqual(["Good / fair"]);
  });

  it("refuse les variantes de libellé répétées ou identiques au libellé principal", () => {
    const d = copie();
    const traduction = d.termes.find((t) => t.id === "hasan")!.langues.fr;
    traduction.variantesLibelles = ["Bon", "Bon"];
    expect(dictionnaire.safeParse(d).success).toBe(false);
    traduction.variantesLibelles = [traduction.terme];
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse une variante de libellé non NFC", () => {
    const d = copie();
    d.termes.find((t) => t.id === "al-illa")!.langues.fr.variantesLibelles = ["De\u0301faut caché"];
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse un id en double", () => {
    const d = copie();
    d.termes[1]!.id = d.termes[0]!.id;
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse un terme sans lettre arabe", () => {
    const d = copie();
    d.termes[0]!.ar = "illa";
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse une validation sans note ni référence", () => {
    const d = copie();
    d.termes[0]!.statutValidation = "valide-specialiste";
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse un lien non réciproque", () => {
    const d = copie();
    (d.termes[0]!.termesLies as { id: string; relation: string }[]).push({ id: "hasan", relation: "proche" });
    expect(dictionnaire.safeParse(d).success).toBe(false);
  });

  it("refuse une langue hors catalogue", () => {
    const d = copie();
    (d.termes[0]!.langues as Record<string, unknown>)["zz"] = d.termes[0]!.langues.fr;
    expect(() => chargerDictionnaire(d, tags)).toThrow(/hors catalogue/);
  });

  it("refuse aussi une langue hors catalogue pour une notion documentaire", () => {
    const d = copie();
    (d.notionsDocumentaires[0]!.langues as Record<string, unknown>)["zz"] = d.notionsDocumentaires[0]!.langues.fr;
    expect(() => chargerDictionnaire(d, tags)).toThrow(/hors catalogue/);
  });

  it("refuse une langue d'explication hors catalogue", () => {
    const d = copie();
    (d.termes[0]!.langues.fr as Record<string, unknown>).langueExplication = "zz";
    expect(() => chargerDictionnaire(d, tags)).toThrow(/hors catalogue/);
  });
});
