"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "@/composants/Terme.module.css";

// Le bouton garde son nom ; la définition est sa description accessible.
export default function InfobulleTerme({ id, children, definition }: {
  id: string;
  children: ReactNode;
  definition: ReactNode;
}) {
  const infobulleId = useId();
  const conteneur = useRef<HTMLSpanElement>(null);
  const survolee = useRef(false);
  const ouverteAvantAppui = useRef(false);
  const [ouverte, setOuverte] = useState(false);

  useEffect(() => {
    if (!ouverte) return;
    function fermerAuDehors(evenement: PointerEvent) {
      if (evenement.target instanceof Node && !conteneur.current?.contains(evenement.target)) {
        setOuverte(false);
      }
    }
    function fermerAvecEchap(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") setOuverte(false);
    }
    document.addEventListener("pointerdown", fermerAuDehors);
    document.addEventListener("keydown", fermerAvecEchap);
    return () => {
      document.removeEventListener("pointerdown", fermerAuDehors);
      document.removeEventListener("keydown", fermerAvecEchap);
    };
  }, [ouverte]);

  return (
    <span ref={conteneur} className={styles.terme}
      onPointerEnter={(evenement) => {
        if (evenement.pointerType === "mouse") {
          survolee.current = true;
          setOuverte(true);
        }
      }}
      onPointerLeave={(evenement) => {
        if (evenement.pointerType === "mouse") {
          survolee.current = false;
          if (!conteneur.current?.contains(document.activeElement)) setOuverte(false);
        }
      }}>
      <button type="button" className={styles.declencheur} data-terme={id}
        aria-describedby={infobulleId} aria-expanded={ouverte} aria-controls={infobulleId}
        onFocus={() => setOuverte(true)}
        onBlur={() => { if (!survolee.current) setOuverte(false); }}
        onPointerDown={() => { ouverteAvantAppui.current = ouverte; }}
        onClick={(evenement) => {
          setOuverte(evenement.detail === 0 ? !ouverte : !ouverteAvantAppui.current);
        }}>
        {children}
      </button>
      <span id={infobulleId} className={styles.infobulle} role="tooltip" hidden={!ouverte}>
        {definition}
      </span>
    </span>
  );
}
