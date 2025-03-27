<script>
	import { onMount } from 'svelte';
	import { getAllRecords, saveToLocalStorage } from '$lib/localStorage';
	import { auth } from '$lib/stores/auth';

	let documents = [];
	let filteredDocuments = [];
	let search = '';
	let user;
	let caseRecords = [];

	onMount(() => {
		auth.subscribe((value) => {
			user = value?.user;
			if (user) {
				loadDocuments();
			}
		});
	});

	function loadDocuments() {
		caseRecords = getAllRecords('caseRecords', user);
		documents = getAllRecords('documents', user);
		filteredDocuments = documents;
	}

	function getCaseNumber(case_id) {
		const match = caseRecords.find((c) => c._id === case_id);
		return match?.case_number || case_id;
	}

	function applySearch() {
		const term = search.toLowerCase();
		filteredDocuments = documents.filter((doc) => {
			return (
				doc.name.toLowerCase().includes(term) ||
				doc.type.toLowerCase().includes(term) ||
				doc.description.toLowerCase().includes(term) ||
				getCaseNumber(doc.case_id).toLowerCase().includes(term)
			);
		});
	}

	function handleUpload(e) {
		const file = e.target.files[0];
		if (!file) return;
		const newDoc = {
			_id: crypto.randomUUID(),
			client_id: '',
			case_id: 'TEMP-' + Math.floor(Math.random() * 1000),
			type: 'Uploaded File',
			name: file.name,
			description: '',
			file_path: `/documents/${file.name}`,
			file_url: URL.createObjectURL(file),
			file_size: file.size,
			file_type: file.type,
			uploaded_by: user?.id || '',
			uploaded_at: new Date(),
			updated_at: new Date(),
			tags: [],
			notes: '',
			is_confidential: false,
			is_deleted: false
		};
		documents = [newDoc, ...documents];
		applySearch();
		saveToLocalStorage('documents', documents);
	}

	function handleDelete(id) {
		documents = documents.filter((d) => d._id !== id);
		applySearch();
		saveToLocalStorage('documents', documents);
	}
</script>

<section class="p-4">
	<div class="flex items-center gap-2 mb-4">
		<input
			type="text"
			placeholder="Search documents..."
			class="input input-bordered rounded-md w-[90%] bg-gray-50"
			bind:value={search}
			on:input={applySearch}
		/>
		<label class="btn bg-gray-800 text-white hover:bg-gray-700 w-[10%] rounded-md text-center cursor-pointer">
			Upload
			<input type="file" class="hidden" on:change={handleUpload} />
		</label>
	</div>

	<div class="overflow-x-auto rounded border border-gray-200">
		<table class="table w-full text-sm">
			<thead class="bg-gray-700 text-white text-xs">
				<tr>
					<th class="px-2 py-1 min-w-[110px] whitespace-nowrap">Case #</th>
					<th class="px-2 py-1 min-w-[100px] whitespace-nowrap">Type</th>
					<th class="px-2 py-1 max-w-[160px] truncate">Document Name</th>
					<th class="px-2 py-1 max-w-[200px] truncate">Description</th>
					<th class="px-2 py-1 whitespace-nowrap">Uploaded</th>
					<th class="px-2 py-1 text-center whitespace-nowrap">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredDocuments as doc, i}
					<tr class="text-sm align-middle {i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}">
						<td class="px-2 py-1 align-middle whitespace-nowrap">{getCaseNumber(doc.case_id)}</td>
						<td class="px-2 py-1 align-middle whitespace-nowrap">{doc.type}</td>
						<td class="px-2 py-1 align-middle truncate max-w-[160px]" title={doc.name}>{doc.name}</td>
						<td class="px-2 py-1 align-middle truncate max-w-[200px]" title={doc.description}>{doc.description}</td>
						<td class="px-2 py-1 align-middle text-center whitespace-nowrap">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
						<td class="px-2 py-1 align-middle text-center whitespace-nowrap">
							<button
								on:click={() => window.open(doc.file_url, '_blank')}
								class="text-blue-600 hover:underline focus:outline-none"
								aria-label="View Document"
							>
								View
							</button>
							<span class="mx-1 text-gray-400">|</span>
							<button
								on:click={() => handleDelete(doc._id)}
								class="text-red-600 hover:underline focus:outline-none"
								aria-label="Delete Document"
							>
								Delete
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="text-center text-gray-500 px-3 py-4">No documents found.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
