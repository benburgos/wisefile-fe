<script>
    import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

    let clients = writable([
        { id: 1, name: 'ABC Properties', legalName: 'ABC Properties LLC', email: 'contact@abc.com', phone: '123-456-7890', address: '123 Main St, Phoenix, AZ', status: 'Active' },
        { id: 2, name: 'XYZ Realty', legalName: 'XYZ Realty Group', email: 'info@xyz.com', phone: '987-654-3210', address: '456 Elm St, Denver, CO', status: 'Inactive' }
    ]);

    let searchQuery = '';
    let showEditModal = false;
    let selectedClient = null;
    let filterStatus = 'All';

    let clientName = '';
    let legalName = '';
    let email = '';
    let phone = '';
    let address = '';

    // Pre-sort Clients: Active First, Then Alphabetically
    onMount(() => {
        clients.update((list) => {
            return [...list].sort((a, b) => {
                if (a.status === 'Active' && b.status === 'Inactive') return -1;
                if (a.status === 'Inactive' && b.status === 'Active') return 1;
                return a.name.localeCompare(b.name);
            });
        });
    });

    function filteredClients() {
        return $clients.filter((client) => {
            let matchesStatus = filterStatus === 'All' || client.status === filterStatus;
            let matchesSearch =
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }

    function openEditModal(client) {
        selectedClient = client;
        clientName = client ? client.name : '';
        legalName = client ? client.legalName : '';
        email = client ? client.email : '';
        phone = client ? client.phone : '';
        address = client ? client.address : '';
        showEditModal = true;
    }

    function saveClient() {
        if (selectedClient) {
            selectedClient.name = clientName;
            selectedClient.legalName = legalName;
            selectedClient.email = email;
            selectedClient.phone = phone;
            selectedClient.address = address;
            console.log(`Updated Client: ${JSON.stringify(selectedClient)}`);
        } else {
            let newClient = {
                id: Date.now(),
                name: clientName,
                legalName,
                email,
                phone,
                address,
                status: 'Active'
            };
            clients.update((list) => [...list, newClient]);
            console.log(`Created Client: ${JSON.stringify(newClient)}`);
        }
        showEditModal = false;
    }

    function toggleClientStatus(client) {
        const confirmMsg = client.status === 'Active'
            ? `Deactivating "${client.name}" will deactivate all users under this client. Proceed?`
            : `Reactivating "${client.name}" will not automatically reactivate users. Proceed?`;

        if (confirm(confirmMsg)) {
            client.status = client.status === 'Active' ? 'Inactive' : 'Active';
            console.log(`Client ${client.name} is now ${client.status}`);
        }
    }
</script>

<section class="p-4">
    <div class="mb-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Client Management</h1>
        <button on:click={() => openEditModal(null)}
            class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90">
            Create Client
        </button>
    </div>

    <div class="mb-4 flex items-center gap-4">
        <input type="text" placeholder="Search clients..." class="w-full rounded-lg border px-4 py-2" bind:value={searchQuery} />
        <select class="rounded-lg border px-4 py-2" bind:value={filterStatus}>
            <option value="All">All Clients</option>
            <option value="Active">Active Clients</option>
            <option value="Inactive">Inactive Clients</option>
        </select>
    </div>

    <div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md text-sm">
			<thead class="bg-gray-200 text-sm font-semibold">
				<tr>
					<th class="p-2 text-left">Client Name</th>
					<th class="p-2 text-left">Legal Name</th>
					<th class="p-2 text-left">Email</th>
					<th class="p-2 text-left">Phone</th>
					<th class="p-2 text-left">Address</th>
					<th class="p-2 text-left">Status</th>
					<th class="p-2 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredClients() as client (client.id)}
					<tr class="border-t">
						<td class="p-2 text-sm">{client.name}</td>
						<td class="p-2 text-sm">{client.legalName}</td>
						<td class="p-2 text-sm">{client.email}</td>
						<td class="p-2 text-sm">{client.phone}</td>
						<td class="p-2 text-sm">{client.address}</td>
						<td class="p-2 text-sm">
							<span class="rounded-full px-3 py-1 text-xs text-white"
								class:!bg-green-500={client.status === 'Active'}
								class:!bg-red-500={client.status === 'Inactive'}>
								{client.status}
							</span>
						</td>
						<td class="flex gap-2 p-2">
							<button class="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700" on:click={() => openEditModal(client)}>Edit</button>
							<button class="rounded bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700" on:click={() => toggleClientStatus(client)}>
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
                <h2 class="mb-4 text-xl font-bold">{selectedClient ? 'Edit Client' : 'Create Client'}</h2>

                <label for="clientName" class="block font-semibold">Client Name</label>
                <input id="clientName" bind:value={clientName} />

                <label for="legalName" class="block font-semibold">Legal Name</label>
                <input id="legalName" bind:value={legalName} />

                <label for="email" class="block font-semibold">Email</label>
                <input id="email" bind:value={email} />

                <label for="phone" class="block font-semibold">Phone</label>
                <input id="phone" bind:value={phone} />

                <label for="address" class="block font-semibold">Address</label>
                <input id="address" bind:value={address} />

                <div class="mt-4 flex justify-end gap-2">
                    <button on:click={() => (showEditModal = false)} class="rounded bg-gray-500 px-4 py-2 text-white">Cancel</button>
                    <button on:click={saveClient} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white">
                        {selectedClient ? 'Save Changes' : 'Create Client'}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</section>
