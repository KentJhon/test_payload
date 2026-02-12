<script lang="ts">
	import FileUploadSection from './FileUploadSection.svelte';
	import TemplateSection from './TemplateSection.svelte';
	import ProjectActions from './ProjectActions.svelte';
	import TicketSizeSection from './TicketSizeSection.svelte';
	import CsvHeadersList from './CsvHeadersList.svelte';
	import ElementsList from './ElementsList.svelte';
	import LabelColorSection from './LabelColorSection.svelte';
	import QrBarcodeSection from './QrBarcodeSection.svelte';
	import PropertiesPanel from '../properties/PropertiesPanel.svelte';
</script>

<div class="space-y-1 p-3">
	<FileUploadSection />
	<TemplateSection />
	<ProjectActions />
	<TicketSizeSection />
	<CsvHeadersList />
	<ElementsList />
	<LabelColorSection />
	<QrBarcodeSection />
	<PropertiesPanel />
</div>
