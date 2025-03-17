// src/lib/localStorage.js

// Fetch all records for a model (with role-based filtering)
export function getAllRecords(model, user = null) {
	let records = JSON.parse(localStorage.getItem(model)) || [];

	if (!user) return records; // No filtering if no user context

	switch (user.role) {
		case 'admin':
			return records; // Admins see everything

		case 'operations':
			return records.filter((record) => record.assigned_operator === user._id);

		case 'client':
			return records.filter((record) => record.client_id === user.company_id);

		case 'attorney':
			return records.filter((record) => record.assigned_attorney === user._id);

		default:
			return []; // Unknown roles get nothing
	}
}

// Fetch a single record by ID (while respecting filtering)
export function getRecordById(model, id, user = null) {
	const records = getAllRecords(model, user);
	return records.find((record) => record._id === id) || null;
}

// Create a new record (any user can create within their permissions)
export function createRecord(model, newData, user = null) {
	let records = getAllRecords(model, user);
	records.push(newData);
	localStorage.setItem(model, JSON.stringify(records));
	return newData;
}

// Update an existing record (within user scope)
export function updateRecord(model, id, updates, user = null) {
	let records = getAllRecords(model, user);
	const index = records.findIndex((record) => record._id === id);
	if (index === -1) return null;

	records[index] = { ...records[index], ...updates, updated_at: new Date() };
	localStorage.setItem(model, JSON.stringify(records));
	return records[index];
}

// Soft delete a record (same role restrictions apply)
export function deleteRecord(model, id, user = null) {
	return updateRecord(model, id, { is_deleted: true, deleted_at: new Date() }, user);
}

// Initialize local storage with seed data
export function initializeLocalStorage(seedData) {
	Object.entries(seedData).forEach(([model, data]) => {
		if (!localStorage.getItem(model)) {
			localStorage.setItem(model, JSON.stringify(data));
		}
	});
}
// Clear local storage (for testing or reset purposes
export function clearLocalStorage() {
    localStorage.clear();
}