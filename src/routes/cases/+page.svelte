<script>
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let files = [
		{
			id: 'e6ad67e2-6f2d-4bfc-bd48-68d8c7f9e3a1',
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
			id: 'f45a86e7-1e5b-4032-b546-22a1e9a1d8b2',
			fileName: 'XYZ789-002',
			fileType: 'Case',
			status: 'Pending',
			subStatus: 'Court Filing Submitted',
			address: '456 Elm St',
			tenant: 'Emily White',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Robert Brown',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Sarah Davis',
			clientId: 'XYZ789'
		},
		{
			id: 'd21a34bc-00c8-4bff-b345-6fae2b20c791',
			fileName: 'ABC123-003',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '789 Oak St',
			tenant: 'David Green',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Lisa Wilson',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Tom Martinez',
			clientId: 'ABC123'
		}
	];

	let filteredFiles = [...files];
	let userRole = null;
	let userClientId = null;
	let userAttorneyUUID = null;

	// Subscribe to auth store
	auth.subscribe(({ role, uuid, clientId }) => {
		userRole = role;
		userClientId = clientId || null; // For Client users
		userAttorneyUUID = uuid || null; // Used for attorney filtering
	});

	// Function to filter cases based on user role and additional filters
	function filterFiles() {
		filteredFiles = files.filter((file) => {
			// Role-Based Visibility:
			if (userRole === 'client' && file.clientId !== userClientId) return false;
			if (userRole === 'lawyer' && file.attorney_uuid !== userAttorneyUUID) return false;

			return true;
		});
	}
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
