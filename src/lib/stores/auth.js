import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function getStoredAuth() {
	if (!browser)
		return {
			isAuthenticated: false,
			user: null,
			role: 'admin',
			token: null,
			uuid: null,
			clientId: null
		};

	// Retrieve authentication state from cookies
	const stored = document.cookie.split('; ').find((row) => row.startsWith('auth='));
	if (stored) {
		try {
			return JSON.parse(decodeURIComponent(stored.split('=')[1]));
		} catch (e) {
			console.error('Failed to parse auth cookie:', e);
		}
	}

	// Default role is admin if no valid authentication is found
	return {
		isAuthenticated: false,
		user: null,
		role: 'admin',
		token: null,
		uuid: null,
		clientId: null
	};
}

// Create the writable store with default values
export const auth = writable(getStoredAuth());

// Sync store with cookies on changes
if (browser) {
	document.addEventListener('cookiechange', () => {
		auth.set(getStoredAuth());
	});
}

// Temporary login function (will be replaced by backend authentication)
export function loginUser(userData) {
	const authData = {
		isAuthenticated: true,
		user: userData,
		role: userData.role || 'admin', // Default to admin if no role provided
		token: 'fake-token',
		uuid: userData.uuid || '550e8400-e29b-41d4-a716-446655440000', // Default admin UUID
		clientId: userData.clientId || null
	};

	auth.set(authData);

	if (browser) {
		document.cookie = `auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; Secure; SameSite=Strict`;
		console.log(
			`User logged in: Role=${authData.role}, UUID=${authData.uuid}, ClientID=${authData.clientId || 'N/A'}`
		);
	}
}

// Temporary logout function (will be replaced by backend logout)
export function logoutUser() {
	auth.set({
		isAuthenticated: false,
		user: null,
		role: 'admin',
		token: null,
		uuid: null,
		clientId: null
	});

	if (browser) {
		document.cookie = `auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict`;
		console.log('User logged out, cookies cleared.');
	}
}
