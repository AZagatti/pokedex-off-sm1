# Decisions

Why each pinned choice, and a few notable tradeoffs made while building this.

## SvelteKit + Svelte 5 runes

Runes (`$state`, `$derived`, `$effect`) give fine-grained reactivity without the "everything is a store" ceremony of Svelte 4, and they work identically inside `.svelte` files and plain `.svelte.ts` modules — which is what makes `theme.svelte.ts` and `favorites.svelte.ts` possible as standalone, testable-in-principle store modules rather than components.

## `adapter-static` in SPA mode (`fallback: '404.html'`)

GitHub Pages has no server runtime, so a static adapter is the only option. Prerendering everything isn't possible: the two detail routes (`/pokemon/[name]`, `/berries/[name]`) have thousands of possible params that would have to be enumerated and built up front for a gain (SSR'd HTML) this app doesn't need, since PokeAPI has no rate limit concerns and every consumer here has JS. `fallback: '404.html'` lets GitHub Pages hand any unmatched path to the SPA shell, which then resolves the route client-side. The one real cost: a direct hit on a detail URL returns an HTTP 404 status from GitHub Pages even though the page renders correctly after the fallback loads (confirmed both `curl`-side and by navigating to it directly with a real browser during verification) — an inherent limitation of static hosting without server-side rewrites, not a bug in this app.

## Tailwind CSS v4 (Vite plugin, no config file)

v4's `@tailwindcss/vite` plugin needs zero `tailwind.config.js` — theme customization lives in CSS (`@import 'tailwindcss'`, `@custom-variant dark`). Less config surface, and the JIT scan runs through Vite's own module graph instead of a separate file-glob step.

## Zod schemas per PokeAPI shape

PokeAPI's JSON is loosely typed from a TS point of view and occasionally has optional/nullable quirks that differ per-endpoint (e.g. `official-artwork` isn't always present). Parsing every response through a matching Zod schema in `src/lib/api/schemas.ts` means a shape a schema doesn't expect throws immediately at the `load` boundary instead of surfacing as a `Cannot read properties of undefined` deep in a component.

## Map-based in-memory cache, keyed by URL

The spec calls for "a small `src/lib/api/cache.ts`" rather than a data-fetching library — a plain `Map<string, unknown>` keyed by the exact request URL is the simplest thing that actually works: identical requests (e.g. re-visiting a Pokémon, or two components asking for the same generation) resolve from memory instead of hitting the network again, with no extra dependency.

## Ultracite → oxlint + oxfmt (with rule overrides)

Ultracite ships presets for Biome, ESLint, and Oxlint — Oxlint was chosen for the Rust-speed win the spec called for. The installed version only ships an `ultracite/oxlint/svelte` preset (not `.../sveltekit`, which doesn't exist for this version) — discovered by inspecting `node_modules/ultracite/config/oxlint/` directly rather than guessing. A handful of Ultracite's stricter stylistic rules were turned off in `oxlint.config.ts`: `sort-keys` and `func-style` fight idiomatic code structure without catching bugs; `unicorn/filename-case` wants kebab-case filenames, which conflicts with the Svelte community's PascalCase-component convention; and `prefer-const`/`no-unassigned-vars` produce false positives on `.svelte` files because a JS-only analyzer can't see `bind:value`/`bind:this`/`$bindable` reassigning a `let` through the template.

## Lefthook over Husky

Single static binary, no Node startup cost per hook, and a declarative YAML config that maps directly onto "pre-commit: lint+format+typecheck on staged, pre-push: full test suite" from the spec.

## Prerendering the first page of Pokémon detail (not just names)

The list page originally prerendered only the name/URL list and fetched every Pokémon's full detail client-side after hydration. That meant the largest-contentful-paint image couldn't even be _discovered_ until after JS hydrated and an API round-trip completed — Lighthouse Performance sat at 66–87 depending on run, dominated by LCP. Prerendering the first 10 Pokémon's full detail (small — it's build-time cost, not a runtime request) bakes real artwork URLs into the static HTML, cutting LCP by an entire network round-trip. `fetchpriority` and a `<link rel="preload">` for the very first artwork squeeze out the rest. See `NOTES.md` for the exact before/after numbers.

## Per-slot stable ordering to fix Cumulative Layout Shift

The list originally rendered "loaded cards, sorted" followed by "remaining skeletons." Every finished fetch could jump a card from wherever its skeleton was to its sorted position — visually, cards were constantly reshuffling as data arrived, which Lighthouse measured as a Cumulative Layout Shift around 1.4 (anything above 0.25 is "poor"). Since a Pokémon's dex number is parseable from its resource URL without a fetch, the default sort mode now computes each card's grid position up front and swaps skeleton→content **in that fixed slot** — CLS dropped to ~0. The stat-total sort mode still reorders as cards finish loading, since the sort key genuinely isn't known until the fetch resolves; that's an accepted, deliberate tradeoff scoped to a non-default sort mode.

## Type badge colors: darkened for text, kept true for gradients

The official Pokémon type palette (bright pastels like electric yellow, grass green) is designed for flat icon fills, not for white text sitting directly on top of it — several failed WCAG's 4.5:1 contrast requirement. `typeBadgeColor()` darkens the same palette by a fixed 45% specifically for anywhere text sits on the color, while `typeColor()` keeps the true, recognizable hue for gradients and tinted backgrounds elsewhere.
