<script>
	import { auth } from '$lib/stores/auth';

	let userRole = null;

	// Subscribe to auth store
	$: auth.subscribe(({ role }) => {
		userRole = role;
	});

	// Define role-based navigation
	const menu = [
		{ title: 'Dashboard', path: '/dashboard', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Cases', path: '/cases', roles: ['admin', 'ops', 'lawyer'] },
		{ title: 'Documents', path: '/documents', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Messaging', path: '/messaging', roles: ['admin', 'ops', 'lawyer', 'client'] },
		{ title: 'Analytics', path: '/analytics', roles: ['admin', 'ops'] },
		{ title: 'Admin Panel', path: '/admin', roles: ['admin'] }
	];
</script>

<nav class="h-screen w-64 bg-gray-800 p-4 text-white">
	<ul>
		{#each menu as item}
			{#if userRole && item.roles.includes(userRole)}
				<li class="rounded px-4 py-2 hover:bg-gray-600">
					<a href={item.path}>{item.title}</a>
				</li>
			{/if}
		{/each}
	</ul>
</nav>
