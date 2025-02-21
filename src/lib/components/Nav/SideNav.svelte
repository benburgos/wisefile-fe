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

<nav class="flex h-screen w-64 flex-col bg-[var(--color-sidebar-bg)] p-4 shadow-md">
	<ul class="flex-grow space-y-1">
		{#if userRole && navLinks[userRole]?.length}
			{#each navLinks[userRole] as link}
				<li>
					<a
						href={link.path}
						class="block rounded-lg px-4 py-2 font-medium transition-all duration-300"
						class:font-bold={$page.url.pathname === link.path}
						style="
							background-color: var(--color-sidebar-item);
							color: var(--color-sidebar-text);
						"
						on:mouseenter={() =>
							(event.target.style.backgroundColor = 'var(--color-sidebar-hover)')}
						on:mouseleave={() => (event.target.style.backgroundColor = 'var(--color-sidebar-item)')}
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
	<div class="mt-6">
		<RoleSwitcher />
	</div>

	<!-- Logout Button -->
	<div class="mt-6">
		<button
			on:click={logoutUser}
			class="w-full rounded-lg px-4 py-2 font-semibold transition-all duration-300"
			style="background-color: var(--color-danger); color: #fff;"
			on:mouseenter={() => (event.target.style.backgroundColor = 'var(--color-danger-hover)')}
			on:mouseleave={() => (event.target.style.backgroundColor = 'var(--color-danger)')}
		>
			Logout
		</button>
	</div>
</nav>
