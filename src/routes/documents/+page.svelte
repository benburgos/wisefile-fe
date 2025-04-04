<script>
	import { onMount } from 'svelte';
	import { getAllRecords, saveToLocalStorage } from '$lib/localStorage';
	import { auth } from '$lib/stores/auth';

	let documents = [];
	let filteredDocuments = [];
	let search = '';
	let user;
	let caseRecords = [];
	let previewDoc = null;
	let showUploadModal = false;
	let selectedFile = null;
	let fileInputEl;
	let newDoc = {
		case_id: '',
		type: '',
		name: '',
		description: '',
		notes: '',
		is_confidential: false
	};

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
		documents = getAllRecords('documents', user).filter((d) => !d.is_deleted);
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

	function triggerUpload() {
		if (fileInputEl) fileInputEl.click();
	}

	function handleUpload(event) {
		selectedFile = event.target.files[0];
		if (!selectedFile) return;
		showUploadModal = true;
	}

	function handleUploadConfirm() {
		if (!selectedFile) return;
		const newEntry = {
			_id: crypto.randomUUID(),
			client_id: user?.client_id || '',
			case_id: newDoc.case_id,
			type: newDoc.type,
			name: newDoc.name || selectedFile.name,
			description: newDoc.description,
			file_path: `/documents/${selectedFile.name}`,
			file_url: URL.createObjectURL(selectedFile),
			file_size: selectedFile.size,
			file_type: selectedFile.type,
			uploaded_by: user?.id || '',
			uploaded_at: new Date(),
			updated_at: new Date(),
			tags: [],
			notes: newDoc.notes,
			is_confidential: newDoc.is_confidential,
			is_deleted: false
		};
		documents = [newEntry, ...documents];
		saveToLocalStorage('documents', documents);
		showUploadModal = false;
		applySearch();
		selectedFile = null;
		newDoc = {
			case_id: '',
			type: '',
			name: '',
			description: '',
			notes: '',
			is_confidential: false
		};
	}

	function handleDelete(id) {
		const docIndex = documents.findIndex((d) => d._id === id);
		if (docIndex !== -1) {
			documents[docIndex].is_deleted = true;
			saveToLocalStorage('documents', documents);
			loadDocuments();
		}
	}

	function handlePreview(doc) {
		previewDoc = doc;
	}

	function closePreview() {
		previewDoc = null;
	}

	function getEligibleCases() {
		if (!user || !user.role) return [];
		const filtered = caseRecords.filter((c) => {
			if (user.role === 'admin') return true;
			if (user.role === 'client') return c.client_id === user.client_id;
			if (user.role === 'attorney') return c.assigned_attorney === user.id;
			if (user.role === 'operator') return c.assigned_operator === user.id;
			return false;
		});
		return filtered.sort((a, b) => {
			const getParts = (str) => {
				const parts = str.split('-');
				return [parts[0], parts[2] ? parseInt(parts[2]) : 0];
			};
			const [aPrefix, aNum] = getParts(a.case_number);
			const [bPrefix, bNum] = getParts(b.case_number);
			if (aPrefix < bPrefix) return -1;
			if (aPrefix > bPrefix) return 1;
			return aNum - bNum;
		});
	}
</script>

<input type="file" class="hidden" bind:this={fileInputEl} on:change={handleUpload} />

<section class="space-y-6">
	<div class="flex items-center justify-between">
		<input
			type="text"
			placeholder="Search invoices..."
			bind:value={search}
			on:input={applySearch}
			class="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2"
		/>
		<button class="ml-2 rounded bg-gray-800 px-4 py-2 text-white" on:click={triggerUpload}>
			Upload
		</button>
	</div>

	<table class="table-standard w-full border text-sm shadow-sm">
		<thead>
			<tr>
				<th>Case #</th>
				<th>Type</th>
				<th>Document Name</th>
				<th>Description</th>
				<th><span class="flex justify-center">Uploaded</span></th>
				<th class="text-center"><span class="flex justify-center">Actions</span></th>
			</tr>
		</thead>
		<tbody>
			{#each filteredDocuments as doc, i}
				<tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
					<td title={getCaseNumber(doc.case_id)}>{getCaseNumber(doc.case_id)}</td>
					<td title={doc.type}>{doc.type}</td>
					<td title={doc.name} class="truncate-cell">{doc.name}</td>
					<td title={doc.description} class="truncate-cell">{doc.description}</td>
					<td class="text-center">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
					<td class="px-3 py-2">
						<div class="flex items-center justify-center gap-1 whitespace-nowrap">
							<button class="text-blue-600 hover:underline" on:click={() => handlePreview(doc)}
								>View</button
							>
							<span class="text-gray-400">|</span>
							<button class="text-red-600 hover:underline" on:click={() => handleDelete(doc._id)}
								>Delete</button
							>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6" class="text-center text-gray-500 px-3 py-4">No documents found.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

	{#if showUploadModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
			<div class="relative w-full max-w-lg rounded bg-white p-4 shadow-lg">
				<h2 class="mb-4 text-lg font-semibold">Upload Document</h2>
				<div class="mb-2">
					<label for="caseSelect" class="mb-1 block text-sm font-medium">Case</label>
					<select
						id="caseSelect"
						bind:value={newDoc.case_id}
						class="w-full rounded border px-2 py-1"
					>
						<option value="">Select a case</option>
						{#each getEligibleCases() as c}
							<option value={c._id}>{c.case_number}</option>
						{/each}
					</select>
				</div>

				<div class="mb-2">
					<label for="typeInput" class="mb-1 block text-sm font-medium">Type</label>
					<input id="typeInput" bind:value={newDoc.type} class="w-full rounded border px-2 py-1" />
				</div>

				<div class="mb-2">
					<label for="nameInput" class="mb-1 block text-sm font-medium">Name</label>
					<input id="nameInput" bind:value={newDoc.name} class="w-full rounded border px-2 py-1" />
				</div>

				<div class="mb-2">
					<label for="descInput" class="mb-1 block text-sm font-medium">Description</label>
					<textarea
						id="descInput"
						bind:value={newDoc.description}
						class="w-full rounded border px-2 py-1"
						rows="2"
					></textarea>
				</div>

				<div class="flex justify-end gap-2">
					<button
						class="rounded bg-gray-300 px-3 py-1 text-sm"
						on:click={() => (showUploadModal = false)}>Cancel</button
					>
					<button
						class="rounded bg-gray-800 px-3 py-1 text-sm text-white"
						on:click={handleUploadConfirm}>Save</button
					>
				</div>
			</div>
		</div>
	{/if}

	{#if previewDoc}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
			<div
				class="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6 shadow-lg"
			>
				<button
					class="absolute right-4 top-3 text-2xl text-gray-500 hover:text-black"
					on:click={closePreview}
				>
					&times;
				</button>

				<h2 class="mb-4 text-lg font-semibold">Preview: {previewDoc.name}</h2>

				{#if previewDoc.file_type.startsWith('application/pdf') || previewDoc.file_type.startsWith('image/')}
					<div class="h-[70vh] w-full overflow-auto rounded border">
						<iframe
							src={previewDoc.file_url}
							title="Document preview"
							class="h-full w-full"
							role="document"
						></iframe>
					</div>
				{:else}
					<p class="mb-2 text-sm text-gray-700">
						This file type cannot be previewed. Would you like to download it?
					</p>
					<a href={previewDoc.file_url} download class="text-blue-600 underline">Download File</a>
				{/if}
			</div>
		</div>
	{/if}
