<script>
	import '../app.css';
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import SideNav from '$lib/components/Nav/SideNav.svelte';

	let isAuthenticated = false;
	let userRole = null;
	let loading = true;

	let unsubscribe = auth.subscribe((authState) => {
		// Ensure authState exists before accessing properties
		if (authState && typeof authState === 'object') {
			isAuthenticated = authState.isAuthenticated ?? false;
			userRole = authState.role ?? null;
		} else {
			isAuthenticated = false;
			userRole = null;
		}
		loading = false;
	});

	// Redirect only after the auth state is determined
	$: if (
		!loading &&
		typeof window !== 'undefined' &&
		!isAuthenticated &&
		$page.url.pathname !== '/'
	) {
		goto('/');
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

{#if loading}
	<!-- Show a loading screen while auth state is being determined -->
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
