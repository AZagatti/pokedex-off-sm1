import { expect, test } from "@playwright/test";

test.describe("Pokédex list", () => {
  test("loads and shows the first page of cards", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "bulbasaur" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /charizard/i })).toBeVisible();
  });

  test("filters by search query", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: /search pokémon/i })
      .fill("charizard");
    await expect(
      page.getByRole("heading", { name: "charizard", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "bulbasaur" })
    ).not.toBeVisible();
  });

  test("shows an empty state for no matches", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: /search pokémon/i })
      .fill("zzznotapokemonzzz");
    await expect(
      page.getByText("No Pokémon match your filters.")
    ).toBeVisible();
  });

  test("navigates to a detail page and back", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /bulbasaur/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/);
    await expect(
      page.getByRole("heading", { name: "bulbasaur", level: 1 })
    ).toBeVisible();
    await page.getByRole("link", { name: /back to pokédex/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Favorites", () => {
  test("favoriting a Pokémon persists across reload", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /add bulbasaur to favorites/i })
      .click();
    await page.goto("/favorites");
    await expect(
      page.getByRole("heading", { name: "Bulbasaur" })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Bulbasaur" })
    ).toBeVisible();
  });
});

test.describe("Theme", () => {
  test("toggling dark mode persists across reload", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /switch to dark theme/i });
    await expect(toggle).toBeEnabled();
    await expect(async () => {
      await toggle.click();
      await expect(page.locator("html")).toHaveClass(/dark/, { timeout: 500 });
    }).toPass({ timeout: 10_000 });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});

test.describe("Berries", () => {
  test("lists berries and navigates to a detail page", async ({ page }) => {
    await page.goto("/berries");
    await expect(page.getByRole("heading", { name: "Cheri" })).toBeVisible();
    await page.getByRole("link", { name: /cheri/i }).first().click();
    await expect(page).toHaveURL(/\/berries\/cheri/);
    await expect(page.getByText("Flavors")).toBeVisible();
  });
});
