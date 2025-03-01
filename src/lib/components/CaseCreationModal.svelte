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
</script>

<!-- Case Creation Modal -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
		<!-- Progress Bar -->
		<div class="sticky top-0 mb-4 w-full rounded-full bg-gray-200">
			<div
				class="rounded-full bg-[var(--color-primary)] p-1 text-center text-xs leading-none text-white"
				style="width: {(currentStep / totalSteps) * 100}%"
			>
				Step {currentStep} of {totalSteps}
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
			<!-- Placeholder for Step 4 Content -->
		{:else if currentStep === 5}
			<h2 class="mb-4 text-xl font-bold">Additional Information</h2>
			<!-- Placeholder for Step 5 Content -->
		{:else if currentStep === totalSteps}
			<h2 class="mb-4 text-xl font-bold">Acknowledgment</h2>
			<!-- Placeholder for Acknowledgment Section -->
		{/if}
	</div>
</div>
