import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { entree } from "@/donnees/catalogue";
import { clesManquantes } from "@/i18n/charger";
import { routing } from "@/i18n/routing";
import "@/styles/polices.css";
import "@/styles/global.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const langue = entree(locale);
  if (!hasLocale(routing.locales, locale) || !langue) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("commun");
  const repli = (await clesManquantes(locale)).length > 0;

  // Police de la langue, ses secours, puis Noto Sans pour les passages latins.
  const polices = [langue.police.famille, ...(langue.police.secours ?? []), "Noto Sans"].map((p) => `"${p}"`);

  return (
    <html lang={locale} dir={langue.direction}>
      <body style={{ "--police": [...new Set(polices), "system-ui", "sans-serif"].join(", ") } as CSSProperties}>
        {repli && (
          <p className="repli" role="status">
            {t("repliSignale")}
          </p>
        )}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
