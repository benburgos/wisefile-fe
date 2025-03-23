<script>
	import { getAllRecords } from '$lib/localStorage';

	let email = '';
	let password = '';
	let error = '';
	let users = [];
	let clients = [];

	import { onMount } from 'svelte';
	import { loginUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	onMount(() => {
		users = getAllRecords('users');
		clients = getAllRecords('clients');
	});

	function handleSubmit(event) {
		event.preventDefault();

		let user = users.find((u) => u.email === email);
		if (user) {
			loginUser({
				id: user._id,
				full_name: user.full_name,
				clientId: user.company_id,
				email: user.email,
				role: user.role,
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
			password = 'password123';
		}
	}

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function getClientInternalName(companyId) {
		const client = clients.find((c) => c._id === companyId);
		return client?.internal_name || 'Unknown Client';
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
	{#if users.length > 0}
		<div class="mt-4 grid w-[32rem] grid-cols-3 gap-2">
			<!-- Row 1: Admin, Ops, Attorney -->
			{#each ['admin', 'operations', 'attorney'] as role}
				{#each users.filter((u) => u.role === role) as user}
					<button
						on:click={() => quickLogin(user.email)}
						class="rounded bg-gray-300 px-4 py-3 text-center text-sm text-gray-800 hover:bg-gray-400"
						title={user.email}
					>
						{user.full_name} ({capitalize(user.role)})
					</button>
				{/each}
			{/each}

			<!-- Row 2: Clients -->
			{#each users.filter((u) => u.role === 'client') as user}
				<button
					on:click={() => quickLogin(user.email)}
					class="rounded bg-gray-300 px-4 py-3 text-center text-sm text-gray-800 hover:bg-gray-400"
					title={user.email}
				>
					{getClientInternalName(user.company_id)} (Client)
				</button>
			{/each}
		</div>
	{:else}
		<p class="mt-4 text-sm text-gray-500">No users found, initializing...</p>
	{/if}
</section>
