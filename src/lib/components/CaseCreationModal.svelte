<script>
	import { onMount } from 'svelte';

	// Step Handling
	let currentStep = 1;
	let totalSteps = 6;

	function nextStep() {
		if (currentStep < totalSteps) currentStep++;
		console.log(caseDetails);
	}
	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	// Case Model (Stored in DB Later)
	let caseDetails = {
		caseType: 'filing',
		addressId: '',
		formattedAddress: '',
		newAddress: {
			streetNumber: '',
			streetName: '',
			unitNumber: '',
			postalCode: '',
			city: '',
			state: '',
			jurisdiction: '',
			gateCode: ''
		},
		plaintiff: {
			name: '',
			managementCompany: '',
			newManagementCompany: '',
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
			lease: { file: null, status: '', explanation: '' },
			ledger: { file: null, status: '', explanation: '' },
			demand: { file: null, status: '', explanation: '' },
			ownershipDeed: { file: null, status: '', explanation: '' },
			additionalDocs: [] // Array of uploaded additional documents
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
		}
	];

	// Mock Plaintiff & Management Company Data
	let plaintiffs = ['ABC Holdings LLC', 'XYZ Realty Group'];
	let managementCompanies = ['ABC Property Management', 'XYZ Management Co.'];

	// Mock Users for Primary Contact Selection
	let users = [
		{
			id: 1,
			name: 'Alice Johnson',
			email: 'alice@example.com',
			phone: '555-1234',
			clientId: 'ABC Holdings LLC'
		},
		{
			id: 2,
			name: 'Bob Smith',
			email: 'bob@example.com',
			phone: '555-5678',
			clientId: 'XYZ Realty Group'
		}
	];

	// Handle Address Selection (Step 1)
	function handleAddressSelection(event) {
		const selectedValue = event.target.value;

		if (selectedValue === 'new') {
			// Reset all fields before showing the sub-form
			caseDetails.newAddress = {
				streetNumber: '',
				streetName: '',
				unitNumber: '',
				postalCode: '',
				city: '',
				state: '',
				jurisdiction: '',
				gateCode: ''
			};
			caseDetails.addressId = 'new';
			caseDetails.formattedAddress = 'Adding New Address...';
			caseDetails.tenant.address = {}; // Reset tenant address so it's editable separately
		} else {
			let selectedAddress = addressBook.find((a) => a.id == selectedValue);

			if (selectedAddress) {
				caseDetails.addressId = selectedAddress.id;
				caseDetails.formattedAddress = selectedAddress.formatted; // Keep case address static
				caseDetails.tenant.address = { ...selectedAddress }; // Allow tenant address edits
			}
		}
	}

	// Save New Address (Step 1)
	function saveNewAddress() {
		const newId = addressBook.length + 1;

		let formattedAddress = `${caseDetails.newAddress.streetNumber} ${caseDetails.newAddress.streetName}`;
		if (caseDetails.newAddress.unitNumber) {
			formattedAddress += ` #${caseDetails.newAddress.unitNumber}`;
		}
		formattedAddress += `, ${caseDetails.newAddress.city}, ${caseDetails.newAddress.state}, ${caseDetails.newAddress.postalCode}`;

		const newEntry = { ...caseDetails.newAddress, id: newId, formatted: formattedAddress };

		addressBook = [...addressBook, newEntry];
		caseDetails.addressId = newId;
		caseDetails.formattedAddress = formattedAddress;
	}

	// Handle Plaintiff Selection
	function handlePlaintiffSelection(event) {
		caseDetails.plaintiff.name = event.target.value;
	}

	// Handle Management Company Selection
	function handleManagementCompanySelection(event) {
		caseDetails.plaintiff.managementCompany = event.target.value;
	}

	// Handle Primary Contact Selection
	function handlePrimaryContactSelection(event) {
		let selectedUser = users.find((u) => u.id == event.target.value);
		if (selectedUser) {
			caseDetails.plaintiff.primaryContact = selectedUser.name;
			caseDetails.plaintiff.primaryContactPhone = selectedUser.phone;
			caseDetails.plaintiff.primaryContactEmail = selectedUser.email;
		}
	}

	// Tenant List Management
	let newTenant = { firstName: '', middleName: '', lastName: '', suffix: '' };

	function addTenant() {
		if (newTenant.firstName.trim() && newTenant.lastName.trim()) {
			caseDetails.tenant.tenants = [...caseDetails.tenant.tenants, { ...newTenant }];
			newTenant = { firstName: '', middleName: '', lastName: '', suffix: '' }; // Reset fields
		}
	}

	function removeTenant(index) {
		caseDetails.tenant.tenants = caseDetails.tenant.tenants.filter((_, i) => i !== index);
	}

	let newDebt = { description: '', amount: 0 };

	// Add Debt
	function addDebt() {
		if (newDebt.description.trim() !== '' && newDebt.amount > 0) {
			caseDetails.rentFeesClaims.miscDebts = [
				...caseDetails.rentFeesClaims.miscDebts,
				{ ...newDebt }
			];
			newDebt = { description: '', amount: 0 }; // Reset fields
		}
	}

	// Remove Debt
	function removeDebt(index) {
		caseDetails.rentFeesClaims.miscDebts = caseDetails.rentFeesClaims.miscDebts.filter(
			(_, i) => i !== index
		);
	}

	function handleFileUpload(event, type) {
		const file = event.target.files[0];
		if (file) {
			caseDetails.documents[type].file = file.name; // Storing file name for display
		}
	}

	function handleDocumentStatus(type, event) {
		caseDetails.documents[type].status = event.target.value;
	}

	let newAdditionalDoc = { file: '', type: '', notes: '' };

	function addAdditionalDocument() {
		if (!newAdditionalDoc.file || !newAdditionalDoc.type) return; // Ensure valid entry

		// Update the array in a reactive way
		caseDetails.documents.additionalDocs = [
			...caseDetails.documents.additionalDocs,
			{ ...newAdditionalDoc }
		];

		// Reset the input fields
		newAdditionalDoc = { file: '', type: '', notes: '' };

		// Manually reset the file input
		document.getElementById('additional-file').value = '';
	}

	function removeAdditionalDocument(index) {
		caseDetails.documents.additionalDocs = caseDetails.documents.additionalDocs.filter(
			(_, i) => i !== index
		);
	}
