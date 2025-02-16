<script>
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';

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
			fileName: 'DEF456-003',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '789 Oak St',
			tenant: 'David Green',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440004',
			attorneyName: 'Lisa Wilson',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Tom Martinez',
			clientId: 'ABC123'
		},
		{
			id: 'p6q7r8s9-t0u1-2345-d4e5-f67890123456',
			fileName: 'LMN456-004',
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
		}
	];

	let filteredFiles = [...files];
	let userRole = null;
	let userClientId = null;
	let userAttorneyUUID = null;

	auth.subscribe(({ role, uuid, clientId }) => {
		userRole = role;
		userClientId = clientId || null;
		userAttorneyUUID = uuid || null;
	});

	function filterFiles() {
		filteredFiles = files.filter((file) => {
			if (userRole === 'client' && file.clientId !== userClientId) return false;
			if (userRole === 'lawyer' && file.attorney_uuid !== userAttorneyUUID) return false;
			return true;
		});
	}
</script>

<section class="p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>

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
