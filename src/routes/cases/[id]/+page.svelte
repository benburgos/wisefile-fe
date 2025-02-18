<script>
	import { auth } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let caseId = page.params.id;
	let userRole = null;
	let userClientId = null;
	let userAttorneyUUID = null;
	let unauthorized = false;
	let showEditModal = false;

	// Example Case Data (Replace with API fetch later)
	let caseDetails = {
		id: caseId,
		fileName: caseId.toUpperCase(),
		fileType: caseId.includes('Filing') ? 'Filing' : 'Case',
		status: 'Open',
		subStatus: 'Awaiting Payment',
		address: '123 Main St',
		tenant: 'John Doe',
		attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
		attorneyName: 'Jane Smith',
		ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
		assignedTo: 'Michael Johnson',
		clientId: 'ABC123',
		fees: [
			{ name: 'Filing Fee', amount: 150 },
			{ name: 'Attorney Fee', amount: 500 }
		],
		messages: [
			{ sender: 'Client', text: 'What is the next step?', timestamp: '2025-02-17 10:00 AM' },
			{ sender: 'Ops', text: 'Waiting for payment.', timestamp: '2025-02-17 10:15 AM' }
		],
		documents: [],
		activityLog: [
			{ action: 'Filing Created', timestamp: '2025-02-15 08:30 AM' },
			{ action: 'Attorney Assigned', timestamp: '2025-02-16 09:00 AM' }
		]
	};

	// Subscribe to auth store
	auth.subscribe(({ role, clientId, uuid }) => {
		userRole = role;
		userClientId = clientId || null;
		userAttorneyUUID = uuid || null;

		// Role-based access check
		if (
			(userRole === 'client' && caseDetails.clientId !== userClientId) ||
			(userRole === 'lawyer' && caseDetails.attorney_uuid !== userAttorneyUUID)
		) {
			unauthorized = true;
			setTimeout(() => goto('/cases'), 5000);
		}
	});

	// Function to update status (Ops/Admin)
	function updateStatus(newStatus) {
		caseDetails.status = newStatus;
	}

	// Function to convert Filing to Case (Client, Ops, Admin)
	function convertToCase() {
		caseDetails.fileType = 'Case';
		caseDetails.status = 'Pending';
	}

	// Function to add a fee (Ops/Admin)
	function addFee() {
		caseDetails.fees.push({ name: 'New Fee', amount: 100 });
	}

	// Function to remove a fee (Ops/Admin)
	function removeFee(index) {
		caseDetails.fees.splice(index, 1);
	}

	// Function to add a message (Client, Lawyer)
	function addMessage() {
		caseDetails.messages.push({
			sender: userRole,
			text: 'New message',
			timestamp: new Date().toLocaleString()
		});
	}

	// Function to upload a document (Client, Lawyer)
	function uploadDocument() {
		caseDetails.documents.push({
			name: 'New Document.pdf',
			uploadedBy: userRole,
			timestamp: new Date().toLocaleString()
		});
	}
</script>

{#if unauthorized}
	<section class="flex h-screen flex-col items-center justify-center p-6 text-center">
		<h1 class="text-3xl font-bold text-red-500">Unauthorized Access</h1>
		<p class="text-gray-500">You do not have permission to view this case.</p>
		<p class="text-sm text-gray-400">Redirecting back to cases...</p>
	</section>
{:else}
	<section class="p-6">
		<!-- Breadcrumb -->
		<nav class="mb-4 text-gray-500">
			<a href="/dashboard" class="hover:underline">Dashboard</a> /
			<a href="/cases" class="hover:underline">Cases</a> /
			<span class="font-semibold text-black">{caseDetails.fileName}</span>
		</nav>

		<!-- Case Title & Actions -->
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-3xl font-bold">{caseDetails.fileName}</h1>
			{#if userRole !== 'lawyer'}
				<button
					on:click={() => (showEditModal = true)}
					class="rounded bg-blue-500 px-4 py-2 text-white">Edit Case</button
				>
			{/if}
		</div>

		<!-- Case Details -->
		<div class="mb-6 grid grid-cols-2 gap-4">
			<div>
				<p class="font-semibold">Status:</p>
				<p>{caseDetails.status}</p>
				{#if userRole === 'ops' || userRole === 'admin'}
					<button
						on:click={() => updateStatus('Pending')}
						class="mt-2 rounded bg-yellow-500 px-3 py-1 text-white">Set to Pending</button
					>
				{/if}
			</div>
			<div>
				<p class="font-semibold">Address:</p>
				<p>{caseDetails.address}</p>
			</div>
		</div>

		<!-- Convert Filing to Case -->
		{#if caseDetails.fileType === 'Filing' && (userRole === 'client' || userRole === 'ops' || userRole === 'admin')}
			<button on:click={convertToCase} class="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
				>Convert to Case</button
			>
		{/if}

		<!-- Fees Section -->
		<div class="mb-6">
			<p class="text-lg font-semibold">Fees</p>
			<ul>
				{#each caseDetails.fees as fee, index}
					<li class="flex justify-between">
						<span>{fee.name} - ${fee.amount}</span>
						{#if userRole === 'admin' || userRole === 'ops'}
							<button on:click={() => removeFee(index)} class="text-red-500 hover:underline"
								>Remove</button
							>
						{/if}
					</li>
				{/each}
			</ul>
			{#if userRole === 'admin' || userRole === 'ops'}
				<button on:click={addFee} class="mt-2 rounded bg-green-500 px-3 py-1 text-white"
					>Add Fee</button
				>
			{/if}
		</div>

		<!-- Messaging Section -->
		<div class="mb-6">
			<p class="text-lg font-semibold">Messaging</p>
			<ul>
				{#each caseDetails.messages as msg}
					<li class="mb-2 border p-2">
						<strong>{msg.sender}:</strong>
						{msg.text} <span class="text-sm text-gray-500">({msg.timestamp})</span>
					</li>
				{/each}
			</ul>
			<button on:click={addMessage} class="mt-2 rounded bg-gray-500 px-3 py-1 text-white"
				>Add Message</button
			>
		</div>

		<!-- Upload Documents -->
		<button on:click={uploadDocument} class="mt-2 rounded bg-gray-500 px-3 py-1 text-white"
			>Upload Document</button
		>
	</section>
{/if}
