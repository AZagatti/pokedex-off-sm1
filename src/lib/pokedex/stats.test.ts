import type { Pokemon } from "$lib/api/schemas";
import { describe, expect, it } from "vitest";

import { statTotal } from "./stats";

function makePokemon(stats: number[]): Pokemon {
  return {
    id: 1,
    name: "test",
    height: 1,
    weight: 1,
    sprites: {
      front_default: null,
      back_default: null,
      front_shiny: null,
      back_shiny: null,
    },
    types: [],
    stats: stats.map((base_stat, i) => ({
      base_stat,
      effort: 0,
      stat: { name: `stat-${i}`, url: "https://x" },
    })),
    abilities: [],
    moves: [],
    species: { name: "test", url: "https://x" },
  };
}

describe("statTotal", () => {
  it("sums base stats", () => {
    expect(statTotal(makePokemon([45, 49, 49, 65, 65, 45]))).toBe(318);
  });

  it("returns 0 for a pokemon with no stats", () => {
    expect(statTotal(makePokemon([]))).toBe(0);
  });
});
