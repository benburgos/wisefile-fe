<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Mock Data
	let unreadMessages = 5;
	let openCases = 12;
	let openInvoices = 3;
	let avgResolutionTime = 7;
	let activeAttorneys = 8;
	let closedCases = 24;

	// Dummy Chart Data (Replace with Real Data Later)
	let chartData = [
		{ month: 'Jan', open: 10, closed: 5 },
		{ month: 'Feb', open: 15, closed: 10 },
		{ month: 'Mar', open: 12, closed: 8 },
		{ month: 'Apr', open: 18, closed: 12 },
		{ month: 'May', open: 14, closed: 9 },
		{ month: 'Jun', open: 20, closed: 14 }
	];

	// Support Tickets / Case Insights
	let caseInsights = [
		{ client: 'ABC Properties', issue: 'Pending Payment', status: 'Open' },
		{ client: 'XYZ Realty', issue: 'Court Date Scheduled', status: 'Pending' },
		{ client: 'Smith Rentals', issue: 'Eviction Filed', status: 'Closed' }
	];

	// Recent Transactions / Invoices
	let invoices = [
		{ client: 'ABC Properties', caseNumber: 'ABC123-001', amount: '$450', status: 'Paid' },
		{ client: 'XYZ Realty', caseNumber: 'XYZ789-002', amount: '$700', status: 'Unpaid' },
		{ client: 'Smith Rentals', caseNumber: 'SMITH556-003', amount: '$600', status: 'Paid' }
	];

	// Navigate to Create Filing Page
	function createFiling() {
		goto('/cases/new');
	}
</script>

<section class="p-6">
	<!-- Header Row -->
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<button 
			on:click={createFiling}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white shadow-md hover:bg-[var(--color-primary-hover)] transition"
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
		<div class="rounded-xl bg-green-600 p-4 text-white shadow-md">
			<p class="text-lg font-semibold">Open Cases</p>
			<p class="text-3xl font-bold">{openCases}</p>
		</div>
		<div class="rounded-xl bg-red-600 p-4 text-white shadow-md">
			<p class="text-lg font-semibold">Open Invoices</p>
			<p class="text-3xl font-bold">{openInvoices}</p>
		</div>
	</div>

	<!-- Main Content -->
	<div class="grid gap-6 mt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		<!-- Left Column: Case Insights -->
		<div class="col-span-2 rounded-xl bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-bold">Case Insights</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-lg font-semibold">Avg. Case Resolution Time</p>
					<p class="text-2xl font-bold">{avgResolutionTime} Days</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-lg font-semibold">Active Attorneys</p>
					<p class="text-2xl font-bold">{activeAttorneys}</p>
				</div>
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-lg font-semibold">Cases Closed This Month</p>
					<p class="text-2xl font-bold">{closedCases}</p>
				</div>
			</div>

			<!-- Pending Cases -->
			<h2 class="mb-2 mt-6 text-xl font-bold">Pending Case Actions</h2>
			<div class="overflow-x-auto">
				<table class="w-full rounded-lg border bg-white shadow-md">
					<thead class="bg-gray-200">
						<tr>
							<th class="p-2 text-left">Client</th>
							<th class="p-2 text-left">Issue</th>
							<th class="p-2 text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each caseInsights as file}
							<tr class="border-t">
								<td class="p-2">{file.client}</td>
								<td class="p-2">{file.issue}</td>
								<td class="p-2">
									<span class="rounded-full px-3 py-1 text-sm text-white"
										class:!bg-yellow-500={file.status === 'Pending'}
										class:!bg-red-500={file.status === 'Closed'}
										class:!bg-green-500={file.status === 'Open'}
									>
										{file.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Right Column: Case Trends & Invoices -->
		<div class="col-span-1">
			<!-- Case Trends -->
			<div class="rounded-xl bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-bold">Case Trends</h2>
				<svg viewBox="0 0 300 150" class="w-full">
					<polyline
						fill="none"
						stroke="var(--color-primary)"
						stroke-width="3"
						points="10,120 60,80 110,90 160,60 210,70 260,30"
					/>
				</svg>
			</div>

			<!-- Recent Invoices -->
			<div class="mt-6 rounded-xl bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-bold">Recent Invoices</h2>
				<div class="overflow-x-auto">
					<table class="w-full rounded-lg border bg-white shadow-md">
						<thead class="bg-gray-200">
							<tr>
								<th class="p-2 text-left">Client</th>
								<th class="p-2 text-left">Case #</th>
								<th class="p-2 text-left">Amount</th>
								<th class="p-2 text-left">Status</th>
							</tr>
						</thead>
						<tbody>
							{#each invoices as invoice}
								<tr class="border-t">
									<td class="p-2">{invoice.client}</td>
									<td class="p-2">{invoice.caseNumber}</td>
									<td class="p-2">{invoice.amount}</td>
									<td class="p-2">
										<span class="rounded-full px-3 py-1 text-sm text-white"
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
	</div>
</section>
