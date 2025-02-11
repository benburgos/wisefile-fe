<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import RoleSwitcher from '$lib/components/RoleSwitcher.svelte';

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
			<slot name="sidebar" />
			<div class="p-4">
				<RoleSwitcher />
			</div>
		</aside>
	{/if}
	<main class="flex-1 p-4">
		<slot />
	</main>
</div>
