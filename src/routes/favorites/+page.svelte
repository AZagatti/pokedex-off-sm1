<script lang="ts">
	import { base } from '$app/paths';
	import { getPokemon } from '$lib/api/client';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { favoritesStore } from '$lib/stores/favorites.svelte';
	import type { Pokemon } from '$lib/api/schemas';
	import { Heart } from 'lucide-svelte';

	let details = $state<Map<string, Pokemon>>(new Map());

	$effect(() => {
		const names = favoritesStore.list;
		const missing = names.filter((n) => !details.has(n));
		if (missing.length === 0) {
			return;
		}
		Promise.all(missing.map((n) => getPokemon(n))).then((results) => {
			const next = new Map(details);
			for (const p of results) {
				next.set(p.name, p);
			}
			details = next;
		});
	});

	const favoritePokemon = $derived(
		favoritesStore.list
			.map((n) => details.get(n))
			.filter((p): p is Pokemon => Boolean(p))
	);
	const pendingCount = $derived(favoritesStore.list.length - favoritePokemon.length);
</script>

<svelte:head>
	<title>Favorites · Pokédex</title>
	<meta name="description" content="Your favorited Pokémon, saved locally." />
</svelte:head>

<h1 class="mb-6 font-black text-3xl">Favorites</h1>

{#if favoritesStore.list.length === 0}
	<div class="flex flex-col items-center gap-3 py-24 text-center text-slate-500 dark:text-slate-400">
		<Heart class="h-10 w-10" aria-hidden="true" />
		<p class="font-semibold text-lg">No favorites yet.</p>
		<p class="text-sm">Tap the heart on any Pokémon to save it here.</p>
		<a
			href={`${base}/`}
			class="mt-2 rounded-full bg-red-600 px-5 py-2 font-medium text-white transition-transform hover:scale-105"
		>
			Browse the Pokédex
		</a>
	</div>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
		{#each favoritePokemon as pokemon (pokemon.name)}
			<PokemonCard {pokemon} />
		{/each}
		{#each Array.from({ length: pendingCount }) as _, i (i)}
			<SkeletonCard />
		{/each}
	</div>
{/if}
