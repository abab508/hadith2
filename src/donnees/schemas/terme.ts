import { z } from "zod";

// Schéma du dictionnaire terminologique (docs/conception/donnees/modele-terme.md).

const statutValidation = z.enum(["a-valider-specialiste", "valide-specialiste", "a-corriger"]);
const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const texte = z.string().min(1).refine((s) => s === s.normalize("NFC"), "texte non NFC");

const traduction = z
  .strictObject({
    terme: texte,
    variantesLibelles: z.array(texte).optional(),
    explication: texte,
    langueExplication: z.string().min(1).optional(),
    origine: z.enum(["humaine", "ia"]),
    statutValidation,
  })
  .superRefine((t, ctx) => {
    const variantes = t.variantesLibelles ?? [];
    const uniques = new Set(variantes);
    if (uniques.size !== variantes.length || uniques.has(t.terme)) {
      ctx.addIssue({ code: "custom", message: "variantes de libellé en double" });
    }
  });

export const terme = z
  .strictObject({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    ar: texte.regex(/[؀-ۿ]/, "aucune lettre arabe"),
    translitteration: texte,
    variantesTranslitteration: z.array(texte),
    domaine: z.string(),
    typeTerme: z.enum(["terme-technique", "etat-application"]),
    // L'exigence ne fournit pas systématiquement d'équivalent anglais : ne pas en inventer.
    langues: z.record(z.string(), traduction).refine((l) => "fr" in l, "fr obligatoire"),
    references: z.array(
      z.strictObject({
        titre: z.string().min(1),
        auteur: z.string().optional(),
        edition: z.string().optional(),
        volume: z.string().optional(),
        page: z.string().optional(),
        url: z.string().optional(),
      }),
    ),
    termesLies: z.array(z.strictObject({ id: z.string(), relation: z.enum(["proche", "ne-pas-confondre"]) })),
    notesValidation: z.array(
      z.strictObject({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), specialiste: z.string().min(1), note: z.string().min(1) }),
    ),
    statutValidation,
    versionTerme: version,
  })
  .superRefine((t, ctx) => {
    const variantes = new Set(t.variantesTranslitteration);
    if (variantes.size !== t.variantesTranslitteration.length || variantes.has(t.translitteration)) {
      ctx.addIssue({ code: "custom", message: `${t.id} : variantes de translittération en double` });
    }
    if (t.statutValidation === "valide-specialiste" && (t.notesValidation.length === 0 || t.references.length === 0)) {
      ctx.addIssue({ code: "custom", message: `${t.id} : validé sans note ni référence` });
    }
    for (const [tag, l] of Object.entries(t.langues)) {
      if (l.origine === "ia" && l.statutValidation === "valide-specialiste" && t.notesValidation.length === 0) {
        ctx.addIssue({ code: "custom", message: `${t.id}.${tag} : traduction IA validée sans note` });
      }
    }
  });

const notionDocumentaire = z
  .strictObject({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    domaine: z.literal("critique-sources"),
    langues: z.record(z.string(), traduction).refine((l) => "fr" in l, "fr obligatoire"),
    statutValidation,
    references: z.array(z.strictObject({ titre: texte })),
    notesValidation: z.array(
      z.strictObject({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), specialiste: texte, note: texte }),
    ),
  })
  .superRefine((n, ctx) => {
    if (n.statutValidation === "valide-specialiste" && (n.notesValidation.length === 0 || n.references.length === 0)) {
      ctx.addIssue({ code: "custom", message: `${n.id} : validé sans note ni référence` });
    }
    for (const [tag, l] of Object.entries(n.langues)) {
      if (l.statutValidation === "valide-specialiste" && (n.notesValidation.length === 0 || n.references.length === 0)) {
        ctx.addIssue({ code: "custom", message: `${n.id}.${tag} : traduction validée sans note ni référence` });
      }
    }
  });

export const dictionnaire = z
  .strictObject({
    version,
    miseAJour: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    normeTranslitteration: z.string().min(1),
    domaines: z.array(z.string().min(1)).min(1),
    termes: z.array(terme),
    // Deux notions de 01 §7 sont descriptives, sans équivalent arabe fourni.
    notionsDocumentaires: z.array(notionDocumentaire).default([]),
  })
  .superRefine((d, ctx) => {
    const ids = new Set<string>();
    const arDomaine = new Set<string>();
    for (const t of d.termes) {
      if (ids.has(t.id)) ctx.addIssue({ code: "custom", message: `id en double : ${t.id}` });
      ids.add(t.id);
      const cle = `${t.ar}|${t.domaine}`;
      if (arDomaine.has(cle)) ctx.addIssue({ code: "custom", message: `${t.id} : couple (ar, domaine) en double` });
      arDomaine.add(cle);
      if (!d.domaines.includes(t.domaine)) ctx.addIssue({ code: "custom", message: `${t.id} : domaine inconnu` });
      if (t.versionTerme.localeCompare(d.version, undefined, { numeric: true }) > 0) {
        ctx.addIssue({ code: "custom", message: `${t.id} : versionTerme supérieure au dictionnaire` });
      }
    }
    for (const n of d.notionsDocumentaires) {
      if (ids.has(n.id)) ctx.addIssue({ code: "custom", message: `id en double : ${n.id}` });
      ids.add(n.id);
      if (!d.domaines.includes(n.domaine)) ctx.addIssue({ code: "custom", message: `${n.id} : domaine inconnu` });
    }
    for (const t of d.termes) {
      for (const lien of t.termesLies) {
        const cible = d.termes.find((x) => x.id === lien.id);
        if (!cible) {
          ctx.addIssue({ code: "custom", message: `${t.id} : terme lié inconnu ${lien.id}` });
        } else if (!cible.termesLies.some((r) => r.id === t.id && r.relation === lien.relation)) {
          ctx.addIssue({ code: "custom", message: `${t.id} → ${lien.id} : lien non réciproque` });
        }
      }
    }
  });

export type Terme = z.infer<typeof terme>;
export type Dictionnaire = z.infer<typeof dictionnaire>;
