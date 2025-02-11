<script>
	import { auth } from '$lib/stores/auth';
	import RoleSwitcher from '$lib/components/RoleSwitcher.svelte';

	let userRole = null;

	// Subscribe to auth store
	$: auth.subscribe(({ role }) => {
		userRole = role;
	});

	const menu = [
		{ title: 'Dashboard', path: '/dashboard', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Cases', path: '/cases', roles: ['admin', 'ops', 'lawyer'] },
		{ title: 'Documents', path: '/documents', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Messaging', path: '/messaging', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Analytics', path: '/analytics', roles: ['admin', 'ops'] },
		{ title: 'Admin Panel', path: '/admin', roles: ['admin'] }
	];
</script>

<nav class="flex h-screen w-64 flex-col justify-between bg-gray-800 p-4 text-white">
	<ul class="flex-grow">
		{#each menu as item}
			{#if userRole && item.roles.includes(userRole)}
				<li class="rounded px-4 py-2 hover:bg-gray-600">
					<a href={item.path}>{item.title}</a>
				</li>
			{/if}
		{/each}
	</ul>

	<!-- Move RoleSwitcher to the bottom of the nav -->
	<div class="mt-auto border-t border-gray-700 pt-4">
		<RoleSwitcher />
	</div>
</nav>
