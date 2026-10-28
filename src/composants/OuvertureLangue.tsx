"use client";

import { useEffect } from "react";
import { chargerPreferences } from "@/donnees/preferences-visiteur";

export default function OuvertureLangue({ chargement }: { chargement: string }) {
  useEffect(() => {
    const preferences = chargerPreferences();
    window.location.replace(`/${preferences.interface}${window.location.search}${window.location.hash}`);
  }, []);

  return <p role="status">{chargement}</p>;
}
