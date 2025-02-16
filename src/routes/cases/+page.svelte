<script>
	import { onMount } from 'svelte';

	let cases = [
		{ id: 1, name: 'Case #12345', status: 'Open', assignedTo: 'John Doe' },
		{ id: 2, name: 'Case #12346', status: 'Pending', assignedTo: 'Jane Smith' },
		{ id: 3, name: 'Case #12347', status: 'Closed', assignedTo: 'Mark Johnson' }
	];

	let filteredCases = [...cases]; // Default to showing all cases
	let selectedStatus = 'all';

	// Function to filter cases based on status
	function filterCases() {
		if (selectedStatus === 'all') {
			filteredCases = [...cases];
		} else {
			filteredCases = cases.filter((c) => c.status.toLowerCase() === selectedStatus);
		}
	}

	let showNewCaseModal = false;
</script>

<section class="p-6">
	<!-- Header Section -->
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-3xl font-bold">Cases</h1>

		<!-- New Case Button -->
		<button 
			on:click={() => showNewCaseModal = true} 
			class="rounded bg-blue-500 px-6 py-3 text-white font-bold shadow-md hover:bg-blue-600">
			New Case
		</button>
	</div>

	<!-- Filter Dropdown -->
	<div class="mb-4">
		<label for="status-filter" class="text-lg font-semibold">Filter by Status:</label>
		<select id="status-filter" bind:value={selectedStatus} on:change={filterCases}
			class="ml-2 rounded border px-3 py-2 text-black">
			<option value="all">All</option>
			<option value="open">Open</option>
			<option value="pending">Pending</option>
			<option value="closed">Closed</option>
		</select>
	</div>

	<!-- Cases Table -->
	<div class="overflow-x-auto bg-white shadow-md rounded">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Case Name</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Assigned To</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredCases as file}
					<tr class="border-t hover:bg-gray-100 cursor-pointer">
						<td class="p-3">{file.name}</td>
						<td class="p-3">{file.status}</td>
						<td class="p-3">{file.assignedTo}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- New Case Modal -->
	{#if showNewCaseModal}
		<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
			<div class="rounded bg-white p-6 shadow-lg w-96">
				<h2 class="mb-4 text-xl font-bold">Create New Case</h2>
				<p>Case creation form will go here...</p>
				<button on:click={() => showNewCaseModal = false} class="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
					Close
				</button>
			</div>
		</div>
	{/if}
</section>
