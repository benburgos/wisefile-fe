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

<nav class="flex h-full flex-col bg-[var(--color-sidebar-bg)] p-4 text-white">
	<ul class="flex-grow space-y-2">
		{#if userRole && navLinks[userRole]?.length}
			{#each navLinks[userRole] as link}
				<li>
					<a
						href={link.path}
						class="block rounded px-4 py-2 transition-all"
						class:font-bold={$page.url.pathname === link.path}
						style="background-color: var(--color-sidebar-hover);"
					>
						{link.name}
					</a>
				</li>
			{/each}
		{:else}
			<li class="text-sm italic text-gray-400">No links available</li>
		{/if}
	</ul>

	<!-- RoleSwitcher -->
	<div class="border-t border-[var(--color-border)] bg-[var(--color-sidebar-bg)] p-4">
		<RoleSwitcher />
	</div>

	<!-- Logout Button -->
	<div class="mt-4 rounded p-4" style="background-color: var(--color-sidebar-hover);">
		<button
			on:click={logoutUser}
			class="w-full rounded px-4 py-2 text-white transition-all"
			style="background-color: var(--color-danger);"
		>
			Logout
		</button>
	</div>
</nav>
