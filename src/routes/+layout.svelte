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
		unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, user }) => {
			isAuthenticated = authStatus;
			userRole = user?.role ?? null;
		});
	});

	$: if (
		isAuthenticated !== null &&
		typeof window !== 'undefined' &&
		page?.url?.pathname &&
		!isAuthenticated &&
		page.url.pathname !== '/'
	) {
		setTimeout(() => goto('/'), 500);
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
		<main class="flex-1 p-4">
			<slot />
		</main>
	{/if}
</div>
