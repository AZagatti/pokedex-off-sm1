<script lang="ts">
	import { getBerry } from '$lib/api/client';
	import BerryCard from '$lib/components/BerryCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import type { Berry } from '$lib/api/schemas';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let berries = $state<Berry[]>([]);

	$effect(() => {
		let cancelled = false;
		Promise.all(data.berries.map((b) => getBerry(b.name))).then((results) => {
			if (!cancelled) {
				berries = results.toSorted((a, b) => a.id - b.id);
			}
		});
		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Berries · Pokédex</title>
	<meta name="description" content="Browse every berry from the Pokémon world." />
</svelte:head>

<h1 class="mb-6 font-black text-3xl">Berries</h1>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
	{#if berries.length > 0}
		{#each berries as berry (berry.name)}
			<BerryCard {berry} />
		{/each}
	{:else}
		{#each data.berries as _, i (i)}
			<SkeletonCard />
		{/each}
	{/if}
</div>
