<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let clients = writable([
		{
			id: 1,
			name: 'ABC Properties',
			legalEntity: 'ABC Holdings LLC',
			email: 'contact@abc.com',
			phone: '555-1234',
			address: '123 Main St, AZ',
			status: 'Active'
		},
		{
			id: 2,
			name: 'XYZ Realty',
			legalEntity: 'XYZ Realty Inc.',
			email: 'info@xyzrealty.com',
			phone: '555-5678',
			address: '789 Oak St, CA',
			status: 'Inactive'
		},
		{
			id: 3,
			name: 'Smith Rentals',
			legalEntity: 'Smith Rental Group',
			email: 'hello@smithrentals.com',
			phone: '555-9876',
			address: '456 Pine St, TX',
			status: 'Active'
		}
	]);

	let searchQuery = '';
	let showEditModal = false;
	let showCreateModal = false;
	let selectedClient = null;
	let filterStatus = 'All';

	// Form Fields
	let clientName = '';
	let legalEntity = '';
	let email = '';
	let phone = '';
	let address = '';

	// Sort Clients Alphabetically on Load
	onMount(() => {
		clients.update((list) => {
			return [...list].sort((a, b) => a.name.localeCompare(b.name));
		});
	});

	// Filter Clients Based on Status & Search
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

	// Open Edit Modal
	function openEditModal(client) {
		selectedClient = client;
		clientName = client.name;
		legalEntity = client.legalEntity;
		email = client.email;
		phone = client.phone;
		address = client.address;
		showEditModal = true;
	}

	// Save Client Changes
	function saveClient() {
		if (selectedClient) {
			selectedClient.name = clientName;
			selectedClient.legalEntity = legalEntity;
			selectedClient.email = email;
			selectedClient.phone = phone;
			selectedClient.address = address;
		} else {
			// Create New Client
			let newClient = {
				id: Date.now(),
				name: clientName,
				legalEntity,
				email,
				phone,
				address,
				status: 'Active'
			};
			clients.update((list) => [...list, newClient]);
		}
		showEditModal = false;
		showCreateModal = false;
	}

	// Toggle Client Status (Deactivate/Reactivate)
	function toggleClientStatus(client) {
		client.status = client.status === 'Active' ? 'Inactive' : 'Active';
	}
</script>

<section class="p-4 sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Client Management</h1>
		<button
			on:click={() => (showCreateModal = true)}
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
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Client Name</th>
					<th class="p-3 text-left">Legal Entity</th>
					<th class="p-3 text-left">Email</th>
					<th class="p-3 text-left">Phone</th>
					<th class="p-3 text-left">Address</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredClients() as client (client.id)}
					<tr class="border-t">
						<td class="p-3">{client.name}</td>
						<td class="p-3">{client.legalEntity}</td>
						<td class="p-3">{client.email}</td>
						<td class="p-3">{client.phone}</td>
						<td class="p-3">{client.address}</td>
						<td class="p-3">
							<span
								class="rounded-full px-3 py-1 text-sm text-white"
								class:!bg-green-500={client.status === 'Active'}
								class:!bg-red-500={client.status === 'Inactive'}
							>
								{client.status}
							</span>
						</td>
						<td class="flex gap-2 p-2">
							<!-- Edit Button -->
							<button
								class="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
								on:click={() => openEditModal(client)}
							>
								Edit
							</button>

							<!-- Deactivate/Reactivate Button -->
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

	<!-- Edit Client Modal -->
	{#if showEditModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Edit Client</h2>
				<label for="clientName" class="block font-semibold">Client Name</label>
				<input id="clientName" bind:value={clientName} />

				<label for="legalEntity" class="block font-semibold">Legal Entity</label>
				<input id="legalEntity" bind:value={legalEntity} />

				<label for="email" class="block font-semibold">Email</label>
				<input id="email" bind:value={email} />

				<label for="phone" class="block font-semibold">Phone</label>
				<input id="phone" bind:value={phone} />

				<label for="address" class="block font-semibold">Address</label>
				<input id="address" bind:value={address} />

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
</section>
