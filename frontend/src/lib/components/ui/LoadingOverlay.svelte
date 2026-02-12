<script lang="ts">
	interface Props {
		visible: boolean;
		message?: string;
		progress?: number;
	}

	const { visible, message = 'Processing...', progress = -1 }: Props = $props();
</script>

{#if visible}
	<div class="fixed inset-0 z-[9997] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="w-80 rounded-xl bg-white p-8 text-center shadow-2xl">
			<div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
			<p class="mb-3 font-medium text-gray-700">{message}</p>
			{#if progress >= 0}
				<div class="h-2 overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-full rounded-full bg-indigo-600 transition-all duration-300"
						style="width: {Math.min(progress, 100)}%"
					></div>
				</div>
				<p class="mt-2 text-sm text-gray-500">{Math.round(progress)}%</p>
			{/if}
		</div>
	</div>
{/if}
