<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let users = writable([
		{
			id: 1,
			name: 'Alice Johnson',
			role: 'Admin',
			email: 'alice@example.com',
			status: 'Active',
			client: 'WiseFile'
		},
		{
			id: 2,
			name: 'Bob Smith',
			role: 'Client',
			email: 'bob@example.com',
			status: 'Inactive',
			client: 'ABC Properties'
		},
		{
			id: 3,
			name: 'Charlie Davis',
			role: 'Ops',
			email: 'charlie@example.com',
			status: 'Active',
			client: 'WiseFile'
		},
		{
			id: 4,
			name: 'Dana Lee',
			role: 'Lawyer',
			email: 'dana@example.com',
			status: 'Active',
			client: 'Lee & Associates'
		},
		{
			id: 5,
			name: 'Ethan White',
			role: 'Client',
			email: 'ethan@example.com',
			status: 'Inactive',
			client: 'XYZ Realty'
		}
	]);

	let searchQuery = '';
	let filterStatus = 'All';

	// Modals
	let showEditModal = false;
	let showCreateModal = false;
	let selectedUser = null;

	// Edit Form Fields
	let editName = '';
	let editEmail = '';
	let editRole = 'Client';
	let editClient = '';

	// Create Form Fields
	let newName = '';
	let newEmail = '';
	let newRole = 'Client';
	let newClient = '';

	// Pre-Sort Users: Active First, Then Alphabetically
	onMount(() => {
		users.update((list) => {
			return [...list].sort((a, b) => {
				if (a.status === 'Active' && b.status === 'Inactive') return -1;
				if (a.status === 'Inactive' && b.status === 'Active') return 1;
				return a.name.localeCompare(b.name);
			});
		});
	});

	// Filter Users Based on Status
	function filteredUsers() {
		return $users.filter((user) => {
			let matchesStatus = filterStatus === 'All' || user.status === filterStatus;
			let matchesSearch =
				user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(user.client && user.client.toLowerCase().includes(searchQuery.toLowerCase()));
			return matchesStatus && matchesSearch;
		});
	}

	// Open Edit Modal and Load User Data
	function openEditModal(user) {
		selectedUser = user;
		editName = user.name;
		editEmail = user.email;
		editRole = user.role;
		editClient = user.client;
		showEditModal = true;
	}

	// Save Edited User
	function saveUser() {
		if (!selectedUser) return;

		// Update existing user details
		users.update((list) =>
			list.map((user) =>
				user.id === selectedUser.id
					? { ...user, name: editName, email: editEmail, role: editRole, client: editClient }
					: user
			)
		);

		showEditModal = false;
	}

	// Open Create Modal
	function openCreateModal() {
		// Reset Fields
		newName = '';
		newEmail = '';
		newRole = 'Client';
		newClient = '';
		showCreateModal = true;
	}

	// Create New User
	function createUser() {
		let newUser = {
			id: Date.now(),
			name: newName,
			email: newEmail,
			role: newRole,
			client: newRole === 'Admin' || newRole === 'Ops' ? 'WiseFile' : newClient,
			status: 'Active'
		};

		users.update((list) => [...list, newUser]);

		showCreateModal = false;
	}

	// Deactivate / Reactivate User
	function toggleUserStatus(user) {
		users.update((list) =>
			list.map((u) =>
				u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
			)
		);
	}
</script>

