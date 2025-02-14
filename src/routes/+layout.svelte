<script>
	import '../app.css';
	import SideNav from '$lib/components/Nav/SideNav.svelte';
	export let data;

	console.log('Layout received isAuthenticated:', data?.isAuthenticated); // Debugging
</script>

<div class="flex">
	{#if data?.isAuthenticated}
		<aside class="h-screen w-64 bg-gray-800 text-white">
			<SideNav />
		</aside>
	{/if}
	<main class="flex-1 p-4">
		<slot />
	</main>
</div>
