<script>
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { getStoredData } from '$lib/localStorage';

	function saveToLocalStorage(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	let user = null;
	let users = [];
	let caseRecords = [];
	let groupedThreads = [];
	let selectedCaseId = null;
	let selectedMessages = [];
	let replyContent = '';
	let selectedRecipients = [];
	let searchTerm = '';
	let currentCase = null;
	let messageContainer;
	let dropdownEl;

	function handleClickOutsideDropdown(event) {
		if (dropdownEl && !dropdownEl.contains(event.target)) {
			const openDropdown = document.querySelector('details[open]');
			if (openDropdown) openDropdown.removeAttribute('open');
		}
	}

	onMount(() => {
		auth.subscribe((value) => {
			user = value?.user;
			if (user) {
				loadMessages();
			}
		});
		document.addEventListener('click', handleClickOutsideDropdown);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutsideDropdown);
	});

	afterUpdate(() => {
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	});

	function loadMessages() {
		const data = getStoredData();
		const allMessages = data.messages || [];
		users = data.users || [];
		caseRecords = data.caseRecords || [];

		const filtered = allMessages.filter(
			(msg) => msg.sender_id === user.id || msg.recipient_ids.includes(user.id)
		);

		const threads = Object.values(
			filtered.reduce((acc, msg) => {
				if (!acc[msg.case_id]) acc[msg.case_id] = [];
				acc[msg.case_id].push(msg);
				return acc;
			}, {})
		).map((messages) => {
			const sorted = messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
			return {
				case_id: sorted[0].case_id,
				messages: sorted,
				latest: sorted.at(-1)
			};
		});

		groupedThreads = threads
			.filter((t) => {
				const caseName = getCaseName(t.case_id).toLowerCase();
				const sender = getSenderName(t.latest.sender_id).toLowerCase();
				const content = t.latest.content.toLowerCase();
				return (
					caseName.includes(searchTerm.toLowerCase()) ||
					sender.includes(searchTerm.toLowerCase()) ||
					content.includes(searchTerm.toLowerCase())
				);
			})
			.sort((a, b) => new Date(b.latest.created_at) - new Date(a.latest.created_at));
	}

	function getSenderName(sender_id) {
		return users.find((u) => u._id === sender_id)?.full_name || 'Unknown';
	}

	function getCaseName(caseId) {
		return caseRecords.find((c) => c._id === caseId)?.case_number || 'Unknown Case';
	}

	function getCaseById(caseId) {
		return caseRecords.find((c) => c._id === caseId);
	}

	function getRecipientNames(recipient_ids) {
		return recipient_ids.map(getSenderName).join(', ');
	}

	function isThreadRead(thread) {
		const latest = thread.latest;
		return latest.read_by.includes(user.id) || latest.sender_id === user.id;
	}

	function selectThread(caseId) {
		selectedCaseId = caseId;
		currentCase = getCaseById(caseId);
		const allMessages = getStoredData().messages || [];
		selectedMessages = allMessages
			.filter((msg) => msg.case_id === caseId)
			.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

		const unreadMessages = selectedMessages.filter(
			(msg) => !msg.read_by.includes(user.id) && msg.sender_id !== user.id
		);

		if (unreadMessages.length > 0) {
			setTimeout(() => {
				const updated = allMessages.map((msg) => {
					if (
						msg.case_id === caseId &&
						!msg.read_by.includes(user.id) &&
						msg.sender_id !== user.id
					) {
						return { ...msg, read_by: [...msg.read_by, user.id] };
					}
					return msg;
				});
				saveToLocalStorage('messages', updated);
				selectedMessages = updated
					.filter((msg) => msg.case_id === caseId)
					.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
				loadMessages();
			}, 1000);
		}

		const recipientsInThread = [
			...new Set(
				selectedMessages.flatMap((msg) =>
					[msg.sender_id, ...msg.recipient_ids].filter((id) => id !== user.id)
				)
			)
		];

		const companyUsers = users.filter(
			(u) => u.company_id && u.company_id === currentCase?.client_id && u._id !== user.id
		);

		const assignedAttorney = currentCase?.assigned_attorney;
		if (assignedAttorney && assignedAttorney !== user.id) {
			recipientsInThread.push(assignedAttorney);
		}

		const assignedOperator = currentCase?.assigned_operator;
		if (assignedOperator && assignedOperator !== user.id) {
			recipientsInThread.push(assignedOperator);
		}

		const validRecipientIds = [
			...new Set([...recipientsInThread, ...companyUsers.map((u) => u._id)])
		];
		selectedRecipients = validRecipientIds;
		loadMessages();
	}

	function toggleRecipient(id) {
		selectedRecipients = selectedRecipients.includes(id)
			? selectedRecipients.filter((r) => r !== id)
			: [...selectedRecipients, id];
	}

	function sendMessage() {
		if (!replyContent.trim() || selectedRecipients.length === 0) return;
		const allMessages = getStoredData().messages || [];

		const newMessage = {
			_id: crypto.randomUUID(),
			case_id: selectedCaseId,
			sender_id: user.id,
			recipient_ids: selectedRecipients,
			message_type: 'text',
			content: replyContent.trim(),
			attachments: [],
			created_at: new Date(),
			updated_at: new Date(),
			is_read: false,
			read_by: [user.id],
			is_active: true,
			is_deleted: false,
			visible_to_users: true
		};

		allMessages.push(newMessage);
		saveToLocalStorage('messages', allMessages);
		replyContent = '';
		selectThread(selectedCaseId);
	}
