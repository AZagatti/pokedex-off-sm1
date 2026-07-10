export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fighting: "#C22E28",
  flying: "#A98FF3",
  poison: "#A33EA1",
  ground: "#E2BF65",
  rock: "#B6A136",
  bug: "#A6B91A",
  ghost: "#735797",
  steel: "#B7B7CE",
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  psychic: "#F95587",
  ice: "#96D9D6",
  dragon: "#6F35FC",
  dark: "#705746",
  fairy: "#D685AD",
  stellar: "#40B5A5",
  unknown: "#68A090",
  shadow: "#5A5366",
};

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.unknown;
}

export const GENERATIONS = [
  { id: 1, name: "Generation I" },
  { id: 2, name: "Generation II" },
  { id: 3, name: "Generation III" },
  { id: 4, name: "Generation IV" },
  { id: 5, name: "Generation V" },
  { id: 6, name: "Generation VI" },
  { id: 7, name: "Generation VII" },
  { id: 8, name: "Generation VIII" },
  { id: 9, name: "Generation IX" },
];

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};
