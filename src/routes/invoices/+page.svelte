<script>
	import { writable } from 'svelte/store';

	// Fake invoices data
	let invoices = writable([
		{ fileNumber: 'ABC123-001', amount: 1200, status: 'Paid' },
		{ fileNumber: 'XYZ789-002', amount: 800, status: 'Unpaid' }
	]);
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Invoices</h1>

	<!-- Styled Table -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200 text-left">
				<tr>
					<th class="border-b p-3">File #</th>
					<th class="border-b p-3">Amount</th>
					<th class="border-b p-3">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each $invoices as invoice}
					<tr class="border-t hover:bg-gray-100">
						<td class="p-3">{invoice.fileNumber}</td>
						<td class="p-3">${invoice.amount}</td>
						<td class="p-3">
							<span class={invoice.status === 'Paid' ? 'text-green-500' : 'text-red-500'}>
								{invoice.status}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
