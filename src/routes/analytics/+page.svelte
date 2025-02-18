<script>
	import { writable } from 'svelte/store';

	// Mock case data
	let caseStats = writable([
		{ status: 'Open Cases', count: 34 },
		{ status: 'Pending Cases', count: 12 },
		{ status: 'Closed Cases', count: 78 },
		{ status: 'Disputed Cases', count: 5 }
	]);

	// Mock revenue data
	let revenueStats = writable([
		{ month: 'January', revenue: 12000 },
		{ month: 'February', revenue: 10500 },
		{ month: 'March', revenue: 13800 }
	]);

	// Mock user engagement
	let userActivity = writable([
		{ metric: 'New Users', value: 34 },
		{ metric: 'Returning Users', value: 21 },
		{ metric: 'Average Session Time', value: '4m 32s' },
		{ metric: 'Messages Sent', value: 128 },
		{ metric: 'Documents Uploaded', value: 56 }
	]);

	// Mock SLA Performance Data
	let slaPerformance = writable([
		{ metric: 'Avg Case Resolution Time', value: '12 days' },
		{ metric: 'Cases Resolved on Time', value: '89%' },
		{ metric: 'Escalations to Management', value: 7 },
		{ metric: 'Avg First Response Time', value: '3h 24m' }
	]);
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Analytics Dashboard</h1>

	<!-- Overview Stats (Grid Layout) -->
	<div class="mb-6 grid grid-cols-4 gap-4">
		{#each $caseStats as stat}
			<div class="rounded bg-blue-100 p-4 shadow-md">
				<h2 class="text-xl font-bold">{stat.count}</h2>
				<p class="text-gray-600">{stat.status}</p>
			</div>
		{/each}
	</div>

	<!-- Revenue Table -->
	<div class="mb-6 rounded bg-white p-4 shadow-md">
		<h2 class="mb-2 text-xl font-bold">Revenue Overview</h2>
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Month</th>
					<th class="p-3 text-left">Revenue</th>
				</tr>
			</thead>
			<tbody>
				{#each $revenueStats as stat}
					<tr class="border-t">
						<td class="p-3">{stat.month}</td>
						<td class="p-3">${stat.revenue.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- User Engagement Data -->
	<div class="mb-6 rounded bg-white p-4 shadow-md">
		<h2 class="mb-2 text-xl font-bold">User Engagement</h2>
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Metric</th>
					<th class="p-3 text-left">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each $userActivity as stat}
					<tr class="border-t">
						<td class="p-3">{stat.metric}</td>
						<td class="p-3">{stat.value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- SLA Performance Data -->
	<div class="rounded bg-white p-4 shadow-md">
		<h2 class="mb-2 text-xl font-bold">SLA Performance</h2>
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Metric</th>
					<th class="p-3 text-left">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each $slaPerformance as stat}
					<tr class="border-t">
						<td class="p-3">{stat.metric}</td>
						<td class="p-3">{stat.value}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
