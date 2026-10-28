import { notFound } from "next/navigation";

// Fait passer les adresses inconnues par la 404 du layout de leur langue.
export default function AdresseIntrouvable() {
  notFound();
}
