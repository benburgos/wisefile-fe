<script>
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';

	function handleLogin() {
		auth.set({
			isAuthenticated: true,
			user: { username },
			role: 'admin',
			token: 'placeholder-token'
		});

		goto('/dashboard');
	}
</script>

<section class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="mb-6 text-4xl font-bold">Login to WiseFile</h1>
	<form
		on:submit|preventDefault={handleLogin}
		class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
	>
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="username">Username</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				placeholder="Enter your username"
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
		</div>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="password">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				placeholder="Enter your password"
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
		>
			Login
		</button>
	</form>
</section>
