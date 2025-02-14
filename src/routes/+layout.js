import { auth } from '$lib/stores/auth';

/** @type {import('./$types').LayoutLoad} */
export function load() {
	let authState;

	// Subscribe to auth store safely
	auth.subscribe((state) => {
		authState = state;
	})();

	// Ensure authState is properly structured
	if (!authState || typeof authState !== 'object') {
		authState = { isAuthenticated: false, user: null, role: null };
	}

	return {
		auth: authState
	};
}
