import { cachedFetch } from "./cache";
import {
  type Berry,
  berrySchema,
  type EvolutionChain,
  evolutionChainSchema,
  type GenerationDetail,
  generationDetailSchema,
  type NamedApiResourceList,
  namedApiResourceListSchema,
  type Pokemon,
  pokemonSchema,
  type PokemonSpecies,
  pokemonSpeciesSchema,
  type TypeDetail,
  typeDetailSchema,
} from "./schemas";

export const API_BASE = "https://pokeapi.co/api/v2";

const TYPE_NAMES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "stellar",
  "unknown",
] as const;

export function getPokemonList(
  limit: number,
  offset: number,
  fetchFn?: typeof fetch
): Promise<NamedApiResourceList> {
  return cachedFetch(
    `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    (data) => namedApiResourceListSchema.parse(data),
    fetchFn
  );
}

export function getPokemon(
  nameOrId: string | number,
  fetchFn?: typeof fetch
): Promise<Pokemon> {
  return cachedFetch(
    `${API_BASE}/pokemon/${nameOrId}`,
    (data) => pokemonSchema.parse(data),
    fetchFn
  );
}

export function getPokemonSpecies(
  nameOrId: string | number,
  fetchFn?: typeof fetch
): Promise<PokemonSpecies> {
  return cachedFetch(
    `${API_BASE}/pokemon-species/${nameOrId}`,
    (data) => pokemonSpeciesSchema.parse(data),
    fetchFn
  );
}

export function getEvolutionChain(
  url: string,
  fetchFn?: typeof fetch
): Promise<EvolutionChain> {
  return cachedFetch(url, (data) => evolutionChainSchema.parse(data), fetchFn);
}

export function getType(
  name: string,
  fetchFn?: typeof fetch
): Promise<TypeDetail> {
  return cachedFetch(
    `${API_BASE}/type/${name}`,
    (data) => typeDetailSchema.parse(data),
    fetchFn
  );
}

export function getGeneration(
  id: number,
  fetchFn?: typeof fetch
): Promise<GenerationDetail> {
  return cachedFetch(
    `${API_BASE}/generation/${id}`,
    (data) => generationDetailSchema.parse(data),
    fetchFn
  );
}

export function getBerryList(
  limit: number,
  offset: number,
  fetchFn?: typeof fetch
): Promise<NamedApiResourceList> {
  return cachedFetch(
    `${API_BASE}/berry?limit=${limit}&offset=${offset}`,
    (data) => namedApiResourceListSchema.parse(data),
    fetchFn
  );
}

export function getBerry(
  nameOrId: string | number,
  fetchFn?: typeof fetch
): Promise<Berry> {
  return cachedFetch(
    `${API_BASE}/berry/${nameOrId}`,
    (data) => berrySchema.parse(data),
    fetchFn
  );
}

export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : Number.NaN;
}

export function typeNames(): readonly string[] {
  return TYPE_NAMES;
}
