<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
	<Header />
	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
		{@render children()}
	</main>
	<footer class="border-slate-200 border-t px-4 py-6 text-center text-slate-500 text-sm dark:border-slate-800 dark:text-slate-400">
		Data from <a href="https://pokeapi.co" class="underline hover:text-red-500" target="_blank" rel="noreferrer">PokéAPI</a>. Built with SvelteKit.
	</footer>
</div>
