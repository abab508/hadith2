import { cles, type Messages } from "@/i18n/messages";

export type CompletudeInterface = {
  presentes: number;
  total: number;
  proportion: number;
};

// Compare les clés propres à la langue, avant toute fusion des messages de repli.
// Les clés supplémentaires et _meta ne gonflent jamais la complétude.
export function calculerCompletude(
  reference: Messages,
  messages: Messages | undefined,
): CompletudeInterface {
  const attendues = cles(reference);
  const disponibles = new Set(cles(messages ?? {}));
  const presentes = attendues.filter((cle) => disponibles.has(cle)).length;
  const total = attendues.length;

  return { presentes, total, proportion: total === 0 ? 0 : presentes / total };
}
