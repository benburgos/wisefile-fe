import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function getStoredAuth() {
	if (!browser)
		return {
			isAuthenticated: false,
			user: null,
			role: null,
			token: null,
			clientId: null,
			uuid: null
		};

	const stored = document.cookie.split('; ').find((row) => row.startsWith('auth='));
	if (stored) {
		try {
			return JSON.parse(decodeURIComponent(stored.split('=')[1]));
		} catch (e) {
			console.error('❌ Failed to parse auth cookie:', e);
		}
	}

	return {
		isAuthenticated: false,
		user: null,
		role: null,
		token: null,
		clientId: null,
		uuid: null
	};
}

export const auth = writable(getStoredAuth());

// Ensure updates sync to cookies
auth.subscribe((value) => {
	if (browser) {
		console.log('✅ Updating Auth Store:', value);
		document.cookie = `auth=${encodeURIComponent(JSON.stringify(value))}; path=/; Secure; SameSite=Strict`;
	}
});

// Temporary login function
export function loginUser(userData) {
	const authData = {
		isAuthenticated: true,
		user: userData,
		role: userData.role,
		clientId: userData.clientId,
		uuid: userData.uuid,
		token: 'fake-token'
	};

	auth.set(authData);
}

// Temporary logout function
export function logoutUser() {
	auth.set({
		isAuthenticated: false,
		user: null,
		role: null,
		clientId: null,
		uuid: null,
		token: null
	});

	if (browser) {
		document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
	}
}
