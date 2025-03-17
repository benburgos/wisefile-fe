<script>
	import { getAllRecords } from '$lib/localStorage';
	import { loginUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let error = '';
	let users = [];

	onMount(() => {
		users = getAllRecords('users');
		console.log('Loaded stored users:', users); // Debugging output
	});

	function handleSubmit(event) {
		event.preventDefault();

		let user = users.find((u) => u.email === email);

		if (user) {
			loginUser({
				email: user.email,
				role: user.role,
				clientId: user.company_id, // Ensure correct key name
				uuid: user._id // Store UUID properly
			});
			goto('/dashboard');
		} else {
			error = 'Invalid email or password';
		}
	}

	function quickLogin(userEmail) {
		let user = users.find((u) => u.email === userEmail);
		if (user) {
			email = user.email;
			password = 'password123'; // Assume default test password
		}
	}
</script>

<section class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="mb-6 text-4xl font-bold">Login to WiseFile</h1>

	<form on:submit={handleSubmit} class="mb-4 w-96 rounded bg-white px-8 pb-8 pt-6 shadow-md">
		<div class="mb-4">
			<label for="email" class="mb-2 block text-sm font-bold text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				class="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				placeholder="Enter your email"
				required
			/>
		</div>
		<div class="mb-6">
			<label for="password" class="mb-2 block text-sm font-bold text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				class="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				placeholder="Enter your password"
				required
			/>
		</div>
		{#if error}
			<p class="mb-4 text-sm text-red-500">{error}</p>
		{/if}
		<button
			type="submit"
			class="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		>
			Login
		</button>
	</form>

	<!-- Quick Login Buttons -->
	<div class="mt-4 flex w-96 flex-wrap gap-2">
		{#if users.length > 0}
			{#each users as user}
				<button
					on:click={() => quickLogin(user.email)}
					class="flex-1 rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400"
				>
					Login as {user.role} ({user.email})
				</button>
			{/each}
		{:else}
			<p class="text-sm text-gray-500">No users found, initializing...</p>
		{/if}
	</div>
</section>
