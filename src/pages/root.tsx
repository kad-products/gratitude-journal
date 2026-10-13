import type { RequestInfo } from 'rwsdk/worker';
import { LoginForm } from '@/components/LoginForm';
import { LogoutButton } from '@/components/LogoutButton';
import { DefaultLayout } from '@/layouts';
import { getSession } from '@/lib/auth/session';

export default async function Pages__root({ request, ctx }: RequestInfo): Promise<React.JSX.Element> {
	const isLoggedIn = !!ctx.user;
	const session = await getSession(request);

	return (
		<DefaultLayout pageTitle="Welcome" currentBasePage="home">
			<p>
				This is a template repo and not intended to be run for any real purpose. If you're seeing this probably it is not what you
				intended to see.
			</p>

			{isLoggedIn && <div>Welcome {JSON.stringify(ctx.user)}</div>}

			{session ? (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							Signed in as <span className="font-mono">{session.did}</span>
						</p>
						<LogoutButton />
					</div>
					<p className="text-green-600">Authentication working!</p>
				</div>
			) : (
				<LoginForm />
			)}
		</DefaultLayout>
	);
}
