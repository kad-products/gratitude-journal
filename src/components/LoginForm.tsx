'use client';

import { useState } from 'react';

import type { OAuthInitResponse } from '../api/oauth-login';

export function LoginForm(): React.ReactNode {
	const [handle, setHandle] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.SubmitEvent): Promise<void> {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/oauth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ handle }),
			});

			const json = (await res.json()) as { success: boolean; data?: OAuthInitResponse; error?: string };

			if (!res.ok) {
				throw new Error(json.error || 'Login failed');
			}

			// Redirect to authorization server
			const redirectUrl = json.data?.redirectUrl;
			if (redirectUrl) {
				window.location.href = redirectUrl;
			} else {
				throw new Error(`No redirect URL provided`);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Login failed');
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="handle" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
					Handle
				</label>
				<input
					id="handle"
					type="text"
					value={handle}
					onChange={(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setHandle(e.target.value)}
					placeholder="user.example.com"
					className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
					disabled={loading}
				/>
			</div>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				disabled={loading || !handle}
				className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	);
}
