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

<section class="p-6">
	<h1 class="mb-6 text-3xl font-bold">Admin Panel</h1>

	<!-- Placeholder for user management -->
	<div class="bg-white p-6 rounded shadow-md">
		<p class="text-gray-600">User management tools will go here...</p>
	</div>
</section>

