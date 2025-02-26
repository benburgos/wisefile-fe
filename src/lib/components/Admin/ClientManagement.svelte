<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let clients = writable([
		{
			id: 1,
			name: 'ABC Properties',
			legalEntity: 'ABC Properties LLC',
			email: 'contact@abcproperties.com',
			phone: '(555) 123-4567',
			address: '123 Main St, Phoenix, AZ',
			status: 'Active'
		},
		{
			id: 2,
			name: 'XYZ Realty',
			legalEntity: 'XYZ Realty Inc.',
			email: 'info@xyzrealty.com',
			phone: '(555) 987-6543',
			address: '456 Oak St, Denver, CO',
			status: 'Inactive'
		},
		{
			id: 3,
			name: 'Smith Rentals',
			legalEntity: 'Smith Rentals Group',
			email: 'support@smithrentals.com',
			phone: '(555) 678-9012',
			address: '789 Pine St, Seattle, WA',
			status: 'Active'
		}
	]);

	let searchQuery = '';
	let filterStatus = 'All';

	// Modals
	let showEditModal = false;
	let showCreateModal = false;
	let selectedClient = null;

	// Edit Form Fields
	let editName = '';
	let editLegalEntity = '';
	let editEmail = '';
	let editPhone = '';
	let editAddress = '';

	// Create Form Fields
	let newName = '';
	let newLegalEntity = '';
	let newEmail = '';
	let newPhone = '';
	let newAddress = '';

	// Pre-Sort Clients: Active First, Then Alphabetically
	onMount(() => {
		clients.update((list) => {
			return [...list].sort((a, b) => {
				if (a.status === 'Active' && b.status === 'Inactive') return -1;
				if (a.status === 'Inactive' && b.status === 'Active') return 1;
				return a.name.localeCompare(b.name);
			});
		});
	});

	// Filter Clients Based on Status
	function filteredClients() {
		return $clients.filter((client) => {
			let matchesStatus = filterStatus === 'All' || client.status === filterStatus;
			let matchesSearch =
				client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				client.legalEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
				client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				client.phone.includes(searchQuery) ||
				client.address.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesStatus && matchesSearch;
		});
	}

	// Open Edit Modal and Load Client Data
	function openEditModal(client) {
		selectedClient = client;
		editName = client.name;
		editLegalEntity = client.legalEntity;
		editEmail = client.email;
		editPhone = client.phone;
		editAddress = client.address;
		showEditModal = true;
	}

	// Save Edited Client
	function saveClient() {
		if (!selectedClient) return;

		// Update existing client details
		clients.update((list) =>
			list.map((client) =>
				client.id === selectedClient.id
					? {
							...client,
							name: editName,
							legalEntity: editLegalEntity,
							email: editEmail,
							phone: editPhone,
							address: editAddress
						}
					: client
			)
		);

		showEditModal = false;
	}

	// Open Create Modal
	function openCreateModal() {
		// Reset Fields
		newName = '';
		newLegalEntity = '';
		newEmail = '';
		newPhone = '';
		newAddress = '';
		showCreateModal = true;
	}

	// Create New Client
	function createClient() {
		let newClient = {
			id: Date.now(),
			name: newName,
			legalEntity: newLegalEntity,
			email: newEmail,
			phone: newPhone,
			address: newAddress,
			status: 'Active'
		};

		clients.update((list) => [...list, newClient]);

		showCreateModal = false;
	}

	// Deactivate / Reactivate Client (And Their Users)
	function toggleClientStatus(client) {
		const newStatus = client.status === 'Active' ? 'Inactive' : 'Active';

		let message =
			newStatus === 'Inactive'
				? `Deactivating this client will also deactivate all associated users.`
				: `Reactivating this client will NOT reactivate users. Users must be reactivated individually.`;

		if (confirm(`${message} Proceed?`)) {
			clients.update((list) =>
				list.map((c) => (c.id === client.id ? { ...c, status: newStatus } : c))
			);
		}
	}
</script>