</script>

<!-- Case Creation Modal -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
		<!-- Sticky Progress Bar with Background -->
		<div class="sticky top-0 z-10 mb-4 w-full">
			<div class="rounded-full bg-gray-200 p-2">
				<div
					class="rounded-full bg-[var(--color-primary)] p-1 text-center text-xs leading-none text-white"
					style="width: {(currentStep / totalSteps) * 100}%"
				>
					Step {currentStep} of {totalSteps}
				</div>
			</div>
		</div>

		<!-- Step Content -->
		{#if currentStep === 1}
			<h2 class="mb-4 text-xl font-bold">Create New Case</h2>

			<label for="case-type" class="mb-2 block font-semibold">Case Type</label>
			<select id="case-type" bind:value={caseDetails.caseType} class="w-full rounded-lg border p-2">
				<option value="filing">Filing</option>
				<option value="collection" disabled>Collection (Coming Soon)</option>
			</select>

			<label for="address-select" class="mb-2 mt-4 block font-semibold">Property Address</label>
			<select
				id="address-select"
				bind:value={caseDetails.addressId}
				on:change={handleAddressSelection}
				class="w-full rounded-lg border p-2"
			>
				<option value="" disabled>Select an option</option>
				<option value="new">➕ Add New Address</option>
				{#each addressBook as address}
					<option value={address.id}>{address.formatted}</option>
				{/each}
			</select>

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

			<div class="mt-6 flex justify-between">
				<button on:click={() => (currentStep = 1)} class="rounded bg-gray-500 px-4 py-2 text-white"
					>Cancel</button
				>
				<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>Next</button
				>
			</div>
		{:else if currentStep === 2}
			<h2 class="mb-4 text-xl font-bold">Plaintiff Details</h2>

			<!-- Property Address (Un-editable, Pre-filled from Step 1) -->
			<label for="property-address" class="block font-semibold">Property Address</label>
			<input
				id="property-address"
				value={caseDetails.formattedAddress}
				class="w-full rounded-lg border bg-gray-100 p-2"
				disabled
			/>

			<!-- Plaintiff Name -->
			<label for="plaintiff-name" class="block font-semibold">Plaintiff Name</label>
			<input
				id="plaintiff-name"
				value={plaintiffs[0]}
				class="w-full rounded-lg border bg-gray-100 p-2"
				disabled
			/>

			<!-- Management Company -->
			<label for="management-company" class="block font-semibold">Management Company</label>
			<select
				id="management-company"
				bind:value={caseDetails.plaintiff.managementCompany}
				on:change={handleManagementCompanySelection}
				class="w-full rounded-lg border p-2"
			>
				<option value="" disabled selected>Select Management Company</option>
				<option value="new">➕ Add New Management Company</option>
				{#each managementCompanies as name}
					<option value={name}>{name}</option>
				{/each}
			</select>

			<!-- New Management Company Subform -->
			{#if caseDetails.plaintiff.managementCompany === 'new'}
				<div class="mt-4 rounded-lg bg-gray-100 p-4">
					<h3 class="mb-2 text-lg font-semibold">Add New Management Company</h3>
					<label for="new-management-company" class="block font-semibold"
						>Management Company Name</label
					>
					<input
						id="new-management-company"
						bind:value={caseDetails.plaintiff.newManagementCompany}
						class="w-full rounded-lg border p-2"
					/>

					<!-- Buttons -->
					<div class="mt-4 flex justify-between">
						<!-- Reset input and close sub-form -->
						<button
							on:click={() => {
								caseDetails.plaintiff.managementCompany = '';
								caseDetails.plaintiff.newManagementCompany = ''; // Reset input field
							}}
							class="rounded bg-gray-500 px-4 py-2 text-white"
						>
							Discard
						</button>

						<!-- Save new management company and clear input -->
						<button
							on:click={() => {
								if (caseDetails.plaintiff.newManagementCompany.trim()) {
									managementCompanies = [
										...managementCompanies,
										caseDetails.plaintiff.newManagementCompany
									];
									caseDetails.plaintiff.managementCompany =
										caseDetails.plaintiff.newManagementCompany;
									caseDetails.plaintiff.newManagementCompany = ''; // Clear input
								}
							}}
							class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
						>
							Save & Continue
						</button>
					</div>
				</div>
			{/if}

			<!-- Property ID -->
			<label for="property-id" class="block font-semibold">Property ID</label>
			<input
				id="property-id"
				bind:value={caseDetails.plaintiff.propertyId}
				class="w-full rounded-lg border p-2"
			/>

			<!-- Primary Contact -->
			<label for="primary-contact" class="block font-semibold">Primary Contact</label>
			<select
				id="primary-contact"
				on:change={handlePrimaryContactSelection}
				class="w-full rounded-lg border p-2"
			>
				<option value="" disabled selected>Select Primary Contact</option>
				{#each users as user}
					<option value={user.id}>{user.name}</option>
				{/each}
			</select>

			<!-- Primary Contact Phone -->
			<label for="primary-contact-phone" class="block font-semibold">Primary Contact Phone</label>
			<input
				id="primary-contact-phone"
				bind:value={caseDetails.plaintiff.primaryContactPhone}
				class="w-full rounded-lg border p-2"
			/>

			<!-- Primary Contact Email -->
			<label for="primary-contact-email" class="block font-semibold">Primary Contact Email</label>
			<input
				id="primary-contact-email"
				bind:value={caseDetails.plaintiff.primaryContactEmail}
				class="w-full rounded-lg border p-2"
			/>

			<!-- Navigation -->
			<div class="mt-6 flex justify-between">
				<button on:click={prevStep} class="rounded bg-gray-500 px-4 py-2 text-white">Back</button>
				<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>Next</button
				>
			</div>
		{:else if currentStep === 3}
			<h2 class="mb-4 text-xl font-bold">Tenant / Defendant Details</h2>

			<!-- Tenant Address (Editable) -->
			<label for="tenant-address" class="block font-semibold">Tenant Address</label>
			<input
				id="tenant-address"
				bind:value={caseDetails.tenant.address.formatted}
				class="w-full rounded-lg border p-2"
			/>

			<!-- Tenant Code -->
			<label for="tenant-code" class="block font-semibold">Tenant Code</label>
			<input
				id="tenant-code"
				bind:value={caseDetails.tenant.tenantCode}
				class="w-full rounded-lg border p-2"
			/>

			<div class="mb-4 flex gap-8">
				<!-- Has Unattached Property -->
				<div class="flex-1">
					<label class="block font-semibold" for="has-unattached-property">
						Has Unattached Property?
					</label>
					<div class="flex gap-4">
						<label class="inline-flex items-center" for="has-unattached-property-yes">
							<input
								id="has-unattached-property-yes"
								type="radio"
								bind:group={caseDetails.tenant.hasUnattachedProperty}
								value={true}
							/>
							<span class="ml-2">Yes</span>
						</label>
						<label class="inline-flex items-center" for="has-unattached-property-no">
							<input
								id="has-unattached-property-no"
								type="radio"
								bind:group={caseDetails.tenant.hasUnattachedProperty}
								value={false}
							/>
							<span class="ml-2">No</span>
						</label>
					</div>
				</div>

				<!-- Include All Others -->
				<div class="flex-1">
					<label class="block font-semibold" for="include-all-others">Include All Others?</label>
					<div class="flex gap-4">
						<label class="inline-flex items-center" for="include-all-others-checkbox">
							<input
								id="include-all-others-checkbox"
								type="checkbox"
								bind:checked={caseDetails.tenant.includeAllOthers}
							/>
							<span class="ml-2">Yes</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Tenant(s) Section -->
			<h3 class="mb-2 text-lg font-semibold">Tenant(s) List</h3>
			<div class="grid grid-cols-4 gap-4">
				<div>
					<label for="tenant-first-name" class="block font-semibold">First Name</label>
					<input
						id="tenant-first-name"
						bind:value={newTenant.firstName}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="tenant-middle-name" class="block font-semibold">Middle Name</label>
					<input
						id="tenant-middle-name"
						bind:value={newTenant.middleName}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="tenant-last-name" class="block font-semibold">Last Name</label>
					<input
						id="tenant-last-name"
						bind:value={newTenant.lastName}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="tenant-suffix" class="block font-semibold">Suffix</label>
					<input
						id="tenant-suffix"
						bind:value={newTenant.suffix}
						class="w-full rounded-lg border p-2"
					/>
				</div>
			</div>

			<!-- Add Tenant Button -->
			<button
				on:click={addTenant}
				class="mt-2 rounded bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-opacity-90"
			>
				Add Tenant
			</button>

			<!-- Tenant Table -->
			{#if caseDetails.tenant.tenants.length > 0}
				<div class="mt-4 max-h-[20vh] overflow-y-auto rounded-lg border">
					<table class="w-full bg-white text-sm shadow-md">
						<!-- Table Header (Sticky) -->
						<thead class="sticky top-0 z-10 bg-gray-200 text-sm font-semibold">
							<tr>
								<th class="p-3 text-left">First Name</th>
								<th class="p-3 text-left">Middle Name</th>
								<th class="p-3 text-left">Last Name</th>
								<th class="p-3 text-left">Suffix</th>
								<th class="p-3 text-left">Actions</th>
							</tr>
						</thead>

						<!-- Table Body (Scrollable) -->
						<tbody class="divide-y divide-gray-200">
							{#each caseDetails.tenant.tenants as tenant, index}
								<tr class="border-t">
									<td class="p-3 text-sm">{tenant.firstName}</td>
									<td class="p-3 text-sm">{tenant.middleName}</td>
									<td class="p-3 text-sm">{tenant.lastName}</td>
									<td class="p-3 text-sm">{tenant.suffix}</td>
									<td class="p-3 text-sm">
										<button
											on:click={() => removeTenant(index)}
											class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
										>
											Remove
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Navigation -->
			<div class="mt-6 flex justify-between">
				<button on:click={prevStep} class="rounded bg-gray-500 px-4 py-2 text-white">Back</button>
				<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>Next</button
				>
			</div>
		{:else if currentStep === 4}
			<h2 class="mb-4 text-xl font-bold">Rent / Fees / Claims</h2>

			<!-- Filing PO Number -->
			<label for="filing-po" class="block font-semibold">Filing PO Number</label>
			<input
				id="filing-po"
				bind:value={caseDetails.rentFeesClaims.filingPoNumber}
				class="w-full rounded-lg border p-2"
			/>

			<!-- Rent Section -->
			<h3 class="mt-4 text-lg font-semibold">Rent</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="base-rent" class="block font-semibold">Base Rent / Month ($)</label>
					<input
						id="base-rent"
						type="number"
						bind:value={caseDetails.rentFeesClaims.baseRent}
						class="w-full rounded-lg border p-2"
					/>

					<label for="months-unpaid" class="block font-semibold">Months Unpaid</label>
					<input
						id="months-unpaid"
						type="number"
						bind:value={caseDetails.rentFeesClaims.monthsUnpaid}
						class="w-full rounded-lg border p-2"
					/>

					<label for="unpaid-date" class="block font-semibold">Date of Current Month Unpaid</label>
					<input
						id="unpaid-date"
						type="date"
						bind:value={caseDetails.rentFeesClaims.currentMonthUnpaidDate}
						class="w-full rounded-lg border p-2"
					/>
				</div>

				<div>
					<label for="holdover" class="block font-semibold">Holdover?</label>
					<div class="mb-4 flex gap-4">
						<label class="inline-flex items-center" for="holdover-yes">
							<input
								id="holdover-yes"
								type="radio"
								bind:group={caseDetails.rentFeesClaims.holdover}
								value={true}
							/>
							<span class="ml-2">Yes</span>
						</label>
						<label class="inline-flex items-center" for="holdover-no">
							<input
								id="holdover-no"
								type="radio"
								bind:group={caseDetails.rentFeesClaims.holdover}
								value={false}
							/>
							<span class="ml-2">No</span>
						</label>
					</div>

					<label for="subsidized" class="block font-semibold">Is Rent Subsidized?</label>

					<div class="mb-4 flex gap-4">
						<label class="inline-flex items-center" for="subsidized-yes">
							<input
								id="subsidized-yes"
								type="radio"
								bind:group={caseDetails.rentFeesClaims.isSubsidized}
								value={true}
							/>
							<span class="ml-2">Yes</span>
						</label>
						<label class="inline-flex items-center" for="subsidized-no">
							<input
								id="subsidized-no"
								type="radio"
								bind:group={caseDetails.rentFeesClaims.isSubsidized}
								value={false}
							/>
							<span class="ml-2">No</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Rental Relief Section -->
			<h3 class="mt-4 text-lg font-semibold">Rental Relief</h3>
			<p class="text-sm">
				Is there currently a pending or rejected rental relief application that has been submitted
				by you, your company, or the resident being filed on?
			</p>
			<div class="mb-4 flex gap-4">
				<label class="inline-flex items-center" for="relief-yes">
					<input
						id="relief-yes"
						type="radio"
						bind:group={caseDetails.rentFeesClaims.rentalReliefApplication}
						value={true}
					/>
					<span class="ml-2">Yes</span>
				</label>
				<label class="inline-flex items-center" for="relief-no">
					<input
						id="relief-no"
						type="radio"
						bind:group={caseDetails.rentFeesClaims.rentalReliefApplication}
						value={false}
					/>
					<span class="ml-2">No</span>
				</label>
			</div>

			<!-- Property Fees Section -->
			<h3 class="mt-4 text-lg font-semibold">Property Fees</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="late-fee" class="block font-semibold">Monthly Late Fee ($)</label>
					<input
						id="late-fee"
						type="number"
						bind:value={caseDetails.rentFeesClaims.lateFee}
						class="w-full rounded-lg border p-2"
					/>

					<label for="late-months" class="block font-semibold">Months Late</label>
					<input
						id="late-months"
						type="number"
						bind:value={caseDetails.rentFeesClaims.lateMonths}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="calculated-late-fees" class="block font-semibold">Total Late Fees</label>
					<input
						id="calculated-late-fees"
						type="number"
						value={caseDetails.rentFeesClaims.lateFee * caseDetails.rentFeesClaims.lateMonths}
						class="w-full rounded-lg border bg-gray-100 p-2"
						disabled
					/>

					<label for="filing-fee" class="block font-semibold">Filing Fee ($)</label>
					<input
						id="filing-fee"
						type="number"
						bind:value={caseDetails.rentFeesClaims.filingFee}
						class="w-full rounded-lg border p-2"
					/>
				</div>
			</div>

			<!-- Miscellaneous Debts Section -->
			<h3 class="mt-4 text-lg font-semibold">Miscellaneous Debts</h3>
			<div class="flex gap-2">
				<input
					id="debt-type"
					type="text"
					bind:value={newDebt.description}
					placeholder="Type"
					class="w-1/3 rounded-lg border p-2"
				/>
				<input
					id="debt-amount"
					type="number"
					bind:value={newDebt.amount}
					placeholder="Amount ($)"
					class="w-1/3 rounded-lg border p-2"
				/>
				<button
					on:click={addDebt}
					class="w-1/3 rounded bg-[var(--color-primary)] px-4 py-2 text-white hover:bg-opacity-80"
					>➕ Add Debt</button
				>
			</div>

			<!-- Debts Table (Scrollable) -->
			{#if caseDetails.rentFeesClaims.miscDebts.length > 0}
				<div class="mt-4 max-h-[20vh] overflow-y-auto rounded-lg border">
					<table class="w-full bg-white text-sm shadow-md">
						<thead class="bg-gray-200 text-sm font-semibold">
							<tr>
								<th class="p-3 text-left">Type</th>
								<th class="p-3 text-left">Amount</th>
								<th class="p-3 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each caseDetails.rentFeesClaims.miscDebts as debt, index}
								<tr class="border-t">
									<td class="p-3 text-sm">{debt.description}</td>
									<td class="p-3 text-sm">${debt.amount}</td>
									<td class="p-3 text-sm">
										<button
											on:click={() => removeDebt(index)}
											class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
										>
											Remove
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Total Due Calculation -->
			<h3 class="mt-4 text-lg font-semibold">Total Due from Tenant</h3>
			<input
				id="total-due"
				type="text"
				value={`$${(
					caseDetails.rentFeesClaims.lateFee * caseDetails.rentFeesClaims.lateMonths +
					caseDetails.rentFeesClaims.miscDebts.reduce((sum, debt) => sum + debt.amount, 0)
				).toFixed(2)}`}
				class="w-full rounded-lg border bg-gray-100 p-2 text-lg font-bold text-red-600"
				disabled
			/>

			<!-- Navigation -->
			<div class="mt-6 flex justify-between">
				<button on:click={prevStep} class="rounded bg-gray-500 px-4 py-2 text-white">Back</button>
				<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white"
					>Next</button
				>
			</div>
		{:else if currentStep === 5}
			<h2 class="mb-4 text-xl font-bold">Additional Information</h2>

			<!-- ✅ Required Documents -->
			<h3 class="mt-4 text-lg font-semibold">Required Documents</h3>
			<p class="text-sm text-gray-600">
				Allowed file types: .xls, .xlsx, .pdf, .png, .jpeg, .jpg, .doc, .docx, .csv
			</p>

			<!-- Legal Disclaimer -->
			<p class="mt-2 text-sm text-red-600">
				I certify that I will not upload any document that contains protected personal information
				such as social security numbers, driver’s licenses, passports, date of birth, or any
				financial account numbers unless required by the jurisdiction or instructed by the attorney.
			</p>

			<!-- 🔹 Standard Document Uploads (Lease, Ledger, Demand, Ownership Deed) -->
			{#each ['lease', 'ledger', 'demand', 'ownershipDeed'] as docType}
				<div class="mt-4">
					<label for="{docType}-upload" class="block font-semibold capitalize"
						>{docType.replace(/([A-Z])/g, ' $1')}</label
					>
					<div class="grid grid-cols-5 gap-4">
						<!-- Upload Field (60%) -->
						<input
							id="{docType}-upload"
							type="file"
							on:change={(event) => handleFileUpload(event, docType)}
							class="col-span-3 rounded-lg border p-2"
						/>

						<!-- Status Dropdown (40%) -->
						<select
							id="{docType}-status"
							bind:value={caseDetails.documents[docType].status}
							on:change={(event) => handleDocumentStatus(docType, event)}
							class="col-span-2 rounded-lg border p-2"
						>
							<option value="" disabled selected>Select status</option>
							<option value="attached">Attached</option>
							<option value="cannotAttachSquatter">Cannot Attach - Squatter</option>
							<option value="cannotAttachOther">Cannot Attach - Other</option>
						</select>
					</div>

					<!-- Explanation (Only If Not Attached) -->
					{#if caseDetails.documents[docType].status !== 'attached' && caseDetails.documents[docType].status !== ''}
						<label for="{docType}-explanation" class="mt-2 block font-semibold"
							>Missing Required Document Explanation</label
						>
						<textarea
							id="{docType}-explanation"
							bind:value={caseDetails.documents[docType].explanation}
							class="w-full rounded-lg border p-2"
							rows="2"
							placeholder="Provide explanation for missing document"
						></textarea>
					{/if}
				</div>
			{/each}

			<!-- 🔹 Additional Documents -->
			<h3 class="mt-6 text-lg font-semibold">Additional Documents</h3>

			<!-- Upload & Add Additional Document -->
			<div class="grid grid-cols-10 gap-4">
				<input
					id="additional-file"
					type="file"
					on:change={(event) => (newAdditionalDoc.file = event.target.files[0].name)}
					class="col-span-3 rounded-lg border p-2"
				/>
				<input
					id="additional-type"
					type="text"
					bind:value={newAdditionalDoc.type}
					placeholder="Document Type"
					class="col-span-3 rounded-lg border p-2"
				/>
				<input
					id="additional-notes"
					type="text"
					bind:value={newAdditionalDoc.notes}
					placeholder="Notes (Optional)"
					class="col-span-3 rounded-lg border p-2"
				/>
				<button
					on:click={addAdditionalDocument}
					class="col-span-1 rounded bg-[var(--color-primary)] px-3 py-1 text-white hover:bg-opacity-80"
				>
					Add
				</button>
			</div>

			<!-- Additional Documents Table -->
			{#if caseDetails.documents.additionalDocs.length > 0}
				<div class="mt-4 max-h-[20vh] overflow-y-auto rounded-lg border">
					<table class="w-full bg-white text-sm shadow-md">
						<thead class="sticky top-0 bg-gray-200 text-sm font-semibold">
							<tr>
								<th class="p-3 text-left">File Name</th>
								<th class="p-3 text-left">Type</th>
								<th class="p-3 text-left">Notes</th>
								<th class="p-3 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each caseDetails.documents.additionalDocs as doc, index}
								<tr class="border-t">
									<td class="p-3 text-sm">{doc.file}</td>
									<td class="p-3 text-sm">{doc.type}</td>
									<td class="p-3 text-sm">{doc.notes}</td>
									<td class="p-3 text-sm">
										<button
											on:click={() => removeAdditionalDocument(index)}
											class="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
										>
											Remove
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- Navigation -->
			<div class="mt-6 flex justify-between">
				<button on:click={prevStep} class="rounded bg-gray-500 px-4 py-2 text-white">Back</button>
				<button on:click={nextStep} class="rounded bg-[var(--color-primary)] px-4 py-2 text-white">
					Next
				</button>
			</div>
		{:else if currentStep === totalSteps}
			<h2 class="mb-4 text-xl font-bold">Acknowledgment</h2>
			<!-- Placeholder for Acknowledgment Section -->
		{/if}
	</div>
</div>
