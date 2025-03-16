import { seedData } from '$lib/data/seedData';

// Key for Local Storage
const STORAGE_KEY = 'wiseFileData';

// Retrieve data from Local Storage (Ensure Default Data)
export function getStoredData() {
	if (typeof localStorage !== 'undefined') {
		let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
		if (!data || Object.keys(data).length === 0) {
			console.log('No stored data found, saving seed data...');
			saveToLocalStorage(seedData);
			return seedData;
		}
		return data;
	}
	return seedData; // Return default if localStorage is unavailable
}

// Save Data to Local Storage
export function saveToLocalStorage(data) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
}

// Reset Local Storage to Seed Data
export function resetStorage() {
	console.log('Resetting localStorage to seed data...');
	saveToLocalStorage(seedData);
	return seedData;
}
