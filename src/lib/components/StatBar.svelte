<script lang="ts">
	import { STAT_LABELS } from '$lib/constants/types';

	let { name, value, color }: { name: string; value: number; color: string } = $props();

	const MAX_STAT = 255;
	const pct = $derived(Math.min(100, Math.round((value / MAX_STAT) * 100)));
	let mounted = $state(false);

	$effect(() => {
		const frame = requestAnimationFrame(() => {
			mounted = true;
		});
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="flex items-center gap-3">
	<span class="w-20 shrink-0 font-medium text-slate-500 text-xs dark:text-slate-400"
		>{STAT_LABELS[name] ?? name}</span
	>
	<div
		class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
		role="progressbar"
		aria-label={`${STAT_LABELS[name] ?? name}: ${value}`}
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={MAX_STAT}
	>
		<div
			class="h-full rounded-full transition-[width] duration-700 ease-out"
			style="width: {mounted ? pct : 0}%; background-color: {color}"
		></div>
	</div>
	<span class="w-8 shrink-0 text-right font-mono text-xs">{value}</span>
</div>
