import { writable } from 'svelte/store';

// Check if running in the browser before accessing sessionStorage
const isBrowser = typeof window !== 'undefined';

// Function to safely get stored auth state
function getStoredAuth() {
	if (isBrowser) {
		let stored = sessionStorage.getItem('auth');
		return stored
			? JSON.parse(stored)
			: { isAuthenticated: false, user: null, role: null, token: null };
	}
	return { isAuthenticated: false, user: null, role: null, token: null };
}

// Create writable store with initial auth state
export const auth = writable(getStoredAuth());

// Update sessionStorage when auth state changes (only in browser)
if (isBrowser) {
	auth.subscribe((value) => {
		sessionStorage.setItem('auth', JSON.stringify(value));
	});
}

// Helper function to log in
export function loginUser(userData) {
	auth.set({
		isAuthenticated: true,
		user: userData,
		role: userData.role,
		token: userData.token
	});
}

// Helper function to log out
export function logoutUser() {
	auth.set({
		isAuthenticated: false,
		user: null,
		role: null,
		token: null
	});
	if (isBrowser) sessionStorage.removeItem('auth');
}
