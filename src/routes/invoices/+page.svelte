<script>
	import { onMount } from 'svelte';
	import { getAllRecords, saveToLocalStorage } from '$lib/localStorage';
	import { auth } from '$lib/stores/auth';

	let invoices = [];
	let caseRecords = [];
	let feeRecords = [];
	let clientRecords = [];
	let filteredInvoices = [];
	let search = '';
	let user;
	let showUploadModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let invoiceToDelete = null;
	let selectedInvoice = null;
	let newInvoice = {
		case_id: '',
		description: '',
		amount: 0,
		due_date: '',
		associated_fees: [],
		status: 'pending'
	};

	onMount(() => {
		auth.subscribe((value) => {
			user = value?.user;
			if (user) {
				loadData();
			}
		});
	});

	function loadData() {
		const allInvoices = getAllRecords('invoices');
		const allCases = getAllRecords('caseRecords');
		const allFees = getAllRecords('fees');
		const allClients = getAllRecords('clients');

		// Base filters
		caseRecords = allCases;
		feeRecords = allFees;

		if (user.role === 'admin') {
			invoices = allInvoices.filter((i) => i.is_active !== false);
			clientRecords = allClients;
		} else if (user.role === 'operations') {
			const operatorCaseIds = allCases
				.filter((c) => c.assigned_operator === user.id)
				.map((c) => c._id);

			invoices = allInvoices.filter(
				(i) => i.is_active !== false && operatorCaseIds.includes(i.case_id)
			);

			// Get clients related to those cases
			const clientIds = [
				...new Set(allCases.filter((c) => operatorCaseIds.includes(c._id)).map((c) => c.client_id))
			];
			clientRecords = allClients.filter((c) => clientIds.includes(c._id));
		} else if (user.role === 'client') {
			// Only show invoices tied to this client's cases
			const clientCaseIds = allCases.filter((c) => c.client_id === user.clientId).map((c) => c._id);

			invoices = allInvoices.filter(
				(i) =>
					i.is_active !== false &&
					clientCaseIds.includes(i.case_id) &&
					i.client_id === user.clientId
			);

			clientRecords = allClients.filter((c) => c._id === user.clientId);
		}

		invoices.sort(sortInvoices);
		filteredInvoices = invoices;
	}

	function sortInvoices(a, b) {
		const statusOrder = { overdue: 0, pending: 1, paid: 2 };
		if (statusOrder[a.status] !== statusOrder[b.status]) {
			return statusOrder[a.status] - statusOrder[b.status];
		}
		return new Date(a.due_date) - new Date(b.due_date);
	}

	function getClientName(client_id) {
		return clientRecords.find((c) => c._id === client_id)?.internal_name || 'Unknown';
	}

	function getCaseNumber(case_id) {
		return caseRecords.find((c) => c._id === case_id)?.case_number || 'Unknown';
	}

	function applySearch() {
		const term = search.toLowerCase();
		filteredInvoices = invoices.filter((inv) => {
			return (
				getClientName(inv.client_id).toLowerCase().includes(term) ||
				getCaseNumber(inv.case_id).toLowerCase().includes(term) ||
				inv.invoice_number.toLowerCase().includes(term) ||
				inv.status.toLowerCase().includes(term)
			);
		});
	}

	function handleUpload() {
		showUploadModal = true;
	}

	function generateInvoiceNumber(clientId) {
		const clientCases = invoices.filter((inv) => inv.client_id === clientId);
		const lastNumber =
			clientCases
				.map((inv) => inv.invoice_number?.split('-')?.[2])
				.filter(Boolean)
				.map((num) => parseInt(num))
				.sort((a, b) => b - a)[0] || 0;

		const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
		const clientCode = getCaseNumber(newInvoice.case_id).split('-')[0]; // e.g., 'PFH'

		return `${clientCode}-INV-${nextNumber}`;
	}

	function handleUploadConfirm() {
		const invoice = {
			_id: crypto.randomUUID(),
			client_id: caseRecords.find((c) => c._id === newInvoice.case_id)?.client_id || '',
			case_id: newInvoice.case_id,
			invoice_number: generateInvoiceNumber(newInvoice.client_id),
			invoice_date: new Date(),
			due_date: new Date(newInvoice.due_date),
			amount: newInvoice.amount,
			description: newInvoice.description,
			status: 'pending',
			created_at: new Date(),
			updated_at: new Date(),
			is_active: true,
			payment_details: {},
			notes: '',
			associated_fees: newInvoice.associated_fees
		};
		invoices = [invoice, ...invoices];
		saveToLocalStorage('invoices', invoices);
		showUploadModal = false;
		loadData();
		newInvoice = {
			case_id: '',
			description: '',
			amount: 0,
			due_date: '',
			associated_fees: [],
			status: 'pending'
		};
	}

	function getEligibleCases() {
		if (!user || !user.role) return [];
		return caseRecords
			.filter((c) => {
				if (user.role === 'admin') return true;
				if (user.role === 'client') return c.client_id === user.client_id;
				if (user.role === 'attorney') return c.assigned_attorney === user.id;
				if (user.role === 'operator') return c.assigned_operator === user.id;
				return false;
			})
			.sort((a, b) => {
				const [prefixA, numA] = a.case_number.split('-CASE-');
				const [prefixB, numB] = b.case_number.split('-CASE-');
				return prefixA.localeCompare(prefixB) || parseInt(numA) - parseInt(numB);
			});
	}

	function getPendingFeesForCase(case_id) {
		return feeRecords.filter((f) => f.case_id === case_id && f.status === 'pending');
	}

	function updateAmountFromFees() {
		const selected = newInvoice.associated_fees;
		const total = feeRecords
			.filter((f) => selected.includes(f._id))
			.reduce((sum, fee) => sum + fee.amount, 0);
		newInvoice.amount = total;
	}

	function handleDeleteRequest(inv) {
		showDeleteModal = true;
		invoiceToDelete = inv;
	}

	function confirmDelete() {
		if (invoiceToDelete) {
			const updated = invoices.map((i) =>
				i._id === invoiceToDelete._id ? { ...i, is_active: false } : i
			);
			saveToLocalStorage('invoices', updated);
			invoices = updated.filter((i) => i.is_active !== false);
			filteredInvoices = invoices;
		}
		showDeleteModal = false;
		invoiceToDelete = null;
	}

	function handleEdit(invoice) {
		selectedInvoice = { ...invoice };
		showEditModal = true;
	}

	function confirmEdit() {
		const index = invoices.findIndex((i) => i._id === selectedInvoice._id);
		if (index !== -1) {
			invoices[index].status = selectedInvoice.status;
			invoices[index].updated_at = new Date();
			if (selectedInvoice.status === 'paid') {
				invoices[index].associated_fees.forEach((id) => {
					const fee = feeRecords.find((f) => f._id === id);
					if (fee) fee.status = 'paid';
				});
				saveToLocalStorage('fees', feeRecords);
			}
			saveToLocalStorage('invoices', invoices);
			loadData();
			showEditModal = false;
		}
	}
