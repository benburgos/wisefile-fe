<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores'; // Ensure this is available for debugging

	export let data;

	// Extract case details from the `data` object
	let caseDetails = data?.caseDetails || null;
</script>

<section class="p-6">
	<!-- Back to Cases -->
	<div class="mb-6">
		<a href="/cases" class="cursor-pointer text-blue-500 underline">
			← Go Back to Cases
		</a>
	</div>

	<!-- Case Details -->
	{#if caseDetails}
		<div class="rounded bg-white p-6 shadow-md">
			<h1 class="mb-4 text-3xl font-bold">Case Details: {caseDetails.fileName}</h1>

			<!-- Case Info -->
			<div class="mb-6 grid grid-cols-2 gap-4">
				<p><strong>File Type:</strong> {caseDetails.fileType}</p>
				<p><strong>Status:</strong> {caseDetails.status}</p>
				<p><strong>Sub-Status:</strong> {caseDetails.subStatus}</p>
				<p><strong>Address:</strong> {caseDetails.address}</p>
				<p><strong>Tenant:</strong> {caseDetails.tenant}</p>
				<p><strong>Attorney:</strong> {caseDetails.attorneyName}</p>
				<p><strong>Assigned To:</strong> {caseDetails.assignedTo}</p>
			</div>

			<!-- Actions (Placeholder for Role-Based Actions) -->
			<div class="border-t pt-4">
				<h2 class="mb-2 text-xl font-bold">Actions</h2>
				<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
					Convert to Case
				</button>
				<button class="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700">
					Update Status
				</button>
			</div>

			<!-- Messaging Section -->
			<div class="mt-4 border-t pt-4">
				<h2 class="mb-2 text-xl font-bold">Messaging</h2>
				<textarea class="w-full rounded border p-2" placeholder="Add a message..."></textarea>
				<button class="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700">
					Send Message
				</button>
			</div>

			<!-- Fees Section -->
			<div class="mt-4 border-t pt-4">
				<h2 class="mb-2 text-xl font-bold">Fees</h2>
				<p class="text-gray-600">No fees added yet.</p>
				<button class="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700">
					Add Fee
				</button>
			</div>
		</div>
	{:else}
		<!-- If no caseDetails is found -->
		<p class="font-semibold text-red-500">⚠️ Error: Case not found.</p>
	{/if}
</section>
