import { getPokemon, getPokemonList } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const prerender = true;

// Only the first couple of grid rows are painted before scroll, so keep this
// small — it's baked into the prerendered HTML and each entry is an eagerly
// requested image that competes with the true LCP candidate for bandwidth.
const INITIAL_PAGE_SIZE = 10;

export const load: PageLoad = async ({ fetch }) => {
  const list = await getPokemonList(2000, 0, fetch);
  const firstPage = list.results.slice(0, INITIAL_PAGE_SIZE);
  const initialPokemon = await Promise.all(
    firstPage.map((p) => getPokemon(p.name, fetch))
  );

  return { allPokemon: list.results, initialPokemon };
};
