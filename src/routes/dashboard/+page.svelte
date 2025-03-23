<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { getAllRecords } from '$lib/localStorage';
	import { goto } from '$app/navigation';

	let user = null;
	let userRole = null;

	let openCases = [];
	let openInvoices = [];
	let unreadMessages = [];

	// Summary counts
	let metrics = {
		openCases: 0,
		openInvoices: 0,
		unreadMessages: 0
	};

	// Subscribe to user
	const unsubscribe = auth.subscribe((value) => {
		user = value?.user;
		userRole = user?.role;
	});

	onMount(() => {
		if (!user) return;

		// Filtered by role internally
		const cases = getAllRecords('caseRecords', user);
		const invoices = getAllRecords('invoices', user);
		const messages = getAllRecords('messages', user);

		// Filter open cases
		openCases = cases
			.filter((c) => !c.is_deleted && c.status !== 'Dismissed' && c.status !== 'Dismissed – Paid')
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
			.slice(0, 5);

		// Filter open invoices
		openInvoices = invoices
			.filter((inv) => !inv.is_deleted && inv.status !== 'paid')
			.sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
			.slice(0, 5);

		// Filter unread messages
		unreadMessages = messages
			.filter((msg) => !msg.is_deleted && !msg.is_read && msg.visible_to_users)
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
			.slice(0, 5);

		metrics.openCases = openCases.length;
		metrics.openInvoices = openInvoices.length;
		metrics.unreadMessages = unreadMessages.length;
	});

	function goTo(path) {
		goto(path);
	}
</script>

<h1 class="mb-6 text-3xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!</h1>

<!-- Metric Cards -->
<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	<div
		role="button"
		on:click={() => goTo('/cases')}
		class="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
	>
		<h2 class="text-lg font-semibold">Open Cases</h2>
		<p class="mt-2 text-3xl font-bold">{metrics.openCases}</p>
	</div>
	<div
		role="button"
		on:click={() => goTo('/invoices')}
		class="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
	>
		<h2 class="text-lg font-semibold">Unpaid Invoices</h2>
		<p class="mt-2 text-3xl font-bold">{metrics.openInvoices}</p>
	</div>
	<div
		role="button"
		on:click={() => goTo('/messages')}
		class="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
	>
		<h2 class="text-lg font-semibold">Unread Messages</h2>
		<p class="mt-2 text-3xl font-bold">{metrics.unreadMessages}</p>
	</div>
</div>

<!-- Recent Cases Section -->
<div class="mb-8">
	<h2 class="mb-4 text-xl font-semibold">Recent Cases</h2>
	{#if openCases.length > 0}
		<div class="space-y-3">
			{#each openCases as c}
				<div
					class="cursor-pointer rounded border border-gray-200 bg-white p-4 shadow hover:bg-gray-50"
					on:click={() => goTo(`/cases/${c._id}`)}
				>
					<p class="font-semibold">
						{c.case_number} - {c.status}{c.sub_status ? ` (${c.sub_status})` : ''}
					</p>
					<p class="text-sm text-gray-600">{c.description || 'No description provided'}</p>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500">No recent open cases.</p>
	{/if}
</div>

<!-- Invoices Section -->
<div class="mb-8">
	<h2 class="mb-4 text-xl font-semibold">Outstanding Invoices</h2>
	{#if openInvoices.length > 0}
		<div class="space-y-3">
			{#each openInvoices as invoice}
				<div class="rounded border border-gray-200 bg-white p-4 shadow">
					<p class="font-semibold">{invoice.invoice_number} — ${invoice.amount.toFixed(2)}</p>
					<p class="text-sm text-gray-600">Status: {invoice.status}</p>
					<p class="text-sm text-gray-500">
						Due: {new Date(invoice.due_date).toLocaleDateString()}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500">No unpaid invoices.</p>
	{/if}
</div>

<!-- Messages Section -->
<div>
	<h2 class="mb-4 text-xl font-semibold">Unread Messages</h2>
	{#if unreadMessages.length > 0}
		<div class="space-y-3">
			{#each unreadMessages as msg}
				<div class="rounded border border-gray-200 bg-white p-4 shadow">
					<p class="font-semibold">{msg.content?.slice(0, 60)}...</p>
					<p class="text-sm text-gray-500">
						Sent on {new Date(msg.created_at).toLocaleDateString()}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-sm text-gray-500">No unread messages.</p>
	{/if}
</div>
