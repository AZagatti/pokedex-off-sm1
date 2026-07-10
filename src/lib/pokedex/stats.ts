import type { Pokemon } from "$lib/api/schemas";

export function statTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
}
