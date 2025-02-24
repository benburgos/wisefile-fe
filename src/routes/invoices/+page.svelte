<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { auth } from '$lib/stores/auth';

	let invoices = writable([
		{
			id: 1,
			client: 'ABC Properties',
			caseNumber: 'ABC123-001',
			amount: '$450',
			status: 'Paid',
			created: '2025-02-01',
			fileName: 'invoice-abc123.pdf'
		},
		{
			id: 2,
			client: 'XYZ Realty',
			caseNumber: 'XYZ789-002',
			amount: '$700',
			status: 'Unpaid',
			created: '2025-01-15',
			fileName: 'invoice-xyz789.pdf'
		},
		{
			id: 3,
			client: 'Smith Rentals',
			caseNumber: 'SMITH556-003',
			amount: '$600',
			status: 'Paid',
			created: '2025-02-10',
			fileName: 'invoice-smith.pdf'
		},
		{
			id: 4,
			client: 'DEF Holdings',
			caseNumber: 'DEF112-004',
			amount: '$350',
			status: 'Unpaid',
			created: '2025-01-10',
			fileName: 'invoice-def112.pdf'
		}
	]);

	let searchQuery = '';
	let showInvoiceModal = false;
	let selectedInvoiceFile = null;
	let showUpdateModal = false;
	let selectedInvoice = null;
	let newStatus = '';
	let sortDirection = { column: 'status', order: 'desc' };
	let userRole = null;

	auth.subscribe(({ role }) => {
		userRole = role || null;
	});

	// Sorting logic updates
	onMount(() => {
		invoices.update((current) => {
			return [...current].sort((a, b) => {
				if (a.status === 'Unpaid' && b.status === 'Paid') return -1;
				if (a.status === 'Paid' && b.status === 'Unpaid') return 1;
				return new Date(a.created) - new Date(b.created);
			});
		});
	});

	// Function to toggle sorting
	function sortInvoices(column) {
		let currentOrder =
			sortDirection.column === column ? (sortDirection.order === 'asc' ? 'desc' : 'asc') : 'asc';
		sortDirection = { column, order: currentOrder };

		invoices.update((current) => {
			return [...current].sort((a, b) => {
				if (column === 'status') {
					if (a.status === 'Unpaid' && b.status === 'Paid') return -1;
					if (a.status === 'Paid' && b.status === 'Unpaid') return 1;
					return 0;
				}
				if (column === 'created') {
					return currentOrder === 'asc'
						? new Date(a.created) - new Date(b.created)
						: new Date(b.created) - new Date(a.created);
				}
				return 0;
			});
		});
	}

	function viewInvoice(fileName) {
		selectedInvoiceFile = fileName;
		showInvoiceModal = true;
	}

	function downloadInvoice(fileName) {
		alert(`Downloading ${fileName}...`);
	}

	function deleteInvoice(invoiceId) {
		if (confirm('Are you sure you want to delete this invoice?')) {
			invoices.update((current) => current.filter((inv) => inv.id !== invoiceId));
		}
	}

	// Open update modal and set default selection
	function openUpdateModal(invoice) {
		selectedInvoice = invoice;
		newStatus = invoice.status;
		showUpdateModal = true;
	}

	// Confirm and update status
	function confirmStatusUpdate() {
		if (!selectedInvoice) return;

		if (confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
			selectedInvoice.status = newStatus;

			// Ideally, this would trigger a backend API call
			console.log(`Invoice ${selectedInvoice.caseNumber} status updated to ${newStatus}`);
		}

		showUpdateModal = false;
	}
</script>

<section class="p-4 sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Invoices</h1>

		{#if userRole === 'admin' || userRole === 'ops'}
			<button
				on:click={() => (showUploadModal = true)}
				class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90"
			>
				Upload Invoice
			</button>
		{/if}
	</div>

	<input
		type="text"
		placeholder="Search invoices..."
		class="mb-4 w-full rounded-lg border px-4 py-2"
		bind:value={searchQuery}
	/>

	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md">
			<thead class="bg-gray-200">
				<tr>
					<th class="w-1/5 p-3 text-left">Client</th>
					<th class="w-1/5 p-3 text-left">Case #</th>
					<th class="w-1/6 p-3 text-left">Amount</th>
					<th class="w-1/6 cursor-pointer p-3 text-left" on:click={() => sortInvoices('status')}>
						Status <span class="ml-1"
							>{sortDirection.column === 'status'
								? sortDirection.order === 'asc'
									? '▲'
									: '▼'
								: ''}</span
						>
					</th>
					<th class="w-1/6 cursor-pointer p-3 text-left" on:click={() => sortInvoices('created')}>
						Created <span class="ml-1"
							>{sortDirection.column === 'created'
								? sortDirection.order === 'asc'
									? '▲'
									: '▼'
								: '⇅'}</span
						>
					</th>

					<th class="w-1/5 p-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $invoices as invoice (invoice.id)}
					<tr class="border-t">
						<td class="p-3">{invoice.client}</td>
						<td class="p-3">{invoice.caseNumber}</td>
						<td class="p-3">{invoice.amount}</td>
						<td class="p-3">
							<span
								class="rounded-full px-3 py-1 text-sm text-white"
								class:!bg-green-500={invoice.status === 'Paid'}
								class:!bg-red-500={invoice.status === 'Unpaid'}
							>
								{invoice.status}
							</span>
						</td>
						<td class="p-3">{invoice.created}</td>
						<td class="flex gap-2 p-2">
							<button
								class="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
								on:click={() => viewInvoice(invoice.fileName)}>View</button
							>
							<button
								class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
								on:click={() => downloadInvoice(invoice.fileName)}>Download</button
							>
							{#if userRole === 'admin' || userRole === 'ops'}
								<button
									class="rounded bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700"
									on:click={() => openUpdateModal(invoice)}>Update</button
								>
								<button
									class="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
									on:click={() => deleteInvoice(invoice.id)}>Delete</button
								>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showUpdateModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Update Invoice Status</h2>
				<select bind:value={newStatus} class="w-full rounded-lg border px-4 py-2">
					<option value="Unpaid">Unpaid</option>
					<option value="Paid">Paid</option>
				</select>
				<div class="mt-4 flex justify-end">
					<button
						on:click={confirmStatusUpdate}
						class="mr-2 rounded bg-green-600 px-4 py-2 text-white">Confirm</button
					>
					<button
						on:click={() => (showUpdateModal = false)}
						class="rounded bg-gray-500 px-4 py-2 text-white">Cancel</button
					>
				</div>
			</div>
		</div>
	{/if}
</section>
