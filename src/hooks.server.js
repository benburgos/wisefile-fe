import { redirect } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const authCookie = event.cookies.get('auth'); // Retrieve authentication cookie

	let isAuthenticated = false;

	if (authCookie) {
		try {
			const authData = JSON.parse(authCookie);
			isAuthenticated = authData.isAuthenticated;
		} catch (error) {
			console.error('Failed to parse auth cookie:', error);
		}
	}

	console.log('Server isAuthenticated:', isAuthenticated); // Debugging

	// Redirect if unauthenticated (but allow login page access)
	if (!isAuthenticated && event.url.pathname !== '/') {
		throw redirect(302, '/');
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%isAuthenticated%', isAuthenticated)
	});
}
