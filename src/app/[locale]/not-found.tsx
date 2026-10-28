import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PageIntrouvable() {
  const t = await getTranslations("introuvable");
  const navigation = await getTranslations("navigation");
  return (
    <main id="contenu" tabIndex={-1} className="accueil">
      <h1>{t("titre")}</h1>
      <p>{t("description")}</p>
      <p><Link href="/">{navigation("accueil")}</Link></p>
    </main>
  );
}
