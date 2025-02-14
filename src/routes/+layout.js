import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export function load({ url, cookies }) {
	if (!browser) return {}; // Prevents SSR issues

	const authCookie = cookies.get('auth'); // Retrieve authentication cookie

	let isAuthenticated = false;

	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie);
			isAuthenticated = authData.isAuthenticated;
		} catch (error) {
			console.error('Failed to parse auth cookie:', error);
		}
	}

	console.log('Server-side isAuthenticated:', isAuthenticated); // Debugging

	// Redirect unauthenticated users to login
	if (!isAuthenticated && url.pathname !== '/') {
		throw redirect(302, '/');
	}

	return {
		props: { isAuthenticated } // ✅ Ensure this is passed to +layout.svelte
	};
}
