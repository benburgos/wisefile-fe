<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	export let data;

	// Extract case details from data
	let caseDetails = data?.caseDetails ?? null;
	let userRole = null;
	let newMessage = '';
	let newFee = '';
	let newDocument = '';

	// Subscribe to auth store
	auth.subscribe(({ role }) => {
		userRole = role;
	});

	// Navigate back to cases
	function goBackToCases() {
		goto('/cases');
	}

	// Add a message
	function addMessage() {
		if (newMessage.trim() !== '') {
			caseDetails.messages.push({
				user: "Current User",
				message: newMessage,
				timestamp: new Date().toLocaleString()
			});
			newMessage = '';
		}
	}

	// Add a fee
	function addFee() {
		if (newFee.trim() !== '') {
			caseDetails.fees.push({
				amount: `$${newFee}`,
				description: "Additional Service Fee",
				date: new Date().toLocaleDateString()
			});
			newFee = '';
		}
	}

	// Add a document
	function addDocument() {
		if (newDocument.trim() !== '') {
			caseDetails.documents.push({
				name: newDocument,
				uploadedBy: "Current User",
				date: new Date().toLocaleDateString()
			});
			newDocument = '';
		}
	}
</script>

<section class="p-1">
	<!-- Back to Cases -->
	<div class="mb-6">
		<a href="/cases" class="text-blue-500 underline cursor-pointer">
			← Go Back to Cases
		</a>
	</div>

	{#if caseDetails}
		<div class="bg-white p-6 rounded shadow-md">
			<h1 class="text-3xl font-bold mb-4">{caseDetails.fileName}</h1>

			<!-- Grid Layout -->
			<div class="grid grid-cols-3 gap-6">
				<!-- Left Column -->
				<div class="col-span-2">
					<!-- Case Details -->
					<div class="grid grid-cols-2 gap-4 text-sm mb-6">
						<p><strong>File Type:</strong> {caseDetails.fileType}</p>
						<p><strong>Status:</strong> {caseDetails.status}</p>
						<p><strong>Sub-Status:</strong> {caseDetails.subStatus}</p>
						<p><strong>Address:</strong> {caseDetails.address}</p>
						<p><strong>Tenant:</strong> {caseDetails.tenant}</p>
						<p><strong>Attorney:</strong> {caseDetails.attorneyName}</p>
						<p><strong>Assigned To:</strong> {caseDetails.assignedTo}</p>
					</div>

					<!-- Messaging Section -->
					<div class="border-t pt-4 mt-4">
						<h2 class="text-xl font-bold mb-2">Messaging</h2>
						<textarea
							class="w-full p-2 border rounded"
							placeholder="Add a message..."
							bind:value={newMessage}
						></textarea>
						<button on:click={addMessage} class="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
							Send Message
						</button>

						<!-- Display Messages -->
						{#if caseDetails.messages?.length > 0}
							<ul class="mt-4 border-t pt-4">
								{#each caseDetails.messages as msg}
									<li class="mb-2">
										<strong>{msg.user}:</strong> {msg.message} <small class="text-gray-500">({msg.timestamp})</small>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-gray-500">No messages yet.</p>
						{/if}
					</div>
				</div>

				<!-- Right Column (Fees & Docs) -->
				<div>
					<!-- Fees Section -->
					<div class="border-t pt-4">
						<h2 class="text-xl font-bold mb-2">Fees</h2>
						{#if userRole === 'admin' || userRole === 'ops'}
							<input
								type="text"
								class="w-full p-2 border rounded"
								placeholder="Enter fee amount..."
								bind:value={newFee}
							/>
							<button on:click={addFee} class="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
								Add Fee
							</button>
						{/if}

						<!-- Display Fees -->
						<ul class="mt-4 border-t pt-4">
							{#each caseDetails.fees as fee}
								<li class="mb-2">
									<strong>{fee.amount}:</strong> {fee.description} <small class="text-gray-500">({fee.date})</small>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Documents Section -->
					<div class="border-t pt-4 mt-4">
						<h2 class="text-xl font-bold mb-2">Documents</h2>
						<input
							type="text"
							class="w-full p-2 border rounded"
							placeholder="Enter document name..."
							bind:value={newDocument}
						/>
						<button on:click={addDocument} class="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
							Upload Document
						</button>

						<!-- Display Documents -->
						<ul class="mt-4 border-t pt-4">
							{#each caseDetails.documents as doc}
								<li class="mb-2">
									<strong>{doc.name}</strong> - Uploaded by {doc.uploadedBy} <small class="text-gray-500">({doc.date})</small>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<!-- Activity Log Section (Full Width Below) -->
			<div class="border-t pt-4 mt-4">
				<h2 class="text-xl font-bold mb-2">Activity Log</h2>
				<ul>
					{#each caseDetails.activityLog as log}
						<li class="mb-2">
							<strong>{log.action}:</strong> {log.details} <small class="text-gray-500">({log.timestamp})</small>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{:else}
		<!-- If no caseDetails is found -->
		<p class="text-red-500 font-semibold">⚠️ Error: Case not found.</p>
	{/if}
</section>
