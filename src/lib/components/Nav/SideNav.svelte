<script>
	import { auth } from '$lib/stores/auth';

	// Placeholder for dynamic role-based menu
	let menu = [
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Cases', path: '/cases' },
		{ title: 'Documents', path: '/documents' }
	];

	$: {
		auth.subscribe(({ role }) => {
			// Modify menu based on user role
			if (role === 'admin') {
				menu.push({ title: 'Admin Panel', path: '/admin' });
			}
		});
	}
</script>

<nav class="h-screen w-64 bg-gray-800 p-4 text-white">
	<ul>
		{#each menu as item}
			<li class="rounded px-4 py-2 hover:bg-gray-600">
				<a href={item.path}>{item.title}</a>
			</li>
		{/each}
	</ul>
</nav>
