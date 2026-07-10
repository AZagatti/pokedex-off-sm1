import { getPokemonList } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
  const list = await getPokemonList(2000, 0, fetch);
  return { allPokemon: list.results };
};
