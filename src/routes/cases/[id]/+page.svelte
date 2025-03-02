<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { getStoredData, saveToLocalStorage } from '$lib/utils/storage';

	let caseId;
	let caseDetails = null;
	let userRole = null;

	// Reactive extraction of caseId from URL
	$: if ($page.params) {
		caseId = $page.params.id;
	}

	// Fields for adding fees & notes
	let newFee = { type: '', amount: '', description: '' };
	let newNote = '';
	let newStatus = '';

	// Load case details from localStorage
	onMount(() => {
		const storedData = getStoredData();
		if (storedData?.caseDetails) {
			caseDetails = storedData.caseDetails.find((c) => c._id === caseId) || null;
			console.log(caseDetails);
		}

		// Subscribe to user role
		auth.subscribe(({ role }) => {
			userRole = role;
		});
	});

	function addFee() {
		if (!newFee.type || !newFee.amount || !newFee.description) {
			alert('All fee fields are required!');
			return;
		}

		// Get stored cases
		let storedCases = JSON.parse(localStorage.getItem('caseDetails')) || [];

		// Find case by ID
		let caseIndex = storedCases.findIndex((c) => c._id === caseDetails._id);
		if (caseIndex === -1) {
			console.error('Case not found in local storage!');
			return;
		}

		// Add new fee
		let updatedCase = { ...storedCases[caseIndex] };
		updatedCase.fees = [
			...updatedCase.fees,
			{
				type: newFee.type,
				amount: Number(newFee.amount).toFixed(2),
				description: newFee.description
			}
		];

		// Update localStorage
		storedCases[caseIndex] = updatedCase;
		localStorage.setItem('cases', JSON.stringify(storedCases));

		// Force Svelte to detect changes
		caseDetails = { ...updatedCase };

		// Reset inputs
		newFee = { type: '', amount: '', description: '' };

		console.log('Fee added:', updatedCase.fees); // Debugging
	}

	// Add Internal Note
	function addInternalNote() {
		if (newNote.trim()) {
			caseDetails.internalNotes.push({
				user: 'Current User',
				note: newNote,
				timestamp: new Date().toLocaleString()
			});
			saveToLocalStorage('caseDetails', caseDetails);
			newNote = '';
		}
	}

	// Update Case Status (Admin/Ops only)
	function updateCaseStatus() {
		if (newStatus.trim()) {
			caseDetails.status = newStatus;
			caseDetails.activityLog.push({
				user: 'Admin User',
				action: `Updated case status to ${newStatus}`,
				timestamp: new Date().toLocaleString()
			});
			saveToLocalStorage('caseDetails', caseDetails);
			newStatus = '';
		}
	}

	let statuses = [
		'Demand Posted',
		'Demand Expired',
		'Eviction Service',
		'Answer Filed',
		'Court Date',
		'Consent',
		'Writ - Date Requested',
		'Writ - Date Available',
		'Writ - Date Received',
		'Eviction - To Be Scheduled',
		'Eviction - Date Scheduled',
		'Eviction - Completed',
		'Dismissed',
		'Appeal',
		'Bankruptcy',
		'Dismissed – Filed in Error',
		'Dismissed – Paid',
		'Skipped/Vacated'
	];

	let caseStatus = caseDetails?.status || 'Demand Posted'; // Default to first status
	let activeIndex = statuses.indexOf(caseStatus);
	let progressContainer; // Reference to scroll container

	// Ensure the active status is positioned correctly when the page loads
	$: if (progressContainer && activeIndex !== -1) {
		let activeElement = progressContainer.children[activeIndex];
		if (activeElement) {
			progressContainer.scrollLeft = activeElement.offsetLeft - 50;
		}
	}

	function scrollLeft() {
		progressContainer.scrollBy({ left: -200, behavior: 'smooth' });
	}

	function scrollRight() {
		progressContainer.scrollBy({ left: 200, behavior: 'smooth' });
	}

	// Function to format case title
	function formatCaseTitle(caseDetails) {
		if (
			!caseDetails ||
			!caseDetails.plaintiff ||
			!caseDetails.tenant ||
			!caseDetails.tenant.tenants
		) {
			return 'Loading...';
		}

		let plaintiffName = caseDetails.plaintiff.name;
		let tenants = caseDetails.tenant.tenants.map((t) => `${t.firstName} ${t.lastName}`);

		if (tenants.length === 1) {
			return `${plaintiffName} v. ${tenants[0]}`;
		} else if (tenants.length === 2) {
			return `${plaintiffName} v. ${tenants[0]} and ${tenants[1]}`;
		} else {
			// Three or more tenants → "Plaintiff v. LastName1, LastName2, LastName3"
			let lastNames = caseDetails.tenant.tenants.map((t) => t.lastName);
			return `${plaintiffName} v. ${lastNames.join(', ')}`;
		}
	}

	// Reactive Variables
	let showNotesModal = false;
	let hardcodedNotes = [
		{ text: 'Follow up with client.', user: 'Jane Smith', date: '03/01/2025' },
		{ text: 'Court date confirmed.', user: 'John Doe', date: '02/28/2025' },
		{ text: 'Updated balance details.', user: 'Admin', date: '02/26/2025' }
	];

	// Hardcoded data for testing
	let hardcodedDocuments = [
		{ name: 'Lease Agreement.pdf', uploadedBy: 'Jane Smith', date: '03/01/2025' },
		{ name: 'Notice to Vacate.docx', uploadedBy: 'John Doe', date: '02/28/2025' },
		{ name: 'Court Filing.pdf', uploadedBy: 'Admin', date: '02/27/2025' }
	];

	let hardcodedRelatedCases = [
		{
			caseNumber: 'CASE-101',
			caseType: 'Eviction',
			status: 'Pending',
			managementCompany: 'XYZ Property Mgmt',
			primaryContact: 'Alice Johnson'
		},
		{
			caseNumber: 'CASE-102',
			caseType: 'Collection',
			status: 'In Progress',
			managementCompany: 'Sunrise Properties',
			primaryContact: 'Bob Williams'
		},
		{
			caseNumber: 'CASE-103',
			caseType: 'Eviction',
			status: 'Closed',
			managementCompany: 'ABC Holdings',
			primaryContact: 'Sarah Lee'
		}
	];

	// Message data (Hardcoded for now)
	let messages = writable([
		{ user: 'John Doe', message: 'Tenant has responded.', timestamp: '2025-03-01 10:45 AM' },
		{ user: 'Jane Smith', message: 'Updated filing status.', timestamp: '2025-03-01 11:15 AM' },
		{ user: 'Case Manager', message: 'Court hearing scheduled.', timestamp: '2025-03-01 01:30 PM' },
		{ user: 'Attorney', message: 'Legal paperwork sent.', timestamp: '2025-03-01 03:00 PM' },
		{ user: 'Ops Team', message: 'Confirmed service of notice.', timestamp: '2025-03-01 05:20 PM' }
	]);

	// Modal state
	let showMessageModal = false;
	let newMessage = '';
	let selectedRecipient = '';

	// Sample recipients (Pull from caseDetails later)
	const recipients = ['John Doe', 'Jane Smith', 'Case Manager', 'Attorney', 'Ops Team'];

	// Function to add a new message
	function addMessage() {
		if (newMessage.trim() && selectedRecipient) {
			messages.update((msgs) => [
				...msgs,
				{ user: selectedRecipient, message: newMessage, timestamp: new Date().toLocaleString() }
			]);
			newMessage = '';
			selectedRecipient = '';
			showMessageModal = false;
		}
	}
