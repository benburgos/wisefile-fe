<script>
	import { loginUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { profiles, currentUser, resetToSeedData } from '$lib/stores/localStorage';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let error = '';
	let userProfiles = [];
	let selectedProfile = null;

	// Load Profiles on Mount
	onMount(() => {
		profiles.subscribe((value) => (userProfiles = value));
	});

	// Handle Standard Login (For Future Backend)
	const handleSubmit = async (event) => {
		event.preventDefault();
		// Temporary client-side authentication logic
		if (email === 'admin@example.com' && password === 'password123') {
			loginUser({ email, role: 'admin' });
			goto('/dashboard');
		} else {
			error = 'Invalid email or password';
		}
	};

	// Handle Profile Selection (For Testing)
	function selectProfile(profile) {
		currentUser.set(profile);
		goto('/dashboard');
	}
</script>

<section class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="mb-6 text-4xl font-bold">Login to WiseFile</h1>

	<!-- Standard Login Form -->
	<form on:submit={handleSubmit} class="mb-6 w-96 rounded bg-white px-8 pb-8 pt-6 shadow-md">
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

	<!-- OR Divider -->
	<div class="mb-4 w-96 text-center text-sm font-semibold text-gray-500">OR</div>

	<!-- Profile Selection for Quick Testing -->
	<div class="w-180 rounded bg-white px-8 pb-8 pt-6 shadow-md">
		<h2 class="mb-4 text-lg font-bold text-gray-700">Select a Profile</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each userProfiles as profile}
				<button
					class="w-full rounded-lg bg-blue-500 px-6 py-3 text-white shadow-md hover:bg-blue-600"
					on:click={() => selectProfile(profile)}
				>
					{profile.name} ({profile.role})
				</button>
			{/each}
		</div>
		<button
			on:click={resetToSeedData}
			class="mt-6 w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
		>
			Reset Profiles
		</button>
	</div>
</section>
