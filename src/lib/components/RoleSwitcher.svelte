<script>
	import { auth } from '$lib/stores/auth';

	let roles = ['admin', 'ops', 'lawyer', 'client'];
	let selectedRole = 'client';

	function changeRole() {
		auth.set({
			isAuthenticated: true,
			user: { name: `Test ${selectedRole}` },
			role: selectedRole,
			token: 'test-token'
		});
	}
</script>

<div class="rounded bg-gray-200 p-4">
	<label for="role-select" class="mb-2 block font-semibold">Switch Role:</label>
	<select id="role-select" bind:value={selectedRole} class="rounded border p-2">
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
