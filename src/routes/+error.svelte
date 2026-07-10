<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Error'} · Pokédex</title>
</svelte:head>

<div class="flex flex-col items-center justify-center gap-4 py-24 text-center">
	<p class="font-black text-7xl text-red-500">{page.status}</p>
	<h1 class="font-bold text-2xl">
		{page.status === 404 ? "This Pokémon fled before capture." : 'Something went wrong.'}
	</h1>
	<p class="max-w-md text-slate-500 dark:text-slate-400">
		{page.error?.message ?? 'The page you were looking for could not be found.'}
	</p>
	<a
		href={`${base}/`}
		class="mt-2 rounded-full bg-red-600 px-5 py-2 font-medium text-white transition-transform hover:scale-105"
	>
		Back to the Pokédex
	</a>
</div>
