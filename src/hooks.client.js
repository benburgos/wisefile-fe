// src/hooks.client.js
import { initializeLocalStorage } from '$lib/localStorage';
import { seedData } from '$lib/data/seedData';

initializeLocalStorage(seedData);
