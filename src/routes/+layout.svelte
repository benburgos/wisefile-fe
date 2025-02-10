<script>
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import '../app.css';

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

<slot />
