<script>
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import UserManagement from '$lib/components/Admin/UserManagement.svelte';
    import ClientManagement from '$lib/components/Admin/ClientManagement.svelte';

    let tabSet = 0; // Active tab
</script>

<section class="p-6">
	<h1 class="text-3xl font-bold mb-6">Admin Panel</h1>
	
    <!-- Tab Navigation -->
    <TabGroup>
        <Tab bind:group={tabSet} name="users" value={0}>
            <span>User Management</span>
        </Tab>
        <Tab bind:group={tabSet} name="clients" value={1}>
            <span>Client Management</span>
        </Tab>

        <!-- Tab Content -->
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <UserManagement />
            {:else if tabSet === 1}
                <ClientManagement />
            {/if}
        </svelte:fragment>
    </TabGroup>
</section>
