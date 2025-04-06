<script>
	import { onMount } from 'svelte';
	import { getAllRecords } from '$lib/localStorage';
	import { auth } from '$lib/stores/auth';
	import CaseCreationModal from '$lib/components/CaseCreationModal.svelte';

	let user = null;
	let showModal = false;
	let allCases = [];
	let filteredCases = [];
	let clients = [];
	let users = [];
	let tenants = [];
	let properties = [];

	let statusFilter = '';
	let subStatusFilter = '';
	let attorneyFilter = '';
	let assigneeFilter = '';
	let searchTerm = '';

	onMount(() => {
		auth.subscribe((value) => {
			user = value?.user;
			if (user) loadData();
		});
	});

	function openCaseModal() {
		showModal = true;
	}

	function closeCaseModal() {
		showModal = false;
	}

	function loadData() {
		if (!user || !user.role) return [];
		const all = getAllRecords('caseRecords', user);
		clients = getAllRecords('clients', user);
		users = getAllRecords('users', user);
		tenants = getAllRecords('tenants', user);
		properties = getAllRecords('properties', user);

		allCases = all.filter((c) => {
			if (user.role === 'admin') return true;
			if (user.role === 'client') return c.client_id === user.client_id;
			if (user.role === 'attorney') return false;
			if (user.role === 'operator') return c.assigned_operator === user.id;
			return false;
		});

		filteredCases = allCases;
	}

	function getClientName(id) {
		return clients.find((c) => c._id === id)?.internal_name || 'Unknown';
	}

	function getUserName(id) {
		return users.find((u) => u._id === id)?.full_name || 'Unassigned';
	}

	function getTenantName(id) {
		return tenants.find((t) => t._id === id)?.full_name || 'Unknown';
	}

	function getPropertyAddress(id) {
		const property = properties.find((p) => p._id === id);
		if (!property || !property.address) return 'Unknown';
		const { streetNumber, streetName, unitNumber, city, state } = property.address;
		const unit = unitNumber ? ` Unit ${unitNumber}` : '';
		return `${streetNumber} ${streetName}${unit}, ${city}, ${state}`;
	}

	function getJurisdiction(id) {
		return properties.find((p) => p._id === id)?.address?.jurisdiction || 'Unknown';
	}

	function applyFilters() {
		filteredCases = allCases.filter((c) => {
			return (
				(!statusFilter || c.status === statusFilter) &&
				(!subStatusFilter || c.sub_status === subStatusFilter) &&
				(!attorneyFilter || c.assigned_attorney === attorneyFilter) &&
				(!assigneeFilter || c.assigned_operator === assigneeFilter) &&
				(!searchTerm ||
					getTenantName(c.tenant_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
					getPropertyAddress(c.property_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
					getClientName(c.client_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
					getJurisdiction(c.property_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
					c.case_number.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		});
	}
</script>

<section class="space-y-4">
	<!-- Search Bar + Conditional New Filing Button -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class={user?.role === 'attorney' ? 'w-full' : 'flex-grow'}>
			<input
				type="text"
				placeholder="Search by case number, tenant name, property address, or jurisdiction"
				bind:value={searchTerm}
				on:input={applyFilters}
				class="form-input w-full"
			/>
		</div>

		{#if user?.role !== 'attorney'}
			<button
				class="mt-2 rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 md:mt-0"
				on:click={openCaseModal}
			>
				New Filing
			</button>
		{/if}
	</div>

	<!-- Inline Filters -->
	<div class="flex items-center gap-2 text-sm">
		<span class="whitespace-nowrap text-sm text-gray-600">Filters:</span>
		<select bind:value={statusFilter} on:change={applyFilters} class="form-input text-xs">
			<option value="">All Statuses</option>
			<option value="Demand Posted">Demand Posted</option>
			<option value="Court Date">Court Date</option>
			<option value="Eviction">Eviction</option>
			<option value="Writ">Writ</option>
			<option value="Dismissed">Dismissed</option>
		</select>

		<select bind:value={subStatusFilter} on:change={applyFilters} class="form-input text-xs">
			<option value="">All Sub-Statuses</option>
			<option value="To Be Scheduled">To Be Scheduled</option>
			<option value="Completed">Completed</option>
			<option value="Date Requested">Date Requested</option>
			<option value="Dismissed – Paid">Dismissed – Paid</option>
		</select>

		{#if user?.role === 'admin' || user?.role === 'operations'}
			<select bind:value={attorneyFilter} on:change={applyFilters} class="form-input text-xs">
				<option value="">All Attorneys</option>
				{#each users.filter((u) => u.role === 'attorney') as u}
					<option value={u._id}>{u.full_name}</option>
				{/each}
			</select>

			<select bind:value={assigneeFilter} on:change={applyFilters} class="form-input text-xs">
				<option value="">All Assignees</option>
				{#each users.filter((u) => u.role === 'operations') as u}
					<option value={u._id}>{u.full_name}</option>
				{/each}
			</select>
		{/if}
	</div>

	<!-- Table -->
	<table class="table-standard w-full border text-sm shadow-sm">
		<thead>
			<tr>
				<th>Case #</th>
				<th>Status</th>
				<th>Sub-Status</th>
				<th>Tenant</th>
				<th>Address</th>
				<th>Jurisdiction</th>
				<th>Attorney</th>
				<th>Assignee</th>
				<th>Client</th>
			</tr>
		</thead>
		<tbody>
			{#each filteredCases as file, i}
				<tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
					<td>
						<a href={`/cases/${file._id}`} class="text-blue-600 hover:underline">
							{file.case_number}
						</a>
					</td>
					<td>{file.status}</td>
					<td>{file.sub_status}</td>
					<td>{getTenantName(file.tenant_id)}</td>
					<td>{getPropertyAddress(file.property_id)}</td>
					<td>{getJurisdiction(file.property_id)}</td>
					<td>{getUserName(file.assigned_attorney)}</td>
					<td>{getUserName(file.assigned_operator)}</td>
					<td>{getClientName(file.client_id)}</td>
				</tr>
			{/each}
			{#if filteredCases.length === 0}
				<tr>
					<td colspan="9" class="px-3 py-4 text-center text-gray-500">No cases found.</td>
				</tr>
			{/if}
		</tbody>
	</table>
</section>

<!-- Case Creation Modal -->
{#if showModal}
	<CaseCreationModal on:close={closeCaseModal} />
{/if}
