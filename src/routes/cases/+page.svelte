<script>
	import { onMount } from 'svelte';
	import { getStoredData, saveToLocalStorage } from '$lib/utils/storage';
	import { auth } from '$lib/stores/auth';
	import CaseCreationModal from '$lib/components/CaseCreationModal.svelte';

	let userRole = null;
	let userClientId = null;
	let cases = [];
	let showModal = false;
	let searchQuery = '';

	// Subscribe to auth store
	auth.subscribe((user) => {
		if (user) {
			userRole = user.role;
			userClientId = user.company_id;
		}
	});

	// Load Cases on Mount
	onMount(() => {
		const storedData = getStoredData();

		if (storedData && storedData.caseDetails) {
			// Role-based filtering
			cases =
				userRole === 'admin' || userRole === 'ops'
					? storedData.caseDetails.filter((c) => !c.deleted) // Show all active cases
					: storedData.caseDetails.filter((c) => c.company_id === userClientId && !c.deleted); // Show client's cases only
			// Presort Open Cases first (oldest to newest)
			cases.sort((a, b) => {
				if (a.status === 'Open' && b.status !== 'Open') return -1;
				if (a.status !== 'Open' && b.status === 'Open') return 1;
				return new Date(a.createdAt) - new Date(b.createdAt);
			});
		}
	});

	// Open/Close Case Modal
	function openCaseModal() {
		showModal = true;
	}
	function closeCaseModal() {
		showModal = false;
	}

	// Soft Delete Case
	function deleteCase(caseId) {
		if (confirm('Are you sure you want to delete this case?')) {
			cases = cases.map((c) => (c._id === caseId ? { ...c, deleted: true } : c));
			const storedData = getStoredData();
			storedData.caseDetails = cases;
			saveToLocalStorage(storedData);
		}
	}

	// Filter Cases Based on Search Query
	function filteredCases() {
		return cases.filter((c) =>
			`${c.caseNumber} ${c.plaintiff.name} ${c.status} ${c.subStatus} ${c.newAddress.state}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	}

	$: displayedCases = cases.filter((c) =>
		`${c.caseNumber} ${c.plaintiff.name} ${c.status} ${c.subStatus} ${c.newAddress.state}`
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);
</script>

<section class="p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>
		<button
			on:click={openCaseModal}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white"
		>
			New Filing or Collection
		</button>
	</div>

	<!-- Search Bar -->
	<input
		type="text"
		placeholder="Search cases..."
		class="mb-4 w-full rounded-lg border px-4 py-2"
		bind:value={searchQuery}
	/>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white text-sm shadow-md">
			<thead class="bg-gray-200 text-sm font-semibold">
				<tr>
					<th class="p-2 text-left">Case #</th>
					<th class="p-2 text-left">Type</th>
					<th class="p-2 text-left">Status</th>
					<th class="p-2 text-left">Sub-Status</th>
					<th class="p-2 text-left">Balance</th>
					<th class="p-2 text-left">Address</th>
					<th class="p-2 text-left">State</th>
					<th class="p-2 text-left">Jurisdiction</th>
					<th class="p-2 text-left">Client</th>
					{#if userRole === 'admin' || userRole === 'ops'}
						<th class="p-2 text-left">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each displayedCases as caseDetail}
					<tr class="border-t">
						<td class="p-2">{caseDetail.caseNumber}</td>
						<td class="p-2">{caseDetail.caseType}</td>
						<td class="p-2">{caseDetail.status}</td>
						<td class="p-2">{caseDetail.subStatus}</td>
						<td class="p-2 font-semibold text-green-600">
							${caseDetail.fees.reduce((total, fee) => total + fee.amount, 0).toFixed(2)}
						</td>
						<td class="p-2">
							{caseDetail.newAddress.streetNumber} {caseDetail.newAddress.streetName}
							{caseDetail.newAddress.unitNumber ? `, ${caseDetail.newAddress.unitNumber}` : ''}
						</td>
						<td class="p-2">{caseDetail.newAddress.state}</td>
						<td class="p-2">{caseDetail.newAddress.jurisdiction}</td>
						<td class="p-2">{caseDetail.plaintiff.name}</td>
						{#if userRole === 'admin' || userRole === 'ops'}
							<td class="p-2">
								<button
									on:click={() => deleteCase(caseDetail._id)}
									class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
								>
									Delete
								</button>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Case Creation Modal -->
	{#if showModal}
		<CaseCreationModal bind:showModal />
	{/if}
</section>