</script>

<section class="rounded-lg bg-white p-6 shadow-md">
	<!-- Header Section -->
	<div class="mb-4 flex items-center justify-between">
		<!-- Case Number -->
		<h1 class="text-3xl font-bold">{caseDetails?.caseNumber}</h1>

		<!-- Formatted Legal Case Title -->
		<span class="rounded bg-blue-100 px-3 py-1 text-lg text-blue-800"
			>{formatCaseTitle(caseDetails)}</span
		>
	</div>

	<!-- Status Progress Bar -->
	{#if caseDetails}
		<div class="relative mb-6 flex w-full items-center rounded-lg bg-gray-100 p-2 shadow-md">
			<!-- Left Arrow -->
			<button
				on:click={scrollLeft}
				class="rounded bg-gray-300 px-2 py-1 text-sm font-bold hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
			>
				&lt;
			</button>

			<!-- Statuses (Scrollable Row - No Scrollbar) -->
			<div
				bind:this={progressContainer}
				class="scrollbar-hide mx-2 flex w-full flex-nowrap gap-2 overflow-x-auto scroll-smooth"
				style="scrollbar-width: none; -ms-overflow-style: none;"
			>
				{#each statuses as step, i}
					<div
						class="flex min-w-[120px] items-center justify-center rounded-md px-4 py-2 text-xs font-semibold transition-all"
						class:bg-blue-600={step === caseDetails.status}
						class:text-white={step === caseDetails.status}
						class:bg-gray-300={step !== caseDetails.status}
					>
						{step}
					</div>
				{/each}
			</div>

			<!-- Right Arrow -->
			<button
				on:click={scrollRight}
				class="rounded bg-gray-300 px-2 py-1 text-sm font-bold hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
			>
				&gt;
			</button>
		</div>
	{:else}
		<p class="text-red-500">Loading case details...</p>
	{/if}

	<!-- Case Overview -->
	<div class="grid grid-cols-2 gap-4">
		<!-- Left Column (Case Details) -->
		<!-- Case Details -->
		<div>
			<h2 class="mb-2 text-xl font-bold">Case Details</h2>
			<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<!-- Case Type (Full Width) -->
				<div class="col-span-2">
					<p>
						<strong>Case Type:</strong><br />
						{caseDetails?.caseType?.charAt(0).toUpperCase() + caseDetails?.caseType?.slice(1)}
					</p>
				</div>

				<!-- Property Address (Full Width) -->
				<div class="col-span-2">
					<p><strong>Property Address:</strong><br /> {caseDetails?.formattedAddress}</p>
				</div>

				<!-- Court Case # (Left), Court Name (Right) -->
				<p><strong>Court Case #:</strong><br /> {caseDetails?.courtCaseNumber || 'N/A'}</p>
				<p><strong>Court Name:</strong><br /> {caseDetails?.courtName || 'N/A'}</p>

				<!-- Plaintiff (Left), Management Company (Right) -->
				<p><strong>Plaintiff:</strong><br /> {caseDetails?.plaintiff?.name}</p>
				<p>
					<strong>Management Company:</strong><br />
					{caseDetails?.plaintiff?.managementCompany}
				</p>

				<!-- Primary Contact (Left), Tenant (Right) -->
				<p><strong>Primary Contact:</strong><br /> {caseDetails?.plaintiff?.primaryContact}</p>
				<p>
					<strong>Tenant:</strong><br />
					{caseDetails?.tenant?.tenants?.map((t) => `${t.firstName} ${t.lastName}`).join(', ')}
				</p>

				<!-- Primary Contact Phone (Left), Assigned To (Right) -->
				<p>
					<strong>Primary Contact Phone:</strong><br />
					{caseDetails?.plaintiff?.primaryContactPhone || 'N/A'}
				</p>
				<p><strong>Assigned To:</strong><br /> {caseDetails?.assignedTo || 'N/A'}</p>

				<!-- Primary Contact Email (Left), Attorney (Right) -->
				<p>
					<strong>Primary Contact Email:</strong><br />
					{caseDetails?.plaintiff?.primaryContactEmail || 'N/A'}
				</p>
				<p><strong>Attorney:</strong><br /> {caseDetails?.attorneyName || 'N/A'}</p>
			</div>
		</div>

		<!-- Right Column (Case Update + Fees) -->
		<div>
			{#if userRole === 'admin' || userRole === 'ops'}
				<!-- Operations Toolbox -->
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-bold">Operations Toolbox</h2>
					<div class="flex items-center gap-2">
						<!-- Status Dropdown -->
						<select bind:value={newStatus} class="w-2/3 border p-2 text-sm">
							<option value="" disabled>Select new status</option>
							{#each statuses as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
						<!-- Update Button -->
						<button
							on:click={updateCaseStatus}
							class="rounded bg-blue-500 px-3 py-2 text-sm text-white"
						>
							Update
						</button>
						<!-- Notes Button (smaller size) -->
						<button
							on:click={() => (showNotesModal = true)}
							class="rounded bg-gray-500 px-3 py-2 text-sm text-white"
						>
							Notes
						</button>
					</div>
				</div>

				<!-- Internal Notes Modal -->
				{#if showNotesModal}
					<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
						<div class="relative z-50 w-2/3 max-w-lg rounded-lg bg-white p-6 shadow-lg">
							<h2 class="mb-4 text-xl font-bold">Internal Notes</h2>

							<!-- Notes Table -->
							<div class="max-h-[300px] overflow-y-auto rounded-lg border">
								<table class="w-full text-sm">
									<thead class="sticky top-0 z-10 bg-gray-100">
										<tr>
											<th class="p-2">Note</th>
											<th class="p-2">User Name</th>
											<th class="p-2">Date Added</th>
										</tr>
									</thead>
									<tbody>
										{#each hardcodedNotes as note}
											<tr class="border-t">
												<td class="p-2">{note.text}</td>
												<td class="p-2">{note.user}</td>
												<td class="p-2">{note.date}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

							<!-- Close Button -->
							<div class="mt-4 flex justify-end">
								<button
									on:click={() => (showNotesModal = false)}
									class="rounded bg-red-500 px-4 py-2 text-white"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				{/if}
			{/if}

			<!-- Fees Table -->
			<h2 class="mb-2 text-xl font-bold">Fees & Balance</h2>
			<div class="overflow-hidden rounded-lg border">
				<table class="w-full text-sm">
					<thead class="sticky top-0 z-10 bg-gray-100">
						<tr>
							<th class="p-2">Type</th>
							<th class="p-2">Amount</th>
							<th class="p-2">Description</th>
						</tr>
					</thead>
					<tbody class="block max-h-[200px] overflow-y-auto">
						{#each caseDetails?.fees as fee}
							<tr class="flex w-full border-t">
								<td class="w-1/4 p-2">{fee.type}</td>
								<td class="w-1/4 p-2">${fee.amount}</td>
								<td class="w-1/2 p-2">{fee.description}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Add Fee (Admin/Ops only) -->
			{#if userRole === 'admin' || userRole === 'ops'}
				<div class="mt-2 flex gap-2">
					<input type="text" placeholder="Type" class="w-1/4 border p-2" bind:value={newFee.type} />
					<input
						type="number"
						placeholder="Amount"
						class="w-1/4 border p-2"
						bind:value={newFee.amount}
					/>
					<input
						type="text"
						placeholder="Description"
						class="w-1/2 border p-2"
						bind:value={newFee.description}
					/>
					<button on:click={addFee} class="rounded bg-red-500 px-3 py-1 text-white">Add</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Messages Section -->
	<div class="mt-4 border-t pt-4">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-xl font-bold">Messages</h2>
			<button
				on:click={() => (showMessageModal = true)}
				class="rounded bg-blue-500 px-3 py-1 text-sm text-white"
			>
				Add New Message
			</button>
		</div>

		<!-- Scrollable Messages Table -->
		<div class="max-h-[250px] overflow-y-auto rounded-lg border shadow-md">
			<table class="w-full text-sm">
				<thead class="sticky top-0 bg-gray-100">
					<tr>
						<th class="p-2">User</th>
						<th class="p-2">Message</th>
						<th class="p-2">Date Sent</th>
					</tr>
				</thead>
				<tbody>
					{#each $messages as msg}
						<tr class="border-t">
							<td class="p-2">{msg.user}</td>
							<td class="p-2">{msg.message}</td>
							<td class="p-2">{msg.timestamp}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Message Modal -->
	{#if showMessageModal}
		<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-96 rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">New Message</h2>

				<!-- Recipient Dropdown -->
				<label for="message-recipient" class="mb-1 block text-sm font-bold">Recipient</label>
				<select bind:value={selectedRecipient} class="mb-4 w-full border p-2" id="message-recipient">
					<option value="" disabled>Select recipient</option>
					{#each recipients as recipient}
						<option value={recipient}>{recipient}</option>
					{/each}
				</select>

				<!-- Message Input -->
				<label for="message-input" class="mb-1 block text-sm font-bold">Message</label>
				<textarea
					id="message-input"
					bind:value={newMessage}
					class="mb-4 w-full border p-2"
					placeholder="Enter your message..."
				></textarea>

				<!-- Buttons -->
				<div class="flex justify-end gap-2">
					<button
						on:click={() => (showMessageModal = false)}
						class="rounded bg-gray-300 px-3 py-1 text-sm"
					>
						Cancel
					</button>
					<button
						on:click={addMessage}
						class="rounded bg-blue-500 px-3 py-1 text-sm text-white"
						disabled={!newMessage.trim() || !selectedRecipient}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Activity Log Section -->
	<div class="mt-6">
		<h2 class="mb-2 text-xl font-bold">Activity Log</h2>
		<div class="max-h-[200px] overflow-y-auto rounded-lg border">
			<table class="w-full text-sm">
				<thead class="sticky top-0 z-10 bg-gray-100">
					<tr>
						<th class="p-2">Action</th>
						<th class="p-2">Details</th>
						<th class="p-2">User</th>
						<th class="p-2">Timestamp</th>
					</tr>
				</thead>
				<tbody>
					{#each caseDetails?.activityLog as log}
						<tr class="border-t">
							<td class="p-2">{log.action}</td>
							<td class="p-2">{log.details}</td>
							<td class="p-2">{log.user}</td>
							<td class="p-2">{log.timestamp}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Documents Section -->
	<div class="mt-6">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-xl font-bold">Documents</h2>
			<button class="rounded bg-blue-500 px-3 py-2 text-sm text-white">Upload</button>
		</div>
		<div class="max-h-[200px] overflow-y-auto rounded-lg border">
			<table class="w-full text-sm">
				<thead class="sticky top-0 z-10 bg-gray-100">
					<tr>
						<th class="p-2">Document Name</th>
						<th class="p-2">Uploaded By</th>
						<th class="p-2">Date Uploaded</th>
					</tr>
				</thead>
				<tbody>
					{#each hardcodedDocuments as doc}
						<tr class="border-t">
							<td class="p-2">{doc.name}</td>
							<td class="p-2">{doc.uploadedBy}</td>
							<td class="p-2">{doc.date}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Related Cases Section -->
	<div class="mt-6">
		<h2 class="mb-2 text-xl font-bold">Related Cases</h2>
		<div class="max-h-[200px] overflow-y-auto rounded-lg border">
			<table class="w-full text-sm">
				<thead class="sticky top-0 z-10 bg-gray-100">
					<tr>
						<th class="p-2">Case #</th>
						<th class="p-2">Case Type</th>
						<th class="p-2">Case Status</th>
						<th class="p-2">Management Company</th>
						<th class="p-2">Primary Contact</th>
					</tr>
				</thead>
				<tbody>
					{#each hardcodedRelatedCases as related}
						<tr class="border-t">
							<td class="p-2">{related.caseNumber}</td>
							<td class="p-2">{related.caseType}</td>
							<td class="p-2">{related.status}</td>
							<td class="p-2">{related.managementCompany}</td>
							<td class="p-2">{related.primaryContact}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
