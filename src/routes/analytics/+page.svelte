<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { auth } from '$lib/stores/auth';

	// Mock Data
	let records = writable([
		{
			caseNumber: 'ABC123-001',
			fileType: 'Filing',
			address: '123 Main St',
			state: 'AZ',
			client: 'ABC Properties',
			revenue: 450,
			month: 'Jan'
		},
		{
			caseNumber: 'XYZ789-002',
			fileType: 'Collection',
			address: '456 Elm St',
			state: 'CO',
			client: 'XYZ Realty',
			revenue: 700,
			month: 'Feb'
		},
		{
			caseNumber: 'SMITH556-003',
			fileType: 'Filing',
			address: '789 Maple St',
			state: 'TX',
			client: 'Smith Rentals',
			revenue: 600,
			month: 'Jan'
		},
		{
			caseNumber: 'DEF112-004',
			fileType: 'Collection',
			address: '222 Oak St',
			state: 'AZ',
			client: 'DEF Holdings',
			revenue: 350,
			month: 'Mar'
		},
		{
			caseNumber: 'JKL890-005',
			fileType: 'Filing',
			address: '777 Pine St',
			state: 'CO',
			client: 'JKL Group',
			revenue: 900,
			month: 'Feb'
		},
		{
			caseNumber: 'MNO555-006',
			fileType: 'Collection',
			address: '999 Birch St',
			state: 'TX',
			client: 'MNO Investments',
			revenue: 500,
			month: 'Mar'
		},
		{
			caseNumber: 'ABC123-001',
			fileType: 'Filing',
			address: '123 Main St',
			state: 'AZ',
			client: 'ABC Properties',
			revenue: 450,
			month: 'Jan'
		},
		{
			caseNumber: 'XYZ789-002',
			fileType: 'Collection',
			address: '456 Elm St',
			state: 'CO',
			client: 'XYZ Realty',
			revenue: 700,
			month: 'Feb'
		},
		{
			caseNumber: 'SMITH556-003',
			fileType: 'Filing',
			address: '789 Maple St',
			state: 'TX',
			client: 'Smith Rentals',
			revenue: 600,
			month: 'Jan'
		},
		{
			caseNumber: 'DEF112-004',
			fileType: 'Collection',
			address: '222 Oak St',
			state: 'AZ',
			client: 'DEF Holdings',
			revenue: 350,
			month: 'Mar'
		},
		{
			caseNumber: 'JKL890-005',
			fileType: 'Filing',
			address: '777 Pine St',
			state: 'CO',
			client: 'JKL Group',
			revenue: 900,
			month: 'Feb'
		},
		{
			caseNumber: 'MNO555-006',
			fileType: 'Collection',
			address: '999 Birch St',
			state: 'TX',
			client: 'MNO Investments',
			revenue: 500,
			month: 'Mar'
		}
	]);

	let metrics = writable([
		{ title: 'Open Cases', value: 35 },
		{ title: 'Closed Cases', value: 78 },
		{ title: 'Dismissed Cases', value: 15 },
		{ title: 'Appealed Cases', value: 5 }
	]);

	let selectedMonth = '';
	let selectedState = '';
	let selectedType = '';
	let userRole = null;
	let totalAmount = 0;

	auth.subscribe(({ role }) => {
		userRole = role || null;
	});

	// Extract unique values for dropdown filters
	let uniqueMonths = [];
	let uniqueStates = [];
	let uniqueTypes = [];

	onMount(() => {
		records.update((data) => {
			uniqueMonths = [...new Set(data.map((item) => item.month))].sort();
			uniqueStates = [...new Set(data.map((item) => item.state))].sort();
			uniqueTypes = [...new Set(data.map((item) => item.fileType))].sort();
			return data;
		});
	});

	// Compute filtered records
	$: filteredRecords = $records.filter(
		(record) =>
			(selectedMonth === '' || record.month === selectedMonth) &&
			(selectedState === '' || record.state === selectedState) &&
			(selectedType === '' || record.fileType === selectedType)
	);

	// Compute total revenue/expense
	$: totalAmount = filteredRecords.reduce((sum, record) => sum + record.revenue, 0);
</script>

<section class="p-4 sm:p-6">
	<!-- General Metrics -->
	<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each $metrics as metric}
			<div class="rounded-lg bg-[var(--color-primary)] p-4 text-white shadow-md">
				<p class="text-lg font-semibold">{metric.title}</p>
				<p class="text-3xl font-bold">{metric.value}</p>
			</div>
		{/each}
	</div>

	<!-- Header & Filters (Flexbox) -->
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Revenue by File</h1>

		<!-- Filters -->
		<div class="flex flex-wrap gap-4">
			<select bind:value={selectedMonth} class="w-auto min-w-[140px] rounded border px-3 py-2">
				<option value="">All Months</option>
				{#each uniqueMonths as month}
					<option value={month}>{month}</option>
				{/each}
			</select>

			<select bind:value={selectedState} class="w-auto min-w-[140px] rounded border px-3 py-2">
				<option value="">All States</option>
				{#each uniqueStates as state}
					<option value={state}>{state}</option>
				{/each}
			</select>

			<select bind:value={selectedType} class="w-auto min-w-[140px] rounded border px-3 py-2">
				<option value="">All Types</option>
				{#each uniqueTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>

			<!-- Export Button -->
			<button class="rounded bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700">
				Export
			</button>
		</div>
	</div>

	<!-- Table -->
	<div class="mt-4 overflow-hidden rounded-lg border shadow-lg">
		<!-- Table Header (Fixed) -->
		<table class="w-full bg-gray-200">
			<thead class="sticky top-0 bg-gray-200 text-left">
				<tr>
					<th class="w-[15%] p-3">Case #</th>
					<th class="w-[12%] p-2">File Type</th>
					<th class="w-[20%] p-2">Address</th>
					<th class="w-[10%] p-1">State</th>
					<th class="w-[23%] p-0">Client</th>
					<th class="w-[10%] p-0">{userRole === 'admin' ? 'Revenue' : 'Expense'}</th>
					<th class="w-[10%] p-0">Month</th>
				</tr>
			</thead>
		</table>

		<!-- Scrollable Table Body -->
		<div class="max-h-[50vh] overflow-auto">
			<table class="w-full bg-white">
				<tbody>
					{#each filteredRecords as record}
						<tr class="border-t">
							<td class="w-[15%] p-3">{record.caseNumber}</td>
							<td class="w-[12%] p-3">{record.fileType}</td>
							<td class="w-[20%] whitespace-nowrap p-3">{record.address}</td>
							<td class="w-[10%] p-3">{record.state}</td>
							<td class="w-[23%] p-3">{record.client}</td>
							<td class="w-[10%] p-3">${record.revenue}</td>
							<td class="w-[10%] p-3">{record.month}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Table Footer (Fixed) -->
		<table class="w-full bg-gray-200">
			<tfoot>
				<tr>
					<td colspan="7" class="p-3 text-center font-bold">
						Total {userRole === 'admin' ? 'Revenue' : 'Expenses'}: ${totalAmount}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>
</section>