</script>

<section class="flex h-[calc(100vh-5rem)] flex-col space-y-6 p-4">
	<input
		type="text"
		class="form-input"
		placeholder="Search by case, sender, or content..."
		bind:value={searchTerm}
		on:input={loadMessages}
	/>

	<div class="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
		<!-- Inbox Column -->
		<div class="table-section col-span-1 flex h-full flex-col">
			<div class="section-header">Inbox</div>
			<div class="flex-1 overflow-y-auto bg-white pb-4">
				{#each groupedThreads as thread}
					<button
						type="button"
						class="w-full cursor-pointer border-b border-gray-200 px-3 py-2 text-left transition hover:bg-gray-50"
						class:bg-gray-100={thread.case_id === selectedCaseId}
						class:text-gray-400={isThreadRead(thread)}
						on:click={() => selectThread(thread.case_id)}
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center font-semibold">
								{#if !isThreadRead(thread)}<span class="unread-indicator"></span>{/if}
								{getSenderName(thread.latest.sender_id)}
							</div>
							<div class="whitespace-nowrap text-xs text-gray-500">
								{new Date(thread.latest.created_at).toLocaleString()}
							</div>
						</div>
						<div class="truncate text-sm text-gray-600">
							<strong>{getCaseName(thread.case_id)}</strong>: {thread.latest.content}
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Message Thread Column -->
		<div class="table-section col-span-2 flex flex-col overflow-hidden">
			<div class="section-header">Message Thread</div>

			<div class="flex-1 space-y-4 overflow-y-auto p-4" bind:this={messageContainer}>
				{#each selectedMessages as msg}
					<div class="flex flex-col items-start" class:items-end={msg.sender_id === user.id}>
						<div class="my-1 text-xs italic text-gray-400">
							{new Date(msg.created_at).toLocaleString()}
						</div>
						<div
							class={`max-w-2xl whitespace-pre-wrap rounded-xl px-4 py-3 shadow-sm ${
								msg.sender_id === user.id
									? 'bg-blue-100 text-gray-900 border border-gray-300'
									: 'bg-gray-200 text-gray-900 border border-gray-300'
							}`}
						>
							<div class="mb-1 text-xs font-semibold text-blue-800">
								@{getRecipientNames(msg.recipient_ids)}
							</div>
							<div class="text-sm leading-relaxed">{msg.content}</div>
						</div>

						<div class="mt-1 text-[11px] italic text-gray-500">
							{msg.sender_id === user.id
								? 'Sent by You'
								: msg.read_by.includes(user.id)
									? 'Read'
									: 'Unread'}
						</div>
					</div>
				{/each}
			</div>

			<hr class="my-4" />

			{#if selectedCaseId}
				<div class="space-y-3 px-4 pb-4">
					<div class="flex items-center justify-between gap-4">
						<label for="recipientDropdown" class="block text-sm font-semibold">Recipients</label>
						<details class="relative w-full" bind:this={dropdownEl}>
							<summary
								id="recipientDropdown"
								class="form-input cursor-pointer list-none"
								on:click|stopPropagation
							>
								<span class="text-sm"
									>{selectedRecipients.map(getSenderName).join(', ') ||
										'Select recipients...'}</span
								>
							</summary>
							<div
								class="absolute bottom-full z-10 mb-2 max-h-40 w-full overflow-y-auto rounded-md border bg-white p-2 shadow-md"
							>
								{#each users.filter((u) => u._id !== user.id && (u.company_id === currentCase?.client_id || selectedRecipients.includes(u._id))) as u}
									<button
										type="button"
										class="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
										on:click={() => toggleRecipient(u._id)}
									>
										<span class="text-sm">{u.full_name}</span>
										{#if selectedRecipients.includes(u._id)}
											<span class="ml-2 text-sm text-green-600">✔️</span>
										{/if}
									</button>
								{/each}
							</div>
						</details>
					</div>

					<textarea
						class="form-input"
						rows="2"
						placeholder="Write a message..."
						bind:value={replyContent}
					></textarea>

					<div class="flex justify-end">
						<button
							class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
							on:click={sendMessage}>Send</button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.unread-indicator {
		width: 8px;
		height: 8px;
		background-color: #1e40af;
		border-radius: 9999px;
		display: inline-block;
		margin-right: 6px;
	}
	input:focus,
	textarea:focus,
	summary:focus {
		outline: none;
		box-shadow: none;
		border-color: #000000;
	}
</style>
