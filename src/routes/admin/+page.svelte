<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let userRole = null;

	// Subscribe to auth store
	$: auth.subscribe(({ role }) => {
		userRole = role;

		// Redirect unauthorized users
		if (userRole !== 'admin') {
			goto('/dashboard');
		}
	});
</script>

<h1>Admin Panel</h1>
<p>Welcome, Admin!</p>
