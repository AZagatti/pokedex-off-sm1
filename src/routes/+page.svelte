<script lang="ts">
	import { getGeneration, getPokemon, getType, typeNames } from '$lib/api/client';
	import FilterToolbar from '$lib/components/FilterToolbar.svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { statTotal } from '$lib/pokedex/stats';
	import type { NamedApiResource, Pokemon } from '$lib/api/schemas';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const PAGE_SIZE = 30;
	const allTypes = typeNames().filter((t) => t !== 'unknown' && t !== 'stellar');

	let search = $state('');
	let debouncedSearch = $state('');
	let generation = $state<number | null>(null);
	let selectedTypes = $state<string[]>([]);
	let sort = $state<'dex' | 'stats'>('dex');

	let generationNames = $state<Set<string> | null>(null);
	let typeNameSets = $state<Map<string, Set<string>>>(new Map());

	let loadedCount = $state(PAGE_SIZE);
	let details = $state<Map<string, Pokemon>>(new Map());
	let loadingNames = new Set<string>();
	let sentinel: HTMLDivElement | undefined;

	$effect(() => {
		const value = search;
		const handle = setTimeout(() => {
			debouncedSearch = value;
		}, 250);
		return () => clearTimeout(handle);
	});

	$effect(() => {
		if (generation === null) {
			generationNames = null;
			return;
		}
		let cancelled = false;
		getGeneration(generation).then((detail) => {
			if (!cancelled) {
				generationNames = new Set(detail.pokemon_species.map((s) => s.name));
			}
		});
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		const missing = selectedTypes.filter((t) => !typeNameSets.has(t));
		if (missing.length === 0) {
			return;
		}
		let cancelled = false;
		Promise.all(missing.map((t) => getType(t))).then((results) => {
			if (cancelled) {
				return;
			}
			const next = new Map(typeNameSets);
			for (const detail of results) {
				next.set(
					detail.name,
					new Set(detail.pokemon.map((p) => p.pokemon.name))
				);
			}
			typeNameSets = next;
		});
		return () => {
			cancelled = true;
		};
	});

	const filteredNames = $derived.by((): NamedApiResource[] => {
		let list: NamedApiResource[] = data.allPokemon;

		if (debouncedSearch.trim()) {
			const q = debouncedSearch.trim().toLowerCase();
			list = list.filter((p) => p.name.includes(q));
		}

		if (generationNames) {
			list = list.filter((p) => generationNames?.has(p.name));
		}

		if (selectedTypes.length > 0) {
			const sets = selectedTypes.map((t) => typeNameSets.get(t));
			if (sets.every((s) => s !== undefined)) {
				list = list.filter((p) => sets.every((s) => s?.has(p.name)));
			} else {
				list = [];
			}
		}

		return list;
	});

	$effect(() => {
		// reset pagination whenever the filtered set changes
		const resetTrigger = filteredNames;
		void resetTrigger;
		loadedCount = PAGE_SIZE;
	});

	const visibleNames = $derived(filteredNames.slice(0, loadedCount));

	async function loadDetail(name: string) {
		const pokemon = await getPokemon(name);
		const next = new Map(details);
		next.set(pokemon.name, pokemon);
		details = next;
	}

	$effect(() => {
		for (const entry of visibleNames) {
			if (details.has(entry.name) || loadingNames.has(entry.name)) {
				continue;
			}
			loadingNames.add(entry.name);
			loadDetail(entry.name);
		}
	});

	const loadedPokemon = $derived.by((): Pokemon[] => {
		const list = visibleNames
			.map((n) => details.get(n.name))
			.filter((p): p is Pokemon => Boolean(p));

		const sorted = [...list];
		if (sort === 'dex') {
			sorted.sort((a, b) => a.id - b.id);
		} else {
			sorted.sort((a, b) => statTotal(b) - statTotal(a));
		}
		return sorted;
	});

	const pendingCount = $derived(visibleNames.length - loadedPokemon.length);

	$effect(() => {
		if (!sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting) && loadedCount < filteredNames.length) {
					loadedCount = Math.min(loadedCount + PAGE_SIZE, filteredNames.length);
				}
			},
			{ rootMargin: '400px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Pokédex</title>
	<meta
		name="description"
		content="Browse, search and filter every Pokémon with an animated, modern Pokédex built on SvelteKit."
	/>
</svelte:head>

<h1 class="sr-only">Pokédex — browse all Pokémon</h1>

<FilterToolbar bind:search bind:generation bind:selectedTypes bind:sort {allTypes} />

{#if filteredNames.length === 0}
	<div class="flex flex-col items-center gap-2 py-24 text-center text-slate-500 dark:text-slate-400">
		<p class="font-semibold text-lg">No Pokémon match your filters.</p>
		<p class="text-sm">Try a different search term or clear a filter.</p>
	</div>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
		{#each loadedPokemon as pokemon (pokemon.name)}
			<PokemonCard {pokemon} />
		{/each}
		{#each Array.from({ length: pendingCount }) as _, i (i)}
			<SkeletonCard />
		{/each}
	</div>
{/if}

<div bind:this={sentinel} class="h-4"></div>
