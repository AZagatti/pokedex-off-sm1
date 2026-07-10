<script lang="ts">
	import { GENERATIONS, typeBadgeColor, typeColor } from '$lib/constants/types';
	import { Search, X } from 'lucide-svelte';

	let {
		search = $bindable(''),
		generation = $bindable<number | null>(null),
		selectedTypes = $bindable<string[]>([]),
		sort = $bindable<'dex' | 'stats'>('dex'),
		allTypes
	}: {
		search: string;
		generation: number | null;
		selectedTypes: string[];
		sort: 'dex' | 'stats';
		allTypes: string[];
	} = $props();

	const hasFilters = $derived(
		search !== '' || generation !== null || selectedTypes.length > 0 || sort !== 'dex'
	);

	function toggleType(name: string) {
		selectedTypes = selectedTypes.includes(name)
			? selectedTypes.filter((t) => t !== name)
			: [...selectedTypes, name];
	}

	function clearFilters() {
		search = '';
		generation = null;
		selectedTypes = [];
		sort = 'dex';
	}
</script>

<div
	class="sticky top-[57px] z-30 mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
>
	<div class="flex flex-wrap items-center gap-3">
		<label class="relative flex-1 min-w-[200px]">
			<Search
				class="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400"
				aria-hidden="true"
			/>
			<span class="sr-only">Search Pokémon by name</span>
			<input
				type="search"
				placeholder="Search Pokémon..."
				bind:value={search}
				class="w-full rounded-full border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-red-400 dark:border-slate-700 dark:bg-slate-800"
			/>
		</label>

		<label class="flex items-center gap-2 text-sm">
			<span class="sr-only">Generation</span>
			<select
				bind:value={generation}
				class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 dark:border-slate-700 dark:bg-slate-800"
			>
				<option value={null}>All generations</option>
				{#each GENERATIONS as gen (gen.id)}
					<option value={gen.id}>{gen.name}</option>
				{/each}
			</select>
		</label>

		<label class="flex items-center gap-2 text-sm">
			<span class="sr-only">Sort by</span>
			<select
				bind:value={sort}
				class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400 dark:border-slate-700 dark:bg-slate-800"
			>
				<option value="dex">Sort: Dex number</option>
				<option value="stats">Sort: Base stat total</option>
			</select>
		</label>

		{#if hasFilters}
			<button
				type="button"
				onclick={clearFilters}
				class="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 text-slate-600 text-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
			>
				<X class="h-4 w-4" aria-hidden="true" />
				Clear filters
			</button>
		{/if}
	</div>

	<div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
		{#each allTypes as type (type)}
			{@const active = selectedTypes.includes(type)}
			<button
				type="button"
				onclick={() => toggleType(type)}
				aria-pressed={active}
				class="rounded-full px-2.5 py-1 font-medium text-xs capitalize transition-all"
				style={active
					? `background-color: ${typeBadgeColor(type)}; color: white; box-shadow: 0 0 0 2px ${typeColor(type)}55`
					: `background-color: ${typeColor(type)}22; color: ${typeBadgeColor(type)}`}
			>
				{type}
			</button>
		{/each}
	</div>
</div>
