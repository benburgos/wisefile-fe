import { seedData } from '$lib/seed';

// Key for Local Storage
const STORAGE_KEY = 'wiseFileData';

// Initialize Data from Local Storage or Seed Data
export function getStoredData() {
	if (typeof localStorage !== 'undefined') {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
	}
	return null;
}

// Save Data to Local Storage
export function saveToLocalStorage(data) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
}

// Reset Local Storage to Seed Data
export function resetStorage() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
	return seedData;
}
