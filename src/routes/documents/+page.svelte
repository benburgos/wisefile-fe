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

	<table class="w-full border-collapse">
		<thead class="bg-gray-200">
			<tr>
				<th class="p-3 text-left">Filename</th>
				<th class="p-3 text-left">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each $documents as doc}
				<tr class="border-t">
					<td class="p-3">{doc.name}</td>
					<td class="p-3">
						<a href={doc.fileUrl} target="_blank" class="text-blue-500 underline">View</a>
						<button on:click={() => deleteDocument(doc.id)} class="ml-4 text-red-500 underline"
							>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
