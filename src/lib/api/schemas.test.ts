import { describe, expect, it } from "vitest";

import {
  berrySchema,
  evolutionChainSchema,
  namedApiResourceListSchema,
  pokemonSchema,
} from "./schemas";

describe("pokemonSchema", () => {
  it("parses a minimal valid pokemon payload", () => {
    const payload = {
      id: 1,
      name: "bulbasaur",
      height: 7,
      weight: 69,
      sprites: {
        front_default: null,
        back_default: null,
        front_shiny: null,
        back_shiny: null,
      },
      types: [
        {
          slot: 1,
          type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        },
      ],
      stats: [
        { base_stat: 45, effort: 0, stat: { name: "hp", url: "https://x" } },
      ],
      abilities: [
        {
          ability: { name: "overgrow", url: "https://x" },
          is_hidden: false,
          slot: 1,
        },
      ],
      moves: [],
      species: { name: "bulbasaur", url: "https://x" },
    };

    const result = pokemonSchema.parse(payload);
    expect(result.name).toBe("bulbasaur");
    expect(result.types[0]?.type.name).toBe("grass");
  });

  it("rejects a payload missing required fields", () => {
    expect(() => pokemonSchema.parse({ name: "incomplete" })).toThrow();
  });
});

describe("namedApiResourceListSchema", () => {
  it("parses a paginated list response", () => {
    const result = namedApiResourceListSchema.parse({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: "bulbasaur", url: "https://x" }],
    });
    expect(result.results).toHaveLength(1);
  });
});

describe("evolutionChainSchema", () => {
  it("parses a recursive evolution chain", () => {
    const result = evolutionChainSchema.parse({
      id: 1,
      chain: {
        species: { name: "charmander", url: "https://x" },
        evolves_to: [
          {
            species: { name: "charmeleon", url: "https://x" },
            evolves_to: [
              {
                species: { name: "charizard", url: "https://x" },
                evolves_to: [],
              },
            ],
          },
        ],
      },
    });
    expect(result.chain.evolves_to[0]?.evolves_to[0]?.species.name).toBe(
      "charizard"
    );
  });
});

describe("berrySchema", () => {
  it("parses a berry payload", () => {
    const result = berrySchema.parse({
      id: 1,
      name: "cheri",
      growth_time: 3,
      max_harvest: 5,
      natural_gift_power: 60,
      size: 20,
      smoothness: 25,
      soil_dryness: 15,
      firmness: { name: "soft", url: "https://x" },
      flavors: [{ potency: 10, flavor: { name: "spicy", url: "https://x" } }],
      item: { name: "cheri-berry", url: "https://x" },
    });
    expect(result.firmness.name).toBe("soft");
  });
});
