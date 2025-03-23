<script>
	import { auth } from '$lib/stores/auth';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let userRole = null;
	let unsubscribe;

	unsubscribe = auth.subscribe(({ user }) => {
		userRole = user?.role ?? null;
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	function nav(path) {
		goto(path);
	}
</script>

<nav class="space-y-4 p-4">
	<ul class="space-y-2">
		<li><a on:click={() => nav('/dashboard')}>Dashboard</a></li>
		<li><a on:click={() => nav('/cases')}>Cases</a></li>

		{#if userRole !== 'attorney' && userRole !== 'client'}
			<li><a on:click={() => nav('/invoices')}>Invoices</a></li>
			<li><a on:click={() => nav('/messages')}>Messages</a></li>
			<li><a on:click={() => nav('/documents')}>Documents</a></li>
			<li><a on:click={() => nav('/activity')}>Activity Log</a></li>
		{:else if userRole === 'client'}
			<li><a on:click={() => nav('/messages')}>Messages</a></li>
			<li><a on:click={() => nav('/invoices')}>Invoices</a></li>
		{:else if userRole === 'attorney'}
			<li><a on:click={() => nav('/messages')}>Messages</a></li>
		{/if}
	</ul>
</nav>
