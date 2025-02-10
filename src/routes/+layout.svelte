<script>
	import '../app.css';
	import SideNav from '$lib/components/Nav/SideNav.svelte';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	$: {
		auth.subscribe(({ isAuthenticated: authStatus }) => {
			isAuthenticated = authStatus;
		});

		// Redirect to login if not authenticated
		if (!isAuthenticated && $page.url.pathname !== '/') {
			goto('/');
		}
	}
</script>

<div class="flex">
	<SideNav />
	<main class="flex-grow p-4">
		<slot />
	</main>
</div>
