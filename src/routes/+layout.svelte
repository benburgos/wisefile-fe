<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { getAllRecords, initializeLocalStorage } from '$lib/localStorage';
	import { seedData } from '$lib/data/seedData';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = null;
	let userRole = null;
	let unsubscribe;
	let appData = null;

	onMount(() => {
		unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, user }) => {
			isAuthenticated = authStatus;
			userRole = user ? user.role : null;
		});

		// Initialize Local Storage if Needed
		initializeLocalStorage(seedData);

		// Load Users from Local Storage
		let existingUsers = getAllRecords('users');
		if (!existingUsers || existingUsers.length === 0) {
			console.log('No stored users found, re-initializing seed data...');
			initializeLocalStorage(seedData);
			appData = seedData;
		} else {
			console.log('Existing users found in localStorage:', existingUsers);
			appData = { users: existingUsers };
		}
	});

	// Redirect if user is not authenticated (Check if `page.url` exists first)
	$: if (
		isAuthenticated !== null &&
		typeof window !== 'undefined' &&
		page?.url?.pathname && // Ensure `page.url` exists before accessing `.pathname`
		!isAuthenticated &&
		page.url.pathname !== '/'
	) {
		setTimeout(() => {
			goto('/');
		}, 500);
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
