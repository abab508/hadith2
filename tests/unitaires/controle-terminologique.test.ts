import { describe, expect, it } from "vitest";
import brut from "../../data/termes/termes.json";
import { controlerTexte } from "@/donnees/controle-terminologique";
import { dictionnaire, type Dictionnaire, type Terme } from "@/donnees/schemas/terme";

function exemple(): Dictionnaire {
  const d = dictionnaire.parse(structuredClone(brut));
  d.termes = [d.termes.find((terme) => terme.id === "al-illa")!];
  return d;
}

const erreurs = (texte: string, tag: string, d: Dictionnaire) => controlerTexte(texte, tag, d).filter((signalement) => signalement.niveau === "erreur");
const complet = (terme: Terme, tag = "fr") => `${terme.langues[tag]!.terme} (${terme.ar} — ${terme.translitteration})`;

describe("contrôle lexical terminologique des textes", () => {
  it("accepte chaque terme réel complet avec le dictionnaire entier en français, anglais disponible et arabe", () => {
    const d = dictionnaire.parse(structuredClone(brut));
    for (const terme of d.termes) {
      for (const tag of ["fr", "en"]) {
        if (terme.langues[tag]) {
          expect(erreurs(complet(terme, tag), tag, d), `${terme.id} (${tag})`).toEqual([]);
        }
      }
      expect(erreurs(`${terme.ar} (${terme.ar} — ${terme.translitteration})`, "ar", d), `${terme.id} (ar)`).toEqual([]);
    }
  });

  it("accepte le format complet sans exiger une définition dans le texte", () => {
    const d = exemple();
    const texte = `# Analyse\n${complet(d.termes[0]!)}.\n${d.termes[0]!.langues.fr!.terme}.`;
    expect(erreurs(texte, "fr", d)).toEqual([]);
    expect(controlerTexte(texte, "fr", d)).toEqual([expect.objectContaining({ code: "validation-humaine-requise", message: "validation humaine requise", niveau: "avertissement" })]);
  });

  it("repère le libellé anglais et les caractères spéciaux de la translittération", () => {
    const d = exemple();
    expect(erreurs(complet(d.termes[0]!, "en"), "en", d)).toEqual([]);
    expect(erreurs(d.termes[0]!.langues.en!.terme, "en", d)).toHaveLength(1);
    expect(erreurs("Une ‘illa est citée.", "en", d)).toHaveLength(1);
  });

  it("repère les formes exactes supplémentaires de l'exigence et du patron", () => {
    const d = dictionnaire.parse(structuredClone(brut));
    expect(erreurs("Bon", "fr", d)).toContainEqual(expect.objectContaining({ termeId: "hasan", code: "premiere-apparition-incomplete" }));
    expect(erreurs("Bon (حسن — ḥasan)", "fr", d)).toEqual([]);
    expect(erreurs("Défaut caché", "fr", d)).toContainEqual(expect.objectContaining({ termeId: "al-illa", code: "premiere-apparition-incomplete" }));
    expect(erreurs("Défaut caché (العلة — al-ʿilla)", "fr", d)).toEqual([]);
  });

  it("recommence le contrôle après chaque titre Markdown, titre compris", () => {
    const d = exemple();
    const texte = `Introduction.\n# Première section\n${complet(d.termes[0]!)}\n## Deuxième section\n${d.termes[0]!.langues.fr!.terme}`;
    expect(erreurs(texte, "fr", d)).toEqual([expect.objectContaining({ code: "premiere-apparition-incomplete", section: "Deuxième section", ligne: 5 })]);
  });

  it("ne valide pas une première mention nue grâce à une mention complète plus loin", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    const texte = `${terme.langues.fr!.terme}. Puis ${complet(terme)}.`;
    expect(erreurs(texte, "fr", d)).toHaveLength(1);
    expect(erreurs(texte, "fr", d)[0]?.position).toBe(0);
  });

  it("signale séparément l'arabe ou la translittération manquants", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    expect(erreurs(`${terme.langues.fr!.terme} (${terme.ar})`, "fr", d)[0]?.message).toContain("translittération");
    expect(erreurs(`${terme.langues.fr!.terme} (${terme.translitteration})`, "fr", d)[0]?.message).toContain("arabe");
  });

  it("repère une mauvaise translittération après une première mention correcte", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    const texte = `${complet(terme)}. Ensuite (${terme.ar} — ḥasan).`;
    expect(erreurs(texte, "fr", d)).toEqual([expect.objectContaining({ code: "translitteration-incoherente", termeId: terme.id })]);
  });

  it("réserve les variantes à la recherche et exige la graphie canonique affichée", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    expect(erreurs(`${terme.langues.fr!.terme} (${terme.ar} — ‘illa)`, "fr", d)).toEqual([expect.objectContaining({ code: "translitteration-incoherente" })]);
  });

  it("ne traite pas une sous-chaîne d'un mot comme une mention", () => {
    const d = exemple();
    expect(controlerTexte("préfixeal-ʿillasuffixe", "fr", d)).toEqual([]);
  });

  it("repère un terme par son arabe en interface arabe", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    expect(erreurs(`(${terme.ar} — ${terme.translitteration})`, "ar", d)).toEqual([]);
    expect(erreurs(terme.ar, "ar", d)).toHaveLength(1);
  });

  it("vérifie séparément le statut de la traduction sans muter les entrées", () => {
    const d = exemple();
    const terme = d.termes[0]!;
    // Simulation de statuts pour tester la règle, sans validation savante réelle.
    terme.statutValidation = "valide-specialiste";
    terme.langues.fr!.statutValidation = "valide-specialiste";
    const avant = structuredClone(d);
    expect(controlerTexte(complet(terme), "fr", d)).toEqual([]);
    expect(controlerTexte(complet(terme, "en"), "en", d)).toContainEqual(expect.objectContaining({ code: "validation-humaine-requise" }));
    expect(d).toEqual(avant);
  });

  it("préfère un libellé explicite entre les deux sens de faible", () => {
    const d = dictionnaire.parse(structuredClone(brut));
    const source = d.termes[0]!;
    d.termes = [
      { ...structuredClone(source), id: "daif-hadith", ar: "ضعيف", translitteration: "ḍaʿīf", variantesTranslitteration: [], langues: { fr: { ...source.langues.fr!, terme: "Faible" } } },
      { ...structuredClone(source), id: "daif-transmetteur", ar: "ضعيف", translitteration: "ḍaʿīf", variantesTranslitteration: [], langues: { fr: { ...source.langues.fr!, terme: "Transmetteur faible" } } },
    ];
    expect(controlerTexte("Transmetteur faible (ضعيف — ḍaʿīf)", "fr", d)).toEqual([expect.objectContaining({ termeId: "daif-transmetteur", code: "validation-humaine-requise" })]);
  });

  it("ne confond pas un terme court avec un terme composé qui le contient", () => {
    const d = exemple();
    const source = d.termes[0]!;
    d.termes = [
      { ...structuredClone(source), id: "sahih", ar: "صحيح", translitteration: "ṣaḥīḥ", variantesTranslitteration: [], langues: { fr: { ...source.langues.fr!, terme: "Authentique" } } },
      { ...structuredClone(source), id: "hadith-sahih", ar: "حديث صحيح", translitteration: "ḥadīth ṣaḥīḥ", variantesTranslitteration: [], langues: { fr: { ...source.langues.fr!, terme: "Hadith authentique" } } },
    ];
    expect(controlerTexte("Hadith authentique (حديث صحيح — ḥadīth ṣaḥīḥ)", "fr", d)).toEqual([expect.objectContaining({ termeId: "hadith-sahih", code: "validation-humaine-requise" })]);
  });
});
