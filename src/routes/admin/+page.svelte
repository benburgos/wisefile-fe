<script>
	import { Tabs, Tab } from '@skeletonlabs/skeleton';
	import UserManagement from '$lib/components/Admin/UserManagement.svelte';
	import ClientManagement from '$lib/components/Admin/ClientManagement.svelte';

	// Active Tab
	let activeTab = 'users';
</script>

<section class="p-6">
	<h1 class="mb-6 text-3xl font-bold">Admin Panel</h1>

	<!-- Skeleton UI Tabs -->
	<Tabs bind:activeTab>
		<Tab name="users" label="User Management" />
		<Tab name="clients" label="Client Management" />
	</Tabs>

	<!-- Render Tab Content -->
	{#if activeTab === 'users'}
		<UserManagement />
	{:else}
		<ClientManagement />
	{/if}
</section>
