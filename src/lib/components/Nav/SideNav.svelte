<script>
	import { auth, logoutUser } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import RoleSwitcher from '$lib/components/RoleSwitcher.svelte';

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
			{ name: 'Admin Panel', path: '/admin' }
		],
		ops: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Invoices', path: '/invoices' },
			{ name: 'Messaging', path: '/messaging' }
		],
		lawyer: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Messaging', path: '/messaging' }
		],
		client: [
			{ name: 'Dashboard', path: '/dashboard' },
			{ name: 'Cases', path: '/cases' },
			{ name: 'Documents', path: '/documents' },
			{ name: 'Invoices', path: '/invoices' },
			{ name: 'Messaging', path: '/messaging' },
			{ name: 'Analytics', path: '/analytics' }
		]
	};
</script>

<nav class="flex h-screen w-64 flex-col bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)] shadow-lg">
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
			<li class="text-sm italic text-gray-400 p-4">No links available</li>
		{/if}
	</ul>

	<!-- RoleSwitcher -->
	<div class="p-4 border-t border-[var(--color-border)]">
		<RoleSwitcher />
	</div>

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

