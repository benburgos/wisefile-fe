<script>
	import { writable } from 'svelte/store';

	// Fake messages
	let messages = writable([
		{
			fileNumber: 'ABC123-001',
			sender: 'Jane Smith',
			subject: 'New Court Date',
			received: 'Feb 10'
		},
		{
			fileNumber: 'XYZ789-002',
			sender: 'Kyle Thompson',
			subject: 'Payment Reminder',
			received: 'Feb 12'
		}
	]);
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Messaging</h1>

	<table class="w-full border-collapse">
		<thead class="bg-gray-200">
			<tr>
				<th class="p-3 text-left">File #</th>
				<th class="p-3 text-left">Sender</th>
				<th class="p-3 text-left">Subject</th>
				<th class="p-3 text-left">Received</th>
			</tr>
		</thead>
		<tbody>
			{#each $messages as msg}
				<tr class="border-t">
					<td class="cursor-pointer p-3 text-blue-500 underline">{msg.fileNumber}</td>
					<td class="p-3">{msg.sender}</td>
					<td class="p-3">{msg.subject}</td>
					<td class="p-3">{msg.received}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
