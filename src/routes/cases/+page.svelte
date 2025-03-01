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
	let filtered = [];

	auth.subscribe((user) => {
		if (user) {
			userRole = user.role;
			userClientId = user.company_id;
		}
	});

	onMount(() => {
		const storedData = getStoredData();

		// Get all cases if Admin/Ops, otherwise only show client's cases
		if (storedData && storedData.caseDetails) {
			cases =
				userRole === 'admin' || userRole === 'ops'
					? storedData.caseDetails
					: storedData.caseDetails.filter((c) => c.company_id === userClientId);
		}
	});

	// Ensure filtering reacts to searchQuery & cases changes
	$: filtered = cases.filter((c) =>
		`${c.caseNumber} ${c.caseType} ${c.status} ${c.subStatus} ${c.plaintiff.name} ${c.newAddress.state} ${c.newAddress.jurisdiction}`
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
	);

	// Toggle Case Creation Modal
	function openCaseModal() {
		showModal = true;
	}

	// Handle Modal Close Event (Fix for Cancel Button)
	function closeCaseModal() {
		showModal = false;
	}

	// Soft Delete Case
	function deleteCase(caseId) {
		if (confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
			cases = cases.map((c) => (c._id === caseId ? { ...c, deleted: true } : c));
			const storedData = getStoredData();
			storedData.caseDetails = cases;
			saveToLocalStorage(storedData);
		}
	}

	// Format Address for Table (Remove Commas)
	function formatAddress(addr) {
		let formatted = `${addr.streetNumber} ${addr.streetName}`;
		if (addr.unitNumber) {
			formatted += ` ${addr.unitNumber}`;
		}
		return formatted;
	}

	// Calculate Total Balance
	function calculateBalance(fees) {
		return fees.reduce((total, fee) => total + fee.amount, 0).toFixed(2);
	}
</script>

<section class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Cases</h1>
		<button
			on:click={openCaseModal}
			class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
		>
			New Filing or Collection
		</button>
	</div>

	<!-- Search Bar -->
	<input
		type="text"
		placeholder="Search cases..."
		bind:value={searchQuery}
		class="mb-3 w-full rounded-md border px-3 py-2 text-sm"
	/>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white text-xs shadow-md">
			<thead class="bg-gray-200 text-xs font-semibold">
				<tr>
					<th class="w-[10%] px-2 py-1 text-left">Case #</th>
					<th class="w-[8%] px-2 py-1 text-left">Type</th>
					<th class="w-[10%] px-2 py-1 text-left">Status</th>
					<th class="w-[12%] px-2 py-1 text-left">Sub-Status</th>
					<th class="w-[10%] px-2 py-1 text-left">Balance</th>
					<th class="w-[18%] px-2 py-1 text-left">Address</th>
					<th class="w-[5%] px-2 py-1 text-left">State</th>
					<th class="w-[10%] px-2 py-1 text-left">Jurisdiction</th>
					<th class="w-[12%] px-2 py-1 text-left">Client</th>
					{#if userRole === 'admin' || userRole === 'ops'}
						<th class="w-[10%] px-2 py-1 text-left">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each filtered as caseDetail}
					{#if !caseDetail.deleted}
						<tr class="border-t">
							<td class="px-2 py-1"><a class="text-blue-800" href={`/cases/${caseDetail._id}`}>{caseDetail.caseNumber}</a></td>
							<td class="px-2 py-1">{caseDetail.caseType}</td>
							<td class="px-2 py-1">{caseDetail.status}</td>
							<td class="px-2 py-1">{caseDetail.subStatus}</td>
							<td class="px-2 py-1 font-semibold">
								${calculateBalance(caseDetail.fees)}
							</td>
							<td class="px-2 py-1">{formatAddress(caseDetail.newAddress)}</td>
							<td class="px-2 py-1">{caseDetail.newAddress.state}</td>
							<td class="px-2 py-1">{caseDetail.newAddress.jurisdiction}</td>
							<td class="px-2 py-1">{caseDetail.plaintiff.name}</td>
							{#if userRole === 'admin' || userRole === 'ops'}
								<td class="px-2 py-1">
									<button
										on:click={() => deleteCase(caseDetail._id)}
										class="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
									>
										Delete
									</button>
								</td>
							{/if}
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Case Creation Modal -->
	{#if showModal}
		<CaseCreationModal bind:showModal on:close={closeCaseModal} />
	{/if}
</section>
