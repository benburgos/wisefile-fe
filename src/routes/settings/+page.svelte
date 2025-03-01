<script>
	import { resetStorage } from '$lib/utils/storage';

	function handleReset() {
		resetStorage();
		alert('Data reset to default!');
	}
</script>

<button
	on:click={handleReset}
	class="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700"
>
	Reset Data
</button>
