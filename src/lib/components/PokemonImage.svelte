<script lang="ts">
	let {
		src,
		alt,
		size = 96,
		eager = false
	}: { src: string | null | undefined; alt: string; size?: number; eager?: boolean } = $props();
</script>

{#if src}
	<img
		{src}
		{alt}
		width={size}
		height={size}
		loading={eager ? 'eager' : 'lazy'}
		fetchpriority={eager ? 'high' : 'low'}
		decoding="async"
		class="mx-auto object-contain drop-shadow-md"
		style="max-width: {size}px; aspect-ratio: 1 / 1"
	/>
{:else}
	<div
		class="mx-auto flex items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800"
		style="width: {size}px; height: {size}px"
		aria-label={alt}
	>
		?
	</div>
{/if}
