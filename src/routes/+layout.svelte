<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = false;
	let userRole = null;

	let unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, role }) => {
		isAuthenticated = authStatus;
		userRole = role;
	});

	// Ensure redirect only happens on client side
	$: if (typeof window !== 'undefined' && isAuthenticated === false && $page.url.pathname !== '/') {
		goto('/');
	}

	onDestroy(() => {
		unsubscribe();
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
