import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/stores/auth';

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// 🔹 Replace this with your actual authentication logic
		if (email === 'admin@example.com' && password === 'password123') {
			// Store user authentication data
			const userData = {
				isAuthenticated: true,
				user: { email },
				role: 'admin',
				token: 'fake-auth-token'
			};

			// 🔹 Store in the auth store
			auth.set(userData);

			// 🔹 Store authentication in a cookie (for persistence)
			cookies.set('auth', JSON.stringify(userData), {
				path: '/',
				httpOnly: false, // Change to true when using backend authentication
				secure: false, // Change to true for HTTPS
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});

			// Redirect to dashboard
			throw redirect(303, '/dashboard');
		} else {
			return fail(401, { error: 'Invalid email or password' });
		}
	}
};
