<script>
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let files = [
		{
			id: 1001,
			clientId: 'ABC123',
			fileType: 'Filing',
			status: 'Open',
			subStatus: 'Awaiting Payment',
			address: '123 Main St',
			tenant: 'John Doe',
			attorney: 'Jane Smith',
			assignedTo: 'Michael Johnson'
		},
		{
			id: 1002,
			clientId: 'XYZ789',
			fileType: 'Case',
			status: 'Pending',
			subStatus: 'Court Filing Submitted',
			address: '456 Elm St',
			tenant: 'Emily White',
			attorney: 'Robert Brown',
			assignedTo: 'Sarah Davis'
		},
		{
			id: 1003,
			clientId: 'ABC123',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '789 Oak St',
			tenant: 'David Green',
			attorney: 'Lisa Wilson',
			assignedTo: 'Tom Martinez'
		}
	];

	let filteredFiles = [...files]; // Default to showing all cases
	let selectedFileType = 'all';
	let selectedStatus = 'all';
	let selectedSubStatus = 'all';
	let selectedAttorney = 'all';
	let selectedAssignee = 'all';
	let searchQuery = '';

	let userRole = null;
	let userClientId = null;
	let userAttorneyName = null;

	// Subscribe to auth store
	auth.subscribe(({ role, user }) => {
		userRole = role;
		userClientId = user?.clientId || null; // Only relevant for Client users
		userAttorneyName = user?.name || null; // Used for attorney filtering
	});

	// Function to filter files based on multiple criteria, including role-based restrictions
	function filterFiles() {
		filteredFiles = files.filter((file) => {
			// Role-Based Visibility:
			if (userRole === 'client' && file.clientId !== userClientId) return false; // Client restriction
			if (userRole === 'lawyer' && file.attorney !== userAttorneyName) return false; // Attorney restriction

			// Standard Filters:
			const fileTypeMatch =
				selectedFileType === 'all' || file.fileType.toLowerCase() === selectedFileType;
			const statusMatch = selectedStatus === 'all' || file.status.toLowerCase() === selectedStatus;
			const subStatusMatch =
				selectedSubStatus === 'all' || file.subStatus.toLowerCase() === selectedSubStatus;
			const attorneyMatch = selectedAttorney === 'all' || file.attorney === selectedAttorney;
			const assigneeMatch = selectedAssignee === 'all' || file.assignedTo === selectedAssignee;
			const searchMatch =
				searchQuery === '' ||
				file.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
				file.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
				file.id.toString().includes(searchQuery.toLowerCase());

			return (
				fileTypeMatch &&
				statusMatch &&
				subStatusMatch &&
				attorneyMatch &&
				assigneeMatch &&
				searchMatch
			);
		});
	}

	let showNewCaseModal = false;
</script>

<section class="p-6">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>

		<!-- New Filing or Case Button (Visible only to Ops & Admins) -->
		{#if userRole === 'admin' || userRole === 'ops'}
			<button
				on:click={() => (showNewCaseModal = true)}
				class="rounded bg-blue-500 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-600"
			>
				New Filing or Case
			</button>
		{/if}
	</div>

	<!-- Filter Bar -->
	<div class="mb-4 grid grid-cols-6 gap-4">
		<!-- File Type Filter -->
		<div>
			<label for="file-type-filter" class="text-lg font-semibold">File Type:</label>
			<select
				id="file-type-filter"
				bind:value={selectedFileType}
				on:change={filterFiles}
				class="w-full rounded border px-3 py-2 text-black"
			>
				<option value="all">All</option>
				<option value="filing">Filing</option>
				<option value="case">Case</option>
			</select>
		</div>

		<!-- Status Filter -->
		<div>
			<label for="status-filter" class="text-lg font-semibold">Status:</label>
			<select
				id="status-filter"
				bind:value={selectedStatus}
				on:change={filterFiles}
				class="w-full rounded border px-3 py-2 text-black"
			>
				<option value="all">All</option>
				<option value="open">Open</option>
				<option value="pending">Pending</option>
				<option value="closed">Closed</option>
			</select>
		</div>

		<!-- Search Filter -->
		<div>
			<label for="search-filter" class="text-lg font-semibold">Search:</label>
			<input
				type="text"
				id="search-filter"
				bind:value={searchQuery}
				on:input={filterFiles}
				placeholder="Search by file number, address, tenant..."
				class="w-full rounded border px-3 py-2 text-black"
			/>
		</div>
	</div>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">File #</th>
					<th class="p-3 text-left">File Type</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Sub-Status</th>
					<th class="p-3 text-left">Address</th>
					<th class="p-3 text-left">Tenant</th>
					<th class="p-3 text-left">Attorney</th>
					<th class="p-3 text-left">Assignee</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredFiles as file}
					<tr
						class="cursor-pointer border-t hover:bg-gray-100"
						on:click={() => (window.location.href = `/cases/${file.id}`)}
					>
						<td class="p-3 text-blue-500 underline">{file.id}</td>
						<td class="p-3">{file.fileType}</td>
						<td class="p-3">{file.status}</td>
						<td class="p-3">{file.subStatus}</td>
						<td class="p-3">{file.address}</td>
						<td class="p-3">{file.tenant}</td>
						<td class="p-3">{file.attorney}</td>
						<td class="p-3">{file.assignedTo}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
