<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	let isAuthenticated = null;
	let unsubscribe;

	onMount(() => {
		unsubscribe = auth.subscribe(({ isAuthenticated: authStatus }) => {
			isAuthenticated = authStatus;
		});

		// Ensure authentication state is known before redirecting
		setTimeout(() => {
			if (isAuthenticated) {
				goto('/dashboard');
			}
		}, 500);
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});
</script>

<section class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="mb-6 text-4xl font-bold">Login to WiseFile</h1>
	<form class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
		<div class="mb-4">
			<label for="email" class="mb-2 block text-sm font-bold text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				class="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				placeholder="Enter your email"
			/>
		</div>
		<div class="mb-6">
			<label for="password" class="mb-2 block text-sm font-bold text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				class="w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				placeholder="Enter your password"
			/>
		</div>
		<button
			type="submit"
			class="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		>
			Login
		</button>
	</form>
</section>
