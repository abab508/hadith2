import { describe, expect, it } from "vitest";
import brut from "../data/termes/termes.json";
import { catalogue } from "@/donnees/catalogue";
import { dictionnaire } from "@/donnees/schemas/terme";
import { verifierTermes } from "./verifier-termes";

const copie = () => dictionnaire.parse(structuredClone(brut));
const tags = catalogue.entrees.map((entree) => entree.tag);

describe("contrôles du dictionnaire", () => {
  it("ne contient aucune erreur de cohérence", () => {
    const signalements = verifierTermes(brut, tags);
    expect(signalements.filter((signalement) => signalement.niveau === "erreur")).toEqual([]);
    for (const avertissement of signalements.filter((signalement) => signalement.niveau === "avertissement")) {
      console.info(avertissement.message);
    }
  });

  it("refuse une translittération non NFC sans modifier le texte", () => {
    const d = copie();
    d.termes[0]!.translitteration = "s\u0323ah\u0323i\u0304h\u0323";
    const avant = structuredClone(d);
    expect(verifierTermes(d).some((signalement) => signalement.code === "schema" && signalement.message.includes("NFC"))).toBe(true);
    expect(d).toEqual(avant);
  });

  it("refuse une variante de recherche partagée sans lien explicite", () => {
    const d = copie();
    const a = d.termes.find((terme) => terme.id === "al-illa")!;
    const b = d.termes.find((terme) => terme.id === "hasan")!;
    b.variantesTranslitteration.push(a.translitteration);
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "translitteration-partagee", niveau: "erreur", termes: expect.arrayContaining([a.id, b.id]) }));
  });

  it("repère aussi les collisions après normalisation des diacritiques et articles", () => {
    const d = copie();
    const a = d.termes.find((terme) => terme.id === "al-illa")!;
    const b = d.termes.find((terme) => terme.id === "hasan")!;
    b.variantesTranslitteration.push("illa");
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "translitteration-partagee", niveau: "erreur", termes: expect.arrayContaining([a.id, b.id]) }));
  });

  it("signale en avertissement une collision entre termes réciproquement liés", () => {
    const d = copie();
    const a = d.termes.find((terme) => terme.id === "al-illa")!;
    const b = d.termes.find((terme) => terme.id === "hasan")!;
    b.variantesTranslitteration.push(a.translitteration);
    a.termesLies.push({ id: b.id, relation: "ne-pas-confondre" });
    b.termesLies.push({ id: a.id, relation: "ne-pas-confondre" });
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "translitteration-partagee", niveau: "avertissement", termes: expect.arrayContaining([a.id, b.id]) }));
  });

  it("refuse un lien inconnu ou non réciproque", () => {
    const d = copie();
    d.termes[0]!.termesLies.push({ id: "absent", relation: "proche" });
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "schema", niveau: "erreur", message: expect.stringContaining("inconnu") }));
    d.termes[0]!.termesLies = [{ id: d.termes[1]!.id, relation: "proche" }];
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "schema", niveau: "erreur", message: expect.stringContaining("réciproque") }));
  });

  it("refuse un même arabe dans des domaines différents sans lien ne-pas-confondre", () => {
    const d = copie();
    const a = d.termes.find((terme) => terme.id === "al-illa")!;
    const b = d.termes.find((terme) => terme.id === "hasan")!;
    b.ar = a.ar;
    expect(verifierTermes(d)).toContainEqual(expect.objectContaining({ code: "arabe-partage", niveau: "erreur", termes: expect.arrayContaining([a.id, b.id]) }));
  });

  it("refuse une traduction dont le tag manque au catalogue", () => {
    const d = copie();
    d.termes[0]!.langues.zz = { ...d.termes[0]!.langues.fr! };
    expect(verifierTermes(d, tags)).toContainEqual(expect.objectContaining({ code: "langue-inconnue", niveau: "erreur" }));
  });

  it("vérifie aussi la langue d'une explication et des notions documentaires", () => {
    const d = copie();
    d.termes[0]!.langues.fr!.langueExplication = "zz";
    expect(verifierTermes(d, tags)).toContainEqual(expect.objectContaining({ code: "langue-inconnue", termes: [d.termes[0]!.id] }));
    delete d.termes[0]!.langues.fr!.langueExplication;
    const notion = d.notionsDocumentaires[0];
    expect(notion).toBeDefined();
    notion!.langues.zz = { ...notion!.langues.fr! };
    expect(verifierTermes(d, tags)).toContainEqual(expect.objectContaining({ code: "langue-inconnue", termes: [notion!.id] }));
  });
});

