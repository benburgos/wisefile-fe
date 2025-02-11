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

<div class="rounded bg-gray-600 p-4">
	<label for="role-select" class="mb-2 block font-semibold text-white">Switch Role:</label>
	<select id="role-select" bind:value={selectedRole} class="rounded border bg-white p-2 text-black">
		{#each roles as role}
			<option value={role} class="text-black">{role}</option>
		{/each}
	</select>
	<button
		on:click={changeRole}
		class="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
	>
		Set Role
	</button>
</div>
