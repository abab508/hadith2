import { expect, test } from "@playwright/test";

test("/ redirige vers l'arabe, en RTL", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("passage ar → fr → ur depuis le sélecteur", async ({ page }) => {
  await page.goto("/ar");
  await page.getByRole("link", { name: "français" }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Milaghaiba");
  await expect(page).toHaveTitle("Milaghaiba");

  await page.getByRole("link", { name: "اردو" }).click();
  await expect(page).toHaveURL(/\/ur$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "اردو" })).toHaveAttribute("aria-current", "page");
});

test("le terme suit le format « Terme (arabe — translittération) » avec infobulle", async ({ page }) => {
  await page.goto("/fr");
  const terme = page.locator('[data-terme="hasan"]');
  await expect(terme).toContainText("Bon (حسن — ḥasan)");
  const infobulle = page.getByRole("tooltip");
  await expect(infobulle).toBeHidden();
  await terme.focus();
  await expect(infobulle).toBeVisible();
  await expect(infobulle).toContainText("à valider par un spécialiste");
});

test("les polices Noto se chargent (arabe, ourdou, latin)", async ({ page }) => {
  for (const [chemin, famille, echantillon] of [
    ["/ar", "Noto Naskh Arabic", "حسن"],
    ["/ur", "Noto Nastaliq Urdu", "اردو"],
    ["/fr", "Noto Sans", "ḥasan"],
  ] as const) {
    await page.goto(chemin);
    const chargee = await page.evaluate(
      async ([f, e]) => {
        await document.fonts.load(`16px "${f}"`, e);
        return document.fonts.check(`16px "${f}"`, e);
      },
      [famille, echantillon],
    );
    expect(chargee, famille).toBe(true);
  }
});

test("une langue inconnue donne une page 404", async ({ page }) => {
  const reponse = await page.goto("/ar/zz");
  expect(reponse?.status()).toBe(404);
});
