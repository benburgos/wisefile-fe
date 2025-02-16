<script>
	import { auth } from '$lib/stores/auth';

	// Define roles with fake UUIDs for testing
	const roles = {
		admin: { role: 'admin', uuid: '550e8400-e29b-41d4-a716-446655440000', name: 'Admin User' },
		ops: { role: 'ops', uuid: '550e8400-e29b-41d4-a716-446655440001', name: 'Ops User' },
		lawyer: { role: 'lawyer', uuid: '550e8400-e29b-41d4-a716-446655440002', name: 'Jane Smith' },
		client: {
			role: 'client',
			uuid: '550e8400-e29b-41d4-a716-446655440003',
			clientId: 'ABC123',
			name: 'Client User'
		}
	};

	let selectedRole = 'client'; // Default role

	function switchRole() {
		const userData = roles[selectedRole];

		// Debug: Log userData before updating auth store
		console.log(`🔍 Switching role to:`, userData);

		// Update auth store
		auth.set({ ...userData, isAuthenticated: true });

		// Debug: Log auth state after updating
		auth.subscribe((value) => console.log(`✅ Auth Store Updated:`, value));

		// Store role and user data in cookies for persistence
		document.cookie = `userRole=${userData.role}; path=/`;
		document.cookie = `userUUID=${userData.uuid}; path=/`;

		if (userData.clientId) {
			document.cookie = `clientId=${userData.clientId}; path=/`;
		} else {
			document.cookie = `clientId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`; // Clear clientId if not needed
		}

		// Debug: Log updated cookies
		console.log(`✅ Cookies Updated:`);
		console.log(
			`📝 userRole=${document.cookie.split('; ').find((row) => row.startsWith('userRole'))}`
		);
		console.log(
			`📝 userUUID=${document.cookie.split('; ').find((row) => row.startsWith('userUUID'))}`
		);
		console.log(
			`📝 clientId=${document.cookie.split('; ').find((row) => row.startsWith('clientId'))}`
		);
	}
</script>

<div class="mt-4 rounded bg-gray-700 p-4">
	<label for="role-select" class="mb-2 block font-semibold text-white">Switch Role:</label>
	<select id="role-select" bind:value={selectedRole} class="w-full rounded border p-2 text-black">
		{#each Object.keys(roles) as role}
			<option value={role} class="text-black">{role}</option>
		{/each}
	</select>
	<button
		on:click={switchRole}
		class="mt-2 w-full rounded bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-700"
	>
		Set Role
	</button>
</div>
