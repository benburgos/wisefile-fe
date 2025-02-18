<script>
	import { writable } from 'svelte/store';

	// Fake messages data
	let messages = writable({
		'ABC123-001': [
			{ sender: 'Jane Smith', text: 'New court date scheduled.', timestamp: 'Feb 10, 3:45 PM' }
		],
		'XYZ789-002': [
			{ sender: 'Kyle Thompson', text: 'Payment reminder sent.', timestamp: 'Feb 12, 10:00 AM' }
		]
	});

	let selectedFile = null;
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Messaging</h1>

	<div class="grid grid-cols-3 gap-4">
		<!-- Left Column (File Numbers) -->
		<div class="rounded bg-gray-100 p-4">
			<h2 class="mb-3 text-lg font-bold">Files</h2>
			<ul>
				{#each Object.keys($messages) as fileNumber}
					<li>
						<button
							class="cursor-pointer border-b p-2 hover:bg-gray-200"
							on:click={() => (selectedFile = fileNumber)}
						>
							{fileNumber}
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Right Column (Messages) -->
		<div class="col-span-2 rounded bg-white p-4">
			{#if selectedFile}
				<h2 class="mb-3 text-lg font-bold">Messages for {selectedFile}</h2>
				<ul>
					{#each $messages[selectedFile] as msg}
						<li class="mb-2">
							<strong>{msg.sender}:</strong>
							{msg.text}
							<small class="text-gray-500">({msg.timestamp})</small>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-gray-500">Select a file number to view messages.</p>
			{/if}
		</div>
	</div>
</section>
