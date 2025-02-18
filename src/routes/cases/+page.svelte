<script>
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let files = [
		{
			id: 'abc123-001',
			fileName: 'ABC123-001',
			fileType: 'Filing',
			status: 'Open',
			subStatus: 'Awaiting Payment',
			address: '123 Main St',
			tenant: 'John Doe',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Michael Johnson',
			clientId: 'ABC123'
		},
		{
			id: 'abc123-002',
			fileName: 'ABC123-002',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '456 Elm St',
			tenant: 'David Green',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440003',
			assignedTo: 'Sarah Williams',
			clientId: 'ABC123'
		},
		{
			id: 'abc123-003',
			fileName: 'ABC123-003',
			fileType: 'Case',
			status: 'Pending',
			subStatus: 'Under Review',
			address: '789 Maple St',
			tenant: 'Alice Brown',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440004',
			assignedTo: 'Liam Carter',
			clientId: 'ABC123'
		},
		{
			id: 'xyz789-001',
			fileName: 'XYZ789-001',
			fileType: 'Filing',
			status: 'Open',
			subStatus: 'Awaiting Court Date',
			address: '222 Oak St',
			tenant: 'Olivia Williams',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440005',
			attorneyName: 'Lisa Wilson',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440006',
			assignedTo: 'Emily Watson',
			clientId: 'XYZ789'
		},
		{
			id: 'xyz789-002',
			fileName: 'XYZ789-002',
			fileType: 'Case',
			status: 'Open',
			subStatus: 'Hearing Scheduled',
			address: '555 Pine St',
			tenant: 'Emma Thompson',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440006',
			attorneyName: 'Samantha Clark',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440007',
			assignedTo: 'Kyle Thompson',
			clientId: 'XYZ789'
		}
	];

	let filteredFiles = [...files];
	let userRole = null;
	let userClientId = null;
	let userAttorneyUUID = null;
	let searchQuery = '';

	// Subscribe to auth store
	auth.subscribe(({ role, clientId, uuid }) => {
		userRole = role;
		userClientId = clientId || null;
		userAttorneyUUID = uuid || null;
		filterFiles();
	});

	// Read search query from URL when page loads
	$: searchQuery = page?.url?.search
		? new URLSearchParams(page.url.search).get('search') || ''
		: '';

	function filterFiles() {
		filteredFiles = files.filter((file) => {
			// Role-based filtering
			if (userRole === 'client' && file.clientId !== userClientId) return false;
			if (userRole === 'lawyer' && file.attorney_uuid !== userAttorneyUUID) return false;

			// Search filter - Match anything in the filtered list
			const searchText = searchQuery.toLowerCase();
			const searchMatch =
				searchQuery === '' ||
				Object.values(file).some((value) => String(value).toLowerCase().includes(searchText));

			return searchMatch;
		});
	}

	// Redirect to case detail page with search params
	function openCase(caseId) {
		goto(`/cases/${caseId}?search=${encodeURIComponent(searchQuery)}`);
	}

	function applySearch() {
		// Update URL when searching
		goto(`/cases?search=${encodeURIComponent(searchQuery)}`);
		// Apply filtering
		filterFiles();
	}
</script>

<section class="p-6">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>

		<!-- New Filing or Case Button (Only Clients, Ops, and Admins) -->
		{#if userRole !== 'lawyer'}
			<button
				on:click={() => (showNewCaseModal = true)}
				class="rounded bg-blue-500 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-600"
			>
				New Filing or Case
			</button>
		{/if}
	</div>

	<!-- Search Filter -->
	<div class="mb-4 flex items-center space-x-3">
		<input
			id="search-filter"
			type="text"
			bind:value={searchQuery}
			placeholder="Search cases..."
			class="w-full rounded border px-3 py-2 text-black"
			on:keydown={(e) => {
				if (e.key === 'Enter') applySearch();
			}}
		/>

		<!-- Search Button -->
		<button
			on:click={applySearch}
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>
			Search
		</button>
	</div>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		{#if filteredFiles.length > 0}
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
						<tr class="cursor-pointer border-t hover:bg-gray-100">
							<td class="p-3">
								<a
									href={`/cases/${file.id}?search=${encodeURIComponent(searchQuery)}`}
									class="text-blue-500 underline"
								>
									{file.fileName}
								</a>
							</td>
							<td class="p-3">{file.fileType}</td>
							<td class="p-3">{file.status}</td>
							<td class="p-3">{file.subStatus}</td>
							<td class="p-3">{file.address}</td>
							<td class="p-3">{file.tenant}</td>
							<td class="p-3">{file.attorneyName}</td>
							<td class="p-3">{file.assignedTo}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<!-- Placeholder for No Cases Found -->
			<div class="flex flex-col items-center justify-center p-6 text-gray-500">
				<p class="text-lg font-semibold">No cases found.</p>
				<p class="text-sm">Try adjusting your search or submitting a new case.</p>
			</div>
		{/if}
	</div>
</section>
