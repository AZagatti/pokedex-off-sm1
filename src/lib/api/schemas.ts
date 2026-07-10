import { z } from "zod";

export const namedApiResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type NamedApiResource = z.infer<typeof namedApiResourceSchema>;

export const namedApiResourceListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(namedApiResourceSchema),
});
export type NamedApiResourceList = z.infer<typeof namedApiResourceListSchema>;

export const pokemonSpriteVariantSchema = z.object({
  front_default: z.string().nullable(),
  front_shiny: z.string().nullable().optional(),
  back_default: z.string().nullable().optional(),
  back_shiny: z.string().nullable().optional(),
});

export const pokemonSpritesSchema = z
  .object({
    front_default: z.string().nullable(),
    back_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    back_shiny: z.string().nullable(),
    other: z
      .object({
        "official-artwork": z
          .object({
            front_default: z.string().nullable().optional(),
            front_shiny: z.string().nullable().optional(),
          })
          .optional(),
        home: z
          .object({
            front_default: z.string().nullable().optional(),
            front_shiny: z.string().nullable().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .passthrough();
export type PokemonSprites = z.infer<typeof pokemonSpritesSchema>;

export const pokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: namedApiResourceSchema,
});

export const pokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: namedApiResourceSchema,
});

export const pokemonAbilitySchema = z.object({
  ability: namedApiResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

export const pokemonMoveSchema = z.object({
  move: namedApiResourceSchema,
});

export const pokemonCriesSchema = z
  .object({
    latest: z.string().nullable().optional(),
    legacy: z.string().nullable().optional(),
  })
  .optional();

export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable().optional(),
  sprites: pokemonSpritesSchema,
  types: z.array(pokemonTypeSlotSchema),
  stats: z.array(pokemonStatSchema),
  abilities: z.array(pokemonAbilitySchema),
  moves: z.array(pokemonMoveSchema),
  species: namedApiResourceSchema,
  cries: pokemonCriesSchema,
});
export type Pokemon = z.infer<typeof pokemonSchema>;

export const flavorTextEntrySchema = z.object({
  flavor_text: z.string(),
  language: namedApiResourceSchema,
});

export const pokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({ url: z.string() }).nullable(),
  flavor_text_entries: z.array(flavorTextEntrySchema),
  generation: namedApiResourceSchema,
  genera: z.array(
    z.object({ genus: z.string(), language: namedApiResourceSchema })
  ),
});
export type PokemonSpecies = z.infer<typeof pokemonSpeciesSchema>;

export interface EvolutionChainLink {
  species: NamedApiResource;
  evolves_to: EvolutionChainLink[];
}

export const evolutionChainLinkSchema: z.ZodType<EvolutionChainLink> = z.lazy(
  () =>
    z.object({
      species: namedApiResourceSchema,
      evolves_to: z.array(evolutionChainLinkSchema),
    })
);

export const evolutionChainSchema = z.object({
  id: z.number(),
  chain: evolutionChainLinkSchema,
});
export type EvolutionChain = z.infer<typeof evolutionChainSchema>;

export const typeDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({ slot: z.number(), pokemon: namedApiResourceSchema })
  ),
});
export type TypeDetail = z.infer<typeof typeDetailSchema>;

export const generationDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(namedApiResourceSchema),
});
export type GenerationDetail = z.infer<typeof generationDetailSchema>;

export const berryFlavorMapSchema = z.object({
  potency: z.number(),
  flavor: namedApiResourceSchema,
});

export const berrySchema = z.object({
  id: z.number(),
  name: z.string(),
  growth_time: z.number(),
  max_harvest: z.number(),
  natural_gift_power: z.number(),
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
  firmness: namedApiResourceSchema,
  flavors: z.array(berryFlavorMapSchema),
  item: namedApiResourceSchema,
});
export type Berry = z.infer<typeof berrySchema>;
