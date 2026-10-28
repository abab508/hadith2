import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { catalogue, entree } from "@/donnees/catalogue";
import "@/styles/polices.css";
import "@/styles/global.css";

// Racine statique indépendante du layout localisé, sans lecture du navigateur au serveur.
export default async function LayoutEntree({ children }: { children: ReactNode }) {
  const langue = entree(catalogue.langueParDefaut)!;
  const t = await getTranslations({ locale: langue.tag, namespace: "commun" });
  const polices = [langue.police.famille, ...(langue.police.secours ?? []), "Noto Sans"]
    .map((police) => `"${police}"`);
  return (
    <html lang={langue.tag} dir={langue.direction}>
      <body style={{ "--police": [...new Set(polices), "system-ui", "sans-serif"].join(", ") } as CSSProperties}>
        <a className="evitement" href="#contenu">{t("allerAuContenu")}</a>
        {children}
      </body>
    </html>
  );
}
