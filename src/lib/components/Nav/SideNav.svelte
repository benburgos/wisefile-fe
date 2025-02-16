<script>
	import { auth, logoutUser } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import RoleSwitcher from '$lib/components/RoleSwitcher.svelte';

	let isAuthenticated = false;
	let userRole = null;

	// Subscribe to auth store
	auth.subscribe(({ isAuthenticated: authStatus, user }) => {
		isAuthenticated = authStatus;
		userRole = user?.role || null;
		console.log('User Role in SideNav:', userRole);
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
	<ul class="flex-grow space-y-2">
		{#if userRole && navLinks[userRole]}
			{#each navLinks[userRole] as link}
				<li>
					<a
						href={link.path}
						class="block rounded px-4 py-2 transition-all"
						class:active={$page.url.pathname === link.path}
						class:bg-gray-700={$page.url.pathname === link.path}
						class:font-bold={$page.url.pathname === link.path}
						class:text-primary={$page.url.pathname === link.path}
					>
						{link.name}
					</a>
				</li>
			{/each}
		{:else}
			<li class="text-sm italic text-gray-400">No links available</li>
		{/if}
	</ul>

	<!-- Importing RoleSwitcher instead of inline logic -->
	<RoleSwitcher />

	<!-- Logout Button -->
	<div class="mt-4 rounded bg-gray-700 p-4">
		<button
			on:click={logoutUser}
			class="w-full rounded bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-700"
		>
			Logout
		</button>
	</div>
</nav>
