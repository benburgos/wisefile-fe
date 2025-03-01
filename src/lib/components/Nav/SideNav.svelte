<script>
	import { auth, logoutUser } from '$lib/stores/auth';
	import { page } from '$app/stores';

	let isAuthenticated = false;
	let userRole = null;

	// Subscribe to auth store and ensure userRole updates correctly
	auth.subscribe(({ isAuthenticated: authStatus, role }) => {
		isAuthenticated = authStatus;
		userRole = role || null;
	});

	// Navigation links based on roles
	const navLinks = {
		admin: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Invoices', path: '/invoices' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Analytics', path: '/analytics' },
			{ name: 'Admin Panel', path: '/admin' },
			{ name: 'Settings', path: '/settings' }
		],
		ops: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Invoices', path: '/invoices' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Settings', path: '/settings' }
		],
		lawyer: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Settings', path: '/settings' }
		],
		client: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Invoices', path: '/invoices' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Analytics', path: '/analytics' },
			{ name: 'Settings', path: '/settings' }
		]
	};
</script>

<nav
	class="flex h-screen w-64 flex-col bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] shadow-lg"
>
	<!-- Navigation Links -->
	<ul class="flex-grow space-y-1 p-4">
		{#if userRole && navLinks[userRole]?.length}
			{#each navLinks[userRole] as link}
				<li>
					<a
						href={link.path}
						class="block rounded-md px-4 py-2 font-medium transition-all duration-300 hover:bg-[var(--color-sidebar-hover)]"
						class:font-bold={$page.url.pathname === link.path}
						class:active-link={$page.url.pathname === link.path}
					>
						{link.name}
					</a>
				</li>
			{/each}
		{:else}
			<li class="p-4 text-sm italic text-gray-400">No links available</li>
		{/if}
	</ul>

	<!-- Logout Button -->
	<div class="p-4">
		<button
			on:click={logoutUser}
			class="w-full rounded-lg bg-[var(--color-sidebar)] px-4 py-2 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-sidebar-hover)]"
		>
			Logout
		</button>
	</div>
</nav>
