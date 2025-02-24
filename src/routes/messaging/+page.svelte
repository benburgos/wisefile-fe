<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let statusFilter = 'all'; // Default filter
	let searchQuery = '';
	let userRole = null;
	let newMessage = '';
	let selectedConversation = null;

	// Mock Conversations
	let conversations = [
		{
			caseId: 'ABC123-001',
			caseNumber: 'ABC123-001',
			client: 'ABC Properties',
			status: 'open',
			messages: [
				{
					sender: 'Client',
					content: 'Need status update.',
					timestamp: '2025-02-22T14:15:00Z',
					read: false
				},
				{
					sender: 'Ops',
					content: 'Received, checking now.',
					timestamp: '2025-02-22T15:00:00Z',
					read: true
				}
			]
		},
		{
			caseId: 'XYZ789-002',
			caseNumber: 'XYZ789-002',
			client: 'XYZ Realty',
			status: 'closed',
			messages: [
				{
					sender: 'Client',
					content: 'Payment received?',
					timestamp: '2025-02-20T11:00:00Z',
					read: true
				},
				{ sender: 'Ops', content: 'Yes, confirmed.', timestamp: '2025-02-20T11:15:00Z', read: true }
			]
		},
		{
			caseId: 'LMN555-003',
			caseNumber: 'LMN555-003',
			client: 'LMN Rentals',
			status: 'open',
			messages: [
				{
					sender: 'Ops',
					content: 'Court date set for next Tuesday.',
					timestamp: '2025-02-19T09:45:00Z',
					read: false
				}
			]
		}
	];

	let filteredConversations = [...conversations];

	auth.subscribe(({ role }) => {
		userRole = role || null;
	});

	// Pre-sort: Unread messages first, then newest messages
	onMount(() => {
		conversations.forEach((conv) => {
			conv.messages.sort((a, b) => {
				if (!a.read && b.read) return -1;
				if (a.read && !b.read) return 1;
				return new Date(b.timestamp) - new Date(a.timestamp);
			});
		});
		filterConversations();
	});

	// Open conversation and mark messages as read
	function openConversation(conversation) {
		selectedConversation = conversation;
		selectedConversation.messages.forEach((msg) => (msg.read = true));
	}

	// Send a new message
	function sendMessage() {
		if (!selectedConversation || !newMessage.trim()) return;

		const newMsg = {
			sender: userRole === 'client' ? 'Client' : 'Ops/Admin',
			content: newMessage.trim(),
			timestamp: new Date().toISOString(),
			read: false
		};

		selectedConversation.messages.push(newMsg);
		newMessage = '';

		// Ensure UI updates
		selectedConversation = { ...selectedConversation };
	}

	// Filter conversations by search and status
	function filterConversations() {
		filteredConversations = conversations
			.filter(
				(conv) =>
					(statusFilter === 'all' || conv.status === statusFilter) &&
					conv.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) => {
				const aUnread = a.messages.some((msg) => !msg.read);
				const bUnread = b.messages.some((msg) => !msg.read);
				if (aUnread && !bUnread) return -1;
				if (!aUnread && bUnread) return 1;
				return (
					new Date(b.messages[b.messages.length - 1].timestamp) -
					new Date(a.messages[a.messages.length - 1].timestamp)
				);
			});
	}
</script>

<section class="p-6">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Messaging</h1>
	</div>

	<div class="grid grid-cols-3 gap-6">
		<!-- Conversations List -->
		<div class="col-span-1 rounded-lg bg-white p-4 shadow-md">
			<h2 class="mb-3 text-lg font-bold">Conversations</h2>

			<!-- Search Bar -->
			<input
				type="text"
				placeholder="Search case numbers..."
				bind:value={searchQuery}
				on:input={filterConversations}
				class="mb-3 w-full rounded-lg border px-3 py-2"
			/>

			<!-- Open/Closed Filter (Moved Below Search) -->
			<div class="mb-3 flex gap-4">
				<label class="flex items-center">
					<input
						type="radio"
						bind:group={statusFilter}
						value="all"
						on:change={filterConversations}
					/>
					<span class="ml-2">All</span>
				</label>
				<label class="flex items-center">
					<input
						type="radio"
						bind:group={statusFilter}
						value="open"
						on:change={filterConversations}
					/>
					<span class="ml-2">Open</span>
				</label>
				<label class="flex items-center">
					<input
						type="radio"
						bind:group={statusFilter}
						value="closed"
						on:change={filterConversations}
					/>
					<span class="ml-2">Closed</span>
				</label>
			</div>

			<hr class="mb-3 border-t border-gray-300" />

			<!-- Conversations List -->
			<ul class="h-[400px] overflow-y-auto">
				{#each filteredConversations as conversation}
					<li>
						<button
							class="w-full rounded-lg px-4 py-2 text-left transition-all"
							class:bg-gray-200={selectedConversation?.caseId === conversation.caseId}
							on:click={() => openConversation(conversation)}
						>
							<span
								class="font-semibold"
								class:text-black={!conversation.messages.every((msg) => msg.read)}
								class:text-gray-500={conversation.messages.every((msg) => msg.read)}
							>
								{conversation.caseNumber}
							</span>
							<p class="text-sm text-gray-500">
								{conversation.messages[conversation.messages.length - 1].content.slice(0, 40)}...
							</p>
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Conversation Details -->
		<div class="col-span-2 rounded-lg bg-white p-4 shadow-md">
			{#if selectedConversation}
				<div class="flex items-center justify-between border-b pb-2">
					<h2 class="text-lg font-bold">Conversation for {selectedConversation.caseNumber}</h2>
					<a href={`/cases/${selectedConversation.caseId}`} class="text-blue-500 underline"
						>Go to Case Detail</a
					>
				</div>

				<div class="mt-4 h-[300px] overflow-y-auto rounded-lg border p-3">
					{#each selectedConversation.messages as message}
						<div
							class="mb-2 rounded-lg p-2"
							class:bg-gray-100={message.sender !== userRole}
							class:bg-blue-100={message.sender === userRole}
						>
							<p class="text-sm">
								<strong>{message.sender}:</strong>
								{message.content}
							</p>
							<p class="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
						</div>
					{/each}
				</div>

				<!-- Message Input -->
				<div class="mt-4 flex gap-2">
					<input
						type="text"
						bind:value={newMessage}
						placeholder="Type your message..."
						class="w-full rounded-lg border px-3 py-2"
						on:keydown={(e) => e.key === 'Enter' && sendMessage()}
					/>
					<button
						on:click={sendMessage}
						class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-white transition hover:bg-opacity-90"
					>
						Send
					</button>
				</div>
			{:else}
				<p class="text-gray-500">Select a conversation to view messages.</p>
			{/if}
		</div>
	</div>
</section>
