'use client';

export function LogoutButton(): React.ReactNode {
	async function handleLogout(): Promise<void> {
		await fetch('/oauth/logout', { method: 'POST' });
		window.location.reload();
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
		>
			Sign out
		</button>
	);
}
