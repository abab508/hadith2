import { expect, test } from "@playwright/test";
import brut from "../../data/langues/catalogue.json" with { type: "json" };
import en from "../../messages/en.json" with { type: "json" };
import fr from "../../messages/fr.json" with { type: "json" };
import { catalogueLangues } from "@/donnees/schemas/langue";
import type { Preferences } from "@/donnees/preferences";
import { cleStockagePreferences } from "@/donnees/preferences-visiteur";

const catalogue = catalogueLangues.parse(brut);
const preferences: Preferences = { interface: "fr", rapport: "en", recherche: ["ar", "ur"] };

test("enregistre trois préférences indépendantes, les retrouve au rechargement et ne pose aucun cookie", async ({ page, context }) => {
  await page.goto("/ar/parametres");
  await expect(page.locator("#langue-interface")).toHaveValue("ar");
  await expect(page.locator("#langue-rapport")).toHaveValue("ar");
  await expect(page.locator("#recherche-ar")).toBeChecked();
  await expect(page.locator("#recherche-ar")).toBeDisabled();

  await page.locator("#langue-interface").selectOption("fr");
  await page.locator("#langue-rapport").selectOption("en");
  await page.locator("#recherche-ur").check();
  // Le formulaire n'applique les choix qu'après l'enregistrement.
  await expect(page).toHaveURL(/\/ar\/parametres$/);
  await expect(page.locator("#langue-interface")).toHaveValue("fr");
  await page.locator('form button[type="submit"]').click();

  await expect(page).toHaveURL(/\/fr\/parametres$/);
  await expect(page.locator("#confirmation-preferences")).toHaveText(fr.pref.ok);
  await expect(page.locator("#confirmation-preferences")).toHaveAttribute("aria-live", "polite");
  await page.reload();
  await expect(page.locator("#langue-interface")).toHaveValue("fr");
  await expect(page.locator("#langue-rapport")).toHaveValue("en");
  for (const langue of catalogue.entrees.filter((langue) => langue.statut !== "desactivee" && langue.niveaux.interface)) {
    if (preferences.recherche.includes(langue.tag)) {
      await expect(page.locator(`#recherche-${langue.tag}`)).toBeChecked();
    } else {
      await expect(page.locator(`#recherche-${langue.tag}`)).not.toBeChecked();
    }
  }
  expect(await context.cookies()).toEqual([]);
});

test("rapport et recherche conservent leurs propres valeurs après un changement d'interface dans l'en-tête", async ({ page, context }) => {
  await context.addInitScript(({ cle, valeur }) => {
    localStorage.setItem(cle, JSON.stringify(valeur));
  }, { cle: cleStockagePreferences, valeur: preferences });
  await page.goto("/fr/parametres");
  await expect(page.locator("#langue-rapport")).toHaveValue("en");

  await page.locator("#langue-rapport").selectOption("ur");
  await expect(page.locator("#langue-interface")).toHaveValue("fr");
  await expect(page.locator("#recherche-ur")).toBeChecked();
  await page.locator("#recherche-ur").uncheck();
  await page.locator("#recherche-en").check();
  await expect(page.locator("#langue-rapport")).toHaveValue("ur");
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator("#confirmation-preferences")).toHaveText(fr.pref.ok);
  await expect(page).toHaveURL(/\/fr\/parametres$/);

  await page.locator('header a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/parametres$/);
  await expect(page.locator("#langue-interface")).toHaveValue("en");
  await expect(page.locator("#langue-rapport")).toHaveValue("ur");
  await expect(page.locator("#recherche-ar")).toBeChecked();
  await expect(page.locator("#recherche-en")).toBeChecked();
  await expect(page.locator("#recherche-ur")).not.toBeChecked();
  const memorisees = await page.evaluate((cle) => JSON.parse(localStorage.getItem(cle) ?? "null") as unknown, cleStockagePreferences);
  expect(memorisees).toEqual({ interface: "en", rapport: "ur", recherche: ["ar", "en"] });
  expect(await context.cookies()).toEqual([]);
});

test("la racine ouvre la langue d'interface mémorisée", async ({ page, context }) => {
  await context.addInitScript(({ cle, valeur }) => {
    localStorage.setItem(cle, JSON.stringify(valeur));
  }, { cle: cleStockagePreferences, valeur: preferences });
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  expect(await context.cookies()).toEqual([]);
});

test("la racine ouvre l'arabe sans préférence, sans détection de la langue du navigateur", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, locale: "en-US" });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(await context.cookies()).toEqual([]);
  } finally {
    await context.close();
  }
});

for (const [nom, valeur] of [
  ["inconnue", JSON.stringify({ ...preferences, interface: "zz" })],
  ["JSON invalide", "{"],
] as const) {
  test(`la racine se replie sur l'arabe avec une préférence ${nom}`, async ({ page, context }) => {
    await context.addInitScript(({ cle, texte }) => {
      localStorage.setItem(cle, texte);
    }, { cle: cleStockagePreferences, texte: valeur });
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
  });
}