<section class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">User Management</h1>
		<button
			on:click={openCreateModal}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90"
		>
			Create User
		</button>
	</div>

	<!-- Filters -->
	<div class="mb-4 flex items-center gap-4">
		<input
			type="text"
			placeholder="Search users..."
			class="w-full rounded-lg border px-4 py-2"
			bind:value={searchQuery}
		/>

		<select class="rounded-lg border px-4 py-2" bind:value={filterStatus}>
			<option value="All">All Users</option>
			<option value="Active">Active Users</option>
			<option value="Inactive">Inactive Users</option>
		</select>
	</div>

	<!-- Users Table -->
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white text-sm shadow-md">
			<thead class="bg-gray-200 text-sm font-semibold">
				<tr>
					<th class="p-3 text-left">Name</th>
					<th class="p-3 text-left">Email</th>
					<th class="p-3 text-left">Role</th>
					<th class="p-3 text-left">Client</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredUsers() as user (user.id)}
					<tr class="border-t">
						<td class="p-3 text-sm">{user.name}</td>
						<td class="p-3 text-sm">{user.email}</td>
						<td class="p-3 text-sm">{user.role}</td>
						<td class="p-3 text-sm">{user.client}</td>
						<td class="p-3 text-sm">
							<span
								class="rounded-full px-3 py-1 text-xs text-white"
								class:!bg-green-500={user.status === 'Active'}
								class:!bg-red-500={user.status === 'Inactive'}
							>
								{user.status}
							</span>
						</td>
						<td class="flex gap-2 p-2">
							<button
								class="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
								on:click={() => openEditModal(user)}
							>
								Edit
							</button>
							<button
								class="rounded bg-yellow-600 px-3 py-1 text-white hover:bg-yellow-700"
								on:click={() => toggleUserStatus(user)}
							>
								{user.status === 'Active' ? 'Deactivate' : 'Reactivate'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Edit User Modal -->
	{#if showEditModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Edit User</h2>

				<!-- Name -->
				<label for="edit-name" class="block font-semibold">Name</label>
				<input
					id="edit-name"
					type="text"
					bind:value={editName}
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

				<!-- Role -->
				<label for="edit-role" class="block font-semibold">Role</label>
				<select id="edit-role" bind:value={editRole} class="mb-2 w-full rounded border p-2">
					<option value="Admin">Admin</option>
					<option value="Ops">Ops</option>
					<option value="Lawyer">Lawyer</option>
					<option value="Client">Client</option>
				</select>

				<!-- Client Field (Only for Client & Lawyer) -->
				{#if editRole === 'Client' || editRole === 'Lawyer'}
					<label for="edit-client" class="block font-semibold">Client</label>
					<input
						id="edit-client"
						type="text"
						bind:value={editClient}
						class="mb-2 w-full rounded border p-2"
					/>
				{/if}

				<!-- Buttons -->
				<div class="mt-4 flex justify-end gap-2">
					<button
						on:click={() => (showEditModal = false)}
						class="rounded bg-gray-500 px-4 py-2 text-white"
					>
						Cancel
					</button>
					<button
						on:click={saveUser}
						class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Create User Modal -->
	{#if showCreateModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Create User</h2>

				<!-- Name -->
				<label for="new-name" class="block font-semibold">Name</label>
				<input
					id="new-name"
					type="text"
					bind:value={newName}
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

				<!-- Role -->
				<label for="new-role" class="block font-semibold">Role</label>
				<select id="new-role" bind:value={newRole} class="mb-2 w-full rounded border p-2">
					<option value="Admin">Admin</option>
					<option value="Ops">Ops</option>
					<option value="Lawyer">Lawyer</option>
					<option value="Client">Client</option>
				</select>

				<!-- Client Field (Only for Client & Lawyer) -->
				{#if newRole === 'Client' || newRole === 'Lawyer'}
					<label for="new-client" class="block font-semibold">Client</label>
					<input
						id="new-client"
						type="text"
						bind:value={newClient}
						class="mb-2 w-full rounded border p-2"
					/>
				{/if}

				<!-- Buttons -->
				<div class="mt-4 flex justify-end gap-2">
					<button
						on:click={() => (showCreateModal = false)}
						class="rounded bg-gray-500 px-4 py-2 text-white"
					>
						Cancel
					</button>
					<button
						on:click={createUser}
						class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>
						Create User
					</button>
				</div>
			</div>
		</div>
	{/if}
</section>
