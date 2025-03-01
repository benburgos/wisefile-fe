import { writable } from 'svelte/store';
import { seedData } from '$lib/seed';

// Initialize Local Storage
function loadOrInitialize(key, defaultValue) {
	const storedValue = localStorage.getItem(key);
	return storedValue ? JSON.parse(storedValue) : defaultValue;
}

// Store Data Persistently
export const users = writable(loadOrInitialize('users', seedData.users));
export const cases = writable(loadOrInitialize('cases', seedData.cases));
export const profiles = writable(loadOrInitialize('profiles', seedData.profiles));
export const currentUser = writable(loadOrInitialize('currentUser', null));

// Reset to Seed Data
export function resetToSeedData() {
	localStorage.setItem('users', JSON.stringify(seedData.users));
	localStorage.setItem('cases', JSON.stringify(seedData.cases));
	localStorage.setItem('profiles', JSON.stringify(seedData.profiles));
	localStorage.removeItem('currentUser');
	window.location.reload();
}

// Save to Local Storage when Store Updates
users.subscribe((value) => localStorage.setItem('users', JSON.stringify(value)));
cases.subscribe((value) => localStorage.setItem('cases', JSON.stringify(value)));
profiles.subscribe((value) => localStorage.setItem('profiles', JSON.stringify(value)));
currentUser.subscribe((value) => localStorage.setItem('currentUser', JSON.stringify(value)));