test("une adresse anglaise explicite prime sur la préférence française", async ({ page, context }) => {
  await context.addInitScript(({ cle, valeur }) => {
    localStorage.setItem(cle, JSON.stringify(valeur));
  }, { cle: cleStockagePreferences, valeur: preferences });
  await page.goto("/en");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await context.cookies()).toEqual([]);
});

test("enregistrer seulement le rapport garde l'adresse anglaise explicite malgré la préférence française", async ({ page, context }) => {
  await context.addInitScript(({ cle, valeur }) => {
    localStorage.setItem(cle, JSON.stringify(valeur));
  }, { cle: cleStockagePreferences, valeur: preferences });
  await page.goto("/en/parametres");
  await expect(page.locator("#langue-interface")).toHaveValue("fr");
  await page.locator("#langue-rapport").selectOption("ur");
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator("#confirmation-preferences")).toHaveText(en.pref.ok);
  await expect(page).toHaveURL(/\/en\/parametres$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#langue-interface")).toHaveValue("fr");
  await expect(page.locator("#langue-rapport")).toHaveValue("ur");
  const memorisees = await page.evaluate((cle) => JSON.parse(localStorage.getItem(cle) ?? "null") as unknown, cleStockagePreferences);
  expect(memorisees).toEqual({ interface: "fr", rapport: "ur", recherche: ["ar", "ur"] });
});

test("enregistrer seulement le rapport sur une adresse française sans mémoire ne change pas l'interface affichée", async ({ page }) => {
  await page.goto("/fr/parametres");
  await expect(page.locator("#langue-interface")).toHaveValue("ar");
  await page.locator("#langue-rapport").selectOption("en");
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator("#confirmation-preferences")).toHaveText(fr.pref.ok);
  await expect(page).toHaveURL(/\/fr\/parametres$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("#langue-interface")).toHaveValue("ar");
  await expect(page.locator("#langue-rapport")).toHaveValue("en");
  const memorisees = await page.evaluate((cle) => JSON.parse(localStorage.getItem(cle) ?? "null") as unknown, cleStockagePreferences);
  expect(memorisees).toEqual({ interface: "ar", rapport: "en", recherche: ["ar"] });
});

test("les préférences restent en mémoire pendant les navigations client si le stockage est indisponible", async ({ page, context }) => {
  await context.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() { throw new DOMException("Stockage indisponible", "SecurityError"); },
    });
  });
  await page.goto("/fr/parametres");
  await page.locator("#langue-interface").selectOption("fr");
  await page.locator("#langue-rapport").selectOption("en");
  await page.locator("#recherche-ur").check();
  await page.locator('form button[type="submit"]').click();
  await expect(page.locator("#confirmation-preferences")).toHaveText(fr.pref.ok);

  await page.locator('header a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/parametres$/);
  await expect(page.locator("#langue-interface")).toHaveValue("en");
  await expect(page.locator("#langue-rapport")).toHaveValue("en");
  await expect(page.locator("#recherche-ar")).toBeChecked();
  await expect(page.locator("#recherche-ur")).toBeChecked();
  expect(await context.cookies()).toEqual([]);
});

test("la page des langues présente les huit niveaux de chaque entrée visible et distingue interface et sources", async ({ page }) => {
  await page.goto("/fr/langues");
  await expect(page.locator("main")).not.toContainText(/entièrement/i);
  await expect(page.locator("main")).toContainText("sources");
  const visibles = catalogue.entrees.filter((langue) => langue.statut !== "desactivee");
  await expect(page.locator("article[data-langue]")).toHaveCount(visibles.length);
  for (const langue of visibles) {
    const fiche = page.locator(`article[data-langue="${langue.tag}"]`);
    await expect(fiche).toContainText(langue.nomNatif);
    await expect(fiche.locator("dl[data-disponibilites] dt")).toHaveCount(3);
    await fiche.locator("summary").click();
    await expect(fiche.locator("details [data-niveau]")).toHaveCount(8);
    for (const niveau of Object.keys(langue.niveaux)) {
      await expect(fiche.locator(`details [data-niveau="${niveau}"]`)).toBeVisible();
    }
    if (langue.statut === "experimentale") {
      await expect(fiche).toContainText(/expérimentale/i);
    }
  }
});

for (const [chemin, langue] of [["/ar/parametres", "ar"], ["/ur/langues", "ur"]] as const) {
  test(`${chemin} conserve le sens RTL`, async ({ page }) => {
    await page.goto(chemin);
    await expect(page.locator("html")).toHaveAttribute("lang", langue);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main")).toBeVisible();
  });
}

test.describe("racine sans JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("propose un lien utilisable vers l'arabe", async ({ page }) => {
    await page.goto("/");
    const lien = page.locator('noscript a[href="/ar"]');
    await expect(lien).toBeVisible();
    await lien.click();
    await expect(page).toHaveURL(/\/ar$/);
  });
});
