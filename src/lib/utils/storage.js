import { seedData } from '$lib/seed';

// Key for Local Storage
const STORAGE_KEY = 'wiseFileData';

// Initialize Data from Local Storage or Seed Data
export function getStoredData() {
	if (typeof window === 'undefined') {
		return { users: [] }; // Prevents SSR errors
	}

	let data = localStorage.getItem('seedData');
	return data ? JSON.parse(data) : { users: [] };
}

// Save Data to Local Storage
export function saveToStorage(data) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Reset Local Storage to Seed Data
export function resetStorage() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
	return seedData;
}
