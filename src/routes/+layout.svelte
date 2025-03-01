<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { getStoredData, saveToLocalStorage } from '$lib/utils/storage';
	import seedData from '$lib/seed.js';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = null;
	let userRole = null;
	let unsubscribe;
	let appData = getStoredData();

	onMount(() => {
		unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, role }) => {
			isAuthenticated = authStatus;
			userRole = role;
		});
		const existingData = getStoredData();
		if (!existingData) {
			saveToLocalStorage(seedData);
			console.log('Seed data loaded into localStorage');
		}
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
		<aside class="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-800 text-white">
			<SideNav />
		</aside>
		<main class="ml-64 flex-1 overflow-auto p-6">
			<slot />
		</main>
	{:else}
		<!-- Ensure login content still renders -->
		<main class="flex-1 p-4">
			<slot />
		</main>
	{/if}
</div>
