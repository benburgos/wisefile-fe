<script>
	import { auth, logoutUser } from '$lib/stores/auth';

	let isAuthenticated = false;
	let userRole = null;

	auth.subscribe(({ isAuthenticated: authStatus, role }) => {
		isAuthenticated = authStatus;
		userRole = role;
	});

	// Navigation links based on roles
	const navLinks = {
		admin: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Analytics', path: '/analytics' },
			{ name: 'Admin Panel', path: '/admin' }
		],
		ops: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Messaging', path: '/messaging' }
		],
		lawyer: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' }
		],
		client: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' }
		]
	};
</script>

<nav class="flex h-full flex-col bg-gray-800 p-4 text-white">
	<ul class="flex-grow">
		{#each navLinks[userRole] as link}
			<li class="mb-2">
				<a href={link.path} class="block px-4 py-2 hover:bg-gray-700">
					{link.name}
				</a>
			</li>
		{/each}
	</ul>

	<!-- Role Switcher -->
	<div class="bg-gray-700 p-4">
		<label for="role-select" class="mb-2 block font-semibold text-white">Switch Role:</label>
		<select id="role-select" bind:value={userRole} class="rounded border p-2 text-black">
			{#each Object.keys(navLinks) as role}
				<option value={role} class="text-black">{role}</option>
			{/each}
		</select>
		<button
			on:click={() => auth.set({ isAuthenticated: true, role: userRole })}
			class="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
		>
			Set Role
		</button>
	</div>

	<!-- Logout Button -->
	<div class="bg-gray-700 p-4">
		<button
			on:click={logoutUser}
			class="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
		>
			Logout
		</button>
	</div>
</nav>
