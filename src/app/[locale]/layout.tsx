import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { entree } from "@/donnees/catalogue";
import { routing } from "@/i18n/routing";
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

  const polices = [langue.police.famille, ...(langue.police.secours ?? [])].map((p) => `"${p}"`);

  return (
    <html lang={locale} dir={langue.direction}>
      <body style={{ "--police": [...polices, "system-ui", "sans-serif"].join(", ") } as CSSProperties}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
