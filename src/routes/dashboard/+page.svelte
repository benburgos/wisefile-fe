<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Mock Data
	let unreadMessages = 5;
	let openCases = 12;
	let openInvoices = 3;
	let activeFilings = 18;
	let activeCollections = 8;

	// Recent Activity Log (Last 5 Updates)
	let recentActivity = [
		{
			caseNumber: 'ABC123-001',
			description: 'Status updated to Pending',
			timestamp: '2025-02-21 14:32'
		},
		{ caseNumber: 'XYZ789-002', description: 'Payment received', timestamp: '2025-02-21 12:45' },
		{
			caseNumber: 'SMITH556-003',
			description: 'Court date scheduled',
			timestamp: '2025-02-21 11:30'
		},
		{
			caseNumber: 'ABC123-004',
			description: 'Filed new eviction request',
			timestamp: '2025-02-21 10:10'
		},
		{ caseNumber: 'XYZ789-005', description: 'Attorney assigned', timestamp: '2025-02-21 09:50' }
	];

	// Recent Invoices
	let invoices = [
		{ caseNumber: 'ABC123-001', amount: '$450', status: 'Paid' },
		{ caseNumber: 'XYZ789-002', amount: '$700', status: 'Unpaid' },
		{ caseNumber: 'SMITH556-003', amount: '$600', status: 'Paid' },
		{ caseNumber: 'ABC123-004', amount: '$525', status: 'Unpaid' },
		{ caseNumber: 'XYZ789-005', amount: '$800', status: 'Paid' }
	];

	// Navigate to Create Filing Page
	function createFiling() {
		goto('/cases/new');
	}
</script>

<section class="p-4 sm:p-6">
	<!-- Header Row -->
	<div class="mb-4 flex items-center justify-between sm:mb-6">
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<button
			on:click={createFiling}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md transition hover:bg-opacity-90"
		>
			New Filing or Collection
		</button>
	</div>

	<!-- Top Metrics -->
	<div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-xl bg-[var(--color-primary)] p-4 text-white shadow-md">
			<p class="text-lg font-semibold">Unread Messages</p>
			<p class="text-3xl font-bold">{unreadMessages}</p>
		</div>
		<div class="rounded-xl bg-[var(--color-primary)] p-4 text-white shadow-md">
			<p class="text-lg font-semibold">Open Cases</p>
			<p class="text-3xl font-bold">{openCases}</p>
		</div>
		<div class="rounded-xl bg-[var(--color-primary)] p-4 text-white shadow-md">
			<p class="text-lg font-semibold">Open Invoices</p>
			<p class="text-3xl font-bold">{openInvoices}</p>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mt-4 grid gap-6 sm:mt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		<!-- Left Column: Case Insights -->
		<div class="col-span-2 rounded-xl bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-bold">Case Insights</h2>
			<div class="grid grid-cols-2 gap-4">
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-lg font-semibold">Active Filings</p>
					<p class="text-2xl font-bold">{activeFilings}</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-lg font-semibold">Active Collections</p>
					<p class="text-2xl font-bold">{activeCollections}</p>
				</div>
			</div>

			<!-- Recent Activity -->
			<h2 class="mb-2 mt-6 text-xl font-bold">Recent Activity</h2>
			<div class="overflow-x-auto rounded-lg border">
				<table class="w-full bg-white shadow-md">
					<thead class="bg-gray-200">
						<tr>
							<th class="p-2 text-left">Case #</th>
							<th class="p-2 text-left">Description</th>
							<th class="p-2 text-left">Timestamp</th>
						</tr>
					</thead>
					<tbody>
						{#each recentActivity as activity}
							<tr class="border-t">
								<td class="p-2">{activity.caseNumber}</td>
								<td class="p-2">{activity.description}</td>
								<td class="p-2">{activity.timestamp}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Right Column: Recent Invoices (Expanded) -->
		<div class="col-span-1 rounded-xl bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-bold">Recent Invoices</h2>
			<div class="overflow-x-auto rounded-lg border">
				<table class="w-full bg-white shadow-md">
					<thead class="bg-gray-200">
						<tr>
							<th class="p-2 text-left">Case #</th>
							<th class="p-2 text-left">Amount</th>
							<th class="p-2 text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each invoices as invoice}
							<tr class="border-t">
								<td class="p-2">{invoice.caseNumber}</td>
								<td class="p-2">{invoice.amount}</td>
								<td class="p-2">
									<span
										class="rounded-full px-3 py-1 text-sm text-white"
										class:!bg-green-500={invoice.status === 'Paid'}
										class:!bg-red-500={invoice.status === 'Unpaid'}
									>
										{invoice.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>
