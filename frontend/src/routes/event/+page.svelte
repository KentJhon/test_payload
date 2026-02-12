<svelte:head>
	<title>Event - Veent</title>
</svelte:head>

<script lang='ts'>
	// import type { PayloadPost } from "$lib/types/payload";

	let {data} = $props();
</script>

<ul>
	{#each data.event as d}
		<li>
			{d.title} {d.content} {d.Evet_date}
		</li>
	{/each}
</ul>
	