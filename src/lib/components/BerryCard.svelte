<script lang="ts">
	import { base } from '$app/paths';
	import type { Berry } from '$lib/api/schemas';

	let { berry }: { berry: Berry } = $props();

	const sprite = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.item.name}.png`
	);
</script>

<a
	href={`${base}/berries/${berry.name}`}
	class="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-gradient-to-b from-lime-50 to-transparent p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:from-transparent"
>
	<span class="self-start font-mono text-slate-400 text-xs dark:text-slate-500"
		>#{berry.id.toString().padStart(3, '0')}</span
	>
	<img
		src={sprite}
		alt={berry.name}
		width="64"
		height="64"
		loading="lazy"
		class="my-2 h-16 w-16 object-contain transition-transform duration-200 group-hover:scale-110"
	/>
	<h2 class="font-semibold capitalize">{berry.name.replace('-', ' ')}</h2>
	<span class="mt-1 rounded-full bg-lime-100 px-2 py-0.5 text-lime-700 text-xs capitalize dark:bg-lime-900/40 dark:text-lime-300"
		>{berry.firmness.name.replace('-', ' ')}</span
	>
</a>
