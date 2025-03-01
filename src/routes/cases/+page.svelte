<script>
	import { onMount } from 'svelte';
	import { getStoredData, saveToLocalStorage } from '$lib/utils/storage';
	import { auth } from '$lib/stores/auth';
	import CaseCreationModal from '$lib/components/CaseCreationModal.svelte';

	let cases = [];
	let showModal = false;
	let userRole = null;
	let userClientId = null;

	// Fetch stored data on mount
	onMount(() => {
		const storedData = getStoredData();
		cases = storedData.caseDetails.filter((c) => !c.deleted);

		// Get user role and company ID
		auth.subscribe(({ role, company_id }) => {
			userRole = role;
			userClientId = company_id;
		});
	});

	// Soft delete case
	function deleteCase(caseId) {
		if (confirm('Are you sure you want to remove this case?')) {
			cases = cases.map((c) =>
				c._id === caseId ? { ...c, deleted: true } : c
			);
			saveToLocalStorage({ ...getStoredData(), caseDetails: cases });
		}
	}
</script>

<section class="p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Cases</h1>
		<button on:click={() => (showModal = true)} class="rounded-lg bg-[var(--color-primary)] px-6 py-2 text-white">
			New Filing or Collection
		</button>
	</div>

	<div class="overflow-x-auto rounded-lg border">
		<table class="w-full bg-white shadow-md">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Client</th>
					<th class="p-3 text-left">Case #</th>
					<th class="p-3 text-left">Type</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">State</th>
					<th class="p-3 text-left">Balance</th>
					<th class="p-3 text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each cases as caseDetail}
					<tr class="border-t">
						<td class="p-3">{caseDetail.plaintiff.name}</td>
						<td class="p-3">{caseDetail.caseNumber}</td>
						<td class="p-3">{caseDetail.caseType}</td>
						<td class="p-3">{caseDetail.status}</td>
						<td class="p-3">{caseDetail.newAddress.state}</td>
						<td class="p-3">${caseDetail.fees.reduce((acc, f) => acc + f.amount, 0)}</td>
						<td class="p-3">
							<button on:click={() => deleteCase(caseDetail._id)} class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700">
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showModal}
		<CaseCreationModal on:close={() => (showModal = false)} />
	{/if}
</section>
