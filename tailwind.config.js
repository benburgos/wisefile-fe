// @ts-check
import { join } from 'path';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				primary: '#C21C19', // Red Accent for highlights, buttons
				background: '#F2F2F2', // Light Gray for main background
				border: '#DCDCDC', // Gray for subtle borders
				textPrimary: '#000000', // Black for main text
				textSecondary: '#6E6E6E', // Dark Gray for less important text
				white: '#FFFFFF' // White for contrast
			}
		}
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton'] }
		})
	]
};
