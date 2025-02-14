<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Fake data for now
	let unreadMessages = 5;
	let openCases = 12;
	let openInvoices = 3;

	let showNewCaseModal = false;

	// Redirect function for summary boxes
	function handleRedirect(section) {
		if (section === 'messages') {
			goto('/messaging');
		} else if (section === 'cases') {
			goto('/cases?status=open'); // Pre-filter for open cases
		} else if (section === 'invoices') {
			goto('/cases?invoice_status=unpaid'); // Pre-filter for unpaid invoices
		}
	}
</script>

<section class="p-6">
	<!-- Dashboard Header with "New Case" Button -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<button
			on:click={() => (showNewCaseModal = true)}
			class="rounded bg-blue-500 px-6 py-3 font-bold text-white shadow-md hover:bg-blue-600"
		>
			New Filing or Case
		</button>
	</div>

	<!-- Summary Boxes -->
	<div class="grid grid-cols-3 gap-6">
		<!-- Unread Messages -->
		<button
			class="rounded bg-blue-500 p-6 text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
			on:click={() => handleRedirect('messages')}
		>
			<h2 class="text-lg font-semibold">Unread Messages</h2>
			<p class="text-4xl font-bold">{unreadMessages}</p>
		</button>

		<!-- Open Cases -->
		<button
			class="rounded bg-green-500 p-6 text-white shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-300"
			on:click={() => handleRedirect('cases')}
		>
			<h2 class="text-lg font-semibold">Open Cases</h2>
			<p class="text-4xl font-bold">{openCases}</p>
		</button>

		<!-- Open Invoices -->
		<button
			class="rounded bg-red-500 p-6 text-white shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-300"
			on:click={() => handleRedirect('invoices')}
		>
			<h2 class="text-lg font-semibold">Open Invoices</h2>
			<p class="text-4xl font-bold">{openInvoices}</p>
		</button>
	</div>

	<!-- Additional Metrics Section -->
	<div class="mt-10">
		<h2 class="mb-4 text-2xl font-bold">Case Insights</h2>
		<div class="grid grid-cols-3 gap-6">
			<div class="rounded bg-gray-100 p-6 shadow-md">
				<h3 class="text-lg font-semibold">Avg. Case Resolution Time</h3>
				<p class="text-3xl font-bold">7 Days</p>
			</div>

			<div class="rounded bg-gray-100 p-6 shadow-md">
				<h3 class="text-lg font-semibold">Active Attorneys</h3>
				<p class="text-3xl font-bold">8</p>
			</div>

			<div class="rounded bg-gray-100 p-6 shadow-md">
				<h3 class="text-lg font-semibold">Cases Closed This Month</h3>
				<p class="text-3xl font-bold">24</p>
			</div>
		</div>
	</div>

	<!-- New Case Modal -->
	{#if showNewCaseModal}
		<div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
			<div class="rounded bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Create New Case</h2>
				<p>Case creation form will go here...</p>
				<button
					on:click={() => (showNewCaseModal = false)}
					class="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</section>
