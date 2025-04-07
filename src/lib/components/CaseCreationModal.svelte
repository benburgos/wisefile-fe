<script>
	import { caseRecords } from '$lib/data/seedData';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { createRecord, updateRecord, getAllRecords } from '$lib/localStorage';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();

	// Step Handling
	let currentStep = 1;
	let totalSteps = 6;
	let isSubmitting = false;

	function nextStep() {
		if (currentStep < totalSteps) currentStep++;
		console.log(caseDetails);
	}
	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	// Authenticated user & data
	let user;
	let clients = [];
	let users = [];
	let tenants = [];
	// Filter tenants based on selected property
	$: derivedTenants = (() => {
		if (!caseDetails.addressId || caseDetails.addressId === 'new') return [];

		const property = properties.find((p) => p._id === caseDetails.addressId);
		if (!property || !property.associated_tenants?.length) return [];

		return tenants.filter((t) => property.associated_tenants.includes(t._id));
	})();
	let properties = [];
	let allCases = [];
	let userDrafts = [];
	let managementCompanies = [];
	let originalTenantAddress = '';

	onMount(() => {
		auth.subscribe((value) => {
			user = value?.user;
			if (user) loadData();
		});
	});

	function loadData() {
		if (!user || !user.role) return;

		// Load and filter records
		const all = getAllRecords('caseRecords', user);
		clients = getAllRecords('clients').filter((c) => c._id === user.clientId);
		const allUsers = getAllRecords('users');
		// Base users: those with company_id matching current client
		const directUsers = allUsers.filter((u) => u.company_id === user.clientId);

		// Extra users: from management_companies[*].users
		let extraUserIds = [];
		if (clients.length > 0) {
			const mcList = clients[0].management_companies || [];
			extraUserIds = mcList.flatMap((mc) => mc.users || []);
		}

		// Map extra users from full list (if not already included)
		const extraUsers = allUsers.filter(
			(u) => extraUserIds.includes(u.id) && !directUsers.some((du) => du.id === u.id)
		);

		// Combine and deduplicate
		users = [...directUsers, ...extraUsers];
		tenants = getAllRecords('tenants').filter((t) => t.client_id === user.clientId);
		properties = getAllRecords('properties').filter((p) => p.client_id === user.clientId);

		// Filter cases based on role
		allCases = all.filter((c) => {
			if (user.role === 'admin') return true;
			if (user.role === 'client') return c.client_id === user.clientId;
			if (user.role === 'attorney') return false;
			if (user.role === 'operations') return c.assigned_operator === user.id;
			return false;
		});

		// Pull out draft cases
		userDrafts = allCases.filter((c) => c.type === 'draft');

		// Load temporary documents the user has uploaded
		const allDocuments = getAllRecords('documents', user);
		const draftDocs = allDocuments.filter(
			(doc) => doc.is_temporary && !doc.is_deleted && doc.uploaded_by === user.id
		);

		// Separate standard required docs
		['lease', 'ledger', 'demand', 'ownershipDeed'].forEach((docType) => {
			const match = draftDocs.find((d) => d.type.toLowerCase() === docType);
			if (match) {
				caseDetails.documents[docType] = {
					file: match.name || '',
					status: match.status || '',
					explanation: match.notes || ''
				};
			}
		});

		// Load additional documents
		caseDetails.documents.additionalDocs = draftDocs.filter(
			(doc) => !['lease', 'ledger', 'demand', 'ownershipdeed'].includes(doc.type.toLowerCase())
		);

		// Get management companies from the first (and only) client
		if (clients.length > 0) {
			const mcList = clients[0].management_companies || [];
			managementCompanies = mcList.map((mc) => mc.name);
		}
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
			gateCode: '',
			propertyCode: ''
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
		},
		acknowledgment: {
			rentalReliefConfirmed: false, // User confirms understanding of rental relief
			statementsConfirmed: false // User affirms the accuracy of statements
		}
	};

	// Handle Address Selection (Step 1)
	function handleAddressSelection(event) {
		const selectedValue = event.target.value;

		if (selectedValue === 'new') {
			caseDetails.newAddress = {
				streetNumber: '',
				streetName: '',
				unitNumber: '',
				postalCode: '',
				city: '',
				state: '',
				jurisdiction: '',
				gateCode: '',
				propertyCode: ''
			};
			caseDetails.addressId = 'new';
			caseDetails.formattedAddress = 'Adding New Address...';
			originalTenantAddress = caseDetails.formattedAddress;
			caseDetails.tenant.address.formatted = caseDetails.formattedAddress;
			caseDetails.plaintiff.propertyId = '';
			caseDetails.tenant.address = { formatted: '' };
		} else {
			const selectedProperty = properties.find((p) => p._id === selectedValue);
			if (selectedProperty) {
				const a = selectedProperty.address;
				const unit = a.unitNumber ? `Unit ${a.unitNumber}, ` : '';
				const formatted = `${a.streetNumber} ${a.streetName}, ${unit}${a.city}, ${a.state}, ${a.postalCode}`;

				caseDetails.addressId = selectedProperty._id;
				caseDetails.formattedAddress = formatted;
				originalTenantAddress = caseDetails.formattedAddress;
				caseDetails.tenant.address.formatted = caseDetails.formattedAddress;
				caseDetails.plaintiff.propertyId = selectedProperty.property_code || '';
				caseDetails.tenant.address = { ...a, formatted };
			}
		}
	}

	// Save New Address (Step 1)
	function saveNewAddress() {
		const newId = crypto.randomUUID();
		const a = caseDetails.newAddress;
		const unit = a.unitNumber ? `Unit ${a.unitNumber}, ` : '';
		const formatted = `${a.streetNumber} ${a.streetName}, ${unit}${a.city}, ${a.state}, ${a.postalCode}`;

		const newProperty = {
			_id: newId,
			client_id: user.clientId,
			property_code: a.propertyCode,
			unit_count: 1,
			is_commercial: false,
			occupancy_status: 'occupied',
			address: { ...a },
			associated_tenants: [],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			is_active: true,
			management_company: caseDetails.plaintiff.managementCompany || ''
		};

		createRecord('properties', newProperty, user);
		properties = getAllRecords('properties', user);

		caseDetails.addressId = newId;
		caseDetails.formattedAddress = formatted;
		originalTenantAddress = caseDetails.formattedAddress;
		caseDetails.tenant.address.formatted = caseDetails.formattedAddress;
		caseDetails.plaintiff.propertyId = a.propertyCode || '';
		caseDetails.tenant.address = { ...a, formatted };
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
		const selectedUser = users.find((u) => u._id == event.target.value);
		if (!selectedUser) return;

		caseDetails.plaintiff.primaryContact = selectedUser.name;
		caseDetails.plaintiff.primaryContactPhone = selectedUser.phone_number;
		caseDetails.plaintiff.primaryContactEmail = selectedUser.email;

		// Add user to the selected management company if not already included
		const client = clients[0];
		const selectedMCName = caseDetails.plaintiff.managementCompany;
		const selectedMC = client.management_companies?.find((mc) => mc.name === selectedMCName);

		if (selectedMC && !selectedMC.users.includes(selectedUser.id)) {
			selectedMC.users.push(selectedUser._id);
			selectedMC.updated_at = new Date().toISOString();

			updateRecord('clients', client._id, client, user);
		}
	}

	function saveNewManagementCompany() {
		if (!caseDetails.plaintiff.newManagementCompany.trim()) return;

		const newId = crypto.randomUUID();

		// Find the selected user, if one exists
		const selectedUser = users.find((u) => u.name === caseDetails.plaintiff.primaryContact);
		const userId = selectedUser?.id || null;

		// Create the new management company
		const newMC = {
			_id: newId,
			name: caseDetails.plaintiff.newManagementCompany,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			users: userId ? [userId] : []
		};

		const client = clients[0];

		// Update the client object
		const updatedClient = {
			...client,
			management_companies: [...(client.management_companies || []), newMC],
			updated_at: new Date().toISOString()
		};

		updateRecord('clients', client._id, updatedClient, user);

		// Rehydrate managementCompanies dropdown
		loadData();

		// Set selected management company and clear the input
		caseDetails.plaintiff.managementCompany = newMC.name;
		caseDetails.plaintiff.newManagementCompany = '';
	}

	// New tenant object
	let newTenant = {
		firstName: '',
		middleName: '',
		lastName: '',
		email: '',
		phone: ''
	};

	function getFullName(tenant) {
		const parts = [tenant.firstName, tenant.middleName, tenant.lastName].filter(Boolean);
		return parts.join(' ');
	}

	function addTenant() {
		if (newTenant.firstName.trim() && newTenant.lastName.trim()) {
			const fullName = getFullName(newTenant);

			const tenantWithCode = {
				_id: crypto.randomUUID(),
				client_id: user.clientId,
				full_name: fullName,
				contact_info: {
					email: newTenant.email || '',
					phone: newTenant.phone || ''
				},
				associated_properties: [caseDetails.addressId],
				tenant_code: caseDetails.tenant.tenantCode || '',
				is_active: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			caseDetails.tenant.tenants = [...caseDetails.tenant.tenants, tenantWithCode];

			newTenant = {
				firstName: '',
				middleName: '',
				lastName: '',
				email: '',
				phone: ''
			};
		}
	}

	function removeTenant(index) {
		caseDetails.tenant.tenants = caseDetails.tenant.tenants.filter((_, i) => i !== index);
	}

	function toggleTenantCheckbox(tenant) {
		const exists = caseDetails.tenant.tenants.some((t) => t._id === tenant._id);

		if (exists) {
			caseDetails.tenant.tenants = caseDetails.tenant.tenants.filter((t) => t._id !== tenant._id);
		} else {
			const nameParts = tenant.full_name?.split(' ') || [];

			caseDetails.tenant.tenants = [
				...caseDetails.tenant.tenants,
				{
					firstName: nameParts[0] || '',
					middleName: '',
					lastName: nameParts.slice(1).join(' ') || '',
					email: tenant.contact_info?.email || '',
					phone: tenant.contact_info?.phone || '',
					_id: tenant._id,
					full_name: tenant.full_name || tenant.name || ''
				}
			];
		}

		// Update shared tenantCode based on first selected tenant who has one
		const firstWithCode = tenants.find((t) =>
			caseDetails.tenant.tenants.some((sel) => sel._id === t._id && t.tenant_code)
		);

		caseDetails.tenant.tenantCode = firstWithCode?.tenant_code || '';
	}

	function syncTenantPropertyRelationships() {
		if (!caseDetails.addressId || !caseDetails.tenant.tenants.length) return;

		const selectedProperty = properties.find((p) => p._id === caseDetails.addressId);
		if (!selectedProperty) return;

		const tenantIds = caseDetails.tenant.tenants.map((t) => t._id);

		// Update the selected property with associated tenant IDs
		const updatedTenantList = Array.from(
			new Set([...(selectedProperty.associated_tenants || []), ...tenantIds])
		);
		selectedProperty.associated_tenants = updatedTenantList;
		selectedProperty.updated_at = new Date().toISOString();

		updateRecord('properties', selectedProperty._id, selectedProperty, user);

		// Update each tenant with associated property ID
		tenantIds.forEach((tid) => {
			const tenant = tenants.find((t) => t._id === tid);
			if (!tenant) return;

			const updatedProps = Array.from(
				new Set([...(tenant.associated_properties || []), caseDetails.addressId])
			);
			tenant.associated_properties = updatedProps;
			tenant.updated_at = new Date().toISOString();

			updateRecord('tenants', tenant._id, tenant, user);
		});

		// Assign first tenant’s ID to the caseDetails.tenant.tenant_id (future prep)
		if (tenantIds.length > 0) {
			caseDetails.tenant.tenant_id = tenantIds[0];
		}
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
		if (!file || !user) return;

		const tempId = crypto.randomUUID();
		const documentRecord = {
			_id: tempId,
			client_id: user.clientId,
			case_id: null, // Assigned later
			type,
			name: file.name,
			file_path: `/temp/${file.name}`, // Placeholder if not uploaded to backend
			file_url: '', // Placeholder
			file_size: file.size,
			file_type: file.type,
			uploaded_by: user.id,
			uploaded_at: new Date(),
			updated_at: new Date(),
			tags: [],
			notes: '',
			is_confidential: false,
			is_deleted: false,
			is_temporary: true
		};

		// Save to localStorage for now
		createRecord('documents', documentRecord, user);

		// Store filename in caseDetails for UI binding
		caseDetails.documents[type].file = file.name;
	}

	function handleDocumentStatus(type, event) {
		caseDetails.documents[type].status = event.target.value;
	}

	let newAdditionalDoc = { file: '', type: '', notes: '' };

	function addAdditionalDocument() {
		if (!newAdditionalDoc.file || !newAdditionalDoc.type) return;

		const newDoc = {
			_id: crypto.randomUUID(),
			client_id: user.clientId,
			case_id: null,
			type: newAdditionalDoc.type,
			name: newAdditionalDoc.file,
			notes: newAdditionalDoc.notes,
			file_path: `/temp/${newAdditionalDoc.file}`,
			file_url: '', // Add if you want previews later
			file_size: 0,
			file_type: '', // could use MIME if you're parsing the File object
			uploaded_by: user.id,
			uploaded_at: new Date(),
			updated_at: new Date(),
			tags: [],
			is_confidential: false,
			is_deleted: false,
			is_temporary: true // ← important
		};

		createRecord('documents', newDoc, user);

		// Also add to local state for immediate display
		caseDetails.documents.additionalDocs = [...caseDetails.documents.additionalDocs, newDoc];

		// Reset fields
		newAdditionalDoc = { file: '', type: '', notes: '' };
		document.getElementById('additional-file').value = '';
	}

	function removeAdditionalDocument(index) {
		caseDetails.documents.additionalDocs = caseDetails.documents.additionalDocs.filter(
			(_, i) => i !== index
		);
	}

	function saveAsDraft() {
		const draftId = caseDetails._id || crypto.randomUUID();

		caseDetails._id = draftId;
		caseDetails.client_id = user.clientId;
		caseDetails.created_at = caseDetails.created_at || new Date().toISOString();
		caseDetails.updated_at = new Date().toISOString();
		caseDetails.type = 'draft';

		createRecord('caseRecords', caseDetails, user);
	}

	function submitCase() {
		if (
			!caseDetails.acknowledgment.rentalReliefConfirmed ||
			!caseDetails.acknowledgment.statementsConfirmed
		) {
			alert('You must acknowledge both statements before submitting.');
			return;
		}

		isSubmitting = true;

		// Disable the submit button to prevent multiple submissions
		document.getElementById('submit-button').disabled = true;

		try {
			// 1. Assign unique ID and timestamps
			const caseId = crypto.randomUUID();
			caseDetails._id = caseId;
			caseDetails.client_id = user.clientId;
			caseDetails.created_at = new Date().toISOString();
			caseDetails.updated_at = new Date().toISOString();
			caseDetails.type = 'case'; // Not a draft anymore

			// 2. Finalize Documents
			const allDocs = getAllRecords('documents', user);
			const draftDocs = allDocs.filter(
				(doc) => doc.is_temporary && !doc.is_deleted && doc.uploaded_by === user.id
			);

			draftDocs.forEach((doc) => {
				doc.case_id = caseId;
				doc.is_temporary = false;
				doc.updated_at = new Date().toISOString();
				updateRecord('documents', doc._id, doc, user);
			});

			// 3. Update Tenants
			const property = getAllRecords('properties', user).find(
				(p) => p._id === caseDetails.addressId
			);
			caseDetails.tenant.tenants.forEach((tenant) => {
				tenant.full_name = getFullName(tenant);
				tenant.client_id = user.clientId;
				tenant._id = tenant._id || crypto.randomUUID();
				tenant.created_at = new Date().toISOString();
				tenant.updated_at = new Date().toISOString();
				tenant.is_active = true;
				tenant.associated_properties = [caseDetails.addressId];

				// Forwarding address logic
				if (caseDetails.tenant.address.formatted !== caseDetails.formattedAddress) {
					tenant.forwarding_address = { ...caseDetails.tenant.address };
				}

				createRecord('tenants', tenant, user);

				if (!property.associated_tenants.includes(tenant._id)) {
					property.associated_tenants.push(tenant._id);
				}
			});

			// Update property with new tenant associations
			property.updated_at = new Date().toISOString();
			updateRecord('properties', property._id, property, user);

			// 4. Save the case
			createRecord('caseRecords', caseDetails, user);

			goto(`/cases/${caseId}`);
		} catch (error) {
			console.error('Error submitting case:', error);
			alert('There was a problem submitting the case. Please try again.');
		} finally {
			isSubmitting = false;
			// Re-enable the submit button
			document.getElementById('submit-button').disabled = false;
		}
	}

	function closeModal() {
		dispatch('close');

		// Optional: reset everything only if not navigating back to a saved draft
		caseDetails = {
			caseType: '',
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
				gateCode: '',
				propertyCode: ''
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
				additionalDocs: []
			},
			acknowledgment: {
				rentalReliefConfirmed: false,
				statementsConfirmed: false
			}
		};
	}
