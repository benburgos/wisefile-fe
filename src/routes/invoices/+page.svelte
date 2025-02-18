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

	<table class="w-full border-collapse">
		<thead class="bg-gray-200">
			<tr>
				<th class="p-3 text-left">File #</th>
				<th class="p-3 text-left">Amount</th>
				<th class="p-3 text-left">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each $invoices as invoice}
				<tr class="border-t">
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
</section>
