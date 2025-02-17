<script>
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let roles = ['admin', 'ops', 'lawyer', 'client'];
	let selectedRole = 'client'; // Default role

	// Subscribe to auth store
	auth.subscribe(({ role }) => {
		if (role) {
			selectedRole = role; // Set selectedRole dynamically
		}
	});

	function changeRole() {
		const updatedAuth = {
			isAuthenticated: true,
			user: { name: `Test ${selectedRole}` },
			role: selectedRole,
			clientId: selectedRole === 'client' ? 'ABC123' : null,
			uuid: selectedRole === 'lawyer' ? '550e8400-e29b-41d4-a716-446655440002' : 'default-uuid',
			token: 'test-token'
		};

		auth.set(updatedAuth);
	}
</script>

<div class="rounded bg-gray-500 p-4">
	<label for="role-select" class="mb-2 block font-semibold text-white">Switch Role:</label>
	<select bind:value={selectedRole} class="rounded border p-2 text-black">
		{#each roles as role}
			<option value={role}>{role}</option>
		{/each}
	</select>
	<button
		on:click={changeRole}
		class="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
	>
		Set Role
	</button>
</div>
