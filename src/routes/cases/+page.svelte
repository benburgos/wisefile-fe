<script>
	let cases = [
		{ id: 1, name: 'Case #12345', status: 'Open', assignedTo: 'John Doe' },
		{ id: 2, name: 'Case #12346', status: 'Pending', assignedTo: 'Jane Smith' },
		{ id: 3, name: 'Case #12347', status: 'Closed', assignedTo: 'Mark Johnson' }
	];
</script>

<section class="p-6">
	<h1 class="mb-6 text-3xl font-bold">Cases</h1>

	<!-- Cases Table -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Case Name</th>
					<th class="p-3 text-left">Status</th>
					<th class="p-3 text-left">Assigned To</th>
				</tr>
			</thead>
			<tbody>
				{#each cases as file}
					<tr class="border-t">
						<td class="p-3">{file.name}</td>
						<td class="p-3">{file.status}</td>
						<td class="p-3">{file.assignedTo}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- New Case Button -->
	<div class="mt-6">
		<button class="rounded bg-blue-500 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-600">
			New Case
		</button>
	</div>
</section>
