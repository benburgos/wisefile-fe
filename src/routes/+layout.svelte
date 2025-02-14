<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = null;
	let userRole = null;
	let unsubscribe;

	onMount(() => {
		unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, role }) => {
			isAuthenticated = authStatus;
			userRole = role;
		});
	});

	// Delay before redirecting to avoid flicker
	$: if (
		isAuthenticated !== null &&
		typeof window !== 'undefined' &&
		!isAuthenticated &&
		$page.url.pathname !== '/'
	) {
		setTimeout(() => {
			goto('/');
		}, 500); // Adjust delay time as needed
	}

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<div class="flex">
	{#if isAuthenticated}
		<aside class="h-screen w-64 bg-gray-800 text-white">
			<SideNav />
		</aside>
	{/if}
	<main class="flex-1 p-4">
		<slot />
	</main>
</div>
