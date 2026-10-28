import { setRequestLocale } from "next-intl/server";
import PreferencesLangues from "@/composants/PreferencesLangues";

export default async function Parametres({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PreferencesLangues />;
}
