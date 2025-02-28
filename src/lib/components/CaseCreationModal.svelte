<script>
	import { onMount } from 'svelte';

	// Step Handling
	let currentStep = 1;
	let totalSteps = 6;

	function nextStep() {
		if (currentStep < totalSteps) currentStep++;
	}
	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	// Case Model (Stored in DB Later)
	let caseDetails = {
		caseType: 'filing',
		addressId: '',
		newAddress: {},
		plaintiff: {
			name: '',
			managementCompany: '',
			propertyId: '',
			primaryContact: '',
			primaryContactPhone: '',
			primaryContactEmail: ''
		},
		tenant: {
			address: {},
			tenantCode: '',
			hasUnattachedProperty: false,
			includeAllOthers: false,
			tenants: []
		},
		rentFeesClaims: {
			filingPoNumber: '',
			baseRent: 0,
			holdover: false,
			monthsUnpaid: 0,
			currentMonthUnpaidDate: '',
			isSubsidized: false,
			rentalReliefApplication: false,
			lateFee: 0,
			lateMonths: 0,
			filingFee: 0,
			miscDebts: []
		},
		documents: {
			lease: { file: null, reason: '' },
			ledger: { file: null, reason: '' },
			demand: { file: null, reason: '' },
			ownershipDeed: { file: null, reason: '' },
			additionalDocs: []
		},
		acknowledgment: {
			rentalReliefConfirmed: false,
			statementsConfirmed: false
		}
	};

	// Address Book (Updated Model)
	let addressBook = [
		{
			id: 1,
			streetNumber: '11523',
			streetName: 'W. Orange Blossom Ln.',
			unitNumber: '',
			postalCode: '85253',
			city: 'Avondale',
			state: 'AZ',
			jurisdiction: 'Maricopa County',
			gateCode: '',
			formatted: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253'
		},
		{
			id: 2,
			streetNumber: '742',
			streetName: 'Evergreen Terrace',
			unitNumber: '',
			postalCode: '62704',
			city: 'Springfield',
			state: 'IL',
			jurisdiction: 'Sangamon County',
			gateCode: '',
			formatted: '742 Evergreen Terrace, Springfield, IL, 62704'
		}
	];

	// Handle Address Selection
	function handleAddressSelection(event) {
		const selectedValue = event.target.value;
		caseDetails.addressId = selectedValue;
		if (selectedValue !== 'new') {
			let selectedAddress = addressBook.find((a) => a.id == selectedValue);
			caseDetails.tenant.address = selectedAddress;
		}
	}

	// Save New Address
	function saveNewAddress() {
		const newId = addressBook.length + 1;
		const newFormatted = `${caseDetails.newAddress.streetNumber} ${caseDetails.newAddress.streetName}, ${caseDetails.newAddress.city}, ${caseDetails.newAddress.state}, ${caseDetails.newAddress.postalCode}`;
		const newEntry = { ...caseDetails.newAddress, id: newId, formatted: newFormatted };

		addressBook = [...addressBook, newEntry];
		caseDetails.addressId = newId;
		caseDetails.tenant.address = newEntry;
	}
</script>

<!-- Case Creation Modal -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
		<!-- Progress Bar -->
		<div class="mb-4 w-full rounded-full bg-gray-200">
			<div
				class="rounded-full bg-[var(--color-primary)] p-1 text-center text-xs leading-none text-white"
				style="width: {(currentStep / totalSteps) * 100}%"
			>
				Step {currentStep} of {totalSteps}
			</div>
		</div>

		<!-- Step Content -->
		{#if currentStep === 1}
			<h2 class="mb-4 text-xl font-bold">Select Case Type & Address</h2>

			<!-- Case Type -->
			<label for="case-type" class="mb-2 block font-semibold">Case Type</label>
			<select id="case-type" bind:value={caseDetails.caseType} class="w-full rounded-lg border p-2">
				<option value="filing">Filing</option>
				<option value="collection" disabled>Collection (Coming Soon)</option>
			</select>

			<!-- Address Selection -->
			<label for="address-select" class="mb-2 mt-4 block font-semibold">Property Address</label>
			<select
				id="address-select"
				bind:value={caseDetails.addressId}
				on:change={handleAddressSelection}
				class="w-full rounded-lg border p-2"
			>
				<option value="" disabled selected>Select an option</option>
				<option value="new">➕ Add New Address</option>
				{#each addressBook as address}
					<option value={address.id}>{address.formatted}</option>
				{/each}
			</select>

			<!-- New Address Form -->
			{#if caseDetails.addressId === 'new'}
				<div class="mt-4 rounded-lg bg-gray-100 p-4">
					<h3 class="mb-2 text-lg font-semibold">Add New Address</h3>
					<div class="grid grid-cols-2 gap-4">
						<!-- Left Column -->
						<div>
							<label for="streetNumber" class="block font-semibold">Street Number</label>
							<input
								id="streetNumber"
								bind:value={caseDetails.newAddress.streetNumber}
								class="w-full rounded-lg border p-2"
							/>

                            <label for="streetName" class="block font-semibold">Street Name</label>
							<input
								id="streetName"
								bind:value={caseDetails.newAddress.streetName}
								class="w-full rounded-lg border p-2"
							/>

							<label for="unitNumber" class="mt-2 block font-semibold">Unit Number</label>
							<input
								id="unitNumber"
								bind:value={caseDetails.newAddress.unitNumber}
								class="w-full rounded-lg border p-2"
							/>

							
						</div>

						<!-- Right Column -->
						<div>
							<label for="city" class="mt-2 block font-semibold">City</label>
							<input
								id="city"
								bind:value={caseDetails.newAddress.city}
								class="w-full rounded-lg border p-2"
							/>

							<label for="state" class="mt-2 block font-semibold">State</label>
							<input
								id="state"
								bind:value={caseDetails.newAddress.state}
								class="w-full rounded-lg border p-2"
							/>

                            <label for="postalCode" class="mt-2 block font-semibold">Zip / Postal Code</label>
							<input
								id="postalCode"
								bind:value={caseDetails.newAddress.postalCode}
								class="w-full rounded-lg border p-2"
							/>
						</div>
					</div>

					<!-- Save / Discard Buttons -->
					<div class="mt-4 flex justify-between">
						<button
							on:click={() => (caseDetails.addressId = '')}
							class="rounded bg-gray-500 px-4 py-2 text-white"
						>
							Discard
						</button>
						<button
							on:click={saveNewAddress}
							class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
						>
							Save & Continue
						</button>
					</div>
				</div>
			{/if}

			<!-- Navigation -->
			{#if caseDetails.addressId !== 'new'}
				<div class="mt-6 flex justify-between">
					<button
						on:click={() => (currentStep = 1)}
						class="rounded bg-gray-500 px-4 py-2 text-white">Cancel</button
					>
					<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
						>Next</button
					>
				</div>
			{/if}
		{/if}
	</div>
</div>
