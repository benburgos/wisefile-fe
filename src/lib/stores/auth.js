import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

function getStoredAuth() {
	if (!browser) return { isAuthenticated: false, user: null };

	const stored = document.cookie.split('; ').find((row) => row.startsWith('auth='));
	if (stored) {
		try {
			return JSON.parse(decodeURIComponent(stored.split('=')[1]));
		} catch (e) {
			console.error('Failed to parse auth cookie:', e);
		}
	}

	return { isAuthenticated: false, user: null };
}

export const auth = writable(getStoredAuth());

auth.subscribe((value) => {
	if (browser) {
		document.cookie = `auth=${encodeURIComponent(JSON.stringify(value))}; path=/; Secure; SameSite=Strict`;
	}
});

// Login function (stores `uuid` and `clientId`)
export function loginUser(userData) {
	auth.set({
		isAuthenticated: true,
		user: {
			email: userData.email,
			role: userData.role,
			clientId: userData.clientId,
			uuid: userData.uuid
		},
		token: 'fake-token'
	});
}

// Logout function (clears session)
export function logoutUser() {
	auth.set({ isAuthenticated: false, user: null, token: null });

	if (browser) {
		document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
		goto('/'); // Redirect to login page
	}
}
