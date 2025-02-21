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
				primary: '#C21C19',
				primaryDark: '#9E1714',
				primaryLight: '#E83531',
				background: '#F2F2F2',
				surface: '#FFFFFF',
				border: '#DCDCDC',
				textPrimary: '#000000',
				textSecondary: '#6E6E6E',
				textMuted: '#A1A1A1',
				sidebarBg: '#F2F2F2',
				sidebarHover: '#DCDCDC',
				sidebarActive: '#C21C19',
				sidebarText: '#000000',
				btnPrimary: '#C21C19',
				btnPrimaryHover: '#9E1714',
				btnSecondary: '#6E6E6E',
				btnSecondaryHover: '#4E4E4E',
				tableHeader: '#DCDCDC',
				tableRowHover: '#F2F2F2',
				tableBorder: '#DCDCDC',
				success: '#2E7D32',
				warning: '#F9A825',
				error: '#C21C19',
				info: '#1976D2'
			}
		}
	},
	plugins: [
		skeleton({
			themes: { preset: ['skeleton'] }
		})
	]
};
