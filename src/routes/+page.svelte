<script>
	import { getStoredData, saveToStorage } from '$lib/utils/storage';
	import { loginUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	function handleSubmit(event) {
		event.preventDefault();

		let appData = getStoredData();
		let users = appData.users;

		// Find User by Email
		let user = users.find((u) => u.email === email);

		if (user) {
			loginUser({ email: user.email, role: user.role, company_id: user.company_id });
			goto('/dashboard');
		} else {
			error = 'Invalid email or password';
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
</section>
