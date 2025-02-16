<script>
	let messages = [
		{
			id: 1,
			sender: 'John Doe',
			subject: 'Case Update',
			preview: 'The latest updates on case #123...'
		},
		{
			id: 2,
			sender: 'Admin',
			subject: 'Policy Change',
			preview: 'We’ve updated the document policy...'
		}
	];
</script>

<section class="p-6">
	<h1 class="mb-6 text-3xl font-bold">Messaging</h1>

	<!-- Message List -->
	<div class="rounded bg-white shadow-md">
		{#each messages as msg}
			<div class="cursor-pointer border-b p-4 hover:bg-gray-100">
				<h2 class="text-lg font-semibold">{msg.subject}</h2>
				<p class="text-sm text-gray-600">{msg.sender} - {msg.preview}</p>
			</div>
		{/each}
	</div>
</section>
