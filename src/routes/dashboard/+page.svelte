<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { getAllRecords } from '$lib/localStorage';

	let user = null;
	let userRole = null;

	let visibleCases = [];
	let unpaidInvoices = [];
	let unreadMessages = [];
	let activityLog = [];

	let metrics = {
		openCases: 0,
		unpaidInvoices: 0,
		unreadMessages: 0
	};

	let caseRecords = [];
	let invoiceRecords = [];

	auth.subscribe((value) => {
		user = value?.user;
		userRole = user?.role;
	});

	onMount(() => {
		if (!user) return;

		caseRecords = getAllRecords('caseRecords', user);
		invoiceRecords = getAllRecords('invoices', user);
		const messages = getAllRecords('messages', user);
		const activity = getAllRecords('activityLogs', user);

		// Filter visible cases
		visibleCases = caseRecords.filter(
			(c) => !c.is_deleted && c.status !== 'Dismissed' && c.status !== 'Dismissed – Paid'
		);
		metrics.openCases = visibleCases.length;

		// Filter unread messages
		unreadMessages = messages.filter(
			(m) =>
				!m.is_deleted &&
				m.visible_to_users &&
				m.recipient_ids?.includes(user.id) &&
				!m.read_by?.includes(user.id)
		);
		metrics.unreadMessages = unreadMessages.length;

		// Filter unpaid invoices
		if (userRole !== 'attorney') {
			let invoiceCaseIds = [];
			if (userRole === 'operations') {
				const assignedCases = caseRecords.filter((c) => c.assigned_operator === user.id);
				invoiceCaseIds = assignedCases.map((c) => c._id);
				unpaidInvoices = invoiceRecords.filter(
					(i) => !i.is_deleted && i.status !== 'paid' && invoiceCaseIds.includes(i.case_id)
				);
			} else if (userRole === 'client') {
				unpaidInvoices = invoiceRecords.filter(
					(i) => !i.is_deleted && i.status !== 'paid' && i.client_id === user.clientId
				);
			} else {
				unpaidInvoices = invoiceRecords.filter((i) => !i.is_deleted && i.status !== 'paid');
			}
			metrics.unpaidInvoices = unpaidInvoices.length;
		}

		// Filter activity log
		activityLog = activity
			.filter((a) => {
				if (a.is_deleted) return false;

				if (userRole === 'admin') return true;

				if (a.entity_type !== 'caseRecord') return false;

				const caseMatch = caseRecords.find((c) => c._id === a.entity_id);
				if (!caseMatch) return false;

				if (userRole === 'attorney') return caseMatch.assigned_attorney === user.id;
				if (userRole === 'client') return caseMatch.client_id === user.clientId;
				if (userRole === 'operations') return caseMatch.assigned_operator === user.id;

				return false;
			})
			.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
			.slice(0, 20)
			.map((a) => {
				let entityLabel = '';
				if (a.entity_type === 'caseRecord') {
					const match = caseRecords.find((c) => c._id === a.entity_id);
					entityLabel = match?.case_number || 'Case';
				} else if (a.entity_type === 'invoice') {
					const match = invoiceRecords.find((i) => i._id === a.entity_id);
					entityLabel = match?.invoice_number || 'Invoice';
				} else {
					entityLabel = a.entity_type;
				}
				return { ...a, entity_label: entityLabel };
			});
	});

	function goTo(path) {
		goto(path);
	}
</script>

<h1 class="mb-6 text-3xl font-bold">
	Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
</h1>

<!-- Metrics Row -->
<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow">
		<h2 class="text-lg font-semibold">Open Cases</h2>
		{#if metrics.openCases > 0}
			<button
				type="button"
				tabindex="0"
				on:click={() => goTo('/cases')}
				class="mt-2 text-3xl font-bold text-black hover:text-blue-600 focus:outline-none"
			>
				{metrics.openCases}
			</button>
		{:else}
			<p class="mt-2 text-3xl font-bold">{metrics.openCases}</p>
		{/if}
	</div>

	{#if userRole !== 'attorney'}
		<div class="rounded-lg border border-gray-200 bg-white p-6 shadow">
			<h2 class="text-lg font-semibold">Unpaid Invoices</h2>
			{#if metrics.unpaidInvoices > 0}
				<button
					type="button"
					tabindex="0"
					on:click={() => goTo('/invoices')}
					class="mt-2 text-3xl font-bold text-black hover:text-blue-600 focus:outline-none"
				>
					{metrics.unpaidInvoices}
				</button>
			{:else}
				<p class="mt-2 text-3xl font-bold">{metrics.unpaidInvoices}</p>
			{/if}
		</div>
	{/if}

	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow">
		<h2 class="text-lg font-semibold">Unread Messages</h2>
		{#if metrics.unreadMessages > 0}
			<button
				type="button"
				tabindex="0"
				on:click={() => goTo('/messages')}
				class="mt-2 text-3xl font-bold text-black hover:text-blue-600 focus:outline-none"
			>
				{metrics.unreadMessages}
			</button>
		{:else}
			<p class="mt-2 text-3xl font-bold">{metrics.unreadMessages}</p>
		{/if}
	</div>
</div>

<!-- Activity Log Table -->
<div>
	<h2 class="mb-2 text-xl font-semibold">Activity</h2>
	<div class="max-h-[calc(100vh-300px)] overflow-auto rounded-lg border shadow">
		<table class="min-w-full table-auto">
			<thead class="sticky top-0 border-b bg-white">
				<tr>
					<th class="px-4 py-2 text-left">Action</th>
					<th class="px-4 py-2 text-left">Entity</th>
					<th class="px-4 py-2 text-left">Description</th>
					<th class="px-4 py-2 text-left">Date</th>
				</tr>
			</thead>
			<tbody>
				{#each activityLog as a}
					<tr class="odd:bg-gray-50">
						<td class="px-4 py-2 capitalize">{a.action_type}</td>
						<td class="px-4 py-2">{a.entity_label}</td>
						<td class="px-4 py-2">{a.description}</td>
						<td class="px-4 py-2">{new Date(a.created_at).toLocaleDateString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
