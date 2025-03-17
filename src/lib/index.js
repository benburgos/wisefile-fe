// This file is used to export all the necessary functions and variables from the localStorage.js and auth.js files.
export {
	getAllRecords,
	getRecordById,
	createRecord,
	updateRecord,
	deleteRecord,
	initializeLocalStorage
} from '$lib/localStorage';
export { auth, loginUser, logoutUser } from '$lib/stores/auth';
export { seedData } from '$lib/data/seedData';
