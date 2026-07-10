<script lang="ts">
	import { base } from '$app/paths';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { typeColor } from '$lib/constants/types';
	import type { Pokemon } from '$lib/api/schemas';

	let { pokemon }: { pokemon: Pokemon } = $props();

	const artwork = $derived(
		pokemon.sprites.other?.['official-artwork']?.front_default ??
			pokemon.sprites.front_default
	);
	const primaryType = $derived(pokemon.types[0]?.type.name ?? 'unknown');
</script>

<a
	href={`${base}/pokemon/${pokemon.name}`}
	class="group relative flex flex-col items-center rounded-2xl border border-slate-200/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
	style="background-image: linear-gradient(160deg, {typeColor(primaryType)}22, transparent 70%)"
>
	<div class="absolute top-2 right-2">
		<FavoriteButton name={pokemon.name} size={16} />
	</div>
	<span class="self-start font-mono text-slate-400 text-xs dark:text-slate-500"
		>#{pokemon.id.toString().padStart(3, '0')}</span
	>
	<div class="my-2 h-24 w-24 transition-transform duration-200 group-hover:scale-110">
		<PokemonImage src={artwork} alt={pokemon.name} size={96} />
	</div>
	<h2 class="font-semibold capitalize">{pokemon.name}</h2>
	<div class="mt-2 flex gap-1">
		{#each pokemon.types as t (t.type.name)}
			<TypeBadge type={t.type.name} />
		{/each}
	</div>
</a>
