<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { Heart, Moon, Sparkles, Sun } from 'lucide-svelte';

	const links = [
		{ href: `${base}/`, label: 'Pokédex' },
		{ href: `${base}/berries`, label: 'Berries' },
		{ href: `${base}/favorites`, label: 'Favorites' }
	];

	function isActive(href: string) {
		const current = page.url.pathname;
		if (href === `${base}/`) {
			return current === `${base}/` || current === base || current === `${base}`;
		}
		return current.startsWith(href);
	}
</script>

<header
	class="sticky top-0 z-40 border-slate-200 border-b bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
		<a href={`${base}/`} class="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
			<Sparkles class="h-6 w-6 text-red-500" aria-hidden="true" />
			<span>Pokédex</span>
		</a>

		<nav aria-label="Primary" class="flex items-center gap-1 sm:gap-2">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-full px-3 py-1.5 font-medium text-sm transition-colors {isActive(link.href)
						? 'bg-red-600 text-white'
						: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}"
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					{#if link.label === 'Favorites'}
						<span class="inline-flex items-center gap-1">
							<Heart class="h-4 w-4" aria-hidden="true" />
							<span class="hidden sm:inline">{link.label}</span>
						</span>
					{:else}
						{link.label}
					{/if}
				</a>
			{/each}

			<button
				type="button"
				onclick={() => themeStore.toggle()}
				class="ml-2 rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
				aria-label={themeStore.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				{#if themeStore.current === 'dark'}
					<Sun class="h-5 w-5" aria-hidden="true" />
				{:else}
					<Moon class="h-5 w-5" aria-hidden="true" />
				{/if}
			</button>
		</nav>
	</div>
</header>
