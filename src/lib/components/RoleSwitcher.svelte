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

<div class="p-4 bg-[var(--color-sidebar-bg)]">
	<label for="role-select" class="mb-2 block font-semibold text-[var(--color-text-primary)]">
	  Switch Role:
	</label>
	<select
	  id="role-select"
	  bind:value={selectedRole}
	  class="w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-text-primary)]"
	>
	  {#each roles as role}
		<option value={role}>{role}</option>
	  {/each}
	</select>
	<button
	  on:click={changeRole}
	  class="mt-2 w-full rounded bg-[var(--color-btn-primary)] px-4 py-2 text-white hover:bg-[var(--color-btn-primary-hover)]"
	>
	  Set Role
	</button>
  </div>
