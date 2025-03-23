<script>
	import { auth, logoutUser } from '$lib/stores/auth';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let userRole = null;
	let unsubscribe = auth.subscribe(({ user }) => {
		userRole = user?.role ?? null;
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	function nav(path) {
		goto(path);
	}

	const navItems = [
		{
			path: '/dashboard',
			label: 'Dashboard',
			roles: ['admin', 'operations', 'client', 'attorney']
		},
		{ path: '/cases', label: 'Cases', roles: ['admin', 'operations', 'client', 'attorney'] },
		{ path: '/messaging', label: 'Messages', roles: ['admin', 'operations', 'client', 'attorney'] },
		{
			path: '/documents',
			label: 'Documents',
			roles: ['admin', 'operations', 'client', 'attorney']
		},
		{ path: '/invoices', label: 'Invoices', roles: ['admin', 'operations', 'client'] },
		{ path: '/admin', label: 'Admin Panel', roles: ['admin'] },
		{ path: '/settings', label: 'Settings', roles: ['admin', 'operations', 'client', 'attorney'] }
	];
</script>

<div class="flex h-full flex-col justify-between">
	<nav class="space-y-4 p-4">
		<ul class="space-y-2">
			{#each navItems as { path, label, roles }}
				{#if roles.includes(userRole)}
					<li>
						<button
							type="button"
							on:click={() => nav(path)}
							class="w-full rounded text-left text-white hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{label}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>

	<!-- Logout Button at Bottom -->
	<div class="p-4">
		<button
			type="button"
			on:click={logoutUser}
			class="w-full rounded text-left text-white hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
		>
			Logout
		</button>
	</div>
</div>
