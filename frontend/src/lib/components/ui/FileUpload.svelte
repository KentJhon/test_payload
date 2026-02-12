<script lang="ts">
	interface Props {
		accept: string;
		label: string;
		onfile: (file: File) => void;
		compact?: boolean;
	}

	const { accept, label, onfile, compact = false }: Props = $props();

	let inputEl: HTMLInputElement;

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			onfile(file);
			target.value = '';
		}
	}
</script>

<input bind:this={inputEl} type="file" {accept} onchange={handleChange} class="hidden" />

{#if compact}
	<button
		onclick={() => inputEl.click()}
		class="cursor-pointer rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
	>
		{label}
	</button>
{:else}
	<button
		onclick={() => inputEl.click()}
		class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600"
	>
		<span class="text-lg">+</span>
		{label}
	</button>
{/if}
