<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = false;
	let userRole = null;
	let loading = true; // 🚀 Add loading state

	let unsubscribe = auth.subscribe(({ isAuthenticated: authStatus, role }) => {
		isAuthenticated = authStatus;
		userRole = role;
	});

	// Ensure redirect only happens on client side
	$: if (typeof window !== 'undefined' && isAuthenticated === false && $page.url.pathname !== '/') {
		goto('/');
	}

	// Delay the UI render to avoid flickering
	onMount(() => {
		setTimeout(() => {
			loading = false;
		}, 500); // ⏳ Adjust the delay time (in milliseconds)
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if loading}
	<!-- 🚀 Show a loading indicator -->
	<div class="flex h-screen items-center justify-center bg-gray-100">
		<h2 class="text-2xl font-semibold">Loading...</h2>
	</div>
{:else}
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
{/if}
