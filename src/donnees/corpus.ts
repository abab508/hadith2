import brutBibliotheques from "../../data/bibliotheques/bibliotheques.json" with { type: "json" };
import brutHadiths from "../../data/hadiths/exemples.json" with { type: "json" };
import brutTransmetteurs from "../../data/transmetteurs/transmetteurs.json" with { type: "json" };
import { chaineDeRepli } from "@/donnees/catalogue";
import {
  fichierBibliotheques,
  fichierHadiths,
  fichierTransmetteurs,
  type Bibliotheque,
  type Hadith,
  type Ouvrage,
  type TexteMultilingue,
  type Transmetteur,
} from "@/donnees/schemas/corpus";

export type Corpus = {
  bibliotheques: Bibliotheque[];
  transmetteurs: Transmetteur[];
  hadiths: Hadith[];
};

// Valide les trois fichiers puis vérifie que chaque identifiant cité existe.
export function chargerCorpus(bibliotheques: unknown, transmetteurs: unknown, hadiths: unknown): Corpus {
  const b = fichierBibliotheques.safeParse(bibliotheques);
  const t = fichierTransmetteurs.safeParse(transmetteurs);
  const h = fichierHadiths.safeParse(hadiths);
  if (!b.success) throw new Error(`Bibliothèques invalides :\n${b.error.message}`);
  if (!t.success) throw new Error(`Transmetteurs invalides :\n${t.error.message}`);
  if (!h.success) throw new Error(`Hadiths invalides :\n${h.error.message}`);

  const corpus: Corpus = {
    bibliotheques: b.data.bibliotheques,
    transmetteurs: t.data.transmetteurs,
    hadiths: h.data.hadiths,
  };
  const erreurs = verifierReferences(corpus);
  if (erreurs.length > 0) throw new Error(`Corpus incohérent :\n${erreurs.join("\n")}`);
  return corpus;
}

export function verifierReferences(corpus: Corpus): string[] {
  const erreurs: string[] = [];
  const ouvrages = new Set(corpus.bibliotheques.flatMap((b) => b.ouvrages.map((o) => o.id)));
  const bibliotheques = new Set(corpus.bibliotheques.map((b) => b.id));
  const transmetteurs = new Set(corpus.transmetteurs.map((t) => t.id));
  const doublons = (ids: string[]) => ids.filter((x, i) => ids.indexOf(x) !== i);

  for (const d of doublons(corpus.transmetteurs.map((t) => t.id))) erreurs.push(`transmetteur en double : ${d}`);
  for (const d of doublons(corpus.bibliotheques.flatMap((b) => b.ouvrages.map((o) => o.id)))) erreurs.push(`ouvrage en double : ${d}`);

  for (const t of corpus.transmetteurs) {
    for (const s of t.sources) {
      if (!ouvrages.has(s.ouvrage)) erreurs.push(`${t.id} : ouvrage inconnu ${s.ouvrage}`);
    }
  }
  for (const h of corpus.hadiths) {
    const voies = new Set(h.chaine.voies.map((v) => v.id));
    for (const id of [...h.chaine.tronc, ...h.chaine.voies.flatMap((v) => v.transmetteurs)]) {
      if (!transmetteurs.has(id)) erreurs.push(`${h.id} : transmetteur inconnu ${id}`);
    }
    for (const v of h.chaine.voies) {
      if (!ouvrages.has(v.ouvrage)) erreurs.push(`${h.id} : ouvrage inconnu ${v.ouvrage}`);
    }
    for (const o of h.occurrences) {
      if (!ouvrages.has(o.ouvrage)) erreurs.push(`${h.id}/${o.id} : ouvrage inconnu ${o.ouvrage}`);
      if (!bibliotheques.has(o.bibliotheque)) erreurs.push(`${h.id}/${o.id} : bibliothèque inconnue ${o.bibliotheque}`);
      if (o.voie !== null && !voies.has(o.voie)) erreurs.push(`${h.id}/${o.id} : voie inconnue ${o.voie}`);
      if (o.correspondance !== "reference" && o.texteAr === null) erreurs.push(`${h.id}/${o.id} : texte arabe manquant`);
    }
  }
  return erreurs;
}

export const corpus = chargerCorpus(brutBibliotheques, brutTransmetteurs, brutHadiths);

export function hadithParId(id: string): Hadith | undefined {
  return corpus.hadiths.find((h) => h.id === id);
}

export function transmetteurParId(id: string): Transmetteur | undefined {
  return corpus.transmetteurs.find((t) => t.id === id);
}

export function ouvrageParId(id: string): (Ouvrage & { bibliotheque: string }) | undefined {
  for (const b of corpus.bibliotheques) {
    const o = b.ouvrages.find((x) => x.id === id);
    if (o) return { ...o, bibliotheque: b.id };
  }
  return undefined;
}

export function bibliothequeParId(id: string): Bibliotheque | undefined {
  return corpus.bibliotheques.find((b) => b.id === id);
}

// Texte dans la langue demandée, en suivant la chaîne de repli, puis fr, en et ar.
export function texteDans(texte: TexteMultilingue, tag: string): { tag: string; texte: string } {
  const ordre = [...chaineDeRepli(tag), "fr", "en", "ar"];
  const trouve = ordre.find((l) => texte[l] !== undefined) ?? "ar";
  return { tag: trouve, texte: texte[trouve] ?? "" };
}
