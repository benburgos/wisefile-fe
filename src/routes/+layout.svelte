<script>
	import '../app.css'; // Import your global CSS
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	let isAuthenticated;

	// Subscribe to auth store
	let unsubscribe = auth.subscribe(({ isAuthenticated: authStatus }) => {
		isAuthenticated = authStatus;
	});

	// Ensure redirect only happens on client side
	$: if (typeof window !== 'undefined' && isAuthenticated === false && $page.url.pathname !== '/') {
		goto('/');
	}

	// Cleanup subscription
	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="flex">
	{#if isAuthenticated}
		<aside class="h-screen w-64 bg-gray-800 text-white">
			<!-- Side Navigation -->
			<nav class="p-4">
				<ul>
					<li><a href="/dashboard">Dashboard</a></li>
					<li><a href="/cases">Cases</a></li>
					<li><a href="/documents">Documents</a></li>
					<li><a href="/messaging">Messaging</a></li>
					<li><a href="/analytics">Analytics</a></li>
					<li><a href="/admin">Admin Panel</a></li>
				</ul>
			</nav>
		</aside>
	{/if}
	<main class="flex-1 p-4">
		<slot />
	</main>
</div>
