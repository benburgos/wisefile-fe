<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	// Fake Data
	let caseStats = writable([
		{ status: 'Open', count: 23 },
		{ status: 'Pending', count: 10 },
		{ status: 'Closed', count: 50 }
	]);

	let revenueStats = writable([
		{ month: 'Jan', revenue: 5000 },
		{ month: 'Feb', revenue: 7000 },
		{ month: 'Mar', revenue: 6500 }
	]);
</script>

<section class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Analytics</h1>

	<!-- Cases Status Overview -->
	<div class="mb-6">
		<h2 class="text-xl font-bold">Case Status Overview</h2>
		<ul class="mt-2">
			{#each $caseStats as stat}
				<li class="border-b p-2"><strong>{stat.status}:</strong> {stat.count}</li>
			{/each}
		</ul>
	</div>

	<!-- Revenue Overview -->
	<div>
		<h2 class="text-xl font-bold">Revenue Overview</h2>
		<ul class="mt-2">
			{#each $revenueStats as stat}
				<li class="border-b p-2"><strong>{stat.month}:</strong> ${stat.revenue}</li>
			{/each}
		</ul>
	</div>
</section>
