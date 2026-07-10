<script lang="ts">
	import { base } from '$app/paths';
	import { idFromUrl } from '$lib/api/client';
	import type { EvolutionChainLink } from '$lib/api/schemas';
	import { ChevronRight } from 'lucide-svelte';

	let { chain }: { chain: EvolutionChainLink } = $props();

	function flatten(link: EvolutionChainLink, acc: EvolutionChainLink[] = []) {
		acc.push(link);
		for (const next of link.evolves_to) {
			flatten(next, acc);
		}
		return acc;
	}

	const stages = $derived(flatten(chain));

	function artworkUrl(name: string) {
		const id = idFromUrl(
			stages.find((s) => s.species.name === name)?.species.url ?? ''
		);
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
	}
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each stages as stage, i (stage.species.name)}
		{#if i > 0}
			<ChevronRight class="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
		{/if}
		<a
			href={`${base}/pokemon/${stage.species.name}`}
			class="flex flex-col items-center gap-1 rounded-xl border border-slate-200 p-3 transition-transform hover:scale-105 dark:border-slate-700"
		>
			<img
				src={artworkUrl(stage.species.name)}
				alt={stage.species.name}
				width="64"
				height="64"
				loading="lazy"
				class="h-16 w-16 object-contain"
			/>
			<span class="font-medium text-sm capitalize">{stage.species.name}</span>
		</a>
	{/each}
</div>
