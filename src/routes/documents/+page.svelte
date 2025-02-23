<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Mock Data (Replace with API Calls Later)
	let documents = writable([
		{
			id: 1,
			fileName: 'Lease_Agreement.pdf',
			caseNumber: 'ABC123-001',
			address: '123 Main St',
			state: 'AZ'
		},
		{
			id: 2,
			fileName: 'Eviction_Notice.pdf',
			caseNumber: 'XYZ789-002',
			address: '456 Elm St',
			state: 'CO'
		},
		{
			id: 3,
			fileName: 'Court_Order.pdf',
			caseNumber: 'SMITH556-003',
			address: '789 Oak St',
			state: 'CA'
		}
	]);

	let searchQuery = '';
	let selectedDocument = null;

	// Upload Function (Placeholder)
	function uploadFile(event) {
		let file = event.target.files[0];
		if (!file) return;
		alert(`Uploading: ${file.name} (This will be hooked up to the backend using S3)`);
	}

	// Open PDF Preview
	function openPreview(doc) {
		selectedDocument = doc;
	}

	// Delete Document
	function deleteDocument(docId) {
		if (confirm('Are you sure you want to delete this document?')) {
			documents.update((docs) => docs.filter((doc) => doc.id !== docId));
		}
	}

	// **Updated Search Functionality**
	function matchesSearch(doc) {
		const query = searchQuery.toLowerCase();
		return (
			doc.fileName.toLowerCase().includes(query) ||
			doc.caseNumber.toLowerCase().includes(query) ||
			doc.address.toLowerCase().includes(query) ||
			doc.state.toLowerCase().includes(query)
		);
	}
</script>

<section class="p-4 sm:p-6">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Documents</h1>
		<label
			class="cursor-pointer rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90"
		>
			Upload Document
			<input type="file" class="hidden" on:change={uploadFile} />
		</label>
	</div>

	<!-- Search Bar -->
	<input
		type="text"
		placeholder="Search documents..."
		class="mb-4 w-full rounded-lg border px-4 py-2"
		bind:value={searchQuery}
	/>

	<!-- Documents Table -->
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-2 text-left">File Name</th>
					<th class="p-2 text-left">Case #</th>
					<th class="p-2 text-left">Address</th>
					<th class="p-2 text-left">State</th>
					<th class="p-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $documents as doc (doc.id)}
					{#if matchesSearch(doc)}
						<tr class="border-t">
							<td class="p-2">{doc.fileName}</td>
							<td class="p-2">{doc.caseNumber}</td>
							<td class="p-2">{doc.address}</td>
							<td class="p-2">{doc.state}</td>
							<td class="flex space-x-2 p-2">
								<button
									on:click={() => openPreview(doc)}
									class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
								>
									View
								</button>
								<button
									on:click={() => deleteDocument(doc.id)}
									class="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
								>
									Delete
								</button>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<!-- PDF Preview Modal -->
	{#if selectedDocument}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">{selectedDocument.fileName}</h2>
				<p>📄 Previewing {selectedDocument.fileName} (This would show a PDF preview)</p>
				<div class="mt-4 flex justify-end">
					<button
						on:click={() => (selectedDocument = null)}
						class="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	{/if}
</section>
