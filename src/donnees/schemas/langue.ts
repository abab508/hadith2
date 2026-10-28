import { z } from "zod";

// Schéma du catalogue des langues (docs/conception/donnees/modele-langue.md).

const niveaux = z.strictObject({
  identifiee: z.boolean(),
  affichable: z.boolean(),
  interface: z.boolean(),
  recherche: z.boolean(),
  traductionAuto: z.boolean(),
  contenuDocumentaire: z.boolean(),
  contenuVerifie: z.boolean(),
  validationHumaine: z.boolean(),
});

export const entreeLangue = z
  .strictObject({
    tag: z.string().regex(/^[a-z]{2,3}(-[A-Za-z0-9]{1,8})*$/),
    codeOfficiel: z.boolean(),
    type: z.enum(["langue", "variante"]),
    langueDeBase: z.string().regex(/^[a-z]{2,3}$/),
    varianteDe: z.string().optional(),
    nomNatif: z.string().min(1),
    nomsTraduits: z.record(z.string(), z.string().min(1)).optional(),
    direction: z.enum(["rtl", "ltr"]),
    ecriture: z.string().regex(/^[A-Z][a-z]{3}$/),
    regions: z.array(z.string().regex(/^([A-Z]{2}|[0-9]{3})$/)),
    niveaux,
    statut: z.enum(["active", "experimentale", "desactivee"]),
    remplacements: z.array(z.string()),
    police: z.strictObject({
      famille: z.string().min(1),
      secours: z.array(z.string().min(1)).optional(),
    }),
    localeFormats: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((e, ctx) => {
    if (e.codeOfficiel === e.tag.includes("-x-")) {
      ctx.addIssue({ code: "custom", message: `${e.tag} : codeOfficiel incohérent avec -x-` });
    }
    if (e.tag.split("-")[0] !== e.langueDeBase) {
      ctx.addIssue({ code: "custom", message: `${e.tag} : langueDeBase différente du début du tag` });
    }
    if ((e.type === "variante") !== (e.varianteDe !== undefined)) {
      ctx.addIssue({ code: "custom", message: `${e.tag} : varianteDe obligatoire pour une variante, interdit sinon` });
    }
    if (e.niveaux.interface && !e.niveaux.affichable) {
      ctx.addIssue({ code: "custom", message: `${e.tag} : interface exige affichable` });
    }
    if (e.remplacements.includes(e.tag)) {
      ctx.addIssue({ code: "custom", message: `${e.tag} : se remplace lui-même` });
    }
  });

export const catalogueLangues = z
  .strictObject({
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    miseAJour: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    langueParDefaut: z.string(),
    entrees: z.array(entreeLangue).min(1),
  })
  .superRefine((c, ctx) => {
    const tags = c.entrees.map((e) => e.tag);
    const connus = new Set(tags);
    if (connus.size !== tags.length) {
      ctx.addIssue({ code: "custom", message: "tag en double dans le catalogue" });
    }
    if (!connus.has(c.langueParDefaut)) {
      ctx.addIssue({ code: "custom", message: "langueParDefaut absente du catalogue" });
    }
    for (const e of c.entrees) {
      const references = [...e.remplacements, ...(e.varianteDe ? [e.varianteDe] : [])];
      for (const r of references) {
        if (!connus.has(r)) {
          ctx.addIssue({ code: "custom", message: `${e.tag} : référence inconnue ${r}` });
        }
      }
    }
  });

export type EntreeLangue = z.infer<typeof entreeLangue>;
export type CatalogueLangues = z.infer<typeof catalogueLangues>;
