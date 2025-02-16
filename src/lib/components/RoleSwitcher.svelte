<script>
	import { auth } from '$lib/stores/auth';

	let roles = ['admin', 'ops', 'lawyer', 'client'];
	let selectedRole = 'client';

	function switchRole() {
		console.log('Switching role to:', selectedRole);

		// Update auth state
		let newAuthState;
		auth.update((current) => {
			newAuthState = {
				...current,
				user: { ...current.user, role: selectedRole },
				clientId: selectedRole === 'client' ? 'ABC123' : null,
				uuid: selectedRole === 'lawyer' ? '550e8400-e29b-41d4-a716-446655440002' : current.uuid
			};
			return newAuthState;
		});

		// Debug log for new state
		console.log('New Auth State:', newAuthState);

		// Update the `auth` cookie (with proper encoding)
		document.cookie = `auth=${encodeURIComponent(JSON.stringify(newAuthState))}; path=/; Secure; SameSite=Strict`;

		// Debug log for updated cookie
		console.log('Updated Cookie:', document.cookie);

		// Force reload to apply changes
		window.location.reload();
	}
</script>

<div class="rounded bg-gray-500 p-4">
	<label for="role-select" class="mb-2 block font-semibold">Switch Role:</label>
	<select id="role-select" bind:value={selectedRole} class="text-black rounded border p-2">
		{#each roles as role}
			<option value={role}>{role}</option>
		{/each}
	</select>
	<button
		on:click={switchRole}
		class="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
	>
		Set Role
	</button>
</div>
