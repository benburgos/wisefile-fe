<script>
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	// Fake Cases Data
	let files = [
		{
			id: 'f1a2b3c4-d5e6-7890-a1b2-c3d4e5f67890',
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
			id: 'm3n4o5p6-q7r8-9012-c3d4-e5f678901234',
			fileName: 'ABC123-002',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '789 Oak St',
			tenant: 'David Green',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Tom Martinez',
			clientId: 'ABC123'
		},
		{
			id: 'p6q7r8s9-t0u1-2345-d4e5-f67890123456',
			fileName: 'XYZ789-001',
			fileType: 'Case',
			status: 'Open',
			subStatus: 'Filed with Court',
			address: '987 Pine St',
			tenant: 'Sarah Johnson',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440005',
			attorneyName: 'James Anderson',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Emily Watson',
			clientId: 'XYZ789'
		},
		{
			id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
			fileName: 'ABC123-003',
			fileType: 'Filing',
			status: 'Pending',
			subStatus: 'Awaiting Landlord Response',
			address: '456 Elm St',
			tenant: 'Emily Davis',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440003',
			assignedTo: 'Rachel Lee',
			clientId: 'ABC123'
		},
		{
			id: 'b2c3d4e5-f6a7-8901-2345-678901bcdefg',
			fileName: 'LMN555-001',
			fileType: 'Case',
			status: 'Open',
			subStatus: 'Hearing Scheduled',
			address: '222 Cedar Ave',
			tenant: 'James Brown',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440006',
			attorneyName: 'Samantha Clark',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440004',
			assignedTo: 'Kyle Thompson',
			clientId: 'LMN555'
		}
	];

	let filteredFiles = [...files];
	let userRole = null;
	let userClientId = null;
	let userAttorneyUUID = null;

	let selectedStatus = 'all';
	let selectedSubStatus = 'all';
	let selectedAttorney = 'all';
	let selectedAssignee = 'all';
	let searchQuery = '';

	// Subscribe to auth store & trigger filtering when it updates
	auth.subscribe(({ role, uuid, clientId }) => {
		userRole = role;
		userClientId = clientId || null;
		userAttorneyUUID = uuid || null;

		filterFiles();
	});

	// Filtering logic
	function filterFiles() {
		filteredFiles = files.filter((file) => {
			// Dropdown filters
			const statusMatch = selectedStatus === 'all' || file.status.toLowerCase() === selectedStatus;
			const subStatusMatch =
				selectedSubStatus === 'all' || file.subStatus.toLowerCase() === selectedSubStatus;
			const attorneyMatch = selectedAttorney === 'all' || file.attorney_uuid === selectedAttorney;
			const assigneeMatch = selectedAssignee === 'all' || file.ops_uuid === selectedAssignee;

			// Search filter (Matches file number, address, or tenant)
			const searchMatch =
				searchQuery === '' ||
				file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				file.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
				file.tenant.toLowerCase().includes(searchQuery.toLowerCase());

			return statusMatch && subStatusMatch && attorneyMatch && assigneeMatch && searchMatch;
		});
	}

	// Ensure filtering runs when the page loads
	onMount(() => {
		filterFiles();
	});
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
						<td class="p-3 text-blue-500 underline">{file.fileName}</td>
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
	</div>
</section>
