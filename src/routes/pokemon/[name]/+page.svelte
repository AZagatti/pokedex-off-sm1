<script lang="ts">
	import { fly } from 'svelte/transition';
	import { base } from '$app/paths';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import StatBar from '$lib/components/StatBar.svelte';
	import EvolutionChain from '$lib/components/EvolutionChain.svelte';
	import { typeColor } from '$lib/constants/types';
	import { ArrowLeft, Play } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const pokemon = $derived(data.pokemon);
	const evolutionChain = $derived(data.evolutionChain);
	const primaryType = $derived(pokemon.types[0]?.type.name ?? 'unknown');
	const artwork = $derived(
		pokemon.sprites.other?.['official-artwork']?.front_default ??
			pokemon.sprites.front_default
	);

	type SpriteKey = 'front_default' | 'back_default' | 'front_shiny' | 'back_shiny';
	const spriteVariants: { key: SpriteKey; label: string }[] = [
		{ key: 'front_default', label: 'Front' },
		{ key: 'back_default', label: 'Back' },
		{ key: 'front_shiny', label: 'Front shiny' },
		{ key: 'back_shiny', label: 'Back shiny' }
	];
	let activeSprite = $state<SpriteKey>('front_default');
	const activeSpriteUrl = $derived(pokemon.sprites[activeSprite] ?? pokemon.sprites.front_default);

	let audio = $state<HTMLAudioElement | undefined>();
	function playCry() {
		audio?.play();
	}

	const abilities = $derived(pokemon.abilities);
	const exampleMoves = $derived(pokemon.moves.slice(0, 8));
</script>

<svelte:head>
	<title>{pokemon.name} · Pokédex</title>
	<meta name="description" content={`Stats, abilities and evolution chain for ${pokemon.name}.`} />
</svelte:head>

<a
	href={`${base}/`}
	class="mb-4 inline-flex items-center gap-1 font-medium text-slate-500 text-sm hover:text-red-500 dark:text-slate-400"
>
	<ArrowLeft class="h-4 w-4" aria-hidden="true" />
	Back to Pokédex
</a>

{#key pokemon.name}
	<div
		class="relative overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-slate-800"
		style="background-image: linear-gradient(160deg, {typeColor(primaryType)}33, transparent 60%)"
		in:fly={{ y: 20, duration: 350 }}
	>
		<div class="absolute top-4 right-4">
			<FavoriteButton name={pokemon.name} size={24} />
		</div>

		<div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
			<div class="flex flex-col items-center">
				{#if artwork}
					<img
						src={artwork}
						alt={pokemon.name}
						width="240"
						height="240"
						class="h-56 w-56 object-contain drop-shadow-xl"
						in:fly={{ y: -30, duration: 500 }}
					/>
				{/if}
				<button
					type="button"
					onclick={playCry}
					class="mt-2 flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1.5 text-sm text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10"
					disabled={!pokemon.cries?.latest}
				>
					<Play class="h-4 w-4" aria-hidden="true" />
					Play cry
				</button>
				{#if pokemon.cries?.latest}
					<audio bind:this={audio} src={pokemon.cries.latest} preload="none"></audio>
				{/if}
			</div>

			<div class="flex-1">
				<p class="font-mono text-slate-400 text-sm">#{pokemon.id.toString().padStart(3, '0')}</p>
				<h1 class="font-black text-4xl capitalize">{pokemon.name}</h1>
				<div class="mt-2 flex gap-2">
					{#each pokemon.types as t (t.type.name)}
						<TypeBadge type={t.type.name} />
					{/each}
				</div>

				<dl class="mt-4 flex gap-6">
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Height</dt>
						<dd class="font-semibold">{(pokemon.height / 10).toFixed(1)} m</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Weight</dt>
						<dd class="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</dd>
					</div>
				</dl>

				<h2 class="mt-6 font-semibold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
					Sprites
				</h2>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each spriteVariants as variant (variant.key)}
						{#if pokemon.sprites[variant.key]}
							<button
								type="button"
								onclick={() => (activeSprite = variant.key)}
								aria-pressed={activeSprite === variant.key}
								class="rounded-full border px-3 py-1 text-xs transition-colors {activeSprite ===
								variant.key
									? 'border-red-600 bg-red-600 text-white'
									: 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}"
							>
								{variant.label}
							</button>
						{/if}
					{/each}
				</div>
				{#if activeSpriteUrl}
					<img
						src={activeSpriteUrl}
						alt={`${pokemon.name} ${activeSprite.replace('_', ' ')}`}
						width="96"
						height="96"
						class="mt-2 h-24 w-24 [image-rendering:pixelated]"
					/>
				{/if}
			</div>
		</div>

		<section class="mt-8">
			<h2 class="mb-3 font-semibold text-lg">Base stats</h2>
			<div class="flex flex-col gap-2">
				{#each pokemon.stats as stat (stat.stat.name)}
					<StatBar
						name={stat.stat.name}
						value={stat.base_stat}
						color={typeColor(primaryType)}
					/>
				{/each}
			</div>
		</section>

		<section class="mt-8">
			<h2 class="mb-3 font-semibold text-lg">Abilities</h2>
			<ul class="flex flex-wrap gap-2">
				{#each abilities as a (a.ability.name)}
					<li
						class="rounded-full border border-slate-200 px-3 py-1 text-sm capitalize dark:border-slate-700"
					>
						{a.ability.name.replace('-', ' ')}
						{#if a.is_hidden}
							<span
								class="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 font-semibold text-[10px] uppercase text-slate-600 dark:bg-slate-700 dark:text-slate-300"
								>Hidden</span
							>
						{/if}
					</li>
				{/each}
			</ul>
		</section>

		<section class="mt-8">
			<h2 class="mb-3 font-semibold text-lg">Example moves</h2>
			<ul class="flex flex-wrap gap-2">
				{#each exampleMoves as m (m.move.name)}
					<li
						class="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize dark:bg-slate-800"
					>
						{m.move.name.replace('-', ' ')}
					</li>
				{/each}
			</ul>
		</section>

		{#if evolutionChain}
			<section class="mt-8">
				<h2 class="mb-3 font-semibold text-lg">Evolution chain</h2>
				<EvolutionChain chain={evolutionChain.chain} />
			</section>
		{/if}
	</div>
{/key}
