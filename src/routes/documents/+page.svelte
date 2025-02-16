<script>
	let documents = [
		{ id: 1, title: 'Lease Agreement', case: 'Case #12345', uploadedBy: 'John Doe' },
		{ id: 2, title: 'Court Filing', case: 'Case #12346', uploadedBy: 'Jane Smith' }
	];
</script>

<section class="p-6">
	<h1 class="mb-6 text-3xl font-bold">Documents</h1>

	<!-- Document List -->
	<div class="overflow-x-auto rounded bg-white shadow-md">
		<table class="w-full border-collapse">
			<thead class="bg-gray-200">
				<tr>
					<th class="p-3 text-left">Title</th>
					<th class="p-3 text-left">Case</th>
					<th class="p-3 text-left">Uploaded By</th>
				</tr>
			</thead>
			<tbody>
				{#each documents as doc}
					<tr class="border-t">
						<td class="p-3">{doc.title}</td>
						<td class="p-3">{doc.case}</td>
						<td class="p-3">{doc.uploadedBy}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
