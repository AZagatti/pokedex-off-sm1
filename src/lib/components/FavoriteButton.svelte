<script lang="ts">
	import { favoritesStore } from '$lib/stores/favorites.svelte';
	import { Heart } from 'lucide-svelte';

	let { name, size = 20 }: { name: string; size?: number } = $props();

	const active = $derived(favoritesStore.has(name));
</script>

<button
	type="button"
	onclick={(event) => {
		event.preventDefault();
		event.stopPropagation();
		favoritesStore.toggle(name);
	}}
	class="rounded-full bg-white/80 p-2 text-red-500 shadow-sm backdrop-blur transition-transform hover:scale-110 dark:bg-slate-900/80"
	aria-pressed={active}
	aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
>
	<Heart width={size} height={size} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
</button>
