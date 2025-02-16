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

// Sync store with cookies when they change
if (browser) {
	document.addEventListener('cookiechange', () => {
		auth.set(getStoredAuth());
	});
}

// Temporary login function
export function loginUser(userData) {
	const authData = {
		isAuthenticated: true,
		user: { email: userData.email, role: userData.role }, // ✅ Store role inside user
		token: 'fake-token',
		uuid: userData.uuid,
		clientId: userData.clientId
	};

	auth.set(authData);

	if (browser) {
		document.cookie = `auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; Secure; SameSite=Strict`;
	}
}

// Temporary logout function
export function logoutUser() {
	auth.set({ isAuthenticated: false, user: null, role: null, token: null });

	if (browser) {
		document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
	}
}
