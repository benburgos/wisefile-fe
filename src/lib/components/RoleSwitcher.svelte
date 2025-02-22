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

<div class="border border-[var(--color-border)] p-4">
	<label for="role-select" class="mb-2 block text-sm font-medium text-[var(--color-sidebar-text)]">
		Switch Role:
	</label>

	<div class="relative">
		<select
			id="role-select"
			bind:value={selectedRole}
			class="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-black focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
		>
			{#each roles as role}
				<option value={role} class="text-black">{role}</option>
			{/each}
		</select>
	</div>

	<button
		on:click={changeRole}
		class="mt-3 w-full rounded-md bg-[var(--color-primary)] px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-primary-hover)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
	>
		Set Role
	</button>
</div>
