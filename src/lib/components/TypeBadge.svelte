<script lang="ts">
	import { typeBadgeColor } from '$lib/constants/types';

	let { type }: { type: string } = $props();
</script>

<span
	class="rounded-full px-2.5 py-0.5 font-semibold text-white text-xs capitalize shadow-sm"
	style="background-color: {typeBadgeColor(type)}"
>
	{type}
</span>
