import { writable } from 'svelte/store';

export const auth = writable({
	isAuthenticated: false,
	user: null,
	role: null,
	token: null
});

// Helper function to update auth state
export function loginUser(userData) {
	auth.set({
		isAuthenticated: true,
		user: userData,
		role: userData.role,
		token: userData.token
	});
}

export function logoutUser() {
	auth.set({
		isAuthenticated: false,
		user: null,
		role: null,
		token: null
	});
}
