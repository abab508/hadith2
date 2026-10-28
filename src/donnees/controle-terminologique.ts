import type { Dictionnaire, Terme } from "@/donnees/schemas/terme";

export type SignalementTerminologique = {
  code: "premiere-apparition-incomplete" | "translitteration-incoherente" | "validation-humaine-requise";
  niveau: "erreur" | "avertissement";
  termeId: string;
  section: string;
  ligne: number;
  /** Position dans le texte original, en unités UTF-16, à partir de zéro. */
  position: number;
  message: string;
};

type Section = { titre: string; texte: string; position: number };
type Mention = { terme: Terme; debut: number; fin: number; libelle: boolean };
type Presentation = { debut: number; fin: number; contenu: string; arabe?: string; translitteration?: string };

function echapper(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function motif(forme: string, global = false): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{M}\\p{N}])${echapper(forme)}(?![\\p{L}\\p{M}\\p{N}])`, global ? "giu" : "iu");
}

function decouper(texte: string): Section[] {
  const sections: Section[] = [];
  let titre = "";
  let debut = 0;
  for (const entete of texte.matchAll(/^ {0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*\r?$/gmu)) {
    if (entete.index > debut) sections.push({ titre, texte: texte.slice(debut, entete.index), position: debut });
    debut = entete.index;
    titre = entete[1]?.trim() ?? "";
  }
  sections.push({ titre, texte: texte.slice(debut), position: debut });
  return sections;
}

function presentations(texte: string): Presentation[] {
  const resultat: Presentation[] = [];
  for (const parenthese of texte.matchAll(/\(([^()\n]*)\)/gu)) {
    resultat.push({ debut: parenthese.index, fin: parenthese.index + parenthese[0].length, contenu: parenthese[0] });
  }
  // Paires de la forme « arabe — translittération », entre parenthèses ou seules.
  const paire = /([\p{Script=Arabic}\p{M}]+(?:[ \t]+[\p{Script=Arabic}\p{M}]+)*)[ \t]*[—–][ \t]*([^\n):;.!?،؛]+)/gu;
  for (const correspondance of texte.matchAll(paire)) {
    const arabe = correspondance[1]?.trim();
    const translitteration = correspondance[2]?.replace(/[*_`]+$/gu, "").trim();
    resultat.push({
      debut: correspondance.index,
      fin: correspondance.index + correspondance[0].length,
      contenu: correspondance[0],
      arabe,
      translitteration,
    });
  }
  return resultat;
}

function contexte(mention: Mention, texte: string, groupes: Presentation[]): Presentation {
  const contenant = groupes.find((p) => p.debut <= mention.debut && p.fin >= mention.fin);
  if (contenant) return contenant;
  const suivante = groupes.find((p) => p.debut >= mention.fin && /^[\s*_`]*$/u.test(texte.slice(mention.fin, p.debut)));
  return suivante ?? { debut: mention.debut, fin: mention.fin, contenu: texte.slice(mention.debut, mention.fin) };
}

function reperer(texte: string, tag: string, dictionnaire: Dictionnaire, groupes: Presentation[]): Mention[] {
  const mentions: Mention[] = [];
  for (const terme of dictionnaire.termes) {
    const traduction = terme.langues[tag];
    const libelles = new Set(traduction ? [traduction.terme, ...(traduction.variantesLibelles ?? [])] : []);
    const formes = new Set([terme.ar, terme.translitteration, ...terme.variantesTranslitteration, ...libelles]);
    for (const forme of formes) {
      for (const apparition of texte.matchAll(motif(forme, true))) {
        mentions.push({ terme, debut: apparition.index, fin: apparition.index + apparition[0].length, libelle: libelles.has(forme) });
      }
    }
  }
  return mentions.filter((mention) => {
    // Une expression plus précise prime : « Transmetteur faible » ou « ḥadīth ṣaḥīḥ ».
    if (mentions.some((autre) => autre.terme.id !== mention.terme.id && autre.debut <= mention.debut && autre.fin >= mention.fin && autre.fin - autre.debut > mention.fin - mention.debut)) return false;
    const presentation = contexte(mention, texte, groupes);
    // Un libellé explicite lève l'ambiguïté de deux entrées partageant la même forme.
    return !mentions.some((autre) => autre.libelle && autre.terme.id !== mention.terme.id && autre.fin <= presentation.debut && /^[\s*_`]*$/u.test(texte.slice(autre.fin, presentation.debut)) && mention.debut >= presentation.debut);
  }).sort((a, b) => a.debut - b.debut || b.fin - a.fin);
}

/**
 * Contrôle lexical pur : chaque titre Markdown ouvre une section, titre compris.
 * L'arabe et la translittération doivent accompagner la première mention dans la
 * même parenthèse ou paire « arabe — translittération ». Les variantes servent au
 * repérage ; seule la translittération canonique est admise dans une paire affichée.
 * Ce contrôle ne juge ni une définition ni le sens scientifique d'une phrase.
 */
export function controlerTexte(texte: string, tag: string, dictionnaire: Dictionnaire): SignalementTerminologique[] {
  const signalements: SignalementTerminologique[] = [];
  for (const section of decouper(texte)) {
    const groupes = presentations(section.texte);
    const mentions = reperer(section.texte, tag, dictionnaire, groupes);
    const vus = new Set<string>();
    const ajouter = (terme: Terme, positionRelative: number, code: SignalementTerminologique["code"], niveau: SignalementTerminologique["niveau"], message: string) => {
      const position = section.position + positionRelative;
      signalements.push({ code, niveau, termeId: terme.id, section: section.titre, ligne: texte.slice(0, position).split("\n").length, position, message });
    };
    for (const mention of mentions) {
      const terme = mention.terme;
      if (vus.has(terme.id)) continue;
      vus.add(terme.id);
      const presentation = contexte(mention, section.texte, groupes);
      const arabePresent = motif(terme.ar).test(presentation.contenu);
      const translitterationPresente = [terme.translitteration, ...terme.variantesTranslitteration].some((forme) => motif(forme).test(presentation.contenu))
        || groupes.some((groupe) => groupe.arabe === terme.ar && Boolean(groupe.translitteration) && groupe.debut >= presentation.debut && groupe.fin <= presentation.fin);
      if (!arabePresent || !translitterationPresente) {
        const manquants = [!arabePresent ? "arabe" : "", !translitterationPresente ? "translittération" : ""].filter(Boolean);
        ajouter(terme, mention.debut, "premiere-apparition-incomplete", "erreur", `Première apparition incomplète : ${manquants.join(" et ")} manquant(s).`);
      }
      const traduction = terme.langues[tag];
      if (terme.statutValidation !== "valide-specialiste" || (tag !== "ar" && traduction?.statutValidation !== "valide-specialiste")) {
        ajouter(terme, mention.debut, "validation-humaine-requise", "avertissement", "validation humaine requise");
      }
    }
    for (const groupe of groupes) {
      if (!groupe.arabe || !groupe.translitteration) continue;
      const correspondants = dictionnaire.termes.filter((terme) => terme.ar === groupe.arabe);
      if (correspondants.some((terme) => terme.translitteration === groupe.translitteration)) continue;
      const terme = correspondants[0];
      if (terme) ajouter(terme, groupe.debut, "translitteration-incoherente", "erreur", `La translittération affichée ne correspond pas à ${terme.ar} : ${terme.translitteration} attendu.`);
    }
  }
  return signalements.sort((a, b) => a.position - b.position);
}
