import type { CSSProperties, ReactNode } from "react";
import { catalogue, entree } from "@/donnees/catalogue";
import "@/styles/polices.css";
import "@/styles/global.css";

// Racine statique indépendante du layout localisé, sans lecture du navigateur au serveur.
export default function LayoutEntree({ children }: { children: ReactNode }) {
  const langue = entree(catalogue.langueParDefaut)!;
  const polices = [langue.police.famille, ...(langue.police.secours ?? []), "Noto Sans"]
    .map((police) => `"${police}"`);
  return (
    <html lang={langue.tag} dir={langue.direction}>
      <body style={{ "--police": [...new Set(polices), "system-ui", "sans-serif"].join(", ") } as CSSProperties}>
        {children}
      </body>
    </html>
  );
}
