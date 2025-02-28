<script>
	import { writable } from 'svelte/store';

	// Step Management
	let currentStep = writable(0);
	const steps = ['Plaintiff Details', 'Defendant Details', 'Case Details', 'Review & Submit'];

	// Form Data Store
	let caseData = writable({
		plaintiff: { name: '', address: '', phone: '' },
		defendant: { name: '', address: '', phone: '' },
		caseDetails: { caseType: '', state: '', court: '', filingDate: '' },
		attachments: [],
		status: 'Draft' // Initial status is "Draft"
	});

	// Navigation Functions
	function nextStep() {
		currentStep.update((step) => Math.min(step + 1, steps.length - 1));
	}

	function prevStep() {
		currentStep.update((step) => Math.max(step - 1, 0));
	}

	function closeModal() {
		currentStep.set(0);
	}

	// Save Draft Function
	function saveDraft() {
		const draftData = $caseData;
		console.log('Saving Draft:', draftData);
		alert('Draft saved! (This will be an API call in the future)');
	}

	// **Final Submission Function**
	function submitCase() {
		caseData.update((data) => {
			data.status = 'Submitted'; // Change status
			return data;
		});

		console.log('Submitting Case:', $caseData);
		alert('Case submitted successfully!'); // Placeholder for backend API call

		closeModal();
	}

	// **File Upload Functions**
	function handleFileUpload(event) {
		const files = Array.from(event.target.files);
		caseData.update((data) => {
			data.attachments = [...data.attachments, ...files.map((file) => file.name)];
			return data;
		});
	}

	function removeAttachment(index) {
		caseData.update((data) => {
			data.attachments.splice(index, 1);
			return data;
		});
	}
</script>

<!-- Modal -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
		<!-- Step Indicator -->
		<div class="mb-4 flex justify-between text-sm font-semibold">
			{#each steps as step, index}
				<div
					class="flex items-center gap-2"
					class:text-gray-900={index === $currentStep}
					class:text-gray-400={index !== $currentStep}
				>
					<span class="flex h-6 w-6 items-center justify-center rounded-full border"
						>{index + 1}</span
					>
					{step}
				</div>
			{/each}
		</div>

		<!-- Step Content -->
		<div class="min-h-[300px]">
			{#if $currentStep === 0}
				<!-- Plaintiff Details -->
				<h2 class="mb-2 text-xl font-bold">Plaintiff Details</h2>
				<label class="mt-2 block">Full Name</label>
				<input
					type="text"
					bind:value={$caseData.plaintiff.name}
					class="w-full rounded border p-2"
				/>

				<label class="mt-2 block">Address</label>
				<input
					type="text"
					bind:value={$caseData.plaintiff.address}
					class="w-full rounded border p-2"
				/>

				<label class="mt-2 block">Phone Number</label>
				<input
					type="text"
					bind:value={$caseData.plaintiff.phone}
					class="w-full rounded border p-2"
				/>
			{:else if $currentStep === 1}
				<!-- Defendant Details -->
				<h2 class="mb-2 text-xl font-bold">Defendant Details</h2>
				<label class="mt-2 block">Full Name</label>
				<input
					type="text"
					bind:value={$caseData.defendant.name}
					class="w-full rounded border p-2"
				/>

				<label class="mt-2 block">Address</label>
				<input
					type="text"
					bind:value={$caseData.defendant.address}
					class="w-full rounded border p-2"
				/>

				<label class="mt-2 block">Phone Number</label>
				<input
					type="text"
					bind:value={$caseData.defendant.phone}
					class="w-full rounded border p-2"
				/>
			{:else if $currentStep === 2}
				<!-- Case Details -->
				<h2 class="mb-2 text-xl font-bold">Case Details</h2>
				<label class="mt-2 block">Case Type</label>
				<select bind:value={$caseData.caseDetails.caseType} class="w-full rounded border p-2">
					<option value="Filing">Filing</option>
					<option value="Collection">Collection</option>
				</select>

				<label class="mt-2 block">State</label>
				<select bind:value={$caseData.caseDetails.state} class="w-full rounded border p-2">
					<option value="AZ">Arizona</option>
					<option value="CO">Colorado</option>
					<option value="NV">Nevada</option>
				</select>

				<label class="mt-2 block">Court</label>
				<input
					type="text"
					bind:value={$caseData.caseDetails.court}
					class="w-full rounded border p-2"
				/>

				<label class="mt-2 block">Filing Date</label>
				<input
					type="date"
					bind:value={$caseData.caseDetails.filingDate}
					class="w-full rounded border p-2"
				/>

				<!-- File Upload Section -->
				<label class="mt-4 block font-bold">Upload Documents</label>
				<input
					type="file"
					multiple
					on:change={handleFileUpload}
					class="w-full rounded border p-2"
				/>

				<!-- File Preview List -->
				{#if $caseData.attachments.length > 0}
					<div class="mt-2 rounded bg-gray-100 p-2">
						<p class="font-semibold">Uploaded Files:</p>
						<ul>
							{#each $caseData.attachments as file, index}
								<li class="flex items-center justify-between">
									<span>{file}</span>
									<button
										on:click={() => removeAttachment(index)}
										class="text-sm font-semibold text-red-500"
									>
										Remove
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			{:else}
				<!-- Review & Submit -->
				<h2 class="mb-2 text-xl font-bold">Review & Submit</h2>
				<p>Review all details before submission.</p>
				<pre class="rounded bg-gray-100 p-2">{JSON.stringify($caseData, null, 2)}</pre>
			{/if}
		</div>

		<!-- Navigation Buttons -->
		<div class="mt-4 flex justify-between">
			<button
				on:click={prevStep}
				class="rounded bg-gray-400 px-4 py-2 text-white disabled:opacity-50"
				disabled={$currentStep === 0}
			>
				Back
			</button>
			<button
				on:click={nextStep}
				class="rounded bg-blue-600 px-4 py-2 text-white"
				disabled={$currentStep === steps.length - 1}
			>
				Next
			</button>
		</div>

		<!-- Save Draft & Submit Buttons -->
		<div class="mt-4 flex justify-between">
			<button on:click={saveDraft} class="rounded bg-yellow-500 px-4 py-2 text-white">
				Save Draft
			</button>
			<button on:click={submitCase} class="rounded bg-green-600 px-4 py-2 text-white">
				Submit Case
			</button>
		</div>
	</div>
</div>