</script>

<section class="space-y-6">
	<div class="flex items-center justify-between">
		<input
			type="text"
			placeholder="Search invoices..."
			bind:value={search}
			on:input={applySearch}
			class="w-full rounded border border-gray-300 bg-gray-50 px-4 py-2"
		/>
		<button class="ml-2 rounded bg-gray-800 px-4 py-2 text-white" on:click={handleUpload}>
			Upload
		</button>
	</div>

	<table class="table-standard w-full border text-sm shadow-sm">
		<thead>
			<tr>
				<th>Client</th>
				<th>Case #</th>
				<th>Invoice #</th>
				<th>Amount</th>
				<th>Due</th>
				<th>Status</th>
				<th class="text-center"><span class="flex justify-center">Actions</span></th>
			</tr>
		</thead>
		<tbody>
			{#each filteredInvoices as inv, i}
				<tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
					<td>{getClientName(inv.client_id)}</td>
					<td>{getCaseNumber(inv.case_id)}</td>
					<td>{inv.invoice_number}</td>
					<td>${inv.amount.toFixed(2)}</td>
					<td>{new Date(inv.due_date).toLocaleDateString()}</td>
					<td class="capitalize">{inv.status}</td>
					<td class="no-ellipsis whitespace-nowrap text-center text-sm">
						<span class="flex items-center justify-center gap-1">
							<button
								class="text-xs hover:underline"
								class:text-blue-600={inv.status !== 'paid'}
								class:text-gray-400={inv.status === 'paid'}
								disabled={inv.status === 'paid'}
								on:click={() => handleEdit(inv)}
							>
								Edit
							</button>

							<span class="text-gray-400">|</span>

							<button
								class="text-xs hover:underline"
								class:text-red-600={inv.status !== 'paid'}
								class:text-gray-400={inv.status === 'paid'}
								disabled={inv.status === 'paid'}
								on:click={() => handleDeleteRequest(inv)}
							>
								Delete
							</button>
						</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

{#if showUploadModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
		<div class="relative w-full max-w-lg rounded bg-white p-4 shadow-lg">
			<h2 class="mb-4 text-lg font-semibold">Upload Invoice</h2>
			<div class="mb-2">
				<span class="mb-1 block text-sm font-medium">Case</span>
				<select
					bind:value={newInvoice.case_id}
					class="w-full rounded border px-2 py-1"
					on:change={updateAmountFromFees}
				>
					<option value="">Select a case</option>
					{#each getEligibleCases() as c}
						<option value={c._id}>{c.case_number}</option>
					{/each}
				</select>
			</div>
			<div class="mb-2">
				<span class="mb-1 block text-sm font-medium">Due Date</span>
				<input
					type="date"
					bind:value={newInvoice.due_date}
					class="w-full rounded border px-2 py-1"
				/>
			</div>
			<div class="mb-2">
				<span class="mb-1 block text-sm font-medium">Associated Fees</span>
				<div class="max-h-40 overflow-auto rounded border px-2 py-1">
					{#each getPendingFeesForCase(newInvoice.case_id) as fee}
						<div class="mb-1 flex items-center justify-between">
							<span class="text-sm">{fee.type} - ${fee.amount.toFixed(2)}</span>
							<input
								type="checkbox"
								value={fee._id}
								bind:group={newInvoice.associated_fees}
								on:change={updateAmountFromFees}
							/>
						</div>
					{/each}
				</div>
			</div>
			<div class="mb-2">
				<span class="mb-1 block text-sm font-medium">Amount</span>
				<div class="rounded border bg-gray-100 px-2 py-1">${newInvoice.amount.toFixed(2)}</div>
			</div>
			<div class="mb-2">
				<span class="mb-1 block text-sm font-medium">Description</span>
				<textarea
					bind:value={newInvoice.description}
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

{#if showEditModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
		<div class="relative w-full max-w-md rounded bg-white p-4 shadow-lg">
			<h2 class="mb-4 text-lg font-semibold">Edit Invoice Status</h2>
			<select bind:value={selectedInvoice.status} class="w-full rounded border px-2 py-1">
				<option value="overdue">Overdue</option>
				<option value="pending">Pending</option>
				<option value="paid">Paid</option>
			</select>
			<div class="mt-4 flex justify-end gap-2">
				<button
					class="rounded bg-gray-300 px-3 py-1 text-sm"
					on:click={() => (showEditModal = false)}>Cancel</button
				>
				<button class="rounded bg-green-600 px-3 py-1 text-sm text-white" on:click={confirmEdit}
					>Save</button
				>
			</div>
		</div>
	</div>
{/if}

{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
		<div class="relative w-full max-w-md rounded bg-white p-4 shadow-lg">
			<h2 class="mb-3 text-lg font-semibold">Confirm Deletion</h2>
			<p class="mb-4 text-sm text-gray-700">
				Are you sure you want to delete invoice <strong>{invoiceToDelete?.invoice_number}</strong>?
				This action cannot be undone.
			</p>
			<div class="flex justify-end gap-2">
				<button
					class="rounded bg-gray-300 px-3 py-1 text-sm"
					on:click={() => (showDeleteModal = false)}
				>
					Cancel
				</button>
				<button class="rounded bg-red-600 px-3 py-1 text-sm text-white" on:click={confirmDelete}>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	table {
		table-layout: fixed;
	}
	th,
	td {
		padding: 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	th {
		background-color: #4b5563;
		color: white;
	}
	.no-ellipsis {
		white-space: normal;
		overflow: visible;
		text-overflow: initial;
	}
</style>
