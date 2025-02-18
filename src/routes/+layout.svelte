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

<div class="flex h-screen">
	{#if isAuthenticated}
		<aside class="h-screen w-64 bg-gray-800 text-white fixed top-0 left-0 flex flex-col">
			<SideNav />
		</aside>
		<main class="flex-1 p-6 ml-64 overflow-auto">
			<slot />
		</main>
	{:else}
		<!-- Ensure login content still renders -->
		<main class="flex-1 p-4">
			<slot />
		</main>
	{/if}
</div>