<section class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Client Management</h1>
		<button
			on:click={openCreateModal}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90"
		>
			Create Client
		</button>
	</div>

	<!-- Filters -->
	<div class="mb-4 flex items-center gap-4">
		<input
			type="text"
			placeholder="Search clients..."
			class="w-full rounded-lg border px-4 py-2"
			bind:value={searchQuery}
		/>

		<select class="rounded-lg border px-4 py-2" bind:value={filterStatus}>
			<option value="All">All Clients</option>
			<option value="Active">Active Clients</option>
			<option value="Inactive">Inactive Clients</option>
		</select>
	</div>

	<!-- Clients Table -->
	<div class="rounded-lg border bg-white shadow-md">
		<!-- Scrollable Table -->
		<div class="max-h-[500px] overflow-y-auto">
			<table class="w-full text-sm">
				<thead class="sticky top-0 bg-gray-200 text-sm font-semibold">
					<tr>
						<th class="p-3 text-left">Name</th>
						<th class="p-3 text-left">Legal Entity</th>
						<th class="p-3 text-left">Email</th>
						<th class="p-3 text-left">Phone</th>
						<th class="p-3 text-left">Address</th>
						<th class="p-3 text-left">Status</th>
						<th class="p-3 text-left">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each filteredClients() as client (client.id)}
						<tr class="border-t">
							<td class="p-3 text-xs">{client.name}</td>
							<td class="p-3 text-xs">{client.legalEntity}</td>
							<td class="p-3 text-xs">{client.email}</td>
							<td class="p-3 text-xs">{client.phone}</td>
							<td class="p-3 text-xs">{client.address}</td>
							<td class="p-3 text-xs">
								<span
									class="rounded-full px-3 py-1 text-xs text-white"
									class:!bg-green-500={client.status === 'Active'}
									class:!bg-red-500={client.status === 'Inactive'}
								>
									{client.status}
								</span>
							</td>
							<td class="flex gap-2 p-2">
								<button
									class="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
									on:click={() => openEditModal(client)}
								>
									Edit
								</button>
								<button
									class="rounded bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700"
									on:click={() => toggleClientStatus(client)}
								>
									{client.status === 'Active' ? 'Deactivate' : 'Reactivate'}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if showEditModal}
			<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
					<h2 class="mb-4 text-xl font-bold">Edit Client</h2>

					<!-- Internal Name -->
					<label for="edit-name" class="block font-semibold">Internal Name</label>
					<input
						id="edit-name"
						type="text"
						bind:value={editName}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Legal Entity -->
					<label for="edit-legal" class="block font-semibold">Legal Entity</label>
					<input
						id="edit-legal"
						type="text"
						bind:value={editLegalEntity}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Email -->
					<label for="edit-email" class="block font-semibold">Email</label>
					<input
						id="edit-email"
						type="email"
						bind:value={editEmail}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Phone -->
					<label for="edit-phone" class="block font-semibold">Phone</label>
					<input
						id="edit-phone"
						type="text"
						bind:value={editPhone}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Address -->
					<label for="edit-address" class="block font-semibold">Address</label>
					<input
						id="edit-address"
						type="text"
						bind:value={editAddress}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Buttons -->
					<div class="mt-4 flex justify-end gap-2">
						<button
							on:click={() => (showEditModal = false)}
							class="rounded bg-gray-500 px-4 py-2 text-white"
						>
							Cancel
						</button>
						<button
							on:click={saveClient}
							class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
						>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		{/if}

		{#if showCreateModal}
			<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
					<h2 class="mb-4 text-xl font-bold">Create Client</h2>

					<!-- Internal Name -->
					<label for="new-name" class="block font-semibold">Internal Name</label>
					<input
						id="new-name"
						type="text"
						bind:value={newName}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Legal Entity -->
					<label for="new-legal" class="block font-semibold">Legal Entity</label>
					<input
						id="new-legal"
						type="text"
						bind:value={newLegalEntity}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Email -->
					<label for="new-email" class="block font-semibold">Email</label>
					<input
						id="new-email"
						type="email"
						bind:value={newEmail}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Phone -->
					<label for="new-phone" class="block font-semibold">Phone</label>
					<input
						id="new-phone"
						type="text"
						bind:value={newPhone}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Address -->
					<label for="new-address" class="block font-semibold">Address</label>
					<input
						id="new-address"
						type="text"
						bind:value={newAddress}
						class="mb-2 w-full rounded border p-2"
					/>

					<!-- Buttons -->
					<div class="mt-4 flex justify-end gap-2">
						<button
							on:click={() => (showCreateModal = false)}
							class="rounded bg-gray-500 px-4 py-2 text-white"
						>
							Cancel
						</button>
						<button
							on:click={createClient}
							class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
						>
							Create Client
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>
