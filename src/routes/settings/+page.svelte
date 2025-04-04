<script>
	import { clearLocalStorage, initializeLocalStorage } from '$lib/localStorage';
	import { seedData } from '$lib/data/seedData';

	function handleReset() {
		clearLocalStorage();
		initializeLocalStorage(seedData);
		alert('Local storage has been reset to the original seed data!');
	}

	// Optional: Add a confirmation dialog before resetting
	function confirmReset() {
		if (confirm('Are you sure you want to reset all local data? This action cannot be undone.')) {
			handleReset();
		}
	}
</script>

<section class="space-y-4 p-4">
	<div class="rounded border border-red-200 bg-red-50 p-4">
		<p class="mb-2 text-sm text-red-800">
			This will reset all data to the original seeded state. Only do this if you want to wipe local
			changes.
		</p>
		<button
			on:click={confirmReset}
			class="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
		>
			Reset All Local Data
		</button>
	</div>
</section>
