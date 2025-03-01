<script>
	import { onMount } from 'svelte';
	import { getStoredData, saveToLocalStorage } from '$lib/utils/storage';
	import { auth } from '$lib/stores/auth';
	import CaseCreationModal from '$lib/components/CaseCreationModal.svelte';

	let cases = [];
	let showModal = false;
	let userRole = null;
	let userClientId = null;
	let searchQuery = '';

	// Fetch stored data on mount
	onMount(() => {
		const storedData = getStoredData();
		cases = storedData.caseDetails.filter((c) => !c.deleted);

		// Get user role and company ID
		auth.subscribe(({ role, company_id }) => {
			userRole = role;
			userClientId = company_id;
		});

		// Pre-sort: Open cases first, then by oldest
		cases.sort((a, b) => {
			const statusOrder = (status) => (status === 'Open' ? 0 : 1);
			return (
				statusOrder(a.status) - statusOrder(b.status) || a.caseNumber.localeCompare(b.caseNumber)
			);
		});
	});

	// Soft delete case
	function deleteCase(caseId) {
		if (confirm('Are you sure you want to remove this case?')) {
			cases = cases.map((c) => (c._id === caseId ? { ...c, deleted: true } : c));
			saveToLocalStorage({ ...getStoredData(), caseDetails: cases });
		}
	}

	// Filter cases based on search
	function filteredCases() {
		return cases.filter(
			(c) =>
				c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.plaintiff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.formattedAddress.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}
</script>

<section class="p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>
		<button
			on:click={() => (showModal = true)}
			class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white"
		>
			New Filing or Collection
		</button>
	</div>

	<!-- Search Bar -->
	<input
		type="text"
		bind:value={searchQuery}
		placeholder="Search by Case #, Client, or Address..."
		class="mb-4 w-full rounded-lg border px-4 py-2"
	/>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Client</th>
					<th class="p-3 text-left">Case #</th>
					<th class="p-3 text-left">Type</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Address</th>
					<th class="p-3 text-left">State</th>
					<th class="p-3 text-left">Jurisdiction</th>
					<th class="p-3 text-left">Balance</th>
					<th class="p-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredCases() as caseDetail}
					<tr class="border-t">
						<td class="p-3">{caseDetail.plaintiff.name}</td>
						<td class="p-3">{caseDetail.caseNumber}</td>
						<td class="p-3">{caseDetail.caseType}</td>
						<td class="p-3">{caseDetail.status}</td>
						<td class="p-3">{caseDetail.formattedAddress}</td>
						<td class="p-3">{caseDetail.newAddress.state}</td>
						<td class="p-3">{caseDetail.newAddress.jurisdiction}</td>
						<td class="p-3 font-semibold text-green-600">
							Balance: ${caseDetail.fees.reduce((acc, f) => acc + f.amount, 0)}
						</td>
						<td class="p-3">
							<button
								on:click={() => deleteCase(caseDetail._id)}
								class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
							>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showModal}
		<CaseCreationModal bind:showModal />
	{/if}
</section>
