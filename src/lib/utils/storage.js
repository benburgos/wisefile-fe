import { seedData } from '$lib/seed';

// Key for Local Storage
const STORAGE_KEY = 'wiseFileData';

// Initialize Data from Local Storage or Seed Data
export function getStoredData() {
	let storedData = localStorage.getItem(STORAGE_KEY);
	return storedData ? JSON.parse(storedData) : seedData;
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