</script>

<!-- Case Creation Modal -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
		<!-- Sticky Progress Bar with Background -->
		<div class="sticky top-0 z-10 mb-4 w-full">
			<div class="rounded-full bg-gray-200 p-2">
				<div
					class="rounded-full bg-gray-600 p-1 text-center text-xs leading-none text-white"
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
				{#each properties as property}
					<option value={property._id}>
						{property.address.streetNumber}
						{property.address.streetName}, {property.address.city}, {property.address.state}, {property
							.address.postalCode}
					</option>
				{/each}
			</select>

			{#if userDrafts.length > 0}
				<h2 class="my-4 text-xl font-bold">Continue Saved Draft</h2>
				<select
					id="draft-select"
					on:change={(e) => {
						const selectedId = e.target.value;
						const draft = userDrafts.find((c) => c.id === selectedId);
						if (draft) {
							caseDetails = structuredClone(draft);
							currentStep = 2; // Jump to the next step with draft data
						}
					}}
					class="w-full rounded-lg border p-2"
				>
					<option value="" disabled selected>Select a draft</option>
					{#each userDrafts as draft}
						<option value={draft.id}>{draft.fileName ?? 'Draft ' + draft.id}</option>
					{/each}
				</select>
			{/if}

			{#if caseDetails.addressId === 'new'}
				<div class="mt-4 rounded-lg bg-gray-100 p-4">
					<h3 class="mb-2 text-lg font-semibold">Add New Address</h3>
					<label for="propertyCode" class="mt-2 block font-semibold">Property Code</label>
					<input
						id="propertyCode"
						bind:value={caseDetails.newAddress.propertyCode}
						class="w-full rounded-lg border p-2"
					/>
					<div class="grid grid-cols-2 gap-4">
						<!-- Left Column -->
						<div>
							<label for="streetNumber" class="mt-2 block font-semibold">Street Number</label>
							<input
								id="streetNumber"
								bind:value={caseDetails.newAddress.streetNumber}
								class="w-full rounded-lg border p-2"
							/>

							<label for="streetName" class="mt-2 block font-semibold">Street Name</label>
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
						<button on:click={saveNewAddress} class="rounded bg-gray-800 px-4 py-2 text-white">
							Save & Continue
						</button>
					</div>
				</div>
			{/if}

			<div class="mt-6 flex justify-between">
				<button on:click={closeModal}>Cancel</button>

				<button on:click={nextStep} class="rounded bg-gray-800 px-4 py-2 text-white">Next</button>
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
				value={clients[0].legal_entity}
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
							on:click={saveNewManagementCompany}
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
				disabled
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
					<option value={user._id}>{user.full_name}</option>
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
			<!-- Existing Tenants Checkbox List -->
			{#if properties.length && caseDetails.addressId && derivedTenants.length > 0}
				<!-- Select Existing Tenants -->
				<fieldset class="mb-4">
					<legend class="mb-2 block font-semibold">Select Existing Tenant(s)</legend>

					<!-- Scrollable List -->
					<div class="max-h-40 divide-y divide-gray-200 overflow-y-auto rounded-md border">
						{#each derivedTenants as tenant (tenant._id)}
							<label
								for={`tenant-${tenant._id}`}
								class="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-50"
							>
								<div class="flex items-center gap-2">
									<input
										id={`tenant-${tenant._id}`}
										type="checkbox"
										value={tenant._id}
										checked={caseDetails.tenant.tenants.some((t) => t._id === tenant._id)}
										on:change={() => toggleTenantCheckbox(tenant)}
										class="h-4 w-4"
									/>
									<span class="text-sm">{tenant.full_name}</span>
								</div>
							</label>
						{/each}
					</div>
				</fieldset>
			{/if}

			<!-- Tenant Address (Editable) -->
			<label for="tenant-address" class="block font-semibold">Tenant Address</label>
			<input
				id="tenant-address"
				bind:value={caseDetails.tenant.address.formatted}
				class="w-full rounded-lg border p-2"
				on:input={(e) => {
					const newVal = e.target.value;
					caseDetails.tenant.address.formatted = newVal;
					if (newVal !== originalTenantAddress) {
						caseDetails.tenant.forwarding_address = { formatted: newVal };
					} else {
						caseDetails.tenant.forwarding_address = null;
					}
				}}
			/>

			<!-- Tenant Code -->
			<label for="tenant-code" class="block font-semibold">Tenant Code</label>
			<input
				id="tenant-code"
				bind:value={caseDetails.tenant.tenantCode}
				class="w-full rounded-lg border p-2"
				readonly={caseDetails.tenant.tenants.length > 0}
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

			<h3 class="mb-2 text-lg font-semibold">Tenant(s) List</h3>
			<div class="grid grid-cols-6 gap-4">
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
					<label for="tenant-email" class="block font-semibold">Email</label>
					<input
						id="tenant-email"
						bind:value={newTenant.email}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="tenant-phone" class="block font-semibold">Phone</label>
					<input
						id="tenant-phone"
						bind:value={newTenant.phone}
						class="w-full rounded-lg border p-2"
					/>
				</div>
			</div>

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
						<thead class="sticky top-0 z-10 bg-gray-200 text-sm font-semibold">
							<tr>
								<th class="p-3 text-left">First Name</th>
								<th class="p-3 text-left">Middle Name</th>
								<th class="p-3 text-left">Last Name</th>
								<th class="p-3 text-left">Email</th>
								<th class="p-3 text-left">Phone</th>
								<th class="p-3 text-left">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each caseDetails.tenant.tenants as tenant, index}
								<tr class="border-t">
									<td class="p-2">{tenant.firstName}</td>
									<td class="p-2">{tenant.middleName}</td>
									<td class="p-2">{tenant.lastName}</td>
									<td class="p-2">{tenant.email}</td>
									<td class="p-2">{tenant.phone}</td>
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
					<small class="mb-2 block text-gray-500">We'll default to the 1st of the month</small>
					<input
						id="unpaid-date"
						type="date"
						class="w-full rounded-lg border p-2"
						value={caseDetails.rentFeesClaims.currentMonthUnpaidDate}
						on:change={(e) => {
							const date = new Date(e.target.value);
							if (!isNaN(date)) {
								const normalized = new Date(date.getFullYear(), date.getMonth(), 1);
								caseDetails.rentFeesClaims.currentMonthUnpaidDate = normalized
									.toISOString()
									.split('T')[0];
							}
						}}
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
			<h2 class="mb-4 text-xl font-bold">Acknowledgment & Submission</h2>

			<!-- Subheading -->
			<h3 class="mb-2 text-lg font-semibold">
				Attestation of Compliance with Rental Relief Programs and Filing Accuracy
			</h3>

			<!-- Attestation Text -->
			<p class="mb-4 border-l-4 border-gray-400 pl-4 text-sm leading-relaxed text-gray-700">
				To assure you can file the contemplated eviction case please acknowledge that you have
				reviewed whether the above resident(s) are pending or participating in a Rental Relief
				Program, which may limit your ability to file this case. Please acknowledge that you have:
				<br />1. A detailed understanding of any current or pending rental relief programs related
				to the above listed resident(s).
				<br />2. Are aware of no limitations placed upon the ability of the property owner,
				management company or any other party to file the eviction case.
				<br />3. You understand that if you have any questions, concerns or require additional
				guidance you should not file this case until you have consulted with your attorney or
				company resources with knowledge to clarify such matters.
				<br /><br />
				You also hereby affirm and attest that the statements set forth in this filing are true and correct.
				<br /><br />
				By clicking the boxes below, you are acknowledging and certifying that the resident(s) is/are
				eligible to have an eviction case filed against them and are not subject to limitation for any
				reason.
			</p>

			<!-- Checkbox Section -->
			<div class="mt-4 space-y-3">
				<!-- Checkbox 1: Rental Relief Compliance -->
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="rental-relief-checkbox"
						bind:checked={caseDetails.acknowledgment.rentalReliefConfirmed}
						class="mt-1 h-5 w-5 rounded border-gray-300 focus:ring-[var(--color-primary)]"
					/>
					<label for="rental-relief-checkbox" class="text-sm leading-relaxed text-gray-700">
						I acknowledge and certify compliance with rental relief program guidelines.
					</label>
				</div>

				<!-- Checkbox 2: Filing Accuracy -->
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="filing-accuracy-checkbox"
						bind:checked={caseDetails.acknowledgment.statementsConfirmed}
						class="mt-1 h-5 w-5 rounded border-gray-300 focus:ring-[var(--color-primary)]"
					/>
					<label for="filing-accuracy-checkbox" class="text-sm leading-relaxed text-gray-700">
						<strong>{caseDetails.plaintiff.primaryContact}</strong> hereby affirms signature for the
						associated electronic document(s) and attests that the statements set forth in this filing
						are true and correct.
					</label>
				</div>
			</div>

			<!-- Navigation & Submission -->
			<div class="mt-6 flex justify-between">
				<button on:click={prevStep} class="rounded bg-gray-500 px-4 py-2 text-white"> Back </button>

				<button
					on:click={submitCase}
					class="relative flex items-center justify-center rounded bg-[var(--color-primary)] px-4 py-2 text-white disabled:opacity-60"
					disabled={!caseDetails.acknowledgment.rentalReliefConfirmed ||
						!caseDetails.acknowledgment.statementsConfirmed ||
						isSubmitting}
				>
					{#if isSubmitting}
						<!-- Spinner -->
						<svg
							class="h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
					{:else}
						Submit Case
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>
