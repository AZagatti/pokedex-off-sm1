<script lang="ts">
	import { fly } from 'svelte/transition';
	import { base } from '$app/paths';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const berry = $derived(data.berry);
	const sprite = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.item.name}.png`
	);

	const FLAVOR_COLORS: Record<string, string> = {
		spicy: '#EE8130',
		dry: '#F7D02C',
		sweet: '#F95587',
		bitter: '#7AC74C',
		sour: '#6390F0'
	};
</script>

<svelte:head>
	<title>{berry.name} · Berries · Pokédex</title>
	<meta name="description" content={`Growth time, firmness, size and flavors for the ${berry.name} berry.`} />
</svelte:head>

<a
	href={`${base}/berries`}
	class="mb-4 inline-flex items-center gap-1 font-medium text-slate-500 text-sm hover:text-red-500 dark:text-slate-400"
>
	<ArrowLeft class="h-4 w-4" aria-hidden="true" />
	Back to Berries
</a>

{#key berry.name}
	<div
		class="rounded-3xl border border-slate-200 bg-gradient-to-b from-lime-50 to-transparent p-6 shadow-sm dark:border-slate-800 dark:from-transparent"
		in:fly={{ y: 20, duration: 350 }}
	>
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
			<img
				src={sprite}
				alt={berry.name}
				width="128"
				height="128"
				class="h-32 w-32 object-contain drop-shadow-xl"
			/>
			<div>
				<p class="font-mono text-slate-400 text-sm">#{berry.id.toString().padStart(3, '0')}</p>
				<h1 class="font-black text-3xl capitalize">{berry.name.replace('-', ' ')}</h1>
				<span
					class="mt-2 inline-block rounded-full bg-lime-100 px-3 py-1 text-lime-700 text-sm capitalize dark:bg-lime-900/40 dark:text-lime-300"
					>{berry.firmness.name.replace('-', ' ')} firmness</span
				>

				<dl class="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Growth time</dt>
						<dd class="font-semibold">{berry.growth_time} hours/stage</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Size</dt>
						<dd class="font-semibold">{berry.size} mm</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Max harvest</dt>
						<dd class="font-semibold">{berry.max_harvest}</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Smoothness</dt>
						<dd class="font-semibold">{berry.smoothness}</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Soil dryness</dt>
						<dd class="font-semibold">{berry.soil_dryness}</dd>
					</div>
					<div>
						<dt class="text-slate-500 text-xs dark:text-slate-400">Natural gift power</dt>
						<dd class="font-semibold">{berry.natural_gift_power}</dd>
					</div>
				</dl>
			</div>
		</div>

		<section class="mt-8">
			<h2 class="mb-3 font-semibold text-lg">Flavors</h2>
			<ul class="flex flex-wrap gap-2">
				{#each berry.flavors.filter((f) => f.potency > 0) as f (f.flavor.name)}
					<li
						class="rounded-full px-3 py-1 font-medium text-sm text-white capitalize"
						style="background-color: {FLAVOR_COLORS[f.flavor.name] ?? '#94A3B8'}"
					>
						{f.flavor.name} · {f.potency}
					</li>
				{/each}
				{#if berry.flavors.every((f) => f.potency === 0)}
					<li class="text-slate-500 text-sm dark:text-slate-400">No dominant flavor.</li>
				{/if}
			</ul>
		</section>
	</div>
{/key}
