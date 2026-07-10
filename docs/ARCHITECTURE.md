# Architecture

## Overview

This is a static SvelteKit SPA. `@sveltejs/adapter-static` produces a fully static `build/` directory — there is no server at runtime. GitHub Pages just serves files; all data fetching happens client-side (or at build time for prerendered routes) directly against the public PokeAPI (`https://pokeapi.co/api/v2`).

## Route structure

| Route | Prerendered? | Notes |
| --- | --- | --- |
| `/` | Yes | List page. `+page.ts` fetches the full name/URL list (cheap, one request) at build time, plus the first page of full Pokémon detail so the LCP artwork ships in the static HTML. |
| `/pokemon/[name]` | No (`ssr = false`) | Dynamic — served via the SPA fallback (`404.html`) and rendered fully client-side. |
| `/berries` | Yes | Same pattern as `/`, without infinite scroll (small dataset). |
| `/berries/[name]` | No | Same as the Pokémon detail route. |
| `/favorites` | Yes (shell only) | Content is 100% `localStorage`-driven; the prerendered shell just hydrates and reads favorites client-side. |

Dynamic routes can't be prerendered because their content depends on a path param that isn't enumerable ahead of time (1300+ Pokémon, 60+ berries) — `adapter-static`'s `fallback: '404.html'` makes GitHub Pages hand any unmatched path back to the SPA, which then resolves the route with the client-side router.

## Data flow

1. A route's `+page.ts` `load` calls a typed function from `src/lib/api/client.ts` (`getPokemon`, `getPokemonList`, `getBerry`, ...).
2. Every client function goes through `src/lib/api/cache.ts`'s `cachedFetch`, which:
   - checks an in-memory `Map<url, parsedData>` keyed by the exact request URL,
   - `fetch`es on a miss,
   - parses the JSON with the matching Zod schema from `src/lib/api/schemas.ts` (throws on a shape mismatch instead of shipping bad data silently),
   - caches and returns the parsed, typed result.
3. Because the cache is a plain module-level `Map`, it's shared across `load` calls within a session — navigating between `/pokemon/charmander` and back to `/` and into `/pokemon/charmander` again does not re-fetch.
4. The list page (`/`) additionally keeps its own `Map<name, Pokemon>` in component state (`details`), populated by both the prerendered `initialPokemon` seed and further client-side fetches as the user scrolls, searches, or filters.

## Search & filtering

Filtering is done entirely client-side against three independently-fetched sets, intersected:

- **Search**: substring match on name (debounced 250ms).
- **Generation**: `/generation/{id}` → a `Set<name>`, fetched only when a generation is selected.
- **Type**: `/type/{name}` → a `Set<name>` per selected type, intersected (AND) across all selected types.

The intersected result is paginated locally (`loadedCount`, +30 per `IntersectionObserver` trigger) and full Pokémon detail is fetched — through the same cache — only for the currently visible slice.

## Layout-shift-safe rendering

Sort mode `dex` renders the grid in a **stable per-slot order**: each name is placed at a position computed synchronously from its resource URL (the numeric ID is parseable without a fetch), so a card finishing its detail fetch swaps a skeleton for real content **in place** rather than being appended/reordered. This was the single biggest Cumulative Layout Shift source during development (see `docs/DECISIONS.md` and `NOTES.md`) — sort mode `stats` (base-stat total) intentionally accepts some reordering as cards finish loading, since the sort key itself isn't known until the fetch completes.

## State & persistence

`src/lib/stores/theme.svelte.ts` and `src/lib/stores/favorites.svelte.ts` are Svelte 5 rune-based stores (a factory function closing over `$state`), not Svelte 4 stores. Both read their initial value from `localStorage` behind an `if (browser)` guard (SSR/prerender has no `window`) and persist on every mutation.

## Testing

- **Unit** (`vitest`): pure logic — the Zod schemas, the cache's dedup/error behavior, stat totals, and the type-color helpers.
- **E2E** (`playwright`): drives a production build+preview (`npm run build && npm run preview`) through the real user flows — browsing, search, filter empty-state, detail navigation, favoriting + reload persistence, theme toggle + reload persistence, and berries.
