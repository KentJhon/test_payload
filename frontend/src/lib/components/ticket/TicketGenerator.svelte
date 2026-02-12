<script lang="ts">
	import DesignTab from './DesignTab.svelte';
	import PreviewTab from './PreviewTab.svelte';
	import PngExportTab from './PngExportTab.svelte';

	let activeTab = $state<'design' | 'preview' | 'export'>('design');

	const tabs = [
		{ id: 'design' as const, label: 'Design', icon: '🎨' },
		{ id: 'preview' as const, label: 'Printable Preview', icon: '🖨️' },
		{ id: 'export' as const, label: 'Export as PNGs', icon: '📦' }
	];
</script>

<div class="flex h-[calc(100vh-4rem)] flex-col bg-gray-100">
	<!-- Tab Bar -->
	<div class="flex border-b border-gray-200 bg-white px-4">
		{#each tabs as tab}
			<button
				onclick={() => (activeTab = tab.id)}
				class="flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors {activeTab === tab.id
					? 'border-indigo-600 text-indigo-600'
					: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
			>
				<span>{tab.icon}</span>
				<span class="hidden sm:inline">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="min-h-0 flex-1">
		{#if activeTab === 'design'}
			<DesignTab />
		{:else if activeTab === 'preview'}
			<PreviewTab />
		{:else}
			<PngExportTab />
		{/if}
	</div>
</div>
