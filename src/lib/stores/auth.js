import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function getStoredAuth() {
	if (!browser) return { isAuthenticated: false, user: null, role: null, token: null };

	const stored = document.cookie.split('; ').find((row) => row.startsWith('auth='));
	if (stored) {
		try {
			return JSON.parse(decodeURIComponent(stored.split('=')[1]));
		} catch (e) {
			console.error('Failed to parse auth cookie:', e);
		}
	}

	return { isAuthenticated: false, user: null, role: null, token: null };
}

export const auth = writable(getStoredAuth());

function updateAuthCookie(value) {
	document.cookie = `auth=${encodeURIComponent(JSON.stringify(value))}; path=/; Secure; SameSite=Strict`;
}

// Sync store with cookies
if (browser) {
	auth.subscribe((value) => {
		updateAuthCookie(value);
	});
}

// Log in function
export function loginUser(userData) {
	const authData = {
		isAuthenticated: true,
		user: userData,
		role: userData.role,
		token: userData.token
	};
	auth.set(authData);
	if (browser) updateAuthCookie(authData);
}

// Log out function
export function logoutUser() {
	auth.set({
		isAuthenticated: false,
		user: null,
		role: null,
		token: null
	});

	if (browser) {
		document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
	}
}
