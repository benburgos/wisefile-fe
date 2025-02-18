<script>
	import { writable } from 'svelte/store';

	// Fake document data
	let documents = writable([
		{ id: 1, name: 'Eviction Notice.pdf', fileUrl: '/files/eviction_notice.pdf' },
		{ id: 2, name: 'Lease Agreement.pdf', fileUrl: '/files/lease_agreement.pdf' }
	]);

	function deleteDocument(id) {
		documents.update((docs) => docs.filter((doc) => doc.id !== id));
	}
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Documents</h1>

	<!-- Styled Table -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200 text-left">
				<tr>
					<th class="border-b p-3">Filename</th>
					<th class="border-b p-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $documents as doc}
					<tr class="border-t hover:bg-gray-100">
						<td class="p-3">{doc.name}</td>
						<td class="p-3">
							<a href={doc.fileUrl} target="_blank" class="text-blue-500 underline">View</a>
							<button on:click={() => deleteDocument(doc.id)} class="ml-4 text-red-500 underline">
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
